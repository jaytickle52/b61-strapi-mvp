import type { CollectionConfig, ImageSize } from 'payload'
import { publishersOnly } from '../access'
import { refuseDeleteWhenUsed, usageEndpoint, usageField } from '../usage/fields'
import { sameSchoolFolder } from '../media/folders'
import { altTextEnabled, suggestAltEndpoint } from '../media/suggestAlt'
import { autoAlt, fillAltEndpoints, requireAlt } from '../media/autoAlt'

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
  labels: { singular: 'Photo', plural: 'Photos' },
  // Everyone at the school uploads; only Editors and School Admins delete.
  access: { read: () => true, delete: publishersOnly },
  folders: true,
  admin: {
    group: 'Files',
    description:
      'Photos for the website. Add alt text so screen readers can describe each photo. PDFs go in Documents. Videos go to Bunny Stream: use "Upload a video" on the element that shows it.',
    defaultColumns: ['filename', 'alt', 'folder', 'updatedAt'],
    // "Write missing alt text" (only when ANTHROPIC_API_KEY is set; src/media/autoAlt.ts).
    components: { beforeListTable: ['@/media/FillAlt#FillAlt'] },
  },
  hooks: {
    beforeValidate: [sameSchoolFolder],
    // Alt text is required, unless Claude can write it (right after saving).
    beforeChange: [requireAlt],
    afterChange: [autoAlt],
    beforeDelete: [refuseDeleteWhenUsed('media')],
  },
  endpoints: [usageEndpoint('media'), suggestAltEndpoint, ...fillAltEndpoints],
  fields: [
    {
      name: 'alt',
      label: 'Alt text',
      type: 'text',
      // Required (src/media/autoAlt.ts requireAlt), except that photos left
      // blank get alt text from Claude when ANTHROPIC_API_KEY is set.
      admin: {
        description: altTextEnabled()
          ? 'What the photo shows, in a sentence, for people who can’t see it. Leave it empty and it is written for you after saving.'
          : 'What the photo shows, in a sentence, for people who can’t see it.',
        components: {
          afterInput: [
            { path: '@/media/SuggestAlt#SuggestAlt', clientProps: { enabled: altTextEnabled() } },
          ],
        },
      },
    },
    {
      name: 'altAuto',
      label: 'Alt text written by AI',
      type: 'checkbox',
      admin: {
        position: 'sidebar',
        description: 'Check it describes the photo. Editing the alt text clears this.',
        condition: (data) => Boolean(data?.altAuto),
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
    // Photos only: videos are hosted on Bunny Stream, never here (src/video).
    mimeTypes: ['image/*'],
    // Cap and re-compress the original (it is still kept, for downloads and future sizes).
    resizeOptions: { width: 2560, height: 2560, fit: 'inside', withoutEnlargement: true },
    imageSizes: MEDIA_SIZES,
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    crop: true,
  },
}
