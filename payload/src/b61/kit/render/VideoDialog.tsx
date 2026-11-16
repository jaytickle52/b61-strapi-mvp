'use client'
import { useEffect, useRef, useState } from 'react'
import { embedUrl, parseVideo } from '../video'

/*
 * Plays a video in a pop-up over the page. Mounted once in the layout: any
 * button set to "Opens: A video" (data-b61-video) opens it. Without
 * JavaScript the button is a plain link to the video.
 *
 * A modal <dialog>: focus moves into it, Escape and the backdrop close it,
 * focus returns to the button, and the player is removed on close so the
 * sound stops.
 */
export default function VideoDialog() {
  const dialog = useRef<HTMLDialogElement>(null)
  const opener = useRef<HTMLElement | null>(null)
  const [video, setVideo] = useState<{ src: string; title: string } | null>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element | null)?.closest?.<HTMLElement>('[data-b61-video]')
      if (!a) return
      const v = parseVideo(a.dataset.b61Video)
      if (!v || !dialog.current) return
      e.preventDefault()
      opener.current = a
      setVideo({ src: embedUrl(v), title: a.dataset.b61VideoTitle || 'Video' })
      dialog.current.showModal()
      document.documentElement.classList.add('b61-hdr-lock')
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  const close = () => dialog.current?.close()

  return (
    <dialog
      ref={dialog}
      className="b61-vdialog"
      aria-label={video?.title ?? 'Video'}
      onClose={() => {
        setVideo(null)
        document.documentElement.classList.remove('b61-hdr-lock')
        opener.current?.focus()
      }}
      onClick={(e) => e.target === dialog.current && close()}
    >
      <div className="b61-vdialog__inner">
        <button type="button" className="b61-vdialog__close" onClick={close} aria-label="Close video">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
            <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <div className="b61-vdialog__frame">
          {video && (
            <iframe
              src={video.src}
              title={video.title}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </dialog>
  )
}
