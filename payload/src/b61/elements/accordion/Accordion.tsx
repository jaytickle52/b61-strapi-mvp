import { b61Converters } from '../../kit/render/converters'
import type { CSSProperties } from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { resolveHeadingLevel } from '../../kit/groups'
import { BandHead, Buttons, eruleClass, revealAttr } from '../../kit/render/parts'
import AccordionInit from './AccordionInit'
import JsonLd from '@/seo/JsonLd'
import { faqSchema } from '@/seo/schema'
import { headingText } from '../../kit/heading'

const NEXT: Record<string, string> = { h1: 'h2', h2: 'h3', h3: 'h4', h4: 'h5' }

/* Ported from elements/Sport_Accordion/html.twig (plugin 1.77.1). */
export default function B61Accordion({ block, index = 0 }: { block: any; index?: number }) {
  const ri = revealAttr(block.entrance)
  const rv = block.entrance === 'off' ? 'off' : 'on'
  const as = resolveHeadingLevel(block.headingLevel, index)
  const ItemH = NEXT[as] as 'h3'
  const surface = block.surface ?? 'none'
  const istyle = block.itemStyle ?? 'divided'
  const icon = block.iconStyle ?? 'chevron'
  const isurf = block.itemSurface ?? 'card'
  const shownum = block.showNumbers !== false
  const openFirst = block.firstItemOpen !== false
  const id = `b61-acc-${block.id ?? index}`
  const title = headingText(block.heading)
  const Wrap = title ? 'section' : 'div'
  const wStep = block.widthStep ? Math.min(Math.max(Math.round(block.widthStep), 1), 7) : null
  const items = (block.items ?? []).filter((i: any) => i?.title)
  const faq = block.faq ? faqSchema(items) : null
  return (
    <div className={['b61-acc', eruleClass(block.eyebrowRule)].filter(Boolean).join(' ')}>
      {faq && <JsonLd data={faq} />}
      <Wrap
        className={[
          'b61-acc__region',
          `b61-surface--${surface}`,
          surface !== 'none' && `b61-band--${surface}`,
          `b61-acc__region--style-${istyle}`,
          `b61-acc__region--icon-${icon}`,
          'b61-acc__region--wnarrow',
          `b61-acc__region--pt-${block.padTop ?? 'normal'}`,
          `b61-acc__region--pb-${block.padBottom ?? 'normal'}`,
        ]
          .filter(Boolean)
          .join(' ')}
        style={wStep ? ({ '--acc-measure': `var(--b61-box-${wStep})` } as CSSProperties) : undefined}
        data-b61-reveal={rv}
        {...(title ? { 'aria-labelledby': `${id}-heading` } : {})}
      >
        <BandHead block={block} prefix="b61-acc" as={as} headingId={`${id}-heading`} ri={ri} headClass={`b61-halign-${block.headingAlign ?? 'left'}`} />
        {items.length > 0 && (
          <div className="b61-acc__list">
            {items.map((item: any, i: number) => {
              const open = openFirst && i === 0
              return (
                <div key={item.id ?? i} className={`b61-acc__item${istyle !== 'divided' ? ` b61-acc__item--surf-${isurf}` : ''}${open ? ' is-open' : ''}`} {...ri}>
                  <ItemH className="b61-acc__itemhead">
                    <button type="button" id={`${id}-head-${i + 1}`} aria-expanded={open} aria-controls={`${id}-panel-${i + 1}`} className="b61-acc__toggle js-b61-acc-toggle">
                      {shownum && (
                        <span className="b61-acc__idx" aria-hidden="true">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      )}
                      <span className="b61-acc__title">{item.title}</span>
                      {item.subtitle && <span className="b61-acc__tag">{item.subtitle}</span>}
                      <span className="b61-acc__icon" aria-hidden="true">
                        {icon === 'plusminus' ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M5 12h14" /><path className="b61-acc__icon-v" d="M12 5v14" /></svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                        )}
                      </span>
                    </button>
                  </ItemH>
                  <div role="region" aria-labelledby={`${id}-head-${i + 1}`} id={`${id}-panel-${i + 1}`} className="b61-acc__panel">
                    <div className="b61-acc__panel-inner">
                      <div className="b61-acc__panel-body">
                        <div className="breakdance-rich-text-styles">{item.body && <RichText data={item.body as SerializedEditorState} disableContainer converters={b61Converters} />}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        <Buttons buttons={block.buttons ?? []} className="b61-acc__actions b61-btn-group" ri={ri} />
        <noscript>
          <style>{'.b61-acc__panel{grid-template-rows:1fr;visibility:visible}.b61-acc__panel .b61-acc__panel-body{opacity:1;translate:none}'}</style>
        </noscript>
      </Wrap>
      <AccordionInit single={block.singleOpen !== false} openFirst={openFirst} />
    </div>
  )
}
