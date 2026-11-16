'use client'
import { useEffect } from 'react'

/* Pause / play for scrolling logo rows (WCAG 2.2.2: moving content can be stopped). */
export default function LogosInit() {
  useEffect(() => {
    const rows = Array.from(document.querySelectorAll<HTMLElement>('[data-b61-marquee]:not([data-b61-marquee-ready])'))
    const offs: (() => void)[] = []
    for (const row of rows) {
      row.setAttribute('data-b61-marquee-ready', '')
      const btn = row.querySelector<HTMLButtonElement>('[data-b61-marquee-toggle]')
      const label = btn?.querySelector('.b61-logos__pause-label')
      if (!btn) continue
      const onClick = () => {
        const paused = row.classList.toggle('is-paused')
        btn.setAttribute('aria-pressed', String(paused))
        if (label) label.textContent = paused ? 'Play logos' : 'Pause logos'
      }
      btn.addEventListener('click', onClick)
      offs.push(() => {
        btn.removeEventListener('click', onClick)
        row.removeAttribute('data-b61-marquee-ready')
      })
    }
    return () => offs.forEach((f) => f())
  }, [])
  return null
}
