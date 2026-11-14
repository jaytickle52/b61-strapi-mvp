import type { Payload, PayloadRequest } from 'payload'
import { cardsFrom, demoCta, demoHeroes, demoProse, demoSplits, ensureDemoImages, statsFrom } from './demo'
import { PROFILES } from '../seed'
import { demoChrome } from './chrome/demo'

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
        : Math.max(sections.findIndex((s) => ['statsBand', 'b61StatsBand'].includes(s.blockType as string)) + 1, 1)
    sections.splice(at, 0, split as any)
    await payload.update({ collection: 'pages', id: page.id, data: { sections, _status: 'published' }, req })
    payload.logger.info(`[b61] Added a B61 Split to "${page.title}"`)
  }
}

/*
 * Run once by the b61_prose migration. Each old simple "Text" block becomes a
 * B61 Prose in the same place, keeping its heading and body. On the Visit page
 * it also gains the demo's contact link list and the heading-beside layout.
 */
export async function upgradeDemoProse(
  payload: Payload,
  req: PayloadRequest | undefined,
  old: { page: number; pos: number; heading: string | null; body: unknown }[],
) {
  if (!old.length) return
  const settings = await payload.findGlobal({ slug: 'school-settings', depth: 0, req })
  const byPage = new Map<number, typeof old>()
  for (const o of old) byPage.set(o.page, [...(byPage.get(o.page) ?? []), o])

  for (const [pageId, blocks] of byPage) {
    const page = await payload.findByID({ collection: 'pages', id: pageId, depth: 0, req }).catch(() => null)
    if (!page) continue
    const sections = [...(page.sections ?? [])]
    for (const o of [...blocks].sort((a, b) => a.pos - b.pos)) {
      const prose =
        page.slug === 'visit'
          ? demoProse({ heading: o.heading ?? undefined, body: o.body ?? undefined, phone: settings.phone || undefined, email: settings.email || undefined, address: settings.address || undefined })
          : {
              blockType: 'b61Prose',
              headingLevel: 'auto',
              lines: o.heading ? [{ text: o.heading, emphasize: false }] : [],
              contentBlocks: o.body ? [{ type: 'body', body: o.body }] : [],
            }
      sections.splice(Math.min(o.pos - 1, sections.length), 0, prose as any)
    }
    await payload.update({ collection: 'pages', id: pageId, data: { sections, _status: 'published' }, req })
    payload.logger.info(`[b61] Converted ${blocks.length} Text block(s) to B61 Prose on "${page.title}"`)
  }
}

/*
 * Run once by the b61_cta migration. Each old "Call to action" block becomes a
 * B61 CTA Band in the same place, keeping its heading, body and button. Tone
 * maps to Surface (dark > Dark, muted > Light wash, brand > Accent, light >
 * None). On Home it also gets a demo background photo.
 */
export async function upgradeDemoCta(
  payload: Payload,
  req: PayloadRequest | undefined,
  old: { page: number; pos: number; heading: string | null; body: string | null; tone: string | null; label: string | null; url: string | null }[],
) {
  if (!old.length) return
  const settings = await payload.findGlobal({ slug: 'school-settings', depth: 0, req })
  const imgs = await ensureDemoImages(payload, { a: settings.primaryColor || '#1F3A5F', b: settings.secondaryColor || '#C8A24A' }, req)
  const tone: Record<string, 'none' | 'soft' | 'dark' | 'accent'> = { dark: 'dark', muted: 'soft', brand: 'accent', light: 'none' }
  const byPage = new Map<number, typeof old>()
  for (const o of old) byPage.set(o.page, [...(byPage.get(o.page) ?? []), o])

  for (const [pageId, blocks] of byPage) {
    const page = await payload.findByID({ collection: 'pages', id: pageId, depth: 0, req }).catch(() => null)
    if (!page) continue
    const sections = [...(page.sections ?? [])]
    for (const o of [...blocks].sort((a, b) => a.pos - b.pos)) {
      const cta = demoCta({
        heading: o.heading ?? undefined,
        body: o.body ?? undefined,
        buttonLabel: o.label ?? undefined,
        buttonUrl: o.url ?? undefined,
        surface: page.slug === 'home' ? 'dark' : tone[o.tone ?? 'dark'] ?? 'dark',
        image: page.slug === 'home' ? imgs[3] : undefined,
      })
      sections.splice(Math.min(o.pos - 1, sections.length), 0, cta as any)
    }
    await payload.update({ collection: 'pages', id: pageId, data: { sections, _status: 'published' }, req })
    payload.logger.info(`[b61] Converted ${blocks.length} Call to action block(s) to B61 CTA Band on "${page.title}"`)
  }
}

/*
 * Run once by the b61_card_grid migration. Each old card grid becomes a
 * B61 Card Grid in the same place with the same heading, intro, source,
 * count, columns, tone and hand-written cards.
 */
export async function upgradeCardGrids(
  payload: Payload,
  req: PayloadRequest | undefined,
  old: { page: number; pos: number; heading: string | null; intro: string | null; source: string | null; limit: number | null; columns: string | null; tone: string | null; cards: any[] }[],
) {
  if (!old.length) return
  const byPage = new Map<number, typeof old>()
  for (const o of old) byPage.set(o.page, [...(byPage.get(o.page) ?? []), o])
  for (const [pageId, blocks] of byPage) {
    const page = await payload.findByID({ collection: 'pages', id: pageId, depth: 0, req }).catch(() => null)
    if (!page) continue
    const sections = [...(page.sections ?? [])]
    for (const o of [...blocks].sort((a, b) => a.pos - b.pos)) {
      sections.splice(Math.min(o.pos - 1, sections.length), 0, cardsFrom(o) as any)
    }
    await payload.update({ collection: 'pages', id: pageId, data: { sections, _status: 'published' }, req })
    payload.logger.info(`[b61] Converted ${blocks.length} card grid(s) to B61 Card Grid on "${page.title}"`)
  }
}

/*
 * Run once by the b61_simple migration. Each old stats band becomes a
 * B61 Stats Band in the same place with the same heading, tone and figures.
 */
export async function upgradeStatsBands(
  payload: Payload,
  req: PayloadRequest | undefined,
  old: { page: number; pos: number; heading: string | null; tone: string | null; stats: { value: string; label: string }[] }[],
) {
  if (!old.length) return
  const byPage = new Map<number, typeof old>()
  for (const o of old) byPage.set(o.page, [...(byPage.get(o.page) ?? []), o])
  for (const [pageId, blocks] of byPage) {
    const page = await payload.findByID({ collection: 'pages', id: pageId, depth: 0, req }).catch(() => null)
    if (!page) continue
    const sections = [...(page.sections ?? [])]
    for (const o of [...blocks].sort((a, b) => a.pos - b.pos)) {
      sections.splice(Math.min(o.pos - 1, sections.length), 0, statsFrom(o) as any)
    }
    await payload.update({ collection: 'pages', id: pageId, data: { sections, _status: 'published' }, req })
    payload.logger.info(`[b61] Converted ${blocks.length} stats band(s) to B61 Stats Band on "${page.title}"`)
  }
}

/*
 * Run once by the b61_chrome migration. The old flat navigation and header
 * button move into the new Header menu (as plain links); on the demo they are
 * replaced by the demo's mega menu, dropdown and footer.
 */
export async function upgradeChrome(
  payload: Payload,
  req: PayloadRequest | undefined,
  old: { nav: { label: string; url: string }[]; button: { label: string | null; url: string | null } },
) {
  const settings = await payload.findGlobal({ slug: 'school-settings', depth: 0, req })
  const u = (url: string) => ({ type: 'url' as const, url })
  let data: any = {
    menu: old.nav.map((n) => ({ label: n.label, kind: 'link', link: u(n.url) })),
    headerButton: old.button.label ? { label: old.button.label, link: u(old.button.url || '/') } : undefined,
    utilityLinks: [{ label: 'Parents', link: u('/parents') }],
  }
  if (process.env.SEED_DEMO === 'true') {
    const programs = await payload.find({ collection: 'programs', limit: 8, sort: 'sortOrder', depth: 0, req })
    const imgs = await ensureDemoImages(payload, { a: settings.primaryColor || '#1F3A5F', b: settings.secondaryColor || '#C8A24A' }, req)
    data = demoChrome({ name: settings.schoolName, programs: programs.docs.map((p: any) => ({ name: p.name, slug: p.slug })), img: imgs[0] as number })
  }
  await payload.updateGlobal({ slug: 'school-settings', data: { ...data, _status: 'published' }, req })
  payload.logger.info('[b61] Moved navigation into the new header menu and footer')
}
