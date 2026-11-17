// Checks the MCP connector at /api/mcp (src/mcp):
//   - no key / wrong key is refused; a key works from the header or ?key=
//   - only switched-on tools are listed, and the list stays small
//   - page and news edits through MCP are saved as drafts: the live version
//     doesn't change until someone publishes
//   - no delete tools; private collections (users, form answers) aren't offered
//   - only Banner 61 admins can make keys
//
// BASE_URL, SMOKE_EMAIL / SMOKE_PASSWORD (a Banner 61 admin), as the other checks.

const BASE = process.env.BASE_URL || 'http://localhost:3000'
const EMAIL = process.env.SMOKE_EMAIL
const PASSWORD = process.env.SMOKE_PASSWORD

let failed = 0
const ok = (cond, label) => {
  console.log(`${cond ? 'ok  ' : 'FAIL'} ${label}`)
  if (!cond) failed++
}

const api = async (path, { token, method = 'GET', body } = {}) => {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'content-type': 'application/json', ...(token ? { Authorization: `JWT ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  })
  let json = null
  try {
    json = await res.json()
  } catch {}
  return { status: res.status, json }
}

let rpcId = 0
const mcp = async (method, params, { key, inUrl = false } = {}) => {
  const res = await fetch(`${BASE}/api/mcp${inUrl && key ? `?key=${encodeURIComponent(key)}` : ''}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json, text/event-stream',
      ...(key && !inUrl ? { Authorization: `Bearer ${key}` } : {}),
    },
    body: JSON.stringify({ jsonrpc: '2.0', id: ++rpcId, method, params }),
  })
  const raw = await res.text()
  const line = raw.split('\n').find((l) => l.startsWith('data: '))
  let json = null
  try {
    json = JSON.parse(line ? line.slice(6) : raw)
  } catch {}
  return { status: res.status, json, size: raw.length }
}
const call = async (key, name, args) => {
  const r = await mcp('tools/call', { name, arguments: args }, { key })
  return r.json?.result?.content?.[0]?.text ?? JSON.stringify(r.json)
}

const login = async (email, password) => (await api('/api/users/login', { method: 'POST', body: { email, password } })).json?.token

const token = await login(EMAIL, PASSWORD)
ok(Boolean(token), 'admin signs in')

// A key with everything switched on except delete (there is no delete).
const KEY = `ci-mcp-key-${Date.now()}-abcdefghijklmnop`
const allOn = {
  schools: { find: true },
  schoolSettings: { find: true, update: true },
  pages: { find: true },
  news: { find: true, create: true, update: true },
  media: { find: true, update: true },
  'payload-mcp-tool': { pageSections: true, createPage: true, updatePage: true, editorLinks: true },
}
const made = await api('/api/payload-mcp-api-keys', {
  token,
  method: 'POST',
  body: { label: 'CI', enableAPIKey: true, apiKey: KEY, ...allOn },
})
ok(made.status === 201, `admin makes an MCP key (${made.status})`)

ok((await mcp('tools/list', {}, {})).status === 401, 'no key: refused')
ok((await mcp('tools/list', {}, { key: 'not-a-real-key' })).status === 401, 'wrong key: refused')

const list = await mcp('tools/list', {}, { key: KEY })
const names = (list.json?.result?.tools ?? []).map((t) => t.name)
ok(names.includes('findPages') && names.includes('updatePage'), `tools listed (${names.length})`)
ok(list.size < 80_000, `tool list stays small (${list.size} bytes)`)
ok(!names.some((n) => /^delete/.test(n)), 'no delete tools')
ok(!names.some((n) => /Users|FormSubmissions|EmailLog|FormUploads/.test(n)), 'no private collections')
ok(!names.includes('findEvents'), 'switched-off collections are not listed')

const viaUrl = await mcp('tools/list', {}, { key: KEY, inUrl: true })
ok(viaUrl.status === 200 && (viaUrl.json?.result?.tools ?? []).length === names.length, 'key in the address works too')

// Pages: an update through MCP is a draft; the live page keeps its title.
const schools = await api('/api/schools?limit=1&sort=id', { token })
const school = schools.json?.docs?.[0]
const pages = await api(`/api/pages?where[school][equals]=${school.id}&where[slug][equals]=home&depth=0&limit=1`, { token })
const home = pages.json?.docs?.[0]
ok(home?._status === 'published', 'demo home page is published')
const out = await call(KEY, 'updatePage', { id: home.id, data: JSON.stringify({ title: 'MCP draft title' }) })
ok(/Draft saved/.test(out), `updatePage saves a draft (${out.slice(0, 80)})`)
const liveAfter = await api(`/api/pages/${home.id}?depth=0`, { token })
ok(liveAfter.json?.title === home.title && liveAfter.json?._status === 'published', 'live page unchanged')
const draftAfter = await api(`/api/pages/${home.id}?depth=0&draft=true`, { token })
ok(draftAfter.json?.title === 'MCP draft title', 'the draft holds the change')

const created = await call(KEY, 'createPage', {
  data: JSON.stringify({ school: school.id, title: 'MCP test page', slug: `mcp-test-${Date.now()}`, sections: [] }),
})
const newId = created.match(/id (\d+)/)?.[1]
ok(Boolean(newId), `createPage makes a page (${created.slice(0, 80)})`)
if (newId) {
  const fresh = await api(`/api/pages/${newId}?depth=0&draft=true`, { token })
  ok(fresh.json?._status === 'draft', 'the new page is a draft, not live')
  const links = await call(KEY, 'editorLinks', { collection: 'pages', id: Number(newId) })
  ok(links.includes(`/admin/collections/pages/${newId}`), 'editorLinks gives the editor address')
}

// News: the generated tool, asked to publish, still saves a draft.
const news = await api(`/api/news?where[school][equals]=${school.id}&where[_status][equals]=published&depth=0&limit=1`, { token })
const post = news.json?.docs?.[0]
if (post) {
  await call(KEY, 'updateNews', { id: String(post.id), title: 'MCP news draft', draft: false })
  const live = await api(`/api/news/${post.id}?depth=0`, { token })
  ok(live.json?.title === post.title && live.json?._status === 'published', 'updateNews with draft:false still leaves the live post alone')
} else ok(false, 'a published demo news post to test with')

const sections = await call(KEY, 'pageSections', {})
ok(/b61Hero/.test(sections), 'pageSections lists the section types')

// Only Banner 61 admins can make keys: an editor can't.
const editorEmail = `mcp-editor-${Date.now()}@example.com`
const editor = await api('/api/users', {
  token,
  method: 'POST',
  body: { email: editorEmail, password: 'mcp-editor-password-123', role: 'editor', tenants: [{ tenant: school.id, role: 'editor' }] },
})
ok(editor.status === 201, 'test editor created')
const editorToken = await login(editorEmail, 'mcp-editor-password-123')
const refused = await api('/api/payload-mcp-api-keys', {
  token: editorToken,
  method: 'POST',
  body: { label: 'nope', enableAPIKey: true, apiKey: `${KEY}-editor` },
})
ok(refused.status === 403, `an editor can't make a key (${refused.status})`)

// Put things back so later checks see the demo as it was.
await api(`/api/payload-mcp-api-keys/${made.json?.doc?.id}`, { token, method: 'DELETE' })
ok((await mcp('tools/list', {}, { key: KEY })).status === 401, 'a deleted key stops working')

console.log(failed ? `\n${failed} MCP check(s) failed` : '\nAll MCP checks passed')
process.exit(failed ? 1 : 0)
