import type { CollectionBeforeDeleteHook, Endpoint } from 'payload'
import { canPublishAt } from '../access'
import { runFeed } from './ics-import'

/** POST /api/calendar-feeds/:id/import — the "Import now" button. */
export const importFeedEndpoint: Endpoint = {
  path: '/:id/import',
  method: 'post',
  handler: async (req) => {
    if (!req.user) return Response.json({ message: 'Sign in first.' }, { status: 401 })
    const id = req.routeParams?.id as string
    const feed: any = await req.payload.findByID({ collection: 'calendar-feeds', id, depth: 0, overrideAccess: true }).catch(() => null)
    if (!feed) return Response.json({ message: 'Calendar feed not found.' }, { status: 404 })
    if (!canPublishAt(req.user, feed.school)) return Response.json({ message: 'You can\'t import calendars for this school.' }, { status: 403 })
    const r = await runFeed(req.payload, feed)
    return Response.json({ ok: r.ok, message: r.message, result: r.result ?? null }, { status: r.ok ? 200 : 502 })
  },
}

/** Deleting a feed removes the events it brought in (before the link to it is cleared). */
export const removeImportedEvents: CollectionBeforeDeleteHook = async ({ id, req }) => {
  await req.payload.delete({
    collection: 'events',
    where: { importedFrom: { equals: id } },
    overrideAccess: true,
    req,
    context: { b61Import: true },
  })
}
