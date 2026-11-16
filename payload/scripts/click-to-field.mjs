// Click-to-field check (EDITING-STANDARD.md section 12), in a real browser.
// Opens the first school's home page in the editor with the live preview, clicks
// parts of the page and checks the editor put the cursor in the matching field.
//
//   BASE_URL=http://localhost:3000 SMOKE_EMAIL=... SMOKE_PASSWORD=... node scripts/click-to-field.mjs
//
// Needs Chromium for Playwright: npx playwright install --with-deps chromium
import { chromium } from '@playwright/test'

const BASE = process.env.BASE_URL ?? 'http://localhost:3000'
const EMAIL = process.env.SMOKE_EMAIL
const PASSWORD = process.env.SMOKE_PASSWORD
if (!EMAIL || !PASSWORD) throw new Error('Set SMOKE_EMAIL and SMOKE_PASSWORD')

const login = await fetch(`${BASE}/api/users/login`, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
}).then((r) => r.json())
const auth = { Authorization: `JWT ${login.token}` }
const pages = await fetch(`${BASE}/api/pages?where[slug][equals]=home&sort=id&limit=1&depth=0&draft=true`, { headers: auth }).then((r) => r.json())
const home = pages.docs?.[0]
if (!home) throw new Error('No home page')
const sections = home.sections ?? []
const at = (type) => sections.findIndex((s) => s.blockType === type)

// What to click on the page, and the field the editor should open.
const cases = []
const hero = at('b61Hero')
const heroBtn = sections[hero]?.buttons?.[1]?.label ?? sections[hero]?.buttons?.[0]?.label
if (heroBtn) cases.push({ name: 'Hero button', text: heroBtn, field: new RegExp(`^field-sections__${hero}__buttons__\\d+__label$`) })
const line = sections[hero]?.lines?.at(-1)?.text
if (line) cases.push({ name: 'Heading line', text: line, field: new RegExp(`^field-sections__${hero}__lines__\\d+__text$`) })
if (sections[hero]?.subheadline) cases.push({ name: 'Subheadline', text: sections[hero].subheadline, field: new RegExp(`^field-sections__${hero}__subheadline$`) })
const stats = at('b61StatsBand')
const stat = sections[stats]?.stats?.[1]
if (stat?.label) cases.push({ name: 'Stat label (inside a closed row)', text: stat.label, field: new RegExp(`^field-sections__${stats}__stats__1__label$`) })
if (cases.length < 3) throw new Error(`The demo home page changed: only ${cases.length} things to click`)

const browser = await chromium.launch()
// Reduced motion: entrance animations would keep the clicked words moving.
const page = await browser.newPage({ viewport: { width: 1700, height: 1100 }, reducedMotion: 'reduce' })
await page.goto(`${BASE}/admin/login`)
await page.fill('input[name="email"]', EMAIL)
await page.fill('input[name="password"]', PASSWORD)
await page.click('button[type="submit"]')
await page.waitForURL(/\/admin(?!\/login)/)
await page.goto(`${BASE}/admin/collections/pages/${home.id}`)
await page.waitForSelector('#sections-row-0')
if (!(await page.locator('iframe#live-preview-iframe').count())) await page.click('button#live-preview-toggler')
const frame = page.frameLocator('iframe#live-preview-iframe')
// The preview marks each element once its click-to-edit script runs.
await frame.locator('main [data-b61-edit-path]').first().waitFor({ state: 'attached', timeout: 20000 })

let failed = 0
for (const c of cases) {
  // Inside the page's main content, so the header's buttons don't count.
  const target = frame.locator('main').getByText(c.text, { exact: true }).filter({ visible: true }).first()
  await target.scrollIntoViewIfNeeded()
  await target.click()
  let id = ''
  for (let i = 0; i < 100 && !c.field.test(id); i++) {
    await page.waitForTimeout(100)
    id = await page.evaluate(() => document.activeElement?.id ?? '')
  }
  const ok = c.field.test(id)
  if (!ok) failed++
  console.log(`${ok ? '  ok ' : 'FAIL '} ${c.name}: "${c.text.slice(0, 40)}" -> ${id || '(nothing focused)'}`)
}
await browser.close()
console.log(`\n${cases.length - failed} passed, ${failed} failed`)
process.exit(failed ? 1 : 0)
