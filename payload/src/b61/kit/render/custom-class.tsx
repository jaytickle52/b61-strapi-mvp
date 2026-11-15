import type { ReactNode } from 'react'
import { cssClassOf } from '../../lib/custom-css'

/**
 * Wraps an element in its Banner 61 CSS class (Design > Advanced), when it has
 * one. The wrapper is `display: contents`, so it adds no box and the element
 * lays out exactly as before; custom CSS targets it as `.my-class .b61-hero`.
 *
 * Elements without a class render with no wrapper at all, because a wrapper
 * breaks plugin rules that rely on two elements being next to each other
 * (e.g. a band pulling up over the one above). That trade-off is the admin's
 * to make, one element at a time.
 */
export function WithClass({ block, children }: { block: any; children: ReactNode }) {
  const cls = cssClassOf(block)
  if (!cls) return <>{children}</>
  return (
    <div className={`b61-custom ${cls}`} style={{ display: 'contents' }}>
      {children}
    </div>
  )
}
