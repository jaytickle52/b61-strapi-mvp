import type { Block, Field, Payload } from 'payload'
import { BODY_BLOCKS } from '../b61/kit/body'

/*
 * "Where is this used": finds every place a photo, document or page is used
 * across one school's content, including inside the Content editor (photos in
 * pull quotes, links in text and icon lists), which the database doesn't track.
 *
 * It reads each item's fields with the collection's own field definitions, so
 * it knows that a number in a "Photo" field is a photo and not, say, a count.
 * Both the published version and the latest draft are checked.
 */

export type UsageTarget = 'media' | 'documents' | 'pages'
export type UsageHit = { collection: string; id: number | string; title: string; where: string[] }

const SCANNED = [
  'pages',
  'events',
  'news',
  'programs',
  'staff',
  'school-settings',
  'forms',
] as const

const idOf = (v: unknown): string | null => {
  if (v == null) return null
  if (typeof v === 'object') {
    const o = v as any
    if ('relationTo' in o && 'value' in o) return idOf(o.value)
    return o.id != null ? String(o.id) : null
  }
  return String(v)
}

const labelOf = (f: any, fallback: string): string => {
  const l = f?.label ?? f?.labels?.singular
  return typeof l === 'string' && l ? l : fallback
}

const lexicalBlocks: Record<string, Block> = Object.fromEntries(
  Object.values(BODY_BLOCKS).map((b) => [b.slug, b]),
)

type Ctx = { target: UsageTarget; id: string; found: Set<string> }

function matchesRelation(f: any, value: unknown, ctx: Ctx): boolean {
  const rel = f.relationTo
  const values = Array.isArray(value) ? value : [value]
  for (const v of values) {
    if (v == null) continue
    if (Array.isArray(rel)) {
      // Polymorphic: { relationTo, value }
      if (
        typeof v === 'object' &&
        (v as any).relationTo === ctx.target &&
        idOf((v as any).value) === ctx.id
      )
        return true
    } else if (rel === ctx.target && idOf(v) === ctx.id) return true
  }
  return false
}

function walkLexical(node: any, path: string[], ctx: Ctx) {
  if (!node || typeof node !== 'object') return
  if (Array.isArray(node)) return node.forEach((n) => walkLexical(n, path, ctx))
  if (
    (node.type === 'upload' || node.type === 'relationship') &&
    node.relationTo === ctx.target &&
    idOf(node.value) === ctx.id
  )
    ctx.found.add(
      [...path, node.type === 'upload' ? 'Photo in text' : 'Embedded in text'].join(' › '),
    )
  if (
    (node.type === 'link' || node.type === 'autolink') &&
    node.fields?.doc?.relationTo === ctx.target &&
    idOf(node.fields.doc.value) === ctx.id
  )
    ctx.found.add([...path, 'Link in text'].join(' › '))
  if (node.type === 'block' && node.fields?.blockType) {
    const block = lexicalBlocks[node.fields.blockType]
    if (block)
      walkFields(block.fields, node.fields, [...path, labelOf(block, node.fields.blockType)], ctx)
  }
  if (node.root) walkLexical(node.root, path, ctx)
  if (Array.isArray(node.children)) walkLexical(node.children, path, ctx)
}

export function walkFields(fields: Field[], data: any, path: string[], ctx: Ctx) {
  if (!data || typeof data !== 'object') return
  for (const f of fields as any[]) {
    switch (f.type) {
      case 'row':
      case 'collapsible':
        walkFields(f.fields, data, path, ctx)
        break
      case 'tabs':
        for (const tab of f.tabs) {
          const inner = tab.name ? data[tab.name] : data
          walkFields(tab.fields, inner, tab.name ? [...path, labelOf(tab, tab.name)] : path, ctx)
        }
        break
      case 'group':
        if (f.name) walkFields(f.fields, data[f.name], path, ctx)
        else walkFields(f.fields, data, path, ctx)
        break
      case 'array':
        ;(data[f.name] ?? []).forEach((row: any, i: number) =>
          walkFields(f.fields, row, [...path, `${labelOf(f, f.name)} ${i + 1}`], ctx),
        )
        break
      case 'blocks': {
        const blocks: Block[] = f.blocks ?? []
        ;(data[f.name] ?? []).forEach((row: any, i: number) => {
          const block = blocks.find((b) => b.slug === row?.blockType)
          // "Section 3 (Hero)"
          const list = labelOf(f, f.name).replace(/s$/, '')
          if (block)
            walkFields(
              block.fields,
              row,
              [...path, `${list} ${i + 1} (${labelOf(block, row.blockType)})`],
              ctx,
            )
        })
        break
      }
      case 'upload':
      case 'relationship':
        if (f.name && matchesRelation(f, data[f.name], ctx))
          ctx.found.add([...path, labelOf(f, f.name)].join(' › '))
        break
      case 'richText':
        if (f.name && data[f.name]) walkLexical(data[f.name], [...path, labelOf(f, f.name)], ctx)
        break
    }
  }
}

/** Every place one school's content uses this photo, document or page. */
export async function findUsage(
  payload: Payload,
  target: UsageTarget,
  id: number | string,
  school: unknown,
): Promise<UsageHit[]> {
  const schoolId = idOf(school)
  const hits: UsageHit[] = []
  for (const slug of SCANNED) {
    const collection = payload.collections[slug]
    if (!collection) continue
    const config = collection.config
    const drafts = Boolean(config.versions && (config.versions as any).drafts)
    const where = schoolId ? { school: { equals: schoolId } } : undefined
    const byId = new Map<string, any[]>()
    for (const draft of drafts ? [false, true] : [false]) {
      const res = await payload.find({
        collection: slug,
        where,
        depth: 0,
        pagination: false,
        draft,
        overrideAccess: true,
      })
      for (const doc of res.docs)
        byId.set(String(doc.id), [...(byId.get(String(doc.id)) ?? []), doc])
    }
    for (const [docId, versions] of byId) {
      if (slug === target && docId === String(id)) continue
      const ctx: Ctx = { target, id: String(id), found: new Set() }
      for (const doc of versions) walkFields(config.fields, doc, [], ctx)
      if (!ctx.found.size) continue
      const titleField = (config.admin?.useAsTitle as string) || 'title'
      const first = versions[versions.length - 1] as any
      hits.push({
        collection: slug,
        id: docId,
        title: String(first?.[titleField] ?? first?.title ?? `${labelOf(config, slug)} ${docId}`),
        where: [...ctx.found],
      })
    }
  }
  return hits
}
