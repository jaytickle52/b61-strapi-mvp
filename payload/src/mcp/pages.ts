import type { Block, Field, PayloadRequest } from 'payload'
import { z } from 'zod/v3'
import { sectionBlocks } from '../blocks'

/*
 * Page tools for MCP. Payload's generated create/update tools for Pages spell
 * out every section's every field (about 170 KB each), too big for a model to
 * carry. These take the page data as JSON instead, and `pageSections` gives a
 * compact outline of the sections when it's needed. Payload still checks every
 * field on save and says what's wrong.
 */

type Out = { content: { type: 'text'; text: string }[] }
const text = (t: string): Out => ({ content: [{ type: 'text', text: t }] })

/** One line per field: name: type (choices), nested fields indented. */
function outline(fields: Field[], depth = 0, lines: string[] = []): string[] {
  const pad = '  '.repeat(depth)
  for (const f of fields as any[]) {
    if (f.type === 'ui') continue
    if (!('name' in f) || !f.name) {
      // tabs, rows, collapsibles: their fields sit at this level
      if (f.type === 'tabs') for (const t of f.tabs ?? []) {
        if (t.name) {
          lines.push(`${pad}${t.name}: group`)
          outline(t.fields ?? [], depth + 1, lines)
        } else outline(t.fields ?? [], depth, lines)
      } else if (f.fields) outline(f.fields, depth, lines)
      continue
    }
    if (f.admin?.hidden) continue
    let line = `${pad}${f.name}: ${f.type}`
    if (f.hasMany) line += '[]'
    if (f.required) line += ' (required)'
    if (f.relationTo) line += ` -> ${Array.isArray(f.relationTo) ? f.relationTo.join('|') : f.relationTo} id`
    if (f.options) {
      const vals = f.options.map((o: any) => (typeof o === 'string' ? o : o.value))
      line += ` = ${vals.slice(0, 12).join(' | ')}${vals.length > 12 ? ' | ...' : ''}`
    }
    if (f.custom?.mcpNote) line += ` (${f.custom.mcpNote})`
    else if (f.type === 'richText') line += ' (Lexical JSON: copy the shape from an existing page)'
    lines.push(line)
    if (f.type === 'blocks') {
      const names = (f.blocks ?? []).map((b: Block) => b.slug)
      lines.push(`${pad}  blocks: ${names.join(', ')} (see those sections)`)
    } else if (f.fields) outline(f.fields, depth + 1, lines)
  }
  return lines
}

export const pageSections = {
  name: 'pageSections',
  description:
    "Outline of the section types a page's `sections` can hold (Hero, Split, Prose...) and each one's fields. Pass `type` (e.g. b61Hero) for one section's fields, or leave it out for the list.",
  parameters: { type: z.string().optional() } as any,
  handler: async (args: Record<string, unknown>): Promise<Out> => {
    const type = args.type as string | undefined
    if (!type) {
      return text(
        'Section types (blockType):\n' +
          sectionBlocks.map((b) => `- ${b.slug}${b.labels?.singular ? ` (${b.labels.singular})` : ''}`).join('\n') +
          '\n\nCall pageSections with a type for its fields. Each section in `sections` is {"blockType": "<type>", ...fields}.',
      )
    }
    const block = sectionBlocks.find((b) => b.slug === type)
    if (!block) return text(`No section type "${type}". Call pageSections without a type for the list.`)
    return text(`${block.slug} fields:\n${outline(block.fields).join('\n')}`)
  },
}

const parse = (raw: unknown): Record<string, any> => {
  const data = typeof raw === 'string' ? JSON.parse(raw) : raw
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('`data` must be a JSON object')
  return data as Record<string, any>
}

const errorText = (e: any): string => {
  const details = e?.data?.errors?.map((x: any) => `${x.path ?? x.field}: ${x.message}`).join('\n')
  return `Couldn't save: ${e?.message ?? e}${details ? `\n${details}` : ''}`
}

export const createPage = {
  name: 'createPage',
  description:
    'Create a page as a DRAFT (not live until a person publishes it). `data` is a JSON object: {"school": <school id>, "title": "...", "slug": "...", "sections": [...]}. Returns the new id; then call editorLinks.',
  parameters: { data: z.string().describe('The page as a JSON object') } as any,
  handler: async (args: Record<string, unknown>, req: PayloadRequest): Promise<Out> => {
    try {
      const data = parse(args.data)
      const doc: any = await (req.payload.create as any)({
        collection: 'pages',
        data: { ...data, _status: 'draft' },
        draft: true,
        depth: 0,
        overrideAccess: false,
        user: req.user,
        req,
      })
      return text(`Draft page created: id ${doc.id}, slug "${doc.slug}". Not live until published.`)
    } catch (e) {
      return text(errorText(e))
    }
  },
}

export const updatePage = {
  name: 'updatePage',
  description:
    "Change a page by id, saved as a DRAFT on top of what's live (the live page is untouched until a person publishes). `data` is a JSON object with only the fields to change. `sections` replaces the whole list, so read the page first (findPages with draft: true) and send the full edited list.",
  parameters: {
    id: z.union([z.string(), z.number()]),
    data: z.string().describe('The fields to change, as a JSON object'),
  } as any,
  handler: async (args: Record<string, unknown>, req: PayloadRequest): Promise<Out> => {
    try {
      const data = parse(args.data)
      delete data._status
      const doc: any = await (req.payload.update as any)({
        collection: 'pages',
        id: args.id,
        data,
        draft: true,
        depth: 0,
        overrideAccess: false,
        user: req.user,
        req,
      })
      return text(`Draft saved for page ${doc.id} ("${doc.title}"). The live page is unchanged until someone publishes.`)
    } catch (e) {
      return text(errorText(e))
    }
  },
}
