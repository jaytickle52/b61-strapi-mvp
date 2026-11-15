'use client'
import { useFormFields } from '@payloadcms/ui'

/*
 * Under "Hide this whole site from search engines" in School settings: while
 * it's ticked, say plainly what that means, so nobody leaves it on at launch.
 */
export function HiddenNote() {
  const hidden = useFormFields(([fields]) => Boolean(fields?.hideFromSearch?.value))
  if (!hidden) return null
  return (
    <div className="b61-hidden-note" role="status">
      <strong>The whole site is hidden right now.</strong> Google, Bing and AI tools like ChatGPT won&apos;t list any page, and
      robots.txt tells them to stay away. Untick this when the site goes live.
    </div>
  )
}
