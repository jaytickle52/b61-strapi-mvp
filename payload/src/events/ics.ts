import { addDays, schoolTz, ymd } from './time'

/*
 * Writes events as an ICS (iCalendar) file: the subscribe feed that Google,
 * Apple and Outlook calendars poll, and each event's "Add to calendar" file.
 * Timed events are written in UTC so every calendar app agrees; all-day
 * events as dates, on the school's day.
 */

export type IcsEvent = {
  id: number | string
  slug?: string | null
  title: string
  startsAt: string
  endsAt?: string | null
  allDay?: boolean | null
  location?: string | null
  summary?: string | null
  updatedAt?: string | null
}

const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n')

/** Lines longer than 75 bytes continue on the next line, indented by a space (RFC 5545). */
function fold(line: string): string {
  const bytes = Buffer.from(line, 'utf8')
  if (bytes.length <= 75) return line
  const parts: string[] = []
  let cur = ''
  let len = 0
  for (const ch of line) {
    const n = Buffer.byteLength(ch, 'utf8')
    if (len + n > (parts.length ? 74 : 75)) {
      parts.push(cur)
      cur = ''
      len = 0
    }
    cur += ch
    len += n
  }
  parts.push(cur)
  return parts.join('\r\n ')
}

const utc = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
const dateOnly = (day: string) => day.replace(/-/g, '')

export function eventLines(e: IcsEvent, opts: { origin: string; host: string }): string[] {
  const url = e.slug ? `${opts.origin}/events/${e.slug}` : null
  const lines = [
    'BEGIN:VEVENT',
    `UID:b61-event-${e.id}@${opts.host}`,
    `DTSTAMP:${utc(e.updatedAt || new Date().toISOString())}`,
  ]
  if (e.allDay) {
    const first = ymd(e.startsAt)
    const last = e.endsAt ? ymd(e.endsAt) : first
    lines.push(`DTSTART;VALUE=DATE:${dateOnly(first)}`, `DTEND;VALUE=DATE:${dateOnly(addDays(last < first ? first : last, 1))}`)
  } else {
    lines.push(`DTSTART:${utc(e.startsAt)}`)
    // No end given: an hour, which is what calendar apps assume anyway.
    lines.push(`DTEND:${utc(e.endsAt || new Date(new Date(e.startsAt).getTime() + 3600000).toISOString())}`)
  }
  lines.push(`SUMMARY:${esc(e.title)}`)
  if (e.location) lines.push(`LOCATION:${esc(e.location)}`)
  const desc = [e.summary, url].filter(Boolean).join('\n\n')
  if (desc) lines.push(`DESCRIPTION:${esc(desc)}`)
  if (url) lines.push(`URL:${url}`)
  lines.push('END:VEVENT')
  return lines
}

export function buildIcs(events: IcsEvent[], opts: { name: string; origin: string; description?: string }): string {
  const host = new URL(opts.origin).hostname
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Banner 61//School Website//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${esc(opts.name)}`,
    `X-WR-TIMEZONE:${schoolTz()}`,
    ...(opts.description ? [`X-WR-CALDESC:${esc(opts.description)}`] : []),
    // Ask subscribed calendars to check back a few times a day.
    'REFRESH-INTERVAL;VALUE=DURATION:PT6H',
    'X-PUBLISHED-TTL:PT6H',
    ...events.flatMap((e) => eventLines(e, { origin: opts.origin, host })),
    'END:VCALENDAR',
  ]
  return lines.map(fold).join('\r\n') + '\r\n'
}

/** Google Calendar's "add this one event" link. */
export function googleEventLink(e: IcsEvent, origin: string): string {
  const dates = e.allDay
    ? `${dateOnly(ymd(e.startsAt))}/${dateOnly(addDays(e.endsAt ? ymd(e.endsAt) : ymd(e.startsAt), 1))}`
    : `${utc(e.startsAt)}/${utc(e.endsAt || new Date(new Date(e.startsAt).getTime() + 3600000).toISOString())}`
  const q = new URLSearchParams({
    action: 'TEMPLATE',
    text: e.title,
    dates,
    ...(e.location ? { location: e.location } : {}),
    details: [e.summary, e.slug ? `${origin}/events/${e.slug}` : null].filter(Boolean).join('\n\n'),
    ctz: schoolTz(),
  })
  return `https://calendar.google.com/calendar/render?${q.toString()}`
}

/** Subscribe links for the school's whole calendar. */
export function subscribeLinks(feedUrl: string, name: string) {
  const webcal = feedUrl.replace(/^https?:/, 'webcal:')
  return {
    feed: feedUrl,
    google: `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(webcal)}`,
    apple: webcal,
    outlook: `https://outlook.live.com/calendar/0/addfromweb?url=${encodeURIComponent(feedUrl)}&name=${encodeURIComponent(name)}`,
  }
}
