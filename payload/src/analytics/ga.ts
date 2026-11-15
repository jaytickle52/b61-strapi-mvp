import { createSign } from 'crypto'

/*
 * Google Analytics (GA4 Data API) through the Banner 61 service account.
 *
 * GA_SERVICE_ACCOUNT_JSON holds the service account's key file: the JSON
 * itself, or the same JSON base64-encoded (easier to paste into Vercel).
 * Each school's GA property must give that account's email Viewer access.
 * No extra packages: the sign-in token is made with Node's own crypto.
 */

type ServiceAccount = { client_email: string; private_key: string; token_uri?: string }

let parsed: ServiceAccount | null | undefined

export function serviceAccount(): ServiceAccount | null {
  if (parsed !== undefined) return parsed
  const raw = (process.env.GA_SERVICE_ACCOUNT_JSON ?? '').trim()
  parsed = null
  if (!raw) return parsed
  try {
    const text = raw.startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf8')
    const json = JSON.parse(text)
    if (json?.client_email && json?.private_key) {
      parsed = { client_email: json.client_email, private_key: String(json.private_key).replace(/\\n/g, '\n'), token_uri: json.token_uri }
    }
  } catch {
    console.error('[analytics] GA_SERVICE_ACCOUNT_JSON is not valid JSON (or base64 JSON).')
  }
  return parsed
}

/** The email schools add as a Viewer in Google Analytics, or null when no key is set. */
export const serviceAccountEmail = () => serviceAccount()?.client_email ?? null

let token: { value: string; expires: number } | null = null

const b64url = (v: string | Buffer) => Buffer.from(v).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_')

async function accessToken(): Promise<string> {
  const sa = serviceAccount()
  if (!sa) throw new GAError('not-configured', 'Google Analytics is not connected yet.')
  if (token && token.expires > Date.now() + 60_000) return token.value
  const now = Math.floor(Date.now() / 1000)
  const aud = sa.token_uri || 'https://oauth2.googleapis.com/token'
  const head = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const claims = b64url(
    JSON.stringify({ iss: sa.client_email, scope: 'https://www.googleapis.com/auth/analytics.readonly', aud, iat: now, exp: now + 3600 }),
  )
  const signer = createSign('RSA-SHA256')
  signer.update(`${head}.${claims}`)
  const jwt = `${head}.${claims}.${b64url(signer.sign(sa.private_key))}`
  const res = await fetch(aud, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }),
    cache: 'no-store',
  })
  const data: any = await res.json().catch(() => ({}))
  if (!res.ok || !data.access_token) {
    throw new GAError('auth', `Google refused the Banner 61 service account (${data.error_description || data.error || res.status}).`)
  }
  token = { value: data.access_token, expires: Date.now() + (Number(data.expires_in) || 3600) * 1000 }
  return token.value
}

export class GAError extends Error {
  constructor(
    public kind: 'not-configured' | 'auth' | 'no-access' | 'bad-property' | 'other',
    message: string,
  ) {
    super(message)
  }
}

export type GARow = { dimensionValues?: { value: string }[]; metricValues?: { value: string }[] }
export type GAReport = { rows?: GARow[]; rowCount?: number }

/** Runs several reports for one property in a single call (up to 5). */
export async function batchRunReports(propertyId: string, requests: object[]): Promise<GAReport[]> {
  const id = String(propertyId).replace(/^properties\//, '').trim()
  if (!/^\d+$/.test(id)) throw new GAError('bad-property', 'The Google Analytics property ID should be a number, like 412345678.')
  const res = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${id}:batchRunReports`, {
    method: 'POST',
    headers: { authorization: `Bearer ${await accessToken()}`, 'content-type': 'application/json' },
    body: JSON.stringify({ requests }),
    cache: 'no-store',
  })
  const data: any = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = data?.error?.message || `Google Analytics answered ${res.status}.`
    if (res.status === 403) throw new GAError('no-access', msg)
    if (res.status === 400 || res.status === 404) throw new GAError('bad-property', msg)
    throw new GAError('other', msg)
  }
  return data.reports ?? []
}
