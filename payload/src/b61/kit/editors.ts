import {
  BoldFeature,
  InlineToolbarFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  UnderlineFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

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

