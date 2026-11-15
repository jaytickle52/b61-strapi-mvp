import type { CollectionBeforeDeleteHook, Endpoint, Field } from 'payload'
import { APIError } from 'payload'
import { canUseSchool } from '../access'
import { findUsage, type UsageTarget } from './find'

/** Sidebar panel: "Used on: Home › Hero › Photo …" with links. */
export const usageField = (target: UsageTarget): Field => ({
  name: 'usage',
  type: 'ui',
  admin: {
    position: 'sidebar',
    components: { Field: { path: '@/usage/UsagePanel#UsagePanel', clientProps: { target } } },
  },
})

/** GET /api/<collection>/:id/usage, for the panel. */
export const usageEndpoint = (target: UsageTarget): Endpoint => ({
  path: '/:id/usage',
  method: 'get',
  handler: async (req) => {
    if (!req.user) return Response.json({ error: 'Sign in first.' }, { status: 401 })
    const id = req.routeParams?.id as string
    const doc: any = await req.payload
      .findByID({ collection: target, id, depth: 0, overrideAccess: true, draft: true })
      .catch(() => null)
    if (!doc) return Response.json({ error: 'Not found.' }, { status: 404 })
    if (!canUseSchool(req.user, doc.school))
      return Response.json({ error: 'Not your school.' }, { status: 403 })
    const home = target === 'pages' && doc.slug === 'home'
    return Response.json({ hits: await findUsage(req.payload, target, id, doc.school), home })
  },
})

/**
 * Stops a photo, document or page being deleted while the site still uses it,
 * because links and photos inside text would otherwise break silently.
 * The message says where it is used, so it can be swapped out first.
 */
export const refuseDeleteWhenUsed =
  (target: UsageTarget): CollectionBeforeDeleteHook =>
  async ({ req, id }) => {
    if (req.context?.b61AllowDelete) return
    const doc: any = await req.payload
      .findByID({ collection: target, id, depth: 0, overrideAccess: true, draft: true, req })
      .catch(() => null)
    if (!doc) return
    if (target === 'pages' && doc.slug === 'home')
      throw new APIError(
        'This is the home page, so it can\u2019t be deleted. Change its sections instead.',
        409,
        null,
        true,
      )
    const hits = await findUsage(req.payload, target, id, doc.school)
    if (!hits.length) return
    const name = target === 'media' ? 'photo' : target === 'documents' ? 'document' : 'page'
    const list = hits
      .slice(0, 5)
      .map(
        (h) =>
          `${h.title} (${h.where[0]}${h.where.length > 1 ? ` and ${h.where.length - 1} more` : ''})`,
      )
      .join('; ')
    throw new APIError(
      `This ${name} is still used on the website: ${list}${hits.length > 5 ? `, and ${hits.length - 5} more` : ''}. Replace it there first, then delete it.`,
      409,
      null,
      true,
    )
  }
