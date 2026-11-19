import {
  BoldFeature,
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

/** A short-text editor: paragraphs, bold, italic, links and lists. For intros and item bodies. */
export const simpleEditor = () =>
  lexicalEditor({
    features: () => [
      ParagraphFeature(),
      BoldFeature(),
      ItalicFeature(),
      UnderlineFeature(),
      LinkFeature({ enabledCollections: ['pages', 'documents'] }),
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
