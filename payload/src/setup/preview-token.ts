import { createHmac, timingSafeEqual } from 'node:crypto'
import { secret } from '../lib/secrets'

/*
 * Signed setup preview links. During Schoolbox setup the school's leader
 * isn't a Payload user, but needs to see their draft pages. A link
 * /next/setup-preview?t=<token> shows one school's drafts, and nothing else,
 * until it expires. The token is "<school id>.<expiry, unix seconds>.<signature>".
 */

export const SETUP_PREVIEW_COOKIE = 'b61-setup-preview'
export const PREVIEW_DAYS = 14

const sign = (school: string, exp: number) =>
  createHmac('sha256', secret('SETUP_PREVIEW_SECRET')).update(`setup-preview:${school}.${exp}`).digest('base64url')

export function makePreviewToken(school: number | string, days = PREVIEW_DAYS, now = Date.now()): { token: string; expires: Date } {
  const exp = Math.floor(now / 1000) + Math.round(days * 86400)
  return { token: `${school}.${exp}.${sign(String(school), exp)}`, expires: new Date(exp * 1000) }
}

/** The school id a token is good for, or null when it is malformed, forged or expired. */
export function readPreviewToken(token: string | null | undefined, now = Date.now()): number | null {
  const m = /^(\d+)\.(\d+)\.([A-Za-z0-9_-]+)$/.exec(token ?? '')
  if (!m) return null
  const [, school, expRaw, sig] = m
  const exp = Number(expRaw)
  if (!Number.isFinite(exp) || exp * 1000 <= now) return null
  const want = Buffer.from(sign(school, exp))
  const got = Buffer.from(sig)
  if (want.length !== got.length || !timingSafeEqual(want, got)) return null
  return Number(school)
}
