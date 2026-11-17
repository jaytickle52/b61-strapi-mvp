import { toBody } from '../b61/kit/body'
import type { ThemeName } from '../b61/lib/style'

/*
 * The Schoolbox home page. Every Schoolbox site has the same home page slots
 * (hero, three differentiators, problem and solution, three outcomes, a family
 * quote, events, admissions in three steps, a final invitation), so one set of
 * words fits every theme. Each theme lays those slots out its own way, with
 * the options any editor sees in the element's Design tab: nothing here is
 * hidden or special, and a page made from it is edited like any other.
 *
 * Used by the "Home (Schoolbox)" page template (words in [brackets] for the
 * school to replace) and by the Schoolbox demo school (real-looking words and
 * placeholder photos).
 */

export type SchoolboxCopy = {
  schoolName: string
  /** The small line above the hero headline (Heritage and Bold show it). */
  heroEyebrow: string
  tagline: [string, string]
  intro: string
  differentiators: { icon: string; title: string; body: string }[]
  problem: { eyebrow: string; lines: [string, string]; body: string[] }
  outcomes: { heading: string; intro: string; items: { title: string; body: string }[] }
  quote: { text: string; who: string }
  steps: { title: string; body: string }[]
  cta: { heading: string; body: string }
}

export type SchoolboxPhotos = { hero?: number; problem?: number; outcomes?: (number | undefined)[]; cta?: number }

/** The words a new Schoolbox home page starts with: what to write, in the place it goes. */
export function schoolboxGuidance(schoolName: string, tagline?: string | null): SchoolboxCopy {
  const t = (tagline ?? '').split(/(?<=\.)\s+/)
  return {
    schoolName,
    heroEyebrow: '[Now enrolling]',
    tagline: t.length > 1 ? [t[0], t.slice(1).join(' ')] : ['[A tagline expressing', 'your vision for students.]'],
    intro: `[${schoolName} is a K-12 Christian school in City, State. One more sentence on who you serve.]`,
    differentiators: [
      { icon: 'heart', title: '[Key differentiator]', body: '[One short line on the benefit to families.]' },
      { icon: 'book', title: '[Key differentiator]', body: '[One short line on the benefit to families.]' },
      { icon: 'people', title: '[Key differentiator]', body: '[One short line on the benefit to families.]' },
    ],
    problem: {
      eyebrow: 'Why families choose us',
      lines: ['[A headline that speaks', 'to what parents want.]'],
      body: [
        '[Name what Christian parents want for their children, and the challenge they often run into instead.]',
        '[Then show how your school helps: you are the guide, the family is the hero.]',
      ],
    },
    outcomes: {
      heading: '[A short headline about student outcomes]',
      intro: '[One line that sets up the three outcomes below.]',
      items: [
        { title: '[Outcome one]', body: '[A short description, 90 characters at most.]' },
        { title: '[Outcome two]', body: '[A short description, 90 characters at most.]' },
        { title: '[Outcome three]', body: '[A short description, 90 characters at most.]' },
      ],
    },
    quote: { text: '[A sentence or two from a current parent about what changed for their child.]', who: '[Parent of a 3rd grader]' },
    steps: [
      { title: 'Visit', body: '[What a visit looks like and how to book one.]' },
      { title: 'Apply', body: '[How to apply and what to send.]' },
      { title: 'Enroll', body: '[What happens after acceptance.]' },
    ],
    cta: { heading: '[A final invitation to take the next step]', body: '[Remind families what the next step is and how simple it is.]' },
  }
}

const para = (text: string) => ({
  root: {
    type: 'root', format: '', indent: 0, version: 1, direction: 'ltr',
    children: [{ type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, textStyle: '',
      children: [{ type: 'text', text, format: 0, style: '', mode: 'normal', detail: 0, version: 1 }] }],
  },
})
const url = (u: string) => ({ type: 'url', url: u })
const heading = (text: string, em?: string) => [{ text, emphasize: false }, ...(em ? [{ text: em, emphasize: true }] : [])]

/** The home page sections for a theme (Classic uses Warm's layout, the closest to the original look). */
export function schoolboxHome(theme: ThemeName, c: SchoolboxCopy, photos: SchoolboxPhotos = {}): any[] {
  const t = theme === 'classic' ? 'warm' : theme
  const heroImg = photos.hero ? { image: photos.hero } : {}
  const visit = '/schedule-a-tour'

  // 1. Hero
  const hero = {
    blockType: 'b61Hero',
    eyebrow: t === 'warm' ? '' : c.heroEyebrow,
    headingLevel: 'auto',
    lines: [{ text: c.tagline[0], emphasize: false }, { text: c.tagline[1], emphasize: t !== 'bold' }],
    subheadline: c.intro,
    subheadlineScale: 'body',
    buttons: [
      // Warm's one button sits on the photo, so it is the light one.
      { label: 'Schedule a visit', link: url(visit), variant: t === 'warm' ? 'light' : 'primary' },
      ...(t === 'warm' ? [] : [{ label: t === 'heritage' ? 'Why us' : 'Request info', link: url('/inquire'), variant: 'light' }]),
    ],
    entrance: 'on',
    ...(t === 'heritage'
      ? { layoutMode: 'cover', backgroundType: 'image', ...heroImg, height: 'tall', verticalPosition: 'center', textAlign: 'center', overlay: 'wash', surface: 'primary', overlayStrength: 60, eyebrowRule: 'both' }
      : t === 'warm'
        ? { layoutMode: 'cover', backgroundType: 'image', ...heroImg, height: 'tall', verticalPosition: 'center', textAlign: 'left', overlay: 'gradient', surface: 'primary' }
        : { layoutMode: 'split', splitSide: 'right', ...heroImg, bandSize: 'standard', textAlign: 'left', surface: 'primary' }),
  }

  // 2. Three differentiators
  const diffCards = {
    blockType: 'b61CardGrid',
    headingLevel: 'auto',
    lines: [],
    source: 'manual',
    mediaType: t === 'heritage' ? 'none' : 'icon',
    cards: c.differentiators.map((d) => ({ icon: d.icon, title: d.title, body: para(d.body) })),
    arrangement: 'grid',
    columns: '3',
    textAlign: t === 'bold' ? 'left' : 'center',
    cardStyle: t === 'warm' ? 'flat' : 'bordered',
    cardSurface: 'light',
    surface: 'none',
    entrance: 'on',
  }
  const differentiators =
    t === 'bold'
      ? // Bold: the cards sit over the bottom of the hero.
        { blockType: 'b61Section', pullUp: true, surface: 'none', columns: 'full', content: [diffCards] }
      : { ...diffCards, surface: t === 'warm' ? 'soft' : 'none' }

  // 3. Problem and solution
  const problem = {
    blockType: 'b61Split',
    eyebrow: c.problem.eyebrow,
    headingLevel: 'auto',
    lines: heading(c.problem.lines[0], c.problem.lines[1]),
    body: toBody(c.problem.body.map((b) => ({ type: 'body', body: para(b) }))),
    buttons: [{ label: 'Our approach', link: url('/about'), variant: 'link' }],
    media: 'photo',
    ...(photos.problem ? { image: photos.problem } : {}),
    imageShape: 'fixed',
    imageSide: t === 'warm' ? 'left' : 'right',
    verticalPosition: 'center',
    stackOrder: 'text',
    columnHeight: 'fit',
    headingAlign: 'left',
    surface: t === 'bold' ? 'dark' : 'none',
    textPanel: 'none',
    frameColor: t === 'heritage' ? 'secondary' : 'primary',
    entrance: 'on',
  }

  // 4. Three student outcomes
  const outcomes = {
    blockType: 'b61CardGrid',
    headingLevel: 'auto',
    lines: heading(c.outcomes.heading),
    intro: para(c.outcomes.intro),
    source: 'manual',
    mediaType: 'image',
    cards: c.outcomes.items.map((o, i) => ({
      title: o.title,
      body: para(o.body),
      ...(photos.outcomes?.[i] ? { image: photos.outcomes[i] } : {}),
      link: url('/academics'),
      linkText: 'Learn more',
    })),
    arrangement: 'grid',
    columns: '3',
    textAlign: t === 'heritage' ? 'center' : 'left',
    cardStyle: t === 'bold' ? 'overlay' : t === 'warm' ? 'flat' : 'plain',
    ...(t === 'bold' ? { cardShape: 'portrait' } : {}),
    cardSurface: 'light',
    surface: t === 'heritage' ? 'soft' : 'none',
    entrance: 'on',
  }

  // 5. A family's words
  const quote = {
    blockType: 'b61Testimonial',
    eyebrow: t === 'bold' ? 'Hear it from families' : 'From our families',
    quote: c.quote.text,
    attribution: c.quote.who,
    textAlign: t === 'bold' ? 'left' : 'center',
    textStyle: t === 'heritage' ? 'italic' : 'normal',
    showMark: t !== 'bold',
    surface: t === 'bold' ? 'accent' : t === 'warm' ? 'soft' : 'none',
    entrance: 'on',
  }

  // 6. Upcoming events
  const events = {
    blockType: 'b61CardGrid',
    headingLevel: 'auto',
    lines: heading('Upcoming events'),
    source: 'upcoming-events',
    limit: 3,
    mediaType: 'none',
    arrangement: 'grid',
    columns: '3',
    textAlign: 'left',
    cardStyle: t === 'warm' ? 'flat' : t === 'bold' ? 'plain' : 'bordered',
    cardSurface: 'light',
    surface: t === 'warm' ? 'soft' : 'none',
    entrance: 'on',
  }

  // 7. Admissions in three steps
  const steps = {
    blockType: 'b61CardGrid',
    headingLevel: 'auto',
    lines: heading('Admissions at a glance'),
    intro: para('Three simple steps from first visit to first day.'),
    source: 'manual',
    mediaType: 'none',
    cards: c.steps.map((s, i) => ({ eyebrow: `Step ${i + 1}`, title: s.title, body: para(s.body) })),
    buttons: [{ label: 'Start with a visit', link: url(visit), variant: 'primary' }],
    arrangement: 'grid',
    columns: '3',
    textAlign: t === 'heritage' ? 'center' : 'left',
    cardStyle: t === 'warm' ? 'flat' : t === 'bold' ? 'bordered' : 'plain',
    cardSurface: 'light',
    surface: t === 'bold' ? 'soft' : 'none',
    entrance: 'on',
  }

  // 8. The final invitation
  const cta = {
    blockType: 'b61Cta',
    headingLevel: 'auto',
    lines: heading(c.cta.heading),
    body: toBody([{ type: 'body', body: para(c.cta.body) }], { quotePhoto: false }),
    buttons: [
      { label: 'Schedule a visit', link: url(visit), variant: 'primary' },
      { label: 'Ask a question', link: url('/contact'), variant: 'light' },
    ],
    ...(t === 'bold' && photos.cta ? { image: photos.cta, overlayStrength: 75 } : {}),
    textAlign: t === 'bold' ? 'left' : 'center',
    position: 'center',
    surface: t === 'heritage' ? 'soft' : t === 'warm' ? 'accent' : 'dark',
    textPanel: 'none',
    eyebrowRule: 'both',
    entrance: 'on',
  }

  return [hero, differentiators, problem, outcomes, quote, events, steps, cta]
}
