import type { Access, CollectionBeforeChangeHook, CollectionBeforeDeleteHook, CollectionConfig, Where } from 'payload'
import { APIError } from 'payload'
import { idOf, isB61Admin, managesAnySchool, MANAGERS, schoolsWith } from '../access'
import { brandedEmail, schoolSender, siteOrigin } from '../email/school'
import { inviteEndpoint, resendInviteEndpoint } from '../users/invite'

/**
 * People who sign in to the admin.
 *
 * Banner 61 admins see every school and every account. Everyone else has a
 * list of schools, each with a role (School Admin, Editor, Contributor; see
 * src/access.ts). School Admins invite and manage people at their own
 * schools only. The very first account created becomes a Banner 61 admin.
 */

const tenantIds = (rows: any[] | null | undefined) =>
  (rows ?? []).map((r) => idOf(r?.tenant)).filter((id) => id != null).map(String)

const rowKey = (r: any) => `${idOf(r?.tenant)}:${r?.role || 'editor'}`

/** Accounts at schools this person manages (plus their own). */
const peopleIManage = (user: any): Where => ({
  or: [{ id: { equals: user.id } }, { 'tenants.tenant': { in: schoolsWith(user, MANAGERS) } }],
})

const readUsers: Access = ({ req }) => {
  const user = req.user as any
  if (!user) return false
  if (isB61Admin(user)) return true
  return peopleIManage(user)
}

const manageUsers: Access = ({ req }) => {
  const user = req.user as any
  if (!user) return false
  if (isB61Admin(user)) return true
  if (!managesAnySchool(user)) return false
  // School Admins never touch Banner 61 admin accounts.
  return { and: [peopleIManage(user), { role: { not_equals: 'admin' } }] }
}

const updateUsers: Access = (args) => {
  const user = args.req.user as any
  if (!user) return false
  if (isB61Admin(user)) return true
  // Everyone can update their own account (name, password).
  if (args.id != null && String(args.id) === String(user.id)) return true
  return manageUsers(args)
}

/**
 * The real check on every save made by a non-Banner 61 person:
 * - only schools they manage can be added, removed or have their role changed;
 *   other schools on the account stay exactly as they were;
 * - they can't change their own school roles (so a school never loses its
 *   last School Admin by accident);
 * - they can't set someone else's email or password (invites and the
 *   "Forgot password" email do that).
 */
const guardUserChanges: CollectionBeforeChangeHook = async ({ data, originalDoc, operation, req }) => {
  const actor = req.user as any
  if (req.context?.b61System) return data
  if (operation === 'create') {
    const { totalDocs } = await req.payload.count({ collection: 'users', req, overrideAccess: true })
    if (totalDocs === 0) {
      data.role = 'admin'
      return data
    }
  }
  if (!actor || isB61Admin(actor)) return data

  const self = operation === 'update' && String(originalDoc?.id) === String(actor.id)
  const managed = new Set(schoolsWith(actor, MANAGERS).map(String))

  if ('tenants' in data) {
    const before: any[] = originalDoc?.tenants ?? []
    const after: any[] = data.tenants ?? []
    const outside = (rows: any[]) =>
      rows.filter((r) => !managed.has(String(idOf(r?.tenant)))).map(rowKey).sort().join(',')
    if (outside(before) !== outside(after)) {
      throw new APIError('You can only add or change schools where you are a School Admin.', 403, null, true)
    }
    if (self) {
      const mine = (rows: any[]) =>
        rows.filter((r) => managed.has(String(idOf(r?.tenant)))).map(rowKey).sort().join(',')
      if (mine(before) !== mine(after)) {
        throw new APIError(
          "You can't change your own school role. Ask another School Admin or Banner 61.",
          403,
          null,
          true,
        )
      }
    }
    if (operation === 'create' && tenantIds(after).length === 0) {
      throw new APIError('Choose the school this person will work on.', 400, null, true)
    }
  }
  if (operation === 'create' && !('tenants' in data)) {
    throw new APIError('Choose the school this person will work on.', 400, null, true)
  }

  if (operation === 'update' && !self) {
    if (data.email != null && originalDoc?.email && data.email !== originalDoc.email) {
      throw new APIError(
        "You can't change someone else's email. Invite the new address instead.",
        403,
        null,
        true,
      )
    }
    if (typeof data.password === 'string' && data.password) {
      throw new APIError(
        "You can't set someone else's password. They can use \"Forgot password\" on the sign-in page.",
        403,
        null,
        true,
      )
    }
  }
  return data
}

/** School Admins may only delete accounts that work solely at their schools. */
const guardUserDelete: CollectionBeforeDeleteHook = async ({ id, req }) => {
  const actor = req.user as any
  if (!actor || isB61Admin(actor) || req.context?.b61System) return
  if (String(id) === String(actor.id)) {
    throw new APIError("You can't delete your own account. Ask Banner 61.", 403, null, true)
  }
  const target: any = await req.payload.findByID({ collection: 'users', id, depth: 0, overrideAccess: true, req })
  const managed = new Set(schoolsWith(actor, MANAGERS).map(String))
  const elsewhere = tenantIds(target?.tenants).filter((s) => !managed.has(s))
  if (elsewhere.length) {
    throw new APIError(
      'This person also works on another school, so their account stays. Remove your school from their Schools list instead.',
      403,
      null,
      true,
    )
  }
}

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'tenants', 'lastSignInAt'],
    group: 'People',
    description:
      'People who can sign in to edit the website. Use "Invite someone" to add a person; they get an email to choose their password.',
    // Editors and Contributors manage only their own account (top-right menu).
    hidden: ({ user }) => !managesAnySchool(user),
    components: {
      beforeListTable: ['@/users/InviteForm#InviteForm'],
    },
  },
  auth: {
    // Password reset emails carry the school's name, logo and color.
    forgotPassword: {
      generateEmailSubject: async (args: any) => {
        const sender = await schoolSender(args.req.payload, args.user?.tenants?.[0]?.tenant)
        return `Reset your password for the ${sender.schoolName} website`
      },
      generateEmailHTML: async (args: any) => {
        const { req, token, user } = args
        const sender = await schoolSender(req.payload, user?.tenants?.[0]?.tenant)
        const origin =
          siteOrigin() ||
          (req.headers?.get?.('origin') ?? (req.headers?.get?.('host') ? `https://${req.headers.get('host')}` : ''))
        const link = `${origin.replace(/\/$/, '')}/admin/reset/${token}`
        return brandedEmail(
          sender,
          `<h1 style="font:700 22px/1.3 Georgia,serif;margin:16px 0">Reset your password</h1>
<p>Someone asked to reset the password for ${user?.email ?? 'your account'} on the ${sender.schoolName} website editor.</p>
<p style="margin:28px 0"><a href="${link}" style="background:${sender.color};color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:999px;font-weight:600;display:inline-block">Choose a new password</a></p>
<p style="color:#555;font-size:14px">The link works for one hour. If you didn't ask for this, you can ignore this email; your password stays the same.</p>`,
        )
      },
    },
  },
  endpoints: [inviteEndpoint, resendInviteEndpoint],
  access: {
    read: readUsers,
    create: manageUsers,
    update: updateUsers,
    delete: manageUsers,
  },
  hooks: {
    beforeChange: [guardUserChanges],
    beforeDelete: [guardUserDelete],
    afterLogin: [
      async ({ req, user }) => {
        // Shown in the Users list; also tells us an invite was accepted.
        // Written straight to the database: no hooks, no new version.
        await req.payload.db.updateOne({
          collection: 'users',
          id: user.id,
          data: { lastSignInAt: new Date().toISOString() },
          req,
        })
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'role',
      label: 'Account type',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'School account (roles set per school below)', value: 'editor' },
        { label: 'Banner 61 admin (all schools)', value: 'admin' },
      ],
      access: {
        update: ({ req }) => isB61Admin(req.user),
        create: ({ req }) => isB61Admin(req.user),
      },
      admin: { position: 'sidebar' },
    },
    {
      name: 'invite',
      type: 'ui',
      admin: { position: 'sidebar', components: { Field: '@/users/InviteStatus#InviteStatus' } },
    },
    {
      name: 'invitedAt',
      type: 'date',
      access: { update: () => false, create: () => false },
      admin: { position: 'sidebar', readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'lastSignInAt',
      label: 'Last signed in',
      type: 'date',
      access: { update: () => false, create: () => false },
      admin: { position: 'sidebar', readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
    },
  ],
}

