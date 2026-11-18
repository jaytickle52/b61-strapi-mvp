/**
 * The database address with an explicit SSL mode.
 *
 * Neon's addresses say `sslmode=require`. The pg driver already treats that as
 * `verify-full` (check the certificate and the host name) but logs a SECURITY
 * WARNING on every start saying the meaning will change in its next major
 * version. Spelling out `verify-full` keeps today's (stricter) behaviour and
 * clears the warning. Done in code rather than in Vercel because the Neon
 * integration manages DATABASE_URL, and preview deploys get their own address
 * injected at build time, so editing the variable by hand wouldn't reach them.
 *
 * Addresses without an sslmode (local Postgres, CI) are left alone, and so is
 * `disable`, `allow` or an explicit `uselibpqcompat` choice.
 */
export function databaseUrl(raw = process.env.DATABASE_URL || ''): string {
  if (!raw) return raw
  if (/[?&]uselibpqcompat=/i.test(raw)) return raw
  return raw.replace(/([?&]sslmode=)(require|prefer|verify-ca)(?=&|$)/i, '$1verify-full')
}
