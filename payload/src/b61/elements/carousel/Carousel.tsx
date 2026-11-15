import type { CSSProperties } from 'react'
import { resolveHeadingLevel } from '../../kit/groups'
import { BandHead, eruleClass, revealAttr } from '../../kit/render/parts'
import Inner from '../../kit/render/Inner'
import CarouselInit from '../../kit/render/CarouselInit'

/* Ported from elements/Carousel/html.twig and elements/Carousel_Slide/html.twig (plugin 1.77.1). */
export default function B61Carousel({ block, index = 0, path }: { block: any; index?: number; path?: string }) {
  const ri = revealAttr(block.entrance)
  const rv = block.entrance === 'off' ? 'off' : 'on'
  const as = resolveHeadingLevel(block.headingLevel, index)
  const surface = block.surface ?? 'none'
  const pv = ['1', '2', '3', '4'].includes(block.perView) ? block.perView : '1'
  const advance = block.advance === 'view' ? 'view' : 'one'
  const peek = block.peek ?? 'medium'
  const cpos = block.controlsPosition ?? 'top-right'
  const showCount = block.showCounter !== false
  const showProg = block.showProgress !== false
  const uid = String(block.id ?? index)
  const id = `b61-car-${uid}`
  const lines = (block.lines ?? []).filter((l: any) => l?.text)
  const Wrap = lines.length ? 'section' : 'div'
  const head = BandHead({ block, prefix: 'b61-car', as, headingId: `${id}-heading`, ri, wrap: false, itemClass: 'b61-block' })
  const ha = block.headingAlign ?? 'left'

  const ctl = (
    <div className="b61-car__controls js-b61-car-controls" {...ri} hidden>
      {showProg && cpos !== 'sides' && (
        <span className="b61-car__progress" aria-hidden="true">
          <span className="b61-car__progress-fill js-b61-car-progress" />
        </span>
      )}
      {showCount && cpos !== 'sides' && (
        <span className="b61-car__count" aria-hidden="true">
          <span className="js-b61-car-now">01</span>
          <span className="b61-car__count-sep">/</span>
          <span className="js-b61-car-total">01</span>
        </span>
      )}
      <button type="button" className="b61-car__btn b61-car__btn--prev js-b61-car-prev" aria-label="Previous slide">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="M19 12H5M11 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <button type="button" className="b61-car__btn b61-car__btn--next js-b61-car-next" aria-label="Next slide">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
    </div>
  )
  const meta = (showProg || showCount) && (
    <div className="b61-car__controls b61-car__controls--meta js-b61-car-controls" {...ri} hidden>
      {showProg && (
        <span className="b61-car__progress" aria-hidden="true">
          <span className="b61-car__progress-fill js-b61-car-progress" />
        </span>
      )}
      {showCount && (
        <span className="b61-car__count" aria-hidden="true">
          <span className="js-b61-car-now">01</span>
          <span className="b61-car__count-sep">/</span>
          <span className="js-b61-car-total">01</span>
        </span>
      )}
    </div>
  )

  return (
    <div className={['b61-car', eruleClass(block.eyebrowRule)].filter(Boolean).join(' ')}>
      <Wrap
        className={[
          'b61-car__region js-b61-car',
          `b61-surface--${surface}`,
          surface !== 'none' && `b61-band--${surface}`,
          `b61-car__region--pt-${block.padTop ?? 'normal'}`,
          `b61-car__region--pb-${block.padBottom ?? 'normal'}`,
          `b61-car--ctl-${cpos}`,
        ]
          .filter(Boolean)
          .join(' ')}
        data-b61-reveal={rv}
        {...(lines.length ? { 'aria-labelledby': `${id}-heading` } : { 'data-b61-car-name': block.label || 'Carousel' })}
      >
        <div className="b61-car__inner">
          {(head || cpos === 'top-right') && (
            <div className="b61-car__head">
              <div className={`b61-car__head-text b61-halign-${ha} b61-headw-${ha}`}>{head}</div>
              {cpos === 'top-right' && ctl}
            </div>
          )}
          <div className="b61-car__viewport">
            <div
              className={`b61-car__track js-b61-car-track b61-car__track--pv${pv} b61-car__track--peek-${peek}`}
              style={{ '--b61-car-pv': pv } as CSSProperties}
              data-b61-car-advance={advance}
              data-b61-car-id={uid}
              tabIndex={0}
            >
              {(block.slides ?? []).map((s: any, i: number) => (
                <div key={s.id ?? i} className="b61-slide">
                  <div className="b61-slide__content" {...(s.label ? { 'data-b61-slide-label': s.label } : {})}>
                    <Inner blocks={s.content} path={path && `${path}.slides.${i}.content`} />
                  </div>
                </div>
              ))}
            </div>
            {cpos === 'sides' && ctl}
          </div>
          {['bottom-left', 'bottom-center', 'bottom-right'].includes(cpos) && ctl}
          {cpos === 'sides' && meta}
          <p className="b61-car__status js-b61-car-status" aria-live="polite" />
        </div>
        <CarouselInit />
      </Wrap>
    </div>
  )
}
