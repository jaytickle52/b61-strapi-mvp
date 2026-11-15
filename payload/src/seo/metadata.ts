import type { Metadata } from 'next'
import { getSettings, hiddenFromSearch, mediaUrl, siteOrigin } from '@/lib/data'
import { descriptionFrom } from './text'

/*
 * One place that turns a page's SEO fields into Next.js metadata: title,
 * description, canonical address, share image (Open Graph / X) and robots.
 * A missing description comes from the page's own words (`content`), then the
 * page type's default (`fallback`, where {school} is the school's name), and
 * only then the school's tagline, so pages don't all share one description.
 */
export async function seoMetadata(o: {
  title?: string | null
  description?: string | null
  meta?: { title?: string | null; description?: string | null; image?: unknown; noindex?: boolean | null } | null
  image?: unknown
  /** The page's body (sections or rich text), used when no description is written. */
  content?: unknown
  /** This kind of page's own description when nothing else is written, e.g. "News and stories from {school}." */
  fallback?: string
  path: string
  type?: 'website' | 'article'
  /** Keep this page out of search results but let crawlers follow its links (calendar months, filtered lists). */
  noindexFollow?: boolean
}): Promise<Metadata> {
  const [settings, origin, hidden] = await Promise.all([getSettings(), siteOrigin(), hiddenFromSearch()])
  const title = o.meta?.title || o.title || undefined
  const description =
    o.meta?.description ||
    o.description ||
    (o.content ? descriptionFrom(o.content) : '') ||
    o.fallback?.replace(/\{school\}/g, settings.schoolName) ||
    settings.tagline ||
    undefined
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
    ...(noindex ? { robots: { index: false, follow: false } } : o.noindexFollow ? { robots: { index: false, follow: true } } : {}),
  }
}
