import { LinkJSXConverter, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'

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

export const b61Converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref: ({ linkNode }) => internalHref(linkNode) }),
})
