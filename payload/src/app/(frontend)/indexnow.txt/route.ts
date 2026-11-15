export const dynamic = 'force-dynamic'
import { currentSchool } from '@/lib/data'
import { indexNowKey } from '@/seo/indexnow'

/* The school's IndexNow key, so search engines can confirm pings came from this site (src/seo/indexnow.ts). */
export async function GET() {
  const school = await currentSchool()
  if (!school) return new Response('Not found\n', { status: 404 })
  return new Response(indexNowKey(school.id), { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=86400' } })
}
