// Copies every file in the Vercel Blob store into a folder, keeping each file's
// path, and writes manifest.json (path, size, sha256) next to them. Used by the
// nightly backup (.github/workflows/payload-backup.yml); see docs/BACKUPS.md.
//
//   BLOB_READ_WRITE_TOKEN=... node scripts/backup/blob-download.mjs <folder>
import { list } from '@vercel/blob'
import { createHash } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const out = path.resolve(process.argv[2] || 'blob-backup')
const token = process.env.BLOB_READ_WRITE_TOKEN
if (!token) throw new Error('BLOB_READ_WRITE_TOKEN is not set')

const files = []
let cursor
do {
  const page = await list({ token, cursor, limit: 1000 })
  for (const b of page.blobs) files.push(b)
  cursor = page.hasMore ? page.cursor : undefined
} while (cursor)

const manifest = []
let bytes = 0
for (const b of files) {
  // A path from the store never leaves the backup folder.
  const dest = path.resolve(out, 'files', b.pathname)
  if (!dest.startsWith(path.join(out, 'files') + path.sep)) throw new Error(`Unsafe path in the store (file ${files.indexOf(b) + 1})`)
  let body
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(b.downloadUrl || b.url, { headers: { authorization: `Bearer ${token}` } })
    if (res.ok) {
      body = Buffer.from(await res.arrayBuffer())
      break
    }
    // File names can be families' own (form uploads) and the logs are public: no names.
    if (attempt === 3) throw new Error(`File ${files.indexOf(b) + 1} of ${files.length}: download failed (${res.status})`)
    await new Promise((r) => setTimeout(r, 2000 * attempt))
  }
  await mkdir(path.dirname(dest), { recursive: true })
  await writeFile(dest, body)
  bytes += body.length
  manifest.push({
    pathname: b.pathname,
    size: body.length,
    sha256: createHash('sha256').update(body).digest('hex'),
    contentType: b.contentType || null,
    uploadedAt: b.uploadedAt,
  })
}
await writeFile(path.join(out, 'manifest.json'), JSON.stringify({ createdAt: new Date().toISOString(), count: manifest.length, bytes, files: manifest }, null, 1))
console.log(`Blob backup: ${manifest.length} files, ${(bytes / 1e6).toFixed(1)} MB`)
