import type { CollectionConfig } from 'payload'
import { publishersOnly } from '../access'
import { refuseDeleteWhenUsed, usageEndpoint, usageField } from '../usage/fields'
import { sameSchoolFolder } from '../media/folders'

/**
 * Files families download: handbooks, supply lists, calendars, forms to print.
 * Kept apart from photos so the photo picker stays photos. Link to one from
 * any button or link ("A document") or from the Content editor's link tool.
 * Upload a new version over the old file (Replace file) and every link keeps working.
 */
export const Documents: CollectionConfig = {
  slug: 'documents',
  labels: { singular: 'Document', plural: 'Documents' },
  // Everyone at the school uploads; only Editors and School Admins delete.
  access: { read: () => true, delete: publishersOnly },
  folders: true,
  admin: {
    group: 'Files',
    useAsTitle: 'title',
    defaultColumns: ['title', 'filename', 'folder', 'updatedAt'],
    description:
      'PDFs and other files to download: handbooks, supply lists, calendars. To update one, open it and replace the file; links keep working.',
  },
  hooks: { beforeValidate: [sameSchoolFolder], beforeDelete: [refuseDeleteWhenUsed('documents')] },
  endpoints: [usageEndpoint('documents')],
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      admin: { description: 'What people see, e.g. "2026-27 Family Handbook".' },
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      admin: { description: 'Optional. One or two lines on what is inside.' },
    },
    usageField('documents'),
  ],
  upload: {
    staticDir: process.env.DOCUMENTS_DIR || 'documents',
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/calendar',
      'text/plain',
    ],
  },
}
