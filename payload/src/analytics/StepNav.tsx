'use client'
import { useStepNav } from '@payloadcms/ui'
import { useEffect } from 'react'

/** "Dashboard / Analytics" breadcrumb at the top of the page. */
export function StepNav() {
  const { setStepNav } = useStepNav()
  useEffect(() => setStepNav([{ label: 'Analytics' }]), [setStepNav])
  return null
}
