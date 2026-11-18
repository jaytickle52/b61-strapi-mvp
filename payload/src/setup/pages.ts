import { cardsFrom, statsFrom } from '../b61/demo'
import type { ThemeName } from '../b61/lib/style'
import { toBody } from '../b61/kit/body'
import { cards, cta, faq, form, hero, para, prose, quote } from '../templates/pages'
import { schoolboxHome } from '../templates/schoolbox'
import { HOME_SPOTS, homeCopy, homePhotos, type Spot, type SpotKind, type SpotValues } from './spots'

/*
 * The Schoolbox pages and their spots. Home has its own theme layouts
 * (templates/schoolbox.ts); the other pages use the shared page elements.
 * Every page reads the school's spots and falls back to [bracketed] guidance,
 * so a half-finished setup still builds whole pages. Sections marked
 * "optional" appear only when the school filled them (a new school has no
 * results to report yet, for example).
 */

export type BuildContext = { schoolName: string; theme: ThemeName; forms: Record<string, number | string | undefined>; ownPhoto: (n?: number) => number | undefined }
export type SchoolboxPage = { key: string; title: string; slug: string; spots: Spot[]; sections: (r: Reader, c: BuildContext) => any[] }

/** Reads one page's spots. */
export class Reader {
  constructor(private page: string, private spots: SpotValues) {}
  private raw(id: string) {
    const v = this.spots[`${this.page}.${id}`]
    return typeof v === 'string' && v.trim() ? v.trim() : typeof v === 'number' ? v : null
  }
  /** The school's words, or the guidance. */
  s(id: string, fallback: string): string {
    const v = this.raw(id)
    return typeof v === 'string' ? v : fallback
  }
  has(...ids: string[]) {
    return ids.some((id) => this.raw(id) != null)
  }
  photo(id: string): number | undefined {
    const v = this.raw(`photo.${id}`)
    const n = typeof v === 'string' && /^\d+$/.test(v) ? Number(v) : v
    return typeof n === 'number' ? n : undefined
  }
}

// --- spot helpers -----------------------------------------------------------

const sp = (page: string) => {
  const one = (id: string, label: string, kind: SpotKind, max?: number, help?: string): Spot => ({ id: `${page}.${id}`, page, label, kind, ...(max ? { max } : {}), ...(help ? { help } : {}) })
  return {
    text: (id: string, label: string, max: number, help?: string) => one(id, label, max > 160 ? 'long' : 'text', max, help),
    link: (id: string, label: string, help?: string) => one(id, label, 'link', 300, help ?? 'A full web address (https://…) or a page on this site (/calendar).'),
    photo: (id: string, label: string, help?: string) => one(`photo.${id}`, label, 'photo', undefined, help),
    heroSpots: (headline = true) => [
      ...(headline ? [one('hero.line1', 'Headline, first part', 'text', 40), one('hero.line2', 'Headline, second part', 'text', 40, 'Shown in the accent style.')] : []),
      one('hero.intro', 'Sentence under the headline', 'text', 200),
      one('photo.hero', 'Top photo', 'photo', undefined, 'Optional. Without one, the top of the page is a colour band.'),
    ],
    cta: () => [one('cta.heading', 'Closing invitation: headline', 'text', 60), one('cta.body', 'Closing invitation: one line', 'text', 160)],
    trio: (id: string, label: string, max = 160) =>
      [1, 2, 3].flatMap((n) => [one(`${id}${n}.title`, `${label} ${n}: title`, 'text', 40), one(`${id}${n}.body`, `${label} ${n}: description`, max > 160 ? 'long' : 'text', max)]),
  }
}

/** The page's top band, with the school's photo beside it when there is one. */
function top(r: Reader, c: BuildContext, o: { eyebrow: string; line1: string; line2?: string; sub: string; buttons?: [string, string][] }) {
  const h: any = hero({
    eyebrow: o.eyebrow,
    lines: [r.s('hero.line1', o.line1), ...(o.line2 != null ? [r.s('hero.line2', o.line2)] : [])],
    sub: r.s('hero.intro', o.sub),
    buttons: o.buttons,
    size: 'compact',
  })
  const img = c.ownPhoto(r.photo('hero'))
  return img ? { ...h, layoutMode: 'split', splitSide: 'right', image: img } : h
}

const trio = (r: Reader, id: string, guide: [string, string][]): [string, string][] =>
  guide.map(([t, b], i) => [r.s(`${id}${i + 1}.title`, t), r.s(`${id}${i + 1}.body`, b)])

const closing = (r: Reader, heading: string, body: string, buttons: [string, string][]) => cta(r.s('cta.heading', heading), r.s('cta.body', body), buttons)

/** The founder's story: beside their photo when there is one. */
function founder(text: string, image?: number) {
  if (!image) return prose({ eyebrow: 'Our founder', heading: 'Why we started', text: [text], surface: 'soft' })
  return {
    blockType: 'b61Split',
    eyebrow: 'Our founder',
    headingLevel: 'auto',
    lines: [{ text: 'Why we started', emphasize: false }],
    body: toBody([{ type: 'body', body: para(text) }]),
    media: 'photo',
    image,
    imageShape: 'fixed',
    imageSide: 'left',
    verticalPosition: 'center',
    stackOrder: 'text',
    columnHeight: 'fit',
    headingAlign: 'left',
    surface: 'soft',
    textPanel: 'none',
    entrance: 'on',
  }
}

const VISIT: [string, string] = ['Schedule a visit', '/schedule-a-tour']

// --- the pages --------------------------------------------------------------

const about = sp('about')
const admissions = sp('admissions')
const academics = sp('academics')
const leadership = sp('leadership')
const tuition = sp('tuition')
const visit = sp('visit')
const disc = sp('discipleship')
const families = sp('families')
const support = sp('support')

export const SCHOOLBOX_PAGES: SchoolboxPage[] = [
  {
    key: 'home',
    title: 'Home',
    slug: 'home',
    spots: HOME_SPOTS,
    // Home is special: its own layouts per theme (templates/schoolbox.ts).
    sections: () => [],
  },
  {
    key: 'about',
    title: 'About',
    slug: 'about',
    spots: [
      ...about.heroSpots(),
      about.text('mission.text', 'Mission statement', 300),
      about.text('mission.daily', 'How the mission shows up on an ordinary day', 400),
      about.text('mission.line', 'A short line you want families to remember', 80),
      ...about.trio('value', 'Value'),
      about.text('story.founding', 'How the school began (or why you are starting it)', 500),
      about.text('story.today', 'Where the school is today (or where it is headed)', 400),
      about.text('story.founder', 'Optional: the founder’s story, in a few sentences', 600, 'Adds a "Our founder" section.'),
      about.photo('founder', 'Optional: founder photo'),
      ...about.cta(),
    ],
    sections: (r, c) => [
      top(r, c, { eyebrow: 'About us', line1: '[A headline about', line2: 'who you are]', sub: `[What ${c.schoolName} exists to do, in one or two sentences.]`, buttons: [VISIT] }),
      prose({
        eyebrow: 'Our mission',
        heading: 'Why we exist',
        text: [r.s('mission.text', '[Your mission statement.]'), r.s('mission.daily', '[How the mission shows up in an ordinary school day.]')],
        emphasis: r.s('mission.line', '[A short line you want families to remember.]'),
      }),
      cards('What we value', null, trio(r, 'value', [['[Value one]', '[One or two sentences on what this looks like in the classroom.]'], ['[Value two]', '[One or two sentences.]'], ['[Value three]', '[One or two sentences.]']]), 'muted'),
      prose({ eyebrow: 'Our story', heading: 'How we began', text: [r.s('story.founding', '[When and why the school was founded, and by whom.]'), r.s('story.today', '[Where the school is today.]')] }),
      // optional
      ...(r.has('story.founder') ? [founder(r.s('story.founder', ''), c.ownPhoto(r.photo('founder')))] : []),
      closing(r, 'Come and visit', 'Walk the halls, sit in on a class and meet our teachers.', [VISIT, ['Contact us', '/contact']]),
    ],
  },
  {
    key: 'admissions',
    title: 'Admissions',
    slug: 'admissions',
    spots: [
      ...admissions.heroSpots(),
      admissions.text('who.text', 'Optional: who the school is for', 400, 'Adds a "Who we serve" section.'),
      admissions.text('step4.body', 'What happens after a family is accepted', 200),
      admissions.text('faq.visit', 'Answer: When can we visit?', 300),
      admissions.text('faq.apply', 'Answer: When should we apply?', 300),
      admissions.text('faq.grades', 'Answer: Which grades do you serve?', 300),
      admissions.text('faq.aid', 'Answer: Is there help with tuition?', 300),
      ...admissions.cta(),
    ],
    sections: (r, c) => [
      top(r, c, { eyebrow: 'Admissions', line1: 'Find your place', line2: `at ${c.schoolName}`, sub: 'We would love to get to know your family. Here is how it works.', buttons: [['Start an application', '/apply'], VISIT] }),
      ...(r.has('who.text') ? [prose({ eyebrow: 'Who we serve', heading: 'Is this the right school for your family?', text: [r.s('who.text', '')] })] : []),
      cards('Four steps to enroll', null, [
        ['1. Inquire', 'Tell us a little about your family and we’ll be in touch.', '/inquire'],
        ['2. Visit', 'Tour the campus, see classes in action and meet our teachers.', '/schedule-a-tour'],
        ['3. Apply', 'Complete the online application and send in records.', '/apply'],
        ['4. Enroll', r.s('step4.body', '[What happens after acceptance: interview, shadow day, enrollment agreement.]')],
      ]),
      faq('Common questions', [
        ['When can we visit?', r.s('faq.visit', '[Tour days and times.]')],
        ['When should we apply?', r.s('faq.apply', '[Application dates and deadlines.]')],
        ['Which grades do you serve?', r.s('faq.grades', '[Grades now, and any you plan to add.]')],
        ['Is there help with tuition?', r.s('faq.aid', '[A sentence on aid and how to apply. More on the Tuition & Aid page.]')],
      ], 'Admissions'),
      ...form(c.forms['Admissions inquiry'], 'Request information', 'Get in touch'),
      closing(r, 'Ready for the next step?', 'Start with a visit. It is the best way to know if we are the right fit.', [VISIT, ['Tuition & Aid', '/tuition-and-aid']]),
    ],
  },
  {
    key: 'academics',
    title: 'Academics',
    slug: 'academics',
    spots: [
      ...academics.heroSpots(),
      academics.text('approach.text', 'How you teach', 400),
      academics.text('approach.lesson', 'What a typical lesson looks like', 400),
      academics.text('approach.line', 'A short line that sums it up', 80),
      academics.text('philosophy.text', 'Optional: your educational philosophy', 600, 'Classical, college-prep, Montessori, blended… Adds an "Our educational philosophy" section.'),
      ...academics.trio('division', 'Grade level', 200),
      ...[1, 2, 3].flatMap((n) => [academics.text(`stat${n}.value`, `Optional result ${n}: number`, 12, 'Only for schools with results to report. Adds a "Results" band.'), academics.text(`stat${n}.label`, `Optional result ${n}: what it measures`, 40)]),
      ...academics.trio('beyond', 'Optional: beyond the classroom', 160),
      ...academics.cta(),
    ],
    sections: (r, c) => [
      top(r, c, { eyebrow: 'Academics', line1: '[A headline about', line2: 'how students learn here]', sub: '[One or two sentences on how you approach teaching and learning.]', buttons: [VISIT] }),
      prose({
        eyebrow: 'Our approach',
        heading: 'How we teach',
        text: [r.s('approach.text', '[How you teach, and why.]'), r.s('approach.lesson', '[What a typical lesson looks like.]')],
        emphasis: r.s('approach.line', '[A short line that sums it up.]'),
      }),
      ...(r.has('philosophy.text') ? [prose({ eyebrow: 'Our educational philosophy', heading: 'What shapes our teaching', text: [r.s('philosophy.text', '')], surface: 'soft' })] : []),
      cards('Grade by grade', null, trio(r, 'division', [['[Lower school]', '[Grades and what students learn.]'], ['[Middle school]', '[Grades and what students learn.]'], ['[Upper school]', '[Grades and what students learn.]']]), 'muted'),
      ...(r.has('stat1.value', 'stat2.value', 'stat3.value')
        ? [statsFrom({ heading: 'Results', tone: 'light', stats: [1, 2, 3].filter((n) => r.has(`stat${n}.value`)).map((n) => ({ value: r.s(`stat${n}.value`, ''), label: r.s(`stat${n}.label`, '') })) })]
        : []),
      ...(r.has('beyond1.title', 'beyond2.title', 'beyond3.title')
        ? [cards('Beyond the classroom', null, [1, 2, 3].filter((n) => r.has(`beyond${n}.title`)).map((n) => [r.s(`beyond${n}.title`, ''), r.s(`beyond${n}.body`, '')] as [string, string]))]
        : []),
      closing(r, 'See a class in action', 'Visit during the school day and see how our students learn.', [VISIT, ['Request information', '/inquire']]),
    ],
  },
  {
    key: 'leadership',
    title: 'Leadership & Staff',
    slug: 'leadership-and-staff',
    spots: [
      ...leadership.heroSpots(false),
      leadership.text('message.heading', 'Head of school’s welcome: headline', 60),
      leadership.text('message.text', 'Head of school’s welcome', 800),
      leadership.text('message.who', 'Name and title', 80, 'For example "Jane Smith, Head of School".'),
      ...leadership.cta(),
    ],
    sections: (r, c) => [
      top(r, c, { eyebrow: 'Leadership & Staff', line1: 'The people who', line2: 'know your child', sub: '[One sentence on the team: who they are and why they teach here.]' }),
      prose({
        eyebrow: 'A welcome',
        heading: r.s('message.heading', '[A headline for the head of school’s welcome]'),
        text: [r.s('message.text', '[A short welcome from the head of school: why they lead here and what they want for every student.]'), `— ${r.s('message.who', '[Name, Head of School]')}`],
      }),
      // Filled from Staff (one card per person, with their photo).
      cardsFrom({ heading: 'Our team', source: 'staff', limit: 24, columns: 'four', tone: 'muted' }),
      closing(r, 'Meet us in person', 'The best way to know our teachers is to visit a class.', [VISIT, ['Contact us', '/contact']]),
    ],
  },
  {
    key: 'tuition',
    title: 'Tuition & Aid',
    slug: 'tuition-and-aid',
    spots: [
      ...tuition.heroSpots(false),
      tuition.text('tuition.text', 'Tuition for this year', 500, 'Amounts by grade, or how tuition is set.'),
      tuition.text('tuition.included', 'What tuition includes, and any other fees', 400),
      tuition.text('aid.text', 'How financial aid and scholarships work', 500),
      tuition.text('aid.programs', 'Optional: state programs families can use', 500, 'ESA, tax-credit scholarships, vouchers. Adds a section.'),
      tuition.text('faq.siblings', 'Answer: Is there a discount for siblings?', 300),
      tuition.text('faq.due', 'Answer: When is tuition due?', 300),
      tuition.text('faq.apply', 'Answer: How do we apply for aid?', 300),
      ...tuition.cta(),
    ],
    sections: (r, c) => [
      top(r, c, { eyebrow: 'Tuition & Aid', line1: 'An investment', line2: 'within reach', sub: '[One sentence: you want cost to never be the reason a family doesn’t ask.]' }),
      prose({ eyebrow: 'Tuition', heading: 'What it costs', text: [r.s('tuition.text', '[Tuition for this year, by grade.]'), r.s('tuition.included', '[What tuition includes, and any other fees.]')] }),
      prose({ eyebrow: 'Financial aid', heading: 'Help with tuition', text: [r.s('aid.text', '[How need-based aid and scholarships work.]')], surface: 'soft' }),
      ...(r.has('aid.programs') ? [prose({ eyebrow: 'State programs', heading: 'Programs your family may qualify for', text: [r.s('aid.programs', '')] })] : []),
      faq('Tuition questions', [
        ['Is there a discount for siblings?', r.s('faq.siblings', '[Yes or no, and how much.]')],
        ['When is tuition due?', r.s('faq.due', '[Payment plans and due dates.]')],
        ['How do we apply for aid?', r.s('faq.apply', '[Where to apply and by when.]')],
      ], 'Tuition'),
      closing(r, 'Let’s talk it through', 'Every family’s situation is different. We are glad to help you plan.', [['Ask a question', '/contact'], VISIT]),
    ],
  },
  {
    key: 'visit',
    title: 'Schedule a Visit',
    // Every school already has this page for the tour form (src/forms/standard.ts).
    slug: 'schedule-a-tour',
    spots: [
      ...visit.heroSpots(false),
      visit.text('visit.what', 'What a visit looks like', 500),
      visit.text('visit.times', 'When visits happen', 200, 'Days and times, or "any school day by appointment".'),
      ...visit.cta(),
    ],
    sections: (r, c) => [
      top(r, c, { eyebrow: 'Visit', line1: 'Come see us', sub: 'Pick a day that suits you and we will confirm a time.' }),
      prose({ eyebrow: 'Your visit', heading: 'What to expect', text: [r.s('visit.what', '[What happens on a visit: who you meet, what you see, how long it takes.]'), r.s('visit.times', '[When visits happen.]')] }),
      ...form(c.forms['Tour request'], 'Request a visit', 'Schedule a visit'),
      closing(r, 'Not ready to visit yet?', 'Ask us anything. We will reply within a school day.', [['Ask a question', '/contact'], ['Admissions', '/admissions']]),
    ],
  },
  {
    key: 'discipleship',
    title: 'Discipleship',
    slug: 'discipleship',
    spots: [
      ...disc.heroSpots(),
      disc.text('approach.text', 'How faith shapes the school day', 500),
      disc.text('approach.line', 'A short line that sums it up', 80),
      ...disc.trio('belief', 'What we believe'),
      ...disc.trio('practice', 'How students grow in faith'),
      disc.text('quote.text', 'Optional: a parent’s or student’s words', 240),
      disc.text('quote.who', 'Optional: who said it', 60),
      ...disc.cta(),
    ],
    sections: (r, c) => [
      top(r, c, { eyebrow: 'Discipleship', line1: '[A headline about', line2: 'faith at the center]', sub: '[One or two sentences on how faith shapes everything here.]', buttons: [VISIT] }),
      prose({ eyebrow: 'Our approach', heading: 'Faith in every subject', text: [r.s('approach.text', '[How faith shapes the school day, not just Bible class.]')], emphasis: r.s('approach.line', '[A short line that sums it up.]') }),
      cards('What we believe', null, trio(r, 'belief', [['[Belief one]', '[One or two sentences.]'], ['[Belief two]', '[One or two sentences.]'], ['[Belief three]', '[One or two sentences.]']]), 'muted'),
      cards('How students grow', null, trio(r, 'practice', [['[Chapel]', '[How often and what it looks like.]'], ['[Bible]', '[How Scripture is taught.]'], ['[Service]', '[How students serve others.]']])),
      ...(r.has('quote.text') ? [quote(r.s('quote.text', ''), r.s('quote.who', ''))] : []),
      closing(r, 'See it for yourself', 'Visit and see what a faith-filled school day looks like.', [VISIT, ['Contact us', '/contact']]),
    ],
  },
  {
    key: 'families',
    title: 'Current Families',
    slug: 'current-families',
    spots: [
      ...families.heroSpots(false),
      ...[1, 2, 3, 4].flatMap((n) => [families.text(`link${n}.title`, `Quick link ${n}: name`, 40, 'For example Parent portal, Lunch menu, Handbook, Uniforms.'), families.link(`link${n}.url`, `Quick link ${n}: address`), families.text(`link${n}.body`, `Quick link ${n}: one line`, 100)]),
      families.text('contact.text', 'Who to contact for what', 400, 'Office, attendance, billing, and how to reach them.'),
    ],
    sections: (r, c) => [
      top(r, c, { eyebrow: 'Current Families', line1: 'Everything you need,', line2: 'in one place', sub: '[One sentence for current families.]' }),
      cards('Quick links', null, [1, 2, 3, 4].map((n) => [r.s(`link${n}.title`, `[Link ${n}]`), r.s(`link${n}.body`, '[What it is for.]'), r.has(`link${n}.url`) ? r.s(`link${n}.url`, '') : undefined] as [string, string, string?])),
      cardsFrom({ heading: 'Coming up', source: 'upcoming-events', limit: 6, columns: 'three', tone: 'muted' }),
      prose({ eyebrow: 'Contact', heading: 'Who to ask', text: [r.s('contact.text', '[Office hours, attendance line, billing contact.]')] }),
    ],
  },
  {
    key: 'support',
    title: 'Support',
    slug: 'support',
    spots: [
      ...support.heroSpots(),
      support.text('why.text', 'Why giving matters', 500),
      support.text('why.line', 'A short line on the difference a gift makes', 80),
      support.link('give.url', 'Online giving page', 'Where the "Give now" buttons go.'),
      support.text('give.check', 'Giving by check', 200, 'Who to make it payable to, and the mailing address.'),
      support.text('give.other', 'Other ways to give', 300, 'Stock, employer matching, state tax-credit programs.'),
      ...support.cta(),
    ],
    sections: (r, c) => {
      const give: [string, string] = ['Give now', r.has('give.url') ? r.s('give.url', '') : '/contact']
      return [
        top(r, c, { eyebrow: 'Support', line1: 'Invest in the', line2: 'next generation', sub: `Your gift helps ${c.schoolName} serve more families, today and for years to come.`, buttons: [give] }),
        prose({ eyebrow: 'Why give', heading: 'Tuition doesn’t cover everything', text: [r.s('why.text', '[What giving makes possible: tuition help, teachers, a building.]')], emphasis: r.s('why.line', '[A short line on the difference a gift makes.]') }),
        cards('Ways to give', null, [
          ['Online', r.has('give.url') ? 'Give by card or bank transfer.' : '[Give by card or bank transfer. Add your giving page.]', r.has('give.url') ? r.s('give.url', '') : undefined],
          ['By check', r.s('give.check', `[Payable to ${c.schoolName}, and the mailing address.]`)],
          ['Other gifts', r.s('give.other', '[Stock, employer matching, state tax-credit programs.]')],
        ] as [string, string, string?][], 'muted'),
        closing(r, 'Thank you', 'Every gift, of every size, makes a difference.', [give, ['Ask about giving', '/contact']]),
      ]
    },
  },
]

/** The sections for one page. */
export function buildPage(page: SchoolboxPage, spots: SpotValues, c: BuildContext): any[] {
  if (page.key === 'home') {
    const p = homePhotos(spots)
    return schoolboxHome(c.theme, homeCopy(spots, c.schoolName), { hero: c.ownPhoto(p.hero), problem: c.ownPhoto(p.problem), outcomes: (p.outcomes ?? []).map(c.ownPhoto), cta: c.ownPhoto(p.cta) })
  }
  return page.sections(new Reader(page.key, spots), c)
}

export const ALL_SPOTS: Spot[] = SCHOOLBOX_PAGES.flatMap((p) => p.spots)
export const spotById = new Map(ALL_SPOTS.map((s) => [s.id, s]))
