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
