import { createHash } from 'node:crypto'
import type { Payload } from 'payload'

/*
 * Bunny Stream uploads (server side). Banner 61 keeps one Stream library for
 * every school; each school's videos go in their own collection there. The
 * browser uploads the file straight to Bunny (resumable "tus" upload), so big
 * videos never pass through Vercel; this file only creates the video entry
 * and signs that upload.
 *
 * Needs BUNNY_STREAM_LIBRARY_ID and BUNNY_STREAM_API_KEY (the library's API
 * key, from Bunny > Stream > the library > API). Without them the upload
 * button stays hidden and pasting a Bunny link still works.
 */

const API = 'https://video.bunnycdn.com'
export const TUS_ENDPOINT = `${API}/tusupload`

export function bunnyConfig(): { libraryId: string; apiKey: string } | null {
  const libraryId = process.env.BUNNY_STREAM_LIBRARY_ID?.trim()
  const apiKey = process.env.BUNNY_STREAM_API_KEY?.trim()
  return libraryId && apiKey ? { libraryId, apiKey } : null
}

async function bunny<T>(path: string, init: RequestInit = {}): Promise<T> {
  const cfg = bunnyConfig()
  if (!cfg) throw new Error('Bunny Stream is not set up.')
  const res = await fetch(`${API}/library/${cfg.libraryId}${path}`, {
    ...init,
    headers: { AccessKey: cfg.apiKey, accept: 'application/json', 'content-type': 'application/json', ...(init.headers ?? {}) },
  })
  if (!res.ok) throw new Error(`Bunny answered ${res.status}: ${(await res.text()).slice(0, 200)}`)
  return (await res.json()) as T
}

/** The school's collection in the Bunny library, created on first use. */
async function schoolCollection(name: string): Promise<string | undefined> {
  try {
    const found = await bunny<{ items?: { guid: string; name: string }[] }>(
      `/collections?page=1&itemsPerPage=100&search=${encodeURIComponent(name)}`,
    )
    const hit = found.items?.find((c) => c.name === name)
    if (hit) return hit.guid
    const made = await bunny<{ guid: string }>('/collections', { method: 'POST', body: JSON.stringify({ name }) })
    return made.guid
  } catch {
    // Collections only organise the library; an upload still works without one.
    return undefined
  }
}

/**
 * Creates the video entry and the signature that lets this one browser upload
 * the file for the next few hours (Bunny's presigned tus upload).
 */
export async function createUpload(payload: Payload, school: number | string, title: string) {
  const cfg = bunnyConfig()
  if (!cfg) throw new Error('Bunny Stream is not set up.')
  const doc = await payload.findByID({ collection: 'schools', id: school, depth: 0, overrideAccess: true }).catch(() => null)
  const collectionId = doc ? await schoolCollection(String((doc as any).name ?? (doc as any).slug ?? school)) : undefined
  const video = await bunny<{ guid: string }>('/videos', {
    method: 'POST',
    body: JSON.stringify({ title: title.slice(0, 200) || 'Video', ...(collectionId ? { collectionId } : {}) }),
  })
  const expires = Math.floor(Date.now() / 1000) + 6 * 60 * 60
  const signature = createHash('sha256').update(cfg.libraryId + cfg.apiKey + expires + video.guid).digest('hex')
  return {
    endpoint: TUS_ENDPOINT,
    libraryId: cfg.libraryId,
    videoId: video.guid,
    collectionId,
    expires,
    signature,
    embed: `https://iframe.mediadelivery.net/embed/${cfg.libraryId}/${video.guid}`,
  }
}

// Bunny's status numbers, in words staff understand.
const STATES: Record<number, { label: string; ready?: boolean; failed?: boolean }> = {
  0: { label: 'Waiting for the upload' },
  1: { label: 'Uploaded, queued for processing' },
  2: { label: 'Processing' },
  3: { label: 'Processing' },
  4: { label: 'Ready to play', ready: true },
  5: { label: 'This video could not be prepared', failed: true },
  6: { label: 'The upload failed', failed: true },
}

export async function videoStatus(videoId: string) {
  const v = await bunny<{ status: number; encodeProgress?: number; length?: number }>(`/videos/${encodeURIComponent(videoId)}`)
  const s = STATES[v.status] ?? { label: 'Processing' }
  return { ...s, progress: typeof v.encodeProgress === 'number' ? v.encodeProgress : undefined, seconds: v.length }
}

/**
 * Puts a video file that is already somewhere on the web (e.g. a Vercel Blob
 * URL) into the school's Bunny collection: creates the entry, then uploads the
 * bytes. Returns the Bunny embed link; Bunny encodes it over the next minutes.
 */
export async function copyToBunny(payload: Payload, school: number | string, title: string, sourceUrl: string): Promise<string> {
  const cfg = bunnyConfig()
  if (!cfg) throw new Error('Bunny Stream is not set up.')
  const file = await fetch(sourceUrl)
  if (!file.ok) throw new Error(`Could not download ${sourceUrl} (${file.status})`)
  const bytes = Buffer.from(await file.arrayBuffer())
  const doc = await payload.findByID({ collection: 'schools', id: school, depth: 0, overrideAccess: true }).catch(() => null)
  const collectionId = doc ? await schoolCollection(String((doc as any).name ?? (doc as any).slug ?? school)) : undefined
  const video = await bunny<{ guid: string }>('/videos', {
    method: 'POST',
    body: JSON.stringify({ title: title.slice(0, 200) || 'Video', ...(collectionId ? { collectionId } : {}) }),
  })
  const put = await fetch(`${API}/library/${cfg.libraryId}/videos/${video.guid}`, {
    method: 'PUT',
    headers: { AccessKey: cfg.apiKey, 'content-type': 'application/octet-stream' },
    body: bytes,
  })
  if (!put.ok) throw new Error(`Bunny refused the upload (${put.status}): ${(await put.text()).slice(0, 200)}`)
  return `https://iframe.mediadelivery.net/embed/${cfg.libraryId}/${video.guid}`
}

const GUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i

/** The video's id inside one of our player links, or null. */
export function videoGuid(link?: string | null): string | null {
  const m = typeof link === 'string' && /mediadelivery\.net/i.test(link) ? link.match(GUID_RE) : null
  return m ? m[0].toLowerCase() : null
}

/** Removes a video file from the library (the Videos list deletes unused ones). */
export async function deleteVideo(guid: string): Promise<void> {
  if (!bunnyConfig()) return
  await bunny(`/videos/${encodeURIComponent(guid)}`, { method: 'DELETE' })
}
