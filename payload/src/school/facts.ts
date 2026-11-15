/*
 * The school's facts as label + value pairs, in the order a family reads them.
 * Shown by Card Grid > Fill with > School facts; the same facts go into the
 * School structured data (src/seo/schema.ts), so what search engines and AI
 * tools are told is also on the page.
 */
export type Fact = { key: string; label: string; value: string; href?: string | null }

const list = (rows: { name?: string | null }[] | null | undefined) =>
  (rows ?? [])
    .map((r) => r?.name?.trim())
    .filter(Boolean)
    .join(', ')

const DAY_ORDER = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
const DAY_LABEL: Record<string, string> = { Mo: 'Mon', Tu: 'Tue', We: 'Wed', Th: 'Thu', Fr: 'Fri', Sa: 'Sat', Su: 'Sun' }

/** "07:30" -> "7:30 AM". */
export function clock(t: string): string {
  const [h, m] = t.split(':').map(Number)
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`
}

/** "Mon–Fri, 7:30 AM–4:00 PM" (runs of days joined with a dash). */
export function officeHours(days: string[] | null | undefined, opens?: string | null, closes?: string | null): string | null {
  const d = DAY_ORDER.filter((x) => (days ?? []).includes(x))
  if (!d.length || !opens || !closes) return null
  const runs: string[][] = []
  for (const x of d) {
    const last = runs.at(-1)
    if (last && DAY_ORDER.indexOf(x) === DAY_ORDER.indexOf(last.at(-1)!) + 1) last.push(x)
    else runs.push([x])
  }
  const dayText = runs.map((r) => (r.length > 2 ? `${DAY_LABEL[r[0]]}–${DAY_LABEL[r.at(-1)!]}` : r.map((x) => DAY_LABEL[x]).join(', '))).join(', ')
  return `${dayText}, ${clock(opens)}–${clock(closes)}`
}

export async function schoolFacts(s: any): Promise<Fact[]> {
  const out: Fact[] = []
  const add = (key: string, label: string, value: unknown, href?: string | null) => {
    if (value === null || value === undefined || value === '' || value === false) return
    out.push({ key, label, value: String(value), href: href || null })
  }
  add('grades', 'Grades', s.grades)
  add('location', 'Location', [s.city, s.state].filter(Boolean).join(', '))
  add('founded', 'Founded', s.foundedYear)
  add('enrollment', 'Students', typeof s.enrollment === 'number' ? s.enrollment.toLocaleString('en-US') : null)
  add('ratio', 'Student-teacher ratio', s.studentTeacherRatio)
  add('denomination', 'Tradition', s.denomination)
  add('church', 'A ministry of', s.churchName, s.churchUrl)
  add('accreditation', 'Accredited by', list(s.accreditations))
  add('memberships', 'Member of', list(s.memberships))
  add('care', 'Before and after care', s.beforeAfterCare ? 'Available' : null)
  add('transportation', 'Transportation', s.transportation)
  add('hours', 'Office hours', officeHours(s.officeDays, s.officeOpens, s.officeCloses))
  return out
}
