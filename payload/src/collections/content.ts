import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import { publicAudienceOrSignedIn, publishedOrSignedIn, signedIn } from '../access'
import { sectionBlocks } from '../blocks'

// Every editable item saves drafts as you type (autosave), so the live preview
// beside the form updates within a moment without clicking Save.
// History keeps the newest 25 versions per item, which keeps the database small.
const drafts = {
  drafts: { autosave: { interval: 400 }, schedulePublish: true },
  maxPerDoc: 25,
}

// Where an item appears on the website. The preview runs on the same site as
// the admin, so these are plain relative paths.
// The school travels with the link, so the preview shows the right school.
const idOf = (v: unknown) => (v && typeof v === 'object' ? (v as { id?: unknown }).id : v)
export const previewUrl = (path: string, school?: unknown) =>
  `/next/preview?path=${encodeURIComponent(path)}${school ? `&school=${encodeURIComponent(String(idOf(school)))}` : ''}`

const livePreview = (pathFor: (data: Record<string, unknown>) => string) => ({
  url: ({ data }: { data: Record<string, unknown> }) => previewUrl(pathFor(data ?? {}), data?.school),
  breakpoints: [
    { label: 'Phone', name: 'phone', width: 390, height: 844 },
    { label: 'Tablet', name: 'tablet', width: 820, height: 1180 },
    { label: 'Desktop', name: 'desktop', width: 1280, height: 800 },
  ],
})

const writeAccess = { create: signedIn, update: signedIn, delete: signedIn }

const audience = {
  name: 'audience',
  type: 'select' as const,
  required: true,
  defaultValue: 'public',
  options: [
    { label: 'Everyone (website and parent feed)', value: 'public' },
    { label: 'Parents only (parent feed)', value: 'parents' },
  ],
  admin: { position: 'sidebar' as const },
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    livePreview: livePreview((d) => (d.slug === 'home' || !d.slug ? '/' : `/${d.slug}`)),
    preview: (doc) => previewUrl(doc.slug === 'home' ? '/' : `/${doc.slug}`, doc.school),
  },
  access: { read: publishedOrSignedIn, ...writeAccess },
  versions: drafts,
  indexes: [{ fields: ['school', 'slug'], unique: true }],
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField({ disableUnique: true }),
    { name: 'seoDescription', type: 'textarea', maxLength: 160, admin: { position: 'sidebar' } },
    {
      name: 'sections',
      type: 'blocks',
      blocks: sectionBlocks,
      admin: { initCollapsed: true, description: 'Add, reorder and remove sections. Open one to edit it; changes show in the live preview as you type.' },
    },
  ],
}

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'startsAt', 'audience', '_status'],
    description: 'Enter an event once: it shows on the website, calendars and the parent feed.',
    livePreview: livePreview((d) => (d.audience === 'parents' ? '/parents' : `/events/${d.slug ?? ''}`)),
  },
  access: { read: publicAudienceOrSignedIn, ...writeAccess },
  versions: drafts,
  indexes: [{ fields: ['school', 'slug'], unique: true }],
  defaultSort: 'startsAt',
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField({ disableUnique: true }),
    {
      type: 'row',
      fields: [
        { name: 'startsAt', type: 'date', required: true, admin: { date: { pickerAppearance: 'dayAndTime' } } },
        { name: 'endsAt', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
      ],
    },
    { name: 'location', type: 'text' },
    audience,
    { name: 'summary', type: 'textarea', maxLength: 200, admin: { description: 'Short version for cards, the app and the parent feed' } },
    { name: 'description', type: 'richText' },
    { name: 'image', type: 'upload', relationTo: 'media' },
  ],
}

export const News: CollectionConfig = {
  slug: 'news',
  labels: { singular: 'News post', plural: 'News' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'audience', '_status'],
    livePreview: livePreview((d) => (d.audience === 'parents' ? '/parents' : `/news/${d.slug ?? ''}`)),
  },
  access: { read: publicAudienceOrSignedIn, ...writeAccess },
  versions: drafts,
  indexes: [{ fields: ['school', 'slug'], unique: true }],
  defaultSort: '-date',
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField({ disableUnique: true }),
    { name: 'date', type: 'date', required: true, admin: { position: 'sidebar' } },
    audience,
    { name: 'summary', type: 'textarea', maxLength: 200 },
    { name: 'body', type: 'richText' },
    { name: 'image', type: 'upload', relationTo: 'media' },
  ],
}

export const Programs: CollectionConfig = {
  slug: 'programs',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'grades', '_status'],
    livePreview: livePreview((d) => `/programs/${d.slug ?? ''}`),
  },
  access: { read: publishedOrSignedIn, ...writeAccess },
  versions: drafts,
  indexes: [{ fields: ['school', 'slug'], unique: true }],
  defaultSort: 'sortOrder',
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField({ useAsSlug: 'name', disableUnique: true }),
    { name: 'grades', type: 'text', admin: { description: 'e.g. K–5' } },
    { name: 'summary', type: 'textarea', maxLength: 240 },
    { name: 'description', type: 'richText' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'sortOrder', type: 'number', defaultValue: 100, admin: { position: 'sidebar' } },
  ],
}

export const Staff: CollectionConfig = {
  slug: 'staff',
  labels: { singular: 'Staff member', plural: 'Staff' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'department'],
    livePreview: livePreview(() => '/staff'),
  },
  access: { read: publishedOrSignedIn, ...writeAccess },
  versions: drafts,
  defaultSort: 'sortOrder',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text', required: true },
    { name: 'department', type: 'text' },
    { name: 'email', type: 'email' },
    { name: 'bio', type: 'textarea' },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'sortOrder', type: 'number', defaultValue: 100, admin: { position: 'sidebar' } },
  ],
}
