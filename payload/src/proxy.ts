import { NextResponse, type NextRequest } from 'next/server'

/*
 * Runs before every public page (and, for one header, the editor). No database work here; the school lookup
 * stays in the page, where it's cached.
 *
 * 1. Passes the page's address (path + query) on to the server, so a school's
 *    second domain (www, an old domain) can be sent to its main domain with a
 *    permanent redirect (src/seo/domains.ts).
 * 2. For ordinary visitors, swaps Next.js's "no-store" for "private, no-cache":
 *    still never kept by a shared cache and always checked with the server, but
 *    the browser may keep the page for Back / Forward (Lighthouse: bfcache).
 *    Signed-in staff, previews and the parents area keep "no-store".
 */
export function proxy(request: NextRequest) {
  // The editor: only pass its path on, for the two-factor pages (payload-totp
  // and src/users/TwoFactorRequired.tsx read it). Nothing else changes there.
  if (request.nextUrl.pathname === '/admin' || request.nextUrl.pathname.startsWith('/admin/')) {
    const adminHeaders = new Headers(request.headers)
    adminHeaders.set('x-pathname', request.nextUrl.pathname)
    return NextResponse.next({ request: { headers: adminHeaders } })
  }
  const headers = new Headers(request.headers)
  headers.set('x-b61-path', request.nextUrl.pathname + request.nextUrl.search)
  const res = NextResponse.next({ request: { headers } })
  const staff = request.cookies.has('payload-token') || request.cookies.has('__prerender_bypass')
  const parents = request.nextUrl.pathname === '/parents' || request.nextUrl.pathname.startsWith('/parents/')
  if (request.method === 'GET' && !staff && !parents) res.headers.set('Cache-Control', 'private, no-cache, max-age=0, must-revalidate')
  return res
}

export const config = {
  // Public pages, plus the editor's pages (path header only, see above). Not the
  // API, Next.js files or files with an extension in /public.
  matcher: ['/admin', '/admin/:path*', '/((?!admin(?:/|$)|api/|_next/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|txt|xml|ics|woff2?)$).*)'],
}
