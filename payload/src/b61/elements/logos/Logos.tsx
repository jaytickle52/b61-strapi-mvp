import type { CSSProperties } from 'react'
import { asMedia, resolveLink } from '../../lib/media'
import { resolveHeadingLevel } from '../../kit/groups'
import { BandHead, eruleClass, revealAttr } from '../../kit/render/parts'
import LogosInit from './LogosInit'

/*
 * LOGOS. Still: a centred, wrapping row. Scrolling: the row moves slowly
 * sideways in a loop (a hidden second copy makes it seamless); a pause button
 * comes first so keyboard users reach it before the moving links.
 */
export default function B61Logos({ block, index = 0 }: { block: any; index?: number }) {
  const ri = revealAttr(block.entrance)
  const rv = block.entrance === 'off' ? 'off' : 'on'
  const as = resolveHeadingLevel(block.headingLevel, index)
  const surface = block.surface ?? 'none'
  const id = `b61-logos-${block.id ?? index}`
  const lines = (block.lines ?? []).filter((l: any) => l?.text)
  const Wrap = lines.length ? 'section' : 'div'
  const ha = block.headingAlign ?? 'left'
  const logos = ((block.logos ?? []) as any[]).filter((l) => asMedia(l?.image)?.url)
  const scroll = block.motion === 'scroll' && logos.length > 2
  const size = Math.min(Math.max(Math.round(block.logoStep ?? 4), 1), 7)

  const row = (copy: boolean) => (
    <ul className="b61-logos__list" {...(copy ? { 'aria-hidden': true } : {})}>
      {logos.map((l, i) => {
        const m = asMedia(l.image)!
        const { href, newTab } = resolveLink(l.link)
        const img = <img src={m.url!} width={m.width ?? undefined} height={m.height ?? undefined} alt={copy ? '' : (m.alt ?? '')} loading="lazy" decoding="async" />
        return (
          <li key={`${l.id ?? i}${copy ? '-copy' : ''}`} className="b61-logos__item">
            {href ? (
              <a href={href} {...(copy ? { tabIndex: -1 } : {})} {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                {img}
              </a>
            ) : (
              img
            )}
          </li>
        )
      })}
    </ul>
  )

  return (
    <div className={['b61-logos', eruleClass(block.eyebrowRule)].filter(Boolean).join(' ')}>
      <Wrap
        className={[
          'b61-logos__region',
          `b61-surface--${surface}`,
          surface !== 'none' && `b61-band--${surface}`,
          `b61-logos__region--pt-${block.padTop ?? 'normal'}`,
          `b61-logos__region--pb-${block.padBottom ?? 'normal'}`,
          scroll ? 'b61-logos__region--scroll' : 'b61-logos__region--still',
          block.oneColour && 'b61-logos__region--mono',
        ]
          .filter(Boolean)
          .join(' ')}
        style={{ '--b61-logo-h': `var(--b61-logo-h-${size})` } as CSSProperties}
        data-b61-reveal={rv}
        {...(lines.length ? { 'aria-labelledby': `${id}-heading` } : {})}
      >
        <BandHead block={block} prefix="b61-logos" as={as} headingId={`${id}-heading`} ri={ri} headClass={`b61-halign-${ha} b61-headw-${ha}`} itemClass="b61-block" />
        {logos.length > 0 &&
          (scroll ? (
            <div className="b61-logos__marquee" data-b61-marquee {...ri}>
              <button type="button" className="b61-logos__pause" aria-pressed="false" data-b61-marquee-toggle>
                <span className="b61-logos__pause-label">Pause logos</span>
              </button>
              <div className="b61-logos__viewport">
                <div className="b61-logos__track" style={{ '--b61-logos-n': logos.length } as CSSProperties}>
                  {row(false)}
                  {row(true)}
                </div>
              </div>
              <LogosInit />
            </div>
          ) : (
            <div className={`b61-logos__still b61-logos__still--${ha}`} {...ri}>
              {row(false)}
            </div>
          ))}
      </Wrap>
    </div>
  )
}
