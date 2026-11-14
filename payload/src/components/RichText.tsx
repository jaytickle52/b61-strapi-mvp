import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

export default function RichText({ content }: { content?: unknown }) {
  if (!content || typeof content !== 'object') return null
  return <LexicalRichText data={content as SerializedEditorState} className="prose-blocks" />
}
