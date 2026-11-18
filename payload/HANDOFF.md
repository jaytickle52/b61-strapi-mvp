# B61 Schools on Payload: handoff (14 Nov 2026)

Bring this into a new chat to continue. Owner: Jay Tickle (Banner 61).

## What this is

Banner 61 is moving its K-12 Christian school websites from WordPress + Breakdance to
**Payload CMS 3**. One Next.js app serves the editor (`/admin`) and every school's public
site. The Banner 61 Elements (the Breakdance plugin, repo `jaytickle52/banner61-elements`,
plugin 1.77.1) are ported so the sites look the same; the plugin's CSS is copied unchanged.

- **Repo:** `jaytickle52/b61-strapi-mvp`, folder `payload/` (the other folders are the
  older Strapi build, kept for comparison). Branch `main` deploys automatically.
- **Live:** https://b61-schools.vercel.app (public; Vercel project `b61-schools`, team
  "Jay Tickle's projects", Hobby plan). Neon Postgres (Free plan) and Vercel Blob (public store)
  are connected to the project.
- **Demo schools:** Cedar Ridge Christian Academy (default) and Harbor Oaks Classical School.
  On the shared demo address, `/next/school/<slug>` picks a school (`cedar-ridge`,
  `harbor-oaks`). Element library page at `/elements` shows every element.
- **Railway** (project "spectacular-commitment", service `b61-payload-mvp`) still runs
  the same code from `main`. To be shut down once Jay is happy with Vercel.

## Decisions Jay has made

- Payload over Strapi.
- **One app, many schools** (Payload multi-tenant plugin), not one app per school.
- **Vercel + Neon + Vercel Blob** for the school sites. Railway only if the future parent
  portal needs long-running background work.
- School staff see both the **Content** and **Design** tabs of every element.
- One consistent editing foundation for all elements: the **B61 editing kit** plus
  `src/b61/EDITING-STANDARD.md` (also saved to the Payload project as "B61 editing standard").
- Element names show without the "B61" prefix (internal slugs keep it: `b61Hero` etc.).
- Carousel slides and tab panels offer only **Testimonial, Split, Prose**. Section offers
  all non-container elements plus Rail.
- Split, Prose and CTA Band use **one Content editor** (rich text) whose + / slash menu
  offers **Pull quote, Icon list, Emphasis** (Prose also Divider). Built-ins that break the
  design are removed. Intros and item bodies use a short editor.
- Header menu items: Link / Dropdown / Mega menu (2-4 columns + optional photo card); phones
  get a slide-in menu. Footer: link columns, contact, social, note, legal line.
- The demo database could be rebuilt (done). Neon on Free for now; Launch before a real school.

## How it's built (where to look)

- `src/b61/kit/`: the editing kit. `element.ts` (`defineElement`: Content/Design tabs and
  Design panels), `controls.ts` (segmented, dropdown, toggle, step, link; show/hide rules as
  data), `groups.ts` (shared field groups), `body.ts` (the Content editor, `toBody`/`fromBody`),
  `editors.ts` (short editor), `admin/` (custom admin components, `kit.scss`), `render/`
  (shared markup helpers, LiteVideo, carousel engine, `Inner.tsx` for container children).
- `src/b61/elements/<name>/`: one folder per element: `fields.ts`, component, the plugin CSS
  copy, `*-instance.css`. 17 elements: Hero, Split, Prose, Card Grid, Stats Band, Gallery,
  Testimonial, Accordion, Tabs, Pillars, Carousel, Section, Rail, CTA Band, Framed Image,
  Button Bar, Divider. `src/b61/inner.ts` = what containers accept.
- `src/b61/chrome/`: header, footer, their fields and demo content.
- `src/collections/`: Schools, Users (role admin/editor; first account = admin),
  SchoolSettings (one per school), content.ts (Pages, Events, News, Programs, Staff), Media.
- `src/lib/data.ts`: every public read is scoped to the current school (`currentSchool()`:
  domain match → `b61-school` cookie → `DEFAULT_SCHOOL` → first school).
- `src/seed.ts`, `src/b61/demo.ts`, `src/b61/library.ts`: demo schools and the Element library.
- `src/payload.config.ts`: multi-tenant plugin, Vercel Blob (only when its token is set),
  jobs (cron on Vercel, autoRun elsewhere), `push: false`, migrations on start only off Vercel.
- `vercel.json`: daily cron (Hobby limit) to `/api/payload-jobs/run`, so scheduled publishing
  runs once a day (~5 AM ET). On Pro, set it back to every 5 minutes.
- `package.json`: `vercel-build` = migrate → seed demo → next build.
  Create migrations with `npm run migrate:create <name>` (turns on the Blob adapter so the
  Media schema matches production).
- Migration history: initial, `blob_object_key`, `forms_email` (Thread B), `seo_search` (Thread C),
  `media_documents_folders` (Thread D), `permissions_invites` (Thread E).

## Forms and email (Thread B)

- `src/forms/`: Form Builder plugin set up for schools (`config.ts`), friendlier question
  editing with "Show only when" rules (`fields.ts`), the rules shared by browser and server
  (`logic.ts`), the submit check (`submit.ts`: honeypot, signed time stamp, optional
  Cloudflare Turnstile, required/format checks, files, signatures), the CSV export
  (`export.ts`), and the four standard forms + pages (`standard.ts`: Inquire, Schedule a
  tour, Contact, Apply), created for any school with no forms.
- Visitors post to `/next/form` (`src/app/(frontend)/next/form/route.ts`); the API itself
  refuses anonymous submissions. Forms, submissions and Form files are staff-only and per school.
- Form files (`collections/FormUploads.ts`) are separate from Media, served only to signed-in
  staff, and get long random names on Blob (Vercel Blob has no private files). 4 MB per
  submission because Vercel caps request bodies at 4.5 MB.
- Element: `src/b61/elements/form/` (Form.tsx server, FormClient.tsx browser, form.css).
- `src/email/`: Resend adapter (log-only without `RESEND_API_KEY`), Email log collection (90
  days), the school sender and branded layout (`school.ts`), the "Send test email" button in
  School settings > Email, and branded password-reset emails (`collections/Users.ts`).
- New settings: `RESEND_API_KEY`, `EMAIL_FROM_ADDRESS`, `EMAIL_FROM_NAME`, optional
  `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` (see `.env.example`).

## SEO and search (Thread C)

- `src/seo/config.ts`: the official SEO, Redirects and Search plugins, set up for schools.
  Pages, Programs, Events and News get an **SEO** tab (title, description, share image,
  "Hide this page from search engines"). The old Pages "SEO description" moved into it.
- **School settings > Search engines:** default share image, Google verification code,
  "Hide this whole site from search engines". Demo/preview addresses (`*.vercel.app`,
  `*.railway.app`, localhost) and schools without a domain are always hidden, so only a
  school's real domain is indexed.
- `src/seo/metadata.ts` (titles, descriptions, canonical address, share cards, noindex),
  `src/seo/schema.ts` + `JsonLd.tsx` (School on every page, Event and NewsArticle on detail pages).
- `/sitemap.xml` and `/robots.txt` are per school (route handlers in `src/app/(frontend)/`).
- **Redirects** (Website > Redirects, per school): old address → a page here or any link,
  301 by default. Pasting a whole old link is fine; it is saved as a lowercase path. They
  apply only when nothing else lives at the address (catch-all `[...path]` route and the
  detail pages' not-found path, `src/seo/redirect.ts`).
- **Site search** at `/search` (search icon in the header): pages, programs, events, news of
  the current school only; parents-only and hidden pages are left out. The index updates on
  save; `src/seo/reindex.ts` adds anything published but missing (runs in the Vercel build
  step and on start elsewhere).

## Media (Thread D)

- `collections/Media.ts`: alt (required), caption, credit; originals capped at 2560px and
  re-compressed; WebP sizes thumbnail 400 / card 800 / wide 1200 / hero 1800, plus `social`
  (1200x630 JPEG crop on the focal point) for link previews (Thread C can use it for og:image).
  `b61/lib/media.ts` `imgProps` builds srcset from the uncropped sizes only.
- `media/regenerate.ts`: during each build, photos missing the current sizes get them
  (100 per build). Runs from `scripts/seed.ts` whether or not SEED_DEMO is on.
- `collections/Documents.ts`: PDFs and office files, per school, public. Link control
  (`kit/controls.ts link()`) has Page / Document / Web address; both rich-text editors link to
  pages and documents; `kit/render/converters.ts` turns those links into real URLs (internal
  page links in text used to render as "#").
- Folders (Payload beta) on Media and Documents, per school (`payload-folders` is a tenant
  collection); `media/folders.ts` refuses a folder from another school.
- `usage/`: "Where this is used" for photos, documents and pages, reading every field of the
  school's pages, events, news, programs, staff, School settings and forms (published + draft),
  including photos and links inside the Content editor. Deleting anything still used is refused
  with the list; the home page can't be deleted. Seeds pass `context.b61AllowDelete`.
- `media/suggestAlt.ts` + `SuggestAlt.tsx`: "Suggest alt text" under Alt text, via Claude, only
  when `ANTHROPIC_API_KEY` is set (`ALT_TEXT_MODEL` optional).

## People, roles and invites (Thread E)

- Two account types (`users.role`): **Banner 61 admin** (every school) and **school account**.
  A school account lists its schools, each with a role (`users.tenants[].role`):
  **School Admin** (edits, publishes, invites and manages people at that school),
  **Editor** (edits and publishes), **Contributor** (drafts and photo/document uploads only;
  can't publish, unpublish or delete; can't see forms, form answers or the Email log, or change
  settings or redirects). Accounts made before Thread E became Editors.
- Rules live in `src/access.ts` (`roleAt`, `canPublishAt`, `canManagePeopleAt`, `draftWriters`,
  `publishersOnly`, `guardPublishing`). The admin hides the Publish button from Contributors
  because it asks the same access rule.
- `src/collections/Users.ts`: School Admins see and manage only people at their schools,
  never Banner 61 admins; they can't touch other schools on an account, change their own
  role, set someone's email or password, or delete someone who also works elsewhere.
  The Users list is hidden from Editors and Contributors (they use their own account page).
- Invites (`src/users/`): "Invite someone" above the Users list → `POST /api/users/invite`.
  New people get a branded email with a set-password link good for 7 days (it reuses
  `/admin/reset/<token>`); existing accounts get the school added and a "you now have
  access" email. "Resend invite" on the account page while they haven't signed in.
  `invitedAt` and `lastSignInAt` show in the sidebar and list.
- Checks: `scripts/permissions.mjs` (API checks per role; reads invite emails from
  `EMAIL_PREVIEW_DIR`) and `src/scripts/check-publish-button.ts`; both run in CI after the
  smoke test.
- Two-factor sign-in is **not built yet**: waiting on Jay's choice (install the community
  `payload-totp` plugin, or build our own).

## Branding, dashboard and Analytics (Thread G)

Ask AI was dropped from this thread at Jay's request (14 Nov 2026).

- `src/brand/`: Banner 61 look for the editor. `Logo.tsx` (login page; `Icon` in the
  breadcrumb), `BeforeLogin.tsx`, `brand.scss` (imported by
  `custom.scss`). Brand: ink #3F3B4C, paper #F0F1EE, text #101827, accent #EE5758. The accent is
  only for marks and thin lines (white on it is under 4.5:1); primary buttons use the ink. Since
  PR #43 the real logo files are used: `public/b61-logo.png` (light theme), `b61-logo-dark.png`
  (light letters, dark theme), `b61-icon.png` (round flag, menu), `b61-favicon-32.png` and
  `apple-touch-icon-b61.png` (browser tab). `B61_SUPPORT_EMAIL=projects@banner61.com` set in
  Vercel 17 Nov 2026.
- `src/brand/Welcome.tsx` (dashboard, `beforeDashboard`): greeting, shortcuts (by role),
  "Last 7 days" (website visitors when GA is connected, form answers for Editors/School Admins),
  "Not published yet" (latest drafts across pages, news, events, programs, staff), help line.
  `src/brand/school.ts`: `selectedSchool()` reads the admin's School menu (`payload-tenant`
  cookie), falling back to the account's first school.
- `src/brand/support.ts`: optional `B61_SUPPORT_EMAIL` and `B61_HELP_URL` (help guides, Thread H)
  show on the sign-in page and dashboard; hidden when unset.
- `src/analytics/`: Admin > Analytics (`/admin/analytics`, menu link `NavLink.tsx`). 7 / 28 / 90
  days vs the period before: visitors, visits, pages viewed, average visit, a daily chart, most
  viewed pages, how people found the site, devices, plus form answers from our own database
  (Editors/School Admins). `ga.ts` talks to the GA4 Data API with the Banner 61 service account
  (`GA_SERVICE_ACCOUNT_JSON`: the key file JSON, or base64 of it) using Node's crypto, no extra
  packages. `report.ts` caches each school's numbers for an hour. Demo schools without a property
  show clearly-labelled sample numbers (`sample.ts`).
- School settings > Analytics: **tag ID** (`gaMeasurementId`, G-…; adds gtag.js to the live site,
  `Tag.tsx`, never on demo/preview addresses, staff previews, or while hidden from search) and
  **property ID** (`gaPropertyId`; Banner 61 admins only, not publicly readable). The tab tells
  Banner 61 admins which service-account email to add as a Viewer in the school's GA property.
- Migration `20261115_010944_thread_g_analytics` (IF NOT EXISTS, safe to run twice).
- Smoke test now also opens `/admin/analytics` (each period) and School settings.

## Click-to-edit preview

- Jay chose to hold off on Puck (visual drag-and-drop editor) and close the gap inside Payload.
- In the live preview: hover outlines an element with "Edit <name>"; click opens it in the form,
  closes the other sections, scrolls and flashes it (works inside Tabs, Carousel slides and
  Section columns). Opening a section in the form scrolls the preview to it. Header/footer
  clicks open those tabs in School settings. See EDITING-STANDARD.md section 12.
- Code: `src/b61/kit/preview/` (EditMark, EditOverlay, withPreviewFocus) and
  `src/b61/kit/admin/PreviewFocus.tsx`. No database change.

## Layout options from the Wake Christian review (wake-patterns branch)

All in one PR. Details and the rules in `src/b61/EDITING-STANDARD.md` section 16; CSS in
`src/b61/styles/patterns.css`; one additive migration (`*_wake_patterns`). Banner 61-only layout
choices live in each element's **Design > Advanced** (`defineElement` `design.advanced`,
`bannerOnly()`): Card Grid heading beside / staggered / run off the edge / text on hover /
accent tint; Section duotone; Stats Band right or left part + pull up. For school staff: Hero
changing words, buttons that play a video in a pop-up, Split badge, Side buttons (School
settings > Header), pop-up announcements. Style dial **Menu on wide screens** (Slide-in panel).
Demo page `/layout-ideas` on both demo schools (`src/b61/patterns-demo.ts`, created once).

## Layout options from the Canterbury review (canterbury-patterns branch)

Accent heading font (School settings > Look), Card Grid inside Tabs, Card Grid "Larger middle
card", duotone photos on Card Grid and Gallery, a shared Scroll story arrangement (first used by
Pillars > Advanced) and a new Logos element. Rules in `EDITING-STANDARD.md` section 17; one
additive migration (`*_canterbury_patterns`); demo page `/more-layout-ideas`.

## MCP connector (PR #37)

Claude (or any MCP client) reads and edits school content at `/api/mcp`, like Respira for the
WordPress sites. Code in `src/mcp/` (`config.ts`, `pages.ts`), checks in `scripts/mcp.mjs` (CI).
- **Keys:** Banner 61 > MCP keys, Banner 61 admins only; a key acts as the admin who made it
  (normal access rules + school scoping apply). Every switch on a new key starts off; turn on
  what the key may do. Delete a key to switch it off.
- **Drafts only:** writes to pages, news, events, programs, staff, announcements and school
  settings are forced to drafts (`draftsOnlyOverMcp`); the live site changes only on Publish.
  No delete tools. Users, form answers, form files and the email log are not offered.
- **Pages:** the generated page create/update tools were ~170 KB each, so pages use custom
  `createPage` / `updatePage` (data as JSON) and `pageSections` (compact field outline).
  `editorLinks` returns the editor address after a change.
- **Signing in:** `Authorization: Bearer <key>`, or `/api/mcp?key=<key>` for clients that can't
  send headers (can appear in request logs; prefer the header).
- Any new collection Claude should see goes in `collections` in `src/mcp/config.ts` (and in
  `MCP_DRAFT_COLLECTIONS` if it has drafts). Changing it changes the keys table: make a migration.

## Working rules with Jay

- End work replies with a 2-line status: what was done, and the one thing needed from Jay.
- Never type passwords, keys or secrets; Jay pastes them. Account sign-ins, installs,
  marketplace integrations and creating accounts are his. Ask before changing account or
  project settings.
- Don't share jay@hourglassk12.com externally without approval.
- Plain language; Jay isn't a developer.

## Operations (PR #43, 17 Nov 2026)

- **Backups:** `.github/workflows/payload-backup.yml`, guide `docs/BACKUPS.md`. Nightly 07:17 UTC:
  `pg_dump` (Postgres 18 tools) of the live Neon database + every Vercel Blob file
  (`scripts/backup/blob-download.mjs`, manifest with sha256), both encrypted with
  `BACKUP_PASSPHRASE` (gpg AES-256) and kept as run artifacts (30 days; Sunday 90). The repo is
  public: nothing leaves the job unencrypted, nothing secret is printed. Restore test every night
  (restore into a throwaway Postgres, `scripts/backup/compare-counts.mjs` against counts taken
  before and after the dump, `blob-verify.mjs`); Sundays or "full check" also build the site on the
  restored data and run the smoke test (`src/scripts/restore-check-admin.ts` adds a throwaway admin,
  `B61_JOBS_OFF=true` stops scheduled jobs). Skips itself until Jay adds `BACKUP_DATABASE_URL`,
  `BACKUP_BLOB_TOKEN`, `BACKUP_PASSPHRASE` as GitHub secrets. Disaster recovery for files:
  `scripts/backup/blob-restore.mjs`. Neon Free's own instant restore covers 6 hours.
- **Uptime:** `GET /api/health` (`src/ops/health.ts`, counts schools; 503 when the database is
  unreachable) and `.github/workflows/payload-uptime.yml` (every 15 minutes, one retry). Add school
  domains to its `SITES` as they go live.
- **Sentry:** `@sentry/nextjs` (`src/instrumentation.ts`, `src/instrumentation-client.ts`) +
  `@payloadcms/plugin-sentry`, all off until `NEXT_PUBLIC_SENTRY_DSN` is set (then `next.config.ts`
  wraps with `withSentryConfig`; source maps only with `SENTRY_AUTH_TOKEN`/`SENTRY_ORG`/
  `SENTRY_PROJECT`). `src/ops/sentry-options.ts` strips request bodies, cookies, headers, query
  strings, IPs and emails; no replay; 5% traces. **Run `npm run generate:importmap` with
  `NEXT_PUBLIC_SENTRY_DSN` set to any dummy value**, or the plugin's admin component drops out of
  the import map and the editor breaks once the real DSN is added.
- Neon SSL warning fixed in code (`src/lib/db-url.ts`: `sslmode=require` → `verify-full`), so it
  also covers preview branches' injected addresses.
- The hidden `sortOrder` columns on Staff and Programs are dropped (`*_drop_sort_order`).
  Previews' own Neon branches were confirmed from the 17 Nov build logs (production ran
  `20261117_111456_mcp_keys` itself after that branch's previews).
- Turnstile is already built (Thread B): it switches on when Jay adds
  `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` in Vercel and redeploys. The
  Cloudflare widget must list every hostname the forms run on (the demo address and each school's
  domain).

## Open items (from the audit, in order)

1. ~~One app per school~~ → done (multi-tenant).
2. ~~Photos on server disk~~ → done (Vercel Blob).
3. **No automated tests.** Add a type check plus a smoke test (load every page and the
   editor for each school) before deploys, e.g. a GitHub Action.
4. ~~Links and photos inside the Content editor aren't tracked~~ → "Where this is used" and
   a delete guard (Thread D).
5. **Database size:** many block tables; cap versions (`maxPerDoc`) everywhere, trim fields.
6. **Missing for a real school:** ~~forms~~ and ~~email~~ (Thread B), redirects from old URLs,
   sitemap and SEO fields, search, an accessibility pass.

Also pending / nice to have:
- Jay to create his admin account at b61-schools.vercel.app/admin (new database).
- `SCHOOL_SECRET` is set for Production only; add it for Preview so preview links work.
- Shut down the Railway services once Vercel is confirmed.
- ~~Harmless Neon SSL warning~~ → fixed in code (PR #43, `src/lib/db-url.ts`).
- Icon list cards are tall in the editor; rows could start collapsed.
- The plugin's own Split gallery column bug (`--b61-split-cols` collision) is fixed here
  but still needs fixing in the Breakdance plugin.
- Copied plugin CSS will drift from the plugin; consider a shared package if both platforms
  live on.
- Per-school custom elements: build once, switch on per school with a setting.
- Vercel Pro would allow per-5-minute scheduled publishing.
