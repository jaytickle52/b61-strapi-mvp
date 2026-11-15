'use client'
import { useDocumentInfo } from '@payloadcms/ui'
import { useEffect, useState } from 'react'

type Hit = { collection: string; id: string; title: string; where: string[] }

const NAMES: Record<string, string> = {
  pages: 'Page',
  events: 'Event',
  news: 'News',
  programs: 'Program',
  staff: 'Staff',
  'school-settings': 'School settings',
  forms: 'Form',
}

/** Sidebar: everywhere this photo, document or page is used on the school's site. */
export function UsagePanel({ target }: { target: string }) {
  const { id } = useDocumentInfo()
  const [hits, setHits] = useState<Hit[] | null>(null)
  const [home, setHome] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    fetch(`/api/${target}/${id}/usage`, { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        if (!d.hits) return setError(d.error ?? 'Could not check.')
        setHits(d.hits)
        setHome(Boolean(d.home))
      })
      .catch(() => setError('Could not check.'))
  }, [id, target])

  if (!id) return null
  return (
    <div className="field-type b61-usage" style={{ marginBottom: 24 }}>
      <div className="field-label">Where this is used</div>
      {error ? (
        <p className="field-description">{error}</p>
      ) : hits == null ? (
        <p className="field-description">Checking…</p>
      ) : home ? (
        <p className="field-description">This is the home page: every visit starts here.</p>
      ) : hits.length === 0 ? (
        <p className="field-description">Not used anywhere on the website. Safe to delete.</p>
      ) : (
        <ul style={{ margin: '4px 0 0', paddingLeft: 18 }}>
          {hits.map((h) => (
            <li key={`${h.collection}-${h.id}`} style={{ marginBottom: 6 }}>
              <a
                href={
                  h.collection === 'school-settings'
                    ? `/admin/collections/school-settings`
                    : `/admin/collections/${h.collection}/${h.id}`
                }
              >
                {NAMES[h.collection] ?? h.collection}: {h.title}
              </a>
              <div className="field-description" style={{ margin: 0 }}>
                {h.where.slice(0, 3).join('; ')}
                {h.where.length > 3 ? `; and ${h.where.length - 3} more` : ''}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
