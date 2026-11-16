import type { CSSProperties } from 'react'
import Link from 'next/link'
import type { SchoolSetting } from '@/payload-types'
import { resolveLink } from '../lib/media'

/* Site footer: brand and contact, up to four link columns, social links, a note and the legal line. */
const SOCIAL_PATHS: Record<string, { label: string; d: string }> = {
  facebook: { label: 'Facebook', d: 'M14 8h3V4h-3c-2.8 0-4.5 1.8-4.5 4.6V11H7v4h2.5v7h4v-7H16l.6-4h-3.1V8.9c0-.6.3-.9.9-.9Z' },
  instagram: { label: 'Instagram', d: 'M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3Zm0 2A2.5 2.5 0 0 0 5 7.5v9A2.5 2.5 0 0 0 7.5 19h9a2.5 2.5 0 0 0 2.5-2.5v-9A2.5 2.5 0 0 0 16.5 5h-9ZM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm5-3.3a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z' },
  youtube: { label: 'YouTube', d: 'M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3L10 15Z' },
  x: { label: 'X', d: 'M17.8 3h3l-6.6 7.6L22 21h-6.1l-4.8-6.3L5.6 21h-3l7.1-8.1L2.2 3h6.2l4.4 5.8L17.8 3Zm-1 16.2h1.7L7.3 4.7H5.5l11.3 14.5Z' },
  linkedin: { label: 'LinkedIn', d: 'M4.5 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM3 8.5h3V21H3V8.5Zm5 0h2.9v1.7c.5-.9 1.7-2 3.6-2 3.4 0 4.5 2.1 4.5 5.4V21h-3v-6.6c0-1.6-.3-3-2-3s-2.1 1.3-2.1 2.9V21H8V8.5Z' },
  tiktok: { label: 'TikTok', d: 'M16.5 3c.4 2.2 1.8 3.7 4 3.9v3a7 7 0 0 1-4-1.3v6.2a5.8 5.8 0 1 1-5.8-5.8c.3 0 .6 0 .9.1v3.1a2.8 2.8 0 1 0 1.9 2.6V3h3Z' },
  vimeo: { label: 'Vimeo', d: 'M21.9 7.4c-.1 1.9-1.4 4.5-4 7.9-2.7 3.5-4.9 5.2-6.8 5.2-1.1 0-2.1-1.1-2.9-3.2L6.6 11.5C6 9.4 5.4 8.3 4.7 8.3c-.1 0-.6.3-1.4.9L2.5 8.1l2.6-2.3c1.2-1 2-1.6 2.6-1.6 1.4-.1 2.3.8 2.6 2.9.3 2.2.6 3.6.7 4.1.4 1.8.9 2.7 1.4 2.7.4 0 1-.6 1.8-1.9.8-1.3 1.3-2.2 1.3-2.9.1-1.1-.3-1.7-1.3-1.7-.5 0-.9.1-1.4.3.9-3 2.7-4.5 5.3-4.4 1.9.1 2.8 1.3 2.8 3.7Z' },
}

type L = { label?: string | null; link?: any }
function FLink({ l, className }: { l: L; className?: string }) {
  const { href, newTab } = resolveLink(l.link)
  if (!l.label) return null
  return href ? (
    <Link href={href} className={className} {...(newTab ? { target: '_blank', rel: 'noopener' } : {})}>
      {l.label}
    </Link>
  ) : (
    <span className={className}>{l.label}</span>
  )
}

export default function Footer({ s, logo }: { s: Partial<SchoolSetting> & { schoolName: string }; logo?: string | null }) {
  const cols = (s.footerColumns ?? []).filter((c) => c?.links?.length)
  const social = (s.social ?? []).filter((x) => x?.url && SOCIAL_PATHS[x.platform])
  const year = new Date().getFullYear()
  const copyright = (s.copyright || `© {year} ${s.schoolName}`).replace('{year}', String(year))
  const contact = s.footerShowContact !== false && (s.address || s.phone || s.email)
  return (
    <footer className="b61-ftr b61-surface--dark b61-band--dark">
      <div className={`b61-ftr__inner b61-ftr__inner--n${cols.length}`}>
        <div className="b61-ftr__brand">
          {logo && <img src={logo} alt="" className="b61-ftr__logo" />}
          <p className="b61-ftr__name">{s.schoolName}</p>
          {s.tagline && <p className="b61-ftr__tag">{s.tagline}</p>}
          {contact && (
            <address className="b61-ftr__contact">
              {s.address && <span className="b61-ftr__addr">{s.address}</span>}
              {s.phone && <a href={`tel:${s.phone.replace(/[^\d+]/g, '')}`}>{s.phone}</a>}
              {s.email && <a href={`mailto:${s.email}`}>{s.email}</a>}
            </address>
          )}
          {social.length > 0 && (
            <ul className="b61-ftr__social">
              {social.map((x, i) => (
                <li key={i}>
                  <a href={x.url} target="_blank" rel="noopener" aria-label={SOCIAL_PATHS[x.platform].label}>
                    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
                      <path d={SOCIAL_PATHS[x.platform].d} fill="currentColor" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        {cols.map((c, i) => (
          <nav key={i} className="b61-ftr__col" aria-label={c.heading || `Footer links ${i + 1}`}>
            {c.heading && <p className="b61-ftr__colhead">{c.heading}</p>}
            <ul>
              {(c.links ?? []).map((l, j) => (
                <li key={j}>
                  <FLink l={l} className="b61-ftr__link" />
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="b61-ftr__base">
        {s.footerNote && <p className="b61-ftr__note">{s.footerNote}</p>}
        <div className="b61-ftr__legal">
          <span>{copyright}</span>
          {(s.legalLinks ?? []).map((l, i) => (
            <FLink key={i} l={l} className="b61-ftr__link" />
          ))}
        </div>
      </div>
      {/* Footer layout "Wordmark" (School settings > Style): the school's name set
          across the whole footer. Hidden otherwise; decorative (the name is above). */}
      <p className="b61-ftr__wordmark" aria-hidden="true" style={{ '--b61-wm-len': Math.max(s.schoolName.length, 6) } as CSSProperties}>
        {s.schoolName}
      </p>
    </footer>
  )
}
