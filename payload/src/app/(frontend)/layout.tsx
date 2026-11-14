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
import '@/b61/elements/prose/prose.css'
import '@/b61/elements/prose/prose-instance.css'
import '@/b61/styles/kit-instance.css'
import '@/b61/styles/kit-frontend.css'
import { b61Theme, FONT_STACKS } from '@/b61/lib/theme'
import Reveal from '@/b61/reveal/Reveal'
import { getSettings, isPreview } from '@/lib/data'
import { PreviewBanner, SiteFooter, SiteHeader } from '@/components/SiteChrome'
import LivePreviewListener from '@/components/LivePreviewListener'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  return {
    title: { default: settings.schoolName, template: `%s | ${settings.schoolName}` },
    description: settings.tagline ?? undefined,
  }
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [settings, preview] = await Promise.all([getSettings(), isPreview()])
  const heading = settings.headingFont ?? 'Fraunces'
  const body = settings.bodyFont ?? 'Inter'
  const ui = settings.uiFont ?? 'Montserrat'
  const fam = (f: string, axes: string) => `family=${encodeURIComponent(f)}:${axes}`
  const fonts = [
    fam(heading, 'ital,wght@0,400;0,600;0,700;1,400;1,600'),
    ...(body !== heading ? [fam(body, 'wght@400;600')] : []),
    ...(ui !== heading && ui !== body ? [fam(ui, 'wght@500;600;700')] : []),
  ]
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
        {preview && <PreviewBanner />}
        {preview && <LivePreviewListener />}
        <SiteHeader settings={settings} />
        <main className="flex-1">{children}</main>
        <SiteFooter settings={settings} />
        <Reveal />
      </body>
    </html>
  )
}
