import type { Endpoint } from 'payload'
import { canPublishAt } from '../access'
import { brandedEmail, schoolSender, splitAddresses } from './school'

/**
 * POST /api/school-settings/test-email  { school, to? }
 * Sends a short test email with the school's sender settings, to `to` or the
 * signed-in person. Answers with what happened, in words staff can act on.
 */
export const testEmailEndpoint: Endpoint = {
  path: '/test-email',
  method: 'post',
  handler: async (req) => {
    if (!req.user) return Response.json({ ok: false, message: 'Sign in first.' }, { status: 401 })
    const body = (await req.json?.().catch(() => ({}))) ?? {}
    const school = body.school
    if (!canPublishAt(req.user, school))
      return Response.json(
        { ok: false, message: 'You can only test your own school.' },
        { status: 403 },
      )
    const to = splitAddresses(body.to)[0] || (req.user as any).email
    const sender = await schoolSender(req.payload, school)
    const configured = Boolean(process.env.RESEND_API_KEY)
    try {
      await req.payload.sendEmail({
        to,
        from: sender.from,
        replyTo: sender.replyTo,
        subject: `Test email from ${sender.schoolName}`,
        html: brandedEmail(
          sender,
          `<h1 style="font:700 22px/1.3 Georgia,serif;margin:16px 0">It works.</h1>
<p>This is a test email from the ${sender.schoolName} website.</p>
<p style="color:#555">Sent from: ${sender.from.replace(/</g, '&lt;')}<br>Replies go to: ${sender.replyTo ?? '(the sender)'}</p>`,
        ),
        b61: { school: sender.school, kind: 'test' },
      } as any)
      return Response.json({
        ok: true,
        message: configured
          ? `Sent to ${to}. It can take a minute to arrive; check spam if it doesn't.`
          : "Email isn't switched on yet (no Resend key), so nothing was sent. The attempt is in the Email log.",
      })
    } catch (err: any) {
      return Response.json(
        { ok: false, message: `Not sent: ${err?.message ?? err}` },
        { status: 502 },
      )
    }
  },
}
