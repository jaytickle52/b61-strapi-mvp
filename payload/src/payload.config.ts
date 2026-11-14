import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Events, News, Pages, Programs, Staff } from './collections/content'
import { SchoolSettings } from './collections/SchoolSettings'
import { Schools } from './collections/Schools'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { seedDemoSchools } from './seed'
import { secret } from './lib/secrets'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' · School website' },
    livePreview: {
      collections: ['pages', 'events', 'news', 'programs', 'staff', 'school-settings'],
    },
  },
  collections: [Pages, Events, News, Programs, Staff, Media, SchoolSettings, Schools, Users],
  editor: lexicalEditor(),
  secret: secret('PAYLOAD_SECRET'),
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    // Never change the database schema on the fly; every change is a migration.
    push: false,
    // Schema changes ship as migrations. On Vercel they run during the build
    // (vercel-build); on an always-on server they run when it starts.
    prodMigrations: process.env.VERCEL ? undefined : migrations,
  }),
  sharp,
  // Scheduled publishing and other queued work. On Vercel a cron job calls
  // /api/payload-jobs/run (vercel.json); elsewhere the server runs it itself.
  jobs: {
    access: {
      run: ({ req }) => Boolean(req.user) || (Boolean(process.env.CRON_SECRET) && req.headers.get('authorization') === `Bearer ${process.env.CRON_SECRET}`),
    },
    autoRun: process.env.VERCEL ? undefined : [{ cron: '* * * * *', queue: 'default', limit: 20 }],
  },
  plugins: [
    // Photos go to Vercel Blob when its token is set (Vercel), straight from
    // the browser so large files aren't capped by the server; otherwise to disk.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: { disablePayloadAccessControl: true } },
      token: process.env.BLOB_READ_WRITE_TOKEN,
      clientUploads: true,
    }),
    // One app, many schools. Everything a school edits carries its school;
    // editors only see their own schools, Banner 61 admins see all of them.
    multiTenantPlugin({
      tenantsSlug: 'schools',
      tenantField: { name: 'school' },
      tenantSelectorLabel: 'School',
      collections: {
        pages: {},
        events: {},
        news: {},
        programs: {},
        staff: {},
        media: {},
        'school-settings': { isGlobal: true },
      },
      userHasAccessToAllTenants: (user: any) => user?.role === 'admin',
    }),
  ],
  onInit: async (payload) => {
    // On Vercel the demo is seeded during the build (scripts/seed.ts), not on every cold start.
    if (process.env.SEED_DEMO === 'true' && !process.env.VERCEL) await seedDemoSchools(payload)
  },
})
