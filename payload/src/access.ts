import type { Access, Where } from 'payload'

// Editors (anyone signed in to the admin) can see everything.
// Visitors only see published content.
export const publishedOrSignedIn: Access = ({ req }) => {
  if (req.user) return true
  return { _status: { equals: 'published' } }
}

// Events and news: visitors only see published items tagged "public".
// Parents-only items are never served to anonymous visitors through any API;
// the parent feed reads them server-side after its password check.
export const publicAudienceOrSignedIn: Access = ({ req }) => {
  if (req.user) return true
  const where: Where = { and: [{ _status: { equals: 'published' } }, { audience: { equals: 'public' } }] }
  return where
}

export const signedIn: Access = ({ req }) => Boolean(req.user)
export const anyone: Access = () => true

/** Banner 61 staff: every school, and the Schools and Users lists. */
export const isAdmin: Access = ({ req }) => (req.user as any)?.role === 'admin'

/** Whether a signed-in user may act for this school (admins: any school). */
export const canUseSchool = (user: any, school: unknown): boolean => {
  if (!user) return false
  if (user.role === 'admin') return true
  const id = school && typeof school === 'object' ? (school as any).id : school
  return (user.tenants ?? []).some((t: any) => String(t?.tenant && typeof t.tenant === 'object' ? t.tenant.id : t?.tenant) === String(id))
}
