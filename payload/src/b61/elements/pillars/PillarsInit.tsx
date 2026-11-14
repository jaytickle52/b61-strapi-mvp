'use client'
import { useEffect, useRef } from 'react'

/* The plugin's Pillars behaviour (Pillars/behavior.js, 1.77.1), with its root passed in. */
export default function PillarsInit({ openFirst }: { openFirst: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const root = ref.current?.closest('.b61-pillars') as HTMLElement | null
    if (!root) return
    const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('.js-b61-pillars-tab'))
    const figures = Array.from(root.querySelectorAll<HTMLElement>('.b61-pillars__figure'))
    if (!tabs.length) return
    const panelOf = (t: HTMLElement) => document.getElementById(t.getAttribute('aria-controls') || '')
    const setPanel = (p: HTMLElement | null, on: boolean) => {
      if (!p) return
      p.removeAttribute('hidden')
      p.classList.toggle('is-open', on)
      if (on) {
        p.removeAttribute('inert')
        p.setAttribute('aria-hidden', 'false')
      } else {
        p.setAttribute('inert', '')
        p.setAttribute('aria-hidden', 'true')
      }
    }
    const activate = (i: number, focus: boolean) => {
      tabs.forEach((t, j) => {
        const on = j === i
        t.setAttribute('aria-selected', on ? 'true' : 'false')
        t.setAttribute('tabindex', on ? '0' : '-1')
        t.classList.toggle('is-active', on)
        setPanel(panelOf(t), on)
      })
      figures.forEach((f, j) => {
        f.classList.toggle('is-active', j === i)
        f.setAttribute('aria-hidden', j === i ? 'false' : 'true')
      })
      if (focus) tabs[i].focus()
    }
    const offs: (() => void)[] = []
    tabs.forEach((t, i) => {
      const click = () => activate(i, false)
      const key = (e: KeyboardEvent) => {
        const k = e.key
        let n: number | null = null
        if (k === 'ArrowDown' || k === 'ArrowRight') n = (i + 1) % tabs.length
        else if (k === 'ArrowUp' || k === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length
        else if (k === 'Home') n = 0
        else if (k === 'End') n = tabs.length - 1
        else if (k === 'Enter' || k === ' ') n = i
        if (n === null) return
        e.preventDefault()
        activate(n, true)
      }
      t.addEventListener('click', click)
      t.addEventListener('keydown', key)
      offs.push(() => {
        t.removeEventListener('click', click)
        t.removeEventListener('keydown', key)
      })
    })
    let selected = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true')
    if (selected < 0 && openFirst) selected = 0
    if (selected >= 0) activate(selected, false)
    let ready = false
    const markReady = () => {
      if (ready) return
      ready = true
      root.classList.add('is-ready')
    }
    requestAnimationFrame(markReady)
    const tm = setTimeout(markReady, 100)
    return () => {
      offs.forEach((f) => f())
      clearTimeout(tm)
    }
  }, [openFirst])
  return <span ref={ref} hidden />
}
