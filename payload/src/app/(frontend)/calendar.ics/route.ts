export const dynamic = 'force-dynamic'
import type { NextRequest } from 'next/server'
import { currentSchool, getSettings, payloadClient, siteOrigin } from '@/lib/data'
import { buildIcs } from '@/events/ics'

/*
 * The school's calendar as a subscribe feed (/calendar.ics). Google, Apple and
 * Outlook check it a few times a day, so families see new and changed events
 * on their own calendars. Public, published events only, from two months ago on.
 *
 * On an address shared by several schools (the demo), ?school=<slug> picks
 * the school, since calendar apps don't send the school cookie.
 */
export async function GET(req: NextRequest) {
  const payload = await payloadClient()
  const picked = req.nextUrl.searchParams.get('school')
  const school =
    (picked
      ? (await payload.find({ collection: 'schools', where: { slug: { equals: picked } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
      : null) ?? (await currentSchool())
  if (!school) return new Response('No school here.', { status: 404 })

  const since = new Date(Date.now() - 60 * 86400000).toISOString()
  // As an anonymous visitor: the access rules allow only published, public events.
  const { docs } = await payload.find({
    collection: 'events',
    where: {
      and: [
        { school: { equals: school.id } },
        { audience: { equals: 'public' } },
        { or: [{ startsAt: { greater_than_equal: since } }, { endsAt: { greater_than_equal: since } }] },
      ],
    },
    sort: 'startsAt',
    limit: 2000,
    depth: 0,
    overrideAccess: false,
    select: { title: true, slug: true, startsAt: true, endsAt: true, allDay: true, location: true, summary: true, updatedAt: true },
  })

  const settings = picked ? null : await getSettings()
  const name = settings?.schoolName || school.name
  const body = buildIcs(docs as any, { name, origin: await siteOrigin(), description: `Events at ${name}` })
  return new Response(body, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `inline; filename="${school.slug || 'calendar'}.ics"`,
      'Cache-Control': 'public, max-age=900',
    },
  })
}
