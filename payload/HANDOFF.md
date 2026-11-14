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
- Migration history was reset to one initial migration plus `blob_object_key`.

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

## Working rules with Jay

- End work replies with a 2-line status: what was done, and the one thing needed from Jay.
- Never type passwords, keys or secrets; Jay pastes them. Account sign-ins, installs,
  marketplace integrations and creating accounts are his. Ask before changing account or
  project settings.
- Don't share jay@hourglassk12.com externally without approval.
- Plain language; Jay isn't a developer.

## Open items (from the audit, in order)

1. ~~One app per school~~ → done (multi-tenant).
2. ~~Photos on server disk~~ → done (Vercel Blob).
3. **No automated tests.** Add a type check plus a smoke test (load every page and the
   editor for each school) before deploys, e.g. a GitHub Action.
4. **Links and photos inside the Content editor aren't tracked** by the database; deleting a
   photo or page they point to silently breaks them. Add a "where is this used" check or
   warning.
5. **Database size:** many block tables; cap versions (`maxPerDoc`) everywhere, trim fields.
6. **Missing for a real school:** ~~forms~~ and ~~email~~ (Thread B), redirects from old URLs,
   sitemap and SEO fields, search, an accessibility pass.

Also pending / nice to have:
- Jay to create his admin account at b61-schools.vercel.app/admin (new database).
- `SCHOOL_SECRET` is set for Production only; add it for Preview so preview links work.
- Shut down the Railway services once Vercel is confirmed.
- Harmless Neon SSL warning in logs: set `sslmode=verify-full` in the connection string.
- Icon list cards are tall in the editor; rows could start collapsed.
- The plugin's own Split gallery column bug (`--b61-split-cols` collision) is fixed here
  but still needs fixing in the Breakdance plugin.
- Copied plugin CSS will drift from the plugin; consider a shared package if both platforms
  live on.
- Per-school custom elements: build once, switch on per school with a setting.
- Vercel Pro would allow per-5-minute scheduled publishing.
