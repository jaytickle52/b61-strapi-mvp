'use client'
import { useEffect, useRef } from 'react'

/*
 * Ported from elements/Hero/behavior.js:
 * 1. Pause control for video / slideshow backgrounds (WCAG 2.2.2). The button
 *    ships hidden and is shown only when it can work: JS on, motion allowed.
 * 2. "Full" height fills the first screen: --b61-hero-offset is the hero's
 *    distance from the top of the page, if it starts within half a screen.
 * Each hero runs its own copy, so there is no global selector to collide.
 */
export default function HeroBehavior() {
  const marker = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const root = marker.current?.closest<HTMLElement>('[data-b61-hero]')
    if (!root) return
    const cleanups: (() => void)[] = []

    // 1. Pause
    const btn = root.querySelector<HTMLButtonElement>('.js-b61-hero-motion')
    const bg = root.querySelector<HTMLElement>('.b61-hero__bg')
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (btn && bg && !reduced) {
      const video = bg.querySelector('video')
      btn.hidden = false
      const onClick = () => {
        const paused = btn.getAttribute('aria-pressed') !== 'true'
        btn.setAttribute('aria-pressed', paused ? 'true' : 'false')
        btn.setAttribute('aria-label', paused ? 'Play background motion' : 'Pause background motion')
        bg.classList.toggle('is-paused', paused)
        if (video) {
          if (paused) video.pause()
          else video.play().catch(() => {})
        }
      }
      btn.addEventListener('click', onClick)
      cleanups.push(() => btn.removeEventListener('click', onClick))
    }

    // 2. Fit the first screen
    const fit = () => {
      const top = root.getBoundingClientRect().top + window.scrollY
      const off = top > 0 && top < window.innerHeight * 0.5 ? Math.round(top) : 0
      root.style.setProperty('--b61-hero-offset', `${off}px`)
    }
    fit()
    let t: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(t)
      t = setTimeout(fit, 100)
    }
    window.addEventListener('resize', onResize)
    document.fonts?.ready.then(fit)
    cleanups.push(() => window.removeEventListener('resize', onResize))

    return () => cleanups.forEach((c) => c())
  }, [])

  return <span ref={marker} hidden />
}
