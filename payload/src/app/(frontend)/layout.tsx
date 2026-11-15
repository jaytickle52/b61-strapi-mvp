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
import { b61Theme, FONT_STACKS } from '@/b61/lib/theme'
import Reveal from '@/b61/reveal/Reveal'
import { getSettings, hiddenFromSearch, isPreview, siteOrigin } from '@/lib/data'
import AnalyticsTag from '@/analytics/Tag'
import JsonLd from '@/seo/JsonLd'
import { schoolSchema } from '@/seo/schema'
import { PreviewBanner } from '@/components/SiteChrome'
import Header from '@/b61/chrome/Header'
import Footer from '@/b61/chrome/Footer'
import { resolveMenu } from '@/b61/chrome/resolve'
import { asMedia } from '@/b61/lib/media'
import LivePreviewListener from '@/components/LivePreviewListener'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const [settings, origin] = await Promise.all([getSettings(), siteOrigin()])
  return {
    metadataBase: new URL(origin),
    title: { default: settings.schoolName, template: `%s | ${settings.schoolName}` },
    description: settings.tagline ?? undefined,
    verification: (settings as any).googleVerification ? { google: (settings as any).googleVerification } : undefined,
  }
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [settings, preview, hidden] = await Promise.all([getSettings(), isPreview(), hiddenFromSearch()])
  // Count visitors only on the school's live site: not demo/preview addresses, not staff previews.
  const gaTag = !preview && !hidden ? settings.gaMeasurementId : null
  const heading = settings.headingFont ?? 'Fraunces'
  const body = settings.bodyFont ?? 'Inter'
  const ui = settings.uiFont ?? 'Montserrat'
  const fam = (f: string, axes: string) => `family=${encodeURIComponent(f)}:${axes}`
  const fonts = [
    fam(heading, 'ital,wght@0,400;0,600;0,700;1,400;1,600'),
    ...(body !== heading ? [fam(body, 'wght@400;600')] : []),
    ...(ui !== heading && ui !== body ? [fam(ui, 'wght@500;600;700')] : []),
  ]
  const logo = asMedia(settings.logo)
  const fontsHref = `https://fonts.googleapis.com/css2?${fonts.join('&')}&display=swap`

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={fontsHref} />
      </head>
      <body className="flex min-h-full flex-col" style={theme}>
        <JsonLd data={await schoolSchema()} />
        {preview && <PreviewBanner />}
        {preview && <LivePreviewListener />}
        <Header brand={{ name: settings.schoolName, logo: logo?.url ? { src: logo.url, width: logo.width ?? undefined, height: logo.height ?? undefined } : null }} {...resolveMenu(settings)} />
        <main className="flex-1">{children}</main>
        <Footer s={settings} logo={logo?.url} />
        <Reveal />
        {gaTag && <AnalyticsTag id={gaTag} />}
      </body>
    </html>
  )
}
