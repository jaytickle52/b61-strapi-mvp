'use client'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { runReveal } from './reveal.js'

/** Plays B61 entrance animations on first load and after every page change. */
export default function Reveal() {
  const pathname = usePathname()
  useEffect(() => {
    const stop = runReveal()
    return () => stop?.()
  }, [pathname])
  return null
}
