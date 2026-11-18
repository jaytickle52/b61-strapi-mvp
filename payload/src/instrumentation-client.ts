import * as Sentry from '@sentry/nextjs'
import { sentryOptions } from './ops/sentry-options'

// Browser error tracking for the public sites and the editor (off without
// NEXT_PUBLIC_SENTRY_DSN). No session replay.
const options = sentryOptions()
if (options.enabled) Sentry.init(options)

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
