// Smoke test: loads every public page and the editor for each school and fails
// if anything doesn't come back cleanly. Runs in CI against a fresh, seeded
// database (see .github/workflows/payload-ci.yml), and can be pointed at any
// copy of the site:
//
//   BASE_URL=http://localhost:3000 node scripts/smoke.mjs
//
// SMOKE_EMAIL / SMOKE_PASSWORD  an admin account. On an empty database the
//   script creates it (the first account); otherwise it signs in with it.
//   Signed in, it checks every school and every published page, plus the editor.
// SMOKE_SCHOOLS  comma-separated school slugs, used only when not signed in
//   (default: the two demo schools); then just the fixed pages are checked.

const BASE = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '')
const FALLBACK_SCHOOLS = (process.env.SMOKE_SCHOOLS || 'cedar-ridge,harbor-oaks').split(',').map((s) => s.trim()).filter(Boolean)
const EMAIL = process.env.SMOKE_EMAIL
const PASSWORD = process.env.SMOKE_PASSWORD

const failures = []
let checked = 0

// A page can return 200 and still have crashed while rendering.
const BROKEN = [/Application error: a (client|server)-side exception/i]

async function get(path, { cookie, expect = [200], html = true } = {}) {
  checked++
  try {
    const res = await fetch(BASE + path, { headers: cookie ? { cookie } : {}, redirect: 'manual' })
    if (!expect.includes(res.status)) {
      failures.push(`${path} → ${res.status} (expected ${expect.join('/')})`)
      return res
    }
    if (html && res.status === 200) {
      const body = await res.text()
      const hit = BROKEN.find((re) => re.test(body))
      if (hit) failures.push(`${path} → page shows "${hit.source}"`)
    }
    return res
  } catch (e) {
    failures.push(`${path} → ${e.message}`)
  }
}

async function api(path, cookie) {
  const res = await fetch(BASE + path, { headers: cookie ? { cookie } : {} })
  if (!res.ok) throw new Error(`${path} → ${res.status}`)
  return res.json()
}

// Published items of one collection for one school (needs the admin session).
// Events and news marked "Parents only" are left out: visitors correctly get a 404.
async function items(collection, school, auth) {
  let q = `where[school][equals]=${school.id}&where[_status][equals]=published&limit=200&depth=0`
  if (collection === 'events' || collection === 'news') q += '&where[audience][equals]=public'
  const { docs } = await api(`/api/${collection}?${q}`, auth)
  return docs
}

async function checkSchool(school, auth) {
  const cookie = `b61-school=${school.slug}`

  // The shared demo address picks a school with this link.
  await get(`/next/school/${school.slug}`, { expect: [302, 303, 307, 308], html: false })

  for (const path of ['/', '/events', '/events?view=month', '/calendar.ics', '/news', '/programs', '/staff']) await get(path, { cookie })

  if (!auth) return []
  const pages = await items('pages', school, auth)
  if (!pages.length) failures.push(`${school.slug}: no published pages found`)
  for (const p of pages) if (p.slug && p.slug !== 'home') await get(`/${p.slug}`, { cookie })

  for (const collection of ['events', 'news']) {
    for (const doc of (await items(collection, school, auth)).slice(0, 5)) {
      if (doc.slug) await get(`/${collection}/${doc.slug}`, { cookie })
    }
  }
  return pages
}

async function signIn() {
  const body = JSON.stringify({ email: EMAIL, password: PASSWORD })
  const headers = { 'content-type': 'application/json' }
  const { initialized } = await fetch(`${BASE}/api/users/init`).then((r) => r.json())
  const path = initialized ? '/api/users/login' : '/api/users/first-register'
  const res = await fetch(BASE + path, { method: 'POST', headers, body })
  if (!res.ok) throw new Error(`Sign-in failed at ${path}: ${res.status} ${await res.text()}`)
  const { token } = await res.json()
  if (!token) throw new Error(`Sign-in at ${path} returned no token`)
  return `payload-token=${token}`
}

async function checkEditor(cookie, pagesBySchool) {
  await get('/admin', { cookie })
  // Thread G: the Analytics page, once per period, and School settings (Analytics tab lives there).
  for (const days of [7, 28, 90]) await get(`/admin/analytics?days=${days}`, { cookie })
  await get('/admin/collections/school-settings', { cookie, expect: [200, 302, 307] })
  for (const collection of ['pages', 'events', 'news', 'news-categories', 'announcements', 'calendar-feeds', 'staff', 'media']) {
    await get(`/admin/collections/${collection}`, { cookie })
  }
  // Open one page in the editor per school: this renders every element's form.
  for (const [school, pages] of Object.entries(pagesBySchool)) {
    const page = pages.find((p) => p.slug === 'home') || pages[0]
    if (page) await get(`/admin/collections/pages/${page.id}`, { cookie })
    else failures.push(`${school}: no page to open in the editor`)
  }
}

let auth = null
let schools = FALLBACK_SCHOOLS.map((slug) => ({ slug }))
if (EMAIL && PASSWORD) {
  try {
    auth = await signIn()
    schools = (await api('/api/schools?limit=500&depth=0', auth)).docs
  } catch (e) {
    failures.push(`sign-in: ${e.message}`)
  }
} else {
  console.log('SMOKE_EMAIL / SMOKE_PASSWORD not set: checking fixed pages only, no editor.')
}

const pagesBySchool = {}
for (const school of schools) {
  try {
    pagesBySchool[school.slug] = await checkSchool(school, auth)
  } catch (e) {
    failures.push(`${school.slug}: ${e.message}`)
  }
}

if (auth) {
  try {
    await checkEditor(auth, pagesBySchool)
  } catch (e) {
    failures.push(`editor: ${e.message}`)
  }
}

if (failures.length) {
  console.error(`Smoke test FAILED: ${failures.length} of ${checked} checks.\n- ` + failures.join('\n- '))
  process.exit(1)
}
console.log(`Smoke test passed: ${checked} checks across ${schools.length} schools.`)
