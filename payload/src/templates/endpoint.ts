import type { Endpoint } from 'payload'
import { canUseSchool, idOf } from '../access'
import { PAGE_TEMPLATES, templateByKey } from './pages'
import { themeOf } from '../b61/lib/style'

/** GET /api/pages/templates — the list the picker shows. */
export const listTemplatesEndpoint: Endpoint = {
  path: '/templates',
  method: 'get',
  handler: async (req) => {
    if (!req.user) return Response.json({ message: 'Sign in first.' }, { status: 401 })
    return Response.json({ templates: PAGE_TEMPLATES.map(({ key, label, description, title }) => ({ key, label, description, title })) })
  },
}

/**
 * POST /api/pages/from-template { template, school, title? } — creates a
 * draft page from a template and returns its id. Runs as the signed-in user,
 * so the usual rules apply (Contributors get a draft, like any page they make).
 */
export const fromTemplateEndpoint: Endpoint = {
  path: '/from-template',
  method: 'post',
  handler: async (req) => {
    const user = req.user
    if (!user) return Response.json({ message: 'Sign in first.' }, { status: 401 })
    const body: any = (await req.json?.().catch(() => null)) ?? {}
    const template = templateByKey(String(body.template ?? ''))
    if (!template) return Response.json({ message: 'Pick a template.' }, { status: 400 })
    const school = idOf(body.school)
    if (school == null) return Response.json({ message: 'Pick a school first (top of the sidebar).' }, { status: 400 })
    if (!canUseSchool(user, school)) return Response.json({ message: 'You don\'t have access to that school.' }, { status: 403 })

    const { payload } = req
    const mine = { school: { equals: school } }
    const settings: any = (await payload.find({ collection: 'school-settings', where: mine, limit: 1, depth: 0, overrideAccess: true })).docs[0] ?? {}
    const schoolDoc: any = await payload.findByID({ collection: 'schools', id: school, depth: 0, overrideAccess: true }).catch(() => null)
    const forms = Object.fromEntries(
      (await payload.find({ collection: 'forms', where: mine, limit: 50, depth: 0, overrideAccess: true })).docs.map((f: any) => [f.title, f.id]),
    )

    // The template's address, or the next free one ("admissions-2").
    const title = String(body.title || '').trim().slice(0, 120) || template.title
    const base =
      title === template.title
        ? template.slug
        : title.toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || template.slug
    const taken = new Set(
      (
        await payload.find({ collection: 'pages', where: mine, pagination: false, depth: 0, draft: true, overrideAccess: true, select: { slug: true } })
      ).docs.map((p: any) => p.slug),
    )
    let slug = base
    for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`

    const sections = template.sections({
      schoolName: settings.schoolName || schoolDoc?.name || 'Our School',
      tagline: settings.tagline,
      phone: settings.phone,
      email: settings.email,
      address: settings.address,
      theme: themeOf(settings),
      forms,
    })

    try {
      const page = await payload.create({
        collection: 'pages',
        draft: true,
        data: { title: slug === template.slug || title !== template.title ? title : `${title} (new)`, slug, generateSlug: false, school, sections, _status: 'draft' } as any,
        user,
        overrideAccess: false,
        req,
      })
      return Response.json({ ok: true, id: page.id, slug })
    } catch (e: any) {
      payload.logger.error(`[b61] Page from template "${template.key}": ${e?.message ?? e}`)
      return Response.json({ ok: false, message: e?.message ?? 'Could not create the page.' }, { status: 400 })
    }
  },
}
