/*
 * Dates in the school's own time zone (SCHOOL_TIMEZONE, default Eastern), not
 * the server's (UTC on Vercel). Events are stored as exact moments; "which day
 * is this on" and "midnight on the 14th" are always answered for the school.
 */

export const schoolTz = () => process.env.SCHOOL_TIMEZONE || 'America/New_York'

/** "2026-11-14" for the day this moment falls on at the school. */
export function ymd(d: Date | string, tz = schoolTz()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(d))
}

/** The moment it is `hh:mm` on day `day` ("2026-11-14") at the school. */
export function zoned(day: string, hh = 0, mm = 0, tz = schoolTz()): Date {
  const guess = new Date(`${day}T${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:00Z`)
  // How far the school's clock is from UTC at that moment, then correct once
  // (and once more across a daylight-saving change).
  let t = guess.getTime()
  for (let i = 0; i < 2; i++) {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
    }).formatToParts(new Date(t))
    const get = (k: string) => Number(parts.find((p) => p.type === k)?.value)
    const shown = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'))
    t += guess.getTime() - shown
  }
  return new Date(t)
}

/** Adds whole days to "2026-11-14". */
export function addDays(day: string, n: number): string {
  const d = new Date(`${day}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

/** 0 = Sunday … 6 = Saturday, for "2026-11-14". */
export const weekday = (day: string) => new Date(`${day}T12:00:00Z`).getUTCDay()

/** "2026-11" → the 6-week grid of days a month calendar shows (Sunday first). */
export function monthGrid(month: string): { days: string[]; first: string; nextMonth: string; prevMonth: string } {
  const first = `${month}-01`
  const start = addDays(first, -weekday(first))
  const days = Array.from({ length: 42 }, (_, i) => addDays(start, i))
  const [y, m] = month.split('-').map(Number)
  const shift = (n: number) => {
    const d = new Date(Date.UTC(y, m - 1 + n, 1))
    return d.toISOString().slice(0, 7)
  }
  return { days, first, nextMonth: shift(1), prevMonth: shift(-1) }
}

export const isMonth = (s: unknown): s is string => typeof s === 'string' && /^\d{4}-(0[1-9]|1[0-2])$/.test(s)

export function monthLabel(month: string) {
  return new Date(`${month}-01T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })
}

/** The days an event covers, at the school ("2026-11-14", …), at most `cap`. */
export function eventDays(e: { startsAt: string; endsAt?: string | null; allDay?: boolean | null }, cap = 31): string[] {
  const first = ymd(e.startsAt)
  if (!e.endsAt) return [first]
  // A timed event ending exactly at midnight doesn't spill into the next day.
  const endMoment = new Date(new Date(e.endsAt).getTime() - (e.allDay ? 0 : 1))
  const last = ymd(endMoment)
  const days = [first]
  while (days.length < cap && days[days.length - 1] < last) days.push(addDays(days[days.length - 1], 1))
  return days
}
