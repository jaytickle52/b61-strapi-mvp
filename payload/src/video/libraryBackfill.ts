import type { Payload } from 'payload'

/*
 * Videos that were uploaded onto an element before the Videos list existed
 * (19 Nov 2026) join their school's Videos, so they can be chosen again.
 * Runs with each build (src/scripts/seed.ts); safe to run again: a video
 * already listed for that school is skipped.
 */
const LINK = /https:\/\/(?:iframe|player)\.mediadelivery\.net\/(?:embed|play)\/\d+\/[0-9a-f-]{36}/gi

export async function addPageVideosToLibrary(payload: Payload): Promise<void> {
  const pages = await payload.find({ collection: 'pages', depth: 0, pagination: false, draft: true, overrideAccess: true })
  const listed = await payload.find({ collection: 'videos' as any, depth: 0, pagination: false, overrideAccess: true })
  const seen = new Set((listed.docs as any[]).map((v) => `${typeof v.school === 'object' ? v.school?.id : v.school}:${String(v.link).slice(-36).toLowerCase()}`))
  for (const page of pages.docs as any[]) {
    const school = typeof page.school === 'object' ? page.school?.id : page.school
    if (school == null) continue
    for (const link of JSON.stringify(page.sections ?? []).match(LINK) ?? []) {
      const key = `${school}:${link.slice(-36).toLowerCase()}`
      if (seen.has(key)) continue
      seen.add(key)
      await payload.create({ collection: 'videos' as any, data: { school, title: `Video from ${page.title ?? 'a page'}`, link } as any, overrideAccess: true })
      payload.logger.info(`[b61] Added a video from "${page.title}" to Videos`)
    }
  }
}
