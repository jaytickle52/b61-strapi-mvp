'use client'
import { useEffect } from 'react'
import './edit-overlay.css'

/*
 * Click-to-edit, the half that runs inside the editor's live preview.
 *
 * Every element on the page has an invisible marker in front of it
 * (EditMark). Hovering an element outlines it with its name; clicking it asks
 * the editor (the window around the preview) to open that element's settings
 * and scroll to them. The message also says what was clicked inside it (the
 * words, or the photo), so the editor can open that exact field. Buttons, tabs, accordions and carousels keep working;
 * links are not followed, since leaving the page would leave the preview.
 *
 * The editor can also ask the preview to show an element (when a section is
 * opened in the form), via a "b61:show" message.
 *
 * Runs only when the page is inside the editor's preview frame or window.
 */

const SKIP = new Set(['STYLE', 'SCRIPT', 'LINK', 'TEMPLATE', 'NOSCRIPT'])
const INTERACTIVE = 'button, input, select, textarea, label, summary, [role="tab"], [role="button"], video, audio, iframe, [contenteditable="true"]'

type Target = HTMLElement & { dataset: DOMStringMap }

/** Copy each marker onto the element right after it, so closest() can find it. */
function annotate() {
  document.querySelectorAll<HTMLTemplateElement>('template[data-b61-edit-label]').forEach((mark) => {
    let el = mark.nextElementSibling as HTMLElement | null
    while (el && SKIP.has(el.tagName)) el = el.nextElementSibling as HTMLElement | null
    if (!el) return
    el.dataset.b61EditPath = mark.dataset.b61Edit ?? ''
    el.dataset.b61EditLabel = mark.dataset.b61EditLabel ?? ''
    if (mark.dataset.b61EditTab) el.dataset.b61EditTab = mark.dataset.b61EditTab
  })
}

const norm = (s: string | null | undefined) => (s ?? '').replace(/\s+/g, ' ').trim()

/**
 * What exactly was clicked inside the element, so the editor can open that one
 * field: the photo (its address), or the words of the innermost thing with text.
 * Nothing when the click landed on the element's own padding.
 */
function clickHint(t: Element, el: Element): { text?: string; image?: string } | undefined {
  const pic = t.closest('img, picture')
  if (pic && el.contains(pic)) {
    const img = (pic.tagName === 'IMG' ? pic : pic.querySelector('img')) as HTMLImageElement | null
    const src = img?.currentSrc || img?.src
    if (src) return { image: src }
  }
  for (let n: Element | null = t; n && n !== el; n = n.parentElement) {
    const text = norm(n.textContent)
    if (text) return text.length <= 300 ? { text } : undefined
  }
  return undefined
}

const targetOf = (node: EventTarget | null) =>
  (node instanceof Element ? node.closest('[data-b61-edit-label]') : null) as Target | null

function editorWindow(): Window | null {
  if (window.parent && window.parent !== window) return window.parent
  try {
    if (window.opener && window.opener.location.origin === window.location.origin && window.opener.location.pathname.startsWith('/admin')) return window.opener
  } catch {
    /* another site opened this page */
  }
  return null
}

function makeBox(kind: 'hover' | 'picked') {
  const box = document.createElement('div')
  box.className = `b61-edit-box b61-edit-box--${kind}`
  box.setAttribute('aria-hidden', 'true')
  box.hidden = true
  document.body.appendChild(box)
  return box
}

function place(box: HTMLElement, el: HTMLElement | null) {
  const r = el?.getBoundingClientRect()
  if (!el || !r || r.width < 2 || r.height < 2) {
    box.hidden = true
    return
  }
  box.hidden = false
  // Keep the outline on screen for elements wider/taller than the viewport.
  const top = Math.max(r.top, 0)
  const left = Math.max(r.left, 0)
  box.style.transform = `translate(${left}px, ${top}px)`
  box.style.width = `${Math.min(r.right, window.innerWidth) - left}px`
  box.style.height = `${Math.min(r.bottom, window.innerHeight) - top}px`
}

export default function EditOverlay() {
  useEffect(() => {
    const editor = editorWindow()
    if (!editor) return
    const origin = window.location.origin

    document.documentElement.classList.add('b61-editing')
    annotate()
    let queued = false
    const observer = new MutationObserver(() => {
      if (queued) return
      queued = true
      requestAnimationFrame(() => {
        queued = false
        annotate()
        place(picked, pickedEl && pickedEl.isConnected ? pickedEl : findByPath(pickedPath))
        place(hover, hoverEl)
      })
    })
    observer.observe(document.body, { childList: true, subtree: true })

    const hover = makeBox('hover')
    const picked = makeBox('picked')
    const chip = document.createElement('div')
    chip.className = 'b61-edit-chip'
    chip.setAttribute('aria-hidden', 'true')
    hover.appendChild(chip)

    let hoverEl: Target | null = null
    let pickedEl: Target | null = null
    let pickedPath = ''

    const findByPath = (path: string) =>
      path ? (document.querySelector(`[data-b61-edit-path="${CSS.escape(path)}"]`) as Target | null) : null

    const setHover = (el: Target | null) => {
      hoverEl = el
      chip.textContent = el ? `Edit ${el.dataset.b61EditLabel}` : ''
      place(hover, el)
    }
    const pick = (el: Target | null) => {
      pickedEl = el
      pickedPath = el?.dataset.b61EditPath ?? ''
      place(picked, el)
    }

    const onMove = (e: PointerEvent) => {
      const el = targetOf(e.target)
      if (el !== hoverEl) setHover(el)
    }
    const onLeave = () => setHover(null)
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return
      const el = targetOf(e.target)
      const link = (e.target as Element | null)?.closest?.('a[href]')
      // Leaving the page would end the preview; select the element instead.
      if (link) e.preventDefault()
      if (!el) return
      if (!link && (e.target as Element).closest(INTERACTIVE)) return
      pick(el)
      editor.postMessage(
        {
          type: 'b61:edit',
          path: el.dataset.b61EditPath || undefined,
          tab: el.dataset.b61EditTab,
          label: el.dataset.b61EditLabel,
          hint: clickHint(e.target as Element, el),
        },
        origin,
      )
    }
    const onScroll = () => {
      place(hover, hoverEl)
      place(picked, pickedEl)
    }
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== origin || e.data?.type !== 'b61:show') return
      const el = findByPath(String(e.data.path ?? ''))
      if (!el) return
      pick(el)
      const r = el.getBoundingClientRect()
      // Only scroll when the element isn't already in view.
      // (window.scrollTo, not scrollIntoView, which would also scroll the editor around the frame.)
      if (r.top < 0 || r.top > window.innerHeight * 0.6) window.scrollTo({ top: window.scrollY + r.top - 24, behavior: 'smooth' })
    }

    document.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('click', onClick, true)
    window.addEventListener('scroll', onScroll, { passive: true, capture: true })
    window.addEventListener('resize', onScroll)
    window.addEventListener('message', onMessage)
    return () => {
      observer.disconnect()
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('click', onClick, true)
      window.removeEventListener('scroll', onScroll, { capture: true })
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('message', onMessage)
      hover.remove()
      picked.remove()
      document.documentElement.classList.remove('b61-editing')
    }
  }, [])
  return null
}
