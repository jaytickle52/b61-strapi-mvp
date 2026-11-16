'use client'
import { useEffect } from 'react'

/*
 * Marks the scroll-story item in view: its title gets is-active (and
 * aria-current), earlier titles is-past for the progress line. One observer
 * for every story on the page; an item counts as "in view" when it crosses
 * the middle band of the screen.
 */
export default function ScrollStoryInit() {
  useEffect(() => {
    const stories = Array.from(document.querySelectorAll<HTMLElement>('[data-b61-story]:not([data-b61-story-ready])'))
    if (!stories.length || !('IntersectionObserver' in window)) return
    const cleanups: (() => void)[] = []
    for (const story of stories) {
      story.setAttribute('data-b61-story-ready', '')
      const steps = Array.from(story.querySelectorAll<HTMLElement>('[data-b61-story-step]'))
      const navItems = Array.from(story.querySelectorAll<HTMLElement>('.b61-story__navitem'))
      const show = (n: number) =>
        navItems.forEach((li, i) => {
          li.classList.toggle('is-active', i === n)
          li.classList.toggle('is-past', i < n)
          const a = li.querySelector('a')
          if (i === n) a?.setAttribute('aria-current', 'step')
          else a?.removeAttribute('aria-current')
        })
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) if (e.isIntersecting) show(Number((e.target as HTMLElement).dataset.b61StoryStep))
        },
        { rootMargin: '-45% 0px -45% 0px' },
      )
      steps.forEach((s) => io.observe(s))
      cleanups.push(() => {
        io.disconnect()
        story.removeAttribute('data-b61-story-ready')
      })
    }
    return () => cleanups.forEach((c) => c())
  }, [])
  return null
}
