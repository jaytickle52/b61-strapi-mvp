// Two-factor sign-in test (src/users/two-factor.ts, payload-totp). Signs in
// through the same API and cookies the editor uses.
//
//   BASE_URL=http://localhost:3000 SMOKE_EMAIL=... SMOKE_PASSWORD=... node scripts/two-factor.mjs
//
// Default run (server WITHOUT B61_REQUIRE_ADMIN_2FA): a school editor turns
// two-factor on; a password-only session can then do nothing staff-only (API,
// custom endpoints, editor pages) until it enters a code; visitors still see
// the public site; a Banner 61 admin resets it for a lost phone.
// With REQUIRED=true (server started with B61_REQUIRE_ADMIN_2FA=true): a Banner
// 61 admin without two-factor is refused everything and sent to the setup page,
// and can set it up.
//
// Creates throwaway accounts named 2fa-*@example.com; run on a test database.
import { Secret, TOTP } from 'otpauth'
import fs from 'node:fs'
import path from 'node:path'

const BASE = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '')
const RUN = Date.now().toString(36)
const PASSWORD = '2fa-test-' + RUN
const REQUIRED = process.env.REQUIRED === 'true'

let passed = 0
const failures = []
const check = (ok, what) => {
  if (ok) passed++
  else failures.push(what)
  console.log(`${ok ? '  ok ' : 'FAIL '} ${what}`)
}

/** A tiny cookie jar per person. */
function session() {
  const jar = new Map()
  const cookie = () => [...jar].map(([k, v]) => `${k}=${v}`).join('; ')
  const keep = (res) => {
    for (const c of res.headers.getSetCookie?.() ?? []) {
      const [pair] = c.split(';')
      const i = pair.indexOf('=')
      const k = pair.slice(0, i).trim()
      const v = pair.slice(i + 1).trim()
      if (!v || /expires=Thu, 01 Jan 1970/i.test(c)) jar.delete(k)
      else jar.set(k, v)
    }
  }
  return {
    jar,
    async req(method, p, body) {
      const res = await fetch(BASE + p, {
        method,
        redirect: 'manual',
        headers: { 'Content-Type': 'application/json', cookie: cookie() },
        body: body === undefined ? undefined : JSON.stringify(body),
      })
      keep(res)
      let json = null
      try {
        json = await res.clone().json()
      } catch {}
      return { status: res.status, json, location: res.headers.get('location'), res }
    },
    async login(email, password) {
      const r = await this.req('POST', '/api/users/login', { email, password })
      if (r.status !== 200) throw new Error(`Can't sign in as ${email}: ${r.status} ${JSON.stringify(r.json)}`)
      return r
    },
  }
}

/** Is there an email to this address whose text includes `what`? (EMAIL_PREVIEW_DIR, as the permissions test.) */
function emailed(to, what) {
  const dir = process.env.EMAIL_PREVIEW_DIR
  if (!dir || !fs.existsSync(dir)) return null
  return fs.readdirSync(dir).some((f) => {
    const html = fs.readFileSync(path.join(dir, f), 'utf8')
    return html.includes(to) && html.includes(what)
  })
}

const code = (secret) => new TOTP({ secret: Secret.fromBase32(secret), digits: 6, period: 30, algorithm: 'SHA1' }).generate()
const newSecret = () => new Secret({ size: 20 }).base32

/** Is this session allowed into staff-only things? Several angles at once. */
async function staffAccess(s, schoolId, selfId) {
  const users = await s.req('GET', '/api/users?limit=10&depth=0')
  const drafts = await s.req('GET', `/api/pages?where[school][equals]=${schoolId}&draft=true&limit=1&depth=0`)
  const settings = await s.req('GET', `/api/school-settings?limit=1&depth=0`)
  const bunny = await s.req('GET', '/api/bunny/config')
  return {
    // Seeing anyone besides themselves (a session owing a code may read only its own account).
    users: users.status === 200 && (users.json?.docs ?? []).some((d) => String(d.id) !== String(selfId)),
    drafts: drafts.status === 200 && (drafts.json?.docs?.length ?? 0) > 0,
    settings: settings.status === 200 && (settings.json?.docs?.length ?? 0) > 0,
    // Signed out (or owing a code) the endpoint answers enabled:false either way,
    // so check it treats the session as signed out: 401 from upload.
    upload: (await s.req('POST', '/api/bunny/upload', { school: schoolId, title: 'x' })).status !== 401,
    bunny: bunny.status === 200,
  }
}

async function main() {
  const admin = session()
  await admin.login(process.env.SMOKE_EMAIL, process.env.SMOKE_PASSWORD)

  if (REQUIRED) return requiredForAdmins(admin)

  const schools = await admin.req('GET', '/api/schools?limit=50&depth=0')
  const cedar = (schools.json?.docs ?? []).find((s) => s.slug === 'cedar-ridge')?.id
  if (!cedar) throw new Error('Needs the demo school cedar-ridge.')

  // A school editor, signed in with a password.
  const email = `2fa-editor-${RUN}@example.com`
  const made = await admin.req('POST', '/api/users', { email, password: PASSWORD, role: 'editor', tenants: [{ tenant: cedar, role: 'editor' }] })
  check(made.status === 201, 'a Banner 61 admin creates a school editor')
  const editorId = made.json?.doc?.id
  const editor = session()
  await editor.login(email, PASSWORD)
  let a = await staffAccess(editor, cedar, editorId)
  check(a.drafts && a.settings && a.upload, 'without two-factor, the editor works as before (optional for school staff)')

  // Turns two-factor on.
  const secret = newSecret()
  const wrong = await editor.req('POST', '/api/setup-totp', { secret, token: '000000' === code(secret) ? '111111' : '000000' })
  check(wrong.json?.ok === false, 'setup refuses a wrong code')
  const setup = await editor.req('POST', '/api/setup-totp', { secret, token: code(secret) })
  check(setup.json?.ok === true, 'the editor sets up two-factor with a code from the app')
  await new Promise((r) => setTimeout(r, 500))
  const mailOn = emailed(email, 'Two-factor sign-in is on')
  if (mailOn !== null) check(mailOn, 'they get an email saying two-factor is on')
  a = await staffAccess(editor, cedar, editorId)
  check(a.drafts && a.settings, 'right after setup, that session keeps working (verified)')

  // Next sign-in: password only.
  await editor.req('POST', '/api/users/logout')
  editor.jar.clear()
  await editor.login(email, PASSWORD)
  const me = await editor.req('GET', '/api/users/me')
  check(me.json?.user?.id === editorId, '/api/users/me still answers (the code page needs it)')
  a = await staffAccess(editor, cedar, editorId)
  check(!a.users, 'password only: the people list is refused (only their own account)')
  check(!a.drafts, 'password only: draft pages are refused')
  check(!a.settings, 'password only: school settings are refused')
  check(!a.upload, 'password only: custom endpoints treat the session as signed out')
  const edit = await editor.req('PATCH', `/api/users/${editorId}`, { name: 'Changed' })
  check(edit.status >= 400, 'password only: can\'t change their own account')
  const page = await editor.req('GET', '/admin')
  check([302, 303, 307, 308].includes(page.status) && /verify-totp/.test(page.location || ''), 'password only: the editor sends them to the code page')
  const codePage = await editor.req('GET', '/admin/verify-totp')
  check(codePage.status === 200, 'the code page itself opens')

  // Visitors are untouched.
  const visitor = session()
  const pub = await visitor.req('GET', `/api/pages?where[school][equals]=${cedar}&limit=1&depth=0`)
  check(pub.status === 200 && (pub.json?.docs?.length ?? 0) > 0, 'visitors still read published pages')
  const home = await fetch(BASE + '/', { headers: { cookie: 'b61-school=cedar-ridge' } })
  check(home.status === 200, 'the public home page still loads')
  const health = await visitor.req('GET', '/api/health')
  check(health.status === 200 && health.json?.ok === true, '/api/health answers ok')

  // Enters the code.
  const badCode = await editor.req('POST', '/api/verify-totp', { token: code(secret) === '123456' ? '654321' : '123456' })
  check(badCode.json?.ok !== true, 'a wrong code is refused')
  const verify = await editor.req('POST', '/api/verify-totp', { token: code(secret) })
  check(verify.json?.ok === true, 'the right code is accepted')
  a = await staffAccess(editor, cedar, editorId)
  check(a.drafts && a.settings && a.upload, 'after the code, everything works again')

  // A school editor can't reset anyone; a Banner 61 admin can.
  const selfReset = await editor.req('POST', `/api/users/${editorId}/reset-two-factor`)
  check(selfReset.status === 403, 'a school editor can\'t reset two-factor')
  const reset = await admin.req('POST', `/api/users/${editorId}/reset-two-factor`)
  check(reset.status === 200 && reset.json?.ok === true, 'a Banner 61 admin resets it (lost phone)')
  const oldSession = await editor.req('GET', '/api/users/me')
  check(!oldSession.json?.user, 'the reset signs them out everywhere')
  await new Promise((r) => setTimeout(r, 500))
  const mailReset = emailed(email, 'Two-factor sign-in was reset')
  if (mailReset !== null) check(mailReset, 'they get an email saying it was reset')
  const adminMe = await admin.req('GET', '/api/users/me')
  const ownReset = await admin.req('POST', `/api/users/${adminMe.json?.user?.id}/reset-two-factor`)
  check(ownReset.status === 400, 'nobody resets their own')
  const after = session()
  await after.login(email, PASSWORD)
  a = await staffAccess(after, cedar, editorId)
  check(a.drafts && a.settings, 'after the reset, the password works on its own again')

  // Clean up.
  await admin.req('DELETE', `/api/users/${editorId}`)
}

async function requiredForAdmins(admin) {
  const me = await admin.req('GET', '/api/users/me')
  check(me.json?.user?.role === 'admin', 'signed in as a Banner 61 admin')
  const selfId = String(me.json?.user?.id)
  const others = (r) => r.status === 200 && (r.json?.docs ?? []).some((d) => String(d.id) !== selfId)
  const users = await admin.req('GET', '/api/users?limit=10&depth=0')
  check(!others(users), 'required: an admin without two-factor sees only their own account')
  const drafts = await admin.req('GET', '/api/pages?draft=true&limit=1&depth=0')
  check(!(drafts.status === 200 && (drafts.json?.docs?.length ?? 0) > 0), 'required: an admin without two-factor is refused draft pages')
  const page = await admin.req('GET', '/admin')
  check([302, 303, 307, 308].includes(page.status) && /setup-totp/.test(page.location || ''), 'required: the editor sends them to the setup page')
  const logoutPage = await admin.req('GET', '/admin/logout')
  check(!/setup-totp/.test(logoutPage.location || ''), 'required: signing out is still possible')
  await admin.login(process.env.SMOKE_EMAIL, process.env.SMOKE_PASSWORD)
  const setupPage = await admin.req('GET', '/admin/setup-totp')
  check(setupPage.status === 200, 'the setup page itself opens')
  const secret = newSecret()
  const setup = await admin.req('POST', '/api/setup-totp', { secret, token: code(secret) })
  check(setup.json?.ok === true, 'the admin sets up two-factor')
  const users2 = await admin.req('GET', '/api/users?limit=10&depth=0')
  check(others(users2), 'after setup the admin gets in')
  const visitor = await fetch(BASE + '/', { headers: { cookie: 'b61-school=cedar-ridge' } })
  check(visitor.status === 200, 'visitors still see the site')
}

main()
  .catch((e) => failures.push(e.message))
  .finally(() => {
    console.log(`\n${passed} passed, ${failures.length} failed`)
    if (failures.length) {
      console.log(failures.map((f) => ' - ' + f).join('\n'))
      process.exit(1)
    }
  })
