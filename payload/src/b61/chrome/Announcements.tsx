'use client'
import { useEffect, useState } from 'react'
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
  if (!shown.length) return null

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
                onClick={() => {
                  const k = `${n.id}:${n.version}`
                  remember(k)
                  setClosed((c) => [...c, k])
                }}
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
