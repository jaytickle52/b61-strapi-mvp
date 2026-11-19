'use client'
import { createClientFeature } from '@payloadcms/richtext-lexical/client'
import { $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical'

/** The button face: a word, so editors don't have to guess what an icon means. */
function EmphasizeLabel() {
  return <span className="b61-emph-btn">Emphasize</span>
}

const groups = [
  {
    type: 'buttons' as const,
    key: 'b61-emphasize',
    order: 40,
    items: [
      {
        ChildComponent: EmphasizeLabel,
        key: 'b61-emphasize',
        order: 1,
        isActive: ({ selection }: { selection: any }) => ($isRangeSelection(selection) ? selection.hasFormat('highlight') : false),
        onSelect: ({ editor }: { editor: any }) => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'highlight')
        },
      },
    ],
  },
]

/**
 * Emphasize: the Heading field's one button. It sets Lexical's `highlight`
 * format, which the site renders as the theme's accent words (kit/heading.ts).
 */
export const EmphasizeFeatureClient = createClientFeature({
  enableFormats: ['highlight'],
  toolbarFixed: { groups },
  toolbarInline: { groups },
})
