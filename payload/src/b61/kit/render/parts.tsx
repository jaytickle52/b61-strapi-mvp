import { b61Converters } from './converters'
import { Fragment, type ReactNode } from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { imgProps, resolveLink } from '../../lib/media'
import { B61Icon } from './icons'

/*
 * Shared front-end parts. Same markup and classes as the plugin's twig, so the
 * plugin's stylesheets style them unchanged. `ri` marks entrance-reveal items.
 */

export type RevealAttr = { 'data-b61-reveal-item'?: string }
export const revealAttr = (entrance?: string | null): RevealAttr => (entrance === 'off' ? {} : { 'data-b61-reveal-item': '' })

type Line = { text?: string | null; emphasize?: boolean | null; id?: string | null }

/** One heading tag, one span per line; a real space keeps the accessible name readable. */
export function HeadingLines({
  as: Tag,
  id,
  className,
  lineClass,
  lines,
  ri,
}: {
  as: 'h1' | 'h2' | 'h3' | 'h4'
  id?: string
  className: string
  lineClass: string
  lines: Line[]
  ri: RevealAttr
}) {
  const shown = lines.filter((l) => l?.text)
  if (!shown.length) return null
  return (
    <Tag className={className} id={id}>
      {shown.map((l, i) => (
        <Fragment key={l.id ?? i}>
          {i > 0 && ' '}
          <span className={`${lineClass}${l.emphasize ? ` ${lineClass}--em` : ''}`} {...ri}>
            {l.text}
          </span>
        </Fragment>
      ))}
    </Tag>
  )
}

type Btn = {
  id?: string | null
  label?: string | null
  variant?: string | null
  fullWidth?: boolean | null
  link?: Parameters<typeof resolveLink>[0]
}

/** The shared four button styles. Renders nothing when there are no buttons. */
export function Buttons({ buttons, className = 'b61-btn-group', ri }: { buttons?: Btn[] | null; className?: string; ri: RevealAttr }) {
  const shown = (buttons ?? []).filter((b) => b?.label)
  if (!shown.length) return null
  return (
    <div className={className} {...ri}>
      {shown.map((b, i) => {
        const variant = b.variant ?? 'primary'
        const full = variant !== 'link' && b.fullWidth
        const cls = variant === 'link' ? 'b61-link' : `b61-btn b61-btn--${variant}${full ? ' b61-btn--block' : ''}`
        const { href, newTab } = resolveLink(b.link)
        return (
          <a key={b.id ?? i} className={cls} href={href ?? undefined} {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
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
  )
}

type Block = {
  id?: string | null
  type?: string | null
  body?: unknown
  text?: string | null
  attribution?: string | null
  photo?: any
  icon?: string | null
  hasLink?: boolean | null
  scale?: string | null
  divider?: boolean | null
  link?: Parameters<typeof resolveLink>[0]
}

/**
 * The content stack (body / emphasis / pull quote / icon rows). `prefix` is the
 * element's class prefix (b61-split, b61-prose...). Consecutive icon rows
 * become one list.
 */
export function ContentBlocks({
  blocks,
  prefix,
  ri,
  emphasisScale = false,
  linkList = false,
  listEdges = false,
}: {
  blocks?: Block[] | null
  prefix: string
  ri: RevealAttr
  /** Prose: emphasis lines carry a Regular/Display scale class. */
  emphasisScale?: boolean
  /** Prose "Link list" style: linked rows get an arrow, rows get rules. */
  linkList?: boolean
  listEdges?: boolean
}) {
  const out: ReactNode[] = []
  const list = blocks ?? []
  let rows: ReactNode[] = []
  let listDivided = ''
  const flush = (key: string) => {
    if (rows.length)
      out.push(
        <ul
          key={key}
          className={`b61-iconlist${linkList ? ' b61-iconlist--links' : ''}${linkList && listEdges ? ' b61-iconlist--edges' : ''} b61-block${listDivided}`}
          {...ri}
        >
          {rows}
        </ul>,
      )
    rows = []
  }
  list.forEach((b, i) => {
    const type = b?.type ?? 'body'
    const key = b?.id ?? String(i)
    // A hairline above this block (Prose), never above the first.
    const dv = b?.divider && i > 0 ? ` ${prefix}__block--divided` : ''
    if (type !== 'iconrow') flush(`list-${key}`)
    else if (!rows.length) listDivided = dv
    if (type === 'body' && b.body) {
      out.push(
        <div key={key} className={`${prefix}__body b61-block${dv} breakdance-rich-text-styles`} {...ri}>
          <RichText data={b.body as SerializedEditorState} disableContainer converters={b61Converters} />
        </div>,
      )
    } else if (type === 'emphasis' && b.text) {
      const scale = emphasisScale ? ` ${prefix}__emphasis--${b.scale ?? 'regular'}` : ''
      out.push(<p key={key} className={`${prefix}__emphasis${scale} b61-block${dv}`} {...ri}>{b.text}</p>)
    } else if (type === 'quote' && b.text) {
      const photo = imgProps(b.photo, '120px')
      out.push(
        <figure key={key} className={`${prefix}__quote${photo ? ` ${prefix}__quote--photo` : ''} b61-block${dv}`} {...ri}>
          {photo && (
            <div className={`${prefix}__quote-photo`}>
              <img {...photo} alt="" loading="lazy" />
            </div>
          )}
          <QuoteText wrap={Boolean(photo)} className={`${prefix}__quote-text`}>
            <blockquote>
              <p>{b.text}</p>
            </blockquote>
            {b.attribution && <figcaption>{b.attribution}</figcaption>}
          </QuoteText>
        </figure>,
      )
    } else if (type === 'iconrow' && b.text) {
      const { href, newTab } = b.hasLink ? resolveLink(b.link) : { href: null, newTab: false }
      const icon = b.icon && b.icon !== 'dot' ? b.icon : null
      const linked = linkList && Boolean(href)
      rows.push(
        <li key={key} className={`b61-iconlist__row${linked ? ' b61-iconlist__row--linked' : ''}`}>
          <span className={`b61-iconlist__mark${icon ? '' : ' b61-iconlist__mark--dot'}`} aria-hidden="true">
            <B61Icon name={icon} />
          </span>
          <span className="b61-iconlist__text">
            {href ? (
              <a className="b61-iconlist__link" href={href} {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                {b.text}
              </a>
            ) : (
              b.text
            )}
          </span>
          {linked && (
            <span className="b61-iconlist__arrow" aria-hidden="true">
              &rarr;
            </span>
          )}
        </li>,
      )
    }
  })
  flush('list-end')
  return <>{out}</>
}

function QuoteText({ wrap, className, children }: { wrap: boolean; className: string; children: ReactNode }) {
  return wrap ? <div className={className}>{children}</div> : <>{children}</>
}

/**
 * A band's head group: eyebrow, heading lines, subheadings, intro, in a
 * `${prefix}__head` wrapper. Renders nothing when all are empty.
 */
export function BandHead({
  block,
  prefix,
  as,
  headingId,
  ri,
  wrap = true,
  headClass = '',
  itemClass = '',
}: {
  block: { eyebrow?: string | null; lines?: Line[] | null; subheads?: { id?: string | null; text?: string | null }[] | null; intro?: unknown }
  prefix: string
  as: 'h1' | 'h2' | 'h3' | 'h4'
  headingId: string
  ri: RevealAttr
  wrap?: boolean
  /** Extra classes on the head wrapper (e.g. an alignment dial). */
  headClass?: string
  /** Extra classes on each child (Tabs, Pillars, Carousel add "b61-block"). */
  itemClass?: string
}) {
  const x = itemClass ? ` ${itemClass}` : ''
  const lines = (block.lines ?? []).filter((l) => l?.text)
  const subs = (block.subheads ?? []).filter((s) => s?.text)
  if (!block.eyebrow && !lines.length && !subs.length && !block.intro) return null
  const inner = (
    <>
      {block.eyebrow && (
        <span className={`${prefix}__eyebrow${x}`} {...ri}>
          {block.eyebrow}
        </span>
      )}
      <HeadingLines as={as} id={headingId} className={`${prefix}__heading${x}`} lineClass={`${prefix}__heading-line`} lines={lines} ri={ri} />
      {subs.map((s, i) => (
        <p key={s.id ?? i} className={`${prefix}__subhead${x}`} {...ri}>
          {s.text}
        </p>
      ))}
      {Boolean(block.intro) && (
        <div className={`${prefix}__intro${x} breakdance-rich-text-styles`} {...ri}>
          <RichText data={block.intro as SerializedEditorState} disableContainer converters={b61Converters} />
        </div>
      )}
    </>
  )
  return wrap ? <div className={`${prefix}__head${headClass ? ` ${headClass}` : ''}`}>{inner}</div> : inner
}

/** Shared class helpers for a band's root: eyebrow rule. */
export const eruleClass = (rule?: string | null) => (rule && rule !== 'site' ? `b61-erule-${rule}` : '')
