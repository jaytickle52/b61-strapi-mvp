import { b61Converters } from '../../kit/render/converters'
import type { CSSProperties, ReactNode } from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { Page } from '@/payload-types'
import { asMedia, focusOf, imgProps, resolveLink } from '../../lib/media'
import { resolveHeadingLevel } from '../../kit/groups'
import { Buttons, HeadingLines, revealAttr } from '../../kit/render/parts'
import { B61Icon } from '../../kit/render/icons'
import CarouselInit from '../../kit/render/CarouselInit'
import { formatDate, getEvents, getNews, getPrograms, getSettings, getStaff, eventWhen } from '@/lib/data'
import { schoolFacts } from '@/school/facts'

export type CardGridBlock = Extract<NonNullable<Page['sections']>[number], { blockType: 'b61CardGrid' }>

type Card = {
  key: string
  image?: unknown
  icon?: string | null
  eyebrow?: string | null
  title?: string | null
  body?: ReactNode
  href?: string | null
  newTab?: boolean
  linkText?: string | null
}

const SIZES: Record<string, string> = {
  '1': '(max-width: 600px) 92vw, 1200px',
  '2': '(max-width: 600px) 92vw, (max-width: 1024px) 46vw, 620px',
  '3': '(max-width: 600px) 92vw, (max-width: 1024px) 46vw, 420px',
  '4': '(max-width: 600px) 92vw, (max-width: 1024px) 46vw, 320px',
}

/** Cards written by hand, or pulled from Programs / Events / News / Staff. */
async function loadCards(block: CardGridBlock): Promise<Card[]> {
  const limit = block.limit ?? 3
  switch (block.source as string) {
    case 'programs':
      return (await getPrograms(limit)).map((p) => ({
        key: String(p.id), image: p.image, eyebrow: p.grades ? `Grades ${p.grades}` : null, title: p.name,
        body: p.summary ? <p>{p.summary}</p> : null, href: `/programs/${p.slug}`,
      }))
    case 'upcoming-events':
      return (await getEvents({ limit })).map((e) => ({
        key: String(e.id), image: e.image, eyebrow: eventWhen(e), title: e.title,
        body: e.summary ? <p>{e.summary}</p> : null, href: `/events/${e.slug}`,
      }))
    case 'latest-news':
      return (await getNews({ limit })).map((n) => ({
        key: String(n.id), image: n.image, eyebrow: formatDate(n.date), title: n.title,
        body: n.summary ? <p>{n.summary}</p> : null, href: `/news/${n.slug}`,
      }))
    case 'staff':
      return (await getStaff(limit)).map((s) => ({
        key: String(s.id), image: s.photo, eyebrow: s.role, title: s.name, body: s.bio ? <p>{s.bio}</p> : null, href: null,
      }))
    case 'school-facts':
      return (await schoolFacts(await getSettings())).map((f) => ({ key: f.key, eyebrow: f.label, title: f.value, href: f.href, newTab: Boolean(f.href) }))
    default:
      return (block.cards ?? []).map((c, i) => {
        const { href, newTab } = resolveLink(c.link as any)
        return {
          key: c.id ?? String(i), image: c.image, icon: c.icon, eyebrow: c.eyebrow, title: c.title,
          body: c.body ? <RichText data={c.body as SerializedEditorState} disableContainer converters={b61Converters} /> : null,
          href, newTab, linkText: c.linkText,
        }
      })
  }
}

/*
 * B61 Card Grid markup, ported from elements/Card_Grid/html.twig (plugin 1.77.1).
 * Same classes and structure, so the plugin's stylesheets style it unchanged.
 */
export default async function B61CardGrid({ block, index = 0 }: { block: CardGridBlock; index?: number }) {
  const cards = await loadCards(block)
  const ri = revealAttr(block.entrance)
  const rv = block.entrance === 'off' ? 'off' : 'on'
  const lines = (block.lines ?? []).filter((l) => l?.text)
  const hasHeading = lines.length > 0
  const Heading = resolveHeadingLevel(block.headingLevel, index)
  // Card titles sit one level under the grid's heading. With no heading they take
  // its level, but never H1: a page has one H1, and a row of them is not it.
  const CardHeading = (hasHeading ? ({ h1: 'h2', h2: 'h3', h3: 'h4', h4: 'h5' } as const)[Heading] : Heading === 'h1' ? 'h2' : Heading) as 'h2' | 'h3' | 'h4' | 'h5'
  const surface = block.surface ?? 'none'
  const mtype = block.mediaType ?? 'image'
  let cstyle = block.cardStyle ?? 'bordered'
  if (cstyle === 'overlay' && mtype !== 'image') cstyle = 'bordered'
  const ov = cstyle === 'overlay'
  const surfaced = cstyle === 'flat' || cstyle === 'bordered'
  const csurf = block.cardSurface ?? 'light'
  const mround = surfaced && mtype === 'image' && block.mediaRound
  const talign = block.textAlign ?? 'left'
  const ovl = block.cardOverlay ?? 'gradient'
  const pos = block.cardTextPosition ?? 'bottom'
  const shape = block.cardShape ?? 'portrait'
  const setRatio = mtype === 'image' && ((ov && shape === 'custom') || (!ov && block.imageShape === 'custom'))
  // Staff photos are portraits: a staff grid with the default fixed-height image
  // shows them upright (4:5) instead of cropping faces to a wide strip.
  const staffPortrait = mtype === 'image' && !ov && block.source === 'staff' && (block.imageShape ?? 'fixed') === 'fixed'
  const customRatio = setRatio || staffPortrait
  const rw = setRatio ? Math.min(Math.max(block.ratioW ?? 3, 0.1), 10000) : staffPortrait ? 4 : 3
  const rh = setRatio ? Math.min(Math.max(block.ratioH ?? 2, 0.1), 10000) : staffPortrait ? 5 : 2
  const isize = block.iconSize === 'md' || block.iconSize === 'lg' ? block.iconSize : 'sm'
  const pt = block.padTop ?? 'normal'
  const pb = block.padBottom ?? 'normal'
  const cols = block.columns ?? '3'
  const car = block.arrangement === 'carousel'
  const cpos = block.controlsPosition ?? 'top-right'
  const peek = block.peek ?? 'small'
  const showCount = Boolean(block.showCounter)
  const showProg = Boolean(block.showProgress)
  const headingId = `b61-cards-${block.id ?? index}-heading`
  // Banner 61 layout options (Design > Advanced).
  const bx = block as any
  const beside = Boolean(bx.headBeside)
  const stagger = !car && Boolean(bx.stagger) && cols !== '1'
  const bleed = car && beside && Boolean(bx.bleed)
  const reveal = ov && Boolean(bx.hoverReveal)
  const altTint = ov && Boolean(bx.altTint)
  const feature = !car && cols === '3' && Boolean(bx.featureMiddle)
  const duotone = Boolean(bx.duotone)
  const Wrap = hasHeading ? 'section' : 'div'

  const controls = car ? (
    <div className="b61-car__controls js-b61-car-controls" hidden>
      {showProg && cpos !== 'sides' && (
        <span className="b61-car__progress" aria-hidden="true">
          <span className="b61-car__progress-fill js-b61-car-progress" />
        </span>
      )}
      {showCount && cpos !== 'sides' && <Counter />}
      <button type="button" className="b61-car__btn b61-car__btn--prev js-b61-car-prev" aria-label="Previous cards">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
          <path d="M19 12H5M11 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button type="button" className="b61-car__btn b61-car__btn--next js-b61-car-next" aria-label="Next cards">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
          <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  ) : null
  const bottomMeta =
    car && (showProg || showCount) ? (
      <div className="b61-car__controls b61-car__controls--meta js-b61-car-controls" hidden>
        {showProg && (
          <span className="b61-car__progress" aria-hidden="true">
            <span className="b61-car__progress-fill js-b61-car-progress" />
          </span>
        )}
        {showCount && <Counter />}
      </div>
    ) : null

  const hasHead = Boolean(block.eyebrow || hasHeading || (block.subheads ?? []).some((s) => s?.text) || block.intro)
  const head = hasHead ? (
    <div className="b61-cards__head">
      {block.eyebrow && (
        <span className="b61-cards__eyebrow" {...ri}>
          {block.eyebrow}
        </span>
      )}
      <HeadingLines as={Heading} id={headingId} className="b61-cards__heading" lineClass="b61-cards__heading-line" lines={lines} ri={ri} />
      {(block.subheads ?? [])
        .filter((s) => s?.text)
        .map((s, i) => (
          <p key={s.id ?? i} className="b61-cards__subhead" {...ri}>
            {s.text}
          </p>
        ))}
      {Boolean(block.intro) && (
        <div className="b61-cards__intro breakdance-rich-text-styles" {...ri}>
          <RichText data={block.intro as SerializedEditorState} disableContainer converters={b61Converters} />
        </div>
      )}
    </div>
  ) : null

  const regionClass = [
    'b61-cards__region',
    `b61-surface--${surface}`,
    surface !== 'none' && `b61-band--${surface}`,
    `b61-cards__region--style-${cstyle}`,
    surfaced && `b61-cards__region--csurf-${csurf}`,
    `b61-cards__region--a${talign}`,
    `b61-cards__region--media-${mtype}`,
    mtype === 'icon' && isize !== 'sm' && `b61-cards__region--icon-${isize}`,
    mround && 'b61-cards__region--img-round',
    customRatio && 'b61-cards__region--ratio',
    block.ctaCase === 'normal' && 'b61-cards__region--cta-normal',
    (block.ctaSize === 'md' || block.ctaSize === 'lg') && `b61-cards__region--cta-${block.ctaSize}`,
    ov && `b61-cards__region--ovl${ovl} b61-cards__region--pos${pos} b61-cards__region--shape${shape}`,
    `b61-cards__region--pt-${pt}`,
    `b61-cards__region--pb-${pb}`,
    car && `b61-cards__region--carousel js-b61-car b61-car--ctl-${cpos}`,
    beside && 'b61-cards__region--beside',
    stagger && 'b61-cards__region--stagger',
    bleed && 'b61-cards__region--bleed',
    reveal && 'b61-cards__region--reveal',
    altTint && 'b61-cards__region--alt-tint',
    feature && 'b61-cards__region--feature',
    duotone && `b61-cards__region--duotone b61-duotone--${ov ? 'deep' : 'light'}`,
  ]
    .filter(Boolean)
    .join(' ')

  const grid = cards.length ? (
    <div
      className={`b61-cards__grid b61-cards__grid--c${cols}${car ? ` b61-car__track js-b61-car-track b61-car__track--pv${cols} b61-car__track--peek-${peek}` : ''}`}
      style={{ '--b61-cols': cols, ...(car ? { '--b61-car-pv': cols } : {}) } as CSSProperties}
      {...(car ? { 'data-b61-car-advance': block.advance ?? 'one', tabIndex: 0 } : {})}
    >
      {cards.map((card, i) => {
        const hasLink = Boolean(card.href)
        const cta = hasLink && card.linkText
        const linked = Boolean(card.title && hasLink && !cta)
        const img = mtype === 'image' ? imgProps(card.image as any, SIZES[cols] ?? SIZES['3']) : null
        const focus = mtype === 'image' ? focusOf(card.image as any) : undefined
        const linkProps = card.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}
        return (
          <article
            key={card.key}
            className={`b61-cards__card${linked || cta ? ' b61-cards__card--linked' : ''}`}
            {...ri}
            style={focus ? ({ '--b61-photo-focus': focus } as CSSProperties) : undefined}
            {...(car && card.title ? { 'data-b61-slide-label': card.title } : {})}
          >
            {img && (
              <div className="b61-cards__media">
                <img {...img} alt={asMedia(card.image as any)?.alt ?? ''} loading="lazy" />
              </div>
            )}
            {mtype === 'icon' && card.icon && (
              <span className="b61-cards__icon" aria-hidden="true">
                <B61Icon name={card.icon} />
              </span>
            )}
            <OverlayWrap on={ov} ovl={ovl}>
              {block.showNumbers && mtype !== 'icon' && (
                <span className="b61-cards__num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
              )}
              {card.eyebrow && <span className="b61-cards__eyebrow-item">{card.eyebrow}</span>}
              {card.title && (
                <CardHeading className="b61-cards__title">
                  {linked ? (
                    <a className="b61-cards__link" href={card.href!} {...linkProps}>
                      {card.title}
                    </a>
                  ) : (
                    card.title
                  )}
                </CardHeading>
              )}
              {card.body && <div className="b61-cards__body breakdance-rich-text-styles">{card.body}</div>}
              {cta && (
                <a className="b61-link b61-cards__cta" href={card.href!} {...linkProps}>
                  {card.linkText}
                  <span className="b61-link-arrow b61-cards__cta-arrow" aria-hidden="true">
                    &rarr;
                  </span>
                </a>
              )}
            </OverlayWrap>
          </article>
        )
      })}
    </div>
  ) : null

  const carTop = car && cpos === 'top-right'
  const buttons = <Buttons buttons={block.buttons as any} className="b61-cards__actions b61-btn-group" ri={ri} />

  // Heading beside the cards: the head (with a carousel's arrows and the
  // buttons under it) in a side column, the cards in the main one.
  if (beside) {
    return (
      <div className={`b61-cards b61-halign-${talign}${block.eyebrowRule && block.eyebrowRule !== 'site' ? ` b61-erule-${block.eyebrowRule}` : ''}`}>
        <Wrap
          className={regionClass}
          style={customRatio ? ({ '--cards-ratio': `${rw} / ${rh}` } as CSSProperties) : undefined}
          data-b61-reveal={rv}
          {...(car ? { 'data-b61-car-noun': 'Card' } : {})}
          {...(hasHeading ? { 'aria-labelledby': headingId } : car ? { 'data-b61-car-name': block.eyebrow || 'Cards' } : {})}
        >
          <div className="b61-cards__beside">
            <div className="b61-cards__side">
              {head}
              {car && cpos !== 'hidden' && controls}
              {buttons}
            </div>
            <div className="b61-cards__main">
              {grid &&
                (car ? (
                  <>
                    <div className="b61-car__viewport b61-cards__viewport">{grid}</div>
                    <p className="b61-car__status js-b61-car-status" aria-live="polite" />
                    <CarouselInit />
                  </>
                ) : (
                  grid
                ))}
            </div>
          </div>
        </Wrap>
      </div>
    )
  }

  return (
    <div className={`b61-cards b61-halign-${talign}${block.eyebrowRule && block.eyebrowRule !== 'site' ? ` b61-erule-${block.eyebrowRule}` : ''}`}>
      <Wrap
        className={regionClass}
        style={customRatio ? ({ '--cards-ratio': `${rw} / ${rh}` } as CSSProperties) : undefined}
        data-b61-reveal={rv}
        {...(car ? { 'data-b61-car-noun': 'Card' } : {})}
        {...(hasHeading ? { 'aria-labelledby': headingId } : car ? { 'data-b61-car-name': block.eyebrow || 'Cards' } : {})}
      >
        {carTop ? (
          <div className="b61-car__headrow b61-cards__headrow">
            {head}
            {controls}
          </div>
        ) : (
          head
        )}
        {grid &&
          (car ? (
            <>
              <div className="b61-car__viewport b61-cards__viewport">
                {grid}
                {cpos === 'sides' && controls}
              </div>
              {['bottom-left', 'bottom-center', 'bottom-right'].includes(cpos) && controls}
              {cpos === 'sides' && bottomMeta}
              <p className="b61-car__status js-b61-car-status" aria-live="polite" />
              <CarouselInit />
            </>
          ) : (
            grid
          ))}
        {buttons}
      </Wrap>
    </div>
  )
}

function Counter() {
  return (
    <span className="b61-car__count" aria-hidden="true">
      <span className="js-b61-car-now">01</span>
      <span className="b61-car__count-sep">/</span>
      <span className="js-b61-car-total">01</span>
    </span>
  )
}

function OverlayWrap({ on, ovl, children }: { on: boolean; ovl: string; children: ReactNode }) {
  if (!on) return <>{children}</>
  return (
    <>
      <span className={`b61-cards__scrim b61-cards__scrim--${ovl}`} aria-hidden="true" />
      <div className="b61-cards__overlay-content">{children}</div>
    </>
  )
}
