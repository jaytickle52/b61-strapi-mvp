'use client'
import { useEffect, useRef } from 'react'

/**
 * Wires the carousel this sits inside (Previous/Next, counter, progress, ARIA).
 * The plugin's engine (carousel.js, unchanged) defines window.B61Carousel and
 * loads in the browser only.
 */
export default function CarouselInit() {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const region = ref.current?.closest('.js-b61-car')
    if (!region) return
    import('./carousel.js').then(() => (window as any).B61Carousel?.init(region))
  }, [])
  return <span ref={ref} hidden />
}
