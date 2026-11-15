import type { CSSProperties } from 'react'
import type { Page } from '@/payload-types'
import { asMedia, focusOf, imgProps } from '../../lib/media'
import { resolveHeadingLevel } from '../../kit/groups'
import { Buttons, ContentBlocks, HeadingLines, revealAttr } from '../../kit/render/parts'
import { fromBody } from '../../kit/body'
import LiteVideo from '../../kit/render/LiteVideo'
import { parseVideo } from '../../kit/video'

export type SplitBlock = Extract<NonNullable<Page['sections']>[number], { blockType: 'b61Split' }>

const SIZES = '(max-width: 900px) 100vw, 640px'

/*
 * B61 Split markup, ported from elements/Split/html.twig (plugin 1.77.1).
 * Same classes and structure, so the plugin's stylesheet styles it unchanged.
 */
export default function B61Split({ block, index = 0 }: { block: SplitBlock; index?: number }) {
  const ri = revealAttr(block.entrance)
  const rv = block.entrance === 'off' ? 'off' : 'on'
  const Heading = resolveHeadingLevel(block.headingLevel, index)
  const pt = block.padTop ?? 'normal'
  const pb = block.padBottom ?? 'normal'
  const surface = block.surface ?? 'none'
  const media = block.media ?? 'photo'
  const shape = block.imageShape ?? 'fixed'
  const cols = block.columns ?? '2'

  const gallery = (block.images ?? []).filter((i) => asMedia(i?.image)?.url)
  const video = media === 'video' && parseVideo(block.video) ? block.video! : null
  const single = media === 'photo' ? imgProps(block.image, SIZES) : null
  const hasMedia = media === 'video' ? Boolean(video) : media === 'gallery' ? gallery.length > 0 : Boolean(single)

  const overlap = Boolean(block.overlap) && hasMedia
  const panelChoice = block.textPanel ?? 'none'
  // An overlapping text column needs a card behind it to stay readable.
  const panel = overlap && panelChoice === 'none' ? 'plain' : panelChoice
  const panelled = panel !== 'none'
  const colHeight = block.columnHeight === 'fill' && hasMedia ? 'fill' : 'fit'
  const lines = (block.lines ?? []).filter((l) => l?.text)
  const hasHeading = lines.length > 0
  const headingId = `b61-split-${block.id ?? index}-heading`
  const Wrap = hasHeading ? 'section' : 'div'

  const side = block.imageSide ?? 'right'
  const bStep = block.columnBalance ? Math.min(Math.max(Math.round(block.columnBalance), 1), 7) : null
  const rootClass = [
    'b61-split',
    `b61-split--side-${side}`,
    block.stackOrder === 'media' && 'b61-split--stack-media',
    `b61-split--ha-${block.headingAlign ?? 'left'}`,
    block.eyebrowRule && block.eyebrowRule !== 'site' && `b61-erule-${block.eyebrowRule}`,
  ]
    .filter(Boolean)
    .join(' ')
  const rootStyle = bStep ? ({ '--b61-split-balance': `var(--b61-balance-${bStep})` } as CSSProperties) : undefined

  const frameKind = media === 'video' ? 'video' : media === 'gallery' ? 'grid' : 'single'
  const focus = media === 'photo' ? focusOf(block.image) : undefined

  return (
    <div className={rootClass} style={rootStyle}>
      <Wrap
        className={[
          'b61-split__region',
          `b61-surface--${surface}`,
          surface !== 'none' && `b61-band--${surface}`,
          `b61-split__region--shape-${shape}`,
          `b61-split__region--cols${cols}`,
          `b61-split__region--pt-${pt}`,
          `b61-split__region--pb-${pb}`,
        ]
          .filter(Boolean)
          .join(' ')}
        data-b61-reveal={rv}
        {...(hasHeading ? { 'aria-labelledby': headingId } : {})}
      >
        <div
          className={[
            'b61-split__inner',
            !hasMedia && 'b61-split__inner--nomedia',
            panelled && 'b61-split__inner--panel',
            overlap && 'b61-split__inner--overlap',
            `b61-split__inner--h${colHeight}`,
            'b61-split--half',
            `b61-split--img-${side}`,
            `b61-split--v${block.verticalPosition ?? 'center'}`,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <div className={`b61-split__text${panelled ? ` b61-surface--${panel} b61-band--${panel} b61-card` : ''}`}>
            {block.eyebrow && (
              <span className="b61-split__eyebrow b61-block" {...ri}>
                {block.eyebrow}
              </span>
            )}
            <HeadingLines as={Heading} id={headingId} className="b61-split__heading" lineClass="b61-split__heading-line" lines={lines} ri={ri} />
            {(block.subheads ?? [])
              .filter((s) => s?.text)
              .map((s, i) => (
                <p key={s.id ?? i} className="b61-split__subhead b61-block" {...ri}>
                  {s.text}
                </p>
              ))}
            <ContentBlocks blocks={fromBody(block.body)} prefix="b61-split" ri={ri} />
            <Buttons buttons={block.buttons as any} ri={ri} />
          </div>

          {hasMedia && (
            <div className="b61-split__media" {...ri}>
              <div className={`b61-split__frame b61-split__frame--${block.frameColor ?? 'primary'}`}>
                <div className={`b61-split__frame-media b61-split__frame-media--${frameKind}`}>
                  {frameKind === 'video' && video ? (
                    <div className="b61-split__video">
                      <LiteVideo url={video} title={lines.map((l) => l.text).join(' ') || 'Video'} />
                    </div>
                  ) : frameKind === 'grid' ? (
                    <div className="b61-split__grid">
                      {gallery.map((g, i) => (
                        <figure key={g.id ?? i} className="b61-split__item">
                          <img {...imgProps(g.image, SIZES)!} alt={asMedia(g.image)?.alt ?? ''} loading="lazy" />
                          {g.caption && <figcaption className="b61-split__caption">{g.caption}</figcaption>}
                        </figure>
                      ))}
                    </div>
                  ) : single ? (
                    <figure className="b61-split__item b61-split__item--single" style={focus ? ({ '--b61-photo-focus': focus } as CSSProperties) : undefined}>
                      <img {...single} alt={asMedia(block.image)?.alt ?? ''} loading="lazy" />
                      {block.caption && <figcaption className="b61-split__caption">{block.caption}</figcaption>}
                    </figure>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>
      </Wrap>
    </div>
  )
}
