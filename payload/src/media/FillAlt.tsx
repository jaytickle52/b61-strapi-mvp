'use client'
import { Button } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

/*
 * Above the Photos list: "Write missing alt text". Shown only when alt text
 * suggestions are switched on and the selected school has photos without it.
 * Calls POST /api/media/fill-alt until nothing is left (src/media/autoAlt.ts).
 */
export function FillAlt() {
  const router = useRouter()
  const [missing, setMissing] = useState<number | null>(null)
  const [state, setState] = useState<{ busy?: boolean; done?: number; message?: string }>({})

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/media/fill-alt', { credentials: 'include' })
      const data = await res.json()
      setMissing(data.enabled ? Number(data.missing) || 0 : null)
    } catch {
      setMissing(null)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const run = async () => {
    let done = 0
    setState({ busy: true, done })
    try {
      for (let round = 0; round < 50; round++) {
        const res = await fetch('/api/media/fill-alt', { method: 'POST', credentials: 'include' })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error ?? 'Something went wrong.')
        done += data.filled ?? 0
        setMissing(data.missing ?? 0)
        setState({ busy: true, done })
        if (!data.missing) break
        if (!data.filled) throw new Error(data.error ? `Stopped: ${data.error}` : 'Stopped: no photo could be described.')
      }
      setState({ done, message: `Done: ${done} written. Each is marked "Written by AI", so check them.` })
    } catch (err: any) {
      setState({ done, message: `${done} written. ${err?.message ?? ''}`.trim() })
    }
    router.refresh()
  }

  if (missing === null || (missing === 0 && !state.message)) return null

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', margin: '0 0 16px' }}>
      {missing > 0 && (
        <Button buttonStyle="secondary" size="small" margin={false} disabled={state.busy} onClick={run}>
          {state.busy ? `Writing alt text… ${state.done ?? 0} done` : `Write missing alt text (${missing} photo${missing === 1 ? '' : 's'})`}
        </Button>
      )}
      {state.message && (
        <span className="field-description" role="status" style={{ margin: 0 }}>
          {state.message}
        </span>
      )}
    </div>
  )
}
