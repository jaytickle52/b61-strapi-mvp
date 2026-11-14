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

Each school needs **one secret**, `SCHOOL_SECRET` (a long random string), set to the same value on its Strapi and its website. Every other secret (Strapi's keys and salts, the website's read token, the preview and refresh secrets) is derived from it. Any of those can still be set explicitly to override.

**cms (each school's Strapi on Railway):**

| Variable | Value |
| --- | --- |
| `SCHOOL_SECRET` | Long random string; Railway can generate one |
| `DATABASE_CLIENT` | `postgres` |
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` (Railway reference) |
| `FRONTEND_URL` | The school's website URL |
| `SEED_DEMO` / `SEED_SCHOOL` | `true` / `cedar-ridge` or `harbor-oaks` for demo content |

**web (each school's website on Vercel):**

| Variable | Value |
| --- | --- |
| `SCHOOL_SECRET` | Same value as that school's Strapi |
| `STRAPI_URL` | That school's Railway URL |
| `PARENT_PASSWORD` | Shared password for the parent feed (stand-in for real parent logins) |
| `SCHOOL_TIMEZONE` | Optional, defaults to `America/New_York` |

## Deploy one school

1. **Railway:** new project → GitHub repo → this repo. In the service's Settings: root directory `/cms`, healthcheck path `/_health`. Add a PostgreSQL database and a volume mounted at `/app/public/uploads` (so uploaded photos survive redeploys). Variables: the cms table plus `PORT=1337` and `NODE_ENV=production`; `SCHOOL_SECRET` can be `${{secret(64)}}`. Generate a public domain on port 1337.
2. **Vercel:** new project → this repo, root directory `web`. Set the web variables with the Railway URL. Set Deployment Protection to previews only, so staff can open the live site. Deploy.
3. Back in Railway, set `FRONTEND_URL` to the Vercel URL and redeploy.
4. Open `<railway-url>/admin` and create the first admin account.

**Second school:** repeat with a new `SCHOOL_SECRET` and `SEED_SCHOOL=harbor-oaks`. Same code, different settings: that is the fleet test.

## MVP limits (on purpose)

No Banner Connect sync, AI features, content history, scheduled releases, fleet dashboard, native app, or real parent accounts.
