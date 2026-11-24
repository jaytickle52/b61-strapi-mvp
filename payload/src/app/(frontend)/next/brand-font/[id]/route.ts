import { payloadClient } from '@/lib/data'
import { fontContentType, isFontFile } from '@/branding/fonts'

/**
 * Passes on a school's uploaded brand font (School settings > Look > Brand
 * fonts) from this site's own address, because browsers refuse fonts from
 * another domain without CORS headers (Documents live on Vercel Blob).
 *
 * Only Documents that are font files are served here; anything else is 404.
 * Documents are public anyway, so no school check is needed to read one.
 *
 * The page asks for `/next/brand-font/<id>?v=<version>` (branding/fonts.ts).
 * A Document can be replaced in place (same id), so the version changes when the
 * file does and the long cache below never serves an old font.
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!/^\d+$/.test(id)) return new Response('Not found', { status: 404 })
  const payload = await payloadClient()
  const doc = await payload.findByID({
    collection: 'documents',
    id: Number(id),
    depth: 0,
    disableErrors: true,
    overrideAccess: false,
  })
  const type = doc ? fontContentType(doc.filename) : null
  if (!doc?.url || !type || !isFontFile(doc.filename, doc.mimeType))
    return new Response('Not found', { status: 404 })

  // Not the Next data cache: it skips files over 2 MB and would outlive a replaced file.
  const upstream = await fetch(new URL(doc.url, req.url), { cache: 'no-store' })
  if (!upstream.ok || !upstream.body) return new Response('Not found', { status: 404 })

  const versioned = new URL(req.url).searchParams.has('v')
  return new Response(upstream.body, {
    headers: {
      // From the file's extension, not the stored type, so nothing else is ever served as a font.
      'Content-Type': type,
      'Cache-Control': versioned ? 'public, max-age=31536000, immutable' : 'public, max-age=300',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
