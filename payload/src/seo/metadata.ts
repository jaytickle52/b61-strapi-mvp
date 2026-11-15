import type { Metadata } from 'next'
import { getSettings, hiddenFromSearch, mediaUrl, siteOrigin } from '@/lib/data'

/*
 * One place that turns a page's SEO fields into Next.js metadata: title,
 * description, canonical address, share image (Open Graph / X) and robots.
 * Falls back to the school's tagline and default share image.
 */
export async function seoMetadata(o: {
  title?: string | null
  description?: string | null
  meta?: { title?: string | null; description?: string | null; image?: unknown; noindex?: boolean | null } | null
  image?: unknown
  path: string
  type?: 'website' | 'article'
}): Promise<Metadata> {
  const [settings, origin, hidden] = await Promise.all([getSettings(), siteOrigin(), hiddenFromSearch()])
  const title = o.meta?.title || o.title || undefined
  const description = o.meta?.description || o.description || settings.tagline || undefined
  // Photos use their 1200x630 link-preview crop (Media 'social' size); the logo stays as it is.
  const img =
    mediaUrl(o.meta?.image as any, 'social') ||
    mediaUrl(o.image as any, 'social') ||
    mediaUrl((settings as any).shareImage, 'social') ||
    mediaUrl(settings.logo as any)
  const image = img ? (img.startsWith('http') ? img : `${origin}${img}`) : undefined
  const url = `${origin}${o.path === '/' ? '' : o.path}` || origin
  const noindex = hidden || Boolean(o.meta?.noindex)
  return {
    // A meta title is used as written; otherwise the layout adds "| School name".
    ...(o.meta?.title ? { title: { absolute: o.meta.title } } : title ? { title } : o.path === '/' ? { title: { absolute: settings.schoolName } } : {}),
    description,
    alternates: { canonical: url },
    openGraph: {
      type: o.type ?? 'website',
      url,
      siteName: settings.schoolName,
      title: title ?? settings.schoolName,
      description,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: { card: image ? 'summary_large_image' : 'summary', title: title ?? settings.schoolName, description, images: image ? [image] : undefined },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  }
}
