import type { Endpoint } from 'payload'
import { isB61Admin } from '../access'
import { notifyTwoFactorChange } from './two-factor-email'

/**
 * POST /api/users/:id/reset-two-factor
 * A Banner 61 admin turns off someone else's two-factor sign-in, for a lost or
 * replaced phone. They sign in with their password next time and can set it
 * up again (Banner 61 admins are sent straight to the setup page). Their
 * existing sessions end, and they get an email saying it happened.
 * Not for your own account: another Banner 61 admin has to do it (see
 * docs/TWO-FACTOR.md for the last-admin case).
 */
export const resetTwoFactorEndpoint: Endpoint = {
  path: '/:id/reset-two-factor',
  method: 'post',
  handler: async (req) => {
    const me = req.user as any
    if (!me || !isB61Admin(me)) return Response.json({ ok: false, message: 'Only Banner 61 admins can do this.' }, { status: 403 })
    const id = req.routeParams?.id as string | undefined
    if (!id) return Response.json({ ok: false, message: 'Which account?' }, { status: 400 })
    if (String(id) === String(me.id))
      return Response.json({ ok: false, message: "You can't reset your own. Ask another Banner 61 admin." }, { status: 400 })
    const target = await req.payload.findByID({ collection: 'users', id, depth: 0, overrideAccess: true, disableErrors: true })
    if (!target) return Response.json({ ok: false, message: 'Account not found.' }, { status: 404 })
    // Also signs them out everywhere, so a session that already passed the code ends too.
    await req.payload.update({ collection: 'users', id, data: { totpSecret: null, sessions: [] } as any, overrideAccess: true, req })
    // The plugin's count of wrong codes for this account (one row per user, keyed by id).
    await req.payload.db
      .deleteOne({ collection: 'totp-attempts' as any, where: { id: { equals: id } }, req })
      .catch(() => undefined)
    req.payload.logger.info(`[b61] Two-factor reset for user ${id} by ${me.id}`)
    await notifyTwoFactorChange(req.payload, target, 'reset').catch(() => undefined)
    return Response.json({ ok: true, message: `Two-factor sign-in is off for ${target.email}. They can set it up again after signing in.` })
  },
}
