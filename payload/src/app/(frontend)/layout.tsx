import type { Metadata } from 'next'
import type { CSSProperties, ReactNode } from 'react'
import './styles.css'
import '@/b61/styles/site-raw.css'
import '@/b61/styles/tokens.css'
import '@/b61/styles/utilities.css'
import '@/b61/styles/components.css'
import '@/b61/elements/hero/hero.css'
import '@/b61/elements/hero/hero-instance.css'
import '@/b61/elements/split/split.css'
import '@/b61/elements/split/split-instance.css'
import '@/b61/elements/form/form.css'
import '@/b61/elements/prose/prose.css'
import '@/b61/elements/prose/prose-instance.css'
import '@/b61/elements/cta/cta.css'
import '@/b61/elements/cta/cta-instance.css'
import '@/b61/elements/cards/cards.css'
import '@/b61/elements/cards/cards-instance.css'
import '@/b61/elements/stats/stats.css'
import '@/b61/elements/stats/stats-instance.css'
import '@/b61/elements/testimonial/testimonial.css'
import '@/b61/elements/testimonial/testimonial-instance.css'
import '@/b61/elements/gallery/gallery.css'
import '@/b61/elements/gallery/gallery-instance.css'
import '@/b61/elements/framed/framed.css'
import '@/b61/elements/framed/framed-instance.css'
import '@/b61/elements/divider/divider.css'
import '@/b61/elements/divider/divider-instance.css'
import '@/b61/elements/buttonbar/buttonbar.css'
import '@/b61/elements/accordion/accordion.css'
import '@/b61/elements/pillars/pillars.css'
import '@/b61/elements/tabs/tabs.css'
import '@/b61/elements/tabs/tab.css'
import '@/b61/elements/carousel/carousel.css'
import '@/b61/elements/carousel/slide.css'
import '@/b61/elements/section/section.css'
import '@/b61/elements/section/sidebar.css'
import '@/b61/elements/rail/rail.css'
import '@/b61/styles/kit-instance.css'
import '@/b61/styles/kit-frontend.css'
import '@/b61/chrome/chrome.css'
import '@/b61/styles/calendar.css'
import { b61Theme, FONT_STACKS, fontsHref } from '@/b61/lib/theme'
import { inlineFontCss } from '@/b61/lib/fonts'
import Reveal from '@/b61/reveal/Reveal'
import { getAnnouncements, getSettings, hiddenFromSearch, isPreview, siteOrigin } from '@/lib/data'
import AnalyticsTag from '@/analytics/Tag'
import Announcements, { type Notice } from '@/b61/chrome/Announcements'
import JsonLd from '@/seo/JsonLd'
import { redirectToMainDomain } from '@/seo/domains'
import { schoolSchema } from '@/seo/schema'
import { PreviewBanner } from '@/components/SiteChrome'
import Header from '@/b61/chrome/Header'
import Footer from '@/b61/chrome/Footer'
import { resolveMenu } from '@/b61/chrome/resolve'
import { asMedia, resolveLink } from '@/b61/lib/media'
import LivePreviewListener from '@/components/LivePreviewListener'

export const dynamic = 'force-dynamic'

// The browser-tab icon: the school's Site icon, else its logo, else a letter mark
// on the school's colour (/school-icon.svg), so no school shows a blank tab.
function siteIcons(settings: any): Metadata['icons'] {
  const icon = asMedia(settings.siteIcon) ?? asMedia(settings.logo)
  if (!icon?.url) return { icon: [{ url: '/school-icon.svg', type: 'image/svg+xml' }] }
  return { icon: [{ url: icon.url, type: icon.mimeType ?? undefined }], apple: [{ url: icon.url }] }
}

export async function generateMetadata(): Promise<Metadata> {
  const [settings, origin] = await Promise.all([getSettings(), siteOrigin()])
  return {
    metadataBase: new URL(origin),
    title: { default: settings.schoolName, template: `%s | ${settings.schoolName}` },
    description: settings.tagline ?? undefined,
    verification: {
      google: (settings as any).googleVerification || undefined,
      other: (settings as any).bingVerification ? { 'msvalidate.01': (settings as any).bingVerification } : undefined,
    },
    icons: siteIcons(settings),
  }
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  // A school's other domains (www, an old domain) go to its main one, page for page.
  await redirectToMainDomain()
  const [settings, preview, hidden, announcements] = await Promise.all([getSettings(), isPreview(), hiddenFromSearch(), getAnnouncements()])
  // Count visitors only on the school's live site: not demo/preview addresses, not staff previews.
  const gaTag = !preview && !hidden ? settings.gaMeasurementId : null
  const notices: Notice[] = announcements.map((a) => {
    const { href, newTab } = resolveLink(a.button?.link as any)
    return {
      id: a.id,
      title: a.title,
      message: a.message,
      style: a.style,
      href,
      newTab,
      linkLabel: a.button?.label,
      homeOnly: a.showOn === 'home',
      dismissible: a.dismissible !== false,
      version: String(a.updatedAt ?? ''),
    }
  })
  const heading = settings.headingFont ?? 'Fraunces'
  const body = settings.bodyFont ?? 'Inter'
  const ui = settings.uiFont ?? 'Montserrat'
  const logo = asMedia(settings.logo)
  // A separate logo for the dark footer, when the school has one.
  const logoOnDark = asMedia((settings as any).logoOnDark)
  const fontsUrl = fontsHref(settings)
  // Inlined so the first paint doesn't wait on Google (src/b61/lib/fonts.ts); a <link> if Google is unreachable.
  const fontsCss = await inlineFontCss(fontsUrl)

  // The school's colors and fonts become CSS variables every component uses.
  const theme = {
    '--brand': settings.primaryColor || '#1f3a5f',
    '--accent': settings.secondaryColor || '#c8a24a',
    '--font-heading': FONT_STACKS[heading] ?? FONT_STACKS.Fraunces,
    '--font-body': FONT_STACKS[body] ?? FONT_STACKS.Inter,
  } as CSSProperties

  return (
    // The B61 palette goes on <html>: tokens.css derives its role tokens on
    // :root, so the raw values have to be set there to flow through.
    <html lang="en" className="h-full antialiased" style={b61Theme(settings)}>
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {fontsCss ? (
          <style id="b61-fonts" dangerouslySetInnerHTML={{ __html: fontsCss }} />
        ) : (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="stylesheet" href={fontsUrl} />
          </>
        )}
        {/* The news feed, for feed readers and AI tools. */}
        <link rel="alternate" type="application/rss+xml" title={`${settings.schoolName} news`} href="/news/feed.xml" />
      </head>
      <body className="flex min-h-full flex-col" style={theme}>
        <JsonLd data={await schoolSchema()} />
        {preview && <PreviewBanner />}
        {preview && <LivePreviewListener />}
        <Announcements notices={notices} />
        <Header brand={{ name: settings.schoolName, logo: logo?.url ? { src: logo.url, width: logo.width ?? undefined, height: logo.height ?? undefined } : null }} {...resolveMenu(settings)} />
        <main className="flex-1">{children}</main>
        <Footer s={settings} logo={logoOnDark?.url ?? logo?.url} />
        <Reveal />
        {gaTag && <AnalyticsTag id={gaTag} />}
      </body>
    </html>
  )
}
