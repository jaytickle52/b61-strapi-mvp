/**
 * Cache labels for the public site (Thread H).
 *
 * Every visitor read in src/lib/data.ts is cached and labelled with its
 * school. When staff change anything a school's site shows, src/cache/plugin.ts
 * clears that school's label, so the next visitor gets fresh content.
 */
export const SCHOOLS_TAG = 'schools'
export const schoolTag = (id: number | string) => `school-${id}`

/**
 * Part of every cache key. Each deploy gets its own cache, so a new build
 * (new fields, a re-seeded demo) never reads what an older build stored, and a
 * preview (its own database copy) never shares entries with the live site.
 */
export const CACHE_VERSION = process.env.VERCEL_DEPLOYMENT_ID || process.env.VERCEL_GIT_COMMIT_SHA || 'local'

/** Cached entries refresh on their own after an hour even if a clear was missed. */
export const CACHE_SECONDS = 3600

/** Round a time down to 15 minutes, so "now" in a query doesn't make every key unique. */
export const quarterHour = (ms = Date.now()) => new Date(Math.floor(ms / 900_000) * 900_000)
