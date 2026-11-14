'use client'
import { useEffect, useRef } from 'react'

/*
 * The plugin's accordion behaviour (Sport_Accordion/behavior.js, 1.77.1),
 * reading its two settings from data attributes instead of Twig.
 */
export default function AccordionInit({ single, openFirst }: { single: boolean; openFirst: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const root = ref.current?.closest('.b61-acc') as HTMLElement | null
    if (!root) return
    const items = Array.from(root.querySelectorAll<HTMLElement>('.b61-acc__item'))
    const head = (it: HTMLElement) => it.querySelector<HTMLButtonElement>('.js-b61-acc-toggle')
    const setOpen = (it: HTMLElement, on: boolean) => {
      it.classList.toggle('is-open', on)
      head(it)?.setAttribute('aria-expanded', on ? 'true' : 'false')
    }
    const offs: (() => void)[] = []
    items.forEach((it) => {
      const h = head(it)
      if (!h) return
      const fn = () => {
        const willOpen = !it.classList.contains('is-open')
        if (single) items.forEach((o) => o !== it && o.classList.contains('is-open') && setOpen(o, false))
        setOpen(it, willOpen)
      }
      h.addEventListener('click', fn)
      offs.push(() => h.removeEventListener('click', fn))
    })
    if (openFirst && items[0]) setOpen(items[0], true)
    let ready = false
    const markReady = () => {
      if (ready) return
      ready = true
      root.classList.add('is-ready')
    }
    requestAnimationFrame(markReady)
    const t = setTimeout(markReady, 100)
    return () => {
      offs.forEach((f) => f())
      clearTimeout(t)
    }
  }, [single, openFirst])
  return <span ref={ref} hidden />
}
