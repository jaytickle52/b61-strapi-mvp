'use client'
import { useEffect, useRef } from 'react'
import { initGallery } from './gallery-behavior.js'

/** Wires the gallery this sits inside: strip arrows, or the masonry packer. */
export default function GalleryInit() {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const root = ref.current?.closest('.b61-gallery')
    if (root) initGallery(root)
  }, [])
  return <span ref={ref} hidden />
}
