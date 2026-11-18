/*
 * Who owes a two-factor code (src/users/two-factor.ts). No imports, so the
 * public site's code (src/lib/data.ts) can use it without loading the plugin.
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
