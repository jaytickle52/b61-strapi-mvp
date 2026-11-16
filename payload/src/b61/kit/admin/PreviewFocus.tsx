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
 * Click to the field: the message also carries what was clicked (its words, or
 * the photo's address). findField() matches that against the element's own
 * values ("Schedule a tour" is buttons.1.label), and revealField() opens the
 * item's row and the Content panel that holds it, scrolls to the field and puts
 * the cursor in it. No match (e.g. cards filled from Programs) opens the element as before.
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

type Hint = { text?: string; image?: string }

const norm = (v: string) => v.replace(/\s+/g, ' ').trim().toLowerCase()
const TEXT_KEYS = new Set(['text', 'quote', 'attribution', 'label', 'title'])

/** The words in a rich-text value, including those in its cards (pull quote, icon rows). */
function richWords(v: any): string {
  const out: string[] = []
  const walk = (n: any) => {
    if (!n || typeof n !== 'object') return
    if (Array.isArray(n)) return n.forEach(walk)
    for (const [k, x] of Object.entries(n)) {
      if (typeof x === 'string') {
        if (TEXT_KEYS.has(k)) out.push(x)
      } else walk(x)
    }
  }
  walk(v?.root ?? v)
  return out.join(' ')
}

/** A photo's address without its size and type: ".../chapel-800x533.webp" → "chapel". */
const photoBase = (src: string) =>
  decodeURIComponent(src.split('?')[0].split('/').pop() ?? '')
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/-\d+x\d+$/, '')
    .toLowerCase()

const PHOTO_FIELDS = /^(image|photo|poster|ornament|watermark)$/
const filenames = new Map<string, Promise<string>>()
const filenameOf = (id: string) => {
  if (!filenames.has(id))
    filenames.set(
      id,
      fetch(`/api/media/${encodeURIComponent(id)}?depth=0`, { credentials: 'include' })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => photoBase(String(d?.filename ?? '')))
        .catch(() => ''),
    )
  return filenames.get(id)!
}

/** Paths of elements nested inside this one (a Section's columns, tabs, slides) belong to them, not to it. */
const nestedElement = /(^|\.)(content|side)\.\d+\./

/**
 * The field inside element `el` that holds what was clicked, as a path relative
 * to the element ("buttons.1.label"), or null. Exact words win over partial ones.
 */
async function findField(fields: Record<string, any>, el: string, hint: Hint): Promise<string | null> {
  const prefix = `${el}.`
  const own = Object.entries(fields).filter(
    ([k, st]) => k.startsWith(prefix) && st?.passesCondition !== false && !nestedElement.test(k.slice(prefix.length)),
  )
  if (hint.image) {
    const want = photoBase(hint.image)
    const photos = own.filter(([k, st]) => PHOTO_FIELDS.test(k.split('.').pop() ?? '') && st?.value != null && st.value !== '')
    if (!photos.length) return null
    if (photos.length === 1) return photos[0][0].slice(prefix.length)
    for (const [k, st] of photos) {
      const id = typeof st.value === 'object' ? st.value?.id : st.value
      if (want && (await filenameOf(String(id))) === want) return k.slice(prefix.length)
    }
    return photos[0][0].slice(prefix.length)
  }
  const said = norm(hint.text ?? '')
  if (said.length < 2) return null
  let best: string | null = null
  let score = 0
  for (const [k, st] of own) {
    const v = st?.value
    let s = 0
    if (typeof v === 'string') {
      const n = norm(v)
      if (n.length < 2) continue
      if (n === said) s = 3
      else if (said.length >= 3 && n.includes(said)) s = 2
      else if (n.length >= 4 && said.includes(n)) s = 1
    } else if (v && typeof v === 'object' && 'root' in v) {
      if (said.length >= 3 && norm(richWords(v)).includes(said)) s = 2
    }
    if (s > score) {
      best = k.slice(prefix.length)
      score = s
    }
  }
  return best
}

export function PreviewFocus() {
  const { getField, getFields, dispatchFields } = useForm()
  const { collectionSlug } = useDocumentInfo()
  const router = useRouter()
  const latest = useRef({ getField, getFields, dispatchFields })
  latest.current = { getField, getFields, dispatchFields }

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

    const focusPath = async (path: string, scroll = true) => {
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
        if (el && !scroll) {
          // The element's own Content tab, where every field click-to-field finds lives.
          const bar = el.querySelector('.tabs-field__tabs')
          if (bar) openTab('Content', bar)
          return
        }
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

    /** Open the rows and the panel on the way to element `el`'s field `rel`, then scroll to it and focus it. */
    // A newer click takes over from one still opening.
    let run = 0

    const revealField = async (el: string, rel: string, mine: number) => {
      const parts = rel.split('.')
      parts.forEach((p, i) => {
        if (/^\d+$/.test(p)) expand(`${el}.${parts.slice(0, i).join('.')}`, Number(p))
      })
      const id = `field-${`${el}.${rel}`.split('.').join('__')}`
      // The innermost row on the way to the field ("sections-0-buttons-row-1"), if any.
      const nums = parts.map((p, i) => (/^\d+$/.test(p) ? i : -1)).filter((i) => i >= 0)
      const last = nums[nums.length - 1]
      const rowEl = () => (last === undefined ? null : document.getElementById(rowId(`${el}.${parts.slice(0, last).join('.')}`, Number(parts[last]))))
      // The nearest thing on the way to the field that is drawn already: the field's row,
      // then its list, then outer rows and lists, then the element's own row.
      const nearest = (): Element | null => {
        for (let k = nums.length - 1; k >= 0; k--) {
          const list = `${el}.${parts.slice(0, nums[k]).join('.')}`
          const found = document.getElementById(rowId(list, Number(parts[nums[k]]))) ?? document.getElementById(`field-${list.split('.').join('__')}`)
          if (found) return found
        }
        const own = el.split('.')
        return document.getElementById(rowId(own.slice(0, -1).join('.'), Number(own[own.length - 1])))
      }
      let nudged = 0
      let panelOpened = false
      for (let tries = 0; tries < 60 && mine === run; tries++) {
        // The Content panel that holds the field (closed panels don't render their fields).
        if (!panelOpened) {
          const label = Array.from(document.querySelectorAll<HTMLElement>(`[data-b61-panel-of="${CSS.escape(el)}"]`)).find((l) =>
            (l.dataset.b61Holds ?? '').split(' ').includes(parts[0]),
          )
          const panel = label?.closest('.collapsible')
          if (panel) {
            if (panel.classList.contains('collapsible--collapsed')) panel.querySelector<HTMLButtonElement>('.collapsible__toggle')?.click()
            panelOpened = true
          }
        }
        // Rich text editors carry their path as data-field-path instead of an id.
        const field = document.getElementById(id) ?? document.querySelector<HTMLElement>(`[data-field-path="${CSS.escape(`${el}.${rel}`)}"]`)
        if (!field && tries % 5 === 4 && nudged < 8) {
          // The editor only draws fields near the screen: bring the row (or the panel) into
          // view so the field gets drawn. A long element form can leave it below the fold.
          const near =
            rowEl() ??
            (panelOpened ? document.querySelector(`[data-b61-panel-of="${CSS.escape(el)}"][data-b61-holds~="${CSS.escape(parts[0])}"]`)?.closest('.collapsible') : null) ??
            nearest()
          near?.scrollIntoView({ block: 'center' })
          nudged++
        }
        if (field) {
          await wait(300)
          const box = (field.closest('.field-type') as HTMLElement | null) ?? field
          box.style.scrollMarginTop = '160px'
          box.scrollIntoView({ behavior: 'smooth', block: 'center' })
          const input = field.matches('input, textarea')
            ? (field as HTMLInputElement)
            : field.querySelector<HTMLElement>('[contenteditable="true"], input:not([type="hidden"]), textarea')
          setTimeout(() => input?.focus({ preventScroll: true }), 450)
          box.classList.remove('b61-field-flash')
          void box.offsetWidth
          box.classList.add('b61-field-flash')
          setTimeout(() => box.classList.remove('b61-field-flash'), 1800)
          return true
        }
        await wait(80)
      }
      return false
    }

    const focusClick = async (path: string, hint?: Hint) => {
      const mine = ++run
      const rel = hint ? await findField(latest.current.getFields() as any, path, hint) : null
      if (mine !== run) return
      if (!rel) return focusPath(path)
      await focusPath(path, false)
      if (mine === run && !(await revealField(path, rel, mine)) && mine === run) await focusPath(path)
    }

    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.data?.type !== 'b61:edit') return
      const { path, tab, hint } = e.data as { path?: string; tab?: string; label?: string; hint?: Hint }
      if (tab) {
        if (isSettings) openTab(tab)
        else
          toast.info(`The ${tab.toLowerCase()} is edited in School settings › ${tab}.`, {
            action: { label: 'Open', onClick: () => router.push('/admin/collections/school-settings') },
          })
        return
      }
      if (!path) return
      if (path.startsWith('sections') && (latest.current.getField('sections') as any)?.rows) void focusClick(path, hint)
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
