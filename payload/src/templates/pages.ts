import { toBody } from '../b61/kit/body'
import { cardsFrom, statsFrom } from '../b61/demo'

/*
 * Page templates: ready-made starting layouts for the pages every school site
 * has. "New page from a template" (Pages list) creates a draft from one; the
 * school then edits words and adds photos. Templates only use the B61
 * elements, so a page made from one is edited like any other.
 *
 * Facts only the school knows are left in [square brackets] so nobody
 * publishes a made-up number by accident. Photos are left for the school to
 * add: every element here looks right without one.
 */

export type TemplateContext = {
  schoolName: string
  tagline?: string | null
  phone?: string | null
  email?: string | null
  address?: string | null
  /** The school's standard forms (Forms > Forms), by title. */
  forms: Record<string, number | string | undefined>
}

export type PageTemplate = {
  key: string
  label: string
  description: string
  title: string
  slug: string
  sections: (c: TemplateContext) => any[]
}

const para = (text: string) => ({
  root: {
    type: 'root', format: '', indent: 0, version: 1, direction: 'ltr',
    children: [{ type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, textStyle: '',
      children: [{ type: 'text', text, format: 0, style: '', mode: 'normal', detail: 0, version: 1 }] }],
  },
})
const url = (u: string) => ({ type: 'url', url: u })
const lines = (...t: string[]) => t.map((text, i) => ({ text, emphasize: i === t.length - 1 && t.length > 1 }))

const hero = (o: { eyebrow: string; lines: string[]; sub: string; buttons?: [string, string][]; size?: 'compact' | 'standard' }) => ({
  blockType: 'b61Hero',
  eyebrow: o.eyebrow,
  headingLevel: 'auto',
  lines: lines(...o.lines),
  subheadline: o.sub,
  subheadlineScale: 'body',
  buttons: (o.buttons ?? []).map(([label, href], i) => ({ label, link: url(href), variant: i === 0 ? 'primary' : 'light' })),
  layoutMode: 'band',
  bandSize: o.size ?? 'standard',
  textAlign: 'left',
  surface: 'primary',
  entrance: 'on',
})

const prose = (o: { eyebrow?: string; heading: string; text: string[]; emphasis?: string; surface?: string }) => ({
  blockType: 'b61Prose',
  ...(o.eyebrow ? { eyebrow: o.eyebrow } : {}),
  headingLevel: 'auto',
  lines: [{ text: o.heading, emphasize: false }],
  body: toBody(
    [...o.text.map((t) => ({ type: 'body', body: para(t) })), ...(o.emphasis ? [{ type: 'emphasis', scale: 'display', text: o.emphasis }] : [])],
    { emphasisScale: true, dividers: true },
  ),
  headPosition: 'beside',
  textAlign: 'left',
  position: 'center',
  headingWidth: 'text',
  surface: o.surface ?? 'none',
  entrance: 'on',
})

const cards = (heading: string, intro: string | null, items: [string, string, string?][], tone = 'light') =>
  cardsFrom({
    heading,
    intro,
    source: 'manual',
    columns: items.length === 4 ? 'four' : items.length === 2 ? 'two' : 'three',
    tone,
    cards: items.map(([title, body, link]) => ({ title, body, link: link ?? null })),
  })

const faq = (heading: string, items: [string, string][], eyebrow = 'Questions') => ({
  blockType: 'b61Accordion',
  eyebrow,
  lines: [{ text: heading }],
  itemStyle: 'divided',
  items: items.map(([title, body]) => ({ title, body: para(body) })),
})

const quote = (q: string, who: string) => ({ blockType: 'b61Testimonial', eyebrow: 'From our families', surface: 'soft', quote: q, attribution: who })

const cta = (heading: string, body: string, buttons: [string, string][], surface = 'accent') => ({
  blockType: 'b61Cta',
  headingLevel: 'auto',
  lines: [{ text: heading, emphasize: false }],
  body: toBody([{ type: 'body', body: para(body) }], { quotePhoto: false }),
  buttons: buttons.map(([label, href], i) => ({ label, link: url(href), variant: i === 0 ? 'primary' : 'light' })),
  textAlign: 'center',
  position: 'center',
  surface,
  textPanel: 'none',
  eyebrowRule: 'both',
  entrance: 'on',
})

const form = (id: number | string | undefined, heading: string, eyebrow: string) =>
  id ? [{ blockType: 'b61Form', form: id, eyebrow, lines: [{ text: heading }], surface: 'soft', card: 'card' }] : []

const buttonBar = (a: [string, string], b: [string, string]) => ({
  blockType: 'b61ButtonBar', firstLabel: a[0], firstLink: url(a[1]), secondLabel: b[0], secondLink: url(b[1]), size: 'large',
})

export const PAGE_TEMPLATES: PageTemplate[] = [
  {
    key: 'blank',
    label: 'Blank page',
    description: 'Just a title. Add sections yourself.',
    title: 'New page',
    slug: 'new-page',
    sections: () => [],
  },
  {
    key: 'home',
    label: 'Home',
    description: 'Welcome, quick facts, programs, upcoming events, a family quote and a visit invitation.',
    title: 'Home',
    slug: 'home',
    sections: (c) => [
      hero({
        eyebrow: 'Now enrolling',
        lines: c.tagline ? [c.tagline] : ['Welcome to', c.schoolName],
        sub: '[One or two sentences on who you are and who you serve. What would a family most want to know first?]',
        buttons: [['Schedule a tour', '/schedule-a-tour'], ['Request information', '/inquire']],
      }),
      statsFrom({
        heading: `${c.schoolName} at a glance`,
        tone: 'light',
        stats: [
          { value: '[K–12]', label: 'Grades served' },
          { value: '[12:1]', label: 'Student to teacher ratio' },
          { value: '[Year]', label: 'Serving families since' },
        ],
      }),
      cardsFrom({ heading: 'Programs', intro: 'A path for every stage of your child’s growth.', source: 'programs', limit: 3, columns: 'three', tone: 'muted' }),
      cardsFrom({ heading: 'Upcoming events', source: 'upcoming-events', limit: 3, columns: 'three', tone: 'light' }),
      quote('[A sentence or two from a current parent about what makes your school different.]', '[Parent of a 3rd grader]'),
      cta('See it for yourself', 'The best way to know if we are the right fit is to visit.', [['Schedule a tour', '/schedule-a-tour'], ['Ask a question', '/contact']]),
    ],
  },
  {
    key: 'about',
    label: 'About',
    description: 'Mission, what you believe, your story, leadership and an invitation to visit.',
    title: 'About',
    slug: 'about',
    sections: (c) => [
      hero({ eyebrow: 'About us', lines: ['A school that knows', 'every child by name'], sub: `[What ${c.schoolName} exists to do, in one or two sentences.]`, size: 'compact' }),
      prose({
        eyebrow: 'Our mission',
        heading: 'Why we exist',
        text: ['[Your mission statement.]', '[A short paragraph on how the mission shows up in an ordinary school day.]'],
        emphasis: '[A short line you want families to remember.]',
      }),
      cards('What we value', null, [
        ['[Value one]', '[One or two sentences on what this looks like in the classroom.]'],
        ['[Value two]', '[One or two sentences.]'],
        ['[Value three]', '[One or two sentences.]'],
      ], 'muted'),
      prose({ eyebrow: 'Our story', heading: 'How we began', text: ['[When and why the school was founded, and by whom.]', '[Where the school is today.]'] }),
      cardsFrom({ heading: 'Meet our leaders', source: 'staff', limit: 4, columns: 'four', tone: 'muted' }),
      cta('Come and visit', 'Walk the halls, sit in on a class and meet our teachers.', [['Schedule a tour', '/schedule-a-tour'], ['Contact us', '/contact']]),
    ],
  },
  {
    key: 'admissions',
    label: 'Admissions',
    description: 'How to apply in four steps, tuition and aid, common questions and the inquiry form.',
    title: 'Admissions',
    slug: 'admissions',
    sections: (c) => [
      hero({
        eyebrow: 'Admissions',
        lines: ['Find your place', `at ${c.schoolName}`],
        sub: 'We would love to get to know your family. Here is how it works.',
        buttons: [['Start an application', '/apply'], ['Schedule a tour', '/schedule-a-tour']],
      }),
      cards('Four steps to enroll', null, [
        ['1. Inquire', 'Tell us a little about your family and we’ll be in touch.', '/inquire'],
        ['2. Visit', 'Tour the campus, see classes in action and meet our teachers.', '/schedule-a-tour'],
        ['3. Apply', 'Complete the online application and send in records.', '/apply'],
        ['4. Enroll', '[What happens after acceptance: interview, shadow day, enrollment agreement.]'],
      ]),
      prose({
        eyebrow: 'Tuition',
        heading: 'Tuition and financial aid',
        text: ['[Tuition for this year, or a link to the tuition schedule.]', '[How need-based aid and scholarships work, including any state programs your families can use.]'],
        surface: 'soft',
      }),
      faq('Common questions', [
        ['When can we visit?', '[Tour days and times.]'],
        ['When should we apply?', '[Application dates and deadlines.]'],
        ['Is there tuition assistance?', '[A sentence on aid and how to apply.]'],
        ['Do you offer before and after care?', '[Hours and cost.]'],
      ], 'Admissions'),
      ...form(c.forms['Admissions inquiry'], 'Request information', 'Get in touch'),
    ],
  },
  {
    key: 'academics',
    label: 'Academics',
    description: 'Your approach to learning, each school division, results, and a next step.',
    title: 'Academics',
    slug: 'academics',
    sections: () => [
      hero({ eyebrow: 'Academics', lines: ['Teaching the whole child,', 'mind and heart'], sub: '[One or two sentences on how you approach teaching and learning.]', size: 'compact' }),
      prose({
        eyebrow: 'Our approach',
        heading: 'How we teach',
        text: ['[Your educational philosophy: classical, college-prep, Montessori, blended…]', '[What a typical lesson looks like.]'],
        emphasis: '[A short line that sums it up.]',
      }),
      cardsFrom({ heading: 'Our schools', intro: 'Each stage builds on the last.', source: 'programs', limit: 6, columns: 'three', tone: 'muted' }),
      statsFrom({
        heading: 'Results',
        tone: 'light',
        stats: [
          { value: '[98%]', label: 'Go on to college' },
          { value: '[Score]', label: 'Average ACT / SAT' },
          { value: '[Number]', label: 'AP or dual-credit courses' },
        ],
      }),
      cards('Beyond the classroom', null, [
        ['[Fine arts]', '[Music, art, drama.]'],
        ['[Service]', '[How students serve the community.]'],
        ['[Clubs]', '[Robotics, debate, yearbook…]'],
      ]),
      cta('See a class in action', 'Visit during the school day and see how our students learn.', [['Schedule a tour', '/schedule-a-tour'], ['Request information', '/inquire']]),
    ],
  },
  {
    key: 'athletics',
    label: 'Athletics',
    description: 'Your athletics philosophy, sports by season, upcoming games and a contact.',
    title: 'Athletics',
    slug: 'athletics',
    sections: (c) => [
      hero({ eyebrow: 'Athletics', lines: ['Compete with excellence,', 'play with character'], sub: '[Conference, mascot, and what you want athletes to learn.]', size: 'compact' }),
      prose({
        eyebrow: 'Our philosophy',
        heading: 'More than the scoreboard',
        text: ['[How athletics fit your mission.]', '[Who can play: middle school, JV, varsity.]'],
      }),
      cards('Sports by season', null, [
        ['Fall', '[e.g. Soccer, Volleyball, Cross country]'],
        ['Winter', '[e.g. Basketball, Cheer]'],
        ['Spring', '[e.g. Baseball, Softball, Track]'],
      ], 'muted'),
      cardsFrom({ heading: 'Upcoming games and events', source: 'upcoming-events', limit: 6, columns: 'three', tone: 'light' }),
      prose({
        eyebrow: 'Contact',
        heading: 'Questions about athletics?',
        text: [`[Athletic Director's name], Athletic Director${c.email ? ` · ${c.email}` : ''}${c.phone ? ` · ${c.phone}` : ''}`],
      }),
      buttonBar(['Full calendar', '/events?view=month'], ['Contact us', '/contact']),
    ],
  },
  {
    key: 'give',
    label: 'Give',
    description: 'Why giving matters, its impact, ways to give and a gift link.',
    title: 'Give',
    slug: 'give',
    sections: (c) => [
      hero({
        eyebrow: 'Give',
        lines: ['Invest in the', 'next generation'],
        sub: `Your gift helps ${c.schoolName} serve more families, today and for years to come.`,
        buttons: [['Give now', '/contact']],
      }),
      prose({
        eyebrow: 'Why give',
        heading: 'Tuition doesn’t cover everything',
        text: ['[What giving makes possible: tuition assistance, teachers, facilities.]', '[This year’s campaign or giving priority.]'],
        emphasis: '[A short line on the difference a gift makes.]',
      }),
      statsFrom({
        heading: 'Your impact',
        tone: 'light',
        stats: [
          { value: '[$Amount]', label: 'In tuition assistance this year' },
          { value: '[Number]', label: 'Families who give' },
          { value: '[Percent]', label: 'Of our budget comes from gifts' },
        ],
      }),
      cards('Ways to give', null, [
        ['Online', '[Give by card or bank transfer. Replace the "Give now" link with your giving page.]'],
        ['By check', `[Payable to ${c.schoolName}${c.address ? `, mailed to ${c.address.replace(/\n/g, ', ')}` : ''}.]`],
        ['Other gifts', '[Stock, employer matching, planned giving, state tax-credit programs.]'],
      ], 'muted'),
      cta('Thank you', 'Every gift, of every size, makes a difference.', [['Give now', '/contact'], ['Ask about giving', '/contact']]),
    ],
  },
]

export const templateByKey = (key: string) => PAGE_TEMPLATES.find((t) => t.key === key)
