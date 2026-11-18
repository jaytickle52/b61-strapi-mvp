import type { PayloadRequest } from 'payload'
import { z } from 'zod/v3'
import { isB61Admin } from '../access'
import { siteOrigin } from '../email/school'
import { makePreviewToken } from '../setup/preview-token'
import { BUILDABLE_STAGES } from '../setup/stages'

/*
 * previewLink: the signed setup preview link for a school in Setup or Review
 * (src/setup/preview-token.ts), so Claude can hand it over after a build.
 * The link shows that school's drafts, without signing in, until it expires
 * (14 days) or the school goes Live. Banner 61 admins' keys only.
 */

type Out = { content: { type: 'text'; text: string }[] }
const text = (t: string): Out => ({ content: [{ type: 'text', text: t }] })

export const previewLink = {
  name: 'previewLink',
  description:
    "Get a signed preview link for a school in Setup or Review: it shows that school's draft pages, without signing in, for 14 days. Give `school` (id). Share it only with that school's leaders.",
  parameters: { school: z.union([z.string(), z.number()]) } as any,
  handler: async (args: Record<string, unknown>, req: PayloadRequest): Promise<Out> => {
    if (!isB61Admin(req.user)) return text('Only Banner 61 admins can make preview links.')
    const id = String(args.school ?? '')
    if (!/^\d+$/.test(id)) return text('Give the school id.')
    const school: any = await req.payload.findByID({ collection: 'schools', id: Number(id), depth: 0, overrideAccess: true }).catch(() => null)
    if (!school) return text('No school with that id.')
    if (!BUILDABLE_STAGES.includes(school.setupStage))
      return text(`${school.name} isn't in Setup or Review, so it has no preview link. Set its Schoolbox setup stage in Banner 61 > Schools.`)
    const { token, expires } = makePreviewToken(school.id)
    const origin = siteOrigin() || new URL(req.url ?? 'http://localhost:3000').origin
    return text(`Preview link for ${school.name} (shows drafts; expires ${expires.toISOString().slice(0, 10)}):\n${origin}/next/setup-preview?t=${encodeURIComponent(token)}`)
  },
}
