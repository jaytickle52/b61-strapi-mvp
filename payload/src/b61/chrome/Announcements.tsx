'use client'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

/*
 * The announcement bar above the header. Rendered on the server with the
 * announcements showing right now; this client part only hides ones the
 * visitor closed (remembered in their browser) and "home page only" ones on
 * other pages.
 */

export type Notice = {
  id: number | string
  title: string
  message?: string | null
  style: 'standard' | 'urgent' | 'celebrate'
  href?: string | null
  newTab?: boolean
  linkLabel?: string | null
  homeOnly: boolean
  dismissible: boolean
  /** Changes when the announcement is edited, so an edited one shows again. */
  version: string
  /** Show as a pop-up over the page instead of a bar (once per visitor). */
  popup?: boolean
  image?: { src: string; srcSet?: string; sizes?: string; width?: number; height?: number } | null
  imageAlt?: string
}

const KEY = 'b61-closed-notices'

function readClosed(): string[] {
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

function remember(key: string) {
  try {
    const list = [key, ...readClosed().filter((k) => k !== key)].slice(0, 30)
    window.localStorage.setItem(KEY, JSON.stringify(list))
  } catch {}
}

export default function Announcements({ notices }: { notices: Notice[] }) {
  const path = usePathname()
  const [closed, setClosed] = useState<string[]>([])
  useEffect(() => setClosed(readClosed()), [])

  const shown = notices.filter((n) => (!n.homeOnly || path === '/') && !closed.includes(`${n.id}:${n.version}`))
  const bars = shown.filter((n) => !n.popup)
  // One pop-up at a time: the first that this visitor hasn't closed.
  const popup = shown.find((n) => n.popup) ?? null
  const close = (n: Notice) => {
    const k = `${n.id}:${n.version}`
    remember(k)
    setClosed((c) => [...c, k])
  }

  return (
    <>
      {bars.length > 0 && <Bars notices={bars} close={close} />}
      {popup && <Popup key={`${popup.id}:${popup.version}`} n={popup} onClose={() => close(popup)} />}
    </>
  )
}

/**
 * A pop-up announcement: a modal dialog that opens shortly after the page
 * loads, so it never blocks the first look at the page. Closing it (button,
 * Escape or a click outside) remembers it for this visitor.
 */
function Popup({ n, onClose }: { n: Notice; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const t = setTimeout(() => {
      const d = ref.current
      if (d && !d.open && !document.querySelector('dialog[open]')) d.showModal()
    }, 1500)
    return () => clearTimeout(t)
  }, [])
  const headingId = `b61-popup-${n.id}`
  return (
    <dialog
      ref={ref}
      className={`b61-popup b61-popup--${n.style}`}
      aria-labelledby={headingId}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && ref.current?.close()}
    >
      <div className="b61-popup__inner">
        <button type="button" className="b61-popup__close" onClick={() => ref.current?.close()} aria-label="Close">
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
          {n.href && (
            <a className="b61-btn b61-btn--primary b61-popup__btn" href={n.href} {...(n.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
              {n.linkLabel || 'Learn more'}
            </a>
          )}
        </div>
      </div>
    </dialog>
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
                  <a className="b61-notice__link" href={n.href} {...(n.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
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
