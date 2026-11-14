import { Fragment, type CSSProperties } from 'react'
import type { Page } from '@/payload-types'
import { asMedia, focusOf, imgProps, resolveLink } from '../../lib/media'
import HeroBehavior from './HeroBehavior'
import { resolveHeadingLevel } from '../../kit/groups'

export type HeroBlock = Extract<NonNullable<Page['sections']>[number], { blockType: 'b61Hero' }>

/*
 * B61 Hero markup, ported from elements/Hero/html.twig (plugin 1.77.1).
 * Same class names, same structure, same accessibility decisions, so the
 * plugin's own stylesheet (hero.css, copied unchanged) styles it.
 */
export default function B61Hero({ block, index = 0 }: { block: HeroBlock; index?: number }) {
  const mode = block.layoutMode === 'band' ? 'band' : 'cover'
  const bgtype = block.backgroundType ?? 'image'
  const overlay = block.overlay ?? 'gradient'
  const surface = block.surface ?? 'primary'
  // Overlay + surface resolve to ONE scheme, which carries its text colours.
  const scheme = mode === 'band' ? surface : overlay === 'gradient' ? 'gradient' : surface
  const ovop = block.overlayStrength ? Math.min(Math.max(Math.round(block.overlayStrength), 80), 100) : null
  const valign = mode === 'band' ? 'center' : (block.verticalPosition ?? 'bottom')
  const talign = block.textAlign ?? 'left'
  const pt = block.padTop ?? 'normal'
  const pb = block.padBottom ?? 'normal'
  const rv = block.entrance === 'off' ? 'off' : 'on'
  const ri = rv === 'on' ? { 'data-b61-reveal-item': '' } : {}
  const Heading = resolveHeadingLevel(block.headingLevel, index)

  const lines = (block.lines ?? []).filter((l) => l?.text)
  const introStyle = block.subheadlineScale ?? 'body'
  const metaItems = introStyle === 'meta' ? (block.metaItems ?? []).map((m) => m?.text).filter(Boolean) : []
  const intro = introStyle === 'meta' ? '' : (block.subheadline ?? '')
  const buttons = (block.buttons ?? []).filter((b) => b?.label)

  const video = asMedia(block.video)
  const videoWebm = asMedia(block.videoWebm)
  const poster = asMedia(block.poster)
  const slides = (block.slides ?? []).map((s) => s?.image).filter((m) => asMedia(m)?.url)
  const collage = (block.collage ?? []).map((c) => c?.image).filter((m) => asMedia(m)?.url).slice(0, 3)
  const bgImage = imgProps(block.image)

  const hasMotion = (bgtype === 'video' && video?.url) || (bgtype === 'slideshow' && slides.length > 0)
  const hasMedia =
    mode === 'band'
      ? collage.length > 0
      : bgtype === 'video'
        ? Boolean(video?.url || poster?.url)
        : bgtype === 'slideshow'
          ? slides.length > 0
          : Boolean(bgImage)

  // Per-instance rules (css.twig in the plugin) become modifier classes.
  const iStep = block.subheadlineWidth ? Math.min(Math.max(Math.round(block.subheadlineWidth), 1), 7) : null
  const bStep = mode === 'band' && block.columnBalance ? Math.min(Math.max(Math.round(block.columnBalance), 1), 7) : null
  const rootClass = [
    'b61-hero',
    `b61-hero--${mode}`,
    !hasMedia && 'b61-hero--no-media',
    hasMedia && mode === 'band' && `b61-hero--band-${block.bandSize === 'compact' ? 'compact' : 'standard'}`,
    hasMedia && mode === 'cover' && `b61-hero--h-${block.height ?? 'tall'}`,
    `b61-hero--ta-${talign}`,
    block.eyebrowRule && block.eyebrowRule !== 'site' && `b61-hero--rule-${block.eyebrowRule}`,
    iStep && 'b61-hero--istep',
    bStep && 'b61-hero--bstep',
  ]
    .filter(Boolean)
    .join(' ')
  const rootStyle = {
    ...(iStep ? { '--b61-hero-istep': `var(--b61-subhead-step-${iStep})` } : {}),
    ...(bStep ? { '--b61-hero-bstep': `var(--b61-balance-${bStep})` } : {}),
  } as CSSProperties

  // The region is named by its heading, so it is a real landmark; without a
  // heading there is nothing to name it by, and it stays a div.
  const headingId = `b61-hero-${block.id ?? index}-title`
  const Root = lines.length > 0 ? 'section' : 'div'
  const isFirst = index === 0

  const bgStyle: CSSProperties = {}
  const focus = bgtype === 'image' ? focusOf(block.image) : undefined
  if (focus) (bgStyle as any)['--b61-photo-focus'] = focus
  if (bgtype === 'video' && poster?.url) {
    bgStyle.backgroundImage = `url("${encodeURI(poster.url)}")`
    bgStyle.backgroundSize = 'cover'
    bgStyle.backgroundPosition = 'center'
  }

  const innerClass = [
    'b61-hero__inner',
    `b61-hero__inner--pt-${pt}`,
    `b61-hero__inner--pb-${pb}`,
    `b61-hero__inner--${mode}`,
    `b61-hero__inner--v${valign}`,
    `b61-hero__inner--t${talign}`,
    `b61-hero__inner--on-${scheme}`,
    mode === 'band' && `b61-hero__band--${surface}`,
    mode === 'band' && block.bandSize === 'compact' && 'b61-hero__inner--band-compact',
  ]
    .filter(Boolean)
    .join(' ')

  const text = (
    <>
      {block.eyebrow && (
        <span className="b61-hero__eyebrow" {...ri}>
          <span className="b61-hero__eyebrow-rule" aria-hidden="true" />
          <span className="b61-hero__eyebrow-text">{block.eyebrow}</span>
        </span>
      )}

      {lines.length > 0 && (
        <Heading className="b61-hero__title" id={headingId}>
          {lines.map((l, i) => (
            <Fragment key={l.id ?? i}>
              {/* A real space between lines keeps the accessible name readable:
                  "Headline here, emphasised there", not "Headline here,emphasised there". */}
              {i > 0 && ' '}
              <span className={`b61-hero__title-line${l.emphasize ? ' b61-hero__title-line--em' : ''}`} {...ri}>
                {l.text}
              </span>
            </Fragment>
          ))}
        </Heading>
      )}

      {introStyle === 'meta' ? (
        metaItems.length > 0 && (
          <ul className="b61-hero__meta" {...ri}>
            {metaItems.map((m, i) => (
              <li key={i} className="b61-hero__meta-item">
                {m}
              </li>
            ))}
          </ul>
        )
      ) : (
        intro && (
          <div className={`b61-hero__subhead${introStyle === 'display' ? ' b61-hero__subhead--display' : ''}`} {...ri}>
            {intro}
          </div>
        )
      )}

      {buttons.length > 0 && (
        <div className="b61-hero__actions" {...ri}>
          {buttons.map((b, i) => {
            const variant = b.variant ?? 'primary'
            const full = variant !== 'link' && b.fullWidth
            const cls = variant === 'link' ? 'b61-link' : `b61-btn b61-btn--${variant}${full ? ' b61-btn--block' : ''}`
            const { href, newTab } = resolveLink(b.link)
            return (
              <a
                key={b.id ?? i}
                className={cls}
                href={href ?? undefined}
                {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {b.label}
                {variant === 'link' && (
                  <span className="b61-link-arrow" aria-hidden="true">
                    &rarr;
                  </span>
                )}
              </a>
            )
          })}
        </div>
      )}
    </>
  )

  return (
    <Root className={rootClass} style={rootStyle} data-b61-hero="" {...(Root === 'section' ? { 'aria-labelledby': headingId } : {})}>
      {mode !== 'band' && (
        <>
          <div className={`b61-hero__bg b61-hero__bg--${bgtype}`} aria-hidden="true" style={bgStyle}>
            {bgtype === 'video' && video?.url ? (
              <video className="b61-hero__video" autoPlay muted loop playsInline preload="metadata" poster={poster?.url ?? undefined}>
                {videoWebm?.url && <source src={videoWebm.url} type="video/webm" />}
                <source src={video.url} type={video.mimeType ?? undefined} />
              </video>
            ) : bgtype === 'slideshow' && slides.length > 0 ? (
              slides.map((s, i) => {
                const p = imgProps(s)!
                return (
                  <img
                    key={i}
                    className="b61-hero__slide"
                    {...p}
                    alt=""
                    {...(i === 0 ? { fetchPriority: isFirst ? ('high' as const) : undefined } : { loading: 'lazy' as const })}
                    style={{ animationDuration: `${slides.length * 7}s`, animationDelay: `${i * 7}s` }}
                  />
                )
              })
            ) : bgtype === 'image' && bgImage ? (
              <img {...bgImage} alt="" {...(isFirst ? { fetchPriority: 'high' as const } : { loading: 'lazy' as const })} />
            ) : null}
          </div>
          {hasMotion && (
            <button type="button" className="b61-hero__motion js-b61-hero-motion" aria-pressed="false" aria-label="Pause background motion" hidden>
              <span className="b61-hero__motion-icon" aria-hidden="true" />
            </button>
          )}
          <div
            className={`b61-hero__scrim b61-hero__scrim--${scheme} b61-hero__scrim--at-v${valign} b61-hero__scrim--at-h${talign}`}
            aria-hidden="true"
            style={ovop ? { opacity: ovop / 100 } : undefined}
          />
        </>
      )}

      <div data-b61-reveal={rv} className={innerClass}>
        {mode === 'band' ? (
          <div className={`b61-hero__grid${collage.length === 0 ? ' b61-hero__grid--text-only' : ''}`}>
            <div className="b61-hero__text">{text}</div>
            {collage.length > 0 && (
              <div className={`b61-hero__collage b61-hero__collage--n${collage.length}`}>
                {collage.map((img, i) => {
                  const media = asMedia(img)!
                  const f = focusOf(img)
                  return (
                    <figure key={i} className="b61-hero__fig" style={f ? ({ '--b61-photo-focus': f } as CSSProperties) : undefined}>
                      <div className="b61-hero__fig-frame">
                        <div className="b61-hero__fig-media">
                          <img {...imgProps(img, '(max-width: 900px) 50vw, 420px')!} alt={media.alt ?? ''} {...(i > 0 ? { loading: 'lazy' as const } : {})} />
                        </div>
                      </div>
                    </figure>
                  )
                })}
              </div>
            )}
          </div>
        ) : (
          text
        )}
      </div>
      <span className="b61-hero__edge" aria-hidden="true" />
      <HeroBehavior />
    </Root>
  )
}
