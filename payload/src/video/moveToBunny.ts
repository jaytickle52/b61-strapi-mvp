import type { Payload } from 'payload'
import { bunnyConfig, copyToBunny } from './bunny'

/*
 * Videos live on Bunny Stream, never in Vercel Blob (Jay, 17 Nov 2026). The
 * Photos library now takes photos only; this moves any video still in it:
 * copies it to the school's Bunny collection, points every Hero that used it
 * at the Bunny copy, then deletes the Vercel file. Runs during each Vercel
 * build (src/scripts/seed.ts) once the Bunny keys are set; does nothing
 * otherwise. Safe to run again: moved videos are gone from the library.
 */
export async function moveVideosToBunny(payload: Payload): Promise<void> {
  if (!bunnyConfig()) return
  const videos = await payload.find({
    collection: 'media',
    where: { mimeType: { like: 'video/' } },
    limit: 20,
    depth: 0,
    overrideAccess: true,
  })
  for (const media of videos.docs as any[]) {
    try {
      const school = typeof media.school === 'object' ? media.school?.id : media.school
      if (!media.url || school == null) continue
      const link = await copyToBunny(payload, school, media.filename ?? `Video ${media.id}`, media.url)
      // Every page of that school whose Hero used this file now plays the Bunny copy.
      const pages = await payload.find({ collection: 'pages', where: { school: { equals: school } }, limit: 500, depth: 0, overrideAccess: true })
      for (const page of pages.docs as any[]) {
        let changed = false
        const sections = (page.sections ?? []).map((s: any) => {
          if (s?.blockType !== 'b61Hero') return s
          const uses = [s.video, s.videoWebm].map((v: any) => (typeof v === 'object' ? v?.id : v)).includes(media.id)
          if (!uses) return s
          changed = true
          return { ...s, bunnyVideo: s.bunnyVideo || link, video: null, videoWebm: null }
        })
        if (changed) await payload.update({ collection: 'pages', id: page.id, data: { sections }, overrideAccess: true, context: { b61AllowDelete: true } })
      }
      await payload.delete({ collection: 'media', id: media.id, overrideAccess: true, context: { b61AllowDelete: true } })
      payload.logger.info(`[b61] Moved video ${media.filename} to Bunny: ${link}`)
    } catch (e: any) {
      payload.logger.error(`[b61] Moving video ${media.filename} to Bunny failed: ${e?.message ?? e}`)
    }
  }
}
