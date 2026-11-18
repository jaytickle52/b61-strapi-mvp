import type { ReactNode } from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { adminTwoFactorRequired } from './two-factor'

/*
 * Admin provider: a Banner 61 admin who hasn't set up two-factor is sent to the
 * setup page (payload-totp's /admin/setup-totp) from anywhere in the editor.
 * Everything else refuses them until then anyway (src/users/two-factor.ts);
 * this just takes them to the one page that helps. src/proxy.ts passes the
 * page's path in x-pathname.
 */
export async function TwoFactorRequired({ children, payload, user }: { children: ReactNode; payload: any; user?: any }) {
  if (user?.collection === 'users' && user.role === 'admin' && !user.hasTotp && adminTwoFactorRequired()) {
    const strategy = user._strategy ?? ''
    if (!['api-key', 'mcp-api-key', 'totp'].includes(strategy)) {
      const admin = payload.config.routes.admin === '/' ? '' : payload.config.routes.admin
      const setup = `${admin}/setup-totp`
      const path = (await headers()).get('x-pathname') || ''
      if (path && path.replace(/\/$/, '') !== setup) redirect(`${setup}?back=${encodeURIComponent(path)}`)
    }
  }
  return children
}
