import {
  BlocksFeature,
  BoldFeature,
  ChecklistFeature,
  HeadingFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  UnderlineFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { EmphasizeFeature } from './editor/emphasize'
import { noNewTab } from './controls'
import { BODY_BLOCKS } from './body'

/** A short-text editor: paragraphs, bold, italic, links and lists. For intros and item bodies. */
export const simpleEditor = () =>
  lexicalEditor({
    features: () => [
      ParagraphFeature(),
      BoldFeature(),
      ItalicFeature(),
      UnderlineFeature(),
      LinkFeature({ enabledCollections: ['pages', 'documents'], fields: noNewTab }),
      UnorderedListFeature(),
      OrderedListFeature(),
      InlineToolbarFeature(),
    ],
  })


/**
 * The Heading field's editor: typed like a sentence, one Emphasize button, no
 * blocks, no gutter. Shift+Enter makes a line break (EDITING-STANDARD.md section 2).
 */
export const headingEditor = () =>
  lexicalEditor({
    admin: { hideGutter: true, hideAddBlockButton: true, hideDraggableBlockElement: true, hideInsertParagraphAtEnd: true, placeholder: 'Type the heading' },
    features: () => [EmphasizeFeature(), FixedToolbarFeature(), InlineToolbarFeature()],
  })

/*
 * The editor for an event's description, a news article's body and a staff
 * bio (Jay, 19 Nov 2026). Starts from Payload's standard editor and takes out
 * what doesn't belong there:
 *   - Relationship (a card linking another record; unclear to staff)
 *   - Heading 1 (the title is already the page's Heading 1)
 *   - Block quote (the Quote block below replaces it)
 * and keeps the Checklist ("What to bring"), plus the kit's own pieces in the
 * + / slash menu: Emphasis, Quote, Callout and Button.
 */
export const descriptionEditor = () =>
  lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures.filter((f) => !['relationship', 'blockquote', 'heading', 'link', 'checklist'].includes(f.key)),
      HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
      LinkFeature({ enabledCollections: ['pages', 'documents'], fields: noNewTab }),
      ChecklistFeature(),
      BlocksFeature({ blocks: [BODY_BLOCKS.emphasis, BODY_BLOCKS.pullQuoteText, BODY_BLOCKS.callout, BODY_BLOCKS.bodyButton] }),
    ],
  })

/**
 * Content saved before a feature was taken out of an editor still holds its
 * nodes, and the editor can't open a node type it no longer knows. This turns
 * them into what the editor still has: Heading 1 → Heading 2, a block quote →
 * a paragraph, a relationship card → removed.
 */
export function tidyRemovedNodes(state: unknown): unknown {
  if (!state || typeof state !== 'object' || !(state as any).root) return state
  const walk = (node: any): any => {
    if (!node || typeof node !== 'object') return node
    if (node.type === 'relationship') return null
    let next = node
    if (node.type === 'heading' && node.tag === 'h1') next = { ...node, tag: 'h2' }
    else if (node.type === 'quote') next = { ...node, type: 'paragraph', textFormat: 0, textStyle: '' }
    if (Array.isArray(next.children)) next = { ...next, children: next.children.map(walk).filter(Boolean) }
    return next
  }
  return { ...(state as any), root: walk((state as any).root) }
}
