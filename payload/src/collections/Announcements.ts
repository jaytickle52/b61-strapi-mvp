import type { CollectionConfig } from 'payload'
import { contentAccess, guardPublishing, publishedOrSignedIn } from '../access'
import { link } from '../b61/kit/controls'
import { previewUrl } from './content'

/*
 * Announcements: a message shown between two dates, either as a bar across the
 * top of the site (snow days, deadlines, a game this Friday) or as a pop-up
 * (open house, enrollment opening, a short form). Replaces the Bulletin
 * Announcements plugin and a separate pop-up plugin.
 *
 * Both kinds share the same rules: Show from / Hide after, which pages, drafts
 * and publishing. A pop-up adds where it sits, when it opens, how often it
 * comes back, a photo and an optional form.
 *
 * Shows when it is published AND the start date has come AND the end date (if
 * any) hasn't passed. The site checks the dates on every visit, so nothing
 * needs to run on a schedule.
 */

const isPopup = (_: unknown, s: any) => s?.display === 'popup'
export const Announcements: CollectionConfig = {
  slug: 'announcements',
  labels: { singular: 'Announcement', plural: 'Announcements' },
  admin: {
    group: 'Website',
    useAsTitle: 'title',
    defaultColumns: ['title', 'display', 'style', 'startsAt', 'endsAt', '_status'],
    description:
      'A message on the website between two dates: a bar across the top (closings, deadlines, big news) or a pop-up (open house, enrollment, a short form).',
    // The preview opens this one at once (and on any page), even if it was closed before.
    livePreview: {
      url: ({ data }) => previewUrl((data as any)?.id ? `/?b61-notice=${(data as any).id}` : '/', (data as any)?.school),
    },
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
      maxLength: 400,
      admin: { description: 'Optional. A bar fits one or two short sentences (200 characters); a pop-up can say a little more (400).' },
      // (A custom check replaces the built-in one, so both limits are checked here.)
      validate: (v: unknown, { siblingData }: { siblingData: any }) => {
        const n = v ? String(v).length : 0
        if (n > 400) return 'Keep it to 400 characters.'
        if (n > 200 && siblingData?.display !== 'popup') return 'A bar fits 200 characters. Shorten it, or show it as a pop-up.'
        return true
      },
    },
    {
      name: 'button',
      type: 'group',
      label: 'Link (optional)',
      fields: [{ name: 'label', type: 'text', admin: { placeholder: 'e.g. Read more' } }, link()],
    },
    {
      name: 'display',
      label: 'Show as',
      type: 'select',
      required: true,
      defaultValue: 'bar',
      options: [
        { label: 'Bar above the header', value: 'bar' },
        { label: 'Pop-up', value: 'popup' },
      ],
      admin: {
        position: 'sidebar',
        description: 'A pop-up opens over the page after it loads; only one shows at a time. Keep pop-ups rare.',
      },
    },
    {
      name: 'popupPosition',
      label: 'Pop-up position',
      type: 'select',
      defaultValue: 'center',
      options: [
        { label: 'Middle of the screen (dims the page)', value: 'center' },
        { label: 'Corner (the page stays usable)', value: 'corner' },
      ],
      admin: {
        position: 'sidebar',
        condition: isPopup,
        description: 'On phones both slide up from the bottom of the screen.',
      },
    },
    {
      name: 'popupOpens',
      label: 'Opens',
      type: 'select',
      defaultValue: 'soon',
      options: [
        { label: 'A few seconds after the page loads', value: 'soon' },
        { label: 'After about 10 seconds', value: 'later' },
        { label: 'When the visitor scrolls halfway down', value: 'scroll' },
      ],
      admin: { position: 'sidebar', condition: isPopup },
    },
    {
      name: 'popupRepeat',
      label: 'After it is closed',
      type: 'select',
      defaultValue: 'once',
      options: [
        { label: 'Don\'t show it to that visitor again', value: 'once' },
        { label: 'Show it again after a week', value: 'week' },
        { label: 'Show it again on their next visit', value: 'visit' },
      ],
      admin: {
        position: 'sidebar',
        condition: isPopup,
        description: 'Editing the pop-up shows it again to everyone.',
      },
    },
    {
      name: 'image',
      label: 'Pop-up photo or graphic (optional)',
      type: 'upload',
      relationTo: 'media',
      filterOptions: { mimeType: { contains: 'image' } },
      admin: {
        condition: isPopup,
        description: 'Shown above the headline. Put the important words in the headline and message too: words inside a graphic can\'t be read by everyone.',
      },
    },
    {
      name: 'form',
      label: 'Pop-up form (optional)',
      type: 'relationship',
      relationTo: 'forms',
      filterOptions: ({ data }: any) => {
        const school = data?.school && typeof data.school === 'object' ? data.school.id : data?.school
        return school ? { school: { equals: school } } : true
      },
      admin: {
        condition: isPopup,
        description: 'One of this school\'s forms (Website > Forms), shown under the message. Short forms work best: a name, an email, a question or two.',
      },
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
        { label: 'Only the pages I choose', value: 'pages' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'pages',
      label: 'Pages',
      type: 'relationship',
      relationTo: 'pages',
      hasMany: true,
      filterOptions: ({ data }: any) => {
        const school = data?.school && typeof data.school === 'object' ? data.school.id : data?.school
        return school ? { school: { equals: school } } : true
      },
      admin: { position: 'sidebar', condition: (_, s) => s?.showOn === 'pages' },
      validate: (v: unknown, { siblingData }: { siblingData: any }) =>
        siblingData?.showOn !== 'pages' || (Array.isArray(v) && v.length > 0) || 'Choose at least one page.',
    },
    {
      name: 'dismissible',
      label: 'Visitors can close it',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        // A pop-up can always be closed.
        condition: (_, s) => s?.display !== 'popup',
        description: 'Once closed, it stays closed on that visitor\'s browser.',
      },
    },
  ],
}
