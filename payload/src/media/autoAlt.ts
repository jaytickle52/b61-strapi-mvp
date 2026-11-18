import { APIError } from 'payload'
import type { CollectionAfterChangeHook, CollectionBeforeChangeHook, Endpoint, Where } from 'payload'
import { canUseSchool } from '../access'
import { selectedSchool } from '../brand/school'
import { altForPhoto, altTextEnabled } from './suggestAlt'

/*
 * Alt text written automatically (Claude), when ANTHROPIC_API_KEY is set:
 *
 * - On upload: a photo saved with no alt text gets one right after it is
 *   saved, marked "Written by AI" so staff know to check it. That lets a
 *   whole batch be uploaded at once without typing alt text for each.
 * - In bulk: "Write missing alt text" above the Photos list fills every
 *   photo at the selected school that has none (a few at a time).
 *
 * Without the key, alt text stays required, as before. Videos always need it
 * typed in. Editing the alt text by hand clears the "Written by AI" mark.
 */

const AUTO = 'b61AutoAlt'
const isPhoto = (mime?: string | null) => String(mime ?? '').startsWith('image/')

export const requireAlt: CollectionBeforeChangeHook = ({ data, originalDoc, operation, req, context }) => {
  const alt = String(data.alt ?? (operation === 'update' ? (originalDoc?.alt ?? '') : '')).trim()
  if (alt) {
    // A person changed it: it's theirs now.
    if (!context?.[AUTO] && operation === 'update' && data.alt !== undefined && data.alt !== originalDoc?.alt) data.altAuto = false
    return data
  }
  const mime = data.mimeType ?? originalDoc?.mimeType ?? req.file?.mimetype
  if (altTextEnabled() && isPhoto(mime)) return data // written after saving (autoAlt)
  // APIError keeps this wording in the admin's message (a ValidationError shows a generic one).
  throw new APIError('Add alt text: what the photo shows, in a sentence, for people who can’t see it.', 400, undefined, true)
}

/** Fills one saved photo's alt text. Returns the text, or throws with the reason. */
async function fill(doc: any, req: any): Promise<string> {
  const alt = await altForPhoto(doc, req)
  await req.payload.update({
    collection: 'media',
    id: doc.id,
    data: { alt, altAuto: true },
    overrideAccess: true,
    req,
    context: { [AUTO]: true },
  })
  return alt
}

export const autoAlt: CollectionAfterChangeHook = async ({ doc, req, context }) => {
  if (context?.[AUTO] || String(doc?.alt ?? '').trim() || !altTextEnabled() || !isPhoto(doc?.mimeType)) return doc
  try {
    const alt = await fill(doc, req)
    return { ...doc, alt, altAuto: true }
  } catch (err: any) {
    // The photo is saved anyway; it shows up under "Write missing alt text".
    console.error('Automatic alt text failed:', err?.message ?? err)
    return doc
  }
}

const missingAt = (school: number | string): Where => ({
  and: [
    { school: { equals: school } },
    { mimeType: { like: 'image/' } },
    { or: [{ alt: { exists: false } }, { alt: { equals: '' } }] },
  ],
})

/**
 * GET  /api/media/fill-alt → { enabled, missing } for the selected school.
 * POST /api/media/fill-alt → fills up to 8 of them; { filled, failed, missing, error? }.
 * The button calls POST again until nothing is missing.
 */
export const fillAltEndpoints: Endpoint[] = [
  {
    path: '/fill-alt',
    method: 'get',
    handler: async (req) => {
      if (!req.user) return Response.json({ error: 'Sign in first.' }, { status: 401 })
      const school = await selectedSchool(req)
      if (!altTextEnabled() || !school) return Response.json({ enabled: false, missing: 0 })
      const { totalDocs } = await req.payload.count({ collection: 'media', where: missingAt(school.id), overrideAccess: true })
      return Response.json({ enabled: true, missing: totalDocs, school: school.name })
    },
  },
  {
    path: '/fill-alt',
    method: 'post',
    handler: async (req) => {
      if (!req.user) return Response.json({ error: 'Sign in first.' }, { status: 401 })
      if (!altTextEnabled()) return Response.json({ error: 'Alt text suggestions are not switched on.' }, { status: 501 })
      const school = await selectedSchool(req)
      if (!school || !canUseSchool(req.user, school.id)) return Response.json({ error: 'Pick a school first.' }, { status: 400 })
      const started = Date.now()
      const batch = await req.payload.find({ collection: 'media', where: missingAt(school.id), limit: 8, depth: 0, overrideAccess: true })
      let filled = 0
      let failed = 0
      let error: string | undefined
      for (const doc of batch.docs) {
        if (Date.now() - started > 45_000) break // stay inside Vercel's time limit; the button asks again
        try {
          await fill(doc, req)
          filled++
        } catch (err: any) {
          failed++
          error = String(err?.message ?? err).slice(0, 160)
          console.error('Bulk alt text failed:', error)
        }
      }
      const { totalDocs } = await req.payload.count({ collection: 'media', where: missingAt(school.id), overrideAccess: true })
      return Response.json({ filled, failed, missing: totalDocs, error })
    },
  },
]
