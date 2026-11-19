import type { Access, CollectionBeforeChangeHook, Where } from 'payload'
import { Forbidden } from 'payload'

/*
 * Who can do what.
 *
 * Every account has a platform role (users.role):
 *   admin   Banner 61 staff. Every school, the Schools list, all users.
 *   editor  A school account. What it may do is set per school, on each row
 *           of the account's Schools list (users.tenants[].role):
 *
 *   schoolAdmin  Everything an Editor can, plus inviting and managing the
 *                people at that school (never other schools, never Banner 61
 *                admins, never adding or removing schools).
 *   editor       Edits and publishes everything at that school: pages,
 *                events, news, staff, photos, forms, settings.
 *   contributor  Writes drafts and uploads photos. Can't publish, unpublish
 *                or delete, and can't see form answers, forms or settings.
 *                Someone with Editor or School Admin publishes their work.
 */

export type SchoolRole = 'schoolAdmin' | 'editor' | 'contributor'

export const SCHOOL_ROLES: { label: string; value: SchoolRole }[] = [
  { label: 'School Admin (edits, publishes, manages people)', value: 'schoolAdmin' },
  { label: 'Editor (edits and publishes)', value: 'editor' },
  { label: 'Contributor (drafts only)', value: 'contributor' },
]

/** Roles that may publish, delete, and see forms, answers and settings. */
export const PUBLISHERS: SchoolRole[] = ['schoolAdmin', 'editor']
export const MANAGERS: SchoolRole[] = ['schoolAdmin']

export const idOf = (v: unknown): number | string | null => {
  const id = v && typeof v === 'object' ? (v as any).id : v
  if (typeof id === 'number') return id
  if (typeof id === 'string' && id) return /^\d+$/.test(id) ? Number(id) : id
  return null
}

const sameId = (a: unknown, b: unknown) => {
  const x = idOf(a)
  const y = idOf(b)
  return x != null && y != null && String(x) === String(y)
}

/** Banner 61 staff (every school). */
export const isB61Admin = (user: any): boolean => user?.role === 'admin'

/** The account's role at one school, or null when it has none there. */
export const roleAt = (user: any, school: unknown): SchoolRole | null => {
  if (!user) return null
  const row = (user.tenants ?? []).find((t: any) => sameId(t?.tenant, school))
  if (!row) return null
  return (row.role as SchoolRole) || 'editor'
}

/** Ids of the schools where the account has one of these roles. */
export const schoolsWith = (user: any, roles: SchoolRole[]): (number | string)[] =>
  (user?.tenants ?? [])
    .filter((t: any) => roles.includes(((t?.role as SchoolRole) || 'editor') as SchoolRole))
    .map((t: any) => idOf(t?.tenant))
    .filter((id: unknown): id is number | string => id != null)

/** Whether a signed-in user may act for this school at all (admins: any school). */
export const canUseSchool = (user: any, school: unknown): boolean => {
  if (!user) return false
  if (isB61Admin(user)) return true
  return roleAt(user, school) != null
}

/** Whether the user may publish, delete and manage forms/settings at this school. */
export const canPublishAt = (user: any, school: unknown): boolean =>
  isB61Admin(user) || PUBLISHERS.includes(roleAt(user, school) as SchoolRole)

/** Whether the user may invite and manage people at this school. */
export const canManagePeopleAt = (user: any, school: unknown): boolean =>
  isB61Admin(user) || roleAt(user, school) === 'schoolAdmin'

export const managesAnySchool = (user: any): boolean =>
  isB61Admin(user) || schoolsWith(user, MANAGERS).length > 0

// ---------------------------------------------------------------------------
// Public reads
// ---------------------------------------------------------------------------

// Editors (anyone signed in to the admin) can see everything at their school.
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

/** Banner 61 staff: every school, and the Schools list. */
export const isAdmin: Access = ({ req }) => isB61Admin(req.user)

// ---------------------------------------------------------------------------
// School-scoped writes (the multi-school plugin adds "only your schools" on top)
// ---------------------------------------------------------------------------

/** Items in schools where the user is an Editor or School Admin. */
const publisherWhere = (user: any): Where => ({ school: { in: schoolsWith(user, PUBLISHERS) } })

/**
 * Publishers only: forms, form answers and files, settings, deletes.
 * When the school is known (creating), answers yes/no; otherwise limits to
 * the user's publishing schools.
 */
export const publishersOnly: Access = ({ req, data }) => {
  const user = req.user
  if (!user) return false
  if (isB61Admin(user)) return true
  if (data && 'school' in data && data.school != null) return canPublishAt(user, data.school)
  const ids = schoolsWith(user, PUBLISHERS)
  return ids.length ? publisherWhere(user) : false
}

/**
 * Pages, events, news, staff: everyone at the school writes; only
 * publishers may save with "Published". The admin asks this same question to
 * decide whether to show the Publish button, so Contributors never see it.
 */
export const draftWriters: Access = ({ req, data }) => {
  const user = req.user
  if (!user) return false
  if (isB61Admin(user)) return true
  if (data?._status !== 'published') return true
  if (data && data.school != null) return canPublishAt(user, data.school)
  const ids = schoolsWith(user, PUBLISHERS)
  return ids.length ? publisherWhere(user) : false
}

/**
 * Backstop for draftWriters, run on every save: a Contributor can't publish
 * or unpublish, whatever route the request came in on (API, admin, scripts
 * run as them). Saves made by the system (no user) are not checked.
 */
export const guardPublishing: CollectionBeforeChangeHook = async ({ collection, data, originalDoc, req, operation }) => {
  const user = req.user
  if (!user || isB61Admin(user)) return data
  const school = data?.school ?? originalDoc?.school
  if (canPublishAt(user, school)) return data
  if (data?._status === 'published') {
    throw new Forbidden(req.t)
  }
  // Unpublishing: saving the live item back to draft outside a draft save.
  // (originalDoc can be a newer draft, so ask the database what's live.)
  const q = req.query as any
  const isDraftSave = String(q?.draft) === 'true' || String(q?.autosave) === 'true'
  if (operation === 'update' && data?._status === 'draft' && !isDraftSave && originalDoc?.id != null) {
    const live: any = await req.payload.db.findOne({
      collection: collection.slug,
      where: { id: { equals: originalDoc.id } },
      req,
    })
    if (live?._status === 'published') throw new Forbidden(req.t)
  }
  return data
}

/** Contributors may create and edit; only publishers delete. */
export const contentAccess = {
  create: draftWriters,
  update: draftWriters,
  delete: publishersOnly,
}
