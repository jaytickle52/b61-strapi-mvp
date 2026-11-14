import { draftMode, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { payloadClient } from '@/lib/data'

/**
 * Opened by the admin's live preview pane. Only someone signed in to the admin
 * (same site, so their login cookie comes along) can turn on preview.
 */
export async function GET(request: Request) {
  const url = new URL(request.url)
  const raw = url.searchParams.get('path') || '/'
  // Only same-site paths, never a full URL to somewhere else.
  const path = raw.startsWith('/') && !raw.startsWith('//') ? raw : '/'

  const payload = await payloadClient()
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) return new Response('Sign in to the admin to preview.', { status: 401 })

  ;(await draftMode()).enable()
  redirect(path)
}
