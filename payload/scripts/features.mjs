// School features test (Thread F): announcements, the events calendar and its
// subscribe feed, calendar feed import, news categories, drag ordering, page
// templates, Bunny video links and uploads, and branding (colors, fonts, site icon). Runs against a site with the demo schools
// and a Banner 61 admin account (the smoke test creates one):
//
//   BASE_URL=http://localhost:3000 SMOKE_EMAIL=... SMOKE_PASSWORD=... node scripts/features.mjs
//
// Serves its own small calendar file on FEED_PORT (default 8765) for the import
// test, with dates around today. Creates throwaway records; run on a test database.

import http from 'node:http'

const BASE = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '')
const FEED_PORT = Number(process.env.FEED_PORT || 8765)
const RUN = Date.now().toString(36)
const PASSWORD = 'Feat-test-' + RUN

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

async function page(path, school, opts = {}) {
  const res = await fetch(BASE + path, { headers: { cookie: `b61-school=${school}` }, redirect: 'manual' })
  return { status: res.status, type: res.headers.get('content-type') || '', text: opts.text === false ? '' : await res.text() }
}

// The visible page, without the data Next.js repeats for the browser.
const visible = (html) => html.replace(/<script[\s\S]*?<\/script>/g, '')

async function login(email, password) {
  const r = await api('POST', '/users/login', { body: { email, password } })
  if (!r.json?.token) throw new Error(`Can't sign in as ${email}: ${r.status}`)
  return r.json.token
}

// ---------------------------------------------------------------------------
// A calendar file around today, like Google's: a weekly game with one date
// cancelled, a multi-day break, and an event in another time zone.
// ---------------------------------------------------------------------------
const day = (n) => {
  const d = new Date(Date.now() + n * 86400000)
  return d.toISOString().slice(0, 10).replace(/-/g, '')
}
let weeks = 4
const calendar = () =>
  [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//B61 test//EN', 'X-WR-CALNAME:Test',
    'BEGIN:VEVENT', 'UID:game@features-test', `DTSTART:${day(2)}T230000Z`, `DTEND:${day(2)}T235900Z`,
    `RRULE:FREQ=WEEKLY;COUNT=${weeks}`, `EXDATE:${day(9)}T230000Z`, 'SUMMARY:Feature test game', 'LOCATION:Gym', 'END:VEVENT',
    'BEGIN:VEVENT', 'UID:break@features-test', `DTSTART;VALUE=DATE:${day(5)}`, `DTEND;VALUE=DATE:${day(8)}`, 'SUMMARY:Feature test break', 'END:VEVENT',
    'BEGIN:VEVENT', 'UID:cancel@features-test', `DTSTART:${day(3)}T150000Z`, 'STATUS:CANCELLED', 'SUMMARY:Feature test cancelled', 'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
const server = http.createServer((req, res) => {
  if (req.url === '/calendar.ics') {
    res.writeHead(200, { 'Content-Type': 'text/calendar' })
    res.end(calendar())
  } else {
    res.writeHead(404)
    res.end('nope')
  }
})

async function main() {
  await new Promise((ok) => server.listen(FEED_PORT, ok))
  const admin = await login(process.env.SMOKE_EMAIL, process.env.SMOKE_PASSWORD)
  const schools = await api('GET', '/schools?limit=50&depth=0', { token: admin })
  const bySlug = Object.fromEntries((schools.json?.docs ?? []).map((s) => [s.slug, s.id]))
  const cedar = bySlug['cedar-ridge']
  const harbor = bySlug['harbor-oaks']
  if (!cedar || !harbor) throw new Error('Needs the demo schools (cedar-ridge, harbor-oaks).')

  // A Contributor at Cedar Ridge (drafts only).
  const contribEmail = `feat-contrib-${RUN}@example.com`
  const made = await api('POST', '/users', {
    token: admin,
    body: { email: contribEmail, password: PASSWORD, name: 'Feature test', role: 'editor', tenants: [{ tenant: cedar, role: 'contributor' }] },
  })
  check(made.status === 201, 'admin creates a Contributor at Cedar Ridge')
  const contrib = await login(contribEmail, PASSWORD)

  // ----- Announcements -----------------------------------------------------
  console.log('\nAnnouncements')
  const ann = async (data) =>
    (await api('POST', '/announcements', { token: admin, body: { school: cedar, style: 'standard', showOn: 'all', _status: 'published', ...data } })).json?.doc
  const now = Date.now()
  await ann({ title: `Showing now ${RUN}`, startsAt: new Date(now - 60000).toISOString() })
  await ann({ title: `Not yet ${RUN}`, startsAt: new Date(now + 86400000).toISOString() })
  await ann({ title: `Already over ${RUN}`, startsAt: new Date(now - 2 * 86400000).toISOString(), endsAt: new Date(now - 86400000).toISOString() })
  await ann({ title: `Home only ${RUN}`, startsAt: new Date(now - 60000).toISOString(), showOn: 'home', style: 'urgent' })
  const home = await page('/', 'cedar-ridge')
  const events = await page('/events', 'cedar-ridge')
  check(home.text.includes(`Showing now ${RUN}`), 'a current announcement shows on the home page')
  check(events.text.includes(`Showing now ${RUN}`), '… and on other pages')
  check(!home.text.includes(`Not yet ${RUN}`), 'an announcement before its start date is hidden')
  check(!home.text.includes(`Already over ${RUN}`), 'an announcement after its end date is hidden')
  check(visible(home.text).includes(`Home only ${RUN}`), 'a "home page only" announcement shows on the home page')
  check(!visible(events.text).includes(`Home only ${RUN}`), '… and not on other pages')
  check(!(await page('/', 'harbor-oaks')).text.includes(`Showing now ${RUN}`), 'announcements stay at their own school')
  const draftAnn = await api('POST', '/announcements', {
    token: contrib,
    body: { school: cedar, title: `Contributor draft ${RUN}`, startsAt: new Date(now - 60000).toISOString(), style: 'standard', showOn: 'all' },
  })
  check(draftAnn.status === 201 && draftAnn.json?.doc?._status === 'draft', 'a Contributor can draft an announcement')
  const pubAnn = await api('POST', '/announcements', {
    token: contrib,
    body: { school: cedar, title: `Contributor publish ${RUN}`, startsAt: new Date(now - 60000).toISOString(), style: 'standard', showOn: 'all', _status: 'published' },
  })
  check(pubAnn.status >= 400, 'a Contributor cannot publish an announcement')
  check(!(await page('/', 'cedar-ridge')).text.includes(`Contributor draft ${RUN}`), 'a draft announcement is not on the site')

  // ----- Events calendar and subscribe feed ---------------------------------
  console.log('\nEvents calendar')
  const month = await page('/events?view=month', 'cedar-ridge')
  check(month.status === 200 && month.text.includes('b61-cal__grid'), 'the month calendar renders')
  check((await page('/events?view=month&month=1999-13', 'cedar-ridge')).status === 200, 'a nonsense month falls back to this month')
  const feed = await page('/calendar.ics', 'cedar-ridge')
  check(feed.status === 200 && feed.type.startsWith('text/calendar') && feed.text.startsWith('BEGIN:VCALENDAR'), 'the subscribe feed is a calendar file')
  check(feed.text.includes('Spring Open House') && !feed.text.includes('Parent-Teacher Conferences'), 'the subscribe feed has public events, not parents-only ones')
  const harborFeed = await page('/calendar.ics?school=harbor-oaks', 'cedar-ridge')
  check(harborFeed.text.includes('X-WR-CALNAME:Harbor Oaks'), '?school= picks the school on the shared demo address')
  check(month.text.includes('webcal://'), 'the Events page offers Subscribe links')
  const one = await page('/events/spring-open-house/event.ics', 'cedar-ridge')
  check(one.status === 200 && one.text.includes('SUMMARY:Spring Open House'), 'each event has an "Add to calendar" file')

  // ----- Calendar feed import -----------------------------------------------
  console.log('\nCalendar feed import')
  const feedUrl = `http://localhost:${FEED_PORT}/calendar.ics`
  const c1 = await api('POST', '/calendar-feeds', { token: contrib, body: { school: cedar, name: 'Nope', url: feedUrl } })
  check(c1.status === 403, 'a Contributor cannot add a calendar feed')
  const f = (await api('POST', '/calendar-feeds', { token: admin, body: { school: cedar, name: `Test feed ${RUN}`, url: feedUrl, audience: 'public' } })).json?.doc
  check(Boolean(f?.id), 'admin adds a calendar feed')
  const i1 = await api('POST', `/calendar-feeds/${f.id}/import`, { token: admin })
  // 4 weekly games, one cancelled date, + the break; the CANCELLED event is skipped.
  check(i1.json?.ok && i1.json.result.created === 4, `the first import adds 4 events (got ${JSON.stringify(i1.json?.result)})`)
  const i2 = await api('POST', `/calendar-feeds/${f.id}/import`, { token: admin })
  check(i2.json?.ok && i2.json.result.created === 0 && i2.json.result.unchanged === 4, 'importing again changes nothing')
  weeks = 3
  const i3 = await api('POST', `/calendar-feeds/${f.id}/import`, { token: admin })
  check(i3.json?.result?.removed === 1, 'an event dropped from the calendar is removed')
  const imported = await api('GET', `/events?where[importedFrom][equals]=${f.id}&limit=50&depth=0`, { token: admin })
  const brk = (imported.json?.docs ?? []).find((e) => e.title === 'Feature test break')
  check(brk?.allDay === true && brk?._status === 'published', 'an all-day event imports as all-day and published')
  check((await page('/events', 'cedar-ridge')).text.includes('Feature test game'), 'imported events show on the website')
  const anonFeed = await api('GET', `/calendar-feeds/${f.id}`)
  check(anonFeed.status === 200 && anonFeed.json?.name && !('url' in (anonFeed.json ?? {})), "visitors see a feed's name but never its address")
  check((await api('POST', `/calendar-feeds/${f.id}/import`, { token: contrib })).status === 403, 'a Contributor cannot run an import')
  const bad = (await api('POST', '/calendar-feeds', { token: admin, body: { school: cedar, name: 'Broken', url: `http://localhost:${FEED_PORT}/missing.ics` } })).json?.doc
  const ib = await api('POST', `/calendar-feeds/${bad.id}/import`, { token: admin })
  check(ib.json?.ok === false && /404/.test(ib.json?.message ?? ''), 'a broken calendar address is reported, not crashed on')
  await api('DELETE', `/calendar-feeds/${bad.id}`, { token: admin })
  check((await api('DELETE', `/calendar-feeds/${f.id}`, { token: admin })).status === 200, 'admin deletes the feed')
  const left = await api('GET', `/events?where[importUid][like]=features-test&limit=50&depth=0`, { token: admin })
  check((left.json?.docs ?? []).length === 0, "deleting a feed removes the events it imported")

  // ----- News categories ----------------------------------------------------
  console.log('\nNews categories')
  const cats = await api('GET', `/news-categories?where[school][equals]=${cedar}&sort=_order&depth=0`)
  const academics = (cats.json?.docs ?? []).find((c) => c.slug === 'academics')
  check(Boolean(academics), 'the demo school has news categories')
  const newsAll = visible((await page('/news', 'cedar-ridge')).text)
  const newsAcad = visible((await page('/news?category=academics', 'cedar-ridge')).text)
  check(newsAll.includes('Admissions open for next year') && newsAll.includes('aria-label="News categories"'), 'the News page lists every post and the category filters')
  check(newsAcad.includes('Robotics team heads to state') && !newsAcad.includes('Admissions open for next year'), 'a category shows only its posts')

  // ----- Drag ordering ------------------------------------------------------
  console.log('\nDrag ordering')
  const staff = (await api('GET', `/staff?where[school][equals]=${cedar}&sort=_order&depth=0&limit=50`, { token: admin })).json?.docs ?? []
  check(staff.length >= 2 && staff.every((s) => s._order), 'staff have a drag order')
  for (const col of ['staff', 'programs', 'news-categories']) {
    const all = (await api('GET', `/${col}?limit=500&depth=0&sort=_order`, { token: admin })).json?.docs ?? []
    const keys = all.map((d) => d._order)
    check(keys.length > 0 && new Set(keys).size === keys.length, `every ${col} row has its own place in the order`)
  }
  const last = staff[staff.length - 1]
  const first = staff[0]
  const mv = await api('POST', '/reorder', {
    token: admin,
    body: { collectionSlug: 'staff', docsToMove: [last.id], newKeyWillBe: 'less', orderableFieldName: '_order', target: { id: first.id, key: first._order } },
  })
  check(mv.status === 200, 'moving a staff member to the top works')
  const html = visible((await page('/staff', 'cedar-ridge')).text)
  check(html.indexOf(last.name) > -1 && html.indexOf(last.name) < html.indexOf(first.name), 'the Staff page follows the new order')

  // ----- Page templates -----------------------------------------------------
  console.log('\nPage templates')
  const list = await api('GET', '/pages/templates', { token: contrib })
  const keys = (list.json?.templates ?? []).map((t) => t.key)
  check(['home', 'about', 'admissions', 'academics', 'athletics', 'give'].every((k) => keys.includes(k)), 'the six page templates are offered')
  for (const key of ['home', 'about', 'admissions', 'academics', 'athletics', 'give']) {
    const r = await api('POST', '/pages/from-template', { token: admin, body: { template: key, school: harbor, title: `${key} ${RUN}` } })
    const doc = r.json?.ok ? (await api('GET', `/pages/${r.json.id}?draft=true&depth=0`, { token: admin })).json : null
    check(Boolean(doc?.sections?.length) && doc._status === 'draft', `the ${key} template makes a draft page with sections`)
    if (doc) {
      const preview = await fetch(`${BASE}/${doc.slug}`, { headers: { cookie: 'b61-school=harbor-oaks' } })
      check(preview.status === 404, `… which visitors can't see until it is published`)
      await api('DELETE', `/pages/${doc.id}`, { token: admin })
    }
  }
  const cr = await api('POST', '/pages/from-template', { token: contrib, body: { template: 'admissions', school: cedar } })
  check(cr.json?.ok === true, 'a Contributor can start a page from a template (as a draft)')
  if (cr.json?.id) await api('DELETE', `/pages/${cr.json.id}`, { token: admin })
  const other = await api('POST', '/pages/from-template', { token: contrib, body: { template: 'admissions', school: harbor } })
  check(other.status === 403, "… but not at a school they don't belong to")

  // ----- Bunny video links --------------------------------------------------
  console.log('\nVideo links')
  const split = (video) => ({
    school: cedar,
    title: `Video ${RUN}`,
    slug: `video-${RUN}-${Math.random().toString(36).slice(2, 6)}`,
    sections: [{ blockType: 'b61Split', lines: [{ text: 'Watch' }], media: 'video', video }],
    // Drafts save without checks (by design); publishing checks every field.
    _status: 'published',
  })
  const ok = await api('POST', '/pages', { token: admin, body: split('https://iframe.mediadelivery.net/embed/123456/0b1c2d3e-4f50-6172-8394-a5b6c7d8e9f0') })
  check(ok.status === 201, 'a Bunny Stream link is accepted')
  const shown = visible((await page(`/${ok.json?.doc?.slug}`, 'cedar-ridge')).text)
  check(shown.includes('iframe.mediadelivery.net/embed/123456/'), "… and plays in Bunny's player on the page")
  const no = await api('POST', '/pages', { token: admin, body: split('https://example.com/my-video.mp4') })
  check(no.status === 400 && /Video link/.test(JSON.stringify(no.json)), 'a link that is not YouTube, Vimeo or Bunny is refused with a message')
  if (no.json?.doc?.id) await api('DELETE', `/pages/${no.json.doc.id}`, { token: admin })
  if (ok.json?.doc?.id) await api('DELETE', `/pages/${ok.json.doc.id}`, { token: admin })

  // ----- Branding (School settings > Look) ------------------------------------
  console.log('\nBranding')
  const settingsOf = async (school) =>
    (await api('GET', `/school-settings?where[school][equals]=${school}&depth=0&limit=1&draft=true`, { token: admin })).json?.docs?.[0]
  const cs = await settingsOf(cedar)
  const badColor = await api('PATCH', `/school-settings/${cs.id}`, { token: admin, body: { primaryColor: 'navy-ish', _status: 'published' } })
  check(badColor.status === 400 && /hex color|Primary Color/i.test(JSON.stringify(badColor.json)), 'a color that is not a hex code is refused with a message')
  const media = (await api('GET', `/media?where[school][equals]=${cedar}&limit=1&depth=0`, { token: admin })).json?.docs?.[0]
  const set = await api('PATCH', `/school-settings/${cs.id}`, {
    token: admin,
    body: { primaryColor: '#2E5E4E', ...(media ? { siteIcon: media.id } : {}), _status: 'published' },
  })
  check(set.status === 200, 'a new primary color saves')
  const brandHome = (await page('/', 'cedar-ridge')).text
  check(/--b61-palette-primary:\s*#2e5e4e/i.test(brandHome), '… and the site uses it')
  if (media) check(/<link rel="icon"[^>]+href="[^"]+"/.test(brandHome), 'the Site icon shows in the browser tab')
  await api('PATCH', `/school-settings/${cs.id}`, {
    token: admin,
    body: { primaryColor: cs.primaryColor ?? '#1F3A5F', siteIcon: cs.siteIcon ?? null, _status: 'published' },
  })
  const fontsLink = (await page('/', 'harbor-oaks')).text.match(/https:\/\/fonts\.googleapis\.com\/css2\?[^"]+/)?.[0]?.replace(/&amp;/g, '&') ?? ''
  check(fontsLink && !/family=Lato:[^&]*\b(500|600)\b/.test(fontsLink), 'font requests only name weights the font has (Lato has no 500/600)')

  // ----- Bunny video uploads -------------------------------------------------
  console.log('\nVideo uploads')
  const anonCfg = await api('GET', '/bunny/config')
  check(anonCfg.json?.enabled === false, 'the upload button stays hidden for visitors')
  const cfg = await api('GET', '/bunny/config', { token: admin })
  const anonUp = await api('POST', '/bunny/upload', { body: { school: cedar, title: 'x' } })
  check(anonUp.status === 401, 'uploading needs a sign-in')
  if (cfg.json?.enabled) {
    const other = await api('POST', '/bunny/upload', { token: contrib, body: { school: harbor, title: 'x' } })
    check(other.status === 403, "a Contributor can't upload a video for another school")
    const bogus = await api('GET', '/bunny/status?video=not-a-video', { token: admin })
    check(bogus.status === 400, 'checking a made-up video id is refused')
  } else {
    const off = await api('POST', '/bunny/upload', { token: admin, body: { school: cedar, title: 'x' } })
    check(off.status === 503 && /not switched on/.test(off.json?.message ?? ''), 'without Bunny keys, uploads answer "not switched on yet"')
  }

  // ----- Tidy up --------------------------------------------------------------
  const mine = await api('GET', `/announcements?where[title][like]=${RUN}&limit=50&depth=0&draft=true`, { token: admin })
  for (const a of mine.json?.docs ?? []) await api('DELETE', `/announcements/${a.id}`, { token: admin })
  const u = (await api('GET', `/users?where[email][equals]=${encodeURIComponent(contribEmail)}&depth=0`, { token: admin })).json?.docs?.[0]
  if (u) await api('DELETE', `/users/${u.id}`, { token: admin })
}

try {
  await main()
} catch (e) {
  failures.push(`crashed: ${e.message}`)
  console.error(e)
} finally {
  server.close()
}

console.log(`\n${passed} passed, ${failures.length} failed`)
if (failures.length) {
  console.error('Features test FAILED:\n- ' + failures.join('\n- '))
  process.exit(1)
}
