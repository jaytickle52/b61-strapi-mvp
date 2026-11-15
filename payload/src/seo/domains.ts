import { headers } from 'next/headers'
import { permanentRedirect } from 'next/navigation'
import { currentSchool } from '@/lib/data'

const bare = (d?: string | null) => (d ?? '').toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim()

/**
 * The address to send this visit to when it came in on one of the school's
 * other domains (www, an old domain): the same page on the school's first
 * domain. Null when the visit is already on the main domain, or on an address
 * that isn't one of the school's domains at all (the demo, previews).
 */
export async function mainDomainUrl(path?: string): Promise<string | null> {
  const [school, h] = await Promise.all([currentSchool(), headers()])
  const domains = (school?.domains ?? []).map((d) => bare(d.domain)).filter(Boolean)
  if (domains.length < 2) return null
  const host = (h.get('x-forwarded-host') ?? h.get('host') ?? '').split(',')[0].trim().split(':')[0].toLowerCase()
  if (!host || host === domains[0] || !domains.includes(host)) return null
  const p = path ?? h.get('x-b61-path') ?? '/'
  return `https://${domains[0]}${p.startsWith('/') ? p : `/${p}`}`
}

/** In a page or layout: a permanent redirect to the main domain when needed. */
export async function redirectToMainDomain() {
  const to = await mainDomainUrl()
  if (to) permanentRedirect(to)
}

/** In a route handler (robots.txt, sitemap.xml...): the redirect response, or null. */
export async function mainDomainResponse(path: string): Promise<Response | null> {
  const to = await mainDomainUrl(path)
  return to ? new Response(null, { status: 308, headers: { Location: to } }) : null
}
