import type { Endpoint } from 'payload'
import { canUseSchool } from '../access'
import { bunnyConfig, createUpload, videoStatus } from './bunny'

const GUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Bunny Stream uploads from the editor (src/video):
 *   GET  /api/bunny/config            → { enabled }
 *   POST /api/bunny/upload  { school, title }  → a signed upload for the browser
 *   GET  /api/bunny/status?video=…    → processing state in plain words
 */
export const bunnyEndpoints: Endpoint[] = [
  {
    path: '/bunny/config',
    method: 'get',
    handler: async (req) => Response.json({ enabled: Boolean(req.user && bunnyConfig()) }),
  },
  {
    path: '/bunny/upload',
    method: 'post',
    handler: async (req) => {
      if (!req.user) return Response.json({ message: 'Sign in first.' }, { status: 401 })
      if (!bunnyConfig()) return Response.json({ message: 'Video uploads are not switched on yet.' }, { status: 503 })
      const body = (await req.json?.().catch(() => ({}))) ?? {}
      if (body.school == null || !canUseSchool(req.user, body.school))
        return Response.json({ message: 'You can only upload videos for your own school.' }, { status: 403 })
      try {
        const ticket = await createUpload(req.payload, body.school, String(body.title ?? ''))
        return Response.json(ticket)
      } catch (err: any) {
        req.payload.logger.error({ err }, 'Bunny upload ticket failed')
        // The details stay in the log; editors don't need the video service's name or codes.
        return Response.json({ message: "Couldn't start the upload. Please try again in a minute." }, { status: 502 })
      }
    },
  },
  {
    path: '/bunny/status',
    method: 'get',
    handler: async (req) => {
      if (!req.user) return Response.json({ message: 'Sign in first.' }, { status: 401 })
      const id = String(req.searchParams?.get('video') ?? '')
      if (!GUID.test(id) || !bunnyConfig()) return Response.json({ message: 'Unknown video.' }, { status: 400 })
      try {
        return Response.json(await videoStatus(id))
      } catch (err: any) {
        return Response.json({ message: `Couldn't check the video: ${err?.message ?? err}` }, { status: 502 })
      }
    },
  },
]
