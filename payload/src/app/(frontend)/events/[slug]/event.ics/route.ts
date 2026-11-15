export const dynamic = 'force-dynamic'
import { getEvent, siteOrigin } from '@/lib/data'
import { buildIcs } from '@/events/ics'

/* One event as a calendar file: "Add to calendar" for Apple Calendar and Outlook. */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = await getEvent(slug)
  if (!event || event.audience !== 'public') return new Response('Not found', { status: 404 })
  const body = buildIcs([event as any], { name: event.title, origin: await siteOrigin() })
  return new Response(body, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${slug}.ics"`,
      'Cache-Control': 'public, max-age=300',
    },
  })
}
