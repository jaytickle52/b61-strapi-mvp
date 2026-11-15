import { ymd } from '@/events/time'
import { getSettings, mediaUrl, siteOrigin } from '@/lib/data'
import { profileUrl } from '@/school/fields'
import { plainText } from './text'

/*
 * schema.org structured data (JSON-LD): what Google, Bing and AI tools read to
 * know who the school is, where it is and what each page holds. Everything
 * here is also shown on the site; nothing is written only for machines.
 */

const SOCIAL_KEYS = ['facebook', 'instagram', 'youtube', 'x', 'linkedin', 'tiktok', 'vimeo']
const abs = (origin: string, u?: string | null) => (u ? (u.startsWith('http') ? u : `${origin}${u}`) : undefined)
/** Only full profile addresses (not "https://facebook.com/"). */
const realLink = (u?: string | null) => (u && profileUrl(u) === true ? u.trim() : undefined)
const clean = <T extends Record<string, unknown>>(o: T): T => {
  for (const k of Object.keys(o)) if (o[k] === undefined || (Array.isArray(o[k]) && !(o[k] as unknown[]).length)) delete o[k]
  return o
}

/** The school's address as a schema.org PostalAddress, from the parts when they're filled in. */
export function postalAddress(s: any) {
  if (s.street || s.city) {
    return clean({
      '@type': 'PostalAddress',
      streetAddress: s.street || undefined,
      addressLocality: s.city || undefined,
      addressRegion: s.state || undefined,
      postalCode: s.postalCode || undefined,
      addressCountry: 'US',
    })
  }
  return s.address ? { '@type': 'PostalAddress', streetAddress: String(s.address).replace(/\n+/g, ', ') } : undefined
}

/** The school's facts in one sentence, e.g. "A PreK–12 nondenominational Christian school in Greenville, SC, founded in 1987." */
export function factSentence(s: any): string | undefined {
  const where = [s.city, s.state].filter(Boolean).join(', ')
  const kind = [s.grades, s.denomination ? String(s.denomination).toLowerCase() : null].filter(Boolean).join(' ')
  if (!kind && !where && !s.foundedYear) return undefined
  const lead = kind ? `${/^[aeiou8]/i.test(kind) ? 'An' : 'A'} ${kind} school` : `${s.schoolName} is a school`
  return `${lead}${where ? ` in ${where}` : ''}${s.foundedYear ? `, founded in ${s.foundedYear}` : ''}.`
}

const named = (rows: any[] | null | undefined) =>
  (rows ?? []).filter((r) => r?.name).map((r) => clean({ '@type': 'Organization', name: r.name, url: realLink(r.url) }))

/** The school as a schema.org School: name, address, map pin, hours, facts and profiles. On every page. */
export async function schoolSchema() {
  const [s, origin] = await Promise.all([getSettings(), siteOrigin()]) as [any, string]
  const social = (s.social ?? []).filter((x: any) => SOCIAL_KEYS.includes(x?.platform)).map((x: any) => realLink(x.url))
  const profiles = (s.profiles ?? []).map((x: any) => realLink(x?.url))
  const sameAs = [...new Set([...social, ...profiles].filter(Boolean))]
  const days: string[] = s.officeDays ?? []
  const amenities = [
    s.beforeAfterCare ? { '@type': 'LocationFeatureSpecification', name: 'Before and after care', value: true } : undefined,
    s.transportation ? { '@type': 'LocationFeatureSpecification', name: 'Transportation', value: s.transportation } : undefined,
  ].filter(Boolean)
  return clean({
    '@context': 'https://schema.org',
    '@type': 'School',
    '@id': `${origin}/#school`,
    name: s.schoolName,
    alternateName: s.shortName || undefined,
    url: origin,
    slogan: s.tagline || undefined,
    description: [factSentence(s), s.tagline].filter(Boolean).join(' ') || undefined,
    logo: abs(origin, mediaUrl(s.logo)),
    image: abs(origin, mediaUrl(s.shareImage, 'social') || mediaUrl(s.logo)),
    telephone: s.phone || undefined,
    email: s.email || undefined,
    address: postalAddress(s),
    geo: typeof s.latitude === 'number' && typeof s.longitude === 'number' ? { '@type': 'GeoCoordinates', latitude: s.latitude, longitude: s.longitude } : undefined,
    openingHoursSpecification:
      days.length && s.officeOpens && s.officeCloses
        ? [{ '@type': 'OpeningHoursSpecification', dayOfWeek: days.map((d) => DAY_NAMES[d]).filter(Boolean), opens: s.officeOpens, closes: s.officeCloses }]
        : undefined,
    foundingDate: s.foundedYear ? String(s.foundedYear) : undefined,
    hasCredential: (s.accreditations ?? [])
      .filter((a: any) => a?.name)
      .map((a: any) => ({ '@type': 'EducationalOccupationalCredential', credentialCategory: 'accreditation', recognizedBy: clean({ '@type': 'Organization', name: a.name, url: realLink(a.url) }) })),
    memberOf: named(s.memberships),
    parentOrganization: s.churchName ? clean({ '@type': 'Organization', name: s.churchName, url: realLink(s.churchUrl) }) : undefined,
    amenityFeature: amenities,
    sameAs,
  })
}

const DAY_NAMES: Record<string, string> = {
  Mo: 'https://schema.org/Monday',
  Tu: 'https://schema.org/Tuesday',
  We: 'https://schema.org/Wednesday',
  Th: 'https://schema.org/Thursday',
  Fr: 'https://schema.org/Friday',
  Sa: 'https://schema.org/Saturday',
  Su: 'https://schema.org/Sunday',
}

/** The site itself (home page): lets Google show the school's name, not the domain, as the site name. */
export async function websiteSchema() {
  const [s, origin] = await Promise.all([getSettings(), siteOrigin()]) as [any, string]
  return clean({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${origin}/#website`,
    name: s.schoolName,
    alternateName: s.shortName || undefined,
    url: `${origin}/`,
    publisher: { '@id': `${origin}/#school` },
  })
}

/** Who runs an event or writes the news: the school, spelled out (some readers don't follow @id links). */
const school = (s: any, origin: string) => ({ '@type': 'School', '@id': `${origin}/#school`, name: s.schoolName, url: origin })

export async function eventSchema(e: any) {
  const [s, origin] = await Promise.all([getSettings(), siteOrigin()]) as [any, string]
  const start = e.allDay ? ymd(e.startsAt) : e.startsAt
  return clean({
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: e.title,
    // All-day events are dates on the school's calendar, not moments. A one-day
    // event ends the day it starts.
    startDate: start,
    endDate: e.endsAt ? (e.allDay ? ymd(e.endsAt) : e.endsAt) : e.allDay ? start : undefined,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: clean({ '@type': 'Place', name: e.location || s.schoolName, address: postalAddress(s) }),
    description: e.summary || plainText(e.description, 300) || undefined,
    image: abs(origin, mediaUrl(e.image, 'social') || mediaUrl(s.shareImage, 'social') || mediaUrl(s.logo)),
    url: `${origin}/events/${e.slug}`,
    organizer: school(s, origin),
  })
}

export async function articleSchema(n: any) {
  const [s, origin] = await Promise.all([getSettings(), siteOrigin()]) as [any, string]
  return clean({
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: n.title,
    datePublished: n.date,
    dateModified: n.updatedAt,
    description: n.summary || undefined,
    image: abs(origin, mediaUrl(n.image, 'social') || mediaUrl(s.shareImage, 'social') || mediaUrl(s.logo)),
    mainEntityOfPage: `${origin}/news/${n.slug}`,
    author: school(s, origin),
    publisher: clean({ ...school(s, origin), logo: abs(origin, mediaUrl(s.logo)) }),
  })
}

/** Home › Programs › Lower School, as schema.org data (the same trail is shown on the page). */
export async function breadcrumbSchema(trail: { name: string; path: string }[]) {
  const origin = await siteOrigin()
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, item: `${origin}${t.path === '/' ? '/' : t.path}` })),
  }
}

/** The Our team page: each person's name, job title and photo, working at the school. */
export async function staffSchema(people: any[]) {
  const origin = await siteOrigin()
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: people.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: clean({
        '@type': 'Person',
        name: p.name,
        jobTitle: p.role || undefined,
        image: abs(origin, mediaUrl(p.photo, 'card')),
        worksFor: { '@id': `${origin}/#school` },
      }),
    })),
  }
}

/** An Accordion marked "These are questions and answers": schema.org FAQPage. */
export function faqSchema(items: { title?: string | null; body?: unknown }[]) {
  const qa = items
    .map((i) => ({ q: (i.title ?? '').trim(), a: plainText(i.body, 2000) }))
    .filter((x) => x.q && x.a)
  if (!qa.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: qa.map((x) => ({ '@type': 'Question', name: x.q, acceptedAnswer: { '@type': 'Answer', text: x.a } })),
  }
}
