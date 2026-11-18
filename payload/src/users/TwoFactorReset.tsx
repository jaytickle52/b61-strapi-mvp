'use client'
import { useState } from 'react'
import { Button, useAuth, useDocumentInfo } from '@payloadcms/ui'

/*
 * User account sidebar, Banner 61 admins only, on someone else's account:
 * "Reset two-factor" for a lost or replaced phone (src/users/two-factor-reset.ts).
 */
export function TwoFactorReset() {
  const { id } = useDocumentInfo()
  const { user } = useAuth() as any
  const [state, setState] = useState<{ busy?: boolean; ok?: boolean; message?: string; confirm?: boolean }>({})

  if (!id || user?.role !== 'admin' || String(id) === String(user?.id)) return null

  const reset = async () => {
    setState({ busy: true })
    try {
      const res = await fetch(`/api/users/${id}/reset-two-factor`, { method: 'POST', credentials: 'include' })
      const data = await res.json()
      setState({ ok: data.ok, message: data.message })
    } catch (e: any) {
      setState({ ok: false, message: e?.message ?? 'Something went wrong.' })
    }
  }

  return (
    <div className="field-type" style={{ marginBottom: 24 }}>
      <span className="field-label">Two-factor sign-in</span>
      <p className="field-description">Lost or new phone? Turn off their authenticator code so they can sign in with their password and set it up again.</p>
      {state.confirm ? (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button buttonStyle="primary" size="small" margin={false} disabled={state.busy} onClick={reset}>
            {state.busy ? 'Resetting…' : 'Yes, reset'}
          </Button>
          <Button buttonStyle="secondary" size="small" margin={false} disabled={state.busy} onClick={() => setState({})}>
            Cancel
          </Button>
        </div>
      ) : (
        <Button buttonStyle="secondary" size="small" margin={false} onClick={() => setState({ confirm: true })}>
          Reset two-factor
        </Button>
      )}
      {state.message && (
        <p className="field-description" role="status" style={{ color: state.ok === false ? 'var(--theme-error-500)' : undefined }}>
          {state.message}
        </p>
      )}
    </div>
  )
}
