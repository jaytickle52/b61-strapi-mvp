'use client'
import { useState } from 'react'
import { Button, useAuth, useDocumentInfo, useFormFields } from '@payloadcms/ui'

/** School settings > Email: "Send a test email" (like Fluent SMTP's test). */
export function TestEmailButton() {
  const { user } = useAuth()
  const { id } = useDocumentInfo()
  const school = useFormFields(([fields]) => fields?.school?.value)
  const [to, setTo] = useState('')
  const [state, setState] = useState<{ busy?: boolean; ok?: boolean; message?: string }>({})

  const send = async () => {
    setState({ busy: true })
    try {
      const res = await fetch('/api/school-settings/test-email', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ school: school ?? id, to }),
      })
      const data = await res.json()
      setState({ ok: data.ok, message: data.message })
    } catch (e: any) {
      setState({ ok: false, message: e?.message ?? 'Something went wrong.' })
    }
  }

  return (
    <div className="b61-test-email field-type">
      <label className="field-label" htmlFor="b61-test-to">
        Send a test email
      </label>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          id="b61-test-to"
          type="email"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder={(user as any)?.email ?? 'you@school.org'}
          style={{ flex: '1 1 260px', minHeight: 40, padding: '0 12px' }}
        />
        <Button
          buttonStyle="secondary"
          size="medium"
          margin={false}
          disabled={state.busy}
          onClick={send}
        >
          {state.busy ? 'Sending…' : 'Send test'}
        </Button>
      </div>
      <p
        className="field-description"
        role="status"
        style={{ color: state.ok === false ? 'var(--theme-error-500)' : undefined }}
      >
        {state.message ??
          'Save changes first. Uses the settings above and goes to your own address unless you type another.'}
      </p>
    </div>
  )
}
