import type { CSSProperties } from 'react'
import type { Page } from '@/payload-types'
import { asMedia, focusOf, imgProps } from '../../lib/media'
import { resolveHeadingLevel } from '../../kit/groups'
import { BandHead, Buttons, eruleClass, revealAttr } from '../../kit/render/parts'
import LiteVideo from '../../kit/render/LiteVideo'
import { parseVideo } from '../../kit/video'
import GalleryInit from './GalleryInit'
import { headingText } from '../../kit/heading'
import { anchorAttr } from '../../kit/render/anchor'

export type GalleryBlock = Extract<NonNullable<Page['sections']>[number], { blockType: 'b61Gallery' }>

const SIZES: Record<string, string> = {
  '2': '(max-width: 600px) 92vw, (max-width: 1024px) 46vw, 620px',
  '3': '(max-width: 600px) 92vw, (max-width: 1024px) 46vw, 420px',
  '4': '(max-width: 600px) 92vw, (max-width: 1024px) 46vw, 320px',
}

/* Ported from elements/Gallery/html.twig (plugin 1.77.1). */
export default function B61Gallery({ block, index = 0 }: { block: GalleryBlock; index?: number }) {
  const ri = revealAttr(block.entrance)
  const rv = block.entrance === 'off' ? 'off' : 'on'
  const as = resolveHeadingLevel(block.headingLevel, index)
  const surface = block.surface ?? 'none'
  const kind = block.media ?? 'gallery'
  const media = kind === 'video' ? 'video' : 'image'
  const imode = kind === 'photo' ? 'single' : 'gallery'
  const mode = block.galleryLayout ?? 'strip'
  const cols = block.columns ?? '3'
  const shape = block.imageShape ?? 'fixed'
  const isStrip = media === 'image' && imode === 'gallery' && mode === 'strip'
  const beside = block.textPosition === 'beside' && !isStrip
  const title = headingText(block.heading)
  const hasHeading = Boolean(title)
  const headingId = `b61-gallery-${block.id ?? index}-heading`
  const Wrap = hasHeading ? 'section' : 'div'
  const head = BandHead({ block, prefix: 'b61-gallery', as, headingId, ri, wrap: false })
  const bStep = beside && block.balanceStep ? Math.min(Math.max(Math.round(block.balanceStep), 1), 7) : null
  const images = (block.images ?? []).filter((i) => asMedia(i?.image)?.url)
  const video = media === 'video' && parseVideo(block.video) ? block.video! : null
  const one = imode === 'single' ? imgProps(block.image, SIZES[cols]) : null
  const lazy = mode !== 'masonry'

  const body = (
    <>
      {(head || isStrip) && (
        <div className="b61-gallery__head">
          <div className={`b61-gallery__headtext b61-halign-${block.headingAlign ?? 'left'}`}>{head}</div>
          {isStrip && (
            <div className="b61-gallery__nav">
              {block.scrollHint && <span className="b61-gallery__hint">{block.scrollHint}</span>}
              <button type="button" className="b61-gallery__arrow js-b61-gal-prev" aria-label="Previous photos">
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="M15 5 8 12l7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button type="button" className="b61-gallery__arrow js-b61-gal-next" aria-label="Next photos">
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
          )}
        </div>
      )}
      {media === 'video' ? (
        video && (
          <div className="b61-gallery__media b61-gallery__video">
            <LiteVideo url={video} title={title || 'Video'} />
          </div>
        )
      ) : imode === 'single' ? (
        one && (
          <div className="b61-gallery__media">
            <figure className="b61-gallery__item b61-gallery__item--single" {...ri} style={focusOf(block.image) ? ({ '--b61-photo-focus': focusOf(block.image) } as CSSProperties) : undefined}>
              <img {...one} alt={asMedia(block.image)?.alt ?? ''} loading="lazy" />
              {block.caption && <figcaption className="b61-gallery__caption">{block.caption}</figcaption>}
            </figure>
          </div>
        )
      ) : (
        images.length > 0 && (
          <div className="b61-gallery__media">
            <div
              className={`b61-gallery__strip js-b61-gal-strip${mode === 'masonry' ? ' js-b61-gal-masonry' : ''}`}
              {...ri}
              // A scrolling strip must take keyboard focus so arrow keys can scroll it (WCAG 2.1.1).
              {...(mode === 'strip' ? { tabIndex: 0, role: 'region', 'aria-label': `${title || 'Photo'} gallery, scrolls sideways` } : {})}
            >
              {images.map((it, i) => {
                const f = focusOf(it.image)
                return (
                  <figure key={it.id ?? i} className="b61-gallery__item" style={f ? ({ '--b61-photo-focus': f } as CSSProperties) : undefined}>
                    <img {...imgProps(it.image, SIZES[cols])!} alt={asMedia(it.image)?.alt ?? ''} {...(lazy ? { loading: 'lazy' as const } : {})} decoding="async" />
                    {it.caption && <figcaption className="b61-gallery__caption">{it.caption}</figcaption>}
                  </figure>
                )
              })}
            </div>
          </div>
        )
      )}
    </>
  )

  return (
    <div {...anchorAttr(block)} className={['b61-gallery', eruleClass(block.eyebrowRule)].filter(Boolean).join(' ')}>
      <Wrap
        className={[
          'b61-gallery__region',
          `b61-surface--${surface}`,
          surface !== 'none' && `b61-band--${surface}`,
          `b61-gallery__region--media-${media}`,
          `b61-gallery__region--imode-${imode}`,
          `b61-gallery__region--mode-${mode}`,
          `b61-gallery__region--size-${block.itemSize ?? 'medium'}`,
          `b61-gallery__region--shape-${shape}`,
          `b61-gallery__region--cols${cols}`,
          `b61-gallery__region--text-${beside ? 'beside' : 'above'}`,
          'b61-gallery__region--ratio-even',
          `b61-gallery__region--pt-${block.padTop ?? 'normal'}`,
          `b61-gallery__region--pb-${block.padBottom ?? 'normal'}`,
          (block as any).duotone && media === 'image' && 'b61-gallery__region--duotone b61-duotone--light',
        ]
          .filter(Boolean)
          .join(' ')}
        style={bStep ? ({ '--b61-gal-bstep': `var(--b61-balance-${bStep})` } as CSSProperties) : undefined}
        data-b61-reveal={rv}
        {...(hasHeading ? { 'aria-labelledby': headingId } : {})}
      >
        {beside ? <div className={`b61-gallery__cols${bStep ? ' b61-gallery__cols--bstep' : ''}`}>{body}</div> : body}
        <Buttons buttons={(block.buttons ?? []) as any} className="b61-gallery__actions b61-btn-group" ri={ri} />
      </Wrap>
      {media === 'image' && imode === 'gallery' && <GalleryInit />}
    </div>
  )
}
