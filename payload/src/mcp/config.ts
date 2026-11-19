import type { CollectionConfig, CollectionSlug, Config, Plugin, PayloadRequest } from 'payload'
import { mcpPlugin } from '@payloadcms/plugin-mcp'
import { UnauthorizedError } from 'payload'
import { z } from 'zod/v3'
import { isB61Admin } from '../access'
import { createPage, pageSections, updatePage } from './pages'
import { uploadPhoto } from './photos'
import { previewLink } from './preview'

/*
 * The MCP connector: lets Claude (or any MCP client) read and edit school
 * content at /api/mcp, the same way Respira does for the WordPress sites.
 *
 * Rules:
 * - Only Banner 61 admins can make keys (Banner 61 > MCP keys). A key acts as
 *   the admin who made it, so Payload's normal access rules, school scoping and
 *   hooks all apply. Each key has switches per collection and per action.
 * - Nothing is ever deleted through MCP (no delete tools are offered).
 * - Everything Claude writes to pages, news, events, programs, staff,
 *   announcements and school settings is saved as a DRAFT. The live site
 *   doesn't change until someone presses Publish in the editor
 *   (`draftsOnlyOverMcp` below forces this, whatever the client asks for).
 * - Private data is never offered: users, form answers, form files and the
 *   email log are not in the list.
 *
 * Signing in: the key goes in the `Authorization: Bearer <key>` header. Clients
 * that can't send headers may put it in the address instead
 * (`/api/mcp?key=<key>`); that copy can show up in request logs, so prefer the
 * header and delete keys you no longer use.
 */

/** Collections whose MCP writes are forced to drafts. Keep in step with `versions.drafts` in the collections. */
export const MCP_DRAFT_COLLECTIONS: CollectionSlug[] = [
  'pages',
  'news',
  'events',
  'programs',
  'staff',
  'announcements',
  'school-settings',
]

const read = { find: true }
const write = { find: true, create: true, update: true }

const collections: NonNullable<Parameters<typeof mcpPlugin>[0]['collections']> = {
  schools: {
    enabled: read,
    description:
      'The schools (websites) on the Banner 61 platform: name, slug and domains. Every other item belongs to one school through its `school` field (the school id). Look the school up here first.',
  },
  'school-settings': {
    enabled: { find: true, update: true },
    description:
      "One per school: the school's look (colours, fonts, theme), header and footer menus, contact details, email sender, search-engine and analytics settings. Updates are saved as a draft.",
  },
  // Create/update go through createPage / updatePage (src/mcp/pages.ts): the
  // generated ones describe every section field and are ~170 KB each.
  pages: {
    enabled: read,
    description:
      "A school's web pages. `sections` holds the page's sections (Hero, Split, Prose, Card Grid, ...) in order. Filter by `school` and find by `slug` (the home page's slug is `home`). Use draft: true to see the latest draft. Change pages with createPage / updatePage.",
  },
  news: {
    enabled: write,
    description: "A school's news posts. Creates and updates are saved as drafts.",
  },
  'news-categories': {
    enabled: write,
    description: 'Categories for news posts, per school.',
  },
  events: {
    enabled: write,
    description:
      "A school's calendar events (start/end times in the school's time zone; `allDay` for day-long events). Events imported from a calendar feed are overwritten by the next import, so edit the source calendar instead. Creates and updates are saved as drafts.",
  },
  programs: {
    enabled: write,
    description: "A school's programs (grades, divisions, offerings). Creates and updates are saved as drafts.",
  },
  staff: {
    enabled: write,
    description: "A school's staff directory. Creates and updates are saved as drafts.",
  },
  announcements: {
    enabled: write,
    description:
      'Announcements shown between show-from / hide-after times, as a bar above the header (display "bar") or a pop-up (display "popup": popupPosition center/corner, popupOpens soon/later/scroll, popupRepeat once/week/visit, optional image and form). showOn all / home / pages (with pages). Styles Standard / Urgent / Celebration. Creates and updates are saved as drafts.',
  },
  media: {
    enabled: { find: true, update: true },
    description:
      "A school's photo library. Find photos to use in pages (by id) and update alt text, captions and credits. Add a new photo from a web address with uploadPhoto.",
  },
  documents: {
    enabled: read,
    description: "A school's PDFs and office files, for linking from pages.",
  },
  forms: {
    enabled: read,
    description: "A school's forms (inquiry, tour, contact, apply...). Read only; form answers are never available here.",
  },
  redirects: {
    enabled: write,
    description: "Redirects from a school's old web addresses to new pages, per school.",
  },
  'calendar-feeds': {
    enabled: read,
    description: 'Calendar feeds (ICS) each school imports events from. Read only.',
  },
}

/** Where to open an item in the editor and on the site. */
const originOf = (req: PayloadRequest): string => {
  const h = req.headers
  const host = (h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000').split(',')[0].trim()
  const proto = (h.get('x-forwarded-proto') ?? (/^(localhost|127\.)/.test(host) ? 'http' : 'https')).split(',')[0].trim()
  return `${proto}://${host}`
}

const editorLinks = {
  name: 'editorLinks',
  description:
    'Get the editor address for an item (to review a draft and press Publish) and, for pages, the public address. Use after creating or updating something so the person can check it.',
  // Cast: the plugin types its own copy of zod; the shapes are the same at run time.
  parameters: {
    collection: z.enum(['pages', 'news', 'events', 'programs', 'staff', 'announcements', 'school-settings', 'media', 'redirects']),
    id: z.union([z.string(), z.number()]),
  } as any,
  handler: async (args: Record<string, unknown>, req: PayloadRequest) => {
    const collection = args.collection as CollectionSlug
    const id = args.id as number | string
    const doc: any = await (req.payload.findByID as any)({
      collection,
      id,
      depth: 1,
      draft: true,
      overrideAccess: false,
      user: req.user,
      req,
    })
    const origin = originOf(req)
    const lines = [`Editor (review, then Publish): ${origin}/admin/collections/${collection}/${id}`]
    if (collection === 'pages' && doc?.slug) {
      const school = doc.school && typeof doc.school === 'object' ? doc.school : null
      const domain = school?.domains?.[0]?.domain
      const path = doc.slug === 'home' ? '/' : `/${doc.slug}`
      if (domain) lines.push(`Live page: https://${domain}${path}`)
      if (school?.slug) lines.push(`On the shared address: ${origin}/next/school/${school.slug} then ${path}`)
      lines.push(`Status: ${doc._status === 'published' ? 'published (the draft, if any, is not live yet)' : 'draft, not live'}`)
    }
    return { content: [{ type: 'text' as const, text: lines.join('\n') }] }
  },
}

const instructions = `Banner 61 school websites (Payload CMS). One app serves many schools.
- Every item belongs to a school through its \`school\` field. Find the school in \`schools\` first and always filter by it (where: {"school": {"equals": <id>}}).
- Writes to pages, news, events, programs, staff, announcements and school settings are saved as drafts. Nothing goes live until a person publishes it in the editor. After a change, call editorLinks and give the person the link.
- Nothing can be deleted here. Private data (users, form answers, email log) is not available.
- Pages: \`sections\` is the list of sections. Read an existing page first (findPages, draft: true) and copy its structure rather than inventing fields; pageSections outlines each section type. Change pages with createPage / updatePage, one page at a time.
- Photos: add one from a public https address with uploadPhoto (school, url, alt), then use its id as \`image\` in a section.
- A school in Setup or Review: previewLink gives a signed link to its drafts, for its leaders.
- Use \`select\` to fetch only the fields you need; pages are large.`

const apiKeys = (collection: CollectionConfig): CollectionConfig => ({
  ...collection,
  labels: { singular: 'MCP key', plural: 'MCP keys' },
  admin: {
    ...collection.admin,
    group: 'Banner 61',
    description:
      'Keys that let Claude (or another MCP client) read and edit school content at /api/mcp. A key acts as you. Edits are saved as drafts; nothing is deleted. Delete a key to switch it off.',
    hidden: ({ user }) => !isB61Admin(user),
  },
  access: {
    ...collection.access,
    // Banner 61 admins only; each admin sees and manages only their own keys.
    create: ({ req }) => isB61Admin(req.user),
    read: ({ req }) => (isB61Admin(req.user) ? { user: { equals: req.user!.id } } : false),
    update: ({ req }) => (isB61Admin(req.user) ? { user: { equals: req.user!.id } } : false),
    delete: ({ req }) => (isB61Admin(req.user) ? { user: { equals: req.user!.id } } : false),
    unlock: () => false,
  },
})

export const mcpConnector = mcpPlugin({
  collections,
  overrideApiKeyCollection: apiKeys,
  overrideAuth: async (req, getDefault) => {
    const header = req.headers.get('authorization')
    const fromUrl = req.searchParams?.get('key') ?? null
    const settings = await getDefault(header?.startsWith('Bearer ') ? null : fromUrl)
    // Belt and braces: only Banner 61 admins' keys work, even if one was made some other way.
    const user = await (req.payload.findByID as any)({ collection: 'users', id: (settings.user as any).id, depth: 0, overrideAccess: true })
    if (!isB61Admin(user)) throw new UnauthorizedError()
    return settings
  },
  mcp: {
    tools: [pageSections, createPage, updatePage, editorLinks, uploadPhoto, previewLink],
    serverOptions: {
      instructions,
      serverInfo: { name: 'Banner 61 Schools', version: '1.0.0' },
    },
  },
})

/**
 * Forces drafts for everything written through MCP: a create makes an
 * unpublished draft, and an update saves a new draft version without touching
 * what's live. Runs before Payload decides how to save, whatever `draft` the
 * client sent.
 */
export const draftsOnlyOverMcp: Plugin = (config: Config): Config => ({
  ...config,
  collections: (config.collections ?? []).map((c) =>
    MCP_DRAFT_COLLECTIONS.includes(c.slug as CollectionSlug)
      ? {
          ...c,
          hooks: {
            ...c.hooks,
            beforeOperation: [
              ...(c.hooks?.beforeOperation ?? []),
              ({ args, operation, req }) => {
                if ((req.payloadAPI as string) === 'MCP' && (operation === 'create' || operation === 'update' || operation === 'updateByID')) {
                  return { ...args, draft: true }
                }
                return args
              },
            ],
          },
        }
      : c,
  ),
})
