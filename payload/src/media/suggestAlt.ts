import type { Endpoint } from 'payload'
import { canUseSchool } from '../access'

/*
 * POST /api/media/suggest-alt  { image: "data:image/...;base64,..." } or { id }
 * Asks Claude for alt text for one photo (what Alt Magic did on WordPress).
 * Off unless ANTHROPIC_API_KEY is set. The editor always sees and can change
 * the suggestion before saving; nothing is written here.
 */

const MODEL = process.env.ALT_TEXT_MODEL || 'claude-haiku-5-5'
const MAX_BYTES = 3_500_000

const PROMPT = `Write alt text for this photo on a K-12 Christian school's website.
- One sentence, under 125 characters, plain and specific: who or what is shown and what is happening.
- Don't start with "Image of" or "Photo of". Don't guess names, ages or feelings you can't see.
- If the photo contains important words (a sign, a banner), include them.
Reply with the alt text only.`

export const altTextEnabled = () => Boolean(process.env.ANTHROPIC_API_KEY)

export const suggestAltEndpoint: Endpoint = {
  path: '/suggest-alt',
  method: 'post',
  handler: async (req) => {
    if (!req.user) return Response.json({ error: 'Sign in first.' }, { status: 401 })
    if (!altTextEnabled())
      return Response.json({ error: 'Alt text suggestions are not switched on.' }, { status: 501 })
    const body = (await req.json?.().catch(() => ({}))) ?? {}

    let mediaType = ''
    let data = ''
    if (typeof body.image === 'string') {
      const m = /^data:(image\/(?:jpeg|png|webp|gif));base64,(.+)$/.exec(body.image)
      if (!m)
        return Response.json(
          { error: 'That file isn’t a photo this can describe.' },
          { status: 400 },
        )
      mediaType = m[1]
      data = m[2]
    } else if (body.id) {
      const doc: any = await req.payload
        .findByID({ collection: 'media', id: body.id, depth: 0, overrideAccess: true })
        .catch(() => null)
      if (!doc || !canUseSchool(req.user, doc.school))
        return Response.json({ error: 'Photo not found.' }, { status: 404 })
      const url: string | undefined = doc.sizes?.card?.url || doc.url
      if (!url || !String(doc.mimeType).startsWith('image/'))
        return Response.json({ error: 'Only photos can be described.' }, { status: 400 })
      const abs = /^https?:/.test(url) ? url : new URL(url, req.url).toString()
      const res = await fetch(abs)
      if (!res.ok) return Response.json({ error: 'Could not open the photo.' }, { status: 502 })
      mediaType = (res.headers.get('content-type') || 'image/jpeg').split(';')[0]
      data = Buffer.from(await res.arrayBuffer()).toString('base64')
    } else return Response.json({ error: 'No photo given.' }, { status: 400 })

    if (data.length * 0.75 > MAX_BYTES)
      return Response.json({ error: 'That photo is too large to describe.' }, { status: 413 })

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': process.env.ANTHROPIC_API_KEY!,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 120,
          messages: [
            {
              role: 'user',
              content: [
                { type: 'image', source: { type: 'base64', media_type: mediaType, data } },
                { type: 'text', text: PROMPT },
              ],
            },
          ],
        }),
      })
      const out: any = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(`Anthropic ${res.status}: ${out?.error?.message ?? 'no details'}`)
      const alt = String(out?.content?.find((c: any) => c.type === 'text')?.text ?? '')
        .trim()
        .replace(/^["']|["']$/g, '')
      if (!alt) throw new Error(`Empty reply (stop: ${out?.stop_reason ?? 'unknown'}, model: ${MODEL})`)
      return Response.json({ alt })
    } catch (err: any) {
      // console.error reaches Vercel's runtime log reliably; Payload's logger may not flush there.
      console.error('Alt text suggestion failed:', err?.message ?? err)
      // Staff-only endpoint: show the reason, so a wrong key or model name is easy to spot.
      return Response.json(
        { error: `No suggestion this time (${String(err?.message ?? 'unknown error').slice(0, 160)}). Please write it yourself.` },
        { status: 502 },
      )
    }
  },
}
