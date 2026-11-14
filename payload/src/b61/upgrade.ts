import type { Payload, PayloadRequest } from 'payload'
import { demoHeroes, ensureDemoImages } from './demo'
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
