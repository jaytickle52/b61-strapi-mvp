import { createLocalReq, docAccessOperation, getPayload } from 'payload'
import config from '@payload-config'

/*
 * Checks the Publish button the way the admin decides it
 * (getDocumentPermissions: "could this person save it as published?"):
 * hidden for a Contributor, shown for an Editor. Part of the CI checks.
 *   npx payload run src/scripts/check-publish-button.ts
 * Makes two throwaway accounts and removes them again.
 */
const payload = await getPayload({ config })
const school = (await payload.find({ collection: 'schools', limit: 1, sort: 'id', depth: 0 })).docs[0]
const page = (await payload.find({ collection: 'pages', where: { school: { equals: school.id } }, limit: 1, depth: 0 })).docs[0]
const stamp = Date.now().toString(36)

const make = (role: string) =>
  payload.create({
    collection: 'users',
    data: { email: `publish-check-${role}-${stamp}@example.com`, password: `x-${stamp}-Aa1`, role: 'editor', tenants: [{ tenant: school.id, role }] } as any,
    context: { b61System: true },
  })

const canPublish = async (user: any) => {
  const req = await createLocalReq({ user: { ...user, collection: 'users' } as any }, payload)
  const res: any = await docAccessOperation({
    id: page.id,
    collection: payload.collections.pages,
    data: { ...page, _status: 'published' },
    req,
  })
  return Boolean(res.update)
}

const contributor = await make('contributor')
const editor = await make('editor')
let failed = 0
try {
  const c = await canPublish(contributor)
  const e = await canPublish(editor)
  console.log(`${c ? 'FAIL' : '  ok'}  Publish button hidden for a Contributor`)
  console.log(`${e ? '  ok' : 'FAIL'}  Publish button shown for an Editor`)
  failed = (c ? 1 : 0) + (e ? 0 : 1)
} finally {
  for (const u of [contributor, editor]) await payload.delete({ collection: 'users', id: u.id, context: { b61System: true } })
}
process.exit(failed ? 1 : 0)
