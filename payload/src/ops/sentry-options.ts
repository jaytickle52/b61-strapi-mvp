/**
 * Error tracking (Sentry). Off until NEXT_PUBLIC_SENTRY_DSN is set in Vercel;
 * without it nothing is sent and nothing changes. Shared by the server, edge
 * and browser set-ups (src/instrumentation*.ts).
 *
 * Privacy: school sites collect families' form answers, so events carry no
 * request bodies, cookies, headers, query strings or IP addresses, and a
 * signed-in user is sent as an id only (no email). Breadcrumbs and timing
 * spans lose their query strings; console output isn't kept. No session replay.
 */
type AnyEvent = {
  request?: { data?: unknown; cookies?: unknown; headers?: unknown; query_string?: unknown; url?: string }
  user?: { id?: string | number; [k: string]: unknown }
  [k: string]: unknown
}

export const sentryDsn = () => (process.env.NEXT_PUBLIC_SENTRY_DSN || '').trim()

const noQuery = (v: unknown) => (typeof v === 'string' ? v.split('?')[0] : v)
const URL_KEYS = ['url', 'to', 'from', 'http.url', 'url.full', 'http.target', 'http.query', 'url.query']

function scrubData(data: any) {
  if (!data || typeof data !== 'object') return
  for (const k of URL_KEYS) if (k in data) data[k] = k.endsWith('query') ? undefined : noQuery(data[k])
}

/** Drops console breadcrumbs; strips query strings from fetch/navigation ones. */
export function scrubBreadcrumb<B>(raw: B): B | null {
  const b = raw as any
  if (b?.category === 'console') return null
  if (b?.message) b.message = String(b.message).replace(/\?\S*/g, '')
  scrubData(b?.data)
  return raw
}

export function scrubEvent<E>(raw: E): E {
  const event = raw as AnyEvent
  if (event.request) {
    delete event.request.data
    delete event.request.cookies
    delete event.request.headers
    delete event.request.query_string
    if (event.request.url) event.request.url = event.request.url.split('?')[0]
  }
  if (event.user) event.user = event.user.id != null ? { id: event.user.id } : {}
  const e = event as any
  if (Array.isArray(e.breadcrumbs)) e.breadcrumbs = e.breadcrumbs.map(scrubBreadcrumb).filter(Boolean)
  if (Array.isArray(e.spans)) for (const span of e.spans) scrubData(span?.data)
  scrubData(e.contexts?.trace?.data)
  if (typeof e.transaction === 'string') e.transaction = noQuery(e.transaction)
  return raw
}

export function sentryOptions() {
  const dsn = sentryDsn()
  return {
    dsn: dsn || undefined,
    enabled: Boolean(dsn),
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.VERCEL_ENV || 'development',
    // Errors only, plus a small sample of timings (keeps within Sentry's free plan).
    tracesSampleRate: 0.05,
    sendDefaultPii: false,
    beforeSend: scrubEvent,
    beforeSendTransaction: scrubEvent,
    beforeBreadcrumb: scrubBreadcrumb,
  }
}
