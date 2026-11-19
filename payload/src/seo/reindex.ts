import type { Payload } from 'payload'

const COLLECTIONS = ['pages', 'events', 'news'] as const

/*
 * Site search only learns about a page when it is saved. Anything published
 * that isn't in the search index yet (content from before search existed, or
 * a fresh demo) is saved again here, unchanged, so it lands in the index.
 * Pages the search rules leave out (parents-only, hidden from search engines)
 * are skipped by the index itself, so this stays cheap on later runs.
 */
export async function reindexSearch(payload: Payload) {
  const indexed = await payload.find({ collection: 'search', depth: 0, pagination: false, overrideAccess: true, select: { doc: true } as any })
  const have = new Set((indexed.docs as any[]).map((d) => `${d.doc?.relationTo}:${typeof d.doc?.value === 'object' ? d.doc.value?.id : d.doc?.value}`))
  let n = 0
  for (const collection of COLLECTIONS) {
    const { docs } = await payload.find({
      collection,
      where: { _status: { equals: 'published' } },
      depth: 0,
      pagination: false,
      overrideAccess: true,
      select: { audience: true, meta: true } as any,
    })
    for (const doc of docs as any[]) {
      if (have.has(`${collection}:${doc.id}`) || doc.meta?.noindex || doc.audience === 'parents') continue
      await payload.update({ collection, id: doc.id, data: {}, depth: 0, overrideAccess: true, context: { reindex: true } })
      n++
    }
  }
  if (n) payload.logger.info(`Search: indexed ${n} published items.`)
}
