import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'
import { ymd, zoned } from '../events/time'
import { slugField } from 'payload'
import { contentAccess, guardPublishing, publicAudienceOrSignedIn, publishedOrSignedIn } from '../access'
import { sectionBlocks } from '../blocks'
import { refuseDeleteWhenUsed, usageEndpoint, usageField } from '../usage/fields'
import { fromTemplateEndpoint, listTemplatesEndpoint } from '../templates/endpoint'

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

// Contributors save drafts; Editors and School Admins publish and delete (src/access.ts).
const writeAccess = contentAccess
// A fresh object for each collection: Payload adds its own hooks to these
// lists (drag ordering does), and a shared list would leak them across
// collections.
const publishGuard = () => ({ beforeChange: [guardPublishing] })

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
    group: 'Website',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    livePreview: livePreview((d) => (d.slug === 'home' || !d.slug ? '/' : `/${d.slug}`)),
    preview: (doc) => previewUrl(doc.slug === 'home' ? '/' : `/${doc.slug}`, doc.school),
    components: { beforeListTable: ['@/templates/NewFromTemplate#NewFromTemplate'] },
  },
  access: { read: publishedOrSignedIn, ...writeAccess },
  versions: drafts,
  indexes: [{ fields: ['school', 'slug'], unique: true }],
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField({ disableUnique: true }),
    // Which Element library version built this page (demo only; see b61/library.ts).
    { name: 'libraryVersion', type: 'number', admin: { hidden: true } },
    { name: 'headingCheck', type: 'ui', admin: { components: { Field: '@/b61/kit/admin/HeadingCheck#HeadingCheck' } } },
    {
      name: 'sections',
      type: 'blocks',
      blocks: sectionBlocks,
      admin: { initCollapsed: true, description: 'Add, reorder and remove sections. Open one to edit it; changes show in the live preview as you type.' },
    },
    usageField('pages'),
  ],
  // Menus, buttons and text links point at pages; don't let one vanish under them.
  hooks: { ...publishGuard(), beforeDelete: [refuseDeleteWhenUsed('pages')] },
  endpoints: [usageEndpoint('pages'), listTemplatesEndpoint, fromTemplateEndpoint],
}

/**
 * All-day events start (and end) at midnight at the school, whatever time the
 * date picker happened to hold, so they land on the right day everywhere.
 * "Ends" is the last day; a one-day event has none.
 */
const allDayToMidnight: CollectionBeforeChangeHook = ({ data }) => {
  if (!data?.allDay || !data.startsAt) return data
  const first = ymd(data.startsAt)
  data.startsAt = zoned(first).toISOString()
  if (data.endsAt) {
    const last = ymd(data.endsAt)
    data.endsAt = last > first ? zoned(last).toISOString() : null
  }
  return data
}

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    group: 'News & events',
    useAsTitle: 'title',
    defaultColumns: ['title', 'startsAt', 'audience', 'importedFrom', '_status'],
    description: 'Enter an event once: it shows on the website, the calendar, the subscribe feed and the parent feed.',
    livePreview: livePreview((d) => (d.audience === 'parents' ? '/parents' : `/events/${d.slug ?? ''}`)),
  },
  access: { read: publicAudienceOrSignedIn, ...writeAccess },
  versions: drafts,
  hooks: { beforeChange: [guardPublishing, allDayToMidnight] },
  indexes: [{ fields: ['school', 'slug'], unique: true }],
  defaultSort: 'startsAt',
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField({ disableUnique: true }),
    {
      name: 'allDay',
      label: 'All day',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'No start time: a holiday, a break, a whole-day trip. Spanning several days? Set the last day in "Ends".' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startsAt',
          label: 'Starts',
          type: 'date',
          required: true,
          admin: { date: { pickerAppearance: 'dayAndTime' }, width: '50%' },
        },
        {
          name: 'endsAt',
          label: 'Ends',
          type: 'date',
          admin: { date: { pickerAppearance: 'dayAndTime' }, width: '50%' },
          validate: (v: unknown, { siblingData }: { siblingData: any }) =>
            !v || !siblingData?.startsAt || new Date(v as string) >= new Date(siblingData.startsAt) || 'Must be after the start.',
        },
      ],
    },
    { name: 'location', type: 'text' },
    audience,
    // Filled in by "Calendar feeds" for events copied from another calendar.
    {
      name: 'importedFrom',
      type: 'relationship',
      relationTo: 'calendar-feeds',
      admin: {
        position: 'sidebar',
        readOnly: true,
        condition: (data) => Boolean(data?.importedFrom),
        description: 'Copied from this calendar feed. Change it in the original calendar: edits here are replaced at the next import.',
      },
    },
    { name: 'importUid', type: 'text', index: true, admin: { hidden: true } },
    { name: 'importHash', type: 'text', admin: { hidden: true } },
    { name: 'summary', type: 'textarea', maxLength: 200, admin: { description: 'Short version for cards, the app and the parent feed' } },
    { name: 'description', type: 'richText' },
    { name: 'image', type: 'upload', relationTo: 'media' },
  ],
}

export const News: CollectionConfig = {
  slug: 'news',
  labels: { singular: 'News post', plural: 'News' },
  admin: {
    group: 'News & events',
    components: { beforeListTable: ['@/admin/CategoryLinks#ManageCategories'] },
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'categories', 'audience', '_status'],
    livePreview: livePreview((d) => (d.audience === 'parents' ? '/parents' : `/news/${d.slug ?? ''}`)),
  },
  access: { read: publicAudienceOrSignedIn, ...writeAccess },
  versions: drafts,
  hooks: publishGuard(),
  indexes: [{ fields: ['school', 'slug'], unique: true }],
  defaultSort: '-date',
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField({ disableUnique: true }),
    { name: 'date', type: 'date', required: true, admin: { position: 'sidebar' } },
    audience,
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'news-categories',
      hasMany: true,
      admin: { position: 'sidebar', description: 'Visitors can filter the News page by these. Use + to add a new category; reorder them from "Manage categories" above the News list.' },
    },
    { name: 'summary', type: 'textarea', maxLength: 200 },
    { name: 'body', type: 'richText' },
    { name: 'image', type: 'upload', relationTo: 'media' },
  ],
}

export const Programs: CollectionConfig = {
  slug: 'programs',
  admin: {
    group: 'Programs & staff',
    useAsTitle: 'name',
    defaultColumns: ['name', 'grades', '_status'],
    description: 'Drag the handle at the start of each row to change the order on the website.',
    livePreview: livePreview((d) => `/programs/${d.slug ?? ''}`),
  },
  access: { read: publishedOrSignedIn, ...writeAccess },
  versions: drafts,
  hooks: publishGuard(),
  indexes: [{ fields: ['school', 'slug'], unique: true }],
  // Drag the rows in the list to set the order programs appear on the site.
  orderable: true,
  defaultSort: '_order',
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField({ useAsSlug: 'name', disableUnique: true }),
    { name: 'grades', type: 'text', admin: { description: 'e.g. K–5' } },
    { name: 'summary', type: 'textarea', maxLength: 240 },
    { name: 'description', type: 'richText' },
    { name: 'image', type: 'upload', relationTo: 'media' },
  ],
}

export const Staff: CollectionConfig = {
  slug: 'staff',
  labels: { singular: 'Staff member', plural: 'Staff' },
  admin: {
    group: 'Programs & staff',
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'department'],
    description: 'Drag the handle at the start of each row to change the order on the website.',
    livePreview: livePreview(() => '/staff'),
  },
  access: { read: publishedOrSignedIn, ...writeAccess },
  versions: drafts,
  hooks: publishGuard(),
  // Drag the rows in the list to set the order people appear on the site.
  orderable: true,
  defaultSort: '_order',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text', required: true },
    { name: 'department', type: 'text' },
    { name: 'email', type: 'email' },
    { name: 'bio', type: 'textarea' },
    { name: 'photo', type: 'upload', relationTo: 'media' },
  ],
}
