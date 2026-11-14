'use client'
import { useDocumentInfo } from '@payloadcms/ui'
import { useEffect, useState } from 'react'

/** Form sidebar: how many submissions, a link to them and a spreadsheet download. */
export function SubmissionsLink() {
  const { id } = useDocumentInfo()
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    if (!id) return
    fetch(`/api/form-submissions?where[form][equals]=${id}&limit=0&depth=0`, {
      credentials: 'include',
    })
      .then((r) => r.json())
      .then((d) => setCount(d?.totalDocs ?? 0))
      .catch(() => setCount(null))
  }, [id])

  if (!id) return <p className="field-description">Save the form to see its submissions here.</p>

  return (
    <div className="field-type" style={{ marginBottom: 24 }}>
      <div className="field-label">Submissions</div>
      <p style={{ margin: '4px 0 8px' }}>
        <a href={`/admin/collections/form-submissions?where[form][equals]=${id}`}>
          {count == null ? 'View submissions' : `${count} submission${count === 1 ? '' : 's'}`}
        </a>
      </p>
      <a
        className="btn btn--style-secondary btn--size-small"
        href={`/api/form-submissions/export?form=${id}`}
        download
      >
        Download spreadsheet (CSV)
      </a>
    </div>
  )
}
