import { createHmac } from 'node:crypto'

/**
 * One secret per school, same scheme as the Strapi build: set SCHOOL_SECRET and
 * every other secret is derived from it. Any variable set explicitly still wins.
 */
export function secret(name: string): string {
  const explicit = process.env[name]
  if (explicit) return explicit
  const master = process.env.SCHOOL_SECRET
  if (!master) {
    // Lets `next build` run without secrets; a running server always needs one.
    if (process.env.NEXT_PHASE === 'phase-production-build') return 'build-time-placeholder'
    throw new Error(`Set SCHOOL_SECRET (or ${name}) before starting the site.`)
  }
  return createHmac('sha256', master).update(`b61:${name}`).digest('hex')
}
