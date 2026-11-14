'use client'
import { useRowLabel } from '@payloadcms/ui'

/** "01  B61 Hero · Rooted in faith. Ready for life." instead of "Untitled". */
export function HeroBlockLabel() {
  const { data, rowNumber } = useRowLabel<{ lines?: { text?: string }[]; layoutMode?: string }>()
  const heading = (data?.lines ?? []).map((l) => l?.text).filter(Boolean).join(' ')
  const mode = data?.layoutMode === 'band' ? 'Band' : 'Cover'
  return (
    <span style={{ display: 'flex', gap: 8, alignItems: 'baseline', minWidth: 0, whiteSpace: 'nowrap' }}>
      <span style={{ opacity: 0.6 }}>{String((rowNumber ?? 0) + 1).padStart(2, '0')}</span>
      <strong>B61 Hero</strong>
      <span style={{ opacity: 0.6 }}>{mode}</span>
      {heading && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>{heading}</span>}
    </span>
  )
}
