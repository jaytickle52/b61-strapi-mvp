import type { Block, Field, RichTextField } from 'payload'
import {
  BlocksFeature,
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  UnderlineFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { dropdown, link, segmented } from './controls'
import { ICON_OPTIONS, list, onlyImages } from './groups'

/*
 * B61 editing kit: the Content field of Split, Prose and CTA Band.
 *
 * One editor, typed top to bottom like a document. Besides paragraphs,
 * headings, lists and links, its "+" / slash menu offers the band's own
 * pieces as cards: Pull quote, Icon list and Emphasis. Built-in items that
 * would break the design (Heading 1, uploads, check lists, plain blockquotes)
 * are left out. Prose also gets Divider (a hairline between parts).
 *
 * The renderers still work from the older list shape (body / emphasis /
 * quote / icon row); fromBody() turns the editor's content into that list,
 * and toBody() turns an old list into editor content (seed data, upgrades).
 */

type Opts = { emphasisScale?: boolean; dividers?: boolean; quotePhoto?: boolean }

const emphasisFields = (scaled: boolean): Field[] => [
  { name: 'text', label: 'Text', type: 'textarea', required: true, admin: { rows: 2 } },
  ...(scaled ? [segmented('scale', 'Scale', [['regular', 'Regular'], ['display', 'Display']], { default: 'regular' }) as Field] : []),
]

const quoteFields = (photo: boolean): Field[] => [
  { name: 'text', label: 'Quote', type: 'textarea', required: true, admin: { rows: 3 } },
  {
    type: 'row',
    fields: [
      { name: 'attribution', label: 'Attribution', type: 'text', admin: { width: photo ? '60%' : '100%' } },
      ...(photo ? [{ name: 'photo', label: 'Photo', type: 'upload', relationTo: 'media', filterOptions: onlyImages, admin: { width: '40%' } } as Field] : []),
    ],
  },
]

const iconListBlock: Block = {
  slug: 'iconList',
  labels: { singular: 'Icon list', plural: 'Icon lists' },
  fields: [
    list('rows', 'Rows', 'Row', [
      {
        type: 'row',
        fields: [
          { name: 'text', label: 'Text', type: 'text', required: true, admin: { width: '60%' } },
          dropdown('icon', 'Icon', ICON_OPTIONS, { default: 'dot', width: '40%' }),
        ],
      },
      { name: 'hasLink', label: 'Link this row', type: 'checkbox' },
      { ...link(), admin: { hideGutter: true, condition: (_: unknown, s: any) => Boolean(s?.hasLink) } } as Field,
    ], { minRows: 1 }),
  ],
}

// Separate slugs where an element offers fewer choices, so no card shows a
// control that would do nothing there.
export const BODY_BLOCKS = {
  emphasis: { slug: 'emphasis', labels: { singular: 'Emphasis', plural: 'Emphasis' }, fields: emphasisFields(false) } as Block,
  emphasisScaled: { slug: 'emphasisScaled', labels: { singular: 'Emphasis', plural: 'Emphasis' }, fields: emphasisFields(true) } as Block,
  pullQuote: { slug: 'pullQuote', labels: { singular: 'Pull quote', plural: 'Pull quotes' }, fields: quoteFields(true) } as Block,
  pullQuoteText: { slug: 'pullQuoteText', labels: { singular: 'Pull quote', plural: 'Pull quotes' }, fields: quoteFields(false) } as Block,
  iconList: iconListBlock,
}

const slugs = (o: Opts) => ({
  emphasis: o.emphasisScale ? 'emphasisScaled' : 'emphasis',
  quote: o.quotePhoto === false ? 'pullQuoteText' : 'pullQuote',
})

export function bodyField(o: Opts = {}): RichTextField {
  const s = slugs(o)
  return {
    name: 'body',
    label: 'Content',
    type: 'richText',
    admin: { description: 'Type as in a document. Use + or / for a Pull quote, Icon list or Emphasis line.' },
    editor: lexicalEditor({
      features: () => [
        ParagraphFeature(),
        HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
        BoldFeature(),
        ItalicFeature(),
        UnderlineFeature(),
        LinkFeature({ enabledCollections: ['pages', 'documents'] }),
        UnorderedListFeature(),
        OrderedListFeature(),
        ...(o.dividers ? [HorizontalRuleFeature()] : []),
        BlocksFeature({ blocks: [BODY_BLOCKS[s.quote as 'pullQuote'], BODY_BLOCKS.iconList, BODY_BLOCKS[s.emphasis as 'emphasis']] }),
        FixedToolbarFeature(),
        InlineToolbarFeature(),
      ],
    }),
  }
}

/* ---------- Conversions ---------- */

export type BodyItem = {
  id?: string
  type: 'body' | 'emphasis' | 'quote' | 'iconrow'
  body?: any
  text?: string | null
  scale?: string | null
  attribution?: string | null
  photo?: any
  icon?: string | null
  hasLink?: boolean | null
  link?: any
  divider?: boolean | null
}

let n = 0
const uid = () => `b61${Date.now().toString(36)}${(n++).toString(36)}`.slice(-24)

const blockNode = (blockType: string, fields: Record<string, unknown>) => ({
  type: 'block',
  version: 2,
  format: '',
  fields: { id: uid(), blockName: '', blockType, ...fields },
})
const hr = () => ({ type: 'horizontalrule', version: 1 })
const idOf = (v: any) => (v && typeof v === 'object' ? v.id : v) ?? null
const cleanLink = (l: any) => (l ? { type: l.type ?? 'page', page: idOf(l.page), url: l.url ?? null, newTab: Boolean(l.newTab) } : undefined)

/** An old-style list (body / emphasis / quote / icon row) as editor content. */
export function toBody(items: Partial<BodyItem>[] | any[] | null | undefined, o: Opts = {}) {
  const s = slugs(o)
  const children: any[] = []
  let rows: any[] = []
  const flushRows = () => {
    if (rows.length) children.push(blockNode('iconList', { rows }))
    rows = []
  }
  ;(items ?? []).forEach((it: BodyItem, i: number) => {
    const type = it.type ?? 'body'
    if (type !== 'iconrow' || it.divider) flushRows()
    if (o.dividers && it.divider && i > 0) children.push(hr())
    if (type === 'body') children.push(...(it.body?.root?.children ?? []))
    else if (type === 'emphasis' && it.text) children.push(blockNode(s.emphasis, { text: it.text, ...(o.emphasisScale ? { scale: it.scale ?? 'regular' } : {}) }))
    else if (type === 'quote' && it.text)
      children.push(blockNode(s.quote, { text: it.text, attribution: it.attribution ?? null, ...(o.quotePhoto === false ? {} : { photo: idOf(it.photo) }) }))
    else if (type === 'iconrow' && it.text)
      rows.push({ id: uid(), text: it.text, icon: it.icon ?? 'dot', hasLink: Boolean(it.hasLink), link: cleanLink(it.link) })
  })
  flushRows()
  if (!children.length) return null
  return { root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr', children } }
}

const isEmpty = (node: any): boolean =>
  node?.type === 'paragraph' && !(node.children ?? []).some((c: any) => (c.type === 'text' ? String(c.text ?? '').trim() : true))

/** Editor content as the list the renderers draw from. Consecutive text becomes one body copy item. */
export function fromBody(state: any): BodyItem[] {
  const out: BodyItem[] = []
  let group: any[] = []
  let divider = false
  const take = () => {
    const d = divider
    divider = false
    return d
  }
  const flush = () => {
    const kept = group.filter((g) => !isEmpty(g))
    if (kept.length) out.push({ id: `b${out.length}`, type: 'body', divider: take(), body: { root: { ...(state.root ?? {}), children: kept } } })
    group = []
  }
  for (const node of state?.root?.children ?? []) {
    if (node.type === 'horizontalrule') {
      flush()
      divider = out.length > 0
      continue
    }
    if (node.type !== 'block') {
      group.push(node)
      continue
    }
    flush()
    const f = node.fields ?? {}
    const id = f.id ?? `b${out.length}`
    switch (f.blockType) {
      case 'emphasis':
      case 'emphasisScaled':
        out.push({ id, type: 'emphasis', text: f.text, scale: f.scale ?? 'regular', divider: take() })
        break
      case 'pullQuote':
      case 'pullQuoteText':
        out.push({ id, type: 'quote', text: f.text, attribution: f.attribution, photo: f.photo, divider: take() })
        break
      case 'iconList': {
        const d = take()
        ;(f.rows ?? []).forEach((r: any, i: number) =>
          out.push({ id: r.id ?? `${id}-${i}`, type: 'iconrow', text: r.text, icon: r.icon, hasLink: r.hasLink, link: r.link, divider: i === 0 ? d : false }),
        )
        // A new list starts after this one even if another follows.
        out.push({ id: `${id}-end`, type: 'body' })
        break
      }
    }
  }
  flush()
  return out
}
