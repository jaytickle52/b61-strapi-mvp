import type { Payload } from 'payload'
import type { School } from '../payload-types'
import { ensureDemoImages } from './demo'
import { schoolboxHome, type SchoolboxCopy } from '../templates/schoolbox'
import type { ThemeName } from './lib/style'

/*
 * The Schoolbox demo school (Hourglass Christian School). The seed gives it
 * the Schoolbox home page in Warm (its own theme); this adds one copy of the Schoolbox home page per theme
 * (/home-heritage, /home-warm, /home-bold) to compare the three. Open one in
 * its theme with /next/theme/<theme>?school=schoolbox&to=/home-<theme>; the
 * preview bar then swaps page and theme together. Created once, never
 * overwritten, so edits made by hand stay.
 */
export const SCHOOLBOX_COPY: SchoolboxCopy = {
  schoolName: 'Hourglass Christian School',
  heroEyebrow: 'Now enrolling for fall',
  tagline: ['Rooted in faith.', 'Ready to lead.'],
  intro: 'Hourglass Christian School is a K-12 Christian school in Greenville, SC, where every student is known, challenged and loved.',
  differentiators: [
    { icon: 'heart', title: 'Known by name', body: 'Small classes mean teachers know each child, and each child knows they matter.' },
    { icon: 'book', title: 'Learning that lasts', body: 'Strong readers, clear thinkers and confident writers, grade after grade.' },
    { icon: 'cross', title: 'Faith at the center', body: 'Scripture shapes every subject, not just Bible class.' },
  ],
  problem: {
    eyebrow: 'Why families choose us',
    lines: ['You want more than good grades.', 'So do we.'],
    body: [
      'Most Christian parents want children who are spiritually rooted and academically ready. Too often, school delivers one at the cost of the other.',
      'At Hourglass, faith and learning grow together. Teachers disciple as they teach, and students leave ready for college, work and a life of service.',
    ],
  },
  outcomes: {
    heading: 'Where our students go',
    intro: 'What families see by graduation day.',
    items: [
      { title: 'College ready', body: '96% of graduates go on to college, many with scholarships.' },
      { title: 'Confident leaders', body: 'Every senior leads a service project from plan to finish.' },
      { title: 'Rooted in faith', body: 'Students own a faith that holds up to hard questions.' },
    ],
  },
  quote: {
    text: 'Our son struggled at his last school. Within a year his teacher had him caught up and loving to read.',
    who: 'Parent of a 4th grader',
  },
  steps: [
    { title: 'Visit', body: 'Tour the campus, sit in on a class and meet our teachers.' },
    { title: 'Apply', body: 'Complete the online application; we will help with every step.' },
    { title: 'Enroll', body: 'Meet with our admissions team and welcome to the family.' },
  ],
  cta: { heading: 'Come see it for yourself', body: 'Most families know within the first ten minutes of a visit.' },
}

/** Placeholder photos for the Schoolbox page, from the school's four demo images. */
export const schoolboxPhotos = (imgs: number[]) => ({ hero: imgs[0], problem: imgs[2], outcomes: [imgs[1], imgs[3], imgs[2]], cta: imgs[3] })

const THEME_PAGES: ThemeName[] = ['heritage', 'warm', 'bold']

export async function ensureSchoolboxDemo(payload: Payload, school: School) {
  const mine = { school: { equals: school.id } }
  const settings = (await payload.find({ collection: 'school-settings', where: mine, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
  const imgs = (await ensureDemoImages(payload, { a: settings?.primaryColor || '#1E2D4A', b: settings?.secondaryColor || '#E58E5A' }, school.id as number)) as number[]
  const photos = schoolboxPhotos(imgs)
  const pages = (await payload.find({ collection: 'pages', where: mine, pagination: false, depth: 0, draft: true, overrideAccess: true, select: { slug: true, title: true } })).docs as any[]
  const bySlug = new Map(pages.map((p) => [p.slug, p]))

  for (const theme of THEME_PAGES) {
    const slug = `home-${theme}`
    if (bySlug.has(slug)) continue
    await payload.create({
      collection: 'pages',
      data: {
        title: `Home (${theme[0].toUpperCase()}${theme.slice(1)})`,
        slug,
        generateSlug: false,
        school: school.id,
        meta: { description: `The Schoolbox home page in the ${theme} theme.` },
        sections: schoolboxHome(theme, SCHOOLBOX_COPY, photos),
        _status: 'published',
      } as any,
      overrideAccess: true,
    })
  }
  payload.logger.info(`[b61] Schoolbox demo pages ready for ${school.name}`)
}
