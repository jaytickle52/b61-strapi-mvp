'use client'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, useAuth } from '@payloadcms/ui'

/*
 * Users list: "Invite someone". School Admins see only their own schools;
 * Banner 61 admins see every school. Sends POST /api/users/invite.
 */

const ROLES = [
  { value: 'editor', label: 'Editor', hint: 'Edits and publishes the website.' },
  { value: 'contributor', label: 'Contributor', hint: 'Writes drafts; someone else publishes them.' },
  { value: 'schoolAdmin', label: 'School Admin', hint: 'Editor, plus invites and manages staff accounts.' },
]

const idOf = (v: any) => String(v && typeof v === 'object' ? v.id : v)

export function InviteForm() {
  const { user } = useAuth() as any
  const router = useRouter()
  const isB61 = user?.role === 'admin'
  const managed = useMemo(
    () =>
      new Set(
        (user?.tenants ?? [])
          .filter((t: any) => (t?.role || 'editor') === 'schoolAdmin')
          .map((t: any) => idOf(t?.tenant)),
      ),
    [user],
  )
  const [schools, setSchools] = useState<{ id: string; name: string }[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ email: '', name: '', school: '', role: 'editor' })
  const [state, setState] = useState<{ busy?: boolean; ok?: boolean; message?: string }>({})

  useEffect(() => {
    if (!isB61 && managed.size === 0) return
    fetch('/api/schools?depth=0&limit=200&sort=name', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        const list = (d?.docs ?? [])
          .map((s: any) => ({ id: String(s.id), name: s.name }))
          .filter((s: any) => isB61 || managed.has(s.id))
        setSchools(list)
        setForm((f) => ({ ...f, school: f.school || list[0]?.id || '' }))
      })
      .catch(() => {})
  }, [isB61, managed])

  if (!isB61 && managed.size === 0) return null

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    setState({ busy: true })
    try {
      const res = await fetch('/api/users/invite', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      setState({ ok: data.ok, message: data.message })
      if (data.ok) {
        setForm((f) => ({ ...f, email: '', name: '' }))
        router.refresh()
      }
    } catch (err: any) {
      setState({ ok: false, message: err?.message ?? 'Something went wrong.' })
    }
  }

  const hint = ROLES.find((r) => r.value === form.role)?.hint
  const field = { minHeight: 40, padding: '0 12px', width: '100%' }

  return (
    <div className="b61-invite" style={{ margin: '0 0 24px' }}>
      {!open ? (
        <Button buttonStyle="primary" size="medium" margin={false} onClick={() => setOpen(true)}>
          Invite someone
        </Button>
      ) : (
        <form
          onSubmit={send}
          style={{
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: 8,
            padding: 20,
            display: 'grid',
            gap: 12,
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            alignItems: 'end',
          }}
        >
          <label>
            <span className="field-label">Email</span>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={field}
            />
          </label>
          <label>
            <span className="field-label">Name (optional)</span>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={field} />
          </label>
          {schools.length > 1 && (
            <label>
              <span className="field-label">School</span>
              <select value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })} style={field}>
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label>
            <span className="field-label">Role</span>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} style={field}>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button type="submit" buttonStyle="primary" size="medium" margin={false} disabled={state.busy || !form.school}>
              {state.busy ? 'Sending…' : 'Send invite'}
            </Button>
            <Button buttonStyle="secondary" size="medium" margin={false} onClick={() => { setOpen(false); setState({}) }}>
              Close
            </Button>
          </div>
          <p className="field-description" role="status" style={{ gridColumn: '1 / -1', margin: 0, color: state.ok === false ? 'var(--theme-error-500)' : undefined }}>
            {state.message ?? `${hint} They get an email with a link to choose their password (good for 7 days).`}
          </p>
        </form>
      )}
    </div>
  )
}
