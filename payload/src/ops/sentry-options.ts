/**
 * Error tracking (Sentry). Off until NEXT_PUBLIC_SENTRY_DSN is set in Vercel;
 * without it nothing is sent and nothing changes. Shared by the server, edge
 * and browser set-ups (src/instrumentation*.ts).
 *
 * Privacy: school sites collect families' form answers, so events carry no
 * request bodies, cookies, headers, query strings or IP addresses, and a
 * signed-in user is sent as an id only (no email). No session replay.
 */
type AnyEvent = {
  request?: { data?: unknown; cookies?: unknown; headers?: unknown; query_string?: unknown; url?: string }
  user?: { id?: string | number; [k: string]: unknown }
  [k: string]: unknown
}

export const sentryDsn = () => (process.env.NEXT_PUBLIC_SENTRY_DSN || '').trim()

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
  }
}
