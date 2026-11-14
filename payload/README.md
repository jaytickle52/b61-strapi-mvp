# Payload version (school website + editor in one app)

The same fictional school sites as the Strapi build (`../cms` + `../web`), built on
Payload CMS 3 so school staff can compare the two editors side by side.

**What's different from the Strapi build**

- One app per school: the editor (`/admin`) and the public website run together in
  one Next.js app. One Railway service plus Postgres; no Vercel project needed.
- **Live preview beside the form, free.** Open any page, event or news post and click
  the eye icon. Edits autosave as drafts and show on the right within a second or two.
  Phone, tablet and desktop sizes are in the toolbar.
- Scheduled publishing is on (Publish changes ▸ Schedule publish).
- Every saved version is kept and can be compared or restored (Versions tab).

**Same as the Strapi build**

- Content model: pages built from sections (hero, text and image, card grid, stats
  band, call to action, text), events, news, programs, staff, school settings.
- Parents-only events and news never appear on the public site or public API; the
  parent feed at `/parents` shows them after the parent password.
- One `SCHOOL_SECRET` per school; every other secret is derived from it.

## B61 elements

`src/b61/` holds ports of Banner 61 Elements (the Breakdance plugin). The first is the
**B61 Hero** (from plugin 1.77.1): same controls, same Content / Design tabs, same
markup and class names, and the plugin's own stylesheets copied in unchanged
(`src/b61/styles`, `src/b61/elements/hero/hero.css`).

- `fields.ts` defines the controls; `Hero.tsx` is `html.twig`; `hero-instance.css`
  replaces `css.twig`; `HeroBehavior.tsx` is `behavior.js`; `reveal/` is `reveal.js`,
  re-run after each page change.
- The school's B61 palette and fonts come from School settings > Look.
- School staff see both the Content and Design tabs.

Every element is built with the **B61 editing kit** (`src/b61/kit/`) and follows
`src/b61/EDITING-STANDARD.md`: `defineElement()` gives the Content / Design tabs,
the Design panels in a fixed order with value summaries in their headers, and the
section label; the shared controls (segmented buttons, step sliders, compact links)
and field groups (heading, buttons, photo, padding, eyebrow rule, entrance) keep
every element's form the same.

## Run locally

```bash
cp .env.example .env   # set DATABASE_URL and SCHOOL_SECRET
npm install
npm run dev            # http://localhost:3000 (site) and /admin (editor)
```

With `SEED_DEMO=true`, an empty database gets demo content on first start
(`SEED_SCHOOL=cedar-ridge` or `harbor-oaks`). Existing content is never touched.

## Changing the content model

Fields are defined in code (`src/collections`, `src/blocks.ts`, `src/globals`). After a
change, run `npm run payload migrate:create <name>` and commit the migration. Each
school's site applies new migrations automatically when it starts, so one push
updates every school.

## Deploy one school on Railway

1. New service from this repo, root directory `/payload`.
2. Add Postgres. Variables on the service:
   - `DATABASE_URL` = `${{Postgres.DATABASE_URL}}`
   - `SCHOOL_SECRET` = `${{secret(64)}}`
   - `SEED_DEMO=true`, `SEED_SCHOOL=cedar-ridge`, `SCHOOL_TIMEZONE=America/New_York`
   - `PARENT_PASSWORD` (optional, turns on the parent feed)
   - `MEDIA_DIR=/data/media`
3. Add a volume mounted at `/data` (keeps uploaded photos across deploys).
4. Start command: `npm start` (default). Healthcheck path: `/`.
5. Generate a domain, open `/admin` and create the first admin account.
