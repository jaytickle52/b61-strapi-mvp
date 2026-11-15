import { NextResponse, type NextRequest } from 'next/server'

/*
 * Runs before every public page. Its one job: pass the page's address (path +
 * query) on to the server, so a school's second domain (www, an old domain)
 * can be sent to its main domain with a permanent redirect (src/seo/domains.ts).
 * No database work here; the school lookup stays in the page, where it's cached.
 */
export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers)
  headers.set('x-b61-path', request.nextUrl.pathname + request.nextUrl.search)
  return NextResponse.next({ request: { headers } })
}

export const config = {
  // Public pages only: not the editor, the API, Next.js files or files with an extension in /public.
  matcher: ['/((?!admin(?:/|$)|api/|_next/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|txt|xml|ics|woff2?)$).*)'],
}
