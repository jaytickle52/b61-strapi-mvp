import type { CollectionConfig } from 'payload'
import { isAdmin, isB61Admin } from '../access'

/**
 * The schools this app serves. Every page, event, news post, program, staff
 * member, photo and the School settings belong to one school. A visitor's
 * school is picked by the web address they came in on (Domains).
 * Only Banner 61 admins add or remove schools.
 */
export const Schools: CollectionConfig = {
  slug: 'schools',
  labels: { singular: 'School', plural: 'Schools' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'updatedAt'],
    group: 'Banner 61',
    description: 'Each school is one website. Only Banner 61 admins see this list.',
    hidden: ({ user }) => !isB61Admin(user),
  },
  access: {
    create: isAdmin,
    delete: isAdmin,
    update: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'Short name used in links, e.g. cedar-ridge.' },
      validate: (v: unknown) => (typeof v === 'string' && /^[a-z0-9-]+$/.test(v)) || 'Lowercase letters, numbers and dashes only.',
    },
    {
      name: 'domains',
      type: 'array',
      labels: { singular: 'Domain', plural: 'Domains' },
      admin: { description: 'Web addresses that show this school, e.g. cedarridge.org. No https://. The first is the main address; the others (like www.cedarridge.org) redirect to it.' },
      fields: [{ name: 'domain', type: 'text', required: true, index: true }],
    },
  ],
}
