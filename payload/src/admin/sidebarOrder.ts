import type { Config, Plugin } from 'payload'

/*
 * The order of the editor's sidebar. Payload lists groups, and the items in
 * each group, in the order the collections appear in the config; plugin
 * collections (forms, redirects, search) land wherever their plugin put them.
 * This plugin sorts everything into the order below. Groups themselves are set
 * on each collection (`admin.group`). Changing the sidebar is display only: no
 * addresses, data or permissions change, so it is safe to rearrange, with one
 * catch: Payload numbers unnamed database indexes by collection order. Keep
 * pages, events, news, programs and news-categories in this relative order
 * (each has a school + slug index), or the CI drift check will ask for a
 * migration that renames them.
 *
 *   Website           Pages, Announcements
 *   News & events     Events, Calendar feeds, News
 *   Programs & staff  Programs, Staff
 *   Files             Photos and videos, Documents
 *   Forms             Forms, Form submissions, Form files, Email log
 *   Settings          School settings, Redirects, Search (Banner 61 only)
 *   Users & access    Users
 *   Banner 61         Schools
 *
 * Not in the sidebar (`admin.group: false`): News categories, managed from the
 * News list ("Manage categories") and the Categories field on a post.
 */
export const SIDEBAR_ORDER = [
  'pages',
  'announcements',
  'events',
  'calendar-feeds',
  'news',
  'programs',
  'staff',
  'media',
  'documents',
  'forms',
  'form-submissions',
  'form-uploads',
  'email-log',
  'school-settings',
  'redirects',
  'search',
  'users',
  'schools',
]

// Last in `plugins`, so the plugin collections are already there.
export const sidebarOrder: Plugin = (config: Config): Config => {
  const rank = (slug: string) => {
    const i = SIDEBAR_ORDER.indexOf(slug)
    return i === -1 ? SIDEBAR_ORDER.length : i
  }
  const collections = (config.collections ?? [])
    .map((c, i) => ({ c, i }))
    .sort((a, b) => rank(a.c.slug) - rank(b.c.slug) || a.i - b.i)
    .map(({ c }) => c)
  return { ...config, collections }
}
