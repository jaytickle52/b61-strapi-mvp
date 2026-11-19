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

export const b61Converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...tableConverters,
  ...linkConverters,
  ...blockConverters,
})
