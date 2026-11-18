import { ICON_OPTIONS } from '../b61/kit/groups'
import { schoolboxGuidance, type SchoolboxCopy, type SchoolboxPhotos } from '../templates/schoolbox'

/*
 * Schoolbox setup "spots": the named places on a Schoolbox page that a school
 * fills during setup (in Base Camp). Spots are stored on the school
 * (schools.setupSpots) as a flat map, { "home.hero.tagline1": "Rooted in faith.",
 * "home.photo.hero": 42, ... }, and "Build pages from spots" turns them into
 * the school's pages. A spot left empty keeps the template's [bracketed]
 * guidance, so a half-finished setup still builds a complete page.
 *
 * Only the Home page has spots so far; the other Schoolbox pages get theirs
 * once the page list is settled.
 */

export type SpotKind = 'text' | 'long' | 'icon' | 'photo'
export type Spot = { id: string; page: string; label: string; kind: SpotKind; max?: number; help?: string }
export type SpotValues = Record<string, string | number | null | undefined>

const ICONS = ICON_OPTIONS.map(([v]) => v).filter((v) => v !== 'dot')

const t = (id: string, label: string, max: number, help?: string): Spot => ({ id: `home.${id}`, page: 'home', label, kind: max > 160 ? 'long' : 'text', max, help })
const photo = (id: string, label: string, help?: string): Spot => ({ id: `home.photo.${id}`, page: 'home', label, kind: 'photo', help })

export const HOME_SPOTS: Spot[] = [
  t('hero.eyebrow', 'Small line above the headline', 40, 'For example "Now enrolling for fall". Heritage and Bold show it.'),
  t('hero.tagline1', 'Headline, first part', 40),
  t('hero.tagline2', 'Headline, second part', 40, 'Shown in the accent style.'),
  t('hero.intro', 'Sentence under the headline', 200, 'Who the school is, where, and who it serves.'),
  ...[1, 2, 3].flatMap((n) => [
    t(`diff${n}.title`, `Differentiator ${n}: title`, 40),
    t(`diff${n}.body`, `Differentiator ${n}: one line`, 120),
    { id: `home.diff${n}.icon`, page: 'home', label: `Differentiator ${n}: icon`, kind: 'icon' as const, help: ICONS.join(', ') },
  ]),
  t('problem.eyebrow', 'Why families choose us: small line', 40),
  t('problem.line1', 'Why families choose us: headline, first part', 50),
  t('problem.line2', 'Why families choose us: headline, second part', 50),
  t('problem.body1', 'What parents want, and what gets in the way', 320),
  t('problem.body2', 'How the school helps', 320),
  t('outcomes.heading', 'Outcomes: headline', 60),
  t('outcomes.intro', 'Outcomes: one line', 120),
  ...[1, 2, 3].flatMap((n) => [t(`outcome${n}.title`, `Outcome ${n}: title`, 40), t(`outcome${n}.body`, `Outcome ${n}: description`, 90)]),
  t('quote.text', 'A parent’s words', 240),
  t('quote.who', 'Who said it', 60, 'For example "Parent of a 4th grader". No full names unless the parent agreed.'),
  ...[1, 2, 3].flatMap((n) => [t(`step${n}.title`, `Admissions step ${n}: title`, 30), t(`step${n}.body`, `Admissions step ${n}: description`, 120)]),
  t('cta.heading', 'Final invitation: headline', 60),
  t('cta.body', 'Final invitation: one line', 160),
  photo('hero', 'Main photo', 'The first thing families see. Wide, bright, students in it.'),
  photo('problem', 'Photo beside "Why families choose us"'),
  photo('outcome1', 'Outcome 1 photo'),
  photo('outcome2', 'Outcome 2 photo'),
  photo('outcome3', 'Outcome 3 photo'),
  photo('cta', 'Photo behind the final invitation', 'Bold shows it.'),
]

export const SPOTS: Spot[] = [...HOME_SPOTS]
export const SPOT_PAGES = ['home'] as const
export const spotById = new Map(SPOTS.map((s) => [s.id, s]))

const text = (v: unknown): string | null => (typeof v === 'string' && v.trim() ? v.trim() : null)
const photoId = (v: unknown): number | null => {
  const n = typeof v === 'string' && /^\d+$/.test(v) ? Number(v) : v
  return typeof n === 'number' && Number.isInteger(n) && n > 0 ? n : null
}

/** The Home page words: the school's spots where filled, the template's guidance where not. */
export function homeCopy(spots: SpotValues, schoolName: string): SchoolboxCopy {
  const g = schoolboxGuidance(schoolName)
  const s = (id: string, fallback: string) => text(spots[`home.${id}`]) ?? fallback
  const icon = (n: number, fallback: string) => {
    const v = text(spots[`home.diff${n}.icon`])
    return v && ICONS.includes(v) ? v : fallback
  }
  return {
    schoolName,
    heroEyebrow: s('hero.eyebrow', g.heroEyebrow),
    tagline: [s('hero.tagline1', g.tagline[0]), s('hero.tagline2', g.tagline[1])],
    intro: s('hero.intro', g.intro),
    differentiators: g.differentiators.map((d, i) => ({ icon: icon(i + 1, d.icon), title: s(`diff${i + 1}.title`, d.title), body: s(`diff${i + 1}.body`, d.body) })),
    problem: {
      eyebrow: s('problem.eyebrow', g.problem.eyebrow),
      lines: [s('problem.line1', g.problem.lines[0]), s('problem.line2', g.problem.lines[1])],
      body: [s('problem.body1', g.problem.body[0]), s('problem.body2', g.problem.body[1])],
    },
    outcomes: {
      heading: s('outcomes.heading', g.outcomes.heading),
      intro: s('outcomes.intro', g.outcomes.intro),
      items: g.outcomes.items.map((o, i) => ({ title: s(`outcome${i + 1}.title`, o.title), body: s(`outcome${i + 1}.body`, o.body) })),
    },
    quote: { text: s('quote.text', g.quote.text), who: s('quote.who', g.quote.who) },
    steps: g.steps.map((st, i) => ({ title: s(`step${i + 1}.title`, st.title), body: s(`step${i + 1}.body`, st.body) })),
    cta: { heading: s('cta.heading', g.cta.heading), body: s('cta.body', g.cta.body) },
  }
}

/** The Home page photos (media ids) the school picked. Ids are checked against the school's own photos before use. */
export function homePhotos(spots: SpotValues): SchoolboxPhotos {
  const p = (id: string) => photoId(spots[`home.photo.${id}`]) ?? undefined
  return { hero: p('hero'), problem: p('problem'), outcomes: [p('outcome1'), p('outcome2'), p('outcome3')], cta: p('cta') }
}

export const photoIds = (spots: SpotValues): number[] =>
  SPOTS.filter((s) => s.kind === 'photo').map((s) => photoId(spots[s.id])).filter((n): n is number => n != null)

/**
 * Cleans a spots map before it is saved: unknown spot ids are dropped, words
 * are trimmed, photos must be ids. Returns the clean map and plain-language
 * problems (words over a spot's length are kept but reported).
 */
export function cleanSpots(input: unknown): { spots: SpotValues; problems: string[] } {
  const spots: SpotValues = {}
  const problems: string[] = []
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { spots, problems: input == null ? [] : ['Spots must be a list of named values.'] }
  for (const [id, raw] of Object.entries(input as Record<string, unknown>)) {
    const spot = spotById.get(id)
    if (!spot) {
      problems.push(`"${id}" isn't a spot, so it was left out.`)
      continue
    }
    if (raw == null || raw === '') continue
    if (spot.kind === 'photo') {
      const n = photoId(raw)
      if (n == null) problems.push(`${spot.label}: expected a photo, so it was left out.`)
      else spots[id] = n
      continue
    }
    if (typeof raw !== 'string') {
      problems.push(`${spot.label}: expected words, so it was left out.`)
      continue
    }
    const v = raw.trim().slice(0, 2000)
    if (spot.kind === 'icon' && !ICONS.includes(v)) {
      problems.push(`${spot.label}: "${v}" isn't one of the icons, so it was left out.`)
      continue
    }
    if (spot.max && v.length > spot.max) problems.push(`${spot.label} is ${v.length} characters; it fits best under ${spot.max}.`)
    spots[id] = v
  }
  return { spots, problems }
}
