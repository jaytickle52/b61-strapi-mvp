import { readFile } from 'node:fs/promises'
import path from 'node:path'
import type { Payload } from 'payload'

/*
 * Makes the current set of sizes (thumbnail, card, wide, hero, social) for
 * photos uploaded before the set changed. Runs during each build, a batch at a
 * time, and does nothing once every photo is up to date.
 *
 * It re-saves the photo from its original file, so the original is also capped
 * at 2560px and compressed. Photos whose file can't be read are skipped.
 */
export async function regenerateMissingSizes(payload: Payload, limit = 100) {
  const res = await payload.find({
    collection: 'media',
    where: {
      and: [
        { mimeType: { like: 'image/' } },
        { mimeType: { not_equals: 'image/svg+xml' } },
        { 'sizes.thumbnail.url': { exists: false } },
      ],
    },
    depth: 0,
    limit,
    overrideAccess: true,
  })
  let done = 0
  for (const doc of res.docs as any[]) {
    try {
      const data = await readOriginal(doc)
      if (!data) continue
      await payload.update({
        collection: 'media',
        id: doc.id,
        data: {},
        file: { data, mimetype: doc.mimeType, name: doc.filename, size: data.length },
        overrideAccess: true,
        context: { b61AllowDelete: true },
      })
      done++
    } catch (err: any) {
      payload.logger.warn(
        `[b61] Photo ${doc.id} (${doc.filename}): sizes not made: ${err?.message ?? err}`,
      )
    }
  }
  if (done)
    payload.logger.info(
      `[b61] Made new sizes for ${done} photo${done === 1 ? '' : 's'}${res.totalDocs > done ? `; ${res.totalDocs - done} left for the next build` : ''}`,
    )
}

async function readOriginal(doc: any): Promise<Buffer | null> {
  const url: string | undefined = doc.url
  if (url && /^https?:\/\//.test(url)) {
    const r = await fetch(url)
    return r.ok ? Buffer.from(await r.arrayBuffer()) : null
  }
  // Stored on this server's disk (local work, Railway).
  const dir = process.env.MEDIA_DIR || 'media'
  try {
    return await readFile(path.resolve(dir, doc.filename))
  } catch {
    return null
  }
}
