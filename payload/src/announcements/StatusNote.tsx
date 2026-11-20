'use client'
import { useDocumentInfo, useField, useFormFields } from '@payloadcms/ui'
import { useEffect, useRef, useState } from 'react'
import { endOfTomorrow, noticeState, outranks, overlap, sharePages, shortDate, staleDays } from './status'

/*
 * At the top of an announcement's sidebar: whether it's on the website and,
 * if not, why (20 Nov 2026). It reads the editor's current values, so it
 * answers "what happens when I publish this": scheduled, showing, ended,
 * blocked by another pop-up, or past the three-bar limit. Also:
 *   - "Hide after" already passed: it says so (allowed, for reuse later).
 *   - Up 30+ days with no end date: "Still needed?"
 *   - Switching a not-yet-published announcement to Urgent sets "Hide after"
 *     to the end of tomorrow, with a line saying so; staff can change or clear it.
 */

type Other = { id: number; title: string; display?: string; style?: string; startsAt?: string; endsAt?: string | null; showOn?: string; pages?: unknown[] }

const where = (n: number, showOn: string, pages: unknown[]) =>
  showOn === 'home' ? 'on the home page' : showOn === 'pages' ? `on ${n === 1 ? '1 chosen page' : `${n} chosen pages`}` : 'on every page'

export function StatusNote() {
  const { id, hasPublishedDoc, unpublishedVersionCount } = useDocumentInfo() as any
  const v = useFormFields(([f]) => ({
    school: f.school?.value as any,
    display: (f.display?.value as string) ?? 'bar',
    style: (f.style?.value as string) ?? 'standard',
    startsAt: f.startsAt?.value as string | undefined,
    endsAt: f.endsAt?.value as string | null | undefined,
    showOn: (f.showOn?.value as string) ?? 'all',
    pages: (f.pages?.value as unknown[]) ?? [],
  }))
  const ends = useField<string | null>({ path: 'endsAt' })

  // Switched to Urgent on one never published (autosave gives a new one an id
  // at once, so "new" means "not published yet"): suggest an end, once.
  // Clearing it sticks.
  const lastStyle = useRef<string | null>(null)
  const suggested = useRef(false)
  const [setForYou, setSetForYou] = useState(false)
  useEffect(() => {
    const before = lastStyle.current
    lastStyle.current = v.style
    if (before === null && v.style === 'urgent') return // opened already Urgent: leave it
    if (suggested.current || hasPublishedDoc || v.style !== 'urgent' || before === 'urgent' || v.endsAt) return
    suggested.current = true
    ends.setValue(endOfTomorrow().toISOString())
    setSetForYou(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v.style])

  // Others at this school that could crowd it out.
  const [others, setOthers] = useState<Other[]>([])
  const school = v.school && typeof v.school === 'object' ? v.school.id : v.school
  useEffect(() => {
    if (!school) return
    const q = new URLSearchParams({
      'where[school][equals]': String(school),
      'where[_status][equals]': 'published',
      depth: '0',
      limit: '50',
    })
    if (id) q.set('where[id][not_equals]', String(id))
    fetch(`/api/announcements?${q}`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : { docs: [] }))
      .then((j) => setOthers(j.docs ?? []))
      .catch(() => setOthers([]))
  }, [school, id])

  const now = Date.now()
  const live = noticeState({ published: true, startsAt: v.startsAt, endsAt: v.endsAt }, now)
  const placed = { id, style: v.style, startsAt: v.startsAt, endsAt: v.endsAt, showOn: v.showOn, pages: v.pages }
  const competing = others.filter(
    (o) => (o.display ?? 'bar') === v.display && noticeState({ published: true, startsAt: o.startsAt, endsAt: o.endsAt }, now) !== 'ended' && overlap(o, placed) && sharePages(o, placed) && outranks(o, placed),
  )
  const stale = live === 'showing' ? staleDays(v, now) : null
  const pagesCount = Array.isArray(v.pages) ? v.pages.length : 0
  const stateOf = (o: Other) => noticeState({ published: true, startsAt: o.startsAt, endsAt: o.endsAt }, now)
  // In the way right now (both showing), or later (the other is scheduled).
  const inWayNow = live === 'showing' ? competing.filter((o) => stateOf(o) === 'showing') : []
  const inWayLater = competing.filter((o) => stateOf(o) === 'scheduled')
  const popup = v.display === 'popup'
  const blockedNow = popup ? inWayNow.length > 0 : inWayNow.length >= 3

  let tone: 'ok' | 'wait' | 'off' = 'ok'
  let headline = ''
  if (live === 'ended') {
    tone = 'off'
    headline = `Not showing: it ended ${shortDate(v.endsAt, true)}.`
  } else if (live === 'scheduled') {
    tone = 'wait'
    headline = `Scheduled: shows from ${shortDate(v.startsAt, true)}${v.endsAt ? ` to ${shortDate(v.endsAt, true)}` : ''}, ${where(pagesCount, v.showOn, v.pages)}.`
  } else if (blockedNow) {
    tone = 'wait'
    headline = popup ? 'Not showing right now: another pop-up comes first.' : 'Not showing right now: 3 other bars come first.'
  } else {
    headline = `Showing now ${where(pagesCount, v.showOn, v.pages)}${v.endsAt ? `, until ${shortDate(v.endsAt, true)}` : ''}.`
  }

  const link = (o: Other) => <a href={`/admin/collections/announcements/${o.id}`}>{o.title}</a>
  const lines: React.ReactNode[] = []
  if (live === 'ended') lines.push('To use it again, change "Hide after" (or clear it) and publish.')
  if (popup && inWayNow.length > 0) {
    const o = inWayNow[0]
    lines.push(
      <>
        Only one pop-up shows on a page, and {link(o)} comes first where both apply{o.endsAt ? ` (until ${shortDate(o.endsAt)})` : ''}. This one
        appears {o.endsAt ? 'once that ends' : 'once that one ends or is unpublished'}.
      </>,
    )
  } else if (popup && inWayLater.length > 0 && live !== 'ended') {
    const o = inWayLater[0]
    lines.push(
      <>
        From {shortDate(o.startsAt)}, {link(o)} comes first where both apply{o.endsAt ? ` (until ${shortDate(o.endsAt)})` : ''}, and this one
        won&apos;t appear there meanwhile.
      </>,
    )
  }
  if (!popup && blockedNow) lines.push('Only 3 bars show at once. This one appears when one of the others ends.')
  if (stale) lines.push(`It has been up for ${stale} days with no end date. Still needed? Set "Hide after" or unpublish it.`)
  if (setForYou && v.endsAt) lines.push('"Hide after" is set to the end of tomorrow, as urgent messages are usually short-lived. Change or clear it.')

  // What the website shows right now, when that differs from these settings.
  const notLive = !hasPublishedDoc
  const pending = hasPublishedDoc && unpublishedVersionCount > 0

  return (
    <div className={`b61-notice-note b61-notice-note--${notLive ? 'wait' : tone}`} role="status">
      {notLive && <p className="b61-notice-note__lead">Not on the website yet. Once published:</p>}
      {pending && <p className="b61-notice-note__lead">You have changes that aren&apos;t published. Once published:</p>}
      <p className="b61-notice-note__head">{headline}</p>
      {lines.map((l, i) => (
        <p key={i}>{l}</p>
      ))}
    </div>
  )
}
