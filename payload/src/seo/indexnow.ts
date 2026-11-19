import { createHash } from 'node:crypto'
import { after } from 'next/server'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, Config, Payload, Plugin } from 'payload'
import { pathFor } from './config'

/*
 * IndexNow: when a page, event or news post is published (or a live
 * one is saved again) or deleted, tell Bing (and the other IndexNow search engines) right away, so the
 * change shows up in search, and in Microsoft Copilot, within minutes instead of
 * at the next crawl.
 *
 * Only on the live site (VERCEL_ENV=production, or INDEXNOW_ENABLED=true for a
 * test), only for a school with its own domain that isn't hidden from search.
 * Each school's key is made from SCHOOL_SECRET and is served at /indexnow.txt.
 * INDEXNOW_ENDPOINT overrides where pings go (the CI test points it at itself).
 */

const COLLECTIONS = ['pages', 'news', 'events']
const ENDPOINT = () => process.env.INDEXNOW_ENDPOINT || 'https://api.indexnow.org/indexnow'
const enabled = () => process.env.INDEXNOW_ENABLED === 'true' || process.env.VERCEL_ENV === 'production'

/** The school's IndexNow key: 32 hex characters, stable, not guessable. */
export function indexNowKey(schoolId: number | string): string {
  return createHash('sha256').update(`indexnow:${process.env.SCHOOL_SECRET ?? ''}:${schoolId}`).digest('hex').slice(0, 32)
}

const idOf = (v: unknown) => (v && typeof v === 'object' ? (v as { id?: number | string }).id : (v as number | string | undefined))
const host = (d?: string | null) => (d ?? '').toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim()

async function ping(payload: Payload, collection: string, doc: any) {
  if (!enabled()) return
  const schoolId = idOf(doc?.school)
  if (schoolId == null || !doc?.slug) return
  // Parents-only events and news never appear on the public site.
  if ((collection === 'news' || collection === 'events') && doc.audience && doc.audience !== 'public') return
  const school: any = await payload.findByID({ collection: 'schools', id: schoolId, depth: 0, overrideAccess: true }).catch(() => null)
  const domain = host(school?.domains?.[0]?.domain)
  if (!domain) return
  const settings: any = (
    await payload.find({ collection: 'school-settings', where: { school: { equals: schoolId } }, limit: 1, depth: 0, overrideAccess: true, select: { hideFromSearch: true } as any })
  ).docs[0]
  if (settings?.hideFromSearch) return
  const url = `https://${domain}${pathFor(collection, doc)}`
  const body = { host: domain, key: indexNowKey(schoolId), keyLocation: `https://${domain}/indexnow.txt`, urlList: [url] }
  try {
    const res = await fetch(ENDPOINT(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok && res.status !== 202) payload.logger.warn(`[indexnow] ${url}: ${res.status}`)
  } catch (e: any) {
    payload.logger.warn(`[indexnow] ${url}: ${e?.message ?? e}`)
  }
}

/** Runs the ping once the save's reply has gone out (Next's after()); outside a request (seed, scripts), straight away. */
function later(payload: Payload, collection: string, doc: any) {
  try {
    after(() => ping(payload, collection, doc))
  } catch {
    void ping(payload, collection, doc)
  }
}

const afterChange: CollectionAfterChangeHook = ({ collection, doc, previousDoc, req, context }) => {
  // Not from inside a database migration: it may still roll back.
  if ((context as any)?.b61Migration) return doc
  // Only a real publish (or a save of a published item). Draft saves and autosaves
  // never ping, even on a page that is already live.
  if (doc?._status !== 'published') return doc
  later(req.payload, collection.slug, doc)
  // A moved page: the old address is worth a re-check too.
  if (previousDoc?._status === 'published' && previousDoc?.slug && previousDoc.slug !== doc.slug) later(req.payload, collection.slug, previousDoc)
  return doc
}

const afterDelete: CollectionAfterDeleteHook = ({ collection, doc, req }) => {
  if (doc?._status !== 'draft') later(req.payload, collection.slug, doc)
  return doc
}

export const indexNow: Plugin = (config: Config): Config => ({
  ...config,
  collections: (config.collections ?? []).map((c) =>
    COLLECTIONS.includes(c.slug)
      ? {
          ...c,
          hooks: {
            ...c.hooks,
            afterChange: [...(c.hooks?.afterChange ?? []), afterChange],
            afterDelete: [...(c.hooks?.afterDelete ?? []), afterDelete],
          },
        }
      : c,
  ),
})
