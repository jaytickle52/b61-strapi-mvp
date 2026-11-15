'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { NavItem, NavLink } from './resolve'

/*
 * Site header: a desktop menu with dropdowns and mega menus, and a slide-in
 * menu on phones. Accessible by default: real buttons with aria-expanded,
 * Escape closes and returns focus, the phone menu is a modal <dialog>.
 */
type Brand = { name: string; logo?: { src: string; width?: number; height?: number } | null }

const Chevron = () => (
  <svg className="b61-hdr__chev" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" focusable="false">
    <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

function A({ l, className, onClick, current }: { l: NavLink; className?: string; onClick?: () => void; current?: string }) {
  const props = l.newTab ? { target: '_blank', rel: 'noopener' } : {}
  const isCurrent = l.href && current && (l.href === current || (l.href !== '/' && current.startsWith(l.href + '/')))
  if (!l.href) return <span className={className}>{l.label}</span>
  return (
    <Link href={l.href} className={className} onClick={onClick} aria-current={isCurrent ? 'page' : undefined} {...props}>
      {l.label}
      {l.description && <span className="b61-hdr__desc">{l.description}</span>}
    </Link>
  )
}

export default function Header({ brand, items, utility, button }: { brand: Brand; items: NavItem[]; utility: NavLink[]; button: NavLink | null }) {
  const pathname = usePathname()
  const [open, setOpen] = useState<number | null>(null)
  const [mobileSub, setMobileSub] = useState<number | null>(null)
  const nav = useRef<HTMLElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const burger = useRef<HTMLButtonElement>(null)
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const close = useCallback((focus = false) => {
    setOpen((i) => {
      if (focus && i !== null) nav.current?.querySelector<HTMLButtonElement>(`[data-b61-trigger="${i}"]`)?.focus()
      return null
    })
  }, [])

  // Close everything when the page changes.
  useEffect(() => {
    setOpen(null)
    setMobileSub(null)
    if (dialog.current?.open) dialog.current.close()
  }, [pathname])

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close(true)
    const onDown = (e: PointerEvent) => !nav.current?.contains(e.target as Node) && close()
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [open, close])

  const hover = (i: number | null) => (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
    hoverTimer.current = setTimeout(() => setOpen(i), i === null ? 220 : 80)
  }

  // The header is sticky: publish its height so the page keeps focused items
  // and in-page jumps (form error links, #main) clear of it (WCAG 2.4.11).
  const bar = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = bar.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const set = () => document.documentElement.style.setProperty('--b61-sticky-h', `${Math.ceil(el.getBoundingClientRect().height)}px`)
    set()
    const ro = new ResizeObserver(set)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const openMobile = () => {
    dialog.current?.showModal()
    document.documentElement.classList.add('b61-hdr-lock')
  }
  const closeMobile = () => dialog.current?.close()

  const logo = brand.logo ? <img src={brand.logo.src} width={brand.logo.width} height={brand.logo.height} alt="" className="b61-hdr__logo" /> : <span className="b61-hdr__mark" aria-hidden="true">{brand.name.charAt(0)}</span>

  return (
    <header ref={bar} className="b61-hdr">
      <div className="b61-hdr__bar">
        <Link href="/" className="b61-hdr__brand">
          {logo}
          <span className="b61-hdr__name">{brand.name}</span>
        </Link>

        <nav ref={nav} aria-label="Main" className="b61-hdr__nav">
          <ul className="b61-hdr__menu">
            {items.map((it, i) =>
              it.kind === 'link' ? (
                <li key={i} className="b61-hdr__item">
                  <A l={it} className="b61-hdr__top" current={pathname} />
                </li>
              ) : (
                <li key={i} className={`b61-hdr__item${it.kind === 'mega' ? ' b61-hdr__item--mega' : ''}`} onPointerEnter={hover(i)} onPointerLeave={hover(null)}>
                  <button
                    type="button"
                    className="b61-hdr__top"
                    aria-expanded={open === i}
                    aria-controls={`b61-hdr-panel-${i}`}
                    data-b61-trigger={i}
                    onClick={() => setOpen(open === i ? null : i)}
                  >
                    {it.label}
                    <Chevron />
                  </button>
                  {it.kind === 'dropdown' ? (
                    <div id={`b61-hdr-panel-${i}`} className="b61-hdr__drop" hidden={open !== i}>
                      <ul>
                        {it.links.map((l, j) => (
                          <li key={j}>
                            <A l={l} className="b61-hdr__link" current={pathname} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div id={`b61-hdr-panel-${i}`} className="b61-hdr__mega" hidden={open !== i}>
                      <div className={`b61-hdr__mega-inner b61-hdr__mega-inner--n${it.columns.length}${it.feature ? ' b61-hdr__mega-inner--feature' : ''}`}>
                        {it.columns.map((c, j) => (
                          <div key={j} className="b61-hdr__col">
                            {c.heading && <p className="b61-hdr__colhead">{c.heading}</p>}
                            <ul>
                              {c.links.map((l, k) => (
                                <li key={k}>
                                  <A l={l} className="b61-hdr__link b61-hdr__link--mega" current={pathname} />
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                        {it.feature && <Feature f={it.feature} />}
                      </div>
                    </div>
                  )}
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="b61-hdr__end">
          <Link href="/search" className="b61-hdr__search" aria-label="Search this site">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
              <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="m20 20-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </Link>
          {utility.map((l, i) => (
            <A key={i} l={l} className="b61-hdr__util" current={pathname} />
          ))}
          {button?.href && (
            <Link href={button.href} className="b61-btn b61-btn--primary b61-hdr__btn" {...(button.newTab ? { target: '_blank', rel: 'noopener' } : {})}>
              {button.label}
            </Link>
          )}
          <button ref={burger} type="button" className="b61-hdr__burger" aria-haspopup="dialog" onClick={openMobile}>
            <span className="b61-hdr__burger-icon" aria-hidden="true" />
            Menu
          </button>
        </div>
      </div>

      <dialog
        ref={dialog}
        className="b61-hdr__panel"
        aria-label="Menu"
        onClose={() => {
          document.documentElement.classList.remove('b61-hdr-lock')
          burger.current?.focus()
        }}
        onClick={(e) => e.target === dialog.current && closeMobile()}
      >
        <div className="b61-hdr__panel-inner">
          <div className="b61-hdr__panel-top">
            <span className="b61-hdr__name">{brand.name}</span>
            <button type="button" className="b61-hdr__close" onClick={closeMobile} aria-label="Close menu">
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
                <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <nav aria-label="Main">
            <ul className="b61-hdr__mlist">
              {items.map((it, i) =>
                it.kind === 'link' ? (
                  <li key={i}>
                    <A l={it} className="b61-hdr__mtop" current={pathname} onClick={closeMobile} />
                  </li>
                ) : (
                  <li key={i}>
                    <button type="button" className="b61-hdr__mtop" aria-expanded={mobileSub === i} aria-controls={`b61-hdr-m-${i}`} onClick={() => setMobileSub(mobileSub === i ? null : i)}>
                      {it.label}
                      <Chevron />
                    </button>
                    <div id={`b61-hdr-m-${i}`} className="b61-hdr__msub" hidden={mobileSub !== i}>
                      {(it.kind === 'dropdown' ? [{ heading: null, links: it.links }] : it.columns).map((c, j) => (
                        <div key={j}>
                          {c.heading && <p className="b61-hdr__colhead">{c.heading}</p>}
                          <ul>
                            {c.links.map((l, k) => (
                              <li key={k}>
                                <A l={{ ...l, description: null }} className="b61-hdr__mlink" current={pathname} onClick={closeMobile} />
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </li>
                ),
              )}
            </ul>
          </nav>
          <div className="b61-hdr__mend">
            {utility.map((l, i) => (
              <A key={i} l={l} className="b61-hdr__util" current={pathname} onClick={closeMobile} />
            ))}
            {button?.href && (
              <Link href={button.href} className="b61-btn b61-btn--primary b61-btn--block" onClick={closeMobile}>
                {button.label}
              </Link>
            )}
          </div>
        </div>
      </dialog>
    </header>
  )
}

function Feature({ f }: { f: NonNullable<Extract<NavItem, { kind: 'mega' }>['feature']> }) {
  const body = (
    <>
      {f.img && (
        <span className="b61-hdr__feat-media">
          <img {...f.img} alt={f.alt} loading="lazy" />
        </span>
      )}
      {f.title && (
        <span className="b61-hdr__feat-title">
          {f.title}
          {f.href && <span className="b61-link-arrow" aria-hidden="true"> &rarr;</span>}
        </span>
      )}
      {f.text && <span className="b61-hdr__feat-text">{f.text}</span>}
    </>
  )
  return f.href ? (
    <Link href={f.href} className="b61-hdr__feat" {...(f.newTab ? { target: '_blank', rel: 'noopener' } : {})}>
      {body}
    </Link>
  ) : (
    <div className="b61-hdr__feat">{body}</div>
  )
}
