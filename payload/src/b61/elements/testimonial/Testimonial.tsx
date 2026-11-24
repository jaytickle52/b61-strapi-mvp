import type { CSSProperties } from 'react'
import type { Page } from '@/payload-types'
import { imgProps } from '../../lib/media'
import { eruleClass, revealAttr } from '../../kit/render/parts'
import { anchorAttr } from '../../kit/render/anchor'

export type TestimonialBlock = Extract<NonNullable<Page['sections']>[number], { blockType: 'b61Testimonial' }>

/* Ported from elements/Testimonial/html.twig (plugin 1.77.1). */
export default function B61Testimonial({ block }: { block: TestimonialBlock; index?: number }) {
  const ri = revealAttr(block.entrance)
  const rv = block.entrance === 'off' ? 'off' : 'on'
  const ta = block.textAlign === 'left' ? 'left' : 'center'
  const surface = block.surface ?? 'none'
  const mark = block.showMark !== false
  const wStep = block.widthStep ? Math.min(Math.max(Math.round(block.widthStep), 1), 7) : null
  const wm = imgProps(block.watermark, '600px')
  const attribution = (block.attribution ?? '').trim()
  return (
    <div {...anchorAttr(block)} className={['b61-quote', `b61-palign-${ta}`, eruleClass(block.eyebrowRule)].filter(Boolean).join(' ')}>
      <div
        className={[
          'b61-quote__region',
          `b61-surface--${surface}`,
          surface !== 'none' && `b61-band--${surface}`,
          'b61-quote__region--wnarrow',
          `b61-quote__region--a${ta}`,
          `b61-quote__region--pt-${block.padTop ?? 'normal'}`,
          `b61-quote__region--pb-${block.padBottom ?? 'normal'}`,
          block.textStyle === 'normal' && 'b61-quote__region--upright',
          mark && block.markRoom && 'b61-quote__region--mark-room',
        ]
          .filter(Boolean)
          .join(' ')}
        style={wStep ? ({ '--quote-measure': `var(--b61-box-${wStep})` } as CSSProperties) : undefined}
        data-b61-reveal={rv}
      >
        {wm && (
          <div className="b61-quote__watermark" aria-hidden="true">
            <img {...wm} alt="" loading="lazy" />
          </div>
        )}
        <div className="b61-quote__inner">
          {mark && (
            <span className="b61-quote__mark" {...ri} aria-hidden="true">
              &ldquo;
            </span>
          )}
          {block.eyebrow && (
            <span className="b61-quote__eyebrow" {...ri}>
              {block.eyebrow}
            </span>
          )}
          {block.quote && (
            <figure className="b61-quote__figure">
              <blockquote className="b61-quote__text" {...ri}>
                {block.quote}
              </blockquote>
              {attribution && (
                <figcaption className="b61-quote__cite" {...ri}>
                  {attribution}
                </figcaption>
              )}
            </figure>
          )}
        </div>
      </div>
    </div>
  )
}
