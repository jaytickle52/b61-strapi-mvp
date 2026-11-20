'use client'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

/*
 * Announcements: bars above the header and pop-ups. Rendered on the server
 * with the announcements showing right now; this client part hides ones the
 * visitor closed (remembered in their browser, by each pop-up's "After it is
 * closed" rule) and ones meant for other pages, and opens a pop-up when its
 * "Opens" rule says so.
 */

export type Notice = {
  id: number | string
  title: string
  message?: string | null
  style: 'standard' | 'urgent' | 'celebrate'
  href?: string | null
  newTab?: boolean
  linkLabel?: string | null
  /** Page addresses it shows on ("/" = home page); null = every page. */
  paths: string[] | null
  dismissible: boolean
  /** Changes when the announcement is edited, so an edited one shows again. */
  version: string
  /** Show as a pop-up over the page instead of a bar. */
  popup?: boolean
  /** Pop-up: middle of the screen (modal) or a corner (the page stays usable). */
  position?: 'center' | 'corner'
  /** Pop-up: a few seconds after load, after about 10 seconds, or at half-way scroll. */
  opens?: 'soon' | 'later' | 'scroll'
  /** Pop-up, once closed: never again, again after a week, or again next visit. */
  repeat?: 'once' | 'week' | 'visit'
  image?: { src: string; srcSet?: string; sizes?: string; width?: number; height?: number } | null
  imageAlt?: string
  /** Pop-up: the school's form, drawn on the server. */
  form?: ReactNode
}

/**
 * Google Analytics events (20 Nov 2026), when the school's site has GA (the
 * tag loads only on its real domain, never in staff previews). Pop-ups:
 * popup_view, popup_click, popup_close. Bars: announcement_click,
 * announcement_close (a bar shows on every page, so views say nothing).
 * The Analytics page totals the pop-up ones.
 */
function track(event: string, n: Notice) {
  try {
    ;(window as any).gtag?.('event', event, { announcement_id: String(n.id), announcement_title: n.title, announcement_type: n.popup ? 'popup' : 'bar' })
  } catch {}
}

const KEY = 'b61-closed-notices'
const SESSION_KEY = 'b61-closed-notices-visit'
const WEEK = 7 * 24 * 60 * 60 * 1000

/** Closed announcements: "id:version" (closed for good) or "id:version@time" (closed at a time). */
function readList(store: 'local' | 'session'): string[] {
  try {
    const s = store === 'local' ? window.localStorage : window.sessionStorage
    return JSON.parse(s.getItem(store === 'local' ? KEY : SESSION_KEY) || '[]')
  } catch {
    return []
  }
}

function writeList(store: 'local' | 'session', list: string[]) {
  try {
    const s = store === 'local' ? window.localStorage : window.sessionStorage
    s.setItem(store === 'local' ? KEY : SESSION_KEY, JSON.stringify(list.slice(0, 30)))
  } catch {}
}

const noticeKey = (n: Notice) => `${n.id}:${n.version}`

/** Whether this visitor closed it, and it should still stay closed. */
function isClosed(n: Notice, local: string[], session: string[]): boolean {
  const k = noticeKey(n)
  if (session.includes(k)) return true
  for (const entry of local) {
    if (entry === k) {
      // Closed for good, unless the pop-up now comes back each visit (the
      // session list handles that).
      return n.repeat !== 'visit'
    }
    if (entry.startsWith(`${k}@`)) {
      const at = Number(entry.slice(k.length + 1))
      if (n.repeat === 'week') return Date.now() - at < WEEK
      return n.repeat !== 'visit'
    }
  }
  return false
}

function remember(n: Notice) {
  const k = noticeKey(n)
  if (n.popup && n.repeat === 'visit') {
    writeList('session', [k, ...readList('session').filter((e) => e !== k)])
    return
  }
  const entry = n.popup && n.repeat === 'week' ? `${k}@${Date.now()}` : k
  writeList('local', [entry, ...readList('local').filter((e) => e !== k && !e.startsWith(`${k}@`))])
}

const onPage = (n: Notice, path: string) => !n.paths || n.paths.includes(path.replace(/\/+$/, '') || '/')

export default function Announcements({ notices, preview = false }: { notices: Notice[]; preview?: boolean }) {
  const path = usePathname()
  // Until the browser has been read nothing is hidden; a pop-up is never open
  // on load (it waits for its "Opens" rule), so a closed one never flashes.
  const [lists, setLists] = useState<{ local: string[]; session: string[] }>({ local: [], session: [] })
  // The announcement being edited, when this is its preview (?b61-notice=<id>).
  const [editing, setEditing] = useState<string | null>(null)
  useEffect(() => {
    setLists({ local: readList('local'), session: readList('session') })
    if (preview) setEditing(new URLSearchParams(window.location.search).get('b61-notice'))
  }, [preview])

  const isEditing = (n: Notice) => editing !== null && String(n.id) === editing
  // The one being edited always shows, on any page and even if it was closed.
  const shown = notices.filter((n) => isEditing(n) || (onPage(n, path) && !isClosed(n, lists.local, lists.session)))
  const bars = shown.filter((n) => !n.popup)
  // One pop-up at a time: the one being edited, else the first that fits this page and this visitor.
  const popup = shown.find((n) => n.popup && isEditing(n)) ?? shown.find((n) => n.popup) ?? null
  // One pop-up per page view: once one is closed, no other opens until the
  // visitor moves to another page.
  // The one being edited in its preview comes back when the editor changes it.
  const [popupClosedOn, setPopupClosedOn] = useState<string | null>(null)
  const closedMark = (n: Notice) => (isEditing(n) ? `${path}|${noticeKey(n)}` : path)
  const close = (n: Notice) => {
    track(n.popup ? 'popup_close' : 'announcement_close', n)
    // Closing the one being edited in its preview isn't remembered.
    if (!isEditing(n)) remember(n)
    setLists({ local: readList('local'), session: readList('session') })
    if (n.popup) setPopupClosedOn(closedMark(n))
  }

  return (
    <>
      {bars.length > 0 && <Bars notices={bars} close={close} />}
      {popup && popupClosedOn !== closedMark(popup) && (
        // In its preview the key stays put while the editor types (each autosave
        // changes the version), so it doesn't reopen and grab focus every time.
        <Popup
          key={isEditing(popup) ? `edit-${popup.id}` : noticeKey(popup)}
          n={popup}
          preview={isEditing(popup)}
          onClose={() => close(popup)}
        />
      )}
    </>
  )
}

/** Wait until the pop-up should open: a delay, or the visitor scrolling half way. */
function useOpenWhen(opens: Notice['opens'], preview: boolean, open: () => void) {
  useEffect(() => {
    // In its own preview it opens at once, so editors see it as they type.
    if (preview) {
      open()
      return
    }
    if (opens === 'scroll') {
      const check = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        // A page too short to scroll counts as read.
        if (max <= 40 || window.scrollY / max >= 0.5) {
          window.removeEventListener('scroll', check)
          open()
        }
      }
      // Give a short page a moment before calling it "read".
      const t = setTimeout(check, 3000)
      window.addEventListener('scroll', check, { passive: true })
      return () => {
        clearTimeout(t)
        window.removeEventListener('scroll', check)
      }
    }
    const t = setTimeout(open, opens === 'later' ? 10000 : 3000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opens, preview])
}

function Popup({ n, preview, onClose }: { n: Notice; preview: boolean; onClose: () => void }) {
  return n.position === 'corner' ? (
    <CornerPopup n={n} preview={preview} onClose={onClose} />
  ) : (
    <ModalPopup n={n} preview={preview} onClose={onClose} />
  )
}

/**
 * Middle of the screen: a modal dialog. It never opens on page load (it waits
 * for the delay or the scroll), keeps keyboard focus inside while open, and
 * closes with its button, Escape or a click outside. Returning focus is the
 * browser's job (<dialog>).
 */
function ModalPopup({ n, preview, onClose }: { n: Notice; preview: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  // A click outside closes it, but not the end of a drag that started inside
  // (selecting text in a form field), which would lose the visitor's answers.
  const downOnBackdrop = useRef(false)
  useOpenWhen(n.opens, preview, () => {
    const d = ref.current
    // Don't open over another dialog (a menu, a gallery photo).
    if (d && !d.open && !document.querySelector('dialog[open]')) {
      d.showModal()
      if (!preview) track('popup_view', n)
    }
  })
  const headingId = `b61-popup-${n.id}`
  return (
    <dialog
      ref={ref}
      className={`b61-popup b61-popup--center b61-popup--${n.style}${n.form ? ' b61-popup--has-form' : ''}`}
      aria-labelledby={headingId}
      onClose={onClose}
      onMouseDown={(e) => (downOnBackdrop.current = e.target === ref.current)}
      onClick={(e) => {
        if (e.target === ref.current && downOnBackdrop.current) ref.current?.close()
        downOnBackdrop.current = false
      }}
    >
      <PopupContent n={n} headingId={headingId} onCloseClick={() => ref.current?.close()} />
    </dialog>
  )
}

/**
 * A corner: a small panel at the bottom of the screen that doesn't block the
 * page or take keyboard focus. Screen readers hear it arrive (a polite live
 * region), and Escape closes it.
 */
function CornerPopup({ n, preview, onClose }: { n: Notice; preview: boolean; onClose: () => void }) {
  const [open, setOpen] = useState(false)
  useOpenWhen(n.opens, preview, () => {
    setOpen(true)
    if (!preview) track('popup_view', n)
  })
  useEffect(() => {
    if (!open) return
    // Escape closes it only when nothing else is using Escape: focus is on the
    // page itself or inside this panel (not a menu, the search box, a list).
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented || document.querySelector('dialog[open]')) return
      const a = document.activeElement
      if (!a || a === document.body || a.closest('.b61-popup--corner')) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])
  const headingId = `b61-popup-${n.id}`
  return (
    <div aria-live="polite">
      {open && (
        <section
          className={`b61-popup b61-popup--corner b61-popup--${n.style}${n.form ? ' b61-popup--has-form' : ''}`}
          aria-labelledby={headingId}
        >
          <PopupContent n={n} headingId={headingId} onCloseClick={onClose} />
        </section>
      )}
    </div>
  )
}

function PopupContent({ n, headingId, onCloseClick }: { n: Notice; headingId: string; onCloseClick: () => void }) {
  return (
    <div className="b61-popup__inner">
      <button type="button" className="b61-popup__close" onClick={onCloseClick} aria-label={`Close: ${n.title}`}>
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
          <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      {n.image && (
        <div className="b61-popup__media">
          <img {...n.image} alt={n.imageAlt ?? ''} />
        </div>
      )}
      <div className="b61-popup__body">
        <h2 className="b61-popup__title" id={headingId}>
          {n.title}
        </h2>
        {n.message && <p className="b61-popup__msg">{n.message}</p>}
        {n.form && <div className="b61-popup__form">{n.form}</div>}
        {n.href && (
          <a
            className="b61-btn b61-btn--primary b61-popup__btn"
            href={n.href}
            onClick={() => track('popup_click', n)}
            {...(n.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {n.linkLabel || 'Learn more'}
          </a>
        )}
      </div>
    </div>
  )
}

function Bars({ notices: shown, close }: { notices: Notice[]; close: (n: Notice) => void }) {
  return (
    <div className="b61-notices">
      {shown.map((n) => (
        <section
          key={n.id}
          className={`b61-notice b61-notice--${n.style}`}
          role={n.style === 'urgent' ? 'alert' : 'region'}
          aria-label={n.style === 'urgent' ? undefined : 'Announcement'}
        >
          <div className="b61-notice__inner">
            <p className="b61-notice__text">
              <strong className="b61-notice__title">{n.title}</strong>
              {n.message && <span className="b61-notice__msg"> {n.message}</span>}
              {n.href && (
                <>
                  {' '}
                  <a className="b61-notice__link" href={n.href} onClick={() => track('announcement_click', n)} {...(n.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                    {n.linkLabel || 'Learn more'}
                    <span aria-hidden="true"> →</span>
                  </a>
                </>
              )}
            </p>
            {n.dismissible && (
              <button
                type="button"
                className="b61-notice__close"
                aria-label={`Close announcement: ${n.title}`}
                onClick={() => close(n)}
              >
                <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
                  <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        </section>
      ))}
    </div>
  )
}
