import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { payloadClient, SCHOOL_COOKIE } from '@/lib/data'

/**
 * /next/school/<slug> shows that school on an address that isn't any school's
 * own domain (the shared demo URL). A school's own domain always shows that school.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await payloadClient()
  const found = await payload.find({ collection: 'schools', where: { slug: { equals: slug } }, limit: 1, depth: 0, overrideAccess: true })
  const school = found.docs[0]
  if (!school) return new Response('No school with that name.', { status: 404 })
  ;(await cookies()).set(SCHOOL_COOKIE, String(school.id), { path: '/', sameSite: 'lax', secure: true, httpOnly: true, maxAge: 60 * 60 * 24 * 30 })
  redirect('/')
}
