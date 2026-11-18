// Schoolbox setup test (build plan step 1): the setup stage, saving spots,
// building the Home page from spots as a draft, and signed setup preview links.
// Runs against a site with the demo schools and a Banner 61 admin account (the
// smoke test creates one):
//
//   BASE_URL=http://localhost:3000 SMOKE_EMAIL=... SMOKE_PASSWORD=... node scripts/setup.mjs
//
// Uses the Schoolbox demo school and puts it back as it was (no stage) at the end.

const BASE = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '')
const RUN = Date.now().toString(36)

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

const visible = (html) => html.replace(/<script[\s\S]*?<\/script>/g, '')

/** Follows a setup preview link like a browser: keeps the cookies it sets, then opens a page. */
async function openPreview(url, path = '/') {
  const res = await fetch(url.replace(/^https?:\/\/[^/]+/, BASE), { redirect: 'manual' })
  const set = res.headers.getSetCookie?.() ?? []
  const cookie = set.map((c) => c.split(';')[0]).join('; ')
  const page = await fetch(BASE + path, { headers: { cookie } })
  return { status: res.status, cookie, page: { status: page.status, text: visible(await page.text()) } }
}

async function main() {
  const login = await api('POST', '/users/login', { body: { email: process.env.SMOKE_EMAIL, password: process.env.SMOKE_PASSWORD } })
  const token = login.json?.token
  if (!token) throw new Error(`Can't sign in as the admin: ${login.status}`)

  const school = (await api('GET', '/schools?where[slug][equals]=schoolbox&depth=0', { token })).json?.docs?.[0]
  if (!school) throw new Error('The Schoolbox demo school is missing (seed first).')
  const id = school.id

  // Spot list
  const list = await api('GET', '/schools/setup/spots', { token })
  check(list.status === 200 && list.json?.spots?.some((s) => s.id === 'home.hero.tagline1'), 'the spot list includes the Home headline')
  check((await api('GET', '/schools/setup/spots')).status === 401, 'the spot list needs sign-in')

  // Not in setup yet: nothing to save or build
  check((await api('POST', `/schools/${id}/setup/build`, { token })).status === 409, 'pages are not built for a school that isn’t in setup')

  await api('PATCH', `/schools/${id}`, { token, body: { setupStage: 'setup' } })

  // A school account can't reach any of it
  const email = `setup-${RUN}@example.com`
  const pw = `Setup-test-${RUN}`
  await api('POST', '/users', { token, body: { email, password: pw, name: 'Setup test', role: 'editor', tenants: [{ tenant: id, role: 'schoolAdmin' }] } })
  const staff = (await api('POST', '/users/login', { body: { email, password: pw } })).json?.token
  check(Boolean(staff), 'a school admin account exists for the test')
  check((await api('POST', `/schools/${id}/setup/build`, { token: staff })).status === 403, 'a school account can’t build pages from spots')
  check((await api('POST', `/schools/${id}/setup/preview-link`, { token: staff })).status === 403, 'a school account can’t make preview links')
  const seen = (await api('GET', `/schools/${id}?depth=0`, { token: staff })).json
  check(seen && !('setupSpots' in seen) && !('setupStage' in seen), 'a school account doesn’t see the setup fields')

  // Save spots
  const tagline = `Grounded ${RUN}.`
  const media = (await api('GET', `/media?where[school][equals]=${id}&limit=1&depth=0`, { token })).json?.docs?.[0]
  const other = (await api('GET', `/media?where[school][not_equals]=${id}&limit=1&depth=0`, { token })).json?.docs?.[0]
  const saved = await api('POST', `/schools/${id}/setup/spots`, {
    token,
    body: {
      spots: {
        'home.hero.tagline1': `  ${tagline} `,
        'home.hero.tagline2': 'Growing in grace.',
        'home.diff1.title': 'Small on purpose',
        'home.diff1.icon': 'not-an-icon',
        'home.outcome1.body': 'x'.repeat(120),
        'home.made.up': 'nope',
        ...(media ? { 'home.photo.hero': media.id } : {}),
        ...(other ? { 'home.photo.problem': other.id } : {}),
      },
    },
  })
  check(saved.status === 200 && saved.json?.spots?.['home.hero.tagline1'] === tagline, 'spots are saved, trimmed')
  check(!('home.made.up' in (saved.json?.spots ?? {})) && saved.json?.problems?.some((p) => p.includes('isn’t a spot') || p.includes("isn't a spot")), 'an unknown spot is left out and reported')
  check(!('home.diff1.icon' in (saved.json?.spots ?? {})), 'an unknown icon is left out')
  check(saved.json?.problems?.some((p) => p.includes('fits best under 90')), 'words over a spot’s length are kept but reported')

  const cleared = await api('POST', `/schools/${id}/setup/spots`, { token, body: { spots: { 'home.diff1.title': '' } } })
  check(cleared.status === 200 && !('home.diff1.title' in cleared.json.spots) && cleared.json.spots['home.hero.tagline1'] === tagline, 'an empty value clears one spot and keeps the rest')

  // Build
  const visitorBefore = visible(await (await fetch(BASE + '/', { headers: { cookie: 'b61-school=schoolbox' } })).text())
  const built = await api('POST', `/schools/${id}/setup/build`, { token })
  check(built.status === 200 && built.json?.pages?.[0]?.slug === 'home', 'Build makes the Home page from the spots')
  if (other) check(built.json?.problems?.some((p) => p.includes(`Photo ${other.id}`)), 'a photo from another school is left out and reported')

  const draft = (await api('GET', `/pages?where[school][equals]=${id}&where[slug][equals]=home&draft=true&depth=0`, { token })).json?.docs?.[0]
  const text = JSON.stringify(draft?.sections ?? [])
  check(text.includes(tagline) && text.includes('Growing in grace.'), 'the draft Home page has the school’s words')
  check(text.includes('[Key differentiator]'), 'empty spots keep the template’s guidance')
  if (media) check(text.includes(`"image":${media.id}`), 'the school’s own photo is placed')

  const visitorAfter = visible(await (await fetch(BASE + '/', { headers: { cookie: 'b61-school=schoolbox' } })).text())
  check(!visitorAfter.includes(tagline) && visitorBefore.length > 0, 'visitors still see the published page, not the draft')

  // Preview link
  const link = await api('POST', `/schools/${id}/setup/preview-link`, { token })
  check(link.status === 200 && /\/next\/setup-preview\?t=/.test(link.json?.url ?? ''), 'a preview link is made')
  const preview = await openPreview(link.json.url)
  check(preview.status === 307 || preview.status === 302, 'the preview link redirects to the site')
  check(preview.page.status === 200 && preview.page.text.includes(tagline), 'the preview link shows the draft Home page')

  const forged = await openPreview(link.json.url.replace(/t=\d+/, 't=1'))
  check(forged.status === 403, 'a preview link changed to another school is refused')
  const otherSchool = await fetch(BASE + '/', { headers: { cookie: preview.cookie.replace(/b61-school=\d+/, 'b61-school=cedar-ridge') } })
  check(!visible(await otherSchool.text()).includes(tagline) && otherSchool.status === 200, 'the preview cookie shows no drafts for another school')

  // Live: building stops and preview links stop working
  await api('PATCH', `/schools/${id}`, { token, body: { setupStage: 'live' } })
  check((await api('POST', `/schools/${id}/setup/build`, { token })).status === 409, 'pages are not rebuilt once the school is live')
  const after = await fetch(BASE + '/', { headers: { cookie: preview.cookie } })
  check(!visible(await after.text()).includes(tagline), 'an old preview link stops showing drafts once the school is live')

  // A new school gets its School settings, standard forms and their pages
  const slug = `starter-${RUN}`
  const made = await api('POST', '/schools', { token, body: { name: `Starter Test ${RUN}`, slug } })
  const newId = made.json?.doc?.id
  check(made.status === 201 && Boolean(newId), 'a school can be added')
  if (newId) {
    const settings = (await api('GET', `/school-settings?where[school][equals]=${newId}&depth=0&draft=true`, { token })).json?.docs ?? []
    check(settings.length === 1 && settings[0].schoolName === `Starter Test ${RUN}`, 'the new school gets its School settings, with its name')
    const forms = (await api('GET', `/forms?where[school][equals]=${newId}&depth=0&limit=20`, { token })).json?.docs ?? []
    check(['Admissions inquiry', 'Tour request', 'Contact us'].every((t) => forms.some((f) => f.title === t)), 'the new school gets the standard forms')
    const pages = (await api('GET', `/pages?where[school][equals]=${newId}&depth=0&limit=20&draft=true`, { token })).json?.docs ?? []
    check(['inquire', 'schedule-a-tour', 'contact', 'apply'].every((p) => pages.some((x) => x.slug === p)), 'the new school gets the standard form pages')
    await api('PATCH', `/schools/${newId}`, { token, body: { name: `Starter Test ${RUN}` } })
    const again = (await api('GET', `/school-settings?where[school][equals]=${newId}&depth=0`, { token })).json?.docs ?? []
    check(again.length === 1, 'saving the school again adds nothing twice')
  }

  // Put the demo school back
  await api('PATCH', `/schools/${id}`, { token, body: { setupStage: null, setupSpots: null } })
  const users = (await api('GET', `/users?where[email][equals]=${encodeURIComponent(email)}&depth=0`, { token })).json?.docs ?? []
  for (const u of users) await api('DELETE', `/users/${u.id}`, { token })
}

main()
  .catch((e) => {
    failures.push(e.message)
    console.error(e)
  })
  .finally(() => {
    console.log(`\n${passed} passed, ${failures.length} failed`)
    if (failures.length) process.exit(1)
  })
