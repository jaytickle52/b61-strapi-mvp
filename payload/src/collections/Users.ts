import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access'

/**
 * People who sign in to the admin. Banner 61 admins see every school; school
 * editors see only the schools listed on their account (Schools, below).
 * The very first account created becomes an admin.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  admin: { useAsTitle: 'email', defaultColumns: ['email', 'name', 'role'], group: 'Banner 61' },
  auth: true,
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
