import type { CSSProperties } from 'react'
import type { Page } from '@/payload-types'
import { asMedia, focusOf, imgProps } from '../../lib/media'
import { resolveHeadingLevel } from '../../kit/groups'
import { Buttons, ContentBlocks, HeadingLines, revealAttr } from '../../kit/render/parts'
import { fromBody } from '../../kit/body'
import LiteVideo from '../../kit/render/LiteVideo'
import { parseVideo } from '../../kit/video'
import { headingText } from '../../kit/heading'
import { anchorAttr } from '../../kit/render/anchor'

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

  const gallery = (block.images ?? []).filter((i) => asMedia(i?.image)?.url)
  const video = media === 'video' && parseVideo(block.video) ? block.video! : null
  const single = media === 'photo' ? imgProps(block.image, SIZES) : null
  const hasMedia = media === 'video' ? Boolean(video) : media === 'gallery' ? gallery.length > 0 : Boolean(single)

  // Overlap only in Fit content: matched to the image, the card would cover it whole.
  const overlap = Boolean(block.overlap) && hasMedia && block.columnHeight !== 'fill'
  const panelChoice = block.textPanel ?? 'none'
  // An overlapping text column needs a card behind it to stay readable.
  const panel = overlap && panelChoice === 'none' ? 'plain' : panelChoice
  const panelled = panel !== 'none'
  const colHeight = block.columnHeight === 'fill' && hasMedia ? 'fill' : 'fit'
  const title = headingText(block.heading)
  const hasHeading = Boolean(title)
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
  // A seal or award on the photo's outer corner (away from the text).
  const badge = imgProps((block as any).badge, '160px')

  return (
    <div {...anchorAttr(block)} className={rootClass} style={rootStyle}>
      <Wrap
        className={[
          'b61-split__region',
          `b61-surface--${surface}`,
          surface !== 'none' && `b61-band--${surface}`,
          `b61-split__region--shape-${shape}`,
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
            badge && hasMedia && 'b61-split__inner--badge',
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
            <HeadingLines as={Heading} id={headingId} className="b61-split__heading" lineClass="b61-split__heading-line" heading={block.heading} ri={ri} />
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
                      <LiteVideo url={video} title={title || 'Video'} />
                    </div>
                  ) : frameKind === 'grid' ? (
                    <SplitGallery items={gallery} layout={(block as any).galleryLayout ?? 'grid'} label={title} />
                  ) : single ? (
                    <figure className="b61-split__item b61-split__item--single" style={focus ? ({ '--b61-photo-focus': focus } as CSSProperties) : undefined}>
                      <img {...single} alt={asMedia(block.image)?.alt ?? ''} loading="lazy" />
                      {block.caption && <figcaption className="b61-split__caption">{block.caption}</figcaption>}
                    </figure>
                  ) : null}
                </div>
              </div>
              {badge && <img className="b61-split__badge" {...badge} alt={asMedia(block.badge as any)?.alt ?? ''} loading="lazy" />}
            </div>
          )}
        </div>
      </Wrap>
    </div>
  )
}

type GalleryItem = { id?: string | null; image?: unknown; caption?: string | null }

/*
 * The Split's gallery, arranged for however many photos there are (Jay, 19 Nov
 * 2026: no column count, so a fourth photo just fits).
 * - Grid: 1 photo fills the column, 2-4 sit two across, 5+ three across. A
 *   short last row stretches its last photo, so there is never a hole.
 * - Masonry: photos keep their own shapes, in two columns (three from 7),
 *   each photo going to the shorter column.
 * - Strip: one row that scrolls sideways.
 * With "Text column height: Match the image" the gallery fills the frame to
 * the text's height (CSS: .b61-split__inner--hfill), photos cropped to fit;
 * --b61-split-gal-min keeps it from getting too short.
 */
function SplitGallery({ items, layout, label }: { items: GalleryItem[]; layout: string; label: string }) {
  const n = items.length
  const fig = (g: GalleryItem, i: number, extra?: { className?: string; style?: CSSProperties }) => {
    const m = asMedia(g.image as any)
    return (
      <figure key={g.id ?? i} className={`b61-split__item${extra?.className ? ` ${extra.className}` : ''}`} style={extra?.style}>
        <img {...imgProps(g.image as any, SIZES)!} alt={m?.alt ?? ''} loading="lazy" style={focusOf(g.image as any) ? { objectPosition: focusOf(g.image as any) } : undefined} />
        {g.caption && <figcaption className="b61-split__caption">{g.caption}</figcaption>}
      </figure>
    )
  }
  const ratio = (g: GalleryItem) => {
    const m = asMedia(g.image as any)
    return m?.width && m?.height ? m.height / m.width : 0.75
  }

  if (layout === 'masonry') {
    const cols = n <= 1 ? 1 : n <= 6 ? 2 : 3
    const columns: { items: [GalleryItem, number][]; h: number }[] = Array.from({ length: cols }, () => ({ items: [], h: 0 }))
    items.forEach((g, i) => {
      const shortest = columns.reduce((a, b) => (b.h < a.h ? b : a))
      shortest.items.push([g, i])
      shortest.h += ratio(g)
    })
    const most = Math.max(...columns.map((c) => c.items.length))
    return (
      <div className="b61-split__gal b61-split__masonry" style={{ '--b61-split-gal-cols': cols, '--b61-split-gal-min': `${Math.max(most, 2) * 130}px` } as CSSProperties}>
        {columns.map((c, ci) => (
          <div key={ci} className="b61-split__mcol">
            {c.items.map(([g, i]) => fig(g, i, { style: { flexGrow: Number(ratio(g).toFixed(3)) } }))}
          </div>
        ))}
      </div>
    )
  }

  if (layout === 'strip') {
    return (
      <div className="b61-split__gal b61-split__strip" tabIndex={0} role="region" aria-label={`${label || 'Photo'} gallery, scrolls sideways`}>
        {items.map((g, i) => {
          const m = asMedia(g.image as any)
          return fig(g, i, { style: m?.width && m?.height ? ({ '--b61-split-ar': `${m.width} / ${m.height}` } as CSSProperties) : undefined })
        })}
      </div>
    )
  }

  const cols = n <= 1 ? 1 : n <= 4 ? 2 : 3
  const rows = Math.ceil(n / cols)
  const short = n % cols
  return (
    <div
      className="b61-split__gal b61-split__grid"
      style={{ '--b61-split-cols': cols, '--b61-split-gal-min': rows === 1 ? 'var(--b61-split-photo-height)' : `${rows * 170}px` } as CSSProperties}
    >
      {items.map((g, i) => {
        // The last photo of a short last row takes the rest of the row.
        const span = short && i === n - 1 ? cols - short + 1 : 1
        // With other photos beside it, it takes their height; alone, it keeps the shape.
        return fig(g, i, span > 1 ? { className: `b61-split__item--span${span}${short > 1 ? ' b61-split__item--fillrow' : ''}`, style: { gridColumn: `span ${span}` } } : undefined)
      })}
    </div>
  )
}
