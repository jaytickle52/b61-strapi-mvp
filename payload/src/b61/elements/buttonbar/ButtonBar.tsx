import type { Page } from '@/payload-types'
import { resolveLink } from '../../lib/media'

export type ButtonBarBlock = Extract<NonNullable<Page['sections']>[number], { blockType: 'b61ButtonBar' }>

/* Ported from elements/Button_Bar/html.twig (plugin 1.77.1). */
export default function B61ButtonBar({ block }: { block: ButtonBarBlock; index?: number }) {
  const rv = block.entrance === 'off' ? 'off' : 'on'
  const ri = rv === 'on' ? { 'data-b61-reveal-item': '' } : {}
  const slots = [
    { label: block.firstLabel, link: block.firstLink, color: block.firstColor ?? 'dark' },
    { label: block.secondLabel, link: block.secondLink, color: block.secondColor ?? 'accent' },
  ].filter((s) => s.label)
  if (!slots.length) return null
  return (
    <div className="b61-btnbar">
      <div className={`b61-btnbar__row b61-btnbar__row--n${slots.length} b61-btnbar__row--${block.size ?? 'standard'}`} data-b61-reveal={rv}>
        {slots.map((s, i) => {
          const { href, newTab } = resolveLink(s.link as any)
          return (
            <div key={i} className={`b61-btnbar__half b61-surface--${s.color} b61-band--${s.color}`} {...ri}>
              <a className="b61-link b61-btnbar__link" href={href ?? undefined} {...(newTab ? { target: '_blank', rel: 'noopener' } : {})}>
                <span className="b61-btnbar__label">{s.label}</span>
                <span className="b61-link-arrow" aria-hidden="true">&rarr;</span>
              </a>
            </div>
          )
        })}
      </div>
    </div>
  )
}
