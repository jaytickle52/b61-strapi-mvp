import { postgresAdapter } from '@payloadcms/db-postgres'
import { bunnyEndpoints } from './video/endpoints'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Documents } from './collections/Documents'
import { sameSchoolFolder } from './media/folders'
import { Events, News, Pages, Programs, Staff } from './collections/content'
import { Announcements } from './collections/Announcements'
import { NewsCategories } from './collections/NewsCategories'
import { CalendarFeeds } from './collections/CalendarFeeds'
import { importAllFeeds } from './events/ics-import'
import { SchoolSettings } from './collections/SchoolSettings'
import { Schools } from './collections/Schools'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { seedDemoSchools } from './seed'
import { secret } from './lib/secrets'
import { migrations } from './migrations'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { seoPlugins } from './seo/config'
import { reindexSearch } from './seo/reindex'
import { formBuilderConfig, replaceSubmissionHooks } from './forms/config'
import { FormUploads } from './collections/FormUploads'
import { EmailLog } from './collections/EmailLog'
import { emailAdapter } from './email/adapter'
import { managesAnySchool, SCHOOL_ROLES } from './access'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: ' · School website',
      icons: [{ rel: 'icon', type: 'image/svg+xml', url: '/b61-icon.svg' }],
    },
    // Banner 61 branding, the dashboard welcome and the Analytics page (Thread G).
    components: {
      graphics: { Logo: '@/brand/Logo#Logo', Icon: '@/brand/Logo#Icon' },
      beforeLogin: ['@/brand/BeforeLogin#BeforeLogin'],
      beforeDashboard: ['@/brand/Welcome#Welcome'],
      afterNavLinks: ['@/analytics/NavLink#AnalyticsNavLink'],
      views: {
        analytics: { Component: '@/analytics/AnalyticsView#AnalyticsView', path: '/analytics', meta: { title: 'Analytics' } },
      },
    },
    livePreview: {
      collections: ['pages', 'events', 'news', 'announcements', 'programs', 'staff', 'school-settings'],
    },
  },
  // Folders (Payload beta) for Photos and Documents; each school has its own.
  folders: {
    browseByFolder: true,
    // A sub-folder must sit in a folder of the same school.
    collectionOverrides: [
      ({ collection }) => ({ ...collection, hooks: { ...collection.hooks, beforeValidate: [...(collection.hooks?.beforeValidate ?? []), sameSchoolFolder] } }),
    ],
  },
  collections: [Pages, Events, CalendarFeeds, News, Announcements, Programs, Staff, NewsCategories, Media, Documents, FormUploads, EmailLog, SchoolSettings, Schools, Users],
  // Video uploads to Bunny Stream from the editor (src/video).
  endpoints: bunnyEndpoints,
  // Resend when RESEND_API_KEY is set; otherwise emails are only logged (src/email).
  email: emailAdapter,
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
    tasks: [
      {
        // Copies events in from every school's Calendar feeds, once a day.
        // Scheduled just before the daily cron (vercel.json, 10:00 UTC), so
        // that run queues and runs it.
        slug: 'importCalendars',
        label: 'Import calendar feeds',
        retries: 0,
        schedule: [{ cron: '55 9 * * *', queue: 'default' }],
        outputSchema: [{ name: 'summary', type: 'text' }],
        handler: async ({ req }) => {
          const out = await importAllFeeds(req.payload)
          return { output: { summary: out.map((o) => `${o.feed}: ${o.message}`).join('\n').slice(0, 2000) || 'No feeds' } }
        },
      },
    ],
  },
  plugins: [
    // Forms: inquiry, tour, contact, application (src/forms). Before the
    // multi-tenant plugin so its collections get a school too.
    formBuilderPlugin(formBuilderConfig),
    replaceSubmissionHooks,
    // Photos go to Vercel Blob when its token is set (Vercel), straight from
    // the browser so large files aren't capped by the server; otherwise to disk.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: {
        media: { disablePayloadAccessControl: true },
        documents: { disablePayloadAccessControl: true, prefix: 'documents' },
        // Served through Payload, so only signed-in staff can open them.
        'form-uploads': { prefix: 'form-uploads' },
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
      clientUploads: true,
    }),
    // One app, many schools. Everything a school edits carries its school;
    // editors only see their own schools, Banner 61 admins see all of them.
    // SEO fields, redirects from old addresses, site search (src/seo). Before
    // the multi-school plugin, so Redirects and the Search index are per school.
    ...seoPlugins,
    multiTenantPlugin({
      tenantsSlug: 'schools',
      tenantField: { name: 'school' },
      tenantSelectorLabel: 'School',
      collections: {
        pages: {},
        events: {},
        'calendar-feeds': {},
        news: {},
        'news-categories': {},
        announcements: {},
        programs: {},
        staff: {},
        media: {},
        documents: {},
        // Folders for photos and documents belong to a school too.
        'payload-folders': {},
        'school-settings': { isGlobal: true },
        forms: {},
        'form-submissions': {},
        'form-uploads': {},
        // Its own optional school field: Banner 61's own emails have none.
        'email-log': { customTenantField: true },
        redirects: {},
        search: {},
      },
      userHasAccessToAllTenants: (user: any) => user?.role === 'admin',
      // Each school on an account carries a role (src/access.ts). School
      // Admins may edit this list; src/collections/Users.ts limits them to
      // their own schools.
      tenantsArrayField: {
        includeDefaultField: true,
        arrayFieldAccess: {
          create: ({ req }) => managesAnySchool(req.user),
          update: ({ req }) => managesAnySchool(req.user),
        },
        rowFields: [
          {
            name: 'role',
            type: 'select',
            required: true,
            defaultValue: 'editor',
            options: SCHOOL_ROLES,
            saveToJWT: true,
          },
        ],
      },
    }),
  ],
  onInit: async (payload) => {
    // On Vercel the demo is seeded during the build (scripts/seed.ts), not on every cold start.
    if (process.env.VERCEL) return
    if (process.env.SEED_DEMO === 'true') await seedDemoSchools(payload)
    await reindexSearch(payload)
  },
})
