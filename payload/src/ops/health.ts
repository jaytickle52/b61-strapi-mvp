import type { Endpoint } from 'payload'

/**
 * GET /api/health: for uptime monitors. 200 {"ok":true} when the app can reach
 * the database, 503 otherwise. Never cached; says nothing about the content.
 */
export const healthEndpoint: Endpoint = {
  path: '/health',
  method: 'get',
  handler: async (req) => {
    const started = Date.now()
    const headers = { 'cache-control': 'no-store' }
    try {
      await req.payload.count({ collection: 'schools', overrideAccess: true })
      return Response.json({ ok: true, ms: Date.now() - started }, { headers })
    } catch (e) {
      req.payload.logger.error(`[b61] Health check: database unreachable (${(e as Error).message})`)
      return Response.json({ ok: false }, { status: 503, headers })
    }
  },
}
