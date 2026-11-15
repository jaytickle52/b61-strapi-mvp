'use client'
import { useFormFields } from '@payloadcms/ui'
import { countH1 } from '../headings'

/*
 * Above a page's sections: a gentle note when the page would have no main
 * heading (H1) or more than one. Google and screen readers expect exactly one.
 *
 * It follows the same rule the site renders by (kit/groups.ts
 * resolveHeadingLevel): a section with heading lines and Heading level
 * "Automatic" is the H1 when it is the first section on the page; inside a
 * container (Section columns, Tabs, Carousel) Automatic never becomes H1, so
 * only an explicit H1 counts there.
 */

export function HeadingCheck() {
  const count = useFormFields(([fields]) => countH1(fields as any))
  if (count === null || count === 1) return null
  return (
    <div className="b61-heading-check" role="status">
      {count === 0 ? (
        <>
          <strong>This page has no main heading.</strong> Give the first section a heading, or set one section&apos;s Heading
          level to H1. Google and screen readers use it to tell what the page is about.
        </>
      ) : (
        <>
          <strong>This page has {count} main headings (H1).</strong> Pages work best in Google and for screen readers with exactly
          one. Set the others&apos; Heading level to H2.
        </>
      )}
    </div>
  )
}
