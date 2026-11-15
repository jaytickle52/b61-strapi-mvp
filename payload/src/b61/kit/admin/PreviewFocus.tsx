'use client'
import { toast, useDocumentInfo, useForm } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

/*
 * Click-to-edit, the half that runs in the editor. Mounted once per document,
 * invisibly, next to the Save buttons (admin.components.edit.beforeDocumentControls
 * on every collection with a live preview; see withPreviewFocus).
 *
 * Preview → editor: the preview posts { type: 'b61:edit', path } when an
 * element is clicked ("sections.2" or, inside a container,
 * "sections.2.content.1"). This opens every row on the way (sections, tab and
 * slide rows), switches to the Content tabs that hold them, scrolls to the
 * element and flashes it. Header and footer clicks carry a tab name instead
 * ("Header"), which School settings opens directly.
 *
 * Editor → preview: opening a section in the form scrolls the preview to it.
 */

const rowId = (listPath: string, index: number) => `${listPath.split('.').join('-')}-row-${index}`
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

/** The document's own tabs (e.g. Page / SEO), not tabs inside an element. */
function openDocumentFirstTab() {
  const bar = Array.from(document.querySelectorAll('.tabs-field__tabs')).find((b) => !b.closest('.collapsible'))
  const btn = bar?.querySelector<HTMLButtonElement>('.tabs-field__tab-button')
  if (btn && !btn.classList.contains('tabs-field__tab-button--active')) btn.click()
}

/** Click the tab button with this label (anywhere, or inside scope). */
function openTab(label: string, scope: ParentNode = document): boolean {
  const buttons = Array.from(scope.querySelectorAll<HTMLButtonElement>('.tabs-field__tab-button'))
  const btn = buttons.find((b) => b.textContent?.trim().toLowerCase() === label.toLowerCase())
  if (!btn) return false
  if (!btn.classList.contains('tabs-field__tab-button--active')) btn.click()
  return true
}

export function PreviewFocus() {
  const { getField, dispatchFields } = useForm()
  const { collectionSlug } = useDocumentInfo()
  const router = useRouter()
  const latest = useRef({ getField, dispatchFields })
  latest.current = { getField, dispatchFields }

  useEffect(() => {
    const isSettings = collectionSlug === 'school-settings'

    /**
     * Open the row at list[index]; with `only`, close the list's other rows too
     * (one dispatch, so the two changes don't overwrite each other).
     * Returns false when the list isn't there.
     */
    const expand = (list: string, index: number, only = false) => {
      const { getField, dispatchFields } = latest.current
      const rows = (getField(list) as any)?.rows as { id: string; collapsed?: boolean }[] | undefined
      if (!rows?.[index]) return false
      const want = (i: number, r: { collapsed?: boolean }) => (i === index ? false : only ? true : r.collapsed)
      if (rows.some((r, i) => (r.collapsed !== false) !== (want(i, r) !== false))) {
        dispatchFields({ type: 'SET_ROW_COLLAPSED', path: list, updatedRows: rows.map((r, i) => ({ ...r, collapsed: want(i, r) })) } as any)
      }
      return true
    }

    const focusPath = async (path: string) => {
      const parts = path.split('.')
      // Each numeric part is a row: [list path, index] from the outside in.
      const levels: [string, number][] = []
      parts.forEach((p, i) => {
        if (/^\d+$/.test(p)) levels.push([parts.slice(0, i).join('.'), Number(p)])
      })
      if (!levels.length) return
      // The other top-level sections close, so the one asked for is easy to spot.
      for (const [n, [list, index]] of levels.entries()) if (!expand(list, index, n === 0)) return
      const [list, index] = levels[levels.length - 1]
      const id = rowId(list, index)
      // Block rows have predictable ids; walk them outside-in so each one's Content tab can be opened.
      const blockRows = levels.map(([l, i]) => rowId(l, i))
      for (let tries = 0; tries < 30; tries++) {
        const el = document.getElementById(id)
        if (el) {
          // Let rows finish opening and closing (they animate) before scrolling,
          // keep clear of the sticky Save bar, then correct once if anything moved.
          el.style.scrollMarginTop = '130px'
          await wait(350)
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          setTimeout(() => {
            const top = el.getBoundingClientRect().top
            if (Math.abs(top - 130) > 40) el.scrollIntoView({ block: 'start' })
          }, 900)
          el.classList.remove('b61-row-flash')
          void el.offsetWidth
          el.classList.add('b61-row-flash')
          setTimeout(() => el.classList.remove('b61-row-flash'), 1800)
          return
        }
        if (!document.getElementById(blockRows[0])) openDocumentFirstTab()
        for (const rid of blockRows.slice(0, -1)) {
          const row = document.getElementById(rid)
          // The element's own Content tab (its first tabs bar), not one nested deeper.
          const bar = row?.querySelector('.tabs-field__tabs')
          if (bar) openTab('Content', bar)
        }
        await wait(80)
      }
    }

    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.data?.type !== 'b61:edit') return
      const { path, tab } = e.data as { path?: string; tab?: string; label?: string }
      if (tab) {
        if (isSettings) openTab(tab)
        else
          toast.info(`The ${tab.toLowerCase()} is edited in School settings › ${tab}.`, {
            action: { label: 'Open', onClick: () => router.push('/admin/collections/school-settings') },
          })
        return
      }
      if (!path) return
      if (path.startsWith('sections') && (latest.current.getField('sections') as any)?.rows) void focusPath(path)
      else toast.info('This part of the page is edited on the page itself, in Pages.')
    }

    // Opening a section in the form shows it in the preview.
    const onClick = (e: MouseEvent) => {
      const toggle = (e.target as Element | null)?.closest?.('.collapsible__toggle-wrap')
      const collapsible = toggle?.closest('.collapsible')
      const row = collapsible?.parentElement
      const m = row?.id.match(/^(sections(?:-[\w]+)*)-row-(\d+)$/)
      if (!m || !collapsible?.classList.contains('collapsible--collapsed')) return
      const frame = document.querySelector<HTMLIFrameElement>('iframe#live-preview-iframe, iframe.live-preview-iframe')
      frame?.contentWindow?.postMessage({ type: 'b61:show', path: `${m[1].split('-').join('.')}.${m[2]}` }, window.location.origin)
    }

    window.addEventListener('message', onMessage)
    document.addEventListener('click', onClick, true)
    return () => {
      window.removeEventListener('message', onMessage)
      document.removeEventListener('click', onClick, true)
    }
  }, [collectionSlug, router])

  return null
}
