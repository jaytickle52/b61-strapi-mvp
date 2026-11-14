'use client'
import { useRowLabel } from '@payloadcms/ui'

/** Names a repeater row after what was typed in it ("Schedule a tour"), not "Button 01". */
export function LabelRow() {
  const { data, rowNumber } = useRowLabel<{ label?: string; text?: string }>()
  const text = data?.label || data?.text
  return <span>{text || `Item ${String((rowNumber ?? 0) + 1).padStart(2, '0')}`}</span>
}
