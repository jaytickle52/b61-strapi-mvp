import { cache } from 'react'
import { cookies, draftMode, headers } from 'next/headers'
import { unstable_cache } from 'next/cache'
import { getPayload, type Where } from 'payload'
import config from '@payload-config'
import { ymd } from '@/events/time'
import { CACHE_SECONDS, CACHE_VERSION, quarterHour, SCHOOLS_TAG, schoolTag } from '@/cache/tags'
import { twoFactorPending } from '@/users/two-factor-rules'
import type { Announcement, Event, Media, News, NewsCategory, Page, Program, School, SchoolSetting, Staff } from '@/payload-types'

export type { Announcement, Event, Media, News, NewsCategory, Page, Program, School, SchoolSetting, Staff }
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
  const { user: signedIn } = await payload.auth({ headers: await headers() })
  // A session still owing its two-factor code counts as signed out.
  const user = signedIn && !twoFactorPending(signedIn) ? signedIn : null
  return { payload, user, draft: Boolean(user) }
})

export const isPreview = async () => (await reader()).draft

/** The cookie that picks a school on an address that isn't any school's own domain (the demo URL). */
export const SCHOOL_COOKIE = 'b61-school'

/**
 * Which school this request is for:
 * 1. the web address, when it is one of a school's Domains (real sites);
 * 2. otherwise the school picked with /next/school/<slug> or by the admin's preview;
 * 3. otherwise DEFAULT_SCHOOL, or the first school.
 */
export const currentSchool = cache(async (): Promise<School | null> => {
  const h = await headers()
  const host = (h.get('x-forwarded-host') ?? h.get('host') ?? '').split(',')[0].trim().split(':')[0].toLowerCase()
  const picked = (await cookies()).get(SCHOOL_COOKIE)?.value ?? ''
  return lookupSchool(host, picked)
})

/** The school for an address and picker cookie. Cached; cleared when any school changes (src/cache). */
const lookupSchool = unstable_cache(
  async (host: string, picked: string): Promise<School | null> => {
    const payload = await payloadClient()
    const one = async (where: Where) =>
      (await payload.find({ collection: 'schools', where, limit: 1, depth: 0, overrideAccess: true })).docs[0] ?? null
    if (host) {
      const byHost = await one({ 'domains.domain': { equals: host } })
      if (byHost) return byHost
    }
    if (picked) {
      const bySlug = await one(/^\d+$/.test(picked) ? { id: { equals: Number(picked) } } : { slug: { equals: picked } })
      if (bySlug) return bySlug
    }
    if (process.env.DEFAULT_SCHOOL) {
      const fallback = await one({ slug: { equals: process.env.DEFAULT_SCHOOL } })
      if (fallback) return fallback
    }
    return (await payload.find({ collection: 'schools', sort: 'createdAt', limit: 1, depth: 0, overrideAccess: true })).docs[0] ?? null
  },
  ['current-school', CACHE_VERSION],
  { tags: [SCHOOLS_TAG], revalidate: CACHE_SECONDS },
)

/** Adds "this school only" to a query. */
const scoped = async (where?: Where): Promise<Where> => {
  const school = await currentSchool()
  const mine: Where = { school: { equals: school?.id ?? -1 } }
  return where ? { and: [mine, where] } : mine
}

type SiteCollection = 'pages' | 'events' | 'news' | 'news-categories' | 'programs' | 'staff' | 'announcements' | 'school-settings'
type FindOpts = { where?: Where; sort?: string; limit?: number; depth?: number; page?: number }
type Found<T> = { docs: T[]; page: number; totalPages: number; totalDocs: number }

async function query<T>(collection: SiteCollection, schoolId: number | string, opts: FindOpts, draft: boolean, user: any): Promise<Found<T>> {
  const payload = await payloadClient()
  const mine: Where = { school: { equals: schoolId } }
  const res = await payload.find({
    collection,
    where: opts.where ? { and: [mine, opts.where] } : mine,
    sort: opts.sort,
    limit: opts.limit ?? 50,
    page: opts.page,
    depth: opts.depth ?? 1,
    draft,
    user,
    overrideAccess: false,
  })
  return { docs: res.docs as T[], page: res.page ?? 1, totalPages: res.totalPages ?? 1, totalDocs: res.totalDocs ?? res.docs.length }
}

/**
 * This school's content. Visitors' reads are cached per school (Thread H) so
 * a page view doesn't query the database each time; staff edits clear it
 * (src/cache/plugin.ts). An editor's preview always reads live, with drafts.
 */
async function findPage<T>(collection: SiteCollection, opts: FindOpts = {}): Promise<Found<T>> {
  const [{ user, draft }, school] = await Promise.all([reader(), currentSchool()])
  const schoolId = school?.id ?? -1
  if (draft) return query<T>(collection, schoolId, opts, true, user)
  return unstable_cache(
    () => query<T>(collection, schoolId, opts, false, null),
    [CACHE_VERSION, 'find', collection, String(schoolId), JSON.stringify(opts)],
    { tags: [schoolTag(schoolId)], revalidate: CACHE_SECONDS },
  )()
}

async function find<T>(collection: SiteCollection, opts: FindOpts = {}): Promise<T[]> {
  return (await findPage<T>(collection, opts)).docs
}

export const getSettings = cache(async (): Promise<Partial<SchoolSetting> & { schoolName: string }> => {
  const [docs, school] = await Promise.all([find<SchoolSetting>('school-settings', { limit: 1, depth: 1 }), currentSchool()])
  const s = docs[0]
  return { ...(s ?? {}), schoolName: s?.schoolName || school?.name || 'Our School' }
})

export async function getPage(slug: string) {
  const docs = await find<Page>('pages', { where: { slug: { equals: slug } }, limit: 1, depth: 2 })
  return docs[0] ?? null
}

// Not over yet: starts later today or after, or is still going (multi-day).
// "Now" is rounded to 15 minutes so the cached list is reused (an event may show up to 15 minutes after it ends).
const upcomingWhere = (): Where => {
  const now = quarterHour().getTime()
  const since = new Date(now - 6 * 3600 * 1000).toISOString()
  return { or: [{ startsAt: { greater_than_equal: since } }, { endsAt: { greater_than_equal: new Date(now).toISOString() } }] }
}

export const getEvents = (opts: { limit?: number } = {}) =>
  find<Event>('events', { where: { and: [{ audience: { equals: 'public' } }, upcomingWhere()] }, sort: 'startsAt', limit: opts.limit })

/** Public events that touch the period from `from` to `to` (a month calendar). */
export const getEventsBetween = (from: Date, to: Date) =>
  find<Event>('events', {
    where: {
      and: [
        { audience: { equals: 'public' } },
        { startsAt: { less_than: to.toISOString() } },
        { or: [{ startsAt: { greater_than_equal: from.toISOString() } }, { endsAt: { greater_than_equal: from.toISOString() } }] },
      ],
    },
    sort: 'startsAt',
    limit: 500,
    depth: 1,
  })

export async function getEvent(slug: string) {
  const docs = await find<Event>('events', { where: { slug: { equals: slug }, audience: { equals: 'public' } }, limit: 1 })
  return docs[0] ?? null
}

const newsWhere = (category?: number | string): Where => ({
  and: [{ audience: { equals: 'public' } }, ...(category ? [{ categories: { in: [category] } }] : [])],
})

export const getNews = (opts: { limit?: number; category?: number | string } = {}) =>
  find<News>('news', { where: newsWhere(opts.category), sort: '-date', limit: opts.limit })

/** How many news posts the News page lists per page. */
export const NEWS_PER_PAGE = 20

/** One page of public news (newest first), with the page count, for the News page's Previous / Next links. */
export const getNewsPage = (opts: { page?: number; category?: number | string } = {}) =>
  findPage<News>('news', { where: newsWhere(opts.category), sort: '-date', limit: NEWS_PER_PAGE, page: Math.max(1, opts.page ?? 1) })

/** This school's news categories, in the order staff dragged them. */
export const getNewsCategories = cache(() => find<NewsCategory>('news-categories', { sort: '_order', limit: 50, depth: 0 }))

export async function getNewsPost(slug: string) {
  const docs = await find<News>('news', { where: { slug: { equals: slug }, audience: { equals: 'public' } }, limit: 1 })
  return docs[0] ?? null
}

export const getPrograms = (limit = 50) => find<Program>('programs', { sort: '_order', limit })

export async function getProgram(slug: string) {
  const docs = await find<Program>('programs', { where: { slug: { equals: slug } }, limit: 1 })
  return docs[0] ?? null
}

export const getStaff = (limit = 100) => find<Staff>('staff', { sort: '_order', limit })

/** Announcements showing right now: started, not yet ended. Urgent ones first. */
export const getAnnouncements = cache(async () => {
  // The query uses 15-minute steps so it can be cached; the exact Show from /
  // Hide after times are checked here, on every visit.
  const step = quarterHour().getTime()
  const docs = await find<Announcement>('announcements', {
    where: {
      and: [
        { startsAt: { less_than_equal: new Date(step + 900_000).toISOString() } },
        { or: [{ endsAt: { exists: false } }, { endsAt: { greater_than: new Date(step).toISOString() } }] },
      ],
    },
    sort: '-startsAt',
    limit: 20,
    depth: 1,
  })
  const now = Date.now()
  const showing = docs.filter((a) => new Date(a.startsAt).getTime() <= now && (!a.endsAt || new Date(a.endsAt).getTime() > now))
  const rank = { urgent: 0, celebrate: 1, standard: 2 } as Record<string, number>
  return showing.sort((a, b) => (rank[a.style] ?? 2) - (rank[b.style] ?? 2)).slice(0, 3)
})

/**
 * The parent feed: public and parents-only items together. Parents-only items are
 * blocked for anonymous readers by the access rules, so this reads them server-side,
 * only after the page has checked the parent password.
 */
export async function getParentFeed() {
  const { payload, draft } = await reader()
  const base: Where = draft ? {} : { _status: { equals: 'published' } }
  const [events, news] = await Promise.all([
    payload.find({ collection: 'events', where: await scoped({ and: [base, upcomingWhere()] }), sort: 'startsAt', limit: 20, draft, overrideAccess: true }),
    payload.find({ collection: 'news', where: await scoped(base), sort: '-date', limit: 20, draft, overrideAccess: true }),
  ])
  return { events: events.docs, news: news.docs }
}

/** An uploaded image as a URL (uploads are served by this same site). */
/** This school's parent feed password (server side only; never sent to the browser). */
export async function getParentPassword(): Promise<string | null> {
  const payload = await payloadClient()
  const res = await payload.find({ collection: 'school-settings', where: await scoped(), limit: 1, depth: 0, overrideAccess: true })
  return (res.docs[0] as any)?.parentPassword || process.env.PARENT_PASSWORD || null
}

export function mediaUrl(media: number | Media | null | undefined, size?: 'thumbnail' | 'card' | 'wide' | 'hero' | 'social'): string | null {
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

/**
 * When an event happens, in words: "Fri, Nov 14 · 6:00 PM – 8:00 PM",
 * "Fri, Nov 14 (all day)", "Mon, Dec 21 – Fri, Jan 1".
 */
export function eventWhen(e: Pick<Event, 'startsAt' | 'endsAt' | 'allDay'>): string {
  const tz = process.env.SCHOOL_TIMEZONE || 'America/New_York'
  const day = (iso: string) => formatDate(iso)
  const time = (iso: string) => new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: tz })
  const sameDay = (a: string, b: string) => ymd(a, tz) === ymd(b, tz)
  if (e.allDay) {
    if (!e.endsAt || sameDay(e.startsAt, e.endsAt)) return `${day(e.startsAt)} (all day)`
    return `${day(e.startsAt)} – ${day(e.endsAt)}`
  }
  if (!e.endsAt) return formatDate(e.startsAt, { withTime: true })
  if (sameDay(e.startsAt, e.endsAt)) return `${formatDate(e.startsAt, { withTime: true })} – ${time(e.endsAt)}`
  return `${formatDate(e.startsAt, { withTime: true })} – ${formatDate(e.endsAt, { withTime: true })}`
}

/**
 * The address this school's pages should be known by: its first domain, or
 * (no domain yet) the address this request came in on.
 */
export async function siteOrigin(): Promise<string> {
  const school = await currentSchool()
  const own = school?.domains?.[0]?.domain
  if (own) return `https://${own.replace(/^https?:\/\//, '').replace(/\/+$/, '')}`
  const h = await headers()
  const host = (h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost').split(',')[0].trim()
  const proto = (h.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https')).split(',')[0].trim()
  return `${proto}://${host}`
}

/** True when search engines should stay away: the school says so, or this is a demo/preview address. */
export async function hiddenFromSearch(): Promise<boolean> {
  const [settings, school] = await Promise.all([getSettings(), currentSchool()])
  if ((settings as any).hideFromSearch) return true
  const h = await headers()
  const host = (h.get('x-forwarded-host') ?? h.get('host') ?? '').split(',')[0].trim().split(':')[0]
  const ownDomains = (school?.domains ?? []).map((d) => d.domain?.toLowerCase())
  if (ownDomains.includes(host.toLowerCase())) return false
  return /(\.vercel\.app|\.railway\.app|^localhost|^127\.)/.test(host) || ownDomains.length === 0
}

/** A redirect this school set up for an old address, if any. Cached (every missing page checks it). */
export async function findRedirect(path: string): Promise<{ to: string; permanent: boolean } | null> {
  const schoolId = (await currentSchool())?.id ?? -1
  return unstable_cache(
    async () => {
      const payload = await payloadClient()
      const res = await payload.find({
        collection: 'redirects',
        where: { and: [{ school: { equals: schoolId } }, { from: { equals: path } }] },
        limit: 1,
        depth: 1,
        overrideAccess: true,
      })
      const r: any = res.docs[0]
      if (!r) return null
      let to: string | null = null
      if (r.to?.type === 'custom') to = r.to.url || null
      else if (r.to?.reference?.value && typeof r.to.reference.value === 'object') {
        const { pathFor } = await import('@/seo/config')
        to = pathFor(r.to.reference.relationTo, r.to.reference.value)
      }
      return to ? { to, permanent: r.type !== '302' } : null
    },
    [CACHE_VERSION, 'redirect', String(schoolId), path],
    { tags: [schoolTag(schoolId)], revalidate: CACHE_SECONDS },
  )()
}

/** Site search: this school's published pages, programs, events and news. */
export async function searchSite(q: string, limit = 30) {
  const term = q.trim().slice(0, 100)
  if (term.length < 2) return []
  const payload = await payloadClient()
  const words = term.split(/\s+/).filter((w) => w.length > 1).slice(0, 6)
  const res = await payload.find({
    collection: 'search',
    where: await scoped({
      and: words.map((w): Where => ({ or: [{ title: { like: w } }, { text: { like: w } }] as Where[] })),
    }),
    sort: 'priority',
    limit,
    depth: 0,
    overrideAccess: true,
  })
  const t = term.toLowerCase()
  // Title matches first, then the plugin's priority (pages, programs, events, news).
  return (res.docs as any[]).sort((a, b) => Number(!String(a.title).toLowerCase().includes(t)) - Number(!String(b.title).toLowerCase().includes(t)))
}

/** This school's subscribe feed address (with ?school= on a shared demo address). */
export async function calendarFeedUrl(): Promise<string> {
  const [origin, school] = await Promise.all([siteOrigin(), currentSchool()])
  const own = (school?.domains ?? []).length > 0
  return `${origin}/calendar.ics${!own && school?.slug ? `?school=${encodeURIComponent(school.slug)}` : ''}`
}
