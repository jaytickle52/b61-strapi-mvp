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
  link?: Parameters<typeof resolveLink>[0]
}

/**
 * The content stack (body / emphasis / pull quote / icon rows). `prefix` is the
 * element's class prefix (b61-split, b61-prose...). Consecutive icon rows
 * become one list.
 */
export function ContentBlocks({ blocks, prefix, ri }: { blocks?: Block[] | null; prefix: string; ri: RevealAttr }) {
  const out: ReactNode[] = []
  const list = blocks ?? []
  let rows: ReactNode[] = []
  const flush = (key: string) => {
    if (rows.length) out.push(<ul key={key} className="b61-iconlist b61-block" {...ri}>{rows}</ul>)
    rows = []
  }
  list.forEach((b, i) => {
    const type = b?.type ?? 'body'
    const key = b?.id ?? String(i)
    if (type !== 'iconrow') flush(`list-${key}`)
    if (type === 'body' && b.body) {
      out.push(
        <div key={key} className={`${prefix}__body b61-block breakdance-rich-text-styles`} {...ri}>
          <RichText data={b.body as SerializedEditorState} disableContainer />
        </div>,
      )
    } else if (type === 'emphasis' && b.text) {
      out.push(<p key={key} className={`${prefix}__emphasis b61-block`} {...ri}>{b.text}</p>)
    } else if (type === 'quote' && b.text) {
      const photo = imgProps(b.photo, '120px')
      out.push(
        <figure key={key} className={`${prefix}__quote${photo ? ` ${prefix}__quote--photo` : ''} b61-block`} {...ri}>
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
      rows.push(
        <li key={key} className="b61-iconlist__row">
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
