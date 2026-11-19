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
 * a YouTube, Vimeo or Bunny link still works the same. Every upload also joins
 * the school's Videos, and "Choose a video" picks one already uploaded.
 */
export const VideoField: TextFieldClientComponent = (props) => {
  // uploadFirst (Hero background): one upload box that sends the file to
  // the video library; there is no link to paste.
  const uploadFirst = Boolean((props as any).uploadFirst)
  // inLibrary: the field on a Videos entry itself, so no "Choose a video" and
  // the upload doesn't add a second entry; it fills in the Title if empty.
  const inLibrary = Boolean((props as any).inLibrary)
  const path = props.path ?? props.field.name
  const { value, setValue } = useField<string>({ path })
  const titleField = useField<string>({ path: 'title' })
  const [library, setLibrary] = useState<{ id: number | string; title: string; link: string }[] | null>(null)
  const [over, setOver] = useState(false)
  const school = useFormFields(([f]) => f?.school?.value as number | string | undefined)
  const [enabled, setEnabled] = useState(false)
  const [phase, setPhase] = useState<Phase>({ kind: 'idle' })
  const fileRef = useRef<HTMLInputElement>(null)
  const uploadRef = useRef<{ abort: (b?: boolean) => Promise<void> } | null>(null)

  // The school's Videos, for "Choose a video" (one upload, used anywhere).
  useEffect(() => {
    if (inLibrary) return
    const where = school != null ? `&where[school][equals]=${encodeURIComponent(String(school))}` : ''
    fetch(`/api/videos?limit=200&depth=0&sort=-updatedAt${where}`, { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => setLibrary((d.docs ?? []).filter((v: any) => v.link).map((v: any) => ({ id: v.id, title: v.title || 'Video', link: v.link }))))
      .catch(() => setLibrary([]))
  }, [school, inLibrary, phase.kind === 'processing'])

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
        body: JSON.stringify({ school, title: file.name.replace(/\.[^.]+$/, ''), library: !inLibrary }),
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
      if (inLibrary && !titleField.value) titleField.setValue(file.name.replace(/\.[^.]+$/, ''))
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

  // "Choose a video": any video the school already uploaded.
  const choices = (library ?? []).filter((v) => v.link !== value)
  const chooser =
    !inLibrary && choices.length > 0 ? (
      <select
        aria-label="Choose a video"
        value=""
        disabled={busy}
        onChange={(e) => {
          const v = choices.find((c) => String(c.id) === e.target.value)
          if (v) {
            setValue(v.link)
            setPhase({ kind: 'idle' })
          }
        }}
        style={{ font: 'inherit', fontSize: 13, padding: '5px 8px', borderRadius: 4, border: '1px solid var(--theme-elevation-250)', background: 'var(--theme-input-bg)', color: 'var(--theme-text)', maxWidth: 260 }}
      >
        <option value="">{value ? 'Choose another video…' : 'Choose a video…'}</option>
        {choices.map((c) => (
          <option key={c.id} value={String(c.id)}>
            {c.title}
          </option>
        ))}
      </select>
    ) : null

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
          <>
            {value && <p style={{ margin: '0 0 8px' }}>{library?.find((v) => v.link === value)?.title ?? 'Video added'} ✓</p>}
            {chooser && <div style={{ marginBottom: 8 }}>{chooser}</div>}
            <p className="field-description">Video uploads aren't switched on for this site yet.</p>
          </>
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
                  <span>{library?.find((v) => v.link === value)?.title ?? 'Video added'} ✓</span>
                  <Button buttonStyle="secondary" size="small" margin={false} onClick={() => fileRef.current?.click()}>
                    Replace
                  </Button>
                  {!inLibrary && (
                    <Button buttonStyle="none" size="small" margin={false} onClick={() => { setValue(''); setPhase({ kind: 'idle' }) }}>
                      Remove
                    </Button>
                  )}
                  {chooser}
                </>
              ) : (
                <>
                  <Button buttonStyle="secondary" size="small" margin={false} onClick={() => fileRef.current?.click()}>
                    Upload a video
                  </Button>
                  <span className="field-description" style={{ margin: 0 }}>or drag and drop a file{chooser ? ', or' : ''}</span>
                  {chooser}
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
      {/mediadelivery\.net/i.test(value ?? '') ? (
        // An uploaded video: its name, not its address (editors never see where files are kept).
        <div className="field-type" style={{ marginBottom: 0 }}>
          <label className="field-label">{typeof props.field.label === 'string' ? props.field.label : 'Video'}</label>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <span>{library?.find((v) => v.link === value)?.title ?? 'Uploaded video'} ✓</span>
            <Button buttonStyle="none" size="small" margin={false} onClick={() => { setValue(''); setPhase({ kind: 'idle' }) }}>
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <TextField {...props} />
      )}
      {!enabled && chooser && <div style={{ marginTop: 10, marginBottom: 24 }}>{chooser}</div>}
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
            {chooser}
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
            {phase.kind === 'idle' && 'Or upload a file from your computer, or choose one already uploaded. Keep this page open until an upload finishes.'}
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
