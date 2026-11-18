import type { Endpoint, PayloadRequest } from 'payload'
import { isB61Admin } from '../access'
import { siteOrigin } from '../email/school'
import { themeOf } from '../b61/lib/style'
import { makePreviewToken } from './preview-token'
import { BUILDABLE_STAGES } from './stages'
import { ALL_SPOTS, buildPage, SCHOOLBOX_PAGES, spotById } from './pages'
import { cleanSpots, photoIds, type SpotValues } from './spots'

/*
 * Schoolbox setup, the Payload side (build plan step 1). Banner 61 only:
 * Base Camp calls these with a Banner 61 API key (step 2).
 *
 *   GET  /api/schools/setup/spots            the spot list (what Base Camp asks for)
 *   POST /api/schools/:id/setup/spots        save spots { spots, replace? }
 *   POST /api/schools/:id/setup/build        build the pages from the spots (drafts) { pages?: keys }
 *   POST /api/schools/:id/setup/preview-link a signed link to the draft site
 */


const deny = (req: PayloadRequest) =>
  !req.user ? Response.json({ message: 'Sign in first.' }, { status: 401 }) : !isB61Admin(req.user) ? Response.json({ message: 'Banner 61 only.' }, { status: 403 }) : null

async function schoolFor(req: PayloadRequest): Promise<any | Response> {
  const id = String(req.routeParams?.id ?? '')
  if (!/^\d+$/.test(id)) return Response.json({ message: 'Unknown school.' }, { status: 404 })
  const school = await req.payload.findByID({ collection: 'schools', id: Number(id), depth: 0, overrideAccess: true }).catch(() => null)
  return school ?? Response.json({ message: 'Unknown school.' }, { status: 404 })
}

export const spotListEndpoint: Endpoint = {
  path: '/setup/spots',
  method: 'get',
  handler: async (req) => deny(req) ?? Response.json({ pages: SCHOOLBOX_PAGES.map(({ key, title, slug }) => ({ key, title, slug })), spots: ALL_SPOTS }),
}

export const saveSpotsEndpoint: Endpoint = {
  path: '/:id/setup/spots',
  method: 'post',
  handler: async (req) => {
    const no = deny(req)
    if (no) return no
    const school = await schoolFor(req)
    if (school instanceof Response) return school
    if (!BUILDABLE_STAGES.includes(school.setupStage)) return Response.json({ message: 'This school isn’t in setup.' }, { status: 409 })
    const body: any = (await req.json?.().catch(() => null)) ?? {}
    const { spots, problems } = cleanSpots(body.spots, spotById)
    const merged: SpotValues = body.replace ? spots : { ...(school.setupSpots ?? {}), ...spots }
    // An explicit empty value clears a spot.
    if (!body.replace && body.spots && typeof body.spots === 'object')
      for (const [k, v] of Object.entries(body.spots)) if ((v == null || v === '') && k in merged) delete merged[k]
    await req.payload.update({ collection: 'schools', id: school.id, data: { setupSpots: merged } as any, overrideAccess: true, req })
    return Response.json({ ok: true, spots: merged, problems })
  },
}

/** Finds or makes the school's page with this address, then saves its sections as a draft. */
async function saveDraftPage(req: PayloadRequest, school: number, slug: string, title: string, sections: any[]) {
  const existing = (
    await req.payload.find({ collection: 'pages', where: { and: [{ school: { equals: school } }, { slug: { equals: slug } }] }, limit: 1, depth: 0, draft: true, overrideAccess: true })
  ).docs[0] as any
  if (existing) {
    await req.payload.update({ collection: 'pages', id: existing.id, draft: true, data: { title, sections, _status: 'draft' } as any, overrideAccess: true, req })
    return { slug, id: existing.id, created: false }
  }
  const page = await req.payload.create({
    collection: 'pages',
    draft: true,
    data: { title, slug, generateSlug: false, school, sections, _status: 'draft' } as any,
    overrideAccess: true,
    req,
  })
  return { slug, id: page.id, created: true }
}

export const buildEndpoint: Endpoint = {
  path: '/:id/setup/build',
  method: 'post',
  handler: async (req) => {
    const no = deny(req)
    if (no) return no
    const school = await schoolFor(req)
    if (school instanceof Response) return school
    if (!BUILDABLE_STAGES.includes(school.setupStage))
      return Response.json({ message: 'Pages are only built from spots during setup. After launch the pages are edited directly.' }, { status: 409 })

    const { payload } = req
    const body: any = (await req.json?.().catch(() => null)) ?? {}
    const mine = { school: { equals: school.id } }
    const settings: any = (await payload.find({ collection: 'school-settings', where: mine, limit: 1, depth: 0, overrideAccess: true })).docs[0] ?? {}
    const spots: SpotValues = school.setupSpots ?? {}

    // Photos must be this school's own; any other id is dropped and reported.
    const ids = photoIds(spots, ALL_SPOTS)
    const own = new Set(
      ids.length
        ? (await payload.find({ collection: 'media', where: { and: [mine, { id: { in: ids } }] }, limit: ids.length, depth: 0, overrideAccess: true })).docs.map((m: any) => m.id)
        : [],
    )
    const problems = [...new Set(ids.filter((i) => !own.has(i)))].map((i) => `Photo ${i} isn't in this school's photos, so it was left out.`)
    const forms = Object.fromEntries(
      (await payload.find({ collection: 'forms', where: mine, limit: 50, depth: 0, overrideAccess: true })).docs.map((f: any) => [f.title, f.id]),
    )
    const context = {
      schoolName: settings.schoolName || school.name,
      theme: themeOf(settings),
      forms,
      ownPhoto: (n?: number) => (n != null && own.has(n) ? n : undefined),
    }

    // Only the pages asked for, or all of them.
    const only: string[] | null = Array.isArray(body.pages) ? body.pages.map(String) : null
    const pages = SCHOOLBOX_PAGES.filter((p) => !only || only.includes(p.key))
    try {
      const built = []
      for (const page of pages) built.push({ key: page.key, ...(await saveDraftPage(req, school.id, page.slug, page.title, buildPage(page, spots, context))) })
      return Response.json({ ok: true, pages: built, problems })
    } catch (e: any) {
      payload.logger.error(`[b61] Build from spots for ${school.slug}: ${e?.message ?? e}`)
      return Response.json({ ok: false, message: e?.message ?? 'Could not build the pages.' }, { status: 400 })
    }
  },
}

export const previewLinkEndpoint: Endpoint = {
  path: '/:id/setup/preview-link',
  method: 'post',
  handler: async (req) => {
    const no = deny(req)
    if (no) return no
    const school = await schoolFor(req)
    if (school instanceof Response) return school
    if (!BUILDABLE_STAGES.includes(school.setupStage)) return Response.json({ message: 'Preview links are only for schools in setup.' }, { status: 409 })
    const { token, expires } = makePreviewToken(school.id)
    const origin = siteOrigin() || new URL(req.url ?? 'http://localhost:3000').origin
    return Response.json({ url: `${origin}/next/setup-preview?t=${encodeURIComponent(token)}`, expires: expires.toISOString() })
  },
}

export const setupEndpoints = [spotListEndpoint, saveSpotsEndpoint, buildEndpoint, previewLinkEndpoint]
