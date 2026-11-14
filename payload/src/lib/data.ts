import { cache } from 'react'
import { draftMode, headers } from 'next/headers'
import { getPayload, type Where } from 'payload'
import config from '@payload-config'
import type { Event, Media, News, Page, Program, SchoolSetting, Staff } from '@/payload-types'

export type { Event, Media, News, Page, Program, SchoolSetting, Staff }
export type Audience = 'public' | 'parents'

export const payloadClient = () => getPayload({ config })

/**
 * Who is reading. Visitors get published content only, through the same access
 * rules the API enforces. An editor in preview (signed in to the admin, which
 * lives on this same site) gets drafts, so the live preview shows every keystroke.
 */
const reader = cache(async () => {
  const payload = await payloadClient()
  const { isEnabled } = await draftMode()
  if (!isEnabled) return { payload, user: null, draft: false }
  const { user } = await payload.auth({ headers: await headers() })
  return { payload, user, draft: Boolean(user) }
})

export const isPreview = async () => (await reader()).draft

async function find<T>(collection: 'pages' | 'events' | 'news' | 'programs' | 'staff', opts: { where?: Where; sort?: string; limit?: number; depth?: number } = {}) {
  const { payload, user, draft } = await reader()
  const res = await payload.find({
    collection,
    where: opts.where,
    sort: opts.sort,
    limit: opts.limit ?? 50,
    depth: opts.depth ?? 1,
    draft,
    user,
    overrideAccess: false,
  })
  return res.docs as T[]
}

export const getSettings = cache(async (): Promise<Partial<SchoolSetting> & { schoolName: string }> => {
  const { payload, user, draft } = await reader()
  const s = await payload.findGlobal({ slug: 'school-settings', depth: 1, draft, user, overrideAccess: false })
  return { ...s, schoolName: s?.schoolName || 'Our School' }
})

export async function getPage(slug: string) {
  const docs = await find<Page>('pages', { where: { slug: { equals: slug } }, limit: 1, depth: 2 })
  return docs[0] ?? null
}

const upcoming: Where = { startsAt: { greater_than_equal: new Date(Date.now() - 6 * 3600 * 1000).toISOString() } }

export const getEvents = (opts: { limit?: number } = {}) =>
  find<Event>('events', { where: { and: [{ audience: { equals: 'public' } }, upcoming] }, sort: 'startsAt', limit: opts.limit })

export async function getEvent(slug: string) {
  const docs = await find<Event>('events', { where: { slug: { equals: slug }, audience: { equals: 'public' } }, limit: 1 })
  return docs[0] ?? null
}

export const getNews = (opts: { limit?: number } = {}) =>
  find<News>('news', { where: { audience: { equals: 'public' } }, sort: '-date', limit: opts.limit })

export async function getNewsPost(slug: string) {
  const docs = await find<News>('news', { where: { slug: { equals: slug }, audience: { equals: 'public' } }, limit: 1 })
  return docs[0] ?? null
}

export const getPrograms = (limit = 50) => find<Program>('programs', { sort: 'sortOrder', limit })

export async function getProgram(slug: string) {
  const docs = await find<Program>('programs', { where: { slug: { equals: slug } }, limit: 1 })
  return docs[0] ?? null
}

export const getStaff = (limit = 100) => find<Staff>('staff', { sort: 'sortOrder', limit })

/**
 * The parent feed: public and parents-only items together. Parents-only items are
 * blocked for anonymous readers by the access rules, so this reads them server-side,
 * only after the page has checked the parent password.
 */
export async function getParentFeed() {
  const { payload, draft } = await reader()
  const base: Where = draft ? {} : { _status: { equals: 'published' } }
  const [events, news] = await Promise.all([
    payload.find({ collection: 'events', where: { and: [base, upcoming] }, sort: 'startsAt', limit: 20, draft, overrideAccess: true }),
    payload.find({ collection: 'news', where: base, sort: '-date', limit: 20, draft, overrideAccess: true }),
  ])
  return { events: events.docs, news: news.docs }
}

/** An uploaded image as a URL (uploads are served by this same site). */
export function mediaUrl(media: number | Media | null | undefined, size?: 'card' | 'hero'): string | null {
  if (!media || typeof media === 'number') return null
  return (size && media.sizes?.[size]?.url) || media.url || null
}

export function formatDate(iso: string, opts: { withTime?: boolean } = {}) {
  const d = new Date(iso)
  const tz = process.env.SCHOOL_TIMEZONE || 'America/New_York'
  const date = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: tz })
  if (!opts.withTime) return date
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: tz })
  return `${date} · ${time}`
}
