'use client'
import { headingText } from '../heading'
import { useRowLabel } from '@payloadcms/ui'

/**
 * Names a section row after its heading: "01  Hero  Cover  Rooted in faith…".
 * Works for any element whose heading uses the kit's heading group, and falls
 * back to a plain `heading` or `title` field for simpler blocks.
 */
export function ElementLabel({ name, modeField, modes }: { name: string; modeField?: string; modes?: Record<string, string> }) {
  const { data, rowNumber } = useRowLabel<Record<string, any>>()
  const heading = headingText(data?.heading) || data?.title || data?.eyebrow || ''
  const mode = modeField && modes ? modes[data?.[modeField] ?? Object.keys(modes)[0]] : null
  return (
    <span className="b61-el-label">
      <span className="b61-el-label__num">{String((rowNumber ?? 0) + 1).padStart(2, '0')}</span>
      <strong>{name}</strong>
      {mode && <span className="b61-el-label__mode">{mode}</span>}
      {heading && <span className="b61-el-label__text">{heading}</span>}
    </span>
  )
}
