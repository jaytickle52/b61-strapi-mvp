import { resolveHeadingLevel } from '../../kit/groups'
import { BandHead, eruleClass, revealAttr } from '../../kit/render/parts'
import Inner from '../../kit/render/Inner'
import TabsInit from './TabsInit'
import { headingText } from '../../kit/heading'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { CSSProperties } from 'react'
import { b61Converters } from '../../kit/render/converters'
import { asMedia, focusOf, imgProps } from '../../lib/media'
import B61Pillars from '../pillars/Pillars'
import { anchorAttr } from '../../kit/render/anchor'

/* Ported from elements/Tabs/html.twig and elements/Tab/html.twig (plugin 1.77.1).
 * One element for all tab patterns (20 Nov 2026): Feature list and Scroll
 * story are drawn by the Pillars renderer; Tabs on top / beside here, each
 * pane showing the tab's text and photo, then any "More in this tab" elements. */
export default function B61Tabs({ block, index = 0, path }: { block: any; index?: number; path?: string }) {
  if (block.layout === 'list' || block.layout === 'story') return <B61Pillars block={block} index={index} />
  const ri = revealAttr(block.entrance)
  const rv = block.entrance === 'off' ? 'off' : 'on'
  const as = resolveHeadingLevel(block.headingLevel, index)
  const surface = block.surface ?? 'none'
  const pos = block.layout === 'beside' ? (block.side === 'right' ? 'right' : 'left') : 'top'
  const talign = block.tabAlign ?? 'left'
  const openFirst = block.firstItemOpen !== false
  const uid = String(block.id ?? index)
  const id = `b61-tabs-${uid}`
  const title = headingText(block.heading)
  const Wrap = title ? 'section' : 'div'
  const tabs = (block.tabs ?? []).filter((t: any) => t?.label)
  const ha = block.headingAlign ?? 'left'
  return (
    <div {...anchorAttr(block)} className={['b61-tabs', eruleClass(block.eyebrowRule)].filter(Boolean).join(' ')}>
      <Wrap
        className={[
          'b61-tabs__region',
          `b61-surface--${surface}`,
          surface !== 'none' && `b61-band--${surface}`,
          `b61-tabs__region--tabs-${pos}`,
          pos === 'top' && `b61-tabs__region--align-${talign}`,
          `b61-tabs__region--pt-${block.padTop ?? 'normal'}`,
          `b61-tabs__region--pb-${block.padBottom ?? 'normal'}`,
        ]
          .filter(Boolean)
          .join(' ')}
        data-b61-reveal={rv}
        {...(title ? { 'aria-labelledby': `${id}-heading` } : {})}
      >
        <BandHead block={block} prefix="b61-tabs" as={as} headingId={`${id}-heading`} ri={ri} headClass={`b61-halign-${ha} b61-headw-${ha}`} itemClass="b61-block" />
        <div className="b61-tabs__layout">
          {tabs.length > 0 && (
            <div className="b61-tabs__tablist js-b61-tabs-list" {...ri} data-b61-orientation={pos === 'top' ? 'horizontal' : 'vertical'} data-b61-label={title || 'Tabs'}>
              {tabs.map((t: any, i: number) => {
                const active = openFirst && i === 0
                return (
                  <button key={t.id ?? i} type="button" id={`${id}-tab-${i + 1}`} className={`b61-tabs__tab js-b61-tabs-tab${active ? ' is-active' : ''}`} data-b61-selected={active ? 'true' : 'false'}>
                    <span className="b61-tabs__title">{t.label}</span>
                  </button>
                )
              })}
            </div>
          )}
          <div className="b61-tabs__panels js-b61-tabs-panels" data-b61-tabs-id={uid}>
            {tabs.map((t: any, i: number) => (
              <div key={t.id ?? i} className="b61-pane">
                <h3 className="b61-pane__label js-b61-pane-label">{t.label}</h3>
                <div className="b61-pane__content">
                  <TabFeature tab={t} />
                  <Inner blocks={t.content} path={path && `${path}.tabs.${i}.content`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Wrap>
      <TabsInit />
    </div>
  )
}

/** A tab's own text and photo, side by side (stacked on phones). */
function TabFeature({ tab }: { tab: any }) {
  const hasBody = Boolean(tab.body?.root?.children?.some((c: any) => c?.children?.length || c?.type === 'block'))
  const img = imgProps(tab.image, '(max-width: 900px) 100vw, 640px')
  if (!hasBody && !img) return null
  const f = focusOf(tab.image)
  return (
    <div className={`b61-tabs__feature${img ? '' : ' b61-tabs__feature--text'}${hasBody ? '' : ' b61-tabs__feature--photo'}`}>
      {hasBody && (
        <div className="b61-tabs__feature-body breakdance-rich-text-styles">
          <RichText data={tab.body as SerializedEditorState} disableContainer converters={b61Converters} />
        </div>
      )}
      {img && (
        <figure className="b61-tabs__feature-media" style={f ? ({ '--b61-photo-focus': f } as CSSProperties) : undefined}>
          <img {...img} alt={asMedia(tab.image)?.alt ?? ''} loading="lazy" />
        </figure>
      )}
    </div>
  )
}
