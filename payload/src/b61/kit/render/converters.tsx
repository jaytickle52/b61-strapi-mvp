import type { JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import { opensNewTab, resolveLink } from '../../lib/media'

/**
 * Where a link made in the Content editor goes when it points at something on
 * this site: a page (by its current slug, so renaming a page keeps links
 * working) or a document (its file). Without this, Payload renders "#".
 */
export function internalHref(linkNode: any): string {
  const doc = linkNode?.fields?.doc
  const value = doc?.value
  if (!value || typeof value !== 'object') return '#'
  if (doc.relationTo === 'documents') return value.url ?? '#'
  if (doc.relationTo === 'pages')
    return value.slug === 'home' || !value.slug ? '/' : `/${value.slug}`
  return '#'
}

/**
 * Tables typed into the Content editor. Payload's own converter hard-codes a
 * grey border and padding as inline styles, which no theme or dark site could
 * override; these emit plain classes and let kit-frontend.css draw them. The
 * wrapper scrolls sideways on a phone instead of squeezing the columns, and is
 * focusable so a keyboard user can scroll it too.
 */
const tableConverters = {
  table: ({ node, nodesToJSX }: any) => {
    const rows = node.children ?? []
    const firstRowIsHeader = rows[0]?.children?.every((c: any) => (c?.headerState ?? 0) > 0)
    const head = firstRowIsHeader ? nodesToJSX({ nodes: [rows[0]] }) : null
    const body = nodesToJSX({ nodes: firstRowIsHeader ? rows.slice(1) : rows })
    return (
      <div className="b61-table" tabIndex={0} role="region" aria-label="Table">
        <table>
          {head && <thead>{head}</thead>}
          <tbody>{body}</tbody>
        </table>
      </div>
    )
  },
  tablerow: ({ node, nodesToJSX }: any) => <tr>{nodesToJSX({ nodes: node.children })}</tr>,
  tablecell: ({ node, nodesToJSX }: any) => {
    const header = (node.headerState ?? 0) > 0
    const Tag = header ? 'th' : 'td'
    const colSpan = node.colSpan > 1 ? node.colSpan : undefined
    const rowSpan = node.rowSpan > 1 ? node.rowSpan : undefined
    // headerState 1 = row header (top row), 2 = column header (first column).
    const scope = header ? ((node.headerState & 1) === 1 ? 'col' : 'row') : undefined
    return (
      <Tag colSpan={colSpan} rowSpan={rowSpan} scope={scope}>
        {nodesToJSX({ nodes: node.children })}
      </Tag>
    )
  },
}

/**
 * Links typed in the Content editor. Same rule as every other link (`opensNewTab`):
 * pages open in place, documents and other websites in a new tab. Older links'
 * own "Open in new tab" setting is ignored.
 */
const linkConverters = {
  autolink: ({ node, nodesToJSX }: any) => {
    const href = node.fields?.url ?? ''
    const nt = opensNewTab(href, 'url')
    return (
      <a href={href} {...(nt ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {nodesToJSX({ nodes: node.children })}
      </a>
    )
  },
  link: ({ node, nodesToJSX }: any) => {
    const internal = node.fields?.linkType === 'internal'
    const href = internal ? internalHref(node) : (node.fields?.url ?? '')
    const kind = internal ? (node.fields?.doc?.relationTo === 'documents' ? 'document' : 'page') : 'url'
    const nt = href !== '#' && opensNewTab(href, kind)
    return (
      <a href={href} {...(nt ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {nodesToJSX({ nodes: node.children })}
      </a>
    )
  },
}

/**
 * A Button typed into a short editor (Accordion answers): the same markup as
 * the Content editor's Button (kit/render/parts.tsx), one button in the text.
 */
const blockConverters = {
  blocks: {
    bodyButton: ({ node }: any) => {
      const f = node.fields ?? {}
      if (!f.label) return null
      const variant = ['primary', 'secondary', 'light', 'link'].includes(f.variant) ? f.variant : 'primary'
      const { href, newTab } = resolveLink(f.link)
      return (
        <div className="b61-btn-group b61-body-btn">
          <a className={variant === 'link' ? 'b61-link' : `b61-btn b61-btn--${variant}`} href={href ?? undefined} {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            {f.label}
            {variant === 'link' && (
              <span className="b61-link-arrow" aria-hidden="true">
                &rarr;
              </span>
            )}
          </a>
        </div>
      )
    },
  },
}

/**
 * The kit's other pieces typed into a rich-text field that isn't a band's
 * Content editor (the Event description): Emphasis, Quote and Callout, with
 * the same look as in Prose (classes in kit-frontend.css).
 */
const moreBlockConverters = {
  emphasis: ({ node }: any) => (node.fields?.text ? <p className="b61-rt-emphasis">{node.fields.text}</p> : null),
  pullQuoteText: ({ node }: any) => {
    const f = node.fields ?? {}
    if (!f.text) return null
    return (
      <figure className="b61-rt-quote">
        <blockquote>
          <p>{f.text}</p>
        </blockquote>
        {f.attribution && <figcaption>{f.attribution}</figcaption>}
      </figure>
    )
  },
  callout: ({ node }: any) => {
    const f = node.fields ?? {}
    if (!f.title && !f.text) return null
    const tone = f.tone === 'important' || f.tone === 'celebrate' ? f.tone : 'note'
    const { href, newTab } = f.linkLabel ? resolveLink(f.link) : { href: null, newTab: false }
    return (
      <div role="note" className={`b61-callout b61-callout--${tone} b61-rt-callout`}>
        {f.title && <p className="b61-callout__title">{f.title}</p>}
        {f.text && <p className="b61-callout__text">{f.text}</p>}
        {href && (
          <a className="b61-link b61-callout__link" href={href} {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            {f.linkLabel}
            <span className="b61-link-arrow" aria-hidden="true">
              &rarr;
            </span>
          </a>
        )}
      </div>
    )
  },
}

/**
 * Checklists ("What to bring"). Payload's own markup makes each row a fake
 * checkbox that can't be ticked; on the website they're a plain list with a
 * tick or an empty box drawn beside each row, and "Done:" read out for ticked rows.
 */
const checklistConverters = (defaults: any) => ({
  list: (args: any) =>
    args.node?.listType === 'check' ? (
      <ul className="b61-checklist">{args.nodesToJSX({ nodes: args.node.children })}</ul>
    ) : (
      defaults.list(args)
    ),
  listitem: (args: any) => {
    if (args.parent?.listType !== 'check') return defaults.listitem(args)
    const done = Boolean(args.node.checked)
    return (
      <li className={`b61-checklist__item${done ? ' b61-checklist__item--done' : ''}`}>
        <span className="b61-checklist__mark" aria-hidden="true" />
        {done && <span className="sr-only">Done: </span>}
        {args.nodesToJSX({ nodes: args.node.children })}
      </li>
    )
  },
})

export const b61Converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...tableConverters,
  ...linkConverters,
  ...checklistConverters(defaultConverters),
  blocks: { ...blockConverters.blocks, ...moreBlockConverters },
})
