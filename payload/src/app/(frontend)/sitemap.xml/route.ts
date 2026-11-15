export const dynamic = 'force-dynamic'
import { getEvents, getNews, getPrograms, getStaff, hiddenFromSearch, payloadClient, siteOrigin, currentSchool } from '@/lib/data'

/* This school's sitemap: every published, public page, program, event and news post. */
export async function GET() {
  const [origin, hidden, school] = await Promise.all([siteOrigin(), hiddenFromSearch(), currentSchool()])
  const urls: { loc: string; lastmod?: string }[] = []
  if (!hidden && school) {
    const payload = await payloadClient()
    const pages = await payload.find({
      collection: 'pages',
      where: { and: [{ school: { equals: school.id } }, { _status: { equals: 'published' } }] },
      limit: 1000,
      depth: 0,
      select: { slug: true, updatedAt: true, meta: true } as any,
    })
    for (const p of pages.docs as any[]) {
      if (p.meta?.noindex) continue
      urls.push({ loc: p.slug === 'home' ? `${origin}/` : `${origin}/${p.slug}`, lastmod: p.updatedAt })
    }
    const [programs, events, news, staff] = await Promise.all([getPrograms(500), getEvents({ limit: 500 }), getNews({ limit: 500 }), getStaff(500)])
    // A list page changes when anything on it does: its newest item's date. Empty lists are left out.
    const newest = (docs: any[]) => docs.map((d) => d.updatedAt as string).filter(Boolean).sort().at(-1)
    const lists: [string, any[]][] = [['programs', programs], ['events', events], ['news', news], ['staff', staff]]
    for (const [path, docs] of lists) if (docs.length) urls.push({ loc: `${origin}/${path}`, lastmod: newest(docs) })
    for (const x of programs as any[]) if (!x.meta?.noindex) urls.push({ loc: `${origin}/programs/${x.slug}`, lastmod: x.updatedAt })
    for (const x of events as any[]) if (x.audience === 'public' && !x.meta?.noindex) urls.push({ loc: `${origin}/events/${x.slug}`, lastmod: x.updatedAt })
    for (const x of news as any[]) if (x.audience === 'public' && !x.meta?.noindex) urls.push({ loc: `${origin}/news/${x.slug}`, lastmod: x.updatedAt })
  }
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${esc(u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod.slice(0, 10)}</lastmod>` : ''}</url>`).join('\n')}
</urlset>
`
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } })
}
