import type { Payload } from 'payload'
import type { School } from '../payload-types'
import { addDays, ymd, zoned } from '../events/time'

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
}
