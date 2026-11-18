import * as Sentry from '@sentry/nextjs'
import { sentryOptions } from './ops/sentry-options'

// Server and edge error tracking (off without NEXT_PUBLIC_SENTRY_DSN).
export async function register() {
  const options = sentryOptions()
  if (!options.enabled) return
  Sentry.init(options)
}

// Errors thrown while rendering a page or running a route.
export const onRequestError = Sentry.captureRequestError
