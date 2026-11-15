/**
 * Where school staff go for help. Both optional, set in Vercel:
 *   B61_SUPPORT_EMAIL  e.g. support@banner61.com
 *   B61_HELP_URL       the staff help guides (Thread H), once written
 */
export function support() {
  const email = (process.env.B61_SUPPORT_EMAIL ?? '').trim()
  const url = (process.env.B61_HELP_URL ?? '').trim()
  return {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null,
    url: /^https?:\/\//.test(url) ? url : null,
  }
}
