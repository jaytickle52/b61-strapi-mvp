import type { Payload } from 'payload'
import escapeHTML from 'escape-html'
import { PLATFORM_FROM_ADDRESS, PLATFORM_FROM_NAME } from './adapter'

/*
 * Who a school's email comes from, and the branded wrapper every school email
 * uses (form notifications, confirmations, test emails, password resets).
 */

export type SchoolSender = {
  school: number | null
  schoolName: string
  /** "Cedar Ridge Christian Academy <forms@...>" */
  from: string
  replyTo?: string
  /** Where form notifications go when a form doesn't say. */
  recipients: string[]
  logoUrl?: string
  color: string
}

const idOf = (v: unknown): number | null => {
  const id = v && typeof v === 'object' ? (v as any).id : v
  return typeof id === 'number'
    ? id
    : typeof id === 'string' && /^\d+$/.test(id)
      ? Number(id)
      : null
}

const quoteName = (name: string) => `"${name.replace(/["\\<>]/g, '')}"`

export const splitAddresses = (v?: string | null) =>
  (v ?? '')
    .split(/[,;\s]+/)
    .map((s) => s.trim())
    .filter((s) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s))

/** The site's own address, for links in emails (empty when unknown). */
export const siteOrigin = () =>
  (
    process.env.NEXT_PUBLIC_SERVER_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : '')
  ).replace(/\/$/, '')

const absolute = (url?: string | null) => {
  if (!url) return undefined
  if (/^https?:\/\//.test(url)) return url
  const base = siteOrigin()
  return base ? base + url : undefined
}

export async function schoolSender(payload: Payload, schoolRef: unknown): Promise<SchoolSender> {
  const school = idOf(schoolRef)
  let s: any = null
  if (school != null) {
    const res = await payload.find({
      collection: 'school-settings',
      where: { school: { equals: school } },
      limit: 1,
      depth: 1,
      overrideAccess: true,
      draft: false,
    })
    s = res.docs[0] ?? null
  }
  const schoolName = s?.schoolName || PLATFORM_FROM_NAME
  const name = s?.emailFromName || schoolName
  const address = s?.emailFromAddress || PLATFORM_FROM_ADDRESS
  const replyTo = s?.emailReplyTo || s?.email || undefined
  const recipients = splitAddresses(s?.formRecipients)
  if (!recipients.length && s?.email) recipients.push(s.email)
  const logo = s?.logo && typeof s.logo === 'object' ? s.logo : null
  return {
    school,
    schoolName,
    from: `${quoteName(name)} <${address}>`,
    replyTo,
    recipients,
    logoUrl: absolute(logo?.sizes?.card?.url || logo?.url),
    color: /^#[0-9a-f]{3,8}$/i.test(s?.primaryColor ?? '') ? s.primaryColor : '#1F3A5F',
  }
}

/** Wraps body HTML in the school's simple branded email layout. */
export function brandedEmail(
  sender: Pick<SchoolSender, 'schoolName' | 'logoUrl' | 'color'>,
  bodyHtml: string,
  footer?: string,
) {
  const name = escapeHTML(sender.schoolName)
  const head = sender.logoUrl
    ? `<img src="${escapeHTML(sender.logoUrl)}" alt="${name}" style="max-height:56px;max-width:220px;display:block;margin:0 auto">`
    : `<div style="font:700 20px/1.3 Georgia,serif;color:#ffffff;text-align:center">${name}</div>`
  const headBg = sender.logoUrl ? '#ffffff' : sender.color
  return `<!doctype html><html><body style="margin:0;padding:0;background:#f4f2ee">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f2ee;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;border-top:4px solid ${sender.color}">
<tr><td style="background:${headBg};padding:24px">${head}</td></tr>
<tr><td style="padding:8px 32px 32px;font:16px/1.6 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#1d1d1d">${bodyHtml}</td></tr>
</table>
<p style="font:12px/1.5 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#6b6b6b;margin:16px 0 0">${footer ? escapeHTML(footer) : name}</p>
</td></tr></table></body></html>`
}

/** Styles the plain answers table the form builder produces ({{*:table}}). */
export const styleTables = (html: string) =>
  html
    .replace(
      /<table>/g,
      '<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:16px 0">',
    )
    .replace(
      /<tr><td>/g,
      '<tr><td style="padding:8px 12px 8px 0;border-bottom:1px solid #e6e2da;font-weight:600;vertical-align:top;width:35%">',
    )
    .replace(
      /<\/td><td>/g,
      '</td><td style="padding:8px 0;border-bottom:1px solid #e6e2da;vertical-align:top;white-space:pre-wrap">',
    )
