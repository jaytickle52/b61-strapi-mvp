export const dynamic = 'force-dynamic'
import { currentSchool, getEvents, getNews, getPrograms, getSettings, hiddenFromSearch, payloadClient, siteOrigin } from '@/lib/data'
import { mainDomainResponse } from '@/seo/domains'
import { factSentence } from '@/seo/schema'
import { descriptionFrom } from '@/seo/text'

/*
 * /llms.txt: a short, plain guide to the school's site for AI agents
 * (llmstxt.org). Google says it doesn't use it; Chrome's Lighthouse checks for
 * it. Built from what the site already holds, so there is nothing to keep up.
 * Missing (404) while the site is hidden from search engines.
 */
export async function GET() {
  const moved = await mainDomainResponse('/llms.txt')
  if (moved) return moved
  const [origin, hidden, school, s] = await Promise.all([siteOrigin(), hiddenFromSearch(), currentSchool(), getSettings()])
  if (hidden || !school) return new Response('Not found\n', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
  const st = s as any
  const line = (title: string, path: string, about?: string | null) => `- [${title}](${origin}${path})${about ? `: ${about}` : ''}`

  const payload = await payloadClient()
  const pages = await payload.find({
    collection: 'pages',
    where: { and: [{ school: { equals: school.id } }, { _status: { equals: 'published' } }] },
    limit: 200,
    depth: 0,
    sort: 'title',
    select: { title: true, slug: true, meta: true, sections: true } as any,
  })
  const pageLines = (pages.docs as any[])
    .filter((p) => !p.meta?.noindex && p.slug !== 'home')
    .map((p) => line(p.title, `/${p.slug}`, p.meta?.description || descriptionFrom(p.sections) || null))
  const [programs, events, news] = await Promise.all([getPrograms(50), getEvents({ limit: 5 }), getNews({ limit: 5 })])

  const contact = [
    st.address ? `Address: ${String(st.address).replace(/\n+/g, ', ')}` : null,
    st.phone ? `Phone: ${st.phone}` : null,
    st.email ? `Email: ${st.email}` : null,
  ].filter((x): x is string => Boolean(x))

  const sections: string[] = [`# ${s.schoolName}`, '']
  const summary = [factSentence(st), st.tagline].filter(Boolean).join(' ')
  if (summary) sections.push(`> ${summary}`, '')
  if (contact.length) sections.push(...contact, '')
  sections.push('## Pages', line('Home', '/'), ...pageLines, '')
  if (programs.length) sections.push('## Programs', ...programs.map((p) => line(p.title, p.href, p.summary)), '')
  if (events.length) sections.push('## Upcoming events', line('All events', '/events'), ...events.map((e: any) => line(e.title, `/events/${e.slug}`, e.summary)), '')
  if (news.length) sections.push('## Latest news', line('All news', '/news'), ...news.map((n: any) => line(n.title, `/news/${n.slug}`, n.summary)), '')
  sections.push('## More', line('Our team', '/staff'), line('Sitemap', '/sitemap.xml'), line('News feed (RSS)', '/news/feed.xml'), '')

  return new Response(sections.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } })
}
