import type { CollectionConfig } from 'payload'
import type { FieldAccess } from 'payload'
import { anyone, canPublishAt, publishersOnly } from '../access'

/** The calendar's address can be secret (Google's private address): publishers only. */
const publishersRead: FieldAccess = ({ req, doc }) => Boolean(req.user) && canPublishAt(req.user, (doc as any)?.school)
import { importFeedEndpoint, removeImportedEvents } from '../events/endpoints'

/*
 * Calendars to copy events from: a Google, Outlook or athletics calendar's
 * "ICS" / "iCal" address. Each one is read once a day (with the scheduled
 * publishing run) and on "Import now". Replaces the ICS Calendar plugin, but
 * copies the events in, so they also show in the subscribe feed, site search
 * and the parent feed.
 *
 * Only publishers add or change feeds (imported events go live straight
 * away) or see a feed's address (a private calendar's address works like a
 * password).
 */
export const CalendarFeeds: CollectionConfig = {
  slug: 'calendar-feeds',
  labels: { singular: 'Calendar feed', plural: 'Calendar feeds' },
  admin: {
    useAsTitle: 'name',
    group: 'News & events',
    defaultColumns: ['name', 'audience', 'active', 'lastImportedAt', 'lastResult'],
    description:
      'Copy events in from another calendar (Google, Outlook, athletics). Imported once a day; use "Import now" after adding one.',
  },
  // Names are public (the calendar shows "Athletics" next to its events);
  // everything else about a feed is for publishers only.
  access: { read: anyone, create: publishersOnly, update: publishersOnly, delete: publishersOnly },
  hooks: { beforeDelete: [removeImportedEvents] },
  endpoints: [importFeedEndpoint],
  fields: [
    { name: 'name', type: 'text', required: true, admin: { placeholder: 'e.g. Athletics', description: 'Shown next to each imported event on the calendar.' } },
    {
      name: 'url',
      label: 'Calendar address (ICS / iCal)',
      type: 'text',
      required: true,
      access: { read: publishersRead },
      admin: {
        placeholder: 'https://calendar.google.com/calendar/ical/…/basic.ics',
        description:
          'Google Calendar: Settings → the calendar → "Public address in iCal format" (or the secret address). Outlook: Publish calendar → ICS link. webcal:// links work too.',
      },
      validate: (v: unknown) => {
        if (!v) return 'Required.'
        try {
          const u = new URL(String(v).trim().replace(/^webcal:/i, 'https:'))
          return u.protocol === 'https:' || u.protocol === 'http:' ? true : 'Paste a web address starting with https:// or webcal://.'
        } catch {
          return 'That doesn\'t look like a web address.'
        }
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'audience',
          label: 'Imported events are for',
          type: 'select',
          required: true,
          defaultValue: 'public',
          options: [
            { label: 'Everyone (website and parent feed)', value: 'public' },
            { label: 'Parents only (parent feed)', value: 'parents' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'active',
          label: 'Keep importing',
          type: 'checkbox',
          defaultValue: true,
          admin: { width: '50%', description: 'Untick to pause. Events already imported stay until you delete this feed.' },
        },
      ],
    },
    {
      name: 'importNow',
      type: 'ui',
      admin: { components: { Field: '@/events/ImportNowButton#ImportNowButton' } },
    },
    { name: 'lastImportedAt', label: 'Last imported', type: 'date', access: { read: publishersRead }, admin: { readOnly: true, position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'lastResult', label: 'Last result', type: 'text', access: { read: publishersRead }, admin: { readOnly: true, position: 'sidebar' } },
  ],
}
