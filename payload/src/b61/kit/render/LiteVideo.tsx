'use client'
import { useState } from 'react'

/**
 * A YouTube or Vimeo video that loads only when played (like Breakdance's
 * "lightweight" loading): a poster and a play button, then the player.
 * YouTube uses the no-cookie domain.
 */
export function parseVideo(url?: string | null): { provider: 'youtube' | 'vimeo'; id: string } | null {
  if (!url) return null
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/)
  if (yt) return { provider: 'youtube', id: yt[1] }
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vm) return { provider: 'vimeo', id: vm[1] }
  return null
}

export default function LiteVideo({ url, title = 'Video' }: { url: string; title?: string }) {
  const [playing, setPlaying] = useState(false)
  const v = parseVideo(url)
  if (!v) return null
  const src =
    v.provider === 'youtube'
      ? `https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`
      : `https://player.vimeo.com/video/${v.id}?autoplay=1&dnt=1`
  if (playing) {
    return <iframe src={src} title={title} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen style={{ border: 0 }} />
  }
  const poster = v.provider === 'youtube' ? `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg` : null
  return (
    <button type="button" className="b61-lite-video" onClick={() => setPlaying(true)} aria-label={`Play ${title}`}>
      {poster && <img src={poster} alt="" loading="lazy" />}
      <span className="b61-lite-video__play" aria-hidden="true" />
    </button>
  )
}
