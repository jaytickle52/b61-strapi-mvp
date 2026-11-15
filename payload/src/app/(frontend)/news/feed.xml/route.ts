export const dynamic = 'force-dynamic'
import { getNews, getSettings, hiddenFromSearch, siteOrigin } from '@/lib/data'
import { mainDomainResponse } from '@/seo/domains'
import { descriptionFrom } from '@/seo/text'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/* The school's public news as an RSS feed: the newest 20 posts. */
export async function GET() {
  const moved = await mainDomainResponse('/news/feed.xml')
  if (moved) return moved
  const [origin, settings, hidden] = await Promise.all([siteOrigin(), getSettings(), hiddenFromSearch()])
  const posts = await getNews({ limit: 20 })
  const items = posts
    .map((p: any) => {
      const url = `${origin}/news/${p.slug}`
      const summary = p.summary || descriptionFrom(p.body, 300)
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${esc(url)}</link>
      <guid isPermaLink="true">${esc(url)}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>${summary ? `\n      <description>${esc(summary)}</description>` : ''}
    </item>`
    })
    .join('\n')
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(`${settings.schoolName} news`)}</title>
    <link>${esc(`${origin}/news`)}</link>
    <atom:link href="${esc(`${origin}/news/feed.xml`)}" rel="self" type="application/rss+xml" />
    <description>${esc(`News and stories from ${settings.schoolName}.`)}</description>
    <language>en-us</language>
${items}
  </channel>
</rss>
`
  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=900',
      ...(hidden ? { 'X-Robots-Tag': 'noindex' } : {}),
    },
  })
}
