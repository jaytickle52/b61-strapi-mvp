import type { CollectionAfterChangeHook } from 'payload'
import { ensureStandardForms } from '../forms/standard'
import type { School } from '../payload-types'

/*
 * What every school needs before anyone (or Claude, through the connector)
 * can build its site: its School settings, the standard forms (inquiry,
 * tour, contact, apply) and their pages. The demo schools get these from
 * the seed; a school added in the admin gets them here, when it's created.
 * Saving a school that is missing them (one made before this existed) adds
 * them too. Nothing that already exists is changed.
 */
export async function ensureSchoolStarter(school: School, req: Parameters<CollectionAfterChangeHook>[0]['req']) {
  const { payload } = req
  const mine = { school: { equals: school.id } }
  const settings = await payload.count({ collection: 'school-settings', where: mine, overrideAccess: true, req })
  if (settings.totalDocs === 0) {
    await payload.create({
      collection: 'school-settings',
      data: { school: school.id, schoolName: school.name } as any,
      overrideAccess: true,
      req,
    })
    payload.logger.info(`[b61] School settings created for ${school.name}`)
  }
  await ensureStandardForms(payload, school, req)
}

export const schoolStarterHook: CollectionAfterChangeHook = async ({ doc, req, context }) => {
  if (context?.b61SkipStarter) return doc
  try {
    await ensureSchoolStarter(doc as School, req)
  } catch (e: any) {
    // Logged, not thrown: saving the school again tries again.
    req.payload.logger.error(`[b61] School starter for ${doc?.name}: ${e?.message ?? e}`)
  }
  return doc
}
