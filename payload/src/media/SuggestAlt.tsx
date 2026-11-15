'use client'
import { Button, useDocumentInfo, useField, useFormFields } from '@payloadcms/ui'
import { useState } from 'react'

/** Shrinks a chosen photo to ~1000px before sending it, so it is quick and small. */
async function toDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, 1000 / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/jpeg', 0.85)
}

/** Under Alt text: "Suggest alt text" (Claude looks at the photo). Shown only when switched on. */
export function SuggestAlt({ enabled }: { enabled?: boolean }) {
  const { id } = useDocumentInfo()
  const { setValue } = useField<string>({ path: 'alt' })
  const file = useFormFields(([fields]) => fields?.file?.value) as File | undefined
  const mimeType = useFormFields(([fields]) => fields?.mimeType?.value) as string | undefined
  const [state, setState] = useState<{ busy?: boolean; message?: string }>({})

  if (!enabled) return null
  const isPhoto =
    (file instanceof File && file.type.startsWith('image/')) ||
    (!file && mimeType?.startsWith('image/'))
  if (!isPhoto && !(id && !file)) return null

  const suggest = async () => {
    setState({ busy: true })
    try {
      const body = file instanceof File ? { image: await toDataUrl(file) } : { id }
      const res = await fetch('/api/media/suggest-alt', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (data.alt) {
        setValue(data.alt)
        setState({ message: 'Suggested. Check it describes the photo, then save.' })
      } else setState({ message: data.error ?? 'No suggestion this time.' })
    } catch {
      setState({ message: 'No suggestion this time. Please write it yourself.' })
    }
  }

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 8, flexWrap: 'wrap' }}>
      <Button
        buttonStyle="secondary"
        size="small"
        margin={false}
        disabled={state.busy}
        onClick={suggest}
      >
        {state.busy ? 'Looking at the photo…' : 'Suggest alt text'}
      </Button>
      {state.message && (
        <span className="field-description" role="status" style={{ margin: 0 }}>
          {state.message}
        </span>
      )}
    </div>
  )
}
