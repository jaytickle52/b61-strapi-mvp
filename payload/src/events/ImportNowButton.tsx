'use client'
import { useState } from 'react'
import { Button, useDocumentInfo } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'

/** Calendar feeds: "Import now" (the same import that runs every morning). */
export function ImportNowButton() {
  const { id } = useDocumentInfo()
  const router = useRouter()
  const [state, setState] = useState<{ busy?: boolean; ok?: boolean; message?: string }>({})

  const run = async () => {
    setState({ busy: true })
    try {
      const res = await fetch(`/api/calendar-feeds/${id}/import`, { method: 'POST', credentials: 'include' })
      const data = await res.json().catch(() => ({}))
      setState({ ok: Boolean(data.ok), message: data.message ?? `Something went wrong (${res.status}).` })
      router.refresh()
    } catch (e: any) {
      setState({ ok: false, message: e?.message ?? 'Something went wrong.' })
    }
  }

  return (
    <div className="field-type" style={{ marginBottom: 'var(--base)' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <Button buttonStyle="secondary" size="medium" margin={false} disabled={!id || state.busy} onClick={run}>
          {state.busy ? 'Importing…' : 'Import now'}
        </Button>
      </div>
      <p className="field-description" role="status" style={{ color: state.ok === false ? 'var(--theme-error-500)' : undefined }}>
        {state.message ??
          (id
            ? 'Copies the events in now. Large calendars can take a minute. It also runs by itself every morning.'
            : 'Save this feed first, then import.')}
      </p>
    </div>
  )
}
