'use client'
import { useEffect, useRef } from 'react'

/** Wires the tab set this sits inside (roles, keyboard, panels). The engine loads in the browser only. */
export default function TabsInit() {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const root = ref.current?.closest('.b61-tabs')
    if (!root) return
    import('./tabs-behavior.js').then(() => (window as any).B61Tabs?.init(root))
  }, [])
  return <span ref={ref} hidden />
}
