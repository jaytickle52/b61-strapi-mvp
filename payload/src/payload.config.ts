import { syncElementLibrary } from './b61/library'
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
import { secret } from './lib/secrets'
import { seedDemoSchool } from './seed'
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
    // Schema changes ship as migrations; production runs them on start.
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [
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
    if (process.env.SEED_DEMO === 'true') {
      const keys = (process.env.SEED_SCHOOLS || 'cedar-ridge,harbor-oaks').split(',').map((k) => k.trim()).filter(Boolean)
      for (const key of keys) {
        const school = await seedDemoSchool(payload, key)
        if (school) await syncElementLibrary(payload, school).catch((e) => payload.logger.error(`[b61] Element library: ${e.message}`))
      }
    }
  },
})
