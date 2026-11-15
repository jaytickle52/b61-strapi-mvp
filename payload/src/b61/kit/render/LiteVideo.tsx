'use client'
import { useState } from 'react'
import { embedUrl, parseVideo } from '../video'

/**
 * A YouTube, Vimeo or Bunny Stream video that loads only when played (like
 * Breakdance's "lightweight" loading): a poster and a play button, then the
 * player. YouTube uses the no-cookie domain.
 *
 * Bunny's link doesn't say where its poster image lives, so a Bunny video
 * shows Bunny's own player straight away (lazy-loaded, nothing preloaded
 * until it is played); that player shows the video's thumbnail itself.
 */
export default function LiteVideo({ url, title = 'Video' }: { url: string; title?: string }) {
  const [playing, setPlaying] = useState(false)
  const v = parseVideo(url)
  if (!v) return null
  const allow = 'accelerometer; gyroscope; autoplay; encrypted-media; fullscreen; picture-in-picture'
  if (v.provider === 'bunny') {
    return <iframe src={embedUrl(v, { autoplay: false })} title={title} loading="lazy" allow={allow} allowFullScreen style={{ border: 0 }} />
  }
  if (playing) {
    return <iframe src={embedUrl(v)} title={title} allow={allow} allowFullScreen style={{ border: 0 }} />
  }
  const poster = v.provider === 'youtube' ? `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg` : null
  return (
    <button type="button" className="b61-lite-video" onClick={() => setPlaying(true)} aria-label={`Play ${title}`}>
      {poster && <img src={poster} alt="" loading="lazy" />}
      <span className="b61-lite-video__play" aria-hidden="true" />
    </button>
  )
}
