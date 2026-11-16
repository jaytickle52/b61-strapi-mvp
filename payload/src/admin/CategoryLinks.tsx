'use client'
import { Button } from '@payloadcms/ui'

/*
 * News categories aren't in the sidebar (src/admin/sidebarOrder.ts). The News
 * list links to them, and the categories list links back.
 */

export function ManageCategories() {
  return (
    <div style={{ margin: '0 0 24px' }}>
      <Button buttonStyle="secondary" size="medium" margin={false} el="link" to="/admin/collections/news-categories">
        Manage categories
      </Button>
    </div>
  )
}

export function BackToNews() {
  return (
    <div style={{ margin: '0 0 24px' }}>
      <Button buttonStyle="secondary" size="medium" margin={false} el="link" to="/admin/collections/news">
        ← Back to News
      </Button>
    </div>
  )
}
