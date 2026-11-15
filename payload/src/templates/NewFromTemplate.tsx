'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@payloadcms/ui'
import { useTenantSelection } from '@payloadcms/plugin-multi-tenant/client'

/*
 * Pages list: "New page from a template". Picks a starting layout (Home,
 * About, Admissions, Academics, Athletics, Give), creates it as a draft for
 * the school chosen in the sidebar, then opens it in the editor.
 */

type T = { key: string; label: string; description: string; title: string }

export function NewFromTemplate() {
  const router = useRouter()
  const { selectedTenantID, options } = useTenantSelection()
  const [open, setOpen] = useState(false)
  const [templates, setTemplates] = useState<T[]>([])
  const [pick, setPick] = useState('admissions')
  const [title, setTitle] = useState('')
  const [state, setState] = useState<{ busy?: boolean; message?: string }>({})

  useEffect(() => {
    if (!open || templates.length) return
    fetch('/api/pages/templates', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => setTemplates(d?.templates ?? []))
      .catch(() => setState({ message: 'Could not load the templates.' }))
  }, [open, templates.length])

  const school = selectedTenantID ?? (options?.length === 1 ? options[0].value : undefined)
  const chosen = templates.find((t) => t.key === pick)

  const create = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!school) return setState({ message: 'Choose a school in the sidebar first.' })
    setState({ busy: true })
    try {
      const res = await fetch('/api/pages/from-template', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template: pick, school, title: title.trim() || undefined }),
      })
      const data = await res.json()
      if (data.ok && data.id) {
        router.push(`/admin/collections/pages/${data.id}`)
        return
      }
      setState({ message: data.message ?? 'Could not create the page.' })
    } catch (err: any) {
      setState({ message: err?.message ?? 'Something went wrong.' })
    }
  }

  if (!open) {
    return (
      <div style={{ margin: '0 0 24px' }}>
        <Button buttonStyle="secondary" size="medium" margin={false} onClick={() => setOpen(true)}>
          New page from a template
        </Button>
      </div>
    )
  }

  const field = { minHeight: 40, padding: '0 12px', width: '100%' }
  return (
    <form onSubmit={create} className="b61-template-picker" style={{ margin: '0 0 24px', padding: 20, border: '1px solid var(--theme-elevation-150)', borderRadius: 8, maxWidth: 720 }}>
      <h3 style={{ margin: '0 0 4px' }}>New page from a template</h3>
      <p style={{ margin: '0 0 16px', color: 'var(--theme-elevation-600)' }}>
        A ready-made layout to start from, saved as a draft. Replace anything in [square brackets] and add your own photos before publishing.
      </p>
      <fieldset style={{ border: 0, padding: 0, margin: '0 0 16px' }}>
        <legend className="field-label" style={{ marginBottom: 8 }}>Template</legend>
        <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
          {templates.map((t) => (
            <label
              key={t.key}
              style={{
                display: 'block',
                padding: 12,
                border: `2px solid ${pick === t.key ? 'var(--theme-success-500)' : 'var(--theme-elevation-150)'}`,
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              <input type="radio" name="template" value={t.key} checked={pick === t.key} onChange={() => setPick(t.key)} style={{ marginRight: 8 }} />
              <strong>{t.label}</strong>
              <span style={{ display: 'block', marginTop: 4, fontSize: 13, color: 'var(--theme-elevation-600)' }}>{t.description}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="field-label" htmlFor="b61-template-title">Page title</label>
      <input id="b61-template-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={chosen?.title ?? 'Page title'} style={{ ...field, marginBottom: 16 }} />
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <Button type="submit" buttonStyle="primary" size="medium" margin={false} disabled={state.busy || !templates.length}>
          {state.busy ? 'Creating…' : 'Create draft page'}
        </Button>
        <Button buttonStyle="secondary" size="medium" margin={false} onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
      {state.message && (
        <p role="status" style={{ margin: '12px 0 0', color: 'var(--theme-error-500)' }}>
          {state.message}
        </p>
      )}
    </form>
  )
}
