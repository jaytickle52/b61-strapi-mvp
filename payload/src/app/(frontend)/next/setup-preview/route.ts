import { cookies, draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { SCHOOL_COOKIE } from '@/lib/data'
import { readPreviewToken, SETUP_PREVIEW_COOKIE } from '@/setup/preview-token'

/**
 * A school leader's setup preview link (made by POST /api/schools/:id/setup/preview-link).
 * Shows that school's draft pages, and only that school's, until the link
 * expires or the school goes live. No sign-in needed.
 */
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('t')
  const school = readPreviewToken(token)
  if (school == null) return new Response('This preview link has expired or isn’t valid. Ask Banner 61 for a new one.', { status: 403 })

  const jar = await cookies()
  const cookie = { path: '/', sameSite: 'lax' as const, secure: true, httpOnly: true }
  // On the shared demo address, show this school.
  jar.set(SCHOOL_COOKIE, String(school), cookie)
  jar.set(SETUP_PREVIEW_COOKIE, token!, cookie)
  ;(await draftMode()).enable()
  redirect('/')
}
