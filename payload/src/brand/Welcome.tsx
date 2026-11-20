import { twoFactorPending } from '@/users/two-factor-rules'
import type { Payload } from 'payload'
import { STALE_DAYS, staleDays } from '../announcements/status'
import { headers } from 'next/headers'
import { canManagePeopleAt, canPublishAt, isB61Admin, roleAt, SCHOOL_ROLES } from '@/access'
import { selectedSchool, schoolSiteUrl } from './school'
import { support } from './support'
import { serviceAccountEmail } from '@/analytics/ga'
import { schoolReport } from '@/analytics/report'
import { DEMO_SLUGS, sampleReport } from '@/analytics/sample'

/*
 * The top of the admin dashboard: a greeting, shortcuts for the jobs school
 * staff do most, this week at a glance, and where to get help.
 */

const DRAFTABLE = [
  { slug: 'pages', label: 'Page', title: 'title' },
  { slug: 'news', label: 'News', title: 'title' },
  { slug: 'events', label: 'Event', title: 'title' },
  { slug: 'staff', label: 'Staff', title: 'name' },
] as const

export async function Welcome({ payload, user }: { payload: Payload; user?: any }) {
  if (!user || twoFactorPending(user)) return null
  const school = await selectedSchool({ payload, user, headers: await headers() } as any)
  const name = String(user.name || user.firstName || user.email || '').split(/[\s@]/)[0]
  const admin = isB61Admin(user)
  const role = admin ? 'Banner 61' : SCHOOL_ROLES.find((r) => r.value === roleAt(user, school?.id))?.label.split(' (')[0]
  const publisher = school ? canPublishAt(user, school.id) : false
  const site = school ? schoolSiteUrl(school) : null
  const help = support()

  const actions: { href: string; label: string; hint: string; external?: boolean }[] = [
    { href: '/admin/collections/pages', label: 'Edit pages', hint: 'Change words and photos' },
    { href: '/admin/collections/news/create', label: 'Write a news post', hint: 'Share what\'s happening' },
    { href: '/admin/collections/events/create', label: 'Add an event', hint: 'Put it on the calendar' },
    { href: '/admin/collections/media', label: 'Photos', hint: 'Upload and organize' },
    ...(publisher ? [{ href: '/admin/collections/form-submissions', label: 'Form answers', hint: 'Inquiries, tours, contact' }] : []),
    ...(publisher ? [{ href: '/admin/collections/school-settings', label: 'School settings', hint: 'Contact details, colors, menus' }] : []),
    ...(school && canManagePeopleAt(user, school.id) ? [{ href: '/admin/collections/users', label: 'People', hint: 'Invite and manage staff' }] : []),
    { href: '/admin/analytics', label: 'Analytics', hint: 'Who\'s visiting the site' },
    ...(site ? [{ href: site, label: 'View the website', hint: 'Opens in a new tab', external: true }] : []),
  ]

  const [glance, drafts, hiddenLive, stale] = school
    ? await Promise.all([atAGlance(payload, school.id, publisher), unpublished(payload, school.id), hiddenWithDomain(payload, school), staleAnnouncements(payload, school.id)])
    : [[], [], false, []]

  return (
    <div className="b61-welcome">
      <div className="b61-welcome__hello">
        <h1>
          {greeting()}
          {name ? `, ${name}` : ''}
        </h1>
        {school && (
          <p>
            You&apos;re working on <strong>{school.name}</strong>
            {role ? ` as ${role === 'Banner 61' ? 'Banner 61 staff' : role}` : ''}.
            {admin && ' Switch schools with the School menu on the left.'}
          </p>
        )}
      </div>

      {hiddenLive && (
        <div className="b61-welcome__alert" role="alert">
          <strong>This website is hidden from Google and other search engines.</strong> {school?.name} has its own web address, but
          &quot;Hide this whole site from search engines&quot; is still on, so families can&apos;t find it by searching. Once the site
          is ready,{' '}
          {publisher ? (
            <a href="/admin/collections/school-settings">turn it off in School settings &gt; Search engines</a>
          ) : (
            'ask an Editor or School Admin to turn it off in School settings'
          )}
          .
        </div>
      )}

      {stale.length > 0 && (
        <div className="b61-welcome__check" role="status">
          <strong>{stale.length === 1 ? 'An announcement has' : `${stale.length} announcements have`} been up for over a month with no end date.</strong>{' '}
          Still needed?{' '}
          {stale.map((a, i) => (
            <span key={a.id}>
              {i > 0 && ', '}
              <a href={`/admin/collections/announcements/${a.id}`}>{a.title}</a> ({a.days} days)
            </span>
          ))}
          . Set &quot;Hide after&quot; or unpublish it.
        </div>
      )}

      <nav className="b61-welcome__actions" aria-label="Shortcuts">
        {actions.map((a) => (
          <a key={a.href} href={a.href} className="b61-welcome__action" {...(a.external ? { target: '_blank', rel: 'noreferrer' } : {})}>
            <strong>{a.label}</strong>
            <span>{a.hint}</span>
          </a>
        ))}
      </nav>

      {(glance.length > 0 || drafts.length > 0) && (
        <div className="b61-welcome__row">
          {glance.length > 0 && (
            <section className="b61-welcome__panel">
              <h2>Last 7 days</h2>
              <ul className="b61-welcome__stats">
                {glance.map((g) => (
                  <li key={g.label}>
                    <a href={g.href}>
                      <strong>{g.value.toLocaleString('en-US')}</strong>
                      <span>{g.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {drafts.length > 0 && (
            <section className="b61-welcome__panel">
              <h2>Not published yet</h2>
              <ul className="b61-welcome__drafts">
                {drafts.map((d) => (
                  <li key={`${d.slug}-${d.id}`}>
                    <a href={`/admin/collections/${d.slug}/${d.id}`}>{d.title || 'Untitled'}</a>
                    <span>
                      {d.label} · changed {ago(d.updatedAt)}
                    </span>
                  </li>
                ))}
              </ul>
              {!publisher && <p className="b61-welcome__note">An Editor or School Admin at your school publishes these.</p>}
            </section>
          )}
        </div>
      )}

      {(help.email || help.url) && (
        <p className="b61-welcome__help">
          Need a hand?{' '}
          {help.url && (
            <>
              <a href={help.url} target="_blank" rel="noreferrer">
                Read the how-to guides
              </a>
              {help.email ? ' or ' : '.'}
            </>
          )}
          {help.email && (
            <>
              {help.url ? 'email' : 'Email'} <a href={`mailto:${help.email}`}>{help.email}</a>.
            </>
          )}
        </p>
      )}
    </div>
  )
}

function greeting() {
  const hour = Number(
    new Intl.DateTimeFormat('en-US', { hour: 'numeric', hourCycle: 'h23', timeZone: process.env.SCHOOL_TIMEZONE || 'America/New_York' }).format(new Date()),
  )
  return hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
}

function ago(iso: string) {
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60_000))
  if (mins < 60) return mins <= 1 ? 'just now' : `${mins} minutes ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return hours === 1 ? 'an hour ago' : `${hours} hours ago`
  const days = Math.round(hours / 24)
  return days === 1 ? 'yesterday' : `${days} days ago`
}

async function atAGlance(payload: Payload, schoolId: number | string, publisher: boolean) {
  const out: { label: string; value: number; href: string }[] = []
  const settings = (
    await payload.find({ collection: 'school-settings', where: { school: { equals: schoolId } }, limit: 1, depth: 0, overrideAccess: true })
  ).docs[0] as any
  const school = await payload.findByID({ collection: 'schools', id: schoolId, depth: 0, overrideAccess: true }).catch(() => null)
  if (!settings?.gaPropertyId && school && !school.domains?.length && DEMO_SLUGS.includes(school.slug)) {
    out.push({ label: 'Website visitors (sample)', value: sampleReport(7).current.visitors, href: '/admin/analytics?days=7' })
  } else if (settings?.gaPropertyId && serviceAccountEmail()) {
    try {
      const r = await schoolReport(String(settings.gaPropertyId), 7)
      out.push({ label: 'Website visitors', value: r.current.visitors, href: '/admin/analytics?days=7' })
    } catch {
      // The Analytics page explains what's wrong; the dashboard just skips it.
    }
  }
  if (publisher) {
    const since = new Date(Date.now() - 7 * 86_400_000).toISOString()
    const { totalDocs } = await payload.count({
      collection: 'form-submissions',
      where: { and: [{ school: { equals: schoolId } }, { createdAt: { greater_than_equal: since } }] },
      overrideAccess: true,
    })
    out.push({ label: totalDocs === 1 ? 'Form answer' : 'Form answers', value: totalDocs, href: '/admin/collections/form-submissions' })
  }
  return out
}

/** The newest drafts that haven't been published (new items, or edits waiting to go live). */
async function unpublished(payload: Payload, schoolId: number | string) {
  const lists = await Promise.all(
    DRAFTABLE.map(async (c) => {
      const res = await payload.findVersions({
        collection: c.slug,
        where: { and: [{ latest: { equals: true } }, { 'version._status': { equals: 'draft' } }, { 'version.school': { equals: schoolId } }] },
        sort: '-updatedAt',
        limit: 5,
        depth: 0,
        overrideAccess: true,
      })
      return res.docs.map((v: any) => ({
        slug: c.slug,
        label: c.label,
        id: v.parent,
        title: v.version?.[c.title] as string | undefined,
        updatedAt: v.updatedAt as string,
      }))
    }),
  )
  return lists
    .flat()
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 5)
}

/**
 * True when a school with its own domain still has "Hide this whole site from
 * search engines" on: fine while building, a problem once the site is live.
 */
/** Announcements up for over a month with no "Hide after" (the snow-day banner still up in March). */
async function staleAnnouncements(payload: Payload, schoolId: number | string) {
  const cutoff = new Date(Date.now() - STALE_DAYS * 86_400_000).toISOString()
  const res = await payload.find({
    collection: 'announcements',
    where: { and: [{ school: { equals: schoolId } }, { _status: { equals: 'published' } }, { endsAt: { exists: false } }, { startsAt: { less_than_equal: cutoff } }] },
    limit: 5,
    depth: 0,
    overrideAccess: true,
    select: { title: true, startsAt: true },
  })
  return res.docs.map((a: any) => ({ id: a.id, title: a.title as string, days: staleDays(a) ?? STALE_DAYS }))
}

async function hiddenWithDomain(payload: Payload, school: { id: number | string; domains?: { domain?: string | null }[] | null }) {
  if (!(school.domains ?? []).some((d) => d?.domain)) return false
  const res = await payload.find({
    collection: 'school-settings',
    where: { school: { equals: school.id } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    select: { hideFromSearch: true } as any,
  })
  return Boolean((res.docs[0] as any)?.hideFromSearch)
}
