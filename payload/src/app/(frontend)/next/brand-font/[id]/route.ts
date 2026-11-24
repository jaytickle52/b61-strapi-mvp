import { payloadClient } from '@/lib/data'
import { isFontFile } from '@/branding/fonts'

/**
 * Passes on a school's uploaded brand font (School settings > Look > Brand
 * fonts) from this site's own address, because browsers refuse fonts from
 * another domain without CORS headers (Documents live on Vercel Blob).
 *
 * Only Documents that are font files are served here; anything else is 404.
 * Documents are public anyway, so no school check is needed to read one.
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!/^\d+$/.test(id)) return new Response('Not found', { status: 404 })
  const payload = await payloadClient()
  const doc = await payload.findByID({ collection: 'documents', id: Number(id), depth: 0, disableErrors: true, overrideAccess: false })
  if (!doc?.url || !isFontFile(doc.filename, doc.mimeType)) return new Response('Not found', { status: 404 })

  const upstream = await fetch(new URL(doc.url, req.url), { cache: 'force-cache' })
  if (!upstream.ok || !upstream.body) return new Response('Not found', { status: 404 })

  return new Response(upstream.body, {
    headers: {
      'Content-Type': doc.mimeType || 'application/octet-stream',
      // A changed font is a new upload (a new id), so the file can be cached for good.
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
