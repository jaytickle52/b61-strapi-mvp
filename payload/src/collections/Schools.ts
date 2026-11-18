import type { CollectionConfig } from 'payload'
import { isAdmin, isB61Admin } from '../access'
import { schoolStarterHook } from '../school/starter'
import { setupEndpoints } from '../setup/endpoints'
import { twoFactorPending } from '../users/two-factor-rules'

/** Banner 61 admins who have finished signing in (two-factor code included). */
const b61Only = ({ req }: { req: any }) => isB61Admin(req.user) && !twoFactorPending(req.user)

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
  endpoints: setupEndpoints,
  hooks: { afterChange: [schoolStarterHook] },
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
    {
      // Schoolbox setup in Base Camp (src/setup). Banner 61 only.
      name: 'setupStage',
      label: 'Schoolbox setup',
      type: 'select',
      options: [
        { label: 'Setup (school is answering and choosing)', value: 'setup' },
        { label: 'Review (sent to Banner 61)', value: 'review' },
        { label: 'Live (handed over; pages edited directly)', value: 'live' },
      ],
      access: { read: b61Only, update: b61Only },
      admin: {
        position: 'sidebar',
        description: 'Only for Schoolbox schools. During Setup and Review, Base Camp builds the pages from the school\u2019s answers. At Live that stops and the pages are edited like any other site.',
      },
    },
    {
      name: 'setupSpots',
      label: 'Setup answers (spots)',
      type: 'json',
      access: { read: b61Only, update: b61Only },
      admin: {
        condition: (data) => Boolean(data?.setupStage),
        description: 'The words and photo picks Base Camp saves for each spot on the Schoolbox pages. Edited in Base Camp, not here.',
        readOnly: true,
      },
    },
  ],
}
