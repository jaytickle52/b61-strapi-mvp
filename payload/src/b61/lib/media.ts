import type { Media, Page } from '@/payload-types'

export type MediaRef = number | Media | null | undefined

export const asMedia = (m: MediaRef): Media | null => (m && typeof m === 'object' ? m : null)

/** src + srcset from every generated size, widest last. */
export function imgProps(m: MediaRef, sizes = '100vw') {
  const media = asMedia(m)
  if (!media?.url) return null
  const candidates: { url: string; width: number }[] = []
  for (const [name, s] of Object.entries(media.sizes ?? {})) {
    // Only the uncropped widths: the social preview is a different shape.
    if (name !== 'social' && s?.url && s.width) candidates.push({ url: s.url, width: s.width })
  }
  if (media.width) candidates.push({ url: media.url, width: media.width })
  candidates.sort((a, b) => a.width - b.width)
  return {
    // A mid-size copy for browsers that ignore srcset; the original is the largest.
    src: (media.sizes as any)?.wide?.url || media.url,
    srcSet: candidates.length > 1 ? candidates.map((c) => `${c.url} ${c.width}w`).join(', ') : undefined,
    sizes: candidates.length > 1 ? sizes : undefined,
    width: media.width ?? undefined,
    height: media.height ?? undefined,
  }
}

/** The photo's own focal point (set in Media) as a CSS position, or undefined. */
export function focusOf(m: MediaRef): string | undefined {
  const media = asMedia(m) as (Media & { focalX?: number | null; focalY?: number | null }) | null
  if (media?.focalX == null || media?.focalY == null) return undefined
  const clamp = (n: number) => Math.min(Math.max(n, 0), 100)
  return `${clamp(media.focalX)}% ${clamp(media.focalY)}%`
}

type LinkValue =
  | { type?: 'page' | 'url' | 'document' | null; page?: number | Page | null; document?: number | { url?: string | null } | null; url?: string | null }
  | null
  | undefined

/**
 * Whether a link opens in a new tab. Editors don't choose (Jay, 19 Nov 2026):
 * pages on this site open in place; documents and other websites open in a new
 * tab. A web address that stays on this site ("/apply", "#visit"), and email,
 * phone and text links, open in place.
 */
export function opensNewTab(href: string | null | undefined, kind: 'page' | 'document' | 'url' | null | undefined): boolean {
  if (!href) return false
  if (kind === 'document') return true
  if (kind !== 'url') return false
  if (/^(\/(?!\/)|#|\?|mailto:|tel:|sms:)/i.test(href)) return false
  return true
}

export function resolveLink(link: LinkValue): { href: string | null; newTab: boolean } {
  if (!link) return { href: null, newTab: false }
  let href: string | null = null
  if (link.type === 'url') href = link.url || null
  else if (link.type === 'document') href = (link.document && typeof link.document === 'object' && link.document.url) || null
  else if (link.page && typeof link.page === 'object') href = link.page.slug === 'home' ? '/' : `/${link.page.slug}`
  return { href, newTab: opensNewTab(href, link.type ?? 'page') }
}
