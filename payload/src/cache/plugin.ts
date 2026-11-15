import { revalidateTag } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, Config, Plugin } from 'payload'
import { SCHOOLS_TAG, schoolTag } from './tags'

/**
 * What a school's public site reads. A change to any of these clears that
 * school's cached pages. Form answers, the email log, the search index and
 * jobs are left out: a visitor sending a form shouldn't clear the cache.
 */
const SHOWN_ON_SITE = new Set([
  'pages', 'events', 'calendar-feeds', 'news', 'news-categories', 'announcements', 'programs', 'staff',
  'media', 'documents', 'school-settings', 'forms', 'redirects', 'schools',
])

const idOf = (v: unknown): number | string | null =>
  v == null ? null : typeof v === 'object' ? ((v as { id?: number | string }).id ?? null) : (v as number | string)

/**
 * Clears a cache label at once (the next visitor waits for fresh content
 * rather than seeing the old one). Outside a web request (the build's demo
 * seed, scripts) there is no cache to clear and Next throws: ignored.
 */
export function clearTag(tag: string) {
  try {
    revalidateTag(tag, { expire: 0 })
  } catch {
    // not inside a request
  }
}

function clearFor(collection: string, doc: any, previousDoc?: any) {
  if (collection === 'schools') {
    clearTag(SCHOOLS_TAG)
    if (doc?.id != null) clearTag(schoolTag(doc.id))
    return
  }
  const ids = new Set([idOf(doc?.school), idOf(previousDoc?.school)].filter((v) => v != null))
  for (const id of ids) clearTag(schoolTag(id!))
}

const afterChange: CollectionAfterChangeHook = ({ collection, doc, previousDoc }) => {
  // A draft that was never published (including every autosave of one) isn't on the site yet.
  if (doc?._status === 'draft' && previousDoc?._status !== 'published') return doc
  clearFor(collection.slug, doc, previousDoc)
  return doc
}

const afterDelete: CollectionAfterDeleteHook = ({ collection, doc }) => {
  clearFor(collection.slug, doc)
  return doc
}

/** Adds the cache-clearing hooks. Listed last in the plugins so it also sees plugin collections (forms, redirects). */
export const cacheInvalidation: Plugin = (config: Config): Config => ({
  ...config,
  collections: (config.collections ?? []).map((c) =>
    SHOWN_ON_SITE.has(c.slug)
      ? {
          ...c,
          hooks: {
            ...c.hooks,
            afterChange: [...(c.hooks?.afterChange ?? []), afterChange],
            afterDelete: [...(c.hooks?.afterDelete ?? []), afterDelete],
          },
        }
      : c,
  ),
})
