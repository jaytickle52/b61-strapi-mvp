import { getSettings, mediaUrl, siteOrigin } from '@/lib/data'

const SOCIAL_KEYS = ['facebook', 'instagram', 'youtube', 'x', 'linkedin', 'tiktok', 'vimeo']
const abs = (origin: string, u?: string | null) => (u ? (u.startsWith('http') ? u : `${origin}${u}`) : undefined)

/** The school as a schema.org School: name, logo, address, phone, email, social profiles. */
export async function schoolSchema() {
  const [s, origin] = await Promise.all([getSettings(), siteOrigin()])
  const social = ((s as any).social ?? []).filter((x: any) => SOCIAL_KEYS.includes(x?.platform) && x?.url).map((x: any) => x.url)
  return {
    '@context': 'https://schema.org',
    '@type': 'School',
    '@id': `${origin}/#school`,
    name: s.schoolName,
    url: origin,
    description: s.tagline || undefined,
    logo: abs(origin, mediaUrl(s.logo as any)),
    telephone: s.phone || undefined,
    email: s.email || undefined,
    address: s.address ? { '@type': 'PostalAddress', streetAddress: s.address.replace(/\n+/g, ', ') } : undefined,
    sameAs: social.length ? social : undefined,
  }
}

export async function eventSchema(e: any) {
  const [s, origin] = await Promise.all([getSettings(), siteOrigin()])
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: e.title,
    startDate: e.startsAt,
    endDate: e.endsAt || undefined,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: { '@type': 'Place', name: e.location || s.schoolName, address: s.address ? s.address.replace(/\n+/g, ', ') : undefined },
    description: e.summary || undefined,
    image: abs(origin, mediaUrl(e.image)),
    url: `${origin}/events/${e.slug}`,
    organizer: { '@id': `${origin}/#school` },
  }
}

export async function articleSchema(n: any) {
  const origin = await siteOrigin()
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: n.title,
    datePublished: n.date,
    dateModified: n.updatedAt,
    description: n.summary || undefined,
    image: abs(origin, mediaUrl(n.image)),
    mainEntityOfPage: `${origin}/news/${n.slug}`,
    publisher: { '@id': `${origin}/#school` },
  }
}
