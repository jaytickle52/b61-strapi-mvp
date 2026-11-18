import { lookup as dnsLookup, type LookupAddress } from 'node:dns'
import https from 'node:https'
import { BlockList, isIP } from 'node:net'
import type { PayloadRequest } from 'payload'
import { z } from 'zod/v3'
import { canUseSchool, idOf } from '../access'

/*
 * uploadPhoto: adds a photo to a school's photo library from a web address,
 * so Claude can place a school's own photos (or licensed stock) while building
 * its site. Payload's MCP tools can't upload files, so this fetches the image
 * on the server.
 *
 * Safety, because the server fetches an address it's given:
 * - https only, and only to public addresses: every connection, including
 *   each redirect, is checked against private, loopback and link-local ranges
 *   at connect time (so a name that changes address mid-request can't slip through);
 * - at most 3 redirects, 25 MB and 30 seconds;
 * - only JPEG, PNG, WebP, GIF or AVIF; the photo then goes through the normal
 *   Media rules (resizing, alt text, the school's own library).
 */

type Out = { content: { type: 'text'; text: string }[] }
const text = (t: string): Out => ({ content: [{ type: 'text', text: t }] })

export const MAX_BYTES = 25 * 1024 * 1024
const TIMEOUT_MS = 30_000
const MAX_REDIRECTS = 3
const TYPES: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'image/avif': 'avif' }

const blocked = new BlockList()
for (const [net, bits] of [
  ['0.0.0.0', 8], ['10.0.0.0', 8], ['100.64.0.0', 10], ['127.0.0.0', 8], ['169.254.0.0', 16], ['172.16.0.0', 12],
  ['192.0.0.0', 24], ['192.168.0.0', 16], ['198.18.0.0', 15], ['224.0.0.0', 4], ['240.0.0.0', 4],
] as [string, number][]) blocked.addSubnet(net, bits, 'ipv4')
for (const [net, bits] of [['::', 128], ['::1', 128], ['fc00::', 7], ['fe80::', 10], ['ff00::', 8]] as [string, number][])
  blocked.addSubnet(net, bits, 'ipv6')

/** True for an address the server must never fetch from. */
export function isPrivateAddress(address: string): boolean {
  // An IPv4 address written as IPv6 (::ffff:10.0.0.1) is judged as the IPv4 address.
  const mapped = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/i.exec(address)
  if (mapped) return isPrivateAddress(mapped[1])
  // NAT64 (64:ff9b::/96) and other IPv6 forms of IPv4 are refused outright.
  if (/^64:ff9b:/i.test(address) || /^::ffff:/i.test(address)) return true
  const family = isIP(address)
  if (!family) return true
  return blocked.check(address, family === 6 ? 'ipv6' : 'ipv4')
}

/** A DNS lookup that refuses private addresses, used for every connection. */
const safeLookup: typeof dnsLookup = ((hostname: string, options: any, callback: any) => {
  const cb = typeof options === 'function' ? options : callback
  const opts = typeof options === 'function' ? {} : options
  dnsLookup(hostname, { ...opts, all: true }, (err, addresses) => {
    if (err) return cb(err)
    const list = addresses as unknown as LookupAddress[]
    const bad = list.find((a) => isPrivateAddress(a.address))
    if (bad || !list.length) return cb(Object.assign(new Error(`${hostname} isn't a public address`), { code: 'EBLOCKED' }))
    if (opts.all) cb(null, list)
    else cb(null, list[0].address, list[0].family)
  })
}) as any

/** Checks the address itself before any network call (https, no literal private IPs, no credentials). */
export function checkPhotoUrl(raw: string): URL {
  let url: URL
  try {
    url = new URL(raw)
  } catch {
    throw new Error('That isn’t a web address.')
  }
  if (url.protocol !== 'https:') throw new Error('Only https:// addresses can be fetched.')
  if (url.username || url.password) throw new Error('Addresses with a username or password can’t be fetched.')
  const host = url.hostname.replace(/^\[|\]$/g, '')
  if (isIP(host) && isPrivateAddress(host)) throw new Error('That address isn’t public.')
  if (/^(localhost|.*\.local|.*\.internal)$/i.test(host)) throw new Error('That address isn’t public.')
  return url
}

function getOnce(url: URL, deadline: number): Promise<{ status: number; location?: string; type: string; body?: Buffer }> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { lookup: safeLookup, timeout: Math.max(1, deadline - Date.now()), headers: { accept: 'image/*', 'user-agent': 'Banner61-Schools/1.0' } }, (res) => {
      const status = res.statusCode ?? 0
      const type = String(res.headers['content-type'] ?? '').split(';')[0].trim().toLowerCase()
      if (status >= 300 && status < 400) {
        res.resume()
        return resolve({ status, location: res.headers.location, type })
      }
      if (status !== 200) {
        res.resume()
        return reject(new Error(`The address answered ${status}.`))
      }
      if (!TYPES[type]) {
        res.resume()
        return reject(new Error(`That isn’t a photo (${type || 'unknown type'}). JPEG, PNG, WebP, GIF or AVIF only.`))
      }
      const declared = Number(res.headers['content-length'] ?? 0)
      if (declared > MAX_BYTES) {
        res.destroy()
        return reject(new Error('That photo is over 25 MB.'))
      }
      const chunks: Buffer[] = []
      let size = 0
      res.on('data', (c: Buffer) => {
        size += c.length
        if (size > MAX_BYTES) {
          res.destroy()
          reject(new Error('That photo is over 25 MB.'))
        } else chunks.push(c)
      })
      res.on('end', () => resolve({ status, type, body: Buffer.concat(chunks) }))
      res.on('error', reject)
    })
    req.on('timeout', () => req.destroy(new Error('The photo took too long to download.')))
    req.on('error', (e: any) => reject(e?.code === 'EBLOCKED' ? new Error('That address isn’t public.') : e))
  })
}

/** Downloads a photo from a public https address, following up to 3 redirects. */
export async function fetchPhoto(raw: string): Promise<{ data: Buffer; mimetype: string; name: string }> {
  let url = checkPhotoUrl(raw)
  const deadline = Date.now() + TIMEOUT_MS
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const r = await getOnce(url, deadline)
    if (r.location) {
      if (hop === MAX_REDIRECTS) throw new Error('Too many redirects.')
      url = checkPhotoUrl(new URL(r.location, url).toString())
      continue
    }
    const base = decodeURIComponent(url.pathname.split('/').pop() || 'photo').replace(/\.[a-z0-9]+$/i, '').replace(/[^a-zA-Z0-9-_]+/g, '-').slice(0, 60) || 'photo'
    return { data: r.body!, mimetype: r.type, name: `${base}.${TYPES[r.type]}` }
  }
  throw new Error('Too many redirects.')
}

export const uploadPhoto = {
  name: 'uploadPhoto',
  description:
    "Add a photo to a school's photo library from a public https address (a school's shared photo, or a licensed stock photo's download link). Give `school` (id), `url` and `alt` (what the photo shows, one sentence); `credit` and `caption` are optional. Returns the new photo's id, to use as `image` in page sections.",
  parameters: {
    school: z.union([z.string(), z.number()]),
    url: z.string(),
    alt: z.string(),
    credit: z.string().optional(),
    caption: z.string().optional(),
  } as any,
  handler: async (args: Record<string, unknown>, req: PayloadRequest): Promise<Out> => {
    try {
      const school = idOf(args.school)
      if (school == null) return text('Give the school id.')
      if (!canUseSchool(req.user, school)) return text('You don’t have access to that school.')
      const alt = String(args.alt ?? '').trim()
      if (!alt) return text('Give alt text: what the photo shows, in one sentence.')
      const file = await fetchPhoto(String(args.url ?? ''))
      const doc: any = await (req.payload.create as any)({
        collection: 'media',
        data: {
          school,
          alt: alt.slice(0, 300),
          ...(args.credit ? { credit: String(args.credit).slice(0, 200) } : {}),
          ...(args.caption ? { caption: String(args.caption).slice(0, 300) } : {}),
        },
        file: { data: file.data, mimetype: file.mimetype, name: file.name, size: file.data.length },
        depth: 0,
        overrideAccess: false,
        user: req.user,
        req,
      })
      return text(`Photo added: id ${doc.id} (${doc.filename}${doc.width ? `, ${doc.width}×${doc.height}` : ''}). Use it as "image": ${doc.id} in a section.`)
    } catch (e: any) {
      return text(`Couldn't add the photo: ${e?.message ?? e}`)
    }
  },
}
