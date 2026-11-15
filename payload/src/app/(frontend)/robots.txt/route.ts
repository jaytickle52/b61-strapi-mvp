export const dynamic = 'force-dynamic'
import { getSettings, hiddenFromSearch, siteOrigin } from '@/lib/data'
import { mainDomainResponse } from '@/seo/domains'
import { AI_TRAINING_BOTS } from '@/seo/crawlers'

/* robots.txt for whichever school this address belongs to. */
export async function GET() {
  const moved = await mainDomainResponse('/robots.txt')
  if (moved) return moved
  const [origin, hidden, settings] = await Promise.all([siteOrigin(), hiddenFromSearch(), getSettings()])
  const rules = ['User-agent: *', 'Allow: /', 'Disallow: /admin', 'Disallow: /api/', 'Disallow: /next/', 'Disallow: /parents', 'Disallow: /search']
  const training = (settings as any).allowAiTraining === false ? AI_TRAINING_BOTS.map((bot) => `\nUser-agent: ${bot}\nDisallow: /`).join('\n') : ''
  const body = hidden ? 'User-agent: *\nDisallow: /\n' : `${rules.join('\n')}\n${training ? `${training}\n` : ''}\nSitemap: ${origin}/sitemap.xml\n`
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } })
}
