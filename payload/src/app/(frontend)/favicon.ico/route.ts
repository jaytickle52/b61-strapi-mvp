import { schoolIcon } from '@/seo/icon'

export const dynamic = 'force-dynamic'

/*
 * Browsers ask for /favicon.ico on their own. Without this route that request
 * fell through to the page catch-all and built a whole "page not found" page.
 * Send it to the school's icon, or to the letter-mark stand-in.
 */
export async function GET() {
  const icon = await schoolIcon()
  // Relative on purpose: the redirect stays on whichever school domain asked.
  const to = icon?.url || '/school-icon.svg'
  return new Response(null, { status: 302, headers: { Location: to, 'Cache-Control': 'public, max-age=86400' } })
}
