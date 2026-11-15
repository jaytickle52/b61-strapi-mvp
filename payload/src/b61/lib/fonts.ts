import { unstable_cache } from 'next/cache'

/*
 * The school's Google Fonts stylesheet, fetched once on the server and put in
 * the page as a <style> tag. A <link> to fonts.googleapis.com blocks the first
 * paint while the browser connects to Google and downloads it (Lighthouse:
 * "render-blocking requests"); inlined, the page paints and the font files
 * (fonts.gstatic.com, preconnected) load alongside.
 *
 * Cached per stylesheet address for a week. If Google can't be reached, the
 * layout falls back to the <link> (and tries again a few minutes later), so a
 * font never goes missing.
 */

// Google sends WOFF2 with unicode-range only to browsers it recognises.
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'

// Thrown on failure so a failed fetch is never cached; the next visit tries again.
const fetchCss = unstable_cache(
  async (href: string): Promise<string> => {
    const res = await fetch(href, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(2500) })
    if (!res.ok) throw new Error(`Google Fonts ${res.status}`)
    const css = await res.text()
    // Only font-face rules pointing at Google's font host.
    if (!css.includes('@font-face') || /url\((?!https:\/\/fonts\.gstatic\.com\/)/.test(css)) throw new Error('Unexpected font CSS')
    return css.replace(/<\/style/gi, '')
  },
  ['google-fonts-css-v1'],
  { revalidate: 7 * 24 * 3600, tags: ['google-fonts'] },
)

// After a failure, use the <link> for a few minutes before trying again, so
// an unreachable Google doesn't slow every page.
let pausedUntil = 0

/** The stylesheet's text, or null to fall back to a <link>. */
export async function inlineFontCss(href: string): Promise<string | null> {
  if (!href.startsWith('https://fonts.googleapis.com/') || Date.now() < pausedUntil) return null
  try {
    return await fetchCss(href)
  } catch {
    pausedUntil = Date.now() + 5 * 60_000
    return null
  }
}
