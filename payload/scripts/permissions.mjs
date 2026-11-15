// Permissions test (Thread E): signs in as each kind of account and checks
// what it can and can't do, through the same API the admin uses. Needs the
// demo schools and a Banner 61 admin account (the smoke test creates one), and
// EMAIL_PREVIEW_DIR set on the server so invite emails land as files.
//
//   BASE_URL=http://localhost:3000 SMOKE_EMAIL=... SMOKE_PASSWORD=... \
//   EMAIL_PREVIEW_DIR=/tmp/emails node scripts/permissions.mjs
//
// Creates throwaway accounts named perm-*@example.com; run on a test database.
// The Publish button itself is checked by src/scripts/check-publish-button.ts.

import fs from 'node:fs'
import path from 'node:path'

const BASE = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '')
const PREVIEW = process.env.EMAIL_PREVIEW_DIR
const RUN = Date.now().toString(36)
const PASSWORD = 'Perm-test-' + RUN

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

async function login(email, password) {
  const r = await api('POST', '/users/login', { body: { email, password } })
  if (!r.json?.token) throw new Error(`Can't sign in as ${email}: ${r.status} ${JSON.stringify(r.json)}`)
  return r.json.token
}

/** The newest set-password link emailed to this address. */
function inviteToken(email) {
  if (!PREVIEW) throw new Error('Set EMAIL_PREVIEW_DIR (same folder as the server).')
  for (let i = 0; i < 20; i++) {
    const files = fs
      .readdirSync(PREVIEW)
      .map((f) => path.join(PREVIEW, f))
      .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)
    for (const f of files) {
      const html = fs.readFileSync(f, 'utf8')
      if (!html.includes(email)) continue
      const m = html.match(/\/admin\/reset\/([A-Za-z0-9]+)/)
      if (m) return m[1]
    }
  }
  throw new Error(`No invite email found for ${email} in ${PREVIEW}`)
}

async function accept(email) {
  const token = inviteToken(email)
  const r = await api('POST', '/users/reset-password', { body: { token, password: PASSWORD } })
  check(r.status === 200, `${email} accepts the invite and chooses a password`)
  return login(email, PASSWORD)
}

const ids = (r) => (r.json?.docs ?? []).map((d) => String(d.id))

async function main() {
  const admin = await login(process.env.SMOKE_EMAIL, process.env.SMOKE_PASSWORD)
  const schools = await api('GET', '/schools?limit=50&depth=0', { token: admin })
  const bySlug = Object.fromEntries((schools.json?.docs ?? []).map((s) => [s.slug, s.id]))
  const cedar = bySlug['cedar-ridge']
  const harbor = bySlug['harbor-oaks']
  if (!cedar || !harbor) throw new Error('Needs the demo schools (cedar-ridge, harbor-oaks).')

  const mail = (who) => `perm-${who}-${RUN}@example.com`
  const SA = mail('cedar-admin')
  const ED = mail('cedar-editor')
  const CO = mail('cedar-contrib')
  const HSA = mail('harbor-admin')
  const BOTH = mail('both')

  console.log('Invites')
  let r = await api('POST', '/users/invite', { token: admin, body: { email: SA, school: cedar, role: 'schoolAdmin' } })
  check(r.json?.ok, 'Banner 61 admin invites a School Admin')
  r = await api('POST', '/users/invite', { token: admin, body: { email: HSA, school: harbor, role: 'schoolAdmin' } })
  check(r.json?.ok, 'Banner 61 admin invites a School Admin at the other school')
  const sa = await accept(SA)
  const hsa = await accept(HSA)

  r = await api('POST', '/users/invite', { token: sa, body: { email: ED, school: cedar, role: 'editor' } })
  check(r.json?.ok, 'School Admin invites an Editor to their school')
  r = await api('POST', '/users/invite', { token: sa, body: { email: CO, school: cedar, role: 'contributor', name: 'Casey' } })
  check(r.json?.ok, 'School Admin invites a Contributor to their school')
  r = await api('POST', '/users/invite', { token: sa, body: { email: mail('x'), school: harbor, role: 'editor' } })
  check(r.status === 403, 'School Admin cannot invite to another school')
  r = await api('POST', '/users/invite', { token: sa, body: { email: ED, school: cedar, role: 'editor' } })
  check(r.status === 409, 'Inviting someone already at the school says so')

  const pending = (await api('GET', `/users?where[email][equals]=${encodeURIComponent(CO)}`, { token: sa })).json?.docs?.[0]
  r = await api('POST', `/users/${pending.id}/resend-invite`, { token: sa })
  check(r.json?.ok, 'School Admin resends a pending invite')
  r = await api('POST', `/users/${pending.id}/resend-invite`, { token: hsa })
  check(r.status === 403, "Another school's admin cannot resend it")

  const ed = await accept(ED)
  const co = await accept(CO)
  r = await api('POST', `/users/${pending.id}/resend-invite`, { token: sa })
  check(r.status === 409, 'No resend once they have signed in')

  const me = async (t) => (await api('GET', '/users/me', { token: t })).json?.user
  const saUser = await me(sa)
  const edUser = await me(ed)
  const coUser = await me(co)
  const hsaUser = await me(hsa)
  check(coUser?.tenants?.[0]?.role === 'contributor', 'Contributor role saved on their school')
  check(Boolean(coUser?.lastSignInAt), 'Last signed in is recorded')

  console.log('Seeing and managing people')
  r = await api('GET', '/users?limit=200', { token: sa })
  const seen = ids(r)
  check(seen.includes(String(edUser.id)) && seen.includes(String(coUser.id)), 'School Admin sees people at their school')
  check(!seen.includes(String(hsaUser.id)), "School Admin doesn't see other schools' people")
  check(!(r.json?.docs ?? []).some((u) => u.role === 'admin'), "School Admin doesn't see Banner 61 admins")
  r = await api('GET', '/users?limit=200', { token: ed })
  check(ids(r).length === 1 && ids(r)[0] === String(edUser.id), 'Editor sees only their own account')
  r = await api('GET', '/users?limit=200', { token: co })
  check(ids(r).length === 1 && ids(r)[0] === String(coUser.id), 'Contributor sees only their own account')

  r = await api('PATCH', `/users/${hsaUser.id}`, { token: sa, body: { name: 'Nope' } })
  check(r.status === 403 || r.status === 404, "School Admin cannot edit another school's people")
  r = await api('PATCH', `/users/${edUser.id}`, { token: sa, body: { role: 'admin' } })
  check((await me(ed)).role === 'editor', 'School Admin cannot make anyone a Banner 61 admin')
  r = await api('PATCH', `/users/${coUser.id}`, {
    token: sa,
    body: { tenants: [{ tenant: cedar, role: 'contributor' }, { tenant: harbor, role: 'editor' }] },
  })
  check(r.status === 403, 'School Admin cannot add another school to someone')
  r = await api('PATCH', `/users/${coUser.id}`, { token: sa, body: { tenants: [{ tenant: cedar, role: 'editor' }] } })
  check(r.status === 200 && (await me(co)).tenants[0].role === 'editor', 'School Admin changes a role at their school')
  await api('PATCH', `/users/${coUser.id}`, { token: sa, body: { tenants: [{ tenant: cedar, role: 'contributor' }] } })
  r = await api('PATCH', `/users/${saUser.id}`, { token: sa, body: { tenants: [{ tenant: cedar, role: 'editor' }] } })
  check(r.status === 403, 'School Admin cannot change their own role')
  r = await api('PATCH', `/users/${edUser.id}`, { token: sa, body: { password: 'Something-else-1' } })
  check(r.status === 403, "School Admin cannot set someone else's password")
  r = await api('PATCH', `/users/${edUser.id}`, { token: sa, body: { email: mail('changed') } })
  check(r.status === 403, "School Admin cannot change someone else's email")
  r = await api('PATCH', `/users/${edUser.id}`, { token: ed, body: { name: 'Eddie' } })
  check(r.status === 200, 'Editor updates their own name')
  r = await api('POST', '/users/invite', { token: ed, body: { email: mail('y'), school: cedar, role: 'editor' } })
  check(r.status === 403, 'Editor cannot invite')
  r = await api('POST', '/users', { token: co, body: { email: mail('z'), password: PASSWORD, tenants: [{ tenant: cedar, role: 'editor' }] } })
  check(r.status === 403, 'Contributor cannot create accounts')

  // Someone at both schools: added to the second as an existing account.
  r = await api('POST', '/users/invite', { token: sa, body: { email: BOTH, school: cedar, role: 'editor' } })
  r = await api('POST', '/users/invite', { token: hsa, body: { email: BOTH, school: harbor, role: 'contributor' } })
  check(r.json?.ok, 'An existing account gets added to a second school')
  const both = (await api('GET', `/users?where[email][equals]=${encodeURIComponent(BOTH)}`, { token: sa })).json?.docs?.[0]
  r = await api('DELETE', `/users/${both.id}`, { token: sa })
  check(r.status === 403, 'School Admin cannot delete someone who also works elsewhere')
  r = await api('PATCH', `/users/${both.id}`, { token: hsa, body: { tenants: [{ tenant: harbor, role: 'contributor' }] } })
  check(r.status === 403, "Removing another school's row is refused (only own schools change)")

  console.log('Publishing')
  const pages = await api('GET', `/pages?where[school][equals]=${cedar}&where[_status][equals]=published&limit=1&depth=0`, { token: admin })
  const live = pages.json?.docs?.[0]
  r = await api('POST', '/pages', { token: co, body: { title: 'Contributor draft ' + RUN, slug: 'perm-' + RUN, school: cedar, _status: 'draft' } })
  check(r.status === 201, 'Contributor creates a draft page')
  const draftId = r.json?.doc?.id
  r = await api('PATCH', `/pages/${draftId}?draft=true`, { token: co, body: { title: 'Edited ' + RUN, _status: 'draft' } })
  check(r.status === 200, 'Contributor edits their draft')
  r = await api('PATCH', `/pages/${draftId}`, { token: co, body: { _status: 'published' } })
  check(r.status === 403, 'Contributor cannot publish')
  r = await api('POST', '/pages', { token: co, body: { title: 'Sneaky ' + RUN, slug: 'perm-s-' + RUN, school: cedar, _status: 'published' } })
  check(r.status === 403, 'Contributor cannot create a page as published')
  r = await api('PATCH', `/pages/${live.id}?draft=true`, { token: co, body: { title: live.title, _status: 'draft' } })
  check(r.status === 200, 'Contributor saves a draft of a live page')
  r = await api('PATCH', `/pages/${live.id}`, { token: co, body: { _status: 'draft' } })
  check(r.status === 403, 'Contributor cannot unpublish a live page')
  r = await api('DELETE', `/pages/${draftId}`, { token: co })
  check(r.status === 403 || r.status === 404, 'Contributor cannot delete')
  r = await api('PATCH', `/pages/${draftId}`, { token: ed, body: { _status: 'published' } })
  check(r.status === 200, 'Editor publishes the Contributor’s page')
  r = await api('DELETE', `/pages/${draftId}`, { token: ed })
  check(r.status === 200, 'Editor deletes a page')

  console.log('Forms, answers and settings')
  r = await api('GET', '/form-submissions?limit=1', { token: co })
  check(r.status === 403 || (r.json?.docs ?? []).length === 0, "Contributor can't read form answers")
  r = await api('GET', '/form-submissions?limit=1', { token: ed })
  check(r.status === 200, 'Editor reads form answers')
  const forms = await api('GET', `/forms?where[school][equals]=${cedar}&limit=1&depth=0`, { token: ed })
  const formId = forms.json?.docs?.[0]?.id
  r = await api('PATCH', `/forms/${formId}`, { token: co, body: { title: 'Changed' } })
  check(r.status === 403 || r.status === 404, "Contributor can't change forms")
  const settings = await api('GET', `/school-settings?where[school][equals]=${cedar}&limit=1&depth=0`, { token: ed })
  const setId = settings.json?.docs?.[0]?.id
  r = await api('PATCH', `/school-settings/${setId}`, { token: co, body: { schoolName: 'x' } })
  check(r.status === 403 || r.status === 404, "Contributor can't change School settings")

  const redirect = { from: '/perm-old-' + RUN, to: { type: 'custom', url: '/' }, type: '301', school: cedar }
  r = await api('POST', '/redirects', { token: co, body: redirect })
  check(r.status === 403, "Contributor can't add redirects")
  r = await api('POST', '/redirects', { token: ed, body: redirect })
  check(r.status === 201, 'Editor adds a redirect')
  if (r.json?.doc?.id) await api('DELETE', `/redirects/${r.json.doc.id}`, { token: ed })

  console.log('Other schools')
  const harborPage = (await api('GET', `/pages?where[school][equals]=${harbor}&limit=1&depth=0`, { token: admin })).json?.docs?.[0]
  r = await api('PATCH', `/pages/${harborPage.id}?draft=true`, { token: sa, body: { title: 'x', _status: 'draft' } })
  check(r.status === 403 || r.status === 404, "School Admin can't edit another school's pages")

  console.log('Admin screens load for each role')
  const screen = async (t, p) => {
    const res = await fetch(BASE + p, { headers: { cookie: `payload-token=${t}` }, redirect: 'manual' })
    const html = res.status === 200 ? await res.text() : ''
    return res.status === 200 && !/Application error: a (client|server)-side exception/i.test(html)
  }
  check(await screen(sa, '/admin/collections/users'), 'School Admin opens the Users list')
  check(await screen(sa, `/admin/collections/users/${edUser.id}`), 'School Admin opens an account')
  check(await screen(co, '/admin/account'), 'Contributor opens their account')
  check(await screen(co, `/admin/collections/pages/${live.id}`), 'Contributor opens a page')
  check(await screen(ed, '/admin'), 'Editor opens the dashboard')

  console.log('Clean up')
  r = await api('DELETE', `/users/${coUser.id}`, { token: sa })
  check(r.status === 200, 'School Admin deletes someone only at their school')
  r = await api('DELETE', `/users/${saUser.id}`, { token: sa })
  check(r.status === 403, 'School Admin cannot delete their own account')
  for (const u of [saUser, edUser, hsaUser, both]) await api('DELETE', `/users/${u.id}`, { token: admin })

  console.log(`\n${passed} passed, ${failures.length} failed`)
  if (failures.length) {
    console.log(failures.map((f) => ' - ' + f).join('\n'))
    process.exit(1)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
