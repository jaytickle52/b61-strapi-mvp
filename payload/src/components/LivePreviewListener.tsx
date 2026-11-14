'use client'
import { RefreshRouteOnSave } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

/**
 * Inside the admin's live preview pane: every autosave tells this page to
 * re-render with the latest draft, so edits appear as the editor types.
 */
export default function LivePreviewListener() {
  const router = useRouter()
  const [origin, setOrigin] = useState<string | null>(null)
  useEffect(() => setOrigin(window.location.origin), [])
  if (!origin) return null
  return <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={origin} />
}
