import type { PayloadRequest } from 'payload'
import type { School } from '@/payload-types'
import { canUseSchool, idOf, isB61Admin } from '@/access'

/**
 * The school picked in the admin's School selector (the multi-school plugin
 * keeps it in the `payload-tenant` cookie). Falls back to the first school the
 * account works at. Null when the account has no school (or isn't signed in).
 */
export async function selectedSchool(req: PayloadRequest, cookies?: Map<string, string>): Promise<School | null> {
  const user = req.user as any
  if (!user) return null
  const raw = cookies?.get('payload-tenant') ?? readCookie(req.headers?.get?.('cookie') ?? '', 'payload-tenant')
  const picked = idOf(raw)
  const load = async (id: number | string) => {
    try {
      return (await req.payload.findByID({ collection: 'schools', id, depth: 1, overrideAccess: true })) as School
    } catch {
      return null
    }
  }
  if (picked != null && canUseSchool(user, picked)) {
    const school = await load(picked)
    if (school) return school
  }
  if (isB61Admin(user)) {
    const first = await req.payload.find({ collection: 'schools', sort: 'name', limit: 1, depth: 1, overrideAccess: true })
    return (first.docs[0] as School) ?? null
  }
  for (const row of user.tenants ?? []) {
    const id = idOf(row?.tenant)
    if (id == null) continue
    const school = await load(id)
    if (school) return school
  }
  return null
}

function readCookie(header: string, name: string): string | undefined {
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=')
    if (k === name) return decodeURIComponent(v.join('='))
  }
  return undefined
}

/** The public address of a school: its first domain, or the demo address with the school picked. */
export function schoolSiteUrl(school: Pick<School, 'slug' | 'domains'> | null): string {
  const own = school?.domains?.[0]?.domain
  if (own) return `https://${own.replace(/^https?:\/\//, '').replace(/\/+$/, '')}`
  return school?.slug ? `/next/school/${school.slug}` : '/'
}
