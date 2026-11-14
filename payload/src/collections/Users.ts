import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access'
import { brandedEmail, schoolSender } from '../email/school'

/**
 * People who sign in to the admin. Banner 61 admins see every school; school
 * editors see only the schools listed on their account (Schools, below).
 * The very first account created becomes an admin.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  admin: { useAsTitle: 'email', defaultColumns: ['email', 'name', 'role'], group: 'Banner 61' },
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
          process.env.NEXT_PUBLIC_SERVER_URL ||
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
  access: {
    create: isAdmin,
    delete: isAdmin,
    // Editors can update their own account (name, password); the plugin limits the rest.
    update: ({ req, id }) => (req.user as any)?.role === 'admin' || req.user?.id === id,
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'users', req })
          if (totalDocs === 0) data.role = 'admin'
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'School editor', value: 'editor' },
        { label: 'Banner 61 admin (all schools)', value: 'admin' },
      ],
      access: { update: ({ req }) => (req.user as any)?.role === 'admin', create: ({ req }) => (req.user as any)?.role === 'admin' },
      admin: { position: 'sidebar' },
    },
  ],
}
