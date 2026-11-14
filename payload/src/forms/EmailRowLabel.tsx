'use client'
import { useRowLabel } from '@payloadcms/ui'

/** Names an email row by who it goes to: "To the family", "To office@…". */
export function EmailRowLabel() {
  const { data } = useRowLabel<{ emailTo?: string }>()
  const to = (data?.emailTo ?? '').trim()
  if (!to) return <span>To the school (notification)</span>
  if (/\{\{\s*email\s*\}\}/i.test(to)) return <span>To the family (confirmation)</span>
  return <span>To {to}</span>
}
