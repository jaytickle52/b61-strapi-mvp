import type { CSSProperties } from 'react'
import type { Page } from '@/payload-types'
import { resolveHeadingLevel } from '../../kit/groups'
import { BandHead, Buttons, eruleClass, revealAttr } from '../../kit/render/parts'
import { hasHeading } from '../../kit/heading'

export type StatsBlock = Extract<NonNullable<Page['sections']>[number], { blockType: 'b61StatsBand' }>

/* Ported from elements/Stats_Band/html.twig (plugin 1.77.1). */
export default function B61StatsBand({ block, index = 0, nested = false }: { block: StatsBlock; index?: number; nested?: boolean }) {
  const ri = revealAttr(block.entrance)
  const rv = block.entrance === 'off' ? 'off' : 'on'
  // Not chosen: Light wash on its own, None inside a container (shares its colour).
  const surface = block.surface ?? (nested ? 'none' : 'soft')
  const align = block.textAlign ?? 'center'
  const cols = block.columns ?? '3'
  const istyle = block.itemStyle ?? 'plain'
  const flush = istyle === 'divided' && block.flushEdges
  const headingId = `b61-stats-${block.id ?? index}-heading`
  const showHeading = hasHeading(block.heading)
  const Wrap = showHeading ? 'section' : 'div'
  const stats = (block.stats ?? []).filter((s) => s?.figure || s?.label)
  return (
    <div
      className={[
        'b61-stats',
        `b61-stats--ta-${align}`,
        eruleClass(block.eyebrowRule),
        ['right', 'left'].includes((block as any).bandWidth) && `b61-stats--part b61-stats--part-${(block as any).bandWidth}`,
        // Same hook as Section's pull-up, so the band above makes room (components.css).
        (block as any).pullUp && 'b61-section--pull b61-stats--pull',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Wrap
        className={[
          'b61-stats__region',
          `b61-surface--${surface}`,
          surface !== 'none' && `b61-band--${surface}`,
          `b61-stats__region--a${align}`,
          `b61-stats__region--style-${istyle}`,
          `b61-stats__region--cols${cols}`,
          `b61-stats__region--fig-${block.figureScale ?? 'large'}`,
          `b61-stats__region--l${block.labelPosition ?? 'below'}`,
          `b61-stats__region--pt-${block.padTop ?? 'normal'}`,
          `b61-stats__region--pb-${block.padBottom ?? 'normal'}`,
          flush && 'b61-stats__region--flush',
        ]
          .filter(Boolean)
          .join(' ')}
        data-b61-reveal={rv}
        {...(showHeading ? { 'aria-labelledby': headingId } : {})}
      >
        <BandHead block={block as any} prefix="b61-stats" as={resolveHeadingLevel(block.headingLevel, index)} headingId={headingId} ri={ri} />
        {stats.length > 0 && (
          <ul className="b61-stats__grid" style={{ '--b61-stats-cols': cols } as CSSProperties}>
            {stats.map((s, i) => (
              <li key={s.id ?? i} className={`b61-stats__item${istyle === 'boxed' ? ` b61-stats__item--surf-${block.itemSurface ?? 'card'}` : ''}`} {...ri}>
                {s.figure && (
                  <span className="b61-stats__value" {...(rv === 'on' ? { 'data-b61-count': '' } : {})}>
                    {s.figure}
                  </span>
                )}
                {s.label && <span className="b61-stats__label">{s.label}</span>}
                {s.note && <span className="b61-stats__note">{s.note}</span>}
              </li>
            ))}
          </ul>
        )}
        <Buttons buttons={block.buttons as any} className="b61-stats__actions" ri={ri} />
      </Wrap>
    </div>
  )
}
