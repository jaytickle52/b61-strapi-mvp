'use client'
import { useRowLabel } from '@payloadcms/ui'

/** Names an accreditation / membership / profile row after the name typed in it. */
export function NameRowLabel() {
  const { data, rowNumber } = useRowLabel<{ name?: string }>()
  return <span>{data?.name || `Item ${String((rowNumber ?? 0) + 1).padStart(2, '0')}`}</span>
}
