import { getPayload } from 'payload'
import config from '@payload-config'

/*
 * Restore test only (.github/workflows/payload-backup.yml): adds a throwaway
 * Banner 61 admin to a database just restored from a backup, inside the test
 * job's own Postgres, so the smoke test can sign in and load every school and
 * every published page of the real content. Refuses to run anywhere else.
 */
if (process.env.B61_RESTORE_TEST !== 'true') throw new Error('Only for the backup restore test')
if (!/@(localhost|127\.0\.0\.1)[:/]/.test(process.env.DATABASE_URL || '')) throw new Error('Only against a local database')
const email = process.env.SMOKE_EMAIL
const password = process.env.SMOKE_PASSWORD
if (!email || !password) throw new Error('SMOKE_EMAIL and SMOKE_PASSWORD are required')

const payload = await getPayload({ config })
const { docs } = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1, depth: 0 })
if (docs[0]) await payload.update({ collection: 'users', id: docs[0].id, data: { password, role: 'admin' }, overrideAccess: true })
else await payload.create({ collection: 'users', data: { email, password, role: 'admin', name: 'Restore test' }, overrideAccess: true })
console.log('[b61] Restore test admin ready')
process.exit(0)
