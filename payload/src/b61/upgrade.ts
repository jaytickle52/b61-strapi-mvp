import type { Payload, PayloadRequest } from 'payload'
import { demoHeroes, demoSplits, ensureDemoImages } from './demo'
import { PROFILES } from '../seed'

/*
 * Run once by the b61_hero migration on a site that already has content.
 * The old simple hero blocks were removed with their tables; this puts a B61
 * Hero at the top of each demo page that has none, built from the school's
 * own settings. Pages that already have a B61 Hero are left alone.
 */
export async function upgradeDemoHeroes(payload: Payload, req?: PayloadRequest) {
  const pages = await payload.find({ collection: 'pages', where: { slug: { in: ['home', 'about', 'visit'] } }, depth: 0, limit: 10, req })
  if (pages.totalDocs === 0) return // a fresh site: the demo seed adds heroes itself

  const settings = await payload.findGlobal({ slug: 'school-settings', depth: 0, req })
  const profile = Object.values(PROFILES).find((p) => p.settings.schoolName === settings.schoolName) ?? PROFILES['cedar-ridge']
  const imgs = await ensureDemoImages(
    payload,
    { a: settings.primaryColor || '#1F3A5F', b: settings.secondaryColor || '#C8A24A' },
    req,
  )
  const heroes = demoHeroes({
    tagline: settings.tagline || profile.tagline,
    mission: profile.mission,
    phone: settings.phone || undefined,
    imgs,
  })

  for (const page of pages.docs) {
    const sections = page.sections ?? []
    if (sections.some((s) => s.blockType === 'b61Hero')) continue
    const hero = heroes[page.slug as 'home' | 'about' | 'visit']
    if (!hero) continue
    await payload.update({
      collection: 'pages',
      id: page.id,
      data: { sections: [hero as any, ...sections], _status: 'published' },
      req,
    })
    payload.logger.info(`[b61] Added a B61 Hero to "${page.title}"`)
  }
}

/*
 * Run once by the b61_split migration. The old simple "Text and image" blocks
 * were removed with their tables; About gets a B61 Split where its old one sat,
 * and Home gets the gallery Split after its stats band. Pages that already
 * have a B61 Split are left alone.
 */
export async function upgradeDemoSplits(payload: Payload, req: PayloadRequest | undefined, oldPositions: Record<number, number>) {
  const pages = await payload.find({ collection: 'pages', where: { slug: { in: ['home', 'about'] } }, depth: 0, limit: 10, req })
  if (pages.totalDocs === 0) return

  const settings = await payload.findGlobal({ slug: 'school-settings', depth: 0, req })
  const profile = Object.values(PROFILES).find((p) => p.settings.schoolName === settings.schoolName) ?? PROFILES['cedar-ridge']
  const imgs = await ensureDemoImages(payload, { a: settings.primaryColor || '#1F3A5F', b: settings.secondaryColor || '#C8A24A' }, req)
  const splits = demoSplits({
    name: settings.schoolName || (profile.settings.schoolName as string),
    mission: profile.mission,
    phone: settings.phone || undefined,
    email: settings.email || undefined,
    address: settings.address || undefined,
    imgs,
  })

  for (const page of pages.docs) {
    const sections = [...(page.sections ?? [])]
    if (sections.some((s) => s.blockType === 'b61Split')) continue
    const split = splits[page.slug as 'home' | 'about']
    if (!split) continue
    // Where the old block was (its 1-based _order), or after the stats band on Home.
    const at =
      oldPositions[page.id as number] !== undefined
        ? Math.min(oldPositions[page.id as number] - 1, sections.length)
        : Math.max(sections.findIndex((s) => s.blockType === 'statsBand') + 1, 1)
    sections.splice(at, 0, split as any)
    await payload.update({ collection: 'pages', id: page.id, data: { sections, _status: 'published' }, req })
    payload.logger.info(`[b61] Added a B61 Split to "${page.title}"`)
  }
}
