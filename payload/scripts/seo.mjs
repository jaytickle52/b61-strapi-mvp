// SEO test: what search engines and AI tools get from each school's site.
// Runs against a site with the demo schools and a Banner 61 admin account (the
// smoke test creates one):
//
//   BASE_URL=http://localhost:3000 SMOKE_EMAIL=... SMOKE_PASSWORD=... node scripts/seo.mjs
//
// The IndexNow check needs the site started with INDEXNOW_ENABLED=true and
// INDEXNOW_ENDPOINT=http://localhost:8766/indexnow (skipped otherwise).
//
// Gives a demo school a pretend domain for a moment (to see the site the way a
// live school's is seen), then takes it away. Run on a test database.

import http from 'node:http'

const BASE = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '')
// Stands in for api.indexnow.org: the site under test must run with
// INDEXNOW_ENABLED=true and INDEXNOW_ENDPOINT=http://localhost:<this port>/indexnow.
const INDEXNOW_PORT = Number(process.env.INDEXNOW_PORT || 8766)
const pings = []
const catcher = http.createServer((req, res) => {
  let body = ''
  req.on('data', (c) => (body += c))
  req.on('end', () => {
    try {
      pings.push(JSON.parse(body))
    } catch {}
    res.writeHead(202).end()
  })
})
const pingFor = async (url, ms = 8000) => {
  for (let t = 0; t < ms; t += 250) {
    if (pings.some((p) => (p.urlList ?? []).includes(url))) return true
    await new Promise((r) => setTimeout(r, 250))
  }
  return false
}
const RUN = Date.now().toString(36)
const DOMAIN = `seo-${RUN}.example`
const WWW = `www.${DOMAIN}`

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
/** Every JSON-LD block on a page, parsed. */
const jsonld = (html) => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]))
const ofType = (html, type) => jsonld(html).find((d) => d['@type'] === type)
const para = (text) => ({ root: { type: 'root', format: '', indent: 0, version: 1, direction: null, children: [{ type: 'paragraph', format: '', indent: 0, version: 1, direction: null, children: [{ type: 'text', text, version: 1 }] }] } })
const decode = (s) => (s ?? '').replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"')

async function main() {
  // Only when the site under test was started pointing IndexNow at this script.
  if (process.env.INDEXNOW_ENDPOINT) await new Promise((r) => catcher.listen(INDEXNOW_PORT, r))
  pings.listening = catcher.listening
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

  // ----- Structured data ------------------------------------------------------------
  const home = (await get('/', { school: 'cedar-ridge' })).text
  const sch = ofType(home, 'School')
  check(sch?.address?.addressLocality && sch?.address?.postalCode, 'School data has the address in parts')
  check(Array.isArray(sch?.sameAs) && sch.sameAs.every((u) => new URL(u).pathname.replace(/\/+$/, '') !== ''), 'School data links only to full profile pages')
  if (settings?.grades) check(sch?.description?.includes(settings.grades), 'School data describes the school with its facts')
  check(Boolean(ofType(home, 'WebSite')), 'the home page names the site (WebSite)')
  check(!ofType((await get('/about', { school: 'cedar-ridge' })).text, 'WebSite'), '… and only the home page')
  const prog = (await api('GET', `/programs?where[school][equals]=${school.id}&limit=1&depth=0`, { token: admin })).json?.docs?.[0]
  if (prog) {
    const crumbs = ofType((await get(`/programs/${prog.slug}`, { school: 'cedar-ridge' })).text, 'BreadcrumbList')
    check(crumbs?.itemListElement?.map((x) => x.name).join(' > ') === `Home > Programs > ${prog.name}`, 'program pages carry a breadcrumb trail')
  }
  const staff = ofType((await get('/staff', { school: 'cedar-ridge' })).text, 'ItemList')
  check(staff?.itemListElement?.[0]?.item?.['@type'] === 'Person', 'Our team describes each person')
  if (settings?.grades) check((await get('/about', { school: 'cedar-ridge' })).text.includes(settings.grades), 'School facts show on the demo About page')

  // FAQ accordion on a throwaway page
  const faqPage = await api('POST', '/pages', {
    token: admin,
    body: {
      school: school.id,
      title: `FAQ test ${RUN}`,
      slug: `faq-test-${RUN}`,
      _status: 'published',
      sections: [{ blockType: 'b61Accordion', faq: true, lines: [{ text: 'Questions' }], items: [{ title: 'Is there a bus?', body: para('Yes, from Greer.') }] }],
    },
  })
  check(faqPage.status === 201, 'test page with an FAQ accordion saved')
  if (faqPage.json?.doc?.id) {
    const faq = ofType((await get(`/faq-test-${RUN}`, { school: 'cedar-ridge' })).text, 'FAQPage')
    check(faq?.mainEntity?.[0]?.acceptedAnswer?.text === 'Yes, from Greer.', 'an accordion marked as questions and answers gives FAQ data')
    await api('DELETE', `/pages/${faqPage.json.doc.id}`, { token: admin })
  }

  // Settings rules
  const bad = await api('PATCH', `/school-settings/${settings.id}`, { token: admin, body: { social: [{ platform: 'facebook', url: 'https://facebook.com/' }] } })
  check(bad.status === 400, 'a social link to a site\'s home page is refused')
  if (settings?.street) {
    const moved = await api('PATCH', `/school-settings/${settings.id}?draft=true`, { token: admin, body: { postalCode: '29999' } })
    check(String(moved.json?.doc?.address ?? '').endsWith('29999'), 'the footer address follows the parts')
    await api('PATCH', `/school-settings/${settings.id}`, { token: admin, body: { postalCode: settings.postalCode, _status: 'published' } })
  }

  // ----- Speed -----------------------------------------------------------------------
  const visit = await get('/', { school: 'cedar-ridge' })
  check(!visit.headers['critical-ch'] && !visit.headers['accept-ch'], 'public pages send no colour-scheme hints (no second request)')
  check(Boolean((await get('/admin/login')).headers['critical-ch']), '… the admin still does')
  check(String(visit.headers['cache-control']).startsWith('private, no-cache') && !String(visit.headers['cache-control']).includes('no-store'), 'visitors get pages the browser may keep for Back / Forward')
  check(String((await get('/', { school: 'cedar-ridge', cookie: `payload-token=${admin}` })).headers['cache-control']).includes('no-store'), 'signed-in staff still get no-store')
  check(String((await get('/parents', { school: 'cedar-ridge' })).headers['cache-control']).includes('no-store'), 'the parents area still gets no-store')
  const og = tag(visit.text, /<meta property="og:image" content="([^"]*)"/)
  check(Boolean(og), "the home page's link preview has a picture (its first photo when no share image is set)")
  check(/<style id="b61-fonts">|<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com/.test(visit.text), 'fonts load inline, or by link when Google is out of reach')

  // ----- Analytics: visits from AI assistants -------------------------------------------
  const an = await get('/admin/analytics', { cookie: `payload-token=${admin}; payload-tenant=${school.id}` })
  check(an.text.includes('From AI assistants') && an.text.includes('ChatGPT'), 'Analytics shows visits from AI assistants (sample numbers on the demo)')

  // ----- On the school's own domain (as a live site) -----------------------------
  const domains = school.domains ?? []
  const set = await api('PATCH', `/schools/${school.id}`, { token: admin, body: { domains: [{ domain: DOMAIN }, { domain: WWW }, ...domains] } })
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

    // A school's other domain sends visitors to the main one, page for page.
    const www = await get('/about?x=1', { host: WWW })
    check([301, 308].includes(www.status) && www.headers.location === `https://${DOMAIN}/about?x=1`, 'the www domain redirects to the main domain, same page')
    const wwwRobots = await get('/robots.txt', { host: WWW })
    check([301, 308].includes(wwwRobots.status) && wwwRobots.headers.location === `https://${DOMAIN}/robots.txt`, '… robots.txt too')
    check((await get('/about', live)).status === 200, 'the main domain itself is not redirected')

    // AI crawlers: allowed by default; the switch turns training crawlers away only.
    check(!rob.text.includes('GPTBot'), 'by default no AI crawler is turned away')
    await api('PATCH', `/school-settings/${settings.id}`, { token: admin, body: { allowAiTraining: false, bingVerification: 'bing-test-code', _status: 'published' } })
    const noTrain = (await get('/robots.txt', live)).text
    check(/User-agent: GPTBot\nDisallow: \//.test(noTrain) && /User-agent: ClaudeBot\nDisallow: \//.test(noTrain), 'switch off: GPTBot and ClaudeBot are turned away')
    check(!/OAI-SearchBot|Claude-SearchBot|PerplexityBot|Google-Extended/.test(noTrain) && noTrain.includes('Sitemap:'), '… while answer crawlers and Google stay allowed')
    check((await get('/', live)).text.includes('<meta name="msvalidate.01" content="bing-test-code"'), 'the Bing code is on the page')
    await api('PATCH', `/school-settings/${settings.id}`, { token: admin, body: { allowAiTraining: settings.allowAiTraining !== false, bingVerification: settings.bingVerification ?? null, _status: 'published' } })

    // News feed and llms.txt
    const feed = await get('/news/feed.xml', live)
    check(feed.status === 200 && String(feed.headers['content-type']).includes('rss') && feed.text.includes(`<link>https://${DOMAIN}/news/`), 'the news feed lists posts on the school domain')
    check((await get('/', live)).text.includes('type="application/rss+xml"'), 'every page points to the news feed')
    const llms = await get('/llms.txt', live)
    check(llms.status === 200 && llms.text.startsWith(`# ${name}`) && llms.text.includes(`(https://${DOMAIN}/about)`), 'llms.txt describes the site with its pages')
    check((await get('/llms.txt', { school: 'cedar-ridge' })).status === 404, 'no llms.txt while the site is hidden (demo address)')
    check(/^[0-9a-f]{32}$/.test((await get('/indexnow.txt', live)).text), 'the IndexNow key file is served')

    // IndexNow: publishing tells the search engines at once.
    if (pings.listening) {
      const post = await api('POST', '/news', {
        token: admin,
        body: { school: school.id, title: `IndexNow ${RUN}`, slug: `indexnow-${RUN}`, date: new Date().toISOString(), audience: 'public', _status: 'published' },
      })
      check(await pingFor(`https://${DOMAIN}/news/indexnow-${RUN}`), 'publishing a news post pings IndexNow with its address')
      const n = pings.length
      if (post.json?.doc?.id) {
        await api('PATCH', `/news/${post.json.doc.id}?draft=true`, { token: admin, body: { title: `IndexNow draft ${RUN}` } })
        await new Promise((r) => setTimeout(r, 1500))
        check(pings.length === n, 'a draft save does not ping')
        await api('DELETE', `/news/${post.json.doc.id}`, { token: admin })
      }
    }

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
} finally {
  if (catcher.listening) catcher.close()
}

console.log(`\n${passed} passed, ${failures.length} failed`)
if (failures.length) {
  console.error('SEO test FAILED:\n- ' + failures.join('\n- '))
  process.exit(1)
}
