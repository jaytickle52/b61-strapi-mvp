// "Turn all on / off" on a new MCP key (Banner 61 > MCP keys), in a real browser.
// Opens a new key, turns every switch on, checks each box is ticked, then turns
// them all off again. Nothing is saved.
//
//   BASE_URL=http://localhost:3000 SMOKE_EMAIL=... SMOKE_PASSWORD=... node scripts/mcp-switches.mjs
//
// Needs Chromium for Playwright: npx playwright install --with-deps chromium
import { chromium } from '@playwright/test'

const BASE = process.env.BASE_URL ?? 'http://localhost:3000'
const EMAIL = process.env.SMOKE_EMAIL
const PASSWORD = process.env.SMOKE_PASSWORD
if (!EMAIL || !PASSWORD) throw new Error('Set SMOKE_EMAIL and SMOKE_PASSWORD')

let failed = 0
const ok = (cond, label) => {
  console.log(`${cond ? 'ok  ' : 'FAIL'} ${label}`)
  if (!cond) failed++
}

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1500, height: 1000 } })
await page.goto(`${BASE}/admin/login`)
await page.fill('input[name="email"]', EMAIL)
await page.fill('input[name="password"]', PASSWORD)
await page.click('button[type="submit"]')
await page.waitForURL(/\/admin(?!\/login)/)
await page.goto(`${BASE}/admin/collections/payload-mcp-api-keys/create`)

const count = page.locator('[data-b61-mcp-count]')
await count.waitFor({ timeout: 30000 })
const counted = async () => {
  const m = /(\d+) of (\d+)/.exec((await count.textContent()) ?? '')
  return m ? { on: Number(m[1]), total: Number(m[2]) } : { on: -1, total: -1 }
}
// The permission switches: checkboxes inside the plugin's groups (not "Enable API key").
// The sidebar only draws the boxes near the screen, so scroll through it and note each one.
const readBoxes = async () => {
  const seen = {}
  await page.mouse.move(1280, 600)
  for (let i = 0; i < 60; i++) {
    const found = await page.$$eval('input[type="checkbox"][id^="field-"]', (els) =>
      els.filter((e) => !e.id.includes('enableAPIKey')).map((e) => [e.id, e.checked]),
    )
    for (const [id, checked] of found) seen[id] = checked
    await page.mouse.wheel(0, 400)
    await page.waitForTimeout(80)
  }
  await page.mouse.wheel(0, -100000)
  return seen
}

const start = await counted()
ok(start.total >= 30, `the key lists its switches (${start.total})`)
ok(start.on < start.total, `a new key doesn't start with everything on (${start.on} on)`)

await page.getByRole('button', { name: 'Turn all on' }).click()
let now = await counted()
ok(now.on === now.total, `Turn all on switches every one on (${now.on} of ${now.total})`)
let boxes = await readBoxes()
let ids = Object.keys(boxes)
ok(ids.length === start.total, `every switch shows as a box (${ids.length} of ${start.total})`)
ok(ids.every((id) => boxes[id]), `every box is ticked (${ids.filter((id) => boxes[id]).length} of ${ids.length})`)
ok(boxes['field-payload-mcp-tool__updatePage'] === true, 'a tool switch (updatePage) is ticked')
ok(boxes['field-news__create'] === true, 'a collection switch (news create) is ticked')
ok(await page.getByRole('button', { name: 'Turn all on' }).isDisabled(), 'Turn all on is greyed out when everything is on')

await page.getByRole('button', { name: 'Turn all off' }).click()
now = await counted()
ok(now.on === 0, `Turn all off switches every one off (${now.on} on)`)
boxes = await readBoxes()
ids = Object.keys(boxes)
ok(ids.length === start.total && ids.every((id) => !boxes[id]), `no box is ticked (${ids.filter((id) => boxes[id]).length})`)

// Saved with everything on, the key really holds every switch.
await page.getByRole('button', { name: 'Turn all on' }).click()
const label = `switch check ${Date.now()}`
await page.fill('#field-label', label)
await page.getByRole('button', { name: 'Save' }).click()
await page.waitForURL(/payload-mcp-api-keys\/\d+/, { timeout: 30000 })
const id = /payload-mcp-api-keys\/(\d+)/.exec(page.url())?.[1]
const token = (
  await fetch(`${BASE}/api/users/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  }).then((r) => r.json())
).token
const auth = { Authorization: `JWT ${token}` }
const saved = await fetch(`${BASE}/api/payload-mcp-api-keys/${id}?depth=0`, { headers: auth }).then((r) => r.json())
const leaves = []
const walk = (o) => Object.values(o ?? {}).forEach((v) => (typeof v === 'boolean' ? leaves.push(v) : v && typeof v === 'object' && walk(v)))
for (const [k, v] of Object.entries(saved)) if (v && typeof v === 'object' && !Array.isArray(v) && k !== 'user') walk(v)
ok(saved.label === label && leaves.length >= start.total && leaves.every(Boolean), `the saved key holds every switch on (${leaves.filter(Boolean).length} of ${leaves.length})`)
await fetch(`${BASE}/api/payload-mcp-api-keys/${id}`, { method: 'DELETE', headers: auth })

await browser.close()
console.log(failed ? `\n${failed} MCP switch check(s) failed` : '\nAll MCP switch checks passed')
process.exit(failed ? 1 : 0)
