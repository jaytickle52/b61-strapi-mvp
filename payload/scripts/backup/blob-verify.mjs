// Checks a restored Blob backup folder against its manifest.json: every file is
// there, with the right size and checksum. Exits 1 on any difference.
//
//   node scripts/backup/blob-verify.mjs <folder>
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const dir = path.resolve(process.argv[2] || 'blob-backup')
const m = JSON.parse(await readFile(path.join(dir, 'manifest.json'), 'utf8'))
const bad = []
for (const f of m.files) {
  try {
    const body = await readFile(path.join(dir, 'files', f.pathname))
    const sum = createHash('sha256').update(body).digest('hex')
    if (body.length !== f.size || sum !== f.sha256) bad.push(`${f.pathname}: changed`)
  } catch {
    bad.push(`${f.pathname}: missing`)
  }
}
if (bad.length) {
  console.error(`Blob backup check FAILED (${bad.length} of ${m.count}):\n` + bad.slice(0, 50).join('\n'))
  process.exit(1)
}
console.log(`Blob backup check: all ${m.count} files match (${(m.bytes / 1e6).toFixed(1)} MB, taken ${m.createdAt})`)
