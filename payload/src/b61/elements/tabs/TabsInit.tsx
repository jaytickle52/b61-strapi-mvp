'use client'
import { useEffect, useRef } from 'react'
import './tabs-behavior.js'

/** Wires the tab set this sits inside (roles, keyboard, panels). */
export default function TabsInit() {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const root = ref.current?.closest('.b61-tabs')
    const api = (window as any).B61Tabs
    if (root && api) api.init(root)
  }, [])
  return <span ref={ref} hidden />
}
