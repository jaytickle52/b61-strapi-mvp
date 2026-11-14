import type { Media, Page } from '@/payload-types'

export type MediaRef = number | Media | null | undefined

export const asMedia = (m: MediaRef): Media | null => (m && typeof m === 'object' ? m : null)

/** src + srcset from every generated size, widest last. */
export function imgProps(m: MediaRef, sizes = '100vw') {
  const media = asMedia(m)
  if (!media?.url) return null
  const candidates: { url: string; width: number }[] = []
  for (const s of Object.values(media.sizes ?? {})) {
    if (s?.url && s.width) candidates.push({ url: s.url, width: s.width })
  }
  if (media.width) candidates.push({ url: media.url, width: media.width })
  candidates.sort((a, b) => a.width - b.width)
  return {
    src: media.url,
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

type LinkValue = { type?: 'page' | 'url' | null; page?: number | Page | null; url?: string | null; newTab?: boolean | null } | null | undefined

export function resolveLink(link: LinkValue): { href: string | null; newTab: boolean } {
  if (!link) return { href: null, newTab: false }
  let href: string | null = null
  if (link.type === 'url') href = link.url || null
  else if (link.page && typeof link.page === 'object') href = link.page.slug === 'home' ? '/' : `/${link.page.slug}`
  return { href, newTab: Boolean(link.newTab) }
}
