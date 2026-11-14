// Starts the production site. Railway stops the old copy with SIGTERM on every
// redeploy; this makes that a clean exit (0) so it isn't reported as a crash.
import { spawn } from 'node:child_process'
import { rm } from 'node:fs/promises'
import pg from 'pg'

/*
 * One-time rebuild of the single-school demo database (approved Nov 2026, when
 * the app moved to many schools with a fresh migration history). It runs only
 * on a database whose history holds the old single-school migrations, so a
 * database created after the move is never touched.
 */
const LEGACY = ['20261114_021152_initial', '20261114_143526_b61_interactive', '20261114_171008_b61_body']
async function rebuildLegacyDemo() {
  if (!process.env.DATABASE_URL) return
  const db = new pg.Client({ connectionString: process.env.DATABASE_URL })
  await db.connect()
  try {
    const t = await db.query(`SELECT to_regclass('public.payload_migrations') AS t`)
    if (!t.rows[0].t) return
    const old = await db.query(`SELECT 1 FROM payload_migrations WHERE name = ANY($1) LIMIT 1`, [LEGACY])
    const schools = await db.query(`SELECT to_regclass('public.schools') AS t`)
    if (!old.rowCount || schools.rows[0].t) return
    console.log('[b61] Rebuilding the old single-school demo database for the multi-school app')
    await db.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;')
    if (process.env.MEDIA_DIR) await rm(process.env.MEDIA_DIR + '/', { recursive: true, force: true }).catch(() => {})
  } finally {
    await db.end()
  }
}
await rebuildLegacyDemo().catch((e) => console.error('[b61] Legacy demo check failed:', e.message))

const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', process.env.PORT || '3000'], {
  stdio: 'inherit',
  env: { ...process.env, NODE_OPTIONS: '--no-deprecation' },
})
let stopping = false
for (const sig of ['SIGTERM', 'SIGINT']) {
  process.on(sig, () => {
    stopping = true
    child.kill(sig)
  })
}
child.on('exit', (code) => process.exit(stopping ? 0 : (code ?? 1)))
