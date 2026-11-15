import ICAL from 'ical.js'
import { createHash } from 'crypto'
import type { Payload } from 'payload'
import { addDays, schoolTz, ymd, zoned } from './time'

/*
 * Copies events from an ICS / iCal calendar into a school's Events.
 *
 * - Repeating events become one event per date (within the window below).
 * - Each copied event remembers where it came from (feed + the calendar's own
 *   id for it), so the next import updates it instead of adding a duplicate,
 *   and skips writing when nothing changed.
 * - An event that disappears from the calendar is removed here too, if it is
 *   still upcoming. Past events are left alone.
 * - Imported events are published straight away with the feed's audience.
 */

const WINDOW_BACK_DAYS = 30
const WINDOW_AHEAD_DAYS = 400
const MAX_EVENTS = 1500
const MAX_BYTES = 10 * 1024 * 1024

export type ImportResult = { created: number; updated: number; unchanged: number; removed: number; skipped: number }

type Feed = { id: number | string; name: string; url: string; audience?: 'public' | 'parents' | null; school: unknown }

type Occurrence = {
  uid: string
  title: string
  startsAt: string
  endsAt: string | null
  allDay: boolean
  location: string | null
  description: string
}

const idOf = (v: unknown) => (v && typeof v === 'object' ? (v as any).id : v) as number | string

const slugify = (s: string) =>
  s.toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'event'

const isZone = (tz: string) => {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz })
    return true
  } catch {
    return false
  }
}

/** An ICAL time as an exact moment, honouring its time zone (or the school's for "floating" times). */
function moment(t: any, tzid: string | null): Date {
  const zone = t.zone?.tzid
  if (zone === 'UTC' || (zone && zone !== 'floating' && ICAL.TimezoneService.has(zone))) return t.toJSDate()
  const day = `${t.year}-${String(t.month).padStart(2, '0')}-${String(t.day).padStart(2, '0')}`
  const tz = tzid && isZone(tzid) ? tzid : schoolTz()
  return new Date(zoned(day, t.hour, t.minute, tz).getTime() + (t.second || 0) * 1000)
}

const icalDay = (t: any) => `${t.year}-${String(t.month).padStart(2, '0')}-${String(t.day).padStart(2, '0')}`

/** Calendar descriptions are plain text, sometimes with a little HTML (Google). */
export function plainText(s: string | null | undefined): string {
  if (!s) return ''
  return String(s)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\r/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, 5000)
}

/** Plain text as rich text: one paragraph per line, links left as text. */
function richText(text: string) {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)
  if (!lines.length) return null
  return {
    root: {
      type: 'root', format: '' as const, indent: 0, version: 1, direction: 'ltr' as const,
      children: lines.map((text) => ({
        type: 'paragraph', format: '' as const, indent: 0, version: 1, direction: 'ltr' as const, textFormat: 0, textStyle: '',
        children: [{ type: 'text', text, format: 0, style: '', mode: 'normal', detail: 0, version: 1 }],
      })),
    },
  }
}

/** Reads every event in an ICS file that falls between `from` and `to`. */
export function parseIcs(text: string, opts: { from: Date; to: Date }): Occurrence[] {
  const root = new ICAL.Component(ICAL.parse(text))
  for (const tz of root.getAllSubcomponents('vtimezone')) {
    try {
      ICAL.TimezoneService.register(tz)
    } catch {}
  }

  // A repeating event's moved or changed dates come as extra VEVENTs with the
  // same UID and a RECURRENCE-ID; tie them to the main one.
  const groups = new Map<string, { master?: any; exceptions: any[] }>()
  for (const ve of root.getAllSubcomponents('vevent')) {
    const uid = String(ve.getFirstPropertyValue('uid') ?? '') || createHash('sha1').update(ve.toString()).digest('hex')
    const g = groups.get(uid) ?? { exceptions: [] }
    if (ve.hasProperty('recurrence-id')) g.exceptions.push(ve)
    else g.master = ve
    groups.set(uid, g)
  }

  const out: Occurrence[] = []
  const fromMs = opts.from.getTime()
  const toMs = opts.to.getTime()

  const push = (uid: string, item: any, start: any, end: any, tzid: string | null) => {
    if (String(item.component.getFirstPropertyValue('status') ?? '').toUpperCase() === 'CANCELLED') return
    const allDay = Boolean(start.isDate)
    let startsAt: Date
    let endsAt: Date | null = null
    if (allDay) {
      const first = icalDay(start)
      startsAt = zoned(first)
      // DTEND of an all-day event is the day after the last day.
      const last = end ? addDays(icalDay(end), -1) : first
      if (last > first) endsAt = zoned(last)
    } else {
      startsAt = moment(start, tzid)
      if (end) endsAt = moment(end, item.component.getFirstProperty('dtend')?.getParameter('tzid') ?? tzid)
      if (endsAt && endsAt <= startsAt) endsAt = null
    }
    const lastMs = (endsAt ?? startsAt).getTime()
    if (lastMs < fromMs || startsAt.getTime() > toMs) return
    out.push({
      uid,
      title: String(item.summary || 'Untitled event').trim().slice(0, 200),
      startsAt: startsAt.toISOString(),
      endsAt: endsAt ? endsAt.toISOString() : null,
      allDay,
      location: item.location ? String(item.location).trim().slice(0, 300) : null,
      description: plainText(item.description),
    })
  }

  for (const [uid, g] of groups) {
    if (out.length >= MAX_EVENTS) break
    if (!g.master) {
      // Only changed dates of a series we don't have: import them as they are.
      for (const ex of g.exceptions) {
        const ev = new ICAL.Event(ex)
        push(`${uid}#${ev.recurrenceId?.toICALString()}`, ev, ev.startDate, ev.endDate, ex.getFirstProperty('dtstart')?.getParameter('tzid') ?? null)
      }
      continue
    }
    const event = new ICAL.Event(g.master, { strictExceptions: false })
    for (const ex of g.exceptions) event.relateException(ex)
    const tzid = g.master.getFirstProperty('dtstart')?.getParameter('tzid') ?? null
    if (!event.isRecurring()) {
      push(uid, event, event.startDate, event.endDate, tzid)
      continue
    }
    const it = event.iterator()
    let steps = 0
    for (let next = it.next(); next && steps < 5000 && out.length < MAX_EVENTS; next = it.next(), steps++) {
      const d = event.getOccurrenceDetails(next)
      if (moment(d.startDate, tzid).getTime() > toMs && !d.startDate.isDate) break
      if (d.startDate.isDate && zoned(icalDay(d.startDate)).getTime() > toMs) break
      push(`${uid}#${d.recurrenceId.toICALString()}`, d.item, d.startDate, d.endDate, tzid)
    }
  }
  return out
}

/** Downloads a calendar (webcal:// is just https://). */
export async function fetchIcs(url: string): Promise<string> {
  const href = url.trim().replace(/^webcal:/i, 'https:')
  const res = await fetch(href, {
    headers: { accept: 'text/calendar, text/plain;q=0.9, */*;q=0.5', 'user-agent': 'Banner61-Schools/1.0 (calendar import)' },
    redirect: 'follow',
    signal: AbortSignal.timeout(20000),
  })
  if (!res.ok) throw new Error(`The calendar address answered ${res.status}${res.status === 404 ? ' (not found: check the address)' : ''}.`)
  const text = await res.text()
  if (text.length > MAX_BYTES) throw new Error('That calendar is too large to import (over 10 MB).')
  if (!/BEGIN:VCALENDAR/i.test(text)) throw new Error('That address didn\'t return a calendar (ICS) file.')
  return text
}

const hashOf = (o: object) => createHash('sha1').update(JSON.stringify(o)).digest('hex').slice(0, 16)

/** Imports one feed into its school's events. */
export async function importFeed(payload: Payload, feed: Feed, opts: { text?: string } = {}): Promise<ImportResult> {
  const school = idOf(feed.school)
  const now = Date.now()
  const from = new Date(now - WINDOW_BACK_DAYS * 86400000)
  const to = new Date(now + WINDOW_AHEAD_DAYS * 86400000)
  const text = opts.text ?? (await fetchIcs(feed.url))
  const items = parseIcs(text, { from, to })
  const audience = feed.audience === 'parents' ? 'parents' : 'public'

  const existing = await payload.find({
    collection: 'events',
    where: { and: [{ school: { equals: school } }, { importedFrom: { equals: feed.id } }] },
    pagination: false,
    depth: 0,
    overrideAccess: true,
    select: { importUid: true, importHash: true, startsAt: true, slug: true },
  })
  const byUid = new Map(existing.docs.map((d: any) => [d.importUid as string, d]))
  const slugs = new Set(
    (
      await payload.find({ collection: 'events', where: { school: { equals: school } }, pagination: false, depth: 0, overrideAccess: true, select: { slug: true } })
    ).docs.map((d: any) => d.slug as string),
  )

  const result: ImportResult = { created: 0, updated: 0, unchanged: 0, removed: 0, skipped: 0 }
  const seen = new Set<string>()
  const ctx = { b61Import: true }

  for (const o of items) {
    if (seen.has(o.uid)) continue
    seen.add(o.uid)
    const fields = {
      title: o.title,
      allDay: o.allDay,
      startsAt: o.startsAt,
      endsAt: o.endsAt,
      location: o.location,
      audience,
      summary: o.description ? o.description.replace(/\s+/g, ' ').slice(0, 197) + (o.description.length > 197 ? '…' : '') : null,
      description: richText(o.description),
    }
    const hash = hashOf(fields)
    const found: any = byUid.get(o.uid)
    try {
      if (found) {
        if (found.importHash === hash) {
          result.unchanged++
          continue
        }
        await payload.update({
          collection: 'events',
          id: found.id,
          data: { ...fields, importHash: hash, _status: 'published' } as any,
          overrideAccess: true,
          context: ctx,
        })
        result.updated++
      } else {
        let slug = `${slugify(o.title)}-${ymd(o.startsAt)}`
        if (slugs.has(slug)) slug = `${slug}-${hashOf({ uid: o.uid }).slice(0, 5)}`
        slugs.add(slug)
        await payload.create({
          collection: 'events',
          data: {
            ...fields,
            slug,
            generateSlug: false,
            school,
            importedFrom: feed.id,
            importUid: o.uid,
            importHash: hash,
            _status: 'published',
          } as any,
          overrideAccess: true,
          context: ctx,
        })
        result.created++
      }
    } catch (e: any) {
      result.skipped++
      payload.logger.warn(`[b61] Calendar import (${feed.name}): skipped "${o.title}": ${e?.message ?? e}`)
    }
  }

  // Gone from the calendar and not over yet: remove it here too.
  for (const d of existing.docs as any[]) {
    if (seen.has(d.importUid) || new Date(d.startsAt).getTime() < from.getTime()) continue
    await payload.delete({ collection: 'events', id: d.id, overrideAccess: true, context: ctx })
    result.removed++
  }
  return result
}

export function describe(r: ImportResult): string {
  const parts = [
    r.created && `${r.created} added`,
    r.updated && `${r.updated} updated`,
    r.removed && `${r.removed} removed`,
    r.skipped && `${r.skipped} skipped`,
  ].filter(Boolean)
  const total = r.created + r.updated + r.unchanged
  return parts.length ? `${parts.join(', ')} (${total} events in the calendar)` : `No changes (${total} events in the calendar)`
}

/** Imports a feed and records how it went on the feed itself. */
export async function runFeed(payload: Payload, feed: Feed): Promise<{ ok: boolean; message: string; result?: ImportResult }> {
  let ok = true
  let message: string
  let result: ImportResult | undefined
  try {
    result = await importFeed(payload, feed)
    message = describe(result)
  } catch (e: any) {
    ok = false
    message = `Failed: ${e?.name === 'TimeoutError' ? 'the calendar took too long to answer.' : e?.message ?? String(e)}`
  }
  await payload.update({
    collection: 'calendar-feeds',
    id: feed.id,
    data: { lastImportedAt: new Date().toISOString(), lastResult: message.slice(0, 250) },
    overrideAccess: true,
    context: { b61Import: true },
  })
  return { ok, message, result }
}

/** Every active feed at every school (the daily run). */
export async function importAllFeeds(payload: Payload) {
  const feeds = await payload.find({ collection: 'calendar-feeds', where: { active: { equals: true } }, pagination: false, depth: 0, overrideAccess: true })
  const out: { feed: string; ok: boolean; message: string }[] = []
  for (const f of feeds.docs as any[]) {
    const r = await runFeed(payload, f)
    out.push({ feed: `${f.name} (school ${idOf(f.school)})`, ok: r.ok, message: r.message })
    payload.logger.info(`[b61] Calendar import ${f.name}: ${r.message}`)
  }
  return out
}
