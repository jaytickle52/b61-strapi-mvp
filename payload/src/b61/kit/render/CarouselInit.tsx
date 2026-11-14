'use client'
import { useEffect, useRef } from 'react'
// The plugin's carousel engine, unchanged: it defines window.B61Carousel.
import './carousel.js'

/** Wires the carousel this sits inside (Previous/Next, counter, progress, ARIA). */
export default function CarouselInit() {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const region = ref.current?.closest('.js-b61-car')
    const api = (window as any).B61Carousel
    if (region && api) api.init(region)
  }, [])
  return <span ref={ref} hidden />
}
