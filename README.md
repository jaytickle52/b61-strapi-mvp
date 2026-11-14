# Banner 61 Strapi MVP

A test of the "one content source per school" idea: each school gets its own free Strapi (Community) instance, all running this same code, feeding a website and a password-protected parent feed.

```
cms/   Strapi 5 — content model, section components, preview, seed data   → Railway
web/   Next.js website + parent feed, reads one school's Strapi             → Vercel
```

## What's in it

- **Content types:** Page (built from sections), Event, News post, Staff member, Program, School settings (name, colors, fonts, navigation).
- **Sections editors can add, reorder and remove on any page:** Hero, Split, Card grid, Stats band, Call to action, Text. Card grids can fill themselves from programs, upcoming events, latest news or staff.
- **Audience tag** on events and news: `public` shows everywhere; `parents` shows only in the parent feed.
- **Preview** (free Community feature): editors save a draft and open it on the real site.
- **Auto refresh:** every save tells the website to refresh.
- **Demo schools:** `cedar-ridge` and `harbor-oaks`, seeded on first start when `SEED_DEMO=true`. The seed never touches an instance that already has pages.

## Run locally

```bash
cd cms && cp .env.example .env   # then add the B61 variables below
npm install && npm run build && npm run start      # http://localhost:1337/admin

cd ../web && npm install
# create web/.env.local with the web variables below
npm run build && npm run start                       # http://localhost:3000
```

## Environment variables

**cms (each school's Strapi):**

| Variable | Purpose |
| --- | --- |
| `DATABASE_CLIENT` | `postgres` on Railway (`sqlite` locally) |
| `DATABASE_URL` | Railway Postgres connection URL |
| `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `JWT_SECRET`, `ENCRYPTION_KEY` | Strapi secrets; unique random values per school |
| `FRONTEND_URL` | The school's website URL (for preview and refresh) |
| `FRONTEND_API_TOKEN` | Long random string; the website uses it to read content |
| `PREVIEW_SECRET` | Shared with the website's `PREVIEW_SECRET` |
| `REVALIDATE_SECRET` | Shared with the website's `REVALIDATE_SECRET` |
| `SEED_DEMO` / `SEED_SCHOOL` | `true` / `cedar-ridge` or `harbor-oaks` for demo content |

**web (each school's website):**

| Variable | Purpose |
| --- | --- |
| `STRAPI_URL` | That school's Strapi URL |
| `STRAPI_API_TOKEN` | Same value as the school's `FRONTEND_API_TOKEN` |
| `PREVIEW_SECRET`, `REVALIDATE_SECRET` | Same values as in cms |
| `PARENT_PASSWORD` | Shared password for the parent feed (stand-in for real parent logins) |
| `SCHOOL_TIMEZONE` | Optional, defaults to `America/New_York` |

## Deploy one school

1. **Railway:** new project → Deploy from GitHub repo → this repo, root directory `cms`. Add a Postgres database to the project. Add a volume mounted at `/app/public/uploads` so uploaded photos survive redeploys. Set the cms variables. Generate a public domain.
2. **Vercel:** new project → this repo, root directory `web`. Set the web variables with the Railway URL. Deploy.
3. Back in Railway, set `FRONTEND_URL` to the Vercel URL and redeploy.
4. Open `<railway-url>/admin` and create the first admin account.

**Second school:** repeat with new secrets and `SEED_SCHOOL=harbor-oaks`. Same code, different settings: that is the fleet test.

## MVP limits (on purpose)

No Banner Connect sync, AI features, content history, scheduled releases, fleet dashboard, native app, or real parent accounts.
