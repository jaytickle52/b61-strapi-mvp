import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { THEMES } from '@/b61/lib/style'
import { THEME_PREVIEW_COOKIE } from '@/b61/lib/theme-preview'
import { payloadClient, SCHOOL_COOKIE } from '@/lib/data'

/**
 * /next/theme/<name> shows the current school in that theme (heritage, warm,
 * bold, classic), for comparing the Schoolbox themes before picking one.
 * /next/theme/off goes back to the school's own. Only demo and preview
 * addresses honour it (the layout checks), so a school's real site never
 * changes for a visitor.
 *
 * ?school=<slug> also picks the school (as /next/school/<slug> does);
 * ?to=/some-page opens that page afterwards, else the page the link was on.
 * On the Schoolbox demo's /home-<theme> pages the page follows the theme.
 */
export async function GET(req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  const here = new URL(req.url)
  const jar = await cookies()
  const cookie = { path: '/', sameSite: 'lax' as const, secure: true, httpOnly: true }
  if (name === 'off') jar.delete(THEME_PREVIEW_COOKIE)
  else if (name in THEMES) jar.set(THEME_PREVIEW_COOKIE, name, { ...cookie, maxAge: 60 * 60 * 24 })
  else return new Response('No theme with that name.', { status: 404 })

  const slug = here.searchParams.get('school')
  if (slug) {
    const payload = await payloadClient()
    const school = (await payload.find({ collection: 'schools', where: { slug: { equals: slug } }, limit: 1, depth: 0, overrideAccess: true })).docs[0]
    if (!school) return new Response('No school with that name.', { status: 404 })
    jar.set(SCHOOL_COOKIE, String(school.id), { ...cookie, maxAge: 60 * 60 * 24 * 30 })
  }

  const ref = req.headers.get('referer')
  const refUrl = ref ? new URL(ref) : null
  const back = refUrl && refUrl.host === here.host ? refUrl.pathname : null
  let to = here.searchParams.get('to') ?? back ?? '/'
  if (/^\/home-(heritage|warm|bold)$/.test(to) && name in THEMES && name !== 'classic') to = `/home-${name}`
  // Only paths on this site, never another address.
  redirect(/^\/(?!\/)/.test(to) ? to : '/')
}
