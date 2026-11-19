'use client'
import { useEffect, useRef, useState } from 'react'
import type { TextFieldClientComponent } from 'payload'
import { Button, TextField, useField, useFormFields } from '@payloadcms/ui'

type Ticket = { endpoint: string; libraryId: string; videoId: string; collectionId?: string; expires: number; signature: string; embed: string }
type Phase =
  | { kind: 'idle' }
  | { kind: 'uploading'; pct: number }
  | { kind: 'processing'; label: string; progress?: number; videoId: string }
  | { kind: 'ready' }
  | { kind: 'error'; message: string }

/**
 * The "Video link" field with an "Upload a video" button beside it: the file
 * goes straight from the browser to Banner 61's Bunny Stream library (in the
 * school's collection), and the field fills in with its player link. Pasting
 * a YouTube, Vimeo or Bunny link still works the same.
 */
export const VideoField: TextFieldClientComponent = (props) => {
  // uploadFirst (Hero background): one upload box that sends the file to
  // the video library; there is no link to paste.
  const uploadFirst = Boolean((props as any).uploadFirst)
  const path = props.path ?? props.field.name
  const { value, setValue } = useField<string>({ path })
  const [over, setOver] = useState(false)
  const school = useFormFields(([f]) => f?.school?.value as number | string | undefined)
  const [enabled, setEnabled] = useState(false)
  const [phase, setPhase] = useState<Phase>({ kind: 'idle' })
  const fileRef = useRef<HTMLInputElement>(null)
  const uploadRef = useRef<{ abort: (b?: boolean) => Promise<void> } | null>(null)

  useEffect(() => {
    fetch('/api/bunny/config', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => setEnabled(Boolean(d.enabled)))
      .catch(() => setEnabled(false))
  }, [])

  // Poll Bunny while it prepares the video.
  useEffect(() => {
    if (phase.kind !== 'processing') return
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/bunny/status?video=${phase.videoId}`, { credentials: 'include' })
        const s = await r.json()
        if (s.ready) setPhase({ kind: 'ready' })
        else if (s.failed) setPhase({ kind: 'error', message: `${s.label}. Try uploading it again.` })
        else setPhase({ ...phase, label: s.label ?? 'Processing', progress: s.progress })
      } catch {
        setPhase({ ...phase })
      }
    }, 5000)
    return () => clearTimeout(t)
  }, [phase])

  const start = async (file: File) => {
    if (school == null) return setPhase({ kind: 'error', message: 'Choose the school first (top of the page), then upload.' })
    setPhase({ kind: 'uploading', pct: 0 })
    try {
      const res = await fetch('/api/bunny/upload', {
        method: 'POST',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ school, title: file.name.replace(/\.[^.]+$/, '') }),
      })
      const t: Ticket & { message?: string } = await res.json()
      if (!res.ok) throw new Error(t.message ?? `Upload refused (${res.status})`)
      const { Upload } = await import('tus-js-client')
      await new Promise<void>((resolve, reject) => {
        const up = new Upload(file, {
          endpoint: t.endpoint,
          retryDelays: [0, 3000, 10000, 30000],
          chunkSize: 50 * 1024 * 1024,
          headers: {
            AuthorizationSignature: t.signature,
            AuthorizationExpire: String(t.expires),
            VideoId: t.videoId,
            LibraryId: t.libraryId,
          },
          metadata: { filetype: file.type, title: file.name, ...(t.collectionId ? { collection: t.collectionId } : {}) },
          onProgress: (sent, total) => setPhase({ kind: 'uploading', pct: total ? Math.round((sent / total) * 100) : 0 }),
          onError: (e) => reject(e),
          onSuccess: () => resolve(),
        })
        uploadRef.current = up
        up.start()
      })
      uploadRef.current = null
      setValue(t.embed)
      setPhase({ kind: 'processing', label: 'Uploaded, queued for processing', videoId: t.videoId })
    } catch (e: any) {
      uploadRef.current = null
      if (e?.message === 'cancelled') return setPhase({ kind: 'idle' })
      setPhase({ kind: 'error', message: e?.message ?? 'The upload failed.' })
    }
  }

  const cancel = async () => {
    await uploadRef.current?.abort(true).catch(() => {})
    uploadRef.current = null
    setPhase({ kind: 'idle' })
  }

  const busy = phase.kind === 'uploading'

  const status = (
    <p className="field-description" role="status" style={{ color: phase.kind === 'error' ? 'var(--theme-error-500)' : undefined }}>
      {phase.kind === 'uploading' && 'Uploading… keep this page open.'}
      {phase.kind === 'processing' &&
        `Uploaded. The video is being prepared (${phase.label.toLowerCase()}${phase.progress != null ? `, ${phase.progress}%` : ''}). You can save now; it plays once it's ready.`}
      {phase.kind === 'ready' && 'Ready to play. Save to keep it.'}
      {phase.kind === 'error' && phase.message}
    </p>
  )
  const picker = (
    <input
      ref={fileRef}
      type="file"
      accept="video/*"
      hidden
      onChange={(e) => {
        const f = e.target.files?.[0]
        e.target.value = ''
        if (f) start(f)
      }}
    />
  )

  if (uploadFirst) {
    const label = typeof props.field.label === 'string' ? props.field.label : 'Video'
    const description = typeof props.field.admin?.description === 'string' ? props.field.admin.description : undefined
    return (
      <div className="field-type b61-video-field" style={{ marginBottom: 24 }}>
        <label className="field-label">{label}</label>
        {!enabled ? (
          <p className="field-description">Video uploads aren't switched on for this site yet.</p>
        ) : (
          <>
            {picker}
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setOver(true)
              }}
              onDragLeave={() => setOver(false)}
              onDrop={(e) => {
                e.preventDefault()
                setOver(false)
                const f = Array.from(e.dataTransfer.files).find((x) => x.type.startsWith('video/'))
                if (f && !busy) start(f)
              }}
              style={{
                border: `1px dashed var(--theme-elevation-${over ? '500' : '250'})`,
                borderRadius: 4,
                padding: 20,
                display: 'flex',
                gap: 12,
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              {busy ? (
                <>
                  <progress max={100} value={phase.pct} style={{ width: 180 }} aria-label="Upload progress" />
                  <span>{phase.pct}%</span>
                  <Button buttonStyle="none" size="small" margin={false} onClick={cancel}>
                    Cancel
                  </Button>
                </>
              ) : value ? (
                <>
                  <span>Video added ✓</span>
                  <Button buttonStyle="secondary" size="small" margin={false} onClick={() => fileRef.current?.click()}>
                    Replace
                  </Button>
                  <Button buttonStyle="none" size="small" margin={false} onClick={() => { setValue(''); setPhase({ kind: 'idle' }) }}>
                    Remove
                  </Button>
                </>
              ) : (
                <>
                  <Button buttonStyle="secondary" size="small" margin={false} onClick={() => fileRef.current?.click()}>
                    Upload a video
                  </Button>
                  <span className="field-description" style={{ margin: 0 }}>or drag and drop a file</span>
                </>
              )}
            </div>
            {status}
            {description && <p className="field-description">{description}</p>}
          </>
        )}
      </div>
    )
  }

  return (
    <div className="b61-video-field">
      <TextField {...props} />
      {enabled && (
        <div style={{ marginTop: 10, marginBottom: 24 }}>
          <input
            ref={fileRef}
            type="file"
            accept="video/*"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0]
              e.target.value = ''
              if (f) start(f)
            }}
          />
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <Button buttonStyle="secondary" size="small" margin={false} disabled={busy} onClick={() => fileRef.current?.click()}>
              Upload a video
            </Button>
            {busy && (
              <>
                <progress max={100} value={phase.pct} style={{ width: 180 }} aria-label="Upload progress" />
                <span>{phase.pct}%</span>
                <Button buttonStyle="none" size="small" margin={false} onClick={cancel}>
                  Cancel
                </Button>
              </>
            )}
          </div>
          <p className="field-description" role="status" style={{ color: phase.kind === 'error' ? 'var(--theme-error-500)' : undefined }}>
            {phase.kind === 'idle' && 'Or upload a file from your computer; the link fills in. Keep this page open until it finishes.'}
            {phase.kind === 'uploading' && 'Uploading… keep this page open.'}
            {phase.kind === 'processing' &&
              `Uploaded. The video is being prepared (${phase.label.toLowerCase()}${phase.progress != null ? `, ${phase.progress}%` : ''}). You can save now; it plays once it's ready.`}
            {phase.kind === 'ready' && 'Ready to play. Save to keep it.'}
            {phase.kind === 'error' && phase.message}
          </p>
        </div>
      )}
    </div>
  )
}
