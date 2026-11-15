import { letterIcon } from '@/seo/icon'

export const dynamic = 'force-dynamic'

/* The stand-in browser-tab icon for a school with no Site icon or logo (see src/seo/icon.ts). */
export async function GET() {
  return new Response(await letterIcon(), {
    headers: { 'Content-Type': 'image/svg+xml; charset=utf-8', 'Cache-Control': 'public, max-age=86400' },
  })
}
