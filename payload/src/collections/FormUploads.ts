import type { CollectionConfig } from 'payload'
import { publishersOnly } from '../access'

/**
 * Files families send through forms (transcripts, photos, signatures).
 * Kept apart from Media: staff-only, never offered in the photo picker,
 * served only to signed-in staff. On Vercel Blob each file also gets a long
 * random name, because Blob storage itself has no private files yet.
 * Only the website's form handler adds files here.
 */
export const FormUploads: CollectionConfig = {
  slug: 'form-uploads',
  labels: { singular: 'Form file', plural: 'Form files' },
  admin: {
    group: 'Forms',
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'mimeType', 'filesize', 'createdAt'],
    description: 'Files sent through website forms. Open them from the submission.',
  },
  access: { read: publishersOnly, create: () => false, update: () => false, delete: publishersOnly },
  upload: {
    staticDir: process.env.FORM_UPLOADS_DIR || 'form-uploads',
    // No resized copies: these are records, not website photos.
  },
  fields: [],
}
