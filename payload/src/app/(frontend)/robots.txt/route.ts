export const dynamic = 'force-dynamic'
import { hiddenFromSearch, siteOrigin } from '@/lib/data'

/* robots.txt for whichever school this address belongs to. */
export async function GET() {
  const [origin, hidden] = await Promise.all([siteOrigin(), hiddenFromSearch()])
  const body = hidden
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nDisallow: /next/\nDisallow: /parents\nDisallow: /search\n\nSitemap: ${origin}/sitemap.xml\n`
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } })
}
