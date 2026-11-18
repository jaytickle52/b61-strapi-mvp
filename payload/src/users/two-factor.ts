import type { Config, Endpoint, PayloadHandler, Plugin } from 'payload'
import { payloadTotp } from 'payload-totp'

/*
 * Two-factor sign-in (authenticator app codes) for the editor.
 *
 * The community plugin payload-totp (GeorgeHulpoi/payload-totp) does the hard
 * parts: the setup page with the QR code, the "enter your code" page after
 * sign-in, the code check with lockout after too many wrong codes, and the
 * cookie that marks a session as verified (`_strategy: 'totp'`).
 *
 * What Banner 61 decided (17 Nov 2026), and what this file adds on top:
 * - Banner 61 admins must set it up (on the live site; see adminTwoFactorRequired).
 *   They're sent to the setup page until they have.
 * - School staff may turn it on (Account > Authenticator app); nobody forces them.
 * - Once someone has it on, a session that signed in with a password but hasn't
 *   entered a code can't do anything: every collection and global refuses it,
 *   and every custom endpoint sees it as signed out.
 * - Visitors (not signed in) are untouched: the plugin's own access wrapper
 *   refuses anonymous requests, which would take the public sites down, so we
 *   wrap access ourselves and let anonymous requests through to the normal rules.
 * - MCP keys and API keys don't need a code (they aren't passwords).
 * - A Banner 61 admin can reset someone's two-factor (lost phone):
 *   POST /api/users/:id/reset-two-factor, the "Two-factor sign-in" box on a
 *   user's account page.
 */

/** Strategies that don't need a code: a verified session, or a key. */
const NO_CODE_NEEDED = new Set(['totp', 'api-key', 'mcp-api-key'])

/**
 * Banner 61 admins must use two-factor on the live site. B61_REQUIRE_ADMIN_2FA
 * overrides it either way ('true' anywhere, e.g. the CI two-factor test;
 * 'false' to switch it off in an emergency). Previews, CI and local copies don't
 * require it, so tests and the restore test can sign in with a password.
 */
export function adminTwoFactorRequired(): boolean {
  const flag = (process.env.B61_REQUIRE_ADMIN_2FA || '').trim().toLowerCase()
  if (flag === 'true') return true
  if (flag === 'false') return false
  return process.env.VERCEL_ENV === 'production'
}

/**
 * True when this signed-in user still owes a code: they have two-factor on (or
 * must have it, as a Banner 61 admin) and this session hasn't entered one.
 */
export function twoFactorPending(user: any): boolean {
  if (!user || user.collection !== 'users') return false
  if (NO_CODE_NEEDED.has(user._strategy)) return false
  if (user.hasTotp) return true
  return user.role === 'admin' && adminTwoFactorRequired()
}

const COLLECTION_OPS = ['create', 'read', 'readVersions', 'update', 'delete', 'unlock'] as const
const GLOBAL_OPS = ['read', 'readVersions', 'update'] as const
const signedIn = ({ req }: any) => Boolean(req.user)

/**
 * Anonymous: the normal rule. Signed in and owing a code: refused, except
 * reading their own account (the setup and code pages need it) and their
 * schools (the editor's school picker). Otherwise the normal rule.
 */
function guard(inner: ((args: any) => any) | undefined, opts: { ownDoc?: boolean; open?: boolean } = {}) {
  const rule = inner ?? signedIn
  return async (args: any) => {
    const user = args.req?.user
    if (!user || !twoFactorPending(user) || opts.open) return rule(args)
    if (!opts.ownDoc) return false
    const result = await rule(args)
    if (!result) return false
    const own = { id: { equals: user.id } }
    return result === true ? own : { and: [result, own] }
  }
}

/** Custom endpoints read req.user directly; a session owing a code counts as signed out there. */
function guardEndpoint(endpoint: Endpoint): Endpoint {
  const handler: PayloadHandler = async (req) => {
    if (req.user && twoFactorPending(req.user)) (req as any).user = null
    return endpoint.handler(req)
  }
  return { ...endpoint, handler }
}

/** Runs before payloadTotp, on everything registered so far. */
const guardEverything: Plugin = (config: Config): Config => ({
  ...config,
  endpoints: (config.endpoints || []).map(guardEndpoint),
  collections: (config.collections || []).map((c) => {
    const access: Record<string, any> = { ...(c.access || {}) }
    for (const op of COLLECTION_OPS) access[op] = guard(access[op], {
        ownDoc: c.slug === 'users' && op === 'read',
        // The editor's school picker reads the account's schools on every page,
        // the code and setup pages included. Names only; nothing else opens.
        open: c.slug === 'schools' && op === 'read',
      })
    return {
      ...c,
      access,
      endpoints: Array.isArray(c.endpoints) ? c.endpoints.map(guardEndpoint) : c.endpoints,
      // Tell payload-totp these are already handled, so it doesn't add its own wrapper.
      custom: {
        ...(c.custom || {}),
        totp: { ...(c.custom?.totp || {}), disableAccessWrapper: Object.fromEntries(COLLECTION_OPS.map((op) => [op, true])) },
      },
    }
  }),
  globals: (config.globals || []).map((g) => {
    const access: Record<string, any> = { ...(g.access || {}) }
    for (const op of GLOBAL_OPS) access[op] = guard(access[op])
    return {
      ...g,
      access,
      endpoints: Array.isArray(g.endpoints) ? g.endpoints.map(guardEndpoint) : g.endpoints,
      custom: {
        ...(g.custom || {}),
        totp: { ...(g.custom?.totp || {}), disableAccessWrapper: Object.fromEntries(GLOBAL_OPS.map((op) => [op, true])) },
      },
    }
  }),
})

/**
 * Puts the two-factor providers first (outermost) in admin.components.providers:
 * payload-totp's (sends a session owing a code to the code page) and ours (sends
 * Banner 61 admins without two-factor to the setup page). Outermost, they redirect
 * before other providers (the school picker etc.) read data the session isn't
 * allowed yet, which would otherwise end in an error page.
 */
const providersFirst: Plugin = (config: Config): Config => {
  const providers = config.admin?.components?.providers || []
  const isTotp = (p: any) => (typeof p === 'string' ? p : p?.path)?.startsWith('payload-totp/')
  return {
    ...config,
    admin: {
      ...config.admin,
      components: {
        ...config.admin?.components,
        providers: [...providers.filter(isTotp), '@/users/TwoFactorRequired#TwoFactorRequired', ...providers.filter((p) => !isTotp(p))],
      },
    },
  }
}

/** Last in the plugins list: payloadTotp has to see every collection. */
export const twoFactor: Plugin[] = [
  guardEverything,
  payloadTotp({
    collection: 'users',
    // School staff choose; Banner 61 admins are required by guardEverything + TwoFactorRequired.
    forceSetup: false,
    forceWhiteBackgroundOnQrCode: true,
    totp: { issuer: 'Banner 61' },
  }),
  providersFirst,
]
