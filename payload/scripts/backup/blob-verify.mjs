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
    if (body.length !== f.size || sum !== f.sha256) bad.push({ f, why: 'changed' })
  } catch {
    bad.push({ f, why: 'missing' })
  }
}
if (bad.length) {
  // File names can be families' own (form uploads) and the logs are public:
  // report the folder and a short fingerprint, never the name.
  const line = ({ f, why }) => `${f.pathname.split('/')[0]}/… (sha256 ${f.sha256.slice(0, 12)}): ${why}`
  console.error(`Blob backup check FAILED (${bad.length} of ${m.count}):\n` + bad.slice(0, 50).map(line).join('\n'))
  process.exit(1)
}
console.log(`Blob backup check: all ${m.count} files match (${(m.bytes / 1e6).toFixed(1)} MB, taken ${m.createdAt})`)
