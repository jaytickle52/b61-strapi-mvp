import type { CollectionConfig } from 'payload'
import { contentAccess, guardPublishing, publishedOrSignedIn } from '../access'
import { link } from '../b61/kit/controls'
import { previewUrl } from './content'

/*
 * Announcements: a short message across the top of every page (or just the
 * home page) between two dates. Snow days, enrollment deadlines, a game this
 * Friday. Replaces the Bulletin Announcements plugin.
 *
 * Shows when it is published AND the start date has come AND the end date (if
 * any) hasn't passed. The site checks the dates on every visit, so nothing
 * needs to run on a schedule.
 */
export const Announcements: CollectionConfig = {
  slug: 'announcements',
  labels: { singular: 'Announcement', plural: 'Announcements' },
  admin: {
    group: 'Website',
    useAsTitle: 'title',
    defaultColumns: ['title', 'style', 'startsAt', 'endsAt', '_status'],
    description: 'A short message across the top of the website between two dates: closings, deadlines, big news.',
    livePreview: { url: ({ data }) => previewUrl('/', (data as any)?.school) },
  },
  access: { read: publishedOrSignedIn, ...contentAccess },
  versions: { drafts: { autosave: { interval: 400 } }, maxPerDoc: 25 },
  hooks: { beforeChange: [guardPublishing] },
  defaultSort: '-startsAt',
  fields: [
    {
      name: 'title',
      label: 'Headline',
      type: 'text',
      required: true,
      maxLength: 80,
      admin: { description: 'Shown in bold, e.g. "School closed Monday".' },
    },
    {
      name: 'message',
      type: 'textarea',
      maxLength: 200,
      admin: { description: 'One or two short sentences. Optional.' },
    },
    {
      name: 'button',
      type: 'group',
      label: 'Link (optional)',
      fields: [{ name: 'label', type: 'text', admin: { placeholder: 'e.g. Read more' } }, link()],
    },
    {
      name: 'style',
      type: 'select',
      required: true,
      defaultValue: 'standard',
      options: [
        { label: 'Standard (school colors)', value: 'standard' },
        { label: 'Urgent (red: closings, weather, safety)', value: 'urgent' },
        { label: 'Celebration (accent color)', value: 'celebrate' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'startsAt',
      label: 'Show from',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'endsAt',
      label: 'Hide after',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
        description: 'Leave empty to keep it up until you unpublish it.',
      },
      validate: (v: unknown, { siblingData }: { siblingData: any }) =>
        !v || !siblingData?.startsAt || new Date(v as string) > new Date(siblingData.startsAt) || 'Must be after "Show from".',
    },
    {
      name: 'showOn',
      label: 'Show on',
      type: 'select',
      required: true,
      defaultValue: 'all',
      options: [
        { label: 'Every page', value: 'all' },
        { label: 'Home page only', value: 'home' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'dismissible',
      label: 'Visitors can close it',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar', description: 'Once closed, it stays closed on that visitor\'s browser.' },
    },
  ],
}
