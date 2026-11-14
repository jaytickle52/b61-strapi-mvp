'use client'
import { useRowLabel } from '@payloadcms/ui'

const TYPE_NAMES: Record<string, string> = { body: 'Body copy', emphasis: 'Emphasis', quote: 'Pull quote', iconrow: 'Icon row' }

/** First words of a rich-text value, for a row label. */
function firstWords(rich: any): string {
  const walk = (n: any): string => (n?.text ? n.text : Array.isArray(n?.children) ? n.children.map(walk).join(' ') : '')
  return walk(rich?.root).trim().slice(0, 60)
}

/** Names a repeater row after what was typed in it ("Schedule a tour"), not "Button 01". */
export function LabelRow() {
  const { data, rowNumber } = useRowLabel<Record<string, any>>()
  const typed = data?.label || data?.text || firstWords(data?.body)
  const kind = data?.type && TYPE_NAMES[data.type]
  const fallback = `Item ${String((rowNumber ?? 0) + 1).padStart(2, '0')}`
  if (kind) {
    return (
      <span className="b61-el-label">
        <strong>{kind}</strong>
        {typed && <span className="b61-el-label__text">{typed}</span>}
      </span>
    )
  }
  return <span>{typed || fallback}</span>
}
