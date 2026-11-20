/*
 * Where an announcement stands, in words school staff use (20 Nov 2026).
 * Shared by the Status column in the list, the status note in the editor and
 * the dashboard. No database reads here: callers pass what they have.
 */

export type NoticeState = 'draft' | 'scheduled' | 'showing' | 'ended'

/** Showing this long with no "Hide after" earns a "Still needed?" nudge. */
export const STALE_DAYS = 30

const DAY = 86_400_000
const time = (v: unknown) => (v ? new Date(v as string).getTime() : NaN)

/** Draft (never published), Scheduled, Showing now or Ended. */
export function noticeState(a: { published: boolean; startsAt?: unknown; endsAt?: unknown }, now = Date.now()): NoticeState {
  if (!a.published) return 'draft'
  const start = time(a.startsAt)
  const end = time(a.endsAt)
  if (!Number.isNaN(end) && end <= now) return 'ended'
  if (!Number.isNaN(start) && start > now) return 'scheduled'
  return 'showing'
}

/** Days it has been showing with no end date, when that's past STALE_DAYS; else null. */
export function staleDays(a: { startsAt?: unknown; endsAt?: unknown }, now = Date.now()): number | null {
  if (a.endsAt) return null
  const start = time(a.startsAt)
  if (Number.isNaN(start)) return null
  const days = Math.floor((now - start) / DAY)
  return days >= STALE_DAYS ? days : null
}

/** "Nov 3" this year, "Nov 3, 2027" otherwise; with a time when asked. */
export function shortDate(v: unknown, withTime = false): string {
  const d = new Date(v as string)
  if (Number.isNaN(d.getTime())) return ''
  const sameYear = d.getFullYear() === new Date().getFullYear()
  const day = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', ...(sameYear ? {} : { year: 'numeric' }) })
  return withTime ? `${day}, ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}` : day
}

/** The short label for the list's Status column. */
export function stateLabel(state: NoticeState, a: { startsAt?: unknown; endsAt?: unknown }): string {
  if (state === 'draft') return 'Draft'
  if (state === 'scheduled') return `Starts ${shortDate(a.startsAt)}`
  if (state === 'ended') return `Ended ${shortDate(a.endsAt)}`
  return a.endsAt ? `Showing until ${shortDate(a.endsAt)}` : 'Showing now'
}

/** The end of tomorrow, local time: the suggested "Hide after" for an urgent message. */
export function endOfTomorrow(now = new Date()): Date {
  const d = new Date(now)
  d.setDate(d.getDate() + 1)
  d.setHours(23, 59, 0, 0)
  return d
}

/* Which announcement wins where two compete: the site's own order (lib/data.ts getAnnouncements). */
const RANK: Record<string, number> = { urgent: 0, celebrate: 1, standard: 2 }
type Placed = { id?: unknown; style?: string | null; startsAt?: unknown; showOn?: string | null; pages?: unknown[] | null }

/** Whether `a` comes before `b` on the site (Urgent, then Celebration, then Standard; then the later start). */
export function outranks(a: Placed, b: Placed): boolean {
  const r = (RANK[a.style ?? 'standard'] ?? 2) - (RANK[b.style ?? 'standard'] ?? 2)
  if (r !== 0) return r < 0
  return time(a.startsAt) > time(b.startsAt)
}

const pageIds = (p: Placed) => new Set((p.pages ?? []).map((x: any) => String(x && typeof x === 'object' ? x.id : x)))

/** Whether two announcements can appear on the same page. */
export function sharePages(a: Placed, b: Placed): boolean {
  const sa = a.showOn ?? 'all'
  const sb = b.showOn ?? 'all'
  if (sa === 'all' || sb === 'all') return true
  if (sa === 'home' && sb === 'home') return true
  if (sa === 'pages' && sb === 'pages') {
    const ids = pageIds(b)
    return [...pageIds(a)].some((id) => ids.has(id))
  }
  // Home page only vs chosen pages: the chosen pages may include the home page;
  // the caller can't tell cheaply, so treat it as possible.
  return true
}

/** Whether two time windows overlap (an empty end runs forever). */
export function overlap(a: { startsAt?: unknown; endsAt?: unknown }, b: { startsAt?: unknown; endsAt?: unknown }): boolean {
  const aStart = time(a.startsAt) || 0
  const bStart = time(b.startsAt) || 0
  const aEnd = a.endsAt ? time(a.endsAt) : Infinity
  const bEnd = b.endsAt ? time(b.endsAt) : Infinity
  return aStart < bEnd && bStart < aEnd
}
