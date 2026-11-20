// School features test (Thread F): announcements, the events calendar and its
// subscribe feed, calendar feed import, news categories, drag ordering, page
// templates, Bunny video links and uploads, branding (colors, fonts, site icon), site tone and custom CSS, style themes and dials (Schoolbox themes, theme preview links, the Schoolbox demo), the Content editor's Button, Callout and Table, and the layout options (Hero changing words, video buttons, Card Grid / Section / Stats Band / Split options, Side buttons, pop-up announcements). Runs against a site with the demo schools
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

  // Event description editor (19 Nov 2026): no Heading 1, block quote or
  // relationship; checklist and the kit's Emphasis, Quote, Callout, Button.
  {
    const t = (text) => ({ type: 'text', text, version: 1, format: 0, detail: 0, mode: 'normal', style: '' })
    const el = (type, children, extra = {}) => ({ type, children, version: 1, direction: 'ltr', format: '', indent: 0, ...extra })
    const blk = (blockType, fields) => ({ type: 'block', version: 2, format: '', fields: { id: `t${Math.random().toString(36).slice(2, 10)}`, blockName: '', blockType, ...fields } })
    const desc = {
      root: el('root', [
        el('heading', [t(`Old big heading ${RUN}`)], { tag: 'h1' }),
        el('quote', [t(`Old quote ${RUN}`)]),
        { type: 'relationship', version: 2, format: '', relationTo: 'pages', value: 1 },
        el('list', [el('listitem', [t('Water bottle')], { value: 1, checked: true }), el('listitem', [t('Sneakers')], { value: 2, checked: false })], { listType: 'check', tag: 'ul', start: 1 }),
        blk('emphasis', { text: `Bring the whole family ${RUN}` }),
        blk('pullQuoteText', { text: `Best day of the year ${RUN}`, attribution: 'A parent' }),
        blk('callout', { tone: 'important', title: `Parking ${RUN}`, text: 'Use the north lot.' }),
        blk('bodyButton', { label: `RSVP ${RUN}`, variant: 'primary', link: { type: 'url', url: '/inquire' } }),
      ]),
    }
    const ev = await api('POST', '/events', {
      token: admin,
      body: { school: cedar, title: `Description test ${RUN}`, slug: `description-test-${RUN}`.toLowerCase().replace(/[^a-z0-9-]/g, '-'), startsAt: new Date(Date.now() + 5 * 86400000).toISOString(), audience: 'public', description: desc, _status: 'published' },
    })
    const saved = ev.json?.doc?.description?.root?.children ?? []
    check(ev.status === 201, 'an event saves with a checklist and the kit blocks in its description')
    check(saved.every((n) => n.type !== 'relationship' && n.type !== 'quote' && !(n.type === 'heading' && n.tag === 'h1')), '… Heading 1, block quote and relationship are tidied away on save')
    check(saved.some((n) => n.type === 'heading' && n.tag === 'h2') && saved.some((n) => n.type === 'paragraph'), '… as a Heading 2 and a paragraph')
    const evPage = visible((await page(`/events/${ev.json?.doc?.slug}`, 'cedar-ridge')).text)
    check(/class="b61-checklist"/.test(evPage) && /b61-checklist__item--done/.test(evPage) && evPage.includes('Done: '), 'the event page shows the checklist, ticked rows marked')
    check(evPage.includes(`b61-rt-emphasis">Bring the whole family ${RUN}`), '… the Emphasis line')
    check(/<figure class="b61-rt-quote">[\s\S]*?Best day of the year/.test(evPage), '… the Quote')
    check(evPage.includes(`b61-callout--important`) && evPage.includes(`Parking ${RUN}`), '… the Callout')
    check(evPage.includes(`RSVP ${RUN}`) && evPage.includes('b61-body-btn'), '… and the Button')
    if (ev.json?.doc?.id) await api('DELETE', `/events/${ev.json.doc.id}`, { token: admin })

    // News articles and staff bios use the same editor (and the same tidying).
    const nw = await api('POST', '/news', {
      token: admin,
      body: { school: cedar, title: `Body test ${RUN}`, slug: `body-test-${RUN}`.toLowerCase().replace(/[^a-z0-9-]/g, '-'), date: new Date().toISOString(), body: { root: el('root', [el('heading', [t('Old H1')], { tag: 'h1' }), blk('emphasis', { text: `News emphasis ${RUN}` })]) }, _status: 'published' },
    })
    check(nw.status === 201 && nw.json?.doc?.body?.root?.children?.[0]?.tag === 'h2', 'a news article\'s Heading 1 is tidied to a Heading 2')
    const nwPage = visible((await page(`/news/${nw.json?.doc?.slug}`, 'cedar-ridge')).text)
    check(nwPage.includes(`b61-rt-emphasis">News emphasis ${RUN}`), '… and its Emphasis line shows on the article')
    if (nw.json?.doc?.id) await api('DELETE', `/news/${nw.json.doc.id}`, { token: admin })
    const st = await api('POST', '/staff', {
      token: admin,
      body: {
        school: cedar, name: `Bio Person ${RUN}`, role: 'Teacher',
        bio: { root: el('root', [el('heading', [t(`Why I teach ${RUN}`)], { tag: 'h3' }), blk('pullQuoteText', { text: `Every child can learn ${RUN}` })]) },
        _status: 'published',
      },
    })
    check(st.status === 201, 'a staff bio saves as rich text with a Quote and a subheading')
    const stPage = visible((await page('/staff', 'cedar-ridge')).text)
    check(stPage.includes(`Why I teach ${RUN}`) && /<figure class="b61-rt-quote">[\s\S]*?Every child can learn/.test(stPage), '… and both show on the staff card')
    if (st.json?.doc?.id) await api('DELETE', `/staff/${st.json.doc.id}`, { token: admin })
  }

  // Programs are pages tagged as programs (19 Nov 2026), at /<slug>.
  {
    const slug = `tagged-program-${RUN}`.toLowerCase().replace(/[^a-z0-9-]/g, '-')
    const pg = await api('POST', '/pages', {
      token: admin,
      body: { school: cedar, title: `Tagged program ${RUN}`, slug, isProgram: true, program: { grades: 'PK', summary: `Card words ${RUN}`, order: 1 }, sections: [], _status: 'published' },
    })
    check(pg.status === 201 && pg.json?.doc?.isProgram === true, 'a page can be tagged as a program')
    check((await page(`/${slug}`, 'cedar-ridge')).status === 200, '… and lives at /<slug> like any page')
    const listing = visible((await page('/programs', 'cedar-ridge')).text)
    check(listing.includes(`Tagged program ${RUN}`) && listing.includes(`Card words ${RUN}`) && listing.includes('Grades PK'), 'program cards list it with its grades and summary')
    const grid = listing.slice(listing.indexOf('Our programs'))
    check(grid.indexOf(`Tagged program ${RUN}`) >= 0 && grid.indexOf(`Tagged program ${RUN}`) < grid.indexOf('Lower School'), '… in program order (lowest number first)')
    check(listing.includes(`href="/${slug}"`), '… linking to /<slug>')
    const old = await fetch(`${BASE}/programs/${slug}`, { headers: { cookie: 'b61-school=cedar-ridge' }, redirect: 'manual' })
    check([301, 308].includes(old.status) && old.headers.get('location')?.endsWith(`/${slug}`), 'an old /programs/<slug> link moves to /<slug> for good')
    const plain = await api('POST', '/pages', { token: admin, body: { school: cedar, title: `Not a program ${RUN}`, slug: `not-a-program-${RUN}`.toLowerCase().replace(/[^a-z0-9-]/g, '-'), sections: [], _status: 'published' } })
    check(!visible((await page('/programs', 'cedar-ridge')).text).includes(`Not a program ${RUN}`), 'an untagged page is not in program lists')
    for (const d of [pg, plain]) if (d.json?.doc?.id) await api('DELETE', `/pages/${d.json.doc.id}`, { token: admin })
  }

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
  for (const col of ['staff', 'news-categories']) {
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
    sections: [{ blockType: 'b61Split', heading: [{ text: 'Watch' }], media: 'video', video }],
    // Drafts save without checks (by design); publishing checks every field.
    _status: 'published',
  })
  const ok = await api('POST', '/pages', { token: admin, body: split('https://iframe.mediadelivery.net/embed/123456/0b1c2d3e-4f50-6172-8394-a5b6c7d8e9f0') })
  check(ok.status === 201, 'a Bunny Stream link is accepted')
  const shown = visible((await page(`/${ok.json?.doc?.slug}`, 'cedar-ridge')).text)
  check(shown.includes('iframe.mediadelivery.net/embed/123456/'), "… and plays in Bunny's player on the page")
  const no = await api('POST', '/pages', { token: admin, body: split('https://example.com/my-video.mp4') })
  check(no.status === 400 && /Video/.test(JSON.stringify(no.json)), 'a link that is not YouTube, Vimeo or Bunny is refused with a message')
  if (no.json?.doc?.id) await api('DELETE', `/pages/${no.json.doc.id}`, { token: admin })
  if (ok.json?.doc?.id) await api('DELETE', `/pages/${ok.json.doc.id}`, { token: admin })

  // Hero background from Bunny Stream (plays Bunny's MP4 files from the library's CDN).
  const hero = (bunnyVideo) => ({
    school: cedar,
    title: `Hero video ${RUN}`,
    slug: `hero-video-${RUN}-${Math.random().toString(36).slice(2, 6)}`,
    sections: [{ blockType: 'b61Hero', layoutMode: 'cover', backgroundType: 'video', heading: [{ text: 'Welcome' }], bunnyVideo }],
    _status: 'published',
  })
  const heroOk = await api('POST', '/pages', { token: admin, body: hero('https://iframe.mediadelivery.net/embed/123456/0b1c2d3e-4f50-6172-8394-a5b6c7d8e9f0') })
  check(heroOk.status === 201, 'a Hero accepts a Bunny Stream background video')
  const heroPage = await page(`/${heroOk.json?.doc?.slug}`, 'cedar-ridge')
  if (/b-cdn\.net/.test(heroPage.text)) {
    check(
      heroPage.text.includes('/0b1c2d3e-4f50-6172-8394-a5b6c7d8e9f0/play_720p.mp4') && heroPage.text.includes('/thumbnail.jpg'),
      "… and plays it from Bunny's CDN, with Bunny's thumbnail as the poster",
    )
  } else check(heroPage.status === 200, '… and the page still shows without the Bunny CDN hostname set')
  const heroNo = await api('POST', '/pages', { token: admin, body: hero('https://www.youtube.com/watch?v=dQw4w9WgXcQ') })
  check(heroNo.status === 400 && /Video|Bunny Stream link/.test(JSON.stringify(heroNo.json)), "a Hero background link that isn't Bunny is refused with a message")
  for (const d of [heroOk, heroNo]) if (d.json?.doc?.id) await api('DELETE', `/pages/${d.json.doc.id}`, { token: admin })

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
  // Fonts come inlined (the server fetched Google's stylesheet, which Google only
  // serves when every requested weight exists) or, when Google is out of reach,
  // as a <link> whose address can be checked directly.
  const harborHome = (await page('/', 'harbor-oaks')).text
  const fontsLink = harborHome.match(/https:\/\/fonts\.googleapis\.com\/css2\?[^"]+/)?.[0]?.replace(/&amp;/g, '&') ?? ''
  const inlined = /<style id="b61-fonts">[\s\S]*?font-family: 'Lato'/.test(harborHome)
  check(inlined || (fontsLink && !/family=Lato:[^&]*\b(500|600)\b/.test(fontsLink)), 'font requests only name weights the font has (Lato has no 500/600)')

  // ----- Alt text (required unless Claude writes it) ---------------------------
  console.log('\nAlt text')
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64')
  const upload = async (fields) => {
    const form = new FormData()
    form.append('file', new Blob([png], { type: 'image/png' }), `alt-test-${RUN}.png`)
    form.append('_payload', JSON.stringify({ school: cedar, ...fields }))
    const res = await fetch(BASE + '/api/media', { method: 'POST', headers: { Authorization: `JWT ${admin}` }, body: form })
    return { status: res.status, json: await res.json().catch(() => null) }
  }
  const altCfg = await api('GET', '/media/fill-alt', { token: admin })
  if (altCfg.json?.enabled) {
    console.log('  (skipped: ANTHROPIC_API_KEY is set, so missing alt text is written automatically)')
  } else {
    const noAlt = await upload({})
    check(noAlt.status === 400 && /Add alt text/.test(JSON.stringify(noAlt.json)), 'a photo without alt text is refused with a message (no AI key)')
    const withAlt = await upload({ alt: 'A test square' })
    check(withAlt.status === 201 && !withAlt.json?.doc?.altAuto, '… and saves once alt text is typed in')
    if (withAlt.json?.doc?.id) await api('DELETE', `/media/${withAlt.json.doc.id}`, { token: admin })
    check(altCfg.status === 200 && altCfg.json?.enabled === false, '"Write missing alt text" stays hidden without the AI key')
  }

  // ----- Videos never go to the Photos library (Vercel); they belong on Bunny ---
  {
    const form = new FormData()
    form.append('file', new Blob([Buffer.from('not really a video')], { type: 'video/mp4' }), `clip-${RUN}.mp4`)
    form.append('_payload', JSON.stringify({ school: cedar, alt: 'A clip' }))
    const res = await fetch(BASE + '/api/media', { method: 'POST', headers: { Authorization: `JWT ${admin}` }, body: form })
    const body = await res.json().catch(() => null)
    check(res.status >= 400 && res.status < 500, 'a video file is refused by the Photos library (videos go to Bunny)')
    if (body?.doc?.id) await api('DELETE', `/media/${body.doc.id}`, { token: admin })
  }

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

  // ----- Page caching (Thread H) -----------------------------------------------
  // Visitors' pages are cached per school; publishing must show on the next visit.
  console.log('\nPage caching')
  const post = (await api('GET', `/news?where[school][equals]=${cedar}&where[_status][equals]=published&limit=1&depth=0`, { token: admin })).json?.docs?.[0]
  if (post) {
    const fresh = `Cache check ${RUN}`
    await page(`/news/${post.slug}`, 'cedar-ridge') // fills the cache
    await api('PATCH', `/news/${post.id}`, { token: admin, body: { title: fresh, _status: 'published' } })
    check(visible((await page(`/news/${post.slug}`, 'cedar-ridge')).text).includes(fresh), 'a published edit shows on the very next visit')
    check(visible((await page('/news', 'cedar-ridge')).text).includes(fresh), '… on the news list too')
    await api('PATCH', `/news/${post.id}?draft=true`, { token: admin, body: { title: `Draft ${fresh}` } })
    check(!visible((await page(`/news/${post.slug}`, 'cedar-ridge')).text).includes(`Draft ${fresh}`), 'a draft save stays off the public page')
    check(!visible((await page('/news', 'harbor-oaks')).text).includes(fresh), "another school's cache never shows it")
    await api('PATCH', `/news/${post.id}`, { token: admin, body: { title: post.title, _status: 'published' } })
  }

  // ----- Site tone, custom CSS and element classes -------------------------------
  console.log('\nSite tone and custom CSS')
  const hs = (await api('GET', `/school-settings?where[school][equals]=${harbor}&depth=0`, { token: admin })).json?.docs?.[0]
  if (hs) {
    const marker = `css-check-${RUN}`
    await api('PATCH', `/school-settings/${hs.id}`, {
      token: admin,
      body: { siteTone: 'dark', customCss: `.${marker} { color: red } </style><b id="${marker}-escaped">x</b>`, _status: 'published' },
    })
    const dark = (await page('/', 'harbor-oaks')).text
    check(dark.includes('data-b61-tone="dark"'), 'a dark site marks its page as dark')
    check(dark.includes(`.${marker} { color: red }`), 'custom CSS is on the page')
    check(!dark.includes(`</style><b id="${marker}-escaped">`), '… and cannot close its style tag')
    check((await page('/', 'cedar-ridge')).text.includes('data-b61-tone="light"'), "another school's tone is untouched")

    // A Harbor Oaks Editor can change the look but not the Banner 61-only CSS.
    const edEmail = `feat-editor-${RUN}@example.com`
    await api('POST', '/users', { token: admin, body: { email: edEmail, password: PASSWORD, name: 'Feature editor', role: 'editor', tenants: [{ tenant: harbor, role: 'editor' }] } })
    const editor = await login(edEmail, PASSWORD)
    await api('PATCH', `/school-settings/${hs.id}`, { token: editor, body: { customCss: 'body { display: none }', _status: 'published' } })
    const after = (await api('GET', `/school-settings/${hs.id}?depth=0`, { token: admin })).json
    check(String(after?.customCss ?? '').includes(marker), 'an Editor cannot change the custom CSS')

    // Element CSS class (Design > Advanced).
    const hp = (await api('GET', `/pages?where[school][equals]=${harbor}&where[slug][equals]=home&depth=0`, { token: admin })).json?.docs?.[0]
    if (hp?.sections?.length) {
      const withClass = hp.sections.map((s, i) => (i === 0 ? { ...s, cssClass: `${marker} wide` } : s))
      await api('PATCH', `/pages/${hp.id}`, { token: admin, body: { sections: withClass, _status: 'published' } })
      check((await page('/', 'harbor-oaks')).text.includes(`class="b61-custom ${marker} wide"`), 'an element carries its CSS class')
      const bad = await api('PATCH', `/pages/${hp.id}`, { token: admin, body: { sections: hp.sections.map((s, i) => (i === 0 ? { ...s, cssClass: 'no"quotes' } : s)) } })
      check(bad.status >= 400, 'a CSS class with odd characters is refused')
      await api('PATCH', `/pages/${hp.id}`, { token: editor, body: { sections: hp.sections.map((s, i) => (i === 0 ? { ...s, cssClass: 'editor-class' } : s)), _status: 'published' } })
      const kept = (await api('GET', `/pages/${hp.id}?depth=0`, { token: admin })).json
      check(kept?.sections?.[0]?.cssClass === `${marker} wide`, 'an Editor cannot change an element CSS class')
      await api('PATCH', `/pages/${hp.id}`, { token: admin, body: { sections: hp.sections.map((s) => ({ ...s, cssClass: null })), _status: 'published' } })
    }

    await api('PATCH', `/school-settings/${hs.id}`, { token: admin, body: { siteTone: hs.siteTone ?? 'light', customCss: hs.customCss ?? null, _status: 'published' } })
    const ed = (await api('GET', `/users?where[email][equals]=${encodeURIComponent(edEmail)}&depth=0`, { token: admin })).json?.docs?.[0]
    if (ed) await api('DELETE', `/users/${ed.id}`, { token: admin })
  }

  // ----- Style: themes and dials ---------------------------------------------------
  console.log('\nStyle (themes and dials)')
  const hs2 = (await api('GET', `/school-settings?where[school][equals]=${harbor}&depth=0`, { token: admin })).json?.docs?.[0]
  if (hs2) {
    const before = (await page('/', 'harbor-oaks')).text
    check(!before.includes('data-b61-hcase') && !before.includes('--b61-radius-btn'), 'Classic (no theme) adds no style to the page')
    await api('PATCH', `/school-settings/${hs2.id}`, { token: admin, body: { style: { theme: 'bold' }, _status: 'published' } })
    const bold = (await page('/', 'harbor-oaks')).text
    check(bold.includes('data-b61-hcase="upper"') && bold.includes('--b61-radius-btn:0px'), 'the Bold theme sets capitals and square buttons')
    check(!(await page('/', 'cedar-ridge')).text.includes('data-b61-hcase'), "another school's style is untouched")
    check(bold.includes('data-b61-theme="bold"') && !before.includes('data-b61-theme'), "a Schoolbox theme marks the page for its own element styles; Classic doesn't")
    await api('PATCH', `/school-settings/${hs2.id}`, { token: admin, body: { style: { theme: 'bold', buttons: 'pill', headingCase: 'typed' }, _status: 'published' } })
    const mixed = (await page('/', 'harbor-oaks')).text
    check(!mixed.includes('data-b61-hcase') && !mixed.includes('--b61-radius-btn') && mixed.includes('--b61-radius:0px'), "a school's own dial overrides its theme; the rest follow the theme")
    const edEmail2 = `feat-style-${RUN}@example.com`
    await api('POST', '/users', { token: admin, body: { email: edEmail2, password: PASSWORD, name: 'Style editor', role: 'editor', tenants: [{ tenant: harbor, role: 'schoolAdmin' }] } })
    const ed2 = await login(edEmail2, PASSWORD)
    await api('PATCH', `/school-settings/${hs2.id}`, { token: ed2, body: { style: { theme: 'warm' }, _status: 'published' } })
    const kept2 = (await api('GET', `/school-settings/${hs2.id}?depth=0`, { token: admin })).json
    check(kept2?.style?.theme === 'bold', 'a School Admin cannot change the style (Banner 61 only)')
    // Header and footer layouts (L2).
    await api('PATCH', `/school-settings/${hs2.id}`, { token: admin, body: { style: { header: 'overlay', footer: 'wordmark' }, _status: 'published' } })
    const lay = (await page('/', 'harbor-oaks')).text
    check(lay.includes('data-b61-header="overlay"') && lay.includes('data-b61-footer="wordmark"'), 'header and footer layouts reach the page')
    check(lay.includes('class="b61-ftr__wordmark"'), 'the wordmark footer carries the school name')
    check(!(await page('/', 'cedar-ridge')).text.includes('data-b61-header'), "another school's header is untouched")

    // Hero layouts (L2): Split screen and Big headline, and the over-the-hero marker.
    const hhp = (await api('GET', `/pages?where[school][equals]=${harbor}&where[slug][equals]=home&depth=0`, { token: admin })).json?.docs?.[0]
    const hi = hhp?.sections?.findIndex((x) => x.blockType === 'b61Hero') ?? -1
    if (hi === 0) {
      const withKind = (k, extra = {}) => hhp.sections.map((x, i) => (i === hi ? { ...x, layoutMode: k, ...extra } : x))
      await api('PATCH', `/pages/${hhp.id}`, { token: admin, body: { sections: withKind('split', { splitSide: 'left', surface: 'primary' }), _status: 'published' } })
      const sp = (await page('/', 'harbor-oaks')).text
      check(sp.includes('b61-hero--split-left') && sp.includes('b61-hero__split-media'), 'a Split screen hero renders its photo half')
      check(!sp.includes('data-b61-over-ok'), '… and never lets the header lie over it')
      await api('PATCH', `/pages/${hhp.id}`, { token: admin, body: { sections: withKind('type', { surface: 'primary' }), _status: 'published' } })
      const ty = (await page('/', 'harbor-oaks')).text
      check(ty.includes('b61-hero--type') && ty.includes('data-b61-over-ok'), 'a Big headline hero renders, dark enough for the header to lie over')
      await api('PATCH', `/pages/${hhp.id}`, { token: admin, body: { sections: hhp.sections, _status: 'published' } })
    }

    await api('PATCH', `/school-settings/${hs2.id}`, { token: admin, body: { style: hs2.style ?? { theme: null }, _status: 'published' } })

    // Theme preview (/next/theme/<name>): demo and preview addresses only, the school's own settings untouched.
    const pv = await fetch(`${BASE}/next/theme/heritage?to=/about`, { headers: { cookie: `b61-school=harbor-oaks` }, redirect: 'manual' })
    const pvCookie = (pv.headers.get('set-cookie') ?? '').match(/b61-theme-preview=([^;]*)/)?.[1]
    check([303, 307, 308].includes(pv.status) && pvCookie === 'heritage' && (pv.headers.get('location') ?? '').endsWith('/about'), 'a theme preview link remembers the theme and opens the page asked for')
    const viaPv = await fetch(`${BASE}/`, { headers: { cookie: `b61-school=harbor-oaks; b61-theme-preview=heritage` } }).then((r) => r.text())
    check(viaPv.includes('data-b61-theme="heritage"') && viaPv.includes('data-b61-header="centred"') && viaPv.includes('class="b61-theme-bar"'), '… shows the school in that theme, with the preview bar')
    check(/Cormorant(\+|\s|&quot;|\\u0026quot;)?Garamond/.test(viaPv) && !/Playfair/.test(viaPv), "… and in the theme's fonts")
    const still = (await api('GET', `/school-settings/${hs2.id}?depth=0`, { token: admin })).json
    check((still?.style?.theme ?? null) === (hs2.style?.theme ?? null), "… without changing the school's own settings")
    check((await fetch(`${BASE}/next/theme/nope`, { redirect: 'manual' })).status === 404, 'an unknown theme name is refused')
    check((await fetch(`${BASE}/next/theme/warm?to=//evil.example`, { redirect: 'manual' }).then((r) => r.headers.get('location') ?? '')).endsWith('/') , '… and the link never sends visitors to another address')

    // The Schoolbox demo school and its per-theme home pages.
    for (const t of ['heritage', 'warm', 'bold']) {
      const sb = await page(`/home-${t}`, 'schoolbox')
      check(sb.status === 200 && sb.text.includes('Known by name'), `the Schoolbox demo has its ${t} home page`)
    }
    const tl = (await api('GET', '/pages/templates', { token: admin })).json?.templates ?? []
    check(tl.some((x) => x.key === 'schoolbox-home'), 'the Home (Schoolbox) page template is offered')

    const u2 = (await api('GET', `/users?where[email][equals]=${encodeURIComponent(edEmail2)}&depth=0`, { token: admin })).json?.docs?.[0]
    if (u2) await api('DELETE', `/users/${u2.id}`, { token: admin })
  }

  // ----- Content editor: Button, Callout, Table -------------------------------
  console.log('\nContent editor (button, callout, table)')
  {
    const t = (text) => ({ type: 'text', text, version: 1, format: 0, detail: 0, mode: 'normal', style: '' })
    const para = (text) => ({ type: 'paragraph', version: 1, format: '', indent: 0, direction: 'ltr', textFormat: 0, children: [t(text)] })
    const cell = (text, headerState = 0) => ({ type: 'tablecell', version: 1, headerState, colSpan: 1, rowSpan: 1, format: '', indent: 0, direction: 'ltr', children: [para(text)] })
    const row = (cells) => ({ type: 'tablerow', version: 1, format: '', indent: 0, direction: 'ltr', children: cells })
    const blockNode = (blockType, fields) => ({ type: 'block', version: 2, format: '', fields: { id: `t${RUN}${blockType}`.slice(-24), blockName: '', blockType, ...fields } })
    const body = {
      root: {
        type: 'root', version: 1, format: '', indent: 0, direction: 'ltr',
        children: [
          para('Tours run every Tuesday.'),
          blockNode('bodyButton', { label: `Schedule a tour ${RUN}`, variant: 'primary', link: { type: 'url', url: '/inquire' } }),
          blockNode('callout', { tone: 'important', title: `Applications due March 1 ${RUN}`, text: 'Late applications join the waiting list.', linkLabel: 'Start your application', link: { type: 'url', url: '/apply' } }),
          {
            type: 'table', version: 1, format: '', indent: 0, direction: 'ltr',
            children: [row([cell('Grade', 1), cell('Tuition', 1)]), row([cell('K-5'), cell(`$9,800 ${RUN}`)]), row([cell('6-8'), cell('$10,900')])],
          },
        ],
      },
    }
    const made = await api('POST', '/pages/from-template', { token: admin, body: { template: 'about', school: harbor, title: `Editor ${RUN}` } })
    const pid = made.json?.id
    const pr = pid
      ? await api('PATCH', `/pages/${pid}`, { token: admin, body: { sections: [{ blockType: 'b61Prose', body }], _status: 'published' } })
      : { status: 0 }
    check(pr.status === 200, 'a Prose body with a Button, a Callout and a Table saves')
    const slug = pr.json?.doc?.slug
    const ed = slug ? visible((await page(`/${slug}`, 'harbor-oaks')).text) : ''
    check(/class="b61-body-btn b61-block[^"]*"[^>]*>\s*<a class="b61-btn b61-btn--primary" href="\/inquire">Schedule a tour/.test(ed), 'the Button renders inside the text, linked')
    check(ed.includes('class="b61-callout b61-callout--important') && ed.includes('role="note"') && ed.includes(`Applications due March 1 ${RUN}`) && ed.includes('href="/apply"'), 'the Callout renders with its tone, title and link')
    check(ed.includes('class="b61-table"') && /<thead><tr><th scope="col">/.test(ed) && ed.includes(`$9,800 ${RUN}`), 'the Table renders with a header row')
    check(!/<t[dh][^>]*style=/.test(ed), "… and carries no hard-coded colours, so themes and dark sites can style it")
    if (pid) await api('DELETE', `/pages/${pid}`, { token: admin })
  }

  // ----- Layout options (Wake patterns) ------------------------------------------
  console.log('\nLayout options')
  {
    const li = visible((await page('/layout-ideas', 'cedar-ridge')).text)
    check(/data-b61-rotate="\[&quot;Learning&quot;,&quot;Missions&quot;,&quot;Athletics&quot;\]"/.test(li), 'the hero carries its changing words')
    check(/<h1[^>]*>[\s\S]*Excellence in (<em[^>]*>)?<span class="b61-rotate"[^>]*><span class="b61-rotate__word">Learning<\/span><\/span>(<\/em>)?\./.test(li), '… and its heading reads as typed')
    check(/class="b61-link b61-btn--video" href="https:\/\/www\.youtube\.com\/watch\?v=[^"]+" data-b61-video=/.test(li), 'a button set to a video links to it and opens the pop-up player')
    check(li.includes('b61-stats--part b61-stats--part-right') && li.includes('b61-stats--pull'), 'a Stats Band can sit on the right and pull up')
    check(li.includes('class="b61-split__badge"'), 'a Split shows its corner badge')
    check(li.includes('b61-bg b61-bg--duotone'), 'a Section photo can be duotone')
    check(['b61-cards__region--beside', 'b61-cards__region--stagger', 'b61-cards__region--reveal', 'b61-cards__region--alt-tint', 'b61-cards__region--bleed'].every((c) => li.includes(c)), 'Card Grid layout options render')
    check(li.includes('aria-label="Quick links"') && li.includes('b61-quick__label">Apply<'), 'Side buttons show on Cedar Ridge')
    check(!visible((await page('/layout-ideas', 'harbor-oaks')).text).includes('aria-label="Quick links"'), '… and not at a school without them')

    // Changing words take turns with the heading's emphasized words.
    const bad = await api('POST', '/pages', {
      token: admin,
      body: { school: harbor, title: `Words ${RUN}`, slug: `words-${RUN}`, _status: 'published', sections: [{ blockType: 'b61Hero', heading: 'A place to grow', changingWords: 'Learning, Faith' }] },
    })
    check(bad.status >= 400, 'changing words with nothing emphasized in the heading are refused')
    const good = await api('POST', '/pages', {
      token: admin,
      body: { school: harbor, title: `Words ok ${RUN}`, slug: `words-ok-${RUN}`, _status: 'published', sections: [{ blockType: 'b61Hero', heading: 'A place to grow in *faith*', changingWords: 'Learning, Service' }] },
    })
    check(good.status < 400, '… and accepted once words are emphasized')
    if (good.status < 400) {
      const html = (await page(`/words-ok-${RUN}`, 'harbor-oaks')).text
      check(html.includes('data-b61-rotate="[&quot;faith&quot;,&quot;Learning&quot;,&quot;Service&quot;]"'), '… and the emphasized words rotate')
      check(/<h1[^>]*>[\s\S]*?<em class="b61-hero__title-line--em">/.test(html), 'emphasized words inside a heading line are an <em>')
    }

    // Banner 61-only options: a school Contributor's save keeps them.
    const lp = (await api('GET', `/pages?where[school][equals]=${cedar}&where[slug][equals]=layout-ideas&depth=0&draft=true`, { token: admin })).json?.docs?.[0]
    const si = (lp?.sections ?? []).findIndex((x) => x.blockType === 'b61StatsBand')
    if (lp && si >= 0) {
      const edited = lp.sections.map((x, i) => (i === si ? { ...x, eyebrow: `Contrib ${RUN}`, pullUp: false, bandWidth: 'full' } : x))
      await api('PATCH', `/pages/${lp.id}?draft=true`, { token: contrib, body: { sections: edited, _status: 'draft' } })
      const got = (await api('GET', `/pages/${lp.id}?depth=0&draft=true`, { token: admin })).json?.sections?.[si]
      check(got?.eyebrow === `Contrib ${RUN}`, "a Contributor's draft of the page is saved")
      check(got?.pullUp === true && got?.bandWidth === 'right', '… but keeps the Banner 61-only layout options')
      await api('PATCH', `/pages/${lp.id}`, { token: admin, body: { sections: lp.sections, _status: 'published' } })
    } else check(false, 'the Layout ideas demo page exists')

    // A pop-up announcement renders as a dialog, closed until the page has loaded.
    await api('POST', '/announcements', {
      token: admin,
      body: { school: harbor, title: `Pop-up ${RUN}`, display: 'popup', style: 'standard', showOn: 'all', startsAt: new Date(Date.now() - 60000).toISOString(), _status: 'published' },
    })
    const hp2 = visible((await page('/', 'harbor-oaks')).text)
    check(/<dialog class="b61-popup b61-popup--center b61-popup--standard"[^>]*>[\s\S]*?Pop-up /.test(hp2) && !/<dialog class="b61-popup[^"]*" open/.test(hp2), 'a pop-up announcement is a closed dialog on load')
    check(!new RegExp(`b61-notice__title">Pop-up ${RUN}`).test(hp2), '… and not a bar')

    // Pop-up options (19 Nov 2026): corner, chosen pages, a form, its own slots.
    const started = new Date(Date.now() - 60000).toISOString()
    const inquire = (await api('GET', `/pages?where[school][equals]=${harbor}&where[slug][equals]=inquire&depth=0&draft=true`, { token: admin })).json?.docs?.[0]
    const hForm = (await api('GET', `/forms?where[school][equals]=${harbor}&limit=1&depth=0`, { token: admin })).json?.docs?.[0]
    check(Boolean(inquire && hForm), 'Harbor Oaks has an Inquire page and a form')
    const pp = await api('POST', '/announcements', {
      token: admin,
      body: {
        school: harbor, title: `Pages pop-up ${RUN}`, display: 'popup', popupOpens: 'scroll', popupRepeat: 'week',
        style: 'celebrate', showOn: 'pages', pages: [inquire?.id], form: hForm?.id, message: 'x'.repeat(300), startsAt: started, _status: 'published',
      },
    })
    check(pp.status === 201 && pp.json?.doc?.popupOpens === 'scroll' && pp.json?.doc?.popupRepeat === 'week', 'a pop-up saves its opening and repeat choices')
    check(pp.status === 201, '… and its message can be longer than a bar (300 characters)')
    const longBar = await api('POST', '/announcements', {
      token: admin,
      body: { school: harbor, title: `Long bar ${RUN}`, display: 'bar', style: 'standard', showOn: 'all', message: 'x'.repeat(300), startsAt: started, _status: 'published' },
    })
    check(longBar.status >= 400, 'a bar message over 200 characters is refused')
    const longPop = await api('POST', '/announcements', {
      token: admin,
      body: { school: harbor, title: `Long pop-up ${RUN}`, display: 'popup', style: 'standard', showOn: 'all', message: 'x'.repeat(450), startsAt: started, _status: 'published' },
    })
    check(longPop.status >= 400, 'a pop-up message over 400 characters is refused')
    const noPages = await api('POST', '/announcements', {
      token: admin,
      body: { school: harbor, title: `No pages ${RUN}`, style: 'standard', showOn: 'pages', pages: [], startsAt: started, _status: 'published' },
    })
    check(noPages.status >= 400, '"Only the pages I choose" needs at least one page')
    // Celebration ranks before Standard, so on /inquire this one is the pop-up.
    const inq = visible((await page('/inquire', 'harbor-oaks')).text)
    const dlg = inq.match(/<dialog class="b61-popup b61-popup--center b61-popup--celebrate b61-popup--has-form"[\s\S]*?<\/dialog>/)?.[0] ?? ''
    check(dlg.includes(`Pages pop-up ${RUN}`), 'a pop-up for chosen pages shows on that page')
    check(dlg.includes('class="b61-form') && dlg.includes('b61-popup__form'), '… with the school form inside it')
    check(!visible((await page('/', 'harbor-oaks')).text).includes(`Pages pop-up ${RUN}`), '… and not on other pages')
    // A corner pop-up (urgent, so it is the home page's pop-up) waits closed.
    await api('POST', '/announcements', {
      token: admin,
      body: { school: harbor, title: `Corner pop-up ${RUN}`, display: 'popup', popupPosition: 'corner', style: 'urgent', showOn: 'home', startsAt: started, _status: 'published' },
    })
    const home3 = visible((await page('/', 'harbor-oaks')).text)
    check(home3.includes('aria-live="polite"') && !home3.includes('b61-popup--corner'), 'a corner pop-up is not over the page on load')
    check(!/<dialog class="b61-popup b61-popup--center b61-popup--standard"/.test(home3), '… and only one pop-up is on the page')

    // A form answer sent from a pop-up records which pop-up (20 Nov 2026); a
    // pop-up from another school is ignored.
    {
      const contact = (await api('GET', `/forms?where[school][equals]=${harbor}&where[title][equals]=Contact us&limit=1&depth=0`, { token: admin })).json?.docs?.[0]
      const cp = await api('POST', '/announcements', {
        token: admin,
        body: { school: harbor, title: `Contact pop-up ${RUN}`, display: 'popup', style: 'urgent', showOn: 'pages', pages: [inquire?.id], form: contact?.id, startsAt: started, _status: 'published' },
      })
      const html = (await page('/inquire', 'harbor-oaks')).text
      const dlg2 = html.slice(html.indexOf(`Contact pop-up ${RUN}`) - 2000)
      const val = (name) => dlg2.match(new RegExp(`name="${name}" value="([^"]*)"`))?.[1]
      const topic = dlg2.match(/<select[^>]*name="topic"[\s\S]*?<option[^>]*value="([^"]+)"/)?.[1] ?? 'Admissions'
      check(val('b61_from') === String(cp.json?.doc?.id), "a pop-up's form carries which pop-up it is in")
      const send = async (from) => {
        const fd = new FormData()
        fd.set('form', val('form') ?? String(contact?.id))
        fd.set('b61_t', val('b61_t') ?? '')
        fd.set('b61_from', String(from))
        fd.set('name', `Pop-up Tester ${from} ${RUN}`)
        fd.set('email', 'popup-test@example.com')
        fd.set('topic', topic)
        fd.set('message', 'Sent from a pop-up.')
        const r = await fetch(`${BASE}/next/form`, { method: 'POST', body: fd, headers: { accept: 'application/json', cookie: 'b61-school=harbor-oaks' } })
        const res = await r.json().catch(() => ({}))
        // The site's reply has no id: find the answer by the name sent.
        const found = (await api('GET', `/form-submissions?where[summary][like]=${encodeURIComponent(`Pop-up Tester ${from} ${RUN}`)}&depth=0&limit=1`, { token: admin })).json?.docs?.[0]
        return { ok: res.ok, id: found?.id }
      }
      await new Promise((r) => setTimeout(r, 3200)) // the form refuses answers sent faster than a person types
      const ok = await send(cp.json?.doc?.id)
      check(ok.ok === true, '… and its answer is saved')
      const sub = ok.id ? (await api('GET', `/form-submissions/${ok.id}?depth=0`, { token: admin })).json : null
      check(sub && String(sub.fromAnnouncement) === String(cp.json?.doc?.id), '… with "Came from pop-up" set')
      const other = (await api('GET', `/announcements?where[school][equals]=${cedar}&limit=1&depth=0`, { token: admin })).json?.docs?.[0]
      if (other) {
        const forged = await send(other.id)
        const sub2 = forged.id ? (await api('GET', `/form-submissions/${forged.id}?depth=0`, { token: admin })).json : null
        check(forged.ok === true && sub2 && !sub2.fromAnnouncement, "… and another school's pop-up is never recorded")
        if (forged.id) await api('DELETE', `/form-submissions/${forged.id}`, { token: admin })
      }
      if (ok.id) await api('DELETE', `/form-submissions/${ok.id}`, { token: admin })
      if (cp.json?.doc?.id) await api('DELETE', `/announcements/${cp.json.doc.id}`, { token: admin })
    }
    // Pop-ups don't use up the three bar slots.
    for (const n of [1, 2, 3]) {
      await api('POST', '/announcements', {
        token: admin,
        body: { school: harbor, title: `Bar ${n} ${RUN}`, display: 'bar', style: 'standard', showOn: 'all', startsAt: started, _status: 'published' },
      })
    }
    const home4 = visible((await page('/', 'harbor-oaks')).text)
    check([1, 2, 3].every((n) => home4.includes(`Bar ${n} ${RUN}`)), 'three bars still show alongside pop-ups')
    for (const n of [1, 2, 3]) {
      const b = (await api('GET', `/announcements?where[title][equals]=${encodeURIComponent(`Bar ${n} ${RUN}`)}&depth=0`, { token: admin })).json?.docs?.[0]
      if (b) await api('DELETE', `/announcements/${b.id}`, { token: admin })
    }
  }

  // ----- Layout options (Canterbury patterns) ----------------------------------
  console.log('\nMore layout options')
  {
    const mp = visible((await page('/more-layout-ideas', 'cedar-ridge')).text)
    check(/class="b61-story b61-story--nav-left" data-b61-story/.test(mp) && (mp.match(/class="b61-story__step"/g) ?? []).length === 4, 'Pillars can be a scroll story, every item in the page')
    check(/<a class="b61-story__link" href="#b61-pillars-[^"]+-step-1">/.test(mp), '… with its titles as links to the items')
    check(/b61-tabs[\s\S]*b61-cards__region--feature/.test(mp), 'a tab can hold a Card Grid, with a larger middle card')
    check(mp.includes('b61-cards__region--duotone b61-duotone--deep') && mp.includes('b61-gallery__region--duotone b61-duotone--light'), 'Card Grid and Gallery photos can be duotone')
    check(/data-b61-marquee[\s\S]*?aria-pressed="false"[\s\S]*?Pause logos/.test(mp), 'a scrolling Logos row has a pause button')
    check(/<ul class="b61-logos__list" aria-hidden="true">/.test(mp), '… and its looping copy is hidden from screen readers')
    check(mp.includes('b61-logos__region--still b61-logos__region--mono'), 'a still Logos row in one colour')

    // Accent heading font: set, the page asks Google for it and marks <html>.
    const cs = (await api('GET', `/school-settings?where[school][equals]=${harbor}&depth=0`, { token: admin })).json?.docs?.[0]
    if (cs) {
      await api('PATCH', `/school-settings/${cs.id}`, { token: admin, body: { accentFont: 'EB Garamond' } })
      const hp = (await page('/', 'harbor-oaks')).text
      check(/<html[^>]*data-b61-accent-font=""/.test(hp) && /--b61-font-accent:\s*(&quot;|")EB Garamond/.test(hp), 'an accent heading font marks the page and sets its font')
      check(/fonts\.googleapis\.com\/css2\?[^"]*family=EB\+Garamond[:&]|font-family:\s*['"]EB Garamond['"]/.test(hp.replace(/&amp;/g, '&')), '… and is loaded from Google Fonts')
      await api('PATCH', `/school-settings/${cs.id}`, { token: admin, body: { accentFont: null } })
      check(!/data-b61-accent-font/.test((await page('/', 'harbor-oaks')).text), '… and goes away when cleared')
    } else check(false, 'Harbor Oaks has School settings')
  }

  // ----- Section colour is shared --------------------------------------------------
  console.log('\nSection colour')
  {
    const stats = (label) => ({ blockType: 'b61StatsBand', eyebrow: label, stats: [{ value: '12', label: 'Teams' }, { value: '9', label: 'Clubs' }] })
    const cta = (label) => ({ blockType: 'b61Cta', heading: [{ text: label }] })
    const made = await api('POST', '/pages', {
      token: admin,
      body: {
        school: harbor, title: `Colour ${RUN}`, slug: `colour-${RUN}`, _status: 'published',
        sections: [
          stats(`Alone ${RUN}`),
          { blockType: 'b61Section', surface: 'dark', content: [stats(`Inside ${RUN}`), cta(`Inside CTA ${RUN}`), { ...stats(`Chosen ${RUN}`), surface: 'soft' }] },
        ],
      },
    })
    const cp = visible((await page(`/colour-${RUN}`, 'harbor-oaks')).text)
    const region = (label) => (cp.match(new RegExp(`class="b61-stats__region ([^"]*)"[^>]*>(?:(?!b61-stats__region)[\\s\\S])*?${label}`)) ?? [])[1] ?? ''
    check(made.status < 300 && region(`Alone ${RUN}`).startsWith('b61-surface--soft'), 'a Stats Band on its own keeps its Light wash')
    check(region(`Inside ${RUN}`).startsWith('b61-surface--none'), "… and inside a Section shares the Section's colour")
    check(/class="b61-cta__region b61-surface--none/.test(cp), '… as does a CTA Band')
    check(region(`Chosen ${RUN}`).startsWith('b61-surface--soft'), '… unless it picks its own')
    if (made.json?.doc?.id) await api('DELETE', `/pages/${made.json.doc.id}`, { token: admin })
  }

  // ----- Links open where they should (no "new tab" choice) -------------------
  console.log('\nLinks')
  {
    const visit = (await api('GET', `/pages?where[slug][equals]=visit&where[school][equals]=${cedar}&depth=0&limit=1`, { token: admin })).json?.docs?.[0]
    const made = await api('POST', '/pages', {
      token: admin,
      body: {
        school: cedar, title: `Links ${RUN}`, slug: `links-${RUN}`, _status: 'published',
        sections: [{ blockType: 'b61CardGrid', heading: [{ text: 'Links' }], source: 'manual', cards: [{ title: 'One' }],
          buttons: [
            { label: `Our page ${RUN}`, link: { type: 'page', page: visit?.id } },
            { label: `Elsewhere ${RUN}`, link: { type: 'url', url: 'https://example.com/' } },
            { label: `On this site ${RUN}`, link: { type: 'url', url: '/apply' } },
          ] }],
      },
    })
    const html = (await page(`/links-${RUN}`, 'cedar-ridge')).text
    const tag = (label) => (html.match(new RegExp(`<a [^>]*>${label}`)) ?? [''])[0]
    check(made.status < 300 && /href="\/visit"/.test(tag(`Our page ${RUN}`)) && !/target=/.test(tag(`Our page ${RUN}`)), 'a page on the site opens in the same tab')
    check(/target="_blank"/.test(tag(`Elsewhere ${RUN}`)), 'another website opens in a new tab')
    check(!/target=/.test(tag(`On this site ${RUN}`)), 'a web address on this site ("/apply") opens in the same tab')
    if (made.json?.doc?.id) await api('DELETE', `/pages/${made.json.doc.id}`, { token: admin })
  }

  // ----- Videos: one upload, used anywhere -----------------------------------
  console.log('\nVideos')
  {
    const link = 'https://iframe.mediadelivery.net/embed/123456/0b1c2d3e-4f50-6172-8394-a5b6c7d8e9f1'
    const v = await api('POST', '/videos', { token: admin, body: { school: cedar, title: `Tour ${RUN}`, link } })
    check(v.status === 201, 'a video can be added to the Videos list')
    const listed = await api('GET', `/videos?where[school][equals]=${cedar}&limit=200&depth=0`, { token: contrib })
    check((listed.json?.docs ?? []).some((d) => d.link === link), "… and staff at the school see it to choose it")
    const used = await api('POST', '/pages', { token: admin, body: { school: cedar, title: `Uses ${RUN}`, slug: `uses-${RUN}`, _status: 'published', sections: [{ blockType: 'b61Split', heading: [{ text: 'Watch' }], media: 'video', video: link }] } })
    const usage = await api('GET', `/videos/${v.json?.doc?.id}/usage`, { token: admin })
    check((usage.json?.hits ?? []).some((h) => String(h.id) === String(used.json?.doc?.id)), '… its "Where this is used" lists the page using it')
    const refused = await api('DELETE', `/videos/${v.json?.doc?.id}`, { token: admin })
    check(refused.status === 409, "… and it can't be deleted while a page uses it")
    if (used.json?.doc?.id) await api('DELETE', `/pages/${used.json.doc.id}`, { token: admin })
    const gone = await api('DELETE', `/videos/${v.json?.doc?.id}`, { token: admin })
    check(gone.status === 200, '… once nothing uses it, it can be deleted')
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
