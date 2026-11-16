'use client'
import { useConfig } from '@payloadcms/ui'
import { useEffect, useState } from 'react'

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

/** Photo names, fetched once per photo for the whole editor: its alt text, else its file name. */
const names = new Map<string, Promise<string>>()

export function usePhotoName(value: unknown): string {
  const { config } = useConfig()
  const api = config.routes?.api ?? '/api'
  const raw = value && typeof value === 'object' ? (value as any).id : value
  const id = raw === null || raw === undefined || raw === '' ? null : String(raw)
  const known = value && typeof value === 'object' ? str((value as any).alt) || str((value as any).filename) : ''
  const [name, setName] = useState(known)
  useEffect(() => {
    if (known) return setName(known)
    if (!id) return setName('')
    let live = true
    if (!names.has(id)) {
      names.set(
        id,
        fetch(`${api}/media/${encodeURIComponent(id)}?depth=0`, { credentials: 'include' })
          .then((r) => (r.ok ? r.json() : null))
          .then((d) => str(d?.alt) || str(d?.filename) || 'Photo')
          .catch(() => 'Photo'),
      )
    }
    names.get(id)!.then((n) => live && setName(n))
    return () => {
      live = false
    }
  }, [id, api, known])
  return name
}
