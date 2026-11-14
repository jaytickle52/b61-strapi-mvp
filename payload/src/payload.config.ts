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
import { SchoolSettings } from './globals/SchoolSettings'
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
      collections: ['pages', 'events', 'news', 'programs', 'staff'],
      globals: ['school-settings'],
    },
  },
  collections: [Pages, Events, News, Programs, Staff, Media, Users],
  globals: [SchoolSettings],
  editor: lexicalEditor(),
  secret: secret('PAYLOAD_SECRET'),
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    // Schema changes ship as migrations; production runs them on start.
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [],
  onInit: async (payload) => {
    if (process.env.SEED_DEMO === 'true') {
      await seedDemoSchool(payload, process.env.SEED_SCHOOL || 'cedar-ridge')
      await syncElementLibrary(payload).catch((e) => payload.logger.error(`[b61] Element library: ${e.message}`))
    }
  },
})
