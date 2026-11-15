import { b61Converters } from '../../kit/render/converters'
import type { CSSProperties } from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { asMedia, focusOf, imgProps } from '../../lib/media'
import { resolveHeadingLevel } from '../../kit/groups'
import { BandHead, eruleClass, revealAttr } from '../../kit/render/parts'
import PillarsInit from './PillarsInit'

/* Ported from elements/Pillars/html.twig (plugin 1.77.1). */
export default function B61Pillars({ block, index = 0 }: { block: any; index?: number }) {
  const ri = revealAttr(block.entrance)
  const rv = block.entrance === 'off' ? 'off' : 'on'
  const as = resolveHeadingLevel(block.headingLevel, index)
  const surface = block.surface ?? 'none'
  const pos = block.tabPosition ?? 'left'
  const talign = block.tabAlign ?? 'left'
  const openFirst = block.firstItemOpen !== false
  const id = `b61-pillars-${block.id ?? index}`
  const lines = (block.lines ?? []).filter((l: any) => l?.text)
  const Wrap = lines.length ? 'section' : 'div'
  const items = (block.items ?? []).filter((i: any) => i?.title)
  const label = lines.map((l: any) => l.text).join(' ') || 'Pillars'
  const ha = block.headingAlign ?? 'left'
  return (
    <div className={['b61-pillars', eruleClass(block.eyebrowRule)].filter(Boolean).join(' ')}>
      <Wrap
        className={[
          'b61-pillars__region',
          `b61-surface--${surface}`,
          surface !== 'none' && `b61-band--${surface}`,
          `b61-pillars__region--tabs-${pos}`,
          pos === 'top' && `b61-pillars__region--align-${talign}`,
          `b61-pillars__region--pt-${block.padTop ?? 'normal'}`,
          `b61-pillars__region--pb-${block.padBottom ?? 'normal'}`,
        ]
          .filter(Boolean)
          .join(' ')}
        data-b61-reveal={rv}
        {...(lines.length ? { 'aria-labelledby': `${id}-heading` } : {})}
      >
        <BandHead block={block} prefix="b61-pillars" as={as} headingId={`${id}-heading`} ri={ri} headClass={`b61-halign-${ha} b61-headw-${ha}`} itemClass="b61-block" />
        {items.length > 0 && (
          <div className="b61-pillars__layout" style={{ '--b61-pillars-rows': items.length * 2 } as CSSProperties}>
            <div className="b61-pillars__tabs" {...ri} role="tablist" aria-orientation={pos === 'top' ? 'horizontal' : 'vertical'} aria-label={label}>
              {items.map((it: any, i: number) => {
                const active = openFirst && i === 0
                return (
                  <button
                    key={it.id ?? i}
                    type="button"
                    role="tab"
                    id={`${id}-tab-${i + 1}`}
                    className={`b61-pillars__tab js-b61-pillars-tab${active ? ' is-active' : ''}`}
                    style={{ '--b61-pillar-i': i + 1, '--b61-pillar-row': i * 2 + 1 } as CSSProperties}
                    aria-selected={active}
                    aria-controls={`${id}-panel-${i + 1}`}
                    tabIndex={active || (!openFirst && i === 0) ? 0 : -1}
                  >
                    <span className="b61-pillars__title">{it.title}</span>
                  </button>
                )
              })}
            </div>
            <div className="b61-pillars__panels" {...ri}>
              {items.map((it: any, i: number) => (
                <div
                  key={it.id ?? i}
                  role="tabpanel"
                  id={`${id}-panel-${i + 1}`}
                  aria-labelledby={`${id}-tab-${i + 1}`}
                  className={`b61-pillars__panel${openFirst && i === 0 ? ' is-open' : ''}`}
                  style={{ '--b61-pillar-i': i + 1, '--b61-pillar-row': (i + 1) * 2 } as CSSProperties}
                >
                  <div className="b61-pillars__panel-inner">
                    <div className="b61-pillars__panel-body breakdance-rich-text-styles">{it.body && <RichText data={it.body as SerializedEditorState} disableContainer converters={b61Converters} />}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="b61-pillars__media" {...ri}>
              {items.map((it: any, i: number) => {
                const img = imgProps(it.image, '(max-width: 900px) 100vw, 700px')
                const f = focusOf(it.image)
                return (
                  <figure key={it.id ?? i} className={`b61-pillars__figure${i === 0 ? ' is-active' : ''}`} style={{ '--b61-pillar-i': i + 1, ...(f ? { '--b61-photo-focus': f } : {}) } as CSSProperties} aria-hidden={i !== 0}>
                    <div className="b61-pillars__figure-media">{img && <img {...img} alt={asMedia(it.image)?.alt ?? ''} loading="lazy" />}</div>
                  </figure>
                )
              })}
            </div>
          </div>
        )}
        <noscript>
          <style>{'.b61-pillars__panel{grid-area:auto;grid-template-rows:1fr;visibility:visible}.b61-pillars__panel .b61-pillars__panel-body{opacity:1;translate:none}'}</style>
        </noscript>
      </Wrap>
      <PillarsInit openFirst={openFirst} />
    </div>
  )
}
