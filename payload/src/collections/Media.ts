import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: () => true },
  admin: { description: 'Photos and files. Add alt text so screen readers can describe each image.' },
  fields: [{ name: 'alt', label: 'Alt text', type: 'text', required: true }],
  upload: {
    // On Railway this folder is a persistent volume.
    staticDir: process.env.MEDIA_DIR || 'media',
    imageSizes: [
      { name: 'card', width: 800 },
      { name: 'hero', width: 1800 },
    ],
  },
}
