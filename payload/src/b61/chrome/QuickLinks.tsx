import { B61Icon } from '../kit/render/icons'
import type { QuickLink } from './resolve'

/*
 * Header > Side buttons: up to three links that stay on screen, docked at the
 * right edge on wide screens and along the bottom on phones. Each shows its
 * icon and its words (never an icon alone). Plain links; no script.
 */
export default function QuickLinks({ links }: { links: QuickLink[] }) {
  if (!links.length) return null
  return (
    <nav className={`b61-quick b61-quick--n${links.length}`} aria-label="Quick links">
      <ul className="b61-quick__list">
        {links.map((l, i) => (
          <li key={i}>
            <a className="b61-quick__link" href={l.href!} {...(l.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
              <span className="b61-quick__icon" aria-hidden="true">
                <B61Icon name={l.icon} />
              </span>
              <span className="b61-quick__label">{l.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
