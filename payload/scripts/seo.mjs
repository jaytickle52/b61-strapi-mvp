// SEO test: what search engines and AI tools get from each school's site.
// Runs against a site with the demo schools and a Banner 61 admin account (the
// smoke test creates one):
//
//   BASE_URL=http://localhost:3000 SMOKE_EMAIL=... SMOKE_PASSWORD=... node scripts/seo.mjs
//
// Gives a demo school a pretend domain for a moment (to see the site the way a
// live school's is seen), then takes it away. Run on a test database.

import http from 'node:http'

const BASE = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '')
const RUN = Date.now().toString(36)
const DOMAIN = `seo-${RUN}.example`

let passed = 0
const failures = []
const check = (ok, what) => {
  if (ok) passed++
  else failures.push(what)
  console.log(`${ok ? '  ok ' : 'FAIL '} ${what}`)
}

async function api(method, p, { token, body } = {}) {
  const res = await fetch(BASE + '/api' + p, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `JWT ${token}` } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  let json = null
  try {
    json = await res.json()
  } catch {}
  return { status: res.status, json }
}

/** A page as a visitor gets it: on the shared demo address (school picked by cookie) or on a school's own domain (`host`). */
function get(path, { school, host, cookie } = {}) {
  const url = new URL(BASE + path)
  const headers = {}
  if (host) headers.host = host
  const cookies = [school ? `b61-school=${school}` : '', cookie ?? ''].filter(Boolean).join('; ')
  if (cookies) headers.cookie = cookies
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: url.hostname, port: url.port || 80, path: url.pathname + url.search, headers }, (res) => {
      let text = ''
      res.setEncoding('utf8')
      res.on('data', (c) => (text += c))
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, text }))
    })
    req.on('error', reject)
    req.end()
  })
}

const tag = (html, re) => html.match(re)?.[1] ?? null
const description = (html) => tag(html, /<meta name="description" content="([^"]*)"/)
const robots = (html) => tag(html, /<meta name="robots" content="([^"]*)"/)
const title = (html) => tag(html, /<title>([^<]*)<\/title>/)
const decode = (s) => (s ?? '').replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"')

async function main() {
  const admin = (await api('POST', '/users/login', { body: { email: process.env.SMOKE_EMAIL, password: process.env.SMOKE_PASSWORD } })).json?.token
  if (!admin) throw new Error('Could not sign in as the admin')
  const school = (await api('GET', '/schools?where[slug][equals]=cedar-ridge&depth=0', { token: admin })).json?.docs?.[0]
  const settings = (await api('GET', `/school-settings?where[school][equals]=${school.id}&depth=0`, { token: admin })).json?.docs?.[0]
  const name = settings?.schoolName || school.name
  const tagline = settings?.tagline || ''

  // ----- Descriptions: every list page has its own ------------------------------
  const lists = ['/news', '/events', '/programs', '/staff']
  const descs = []
  for (const p of lists) {
    const d = decode(description((await get(p, { school: 'cedar-ridge' })).text))
    descs.push(d)
    check(Boolean(d) && d !== tagline && d.includes(name), `${p} has its own description naming the school`)
  }
  check(new Set(descs).size === descs.length, 'no two list pages share a description')

  // ----- Events calendar: limited and not followed ------------------------------
  const month = (await get('/events?view=month', { school: 'cedar-ridge' })).text
  const navs = month.match(/<a[^>]*b61-cal__nav[^>]*>/g) ?? []
  check(navs.length === 2 && navs.every((a) => a.includes('rel="nofollow"')), 'previous / next month links are nofollow')
  const far = new Date()
  far.setUTCMonth(far.getUTCMonth() + 30)
  check((await get(`/events?view=month&month=${far.toISOString().slice(0, 7)}`, { school: 'cedar-ridge' })).status === 404, 'a month 30 months away is a 404')
  check((await get('/events', { school: 'cedar-ridge' })).text.match(/<a[^>]*rel="nofollow"[^>]*>Month/) !== null, 'the Month tab is nofollow')

  // ----- News pages ---------------------------------------------------------------
  check((await get('/news?page=999', { school: 'cedar-ridge' })).status === 404, 'a News page past the last is a 404')
  check((await get('/news?page=abc', { school: 'cedar-ridge' })).status === 200, 'a nonsense page number shows page 1')

  // ----- Site icon -----------------------------------------------------------------
  for (const s of ['cedar-ridge', 'harbor-oaks']) {
    const fav = await get('/favicon.ico', { school: s })
    check(fav.status === 302 && Boolean(fav.headers.location), `${s}: /favicon.ico points at an icon`)
    if (fav.headers.location === '/school-icon.svg') {
      const svg = await get('/school-icon.svg', { school: s })
      check(svg.status === 200 && String(svg.headers['content-type']).startsWith('image/svg+xml') && svg.text.includes('<svg'), `${s}: the letter-mark icon is an SVG`)
    }
    check(/<link rel="icon"[^>]*>/.test((await get('/', { school: s })).text), `${s}: every page names a tab icon`)
  }

  // ----- Missing pages ------------------------------------------------------------
  const missing = await get(`/no-such-page-${RUN}`, { school: 'cedar-ridge' })
  check(missing.status === 404, 'a missing page is a 404')
  check((title(missing.text) ?? '').startsWith('Page not found'), 'its tab title says Page not found')

  // ----- On the school's own domain (as a live site) -----------------------------
  const domains = school.domains ?? []
  const set = await api('PATCH', `/schools/${school.id}`, { token: admin, body: { domains: [...domains, { domain: DOMAIN }] } })
  check(set.status === 200, 'pretend domain added for the test')
  try {
    const live = { host: DOMAIN }
    const rob = await get('/robots.txt', live)
    check(rob.text.includes(`Sitemap: https://${DOMAIN}/sitemap.xml`) && !/Disallow: \/\s*$/m.test(rob.text), 'robots.txt lets crawlers in and names the sitemap')
    const map = (await get('/sitemap.xml', live)).text
    check(map.includes(`<loc>https://${DOMAIN}/</loc>`), 'the sitemap lists the home page')
    check(/<loc>[^<]*\/news<\/loc><lastmod>\d{4}-\d\d-\d\d<\/lastmod>/.test(map), 'list pages carry a last-changed date')
    check(robots((await get('/news', live)).text) === null, 'the News list can be indexed')
    check(robots((await get('/events?view=month', live)).text) === 'noindex, follow', 'calendar months: noindex, follow')
    const cat = (await api('GET', `/news-categories?where[school][equals]=${school.id}&limit=1&depth=0`, { token: admin })).json?.docs?.[0]
    if (cat) check(robots((await get(`/news?category=${cat.slug}`, live)).text) === 'noindex, follow', 'news category views: noindex, follow')
    check(tag((await get('/about', live)).text, /<link rel="canonical" href="([^"]*)"/) === `https://${DOMAIN}/about`, 'canonical addresses use the school domain')

    // "Hide from search" left on with a real domain: the dashboard says so.
    await api('PATCH', `/school-settings/${settings.id}`, { token: admin, body: { hideFromSearch: true, _status: 'published' } })
    const dash = await get('/admin', { cookie: `payload-token=${admin}; payload-tenant=${school.id}` })
    check(dash.text.includes('b61-welcome__alert'), 'dashboard warns when a school with a domain is hidden from search')
    check((await get('/robots.txt', live)).text.includes('Disallow: /'), 'while hidden, robots.txt keeps crawlers out')
  } finally {
    await api('PATCH', `/school-settings/${settings.id}`, { token: admin, body: { hideFromSearch: Boolean(settings.hideFromSearch), _status: 'published' } })
    await api('PATCH', `/schools/${school.id}`, { token: admin, body: { domains } })
  }
  const dash = await get('/admin', { cookie: `payload-token=${admin}; payload-tenant=${school.id}` })
  check(!dash.text.includes('b61-welcome__alert'), 'no warning for a school without its own domain')
}

try {
  await main()
} catch (e) {
  failures.push(`crashed: ${e.message}`)
  console.error(e)
}

console.log(`\n${passed} passed, ${failures.length} failed`)
if (failures.length) {
  console.error('SEO test FAILED:\n- ' + failures.join('\n- '))
  process.exit(1)
}
