import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import { anyone, contentAccess } from '../access'

/**
 * News categories (Athletics, Academics, Arts…), one list per school. Posts
 * pick any number; the News page shows them as filters, in the order dragged
 * here.
 */
export const NewsCategories: CollectionConfig = {
  slug: 'news-categories',
  labels: { singular: 'News category', plural: 'News categories' },
  orderable: true,
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
    description: 'Drag to set the order the categories appear on the News page.',
  },
  access: { read: anyone, ...contentAccess },
  indexes: [{ fields: ['school', 'slug'], unique: true }],
  fields: [
    { name: 'name', type: 'text', required: true, maxLength: 40 },
    slugField({ useAsSlug: 'name', disableUnique: true }),
  ],
}
