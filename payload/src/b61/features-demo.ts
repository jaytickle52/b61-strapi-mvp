import type { Payload } from 'payload'
import type { School } from '../payload-types'
import { addDays, ymd, zoned } from '../events/time'
import { profileUrl, splitAddress } from '../school/fields'
import { handle } from './chrome/demo'
import { cardsFrom } from './demo'

/*
 * Demo content for the school features (Thread F): news categories, an
 * announcement and an all-day event, added to the demo schools once. Each
 * part only runs when the school has none of that kind yet, so it never
 * touches a school's own work and is safe on every build.
 */
export async function ensureFeatureDemo(payload: Payload, school: School) {
  const mine = { school: { equals: school.id } }
  const ctx = { b61Demo: true }

  const cats = await payload.find({ collection: 'news-categories', where: mine, limit: 1, depth: 0, overrideAccess: true })
  if (cats.totalDocs === 0) {
    const made: Record<string, number | string> = {}
    for (const name of ['Academics', 'Athletics', 'Admissions', 'Community']) {
      const c = await payload.create({ collection: 'news-categories', data: { name, slug: name.toLowerCase(), generateSlug: false, school: school.id } as any, overrideAccess: true, context: ctx })
      made[name] = c.id
    }
    const tag: Record<string, string[]> = {
      'Robotics team heads to state': ['Academics', 'Community'],
      'Admissions open for next year': ['Admissions'],
      'New uniform supplier this spring': ['Community'],
    }
    const news = await payload.find({ collection: 'news', where: mine, limit: 50, depth: 0, overrideAccess: true })
    for (const n of news.docs as any[]) {
      const names = tag[n.title]
      if (!names) continue
      await payload.update({ collection: 'news', id: n.id, data: { categories: names.map((x) => made[x]) } as any, overrideAccess: true, context: ctx })
    }
    payload.logger.info(`[b61] News categories added for ${school.name}`)
  }

  const notices = await payload.find({ collection: 'announcements', where: mine, limit: 1, depth: 0, overrideAccess: true, draft: true })
  if (notices.totalDocs === 0) {
    await payload.create({
      collection: 'announcements',
      data: {
        school: school.id,
        title: 'Open House is coming up',
        message: 'Tour classrooms, meet teachers and ask every question you have.',
        button: { label: 'See the details', link: { type: 'url', url: '/events' } },
        style: 'standard',
        startsAt: new Date(Date.now() - 3600000).toISOString(),
        showOn: 'all',
        dismissible: true,
        _status: 'published',
      } as any,
      overrideAccess: true,
      context: ctx,
    })
    payload.logger.info(`[b61] Demo announcement added for ${school.name}`)
  }

  const allDay = await payload.find({ collection: 'events', where: { and: [mine, { allDay: { equals: true } }] }, limit: 1, depth: 0, overrideAccess: true, draft: true })
  if (allDay.totalDocs === 0) {
    const first = addDays(ymd(new Date()), 21)
    await payload.create({
      collection: 'events',
      data: {
        school: school.id,
        title: 'Teacher in-service days (no school)',
        slug: 'teacher-in-service',
        generateSlug: false,
        allDay: true,
        startsAt: zoned(first).toISOString(),
        endsAt: zoned(addDays(first, 1)).toISOString(),
        audience: 'public',
        summary: 'No classes for students while teachers train and plan. Before and after care is closed.',
        _status: 'published',
      } as any,
      overrideAccess: true,
      context: ctx,
    })
    payload.logger.info(`[b61] Demo all-day event added for ${school.name}`)
  }

  await ensureFactsDemo(payload, school, ctx)
}

const DEMO_FACTS: Record<string, Record<string, unknown>> = {
  'cedar-ridge': {
    shortName: 'Cedar Ridge',
    grades: 'PreK–12',
    foundedYear: 1987,
    enrollment: 640,
    studentTeacherRatio: '14:1',
    denomination: 'Nondenominational',
    transportation: 'Morning bus routes from Greer and Taylors',
    beforeAfterCare: true,
    churchName: 'Cedar Ridge Community Church',
    accreditations: [{ name: 'ACSI' }, { name: 'Cognia' }],
    memberships: [{ name: 'SCISA' }],
    latitude: 34.8526,
    longitude: -82.394,
    officeDays: ['Mo', 'Tu', 'We', 'Th', 'Fr'],
    officeOpens: '07:30',
    officeCloses: '16:00',
  },
  'harbor-oaks': {
    shortName: 'Harbor Oaks',
    grades: 'K–12',
    foundedYear: 2004,
    enrollment: 310,
    studentTeacherRatio: '11:1',
    denomination: 'Reformed',
    beforeAfterCare: true,
    accreditations: [{ name: 'ACCS' }],
    memberships: [{ name: 'Society for Classical Learning' }],
    officeDays: ['Mo', 'Tu', 'We', 'Th', 'Fr'],
    officeOpens: '08:00',
    officeCloses: '15:30',
  },
}

/*
 * School facts, the address in parts and full social links for the demo
 * schools (structured data, PR 2). Only when the school has no facts yet.
 */
async function ensureFactsDemo(payload: Payload, school: School, ctx: Record<string, unknown>) {
  const facts = DEMO_FACTS[school.slug ?? '']
  if (!facts) return
  const res = await payload.find({ collection: 'school-settings', where: { school: { equals: school.id } }, limit: 1, depth: 0, overrideAccess: true })
  const s = res.docs[0] as any
  if (!s || s.grades || s.foundedYear) return
  const parts = s.street || !s.address ? {} : splitAddress(s.address)
  // Old demo data linked to the social sites' home pages; those now fail the "full address" check.
  const social = (s.social ?? []).map((x: any) => (profileUrl(x?.url) === true ? x : { ...x, url: `https://${new URL(x.url).hostname}/${handle(s.schoolName)}` }))
  await payload.update({
    collection: 'school-settings',
    id: s.id,
    data: { ...facts, ...parts, social, _status: 'published' } as any,
    overrideAccess: true,
    context: ctx,
  })
  // Show them: an "At a glance" Card Grid on the demo About page, after its second section.
  const about = (await payload.find({ collection: 'pages', where: { and: [{ school: { equals: school.id } }, { slug: { equals: 'about' } }] }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
  if (about && !(about.sections ?? []).some((x: any) => x.source === 'school-facts')) {
    const glance = { ...cardsFrom({ heading: 'At a glance', source: 'school-facts', columns: 'four', tone: 'light' }), mediaType: 'none' }
    const sections = [...(about.sections ?? [])]
    sections.splice(Math.min(2, sections.length), 0, glance)
    await payload.update({ collection: 'pages', id: about.id, data: { sections, _status: 'published' } as any, overrideAccess: true, context: ctx })
  }
  payload.logger.info(`[b61] Demo school facts added for ${school.name}`)
}
