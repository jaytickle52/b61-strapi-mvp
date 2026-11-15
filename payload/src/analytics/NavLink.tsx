'use client'
import { Link } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'

/** "Analytics" at the bottom of the admin's left-hand menu. */
export function AnalyticsNavLink() {
  const active = usePathname()?.startsWith('/admin/analytics')
  return (
    <div className="b61-nav-extra">
      <Link href="/admin/analytics" className={`nav__link${active ? ' active' : ''}`} id="nav-b61-analytics" prefetch={false}>
        {active && <div className="nav__link-indicator" />}
        <span className="nav__link-label">Analytics</span>
      </Link>
    </div>
  )
}
