'use client'
import { useState } from 'react'
import { Button, useAuth, useDocumentInfo, useFormFields } from '@payloadcms/ui'

/*
 * User account sidebar: whether they've accepted their invite, and a
 * "Resend invite" button for people who haven't signed in yet.
 */
export function InviteStatus() {
  const { id } = useDocumentInfo()
  const { user } = useAuth() as any
  const lastSignInAt = useFormFields(([f]) => f?.lastSignInAt?.value) as string | undefined
  const invitedAt = useFormFields(([f]) => f?.invitedAt?.value) as string | undefined
  const [state, setState] = useState<{ busy?: boolean; ok?: boolean; message?: string }>({})

  if (!id || String(id) === String(user?.id)) return null

  const when = (v?: string) => (v ? new Date(v).toLocaleString() : '')
  const resend = async () => {
    setState({ busy: true })
    try {
      const res = await fetch(`/api/users/${id}/resend-invite`, { method: 'POST', credentials: 'include' })
      const data = await res.json()
      setState({ ok: data.ok, message: data.message })
    } catch (e: any) {
      setState({ ok: false, message: e?.message ?? 'Something went wrong.' })
    }
  }

  return (
    <div className="field-type" style={{ marginBottom: 24 }}>
      <span className="field-label">Invite</span>
      {lastSignInAt ? (
        <p className="field-description">Accepted. Last signed in {when(lastSignInAt)}.</p>
      ) : (
        <>
          <p className="field-description">
            {invitedAt ? `Waiting: invited ${when(invitedAt)}, hasn't signed in yet.` : "Hasn't signed in yet."}
          </p>
          <Button buttonStyle="secondary" size="small" margin={false} disabled={state.busy} onClick={resend}>
            {state.busy ? 'Sending…' : 'Resend invite'}
          </Button>
        </>
      )}
      {state.message && (
        <p className="field-description" role="status" style={{ color: state.ok === false ? 'var(--theme-error-500)' : undefined }}>
          {state.message}
        </p>
      )}
    </div>
  )
}
