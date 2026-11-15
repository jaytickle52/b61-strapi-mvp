import type { CollectionConfig } from 'payload'
import { publishersOnly } from '../access'

/**
 * Every email the site sends (or tried to send), kept 90 days. Read-only:
 * entries are written by the email adapter (src/email/adapter.ts).
 * School staff see their own school's entries; Banner 61 admins see all.
 */
export const EmailLog: CollectionConfig = {
  slug: 'email-log',
  labels: { singular: 'Email log entry', plural: 'Email log' },
  admin: {
    useAsTitle: 'subject',
    defaultColumns: ['subject', 'to', 'status', 'kind', 'createdAt'],
    group: 'Forms',
    description:
      'Emails the site sent in the last 90 days. "Failed" shows the reason; "Logged" means email is not switched on yet.',
  },
  access: { read: publishersOnly, create: () => false, update: () => false, delete: () => false },
  timestamps: true,
  fields: [
    { name: 'subject', type: 'text', admin: { readOnly: true } },
    { name: 'to', type: 'text', admin: { readOnly: true } },
    {
      name: 'status',
      type: 'select',
      admin: { readOnly: true },
      options: [
        { label: 'Sent', value: 'sent' },
        { label: 'Failed', value: 'failed' },
        { label: 'Logged (email off)', value: 'logged' },
      ],
    },
    {
      name: 'kind',
      type: 'select',
      admin: { readOnly: true },
      options: [
        { label: 'Form notification', value: 'form' },
        { label: 'Test email', value: 'test' },
        { label: 'Password reset', value: 'password' },
        { label: 'Invite', value: 'invite' },
        { label: 'Other', value: 'other' },
      ],
    },
    { name: 'detail', type: 'textarea', admin: { readOnly: true } },
    // Set by the multi-tenant plugin's rules (customTenantField); empty for Banner 61 emails.
    {
      name: 'school',
      type: 'relationship',
      relationTo: 'schools',
      index: true,
      admin: { readOnly: true, position: 'sidebar' },
    },
  ],
}
