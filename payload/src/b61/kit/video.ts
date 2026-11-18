import type { Field } from 'payload'

/*
 * Video links: YouTube, Vimeo and Bunny Stream. One parser for the editor's
 * check and the site's player, so a link the editor accepts always plays.
 */

export type VideoRef =
  | { provider: 'youtube'; id: string }
  | { provider: 'vimeo'; id: string }
  | { provider: 'bunny'; library: string; id: string }

const GUID = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'

export function parseVideo(url?: string | null): VideoRef | null {
  if (!url) return null
  const u = url.trim()
  const yt = u.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/)
  if (yt) return { provider: 'youtube', id: yt[1] }
  const vm = u.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vm) return { provider: 'vimeo', id: vm[1] }
  // Bunny Stream: the Embed or Play link from the video's page in Bunny
  // (iframe.mediadelivery.net or player.mediadelivery.net/{embed|play}/<library>/<video>).
  const bn = u.match(new RegExp(`(?:iframe|player)\\.mediadelivery\\.net/(?:embed|play)/(\\d+)/(${GUID})`, 'i'))
  if (bn) return { provider: 'bunny', library: bn[1], id: bn[2].toLowerCase() }
  return null
}

/** The player address for a parsed video. */
export function embedUrl(v: VideoRef, opts: { autoplay?: boolean } = {}): string {
  const auto = opts.autoplay !== false
  if (v.provider === 'youtube') return `https://www.youtube-nocookie.com/embed/${v.id}?${auto ? 'autoplay=1&' : ''}rel=0`
  if (v.provider === 'vimeo') return `https://player.vimeo.com/video/${v.id}?${auto ? 'autoplay=1&' : ''}dnt=1`
  return `https://iframe.mediadelivery.net/embed/${v.library}/${v.id}?autoplay=${auto}&preload=${auto}&responsive=true`
}

export const VIDEO_HELP = 'YouTube, Vimeo or Bunny Stream. The player loads only when someone presses play.'
export const VIDEO_PLACEHOLDER = 'https://www.youtube.com/watch?v=… · https://vimeo.com/… · https://iframe.mediadelivery.net/embed/…'
const VIDEO_ERROR =
  'Paste a YouTube, Vimeo or Bunny Stream link. For Bunny, open the video in Bunny Stream and copy its Embed or Play link (it contains mediadelivery.net).'

/** The "Video link" field, shown when `show` says so. */
export function videoLinkField(show: (siblingData: any) => boolean): Field {
  return {
    name: 'video',
    label: 'Video link',
    type: 'text',
    admin: {
      condition: (_, s) => show(s),
      placeholder: VIDEO_PLACEHOLDER,
      description: VIDEO_HELP,
      // Adds "Upload a video" (to Bunny Stream) when uploads are switched on.
      components: { Field: '@/video/VideoField#VideoField' },
    },
    validate: (v: unknown, { siblingData }: any) => {
      if (!show(siblingData) || !v) return true
      return parseVideo(String(v)) ? true : VIDEO_ERROR
    },
  }
}

/**
 * A Bunny Stream video as a plain video file, for backgrounds that autoplay
 * muted (Hero). Uses the library's CDN hostname (BUNNY_STREAM_CDN_HOSTNAME,
 * e.g. vz-1234abcd-567.b-cdn.net, from Bunny > Stream > the library > API)
 * and Bunny's MP4 files (the library's "MP4 fallback" must be on). Sizes are
 * listed largest first; the browser moves on when one doesn't exist.
 * Server-side only (reads the environment).
 */
export function bunnyBackground(url?: string | null): { sources: string[]; poster: string } | null {
  const v = parseVideo(url)
  const host = process.env.BUNNY_STREAM_CDN_HOSTNAME?.trim().replace(/^https?:\/\//, '').replace(/\/+$/, '')
  if (!v || v.provider !== 'bunny' || !host) return null
  const base = `https://${host}/${v.id}`
  return { sources: ['720p', '480p', '360p'].map((h) => `${base}/play_${h}.mp4`), poster: `${base}/thumbnail.jpg` }
}

const BUNNY_ONLY_ERROR =
  'Paste a Bunny Stream link: open the video in Bunny Stream and copy its Embed or Play link (it contains mediadelivery.net).'

/** The Hero's "Bunny video" field: a Bunny link (or upload), played as the background. */
export function bunnyBackgroundField(show: (siblingData: any) => boolean): Field {
  return {
    name: 'bunnyVideo',
    label: 'Video',
    type: 'text',
    admin: {
      condition: (_, s) => show(s),
      placeholder: 'https://iframe.mediadelivery.net/embed/…',
      description:
        'Plays muted on a loop behind the text. Videos are stored on Bunny Stream; keep this page open until the upload finishes.',
      components: { Field: { path: '@/video/VideoField#VideoField', clientProps: { uploadFirst: true } } },
    },
    validate: (v: unknown, { siblingData }: any) => {
      if (!show(siblingData) || !v) return true
      return parseVideo(String(v))?.provider === 'bunny' ? true : BUNNY_ONLY_ERROR
    },
  }
}
