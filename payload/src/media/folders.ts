import type { CollectionBeforeValidateHook } from 'payload'
import { ValidationError } from 'payload'

const idOf = (v: unknown) => (v && typeof v === 'object' ? (v as any).id : v)

/**
 * Folders (Payload beta) are per school, but Payload doesn't check that a photo,
 * document or sub-folder is put in a folder of the SAME school. This does:
 * a folder id from another school is refused.
 */
export const sameSchoolFolder: CollectionBeforeValidateHook = async ({
  data,
  originalDoc,
  req,
  collection,
}) => {
  const folder = idOf(data?.folder)
  if (folder == null || folder === '') return data
  const school = idOf(data?.school ?? originalDoc?.school)
  const found: any = await req.payload
    .findByID({ collection: 'payload-folders', id: folder, depth: 0, overrideAccess: true, req })
    .catch(() => null)
  if (!found || (school != null && String(idOf(found.school)) !== String(school))) {
    throw new ValidationError({
      collection: collection.slug,
      errors: [{ path: 'folder', message: 'That folder belongs to another school.' }],
    })
  }
  return data
}
