// DISASTER RECOVERY ONLY. Uploads a Blob backup folder (from blob-download.mjs)
// back into a Vercel Blob store, each file at its original path. Files already
// in the store with the same path are skipped unless OVERWRITE=true.
// See docs/BACKUPS.md before running this against the live store.
//
//   BLOB_READ_WRITE_TOKEN=... node scripts/backup/blob-restore.mjs <folder>
import { head, put } from '@vercel/blob'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const dir = path.resolve(process.argv[2] || 'blob-backup')
const token = process.env.BLOB_READ_WRITE_TOKEN
if (!token) throw new Error('BLOB_READ_WRITE_TOKEN is not set')
const overwrite = process.env.OVERWRITE === 'true'
const m = JSON.parse(await readFile(path.join(dir, 'manifest.json'), 'utf8'))

let uploaded = 0
let skipped = 0
for (const f of m.files) {
  if (!overwrite) {
    const exists = await head(f.pathname, { token }).then(() => true, () => false)
    if (exists) {
      skipped++
      continue
    }
  }
  const body = await readFile(path.join(dir, 'files', f.pathname))
  await put(f.pathname, body, {
    token,
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: overwrite,
    contentType: f.contentType || undefined,
  })
  uploaded++
}
console.log(`Blob restore: ${uploaded} uploaded, ${skipped} already there`)
