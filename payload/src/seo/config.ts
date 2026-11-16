import type { Field, Plugin } from 'payload'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { isB61Admin, publishersOnly } from '../access'
import { searchPlugin } from '@payloadcms/plugin-search'
import { plainText } from './text'

/*
 * Thread C: SEO fields, redirects from old addresses, and site search.
 * All three are per school (the multi-tenant plugin scopes `redirects` and
 * `search`; see payload.config.ts).
 */

const idOf = (v: any) => (v && typeof v === 'object' ? v.id : v) ?? null

/** Where a document lives on the site. */
export function pathFor(collection: string, doc: any): string {
  const slug = doc?.slug
  if (collection === 'pages') return !slug || slug === 'home' ? '/' : `/${slug}`
  if (collection === 'news' || collection === 'events' || collection === 'programs') return `/${collection}/${slug}`
  return '/'
}

const summaryOf = (doc: any) => doc?.meta?.description || doc?.summary || ''

/** An old address as one consistent form: path only, leading slash, no trailing slash, lowercase. */
export function normalizePath(input: string): string {
  let p = String(input ?? '').trim()
  try {
    if (/^https?:\/\//i.test(p)) p = new URL(p).pathname
  } catch {}
  p = p.split('?')[0].split('#')[0]
  if (!p.startsWith('/')) p = '/' + p
  p = p.replace(/\/+$/, '') || '/'
  try {
    p = decodeURI(p)
  } catch {}
  return p.toLowerCase()
}

// One line of plain advice under each SEO field: what Google and AI tools do with it.
const SEO_HINTS: Record<string, string> = {
  title: 'What the page is, in the words a family would search, then the school\'s name: "Admissions and Tuition | Grace Christian School". Used exactly as written. About 50-60 characters.',
  description:
    'One or two plain sentences that answer what a family is looking for here (grades, tuition, how to apply). Google shows it under the title; AI tools may quote it. Empty: taken from the page.',
  image: 'Shown when the page is shared in a text or on social media. Empty: the page\'s first photo.',
}

const seoFields = ({ defaultFields }: { defaultFields: Field[] }): Field[] => [
  ...defaultFields.map((f: any) =>
    f?.name && SEO_HINTS[f.name] ? { ...f, admin: { ...(f.admin ?? {}), description: SEO_HINTS[f.name] } } : f,
  ),
  {
    name: 'noindex',
    label: 'Hide this page from search engines',
    type: 'checkbox',
    admin: { description: 'For thank-you pages and the like. Also keeps it out of the site search.' },
  },
]

export const seoPlugins: Plugin[] = [
  seoPlugin({
    collections: ['pages', 'news', 'events', 'programs'],
    uploadsCollection: 'media',
    tabbedUI: true,
    fields: seoFields,
    generateTitle: ({ doc }) => doc?.title || doc?.name || '',
    generateDescription: ({ doc }) => {
      const s = doc?.summary || plainText(doc?.sections ?? doc?.body ?? doc?.description, 400)
      return String(s).slice(0, 155)
    },
    generateImage: ({ doc }) => idOf(doc?.image) ?? undefined,
    generateURL: ({ doc, collectionConfig }) => pathFor(collectionConfig?.slug ?? 'pages', doc),
  }),

  redirectsPlugin({
    collections: ['pages', 'news', 'events', 'programs'],
    redirectTypes: ['301', '302'],
    overrides: {
      labels: { singular: 'Redirect', plural: 'Redirects' },
      // Redirects work the moment they're saved: Editors and School Admins only.
      access: { read: () => true, create: publishersOnly, update: publishersOnly, delete: publishersOnly },
      admin: {
        group: 'Settings',
        description: 'Send visitors from an old address (e.g. from the WordPress site) to a page here. Used only when nothing else lives at the old address.',
        defaultColumns: ['from', 'to', 'type', 'updatedAt'],
      },
      indexes: [{ fields: ['school', 'from'], unique: true }],
      fields: ({ defaultFields }) =>
        defaultFields.map((f: any) =>
          f.name === 'from'
            ? {
                ...f,
                unique: false,
                label: 'Old address',
                admin: { ...(f.admin ?? {}), placeholder: '/about-us/our-history', description: 'The path, or a whole old link; it is saved as a path.' },
                hooks: { beforeValidate: [({ value }: { value?: string }) => (value ? normalizePath(value) : value)] },
              }
            : f.name === 'type'
              ? { ...f, label: 'Kind', defaultValue: '301', admin: { ...(f.admin ?? {}), description: '301 = moved for good (normal). 302 = temporary.' } }
              : f,
        ),
    },
  }),

  searchPlugin({
    collections: ['pages', 'news', 'events', 'programs'],
    defaultPriorities: { pages: 10, programs: 20, events: 30, news: 40 },
    // Parents-only posts and hidden pages never go into the public search.
    skipSync: ({ doc }) => doc?.audience === 'parents' || Boolean(doc?.meta?.noindex),
    beforeSync: ({ originalDoc, searchDoc, collectionSlug }) => ({
      ...searchDoc,
      title: originalDoc?.title || originalDoc?.name || searchDoc.title,
      school: idOf(originalDoc?.school),
      url: pathFor(collectionSlug, originalDoc),
      summary: String(summaryOf(originalDoc)).slice(0, 300),
      text: plainText([originalDoc?.title, originalDoc?.summary, originalDoc?.sections, originalDoc?.body, originalDoc?.description, originalDoc?.location]),
    }),
    searchOverrides: {
      labels: { singular: 'Search result', plural: 'Search index' },
      admin: {
        group: 'Settings',
        description: 'Kept up to date automatically from pages, programs, events and news.',
        hidden: ({ user }) => !isB61Admin(user),
      },
      fields: ({ defaultFields }) => [
        ...defaultFields,
        { name: 'url', type: 'text', admin: { readOnly: true } },
        { name: 'summary', type: 'textarea', admin: { readOnly: true } },
        { name: 'text', type: 'textarea', admin: { readOnly: true, hidden: true } },
      ],
    },
  }),
]
