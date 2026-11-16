import type { CollectionConfig, ImageSize } from 'payload'
import { publishersOnly } from '../access'
import { refuseDeleteWhenUsed, usageEndpoint, usageField } from '../usage/fields'
import { sameSchoolFolder } from '../media/folders'
import { altTextEnabled, suggestAltEndpoint } from '../media/suggestAlt'

/*
 * Photos and videos for the website.
 *
 * Every photo is made smaller and lighter on upload (what Smush did on
 * WordPress): the original is capped at 2560px and re-compressed, and the
 * website uses WebP copies in four widths, picked by the browser (srcset).
 * A 1200x630 JPEG crop is made for link previews (Facebook, texts, email),
 * centred on the photo's focal point.
 *
 * WebP, not AVIF: AVIF is ~20% smaller but several times slower to make,
 * which matters on Vercel where each upload runs in a short-lived function.
 */

const webp = { format: 'webp' as const, options: { quality: 80 } }
const width = (name: string, w: number): ImageSize => ({
  name,
  width: w,
  withoutEnlargement: true,
  formatOptions: webp,
})

export const MEDIA_SIZES: ImageSize[] = [
  width('thumbnail', 400),
  width('card', 800),
  width('wide', 1200),
  width('hero', 1800),
  // Link previews. Cropped, so it is never offered in srcset (see b61/lib/media.ts).
  {
    name: 'social',
    width: 1200,
    height: 630,
    position: 'centre',
    formatOptions: { format: 'jpeg', options: { quality: 82, progressive: true } },
  },
]

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Photo or video', plural: 'Photos and videos' },
  // Everyone at the school uploads; only Editors and School Admins delete.
  access: { read: () => true, delete: publishersOnly },
  folders: true,
  admin: {
    group: 'Files',
    description:
      'Photos and videos for the website. Add alt text so screen readers can describe each photo. PDFs go in Documents.',
    defaultColumns: ['filename', 'alt', 'folder', 'updatedAt'],
  },
  hooks: { beforeValidate: [sameSchoolFolder], beforeDelete: [refuseDeleteWhenUsed('media')] },
  endpoints: [usageEndpoint('media'), suggestAltEndpoint],
  fields: [
    {
      name: 'alt',
      label: 'Alt text',
      type: 'text',
      required: true,
      admin: {
        description: 'What the photo shows, in a sentence, for people who can’t see it.',
        components: {
          afterInput: [
            { path: '@/media/SuggestAlt#SuggestAlt', clientProps: { enabled: altTextEnabled() } },
          ],
        },
      },
    },
    {
      name: 'caption',
      label: 'Caption',
      type: 'text',
      admin: { description: 'Shown under the photo where an element shows captions.' },
    },
    {
      name: 'credit',
      label: 'Credit',
      type: 'text',
      admin: { description: 'Photographer or source, e.g. "Photo: Jane Smith".' },
    },
    usageField('media'),
  ],
  upload: {
    // On Railway this folder is a persistent volume.
    staticDir: process.env.MEDIA_DIR || 'media',
    mimeTypes: ['image/*', 'video/*'],
    // Cap and re-compress the original (it is still kept, for downloads and future sizes).
    resizeOptions: { width: 2560, height: 2560, fit: 'inside', withoutEnlargement: true },
    imageSizes: MEDIA_SIZES,
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    crop: true,
  },
}
