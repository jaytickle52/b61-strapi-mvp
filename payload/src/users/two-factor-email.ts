import type { Payload } from 'payload'
import escapeHTML from 'escape-html'
import { brandedEmail, schoolSender } from '../email/school'

/**
 * Tells the account owner that two-factor sign-in was turned on or reset, so a
 * change they didn't make doesn't go unnoticed. Sent from their first school's
 * sender (or Banner 61's). Without a Resend key it only lands in the Email log.
 */
export async function notifyTwoFactorChange(payload: Payload, user: any, change: 'on' | 'reset') {
  if (!user?.email) return
  const school = Array.isArray(user.tenants) ? user.tenants[0]?.tenant : null
  const sender = await schoolSender(payload, school)
  const when = new Date().toLocaleString('en-US', { timeZone: process.env.SCHOOL_TIMEZONE || 'America/New_York', dateStyle: 'medium', timeStyle: 'short' })
  const subject = change === 'on' ? 'Two-factor sign-in is on for your account' : 'Two-factor sign-in was reset on your account'
  const what =
    change === 'on'
      ? 'Two-factor sign-in was turned on for your website editor account. From now on, signing in asks for a code from your authenticator app after your password.'
      : 'A Banner 61 admin turned off two-factor sign-in on your website editor account (for example, after a lost phone). Sign in with your password and set it up again.'
  const body = `<h1 style="font:700 22px/1.3 Georgia,serif;margin:16px 0">${escapeHTML(subject)}</h1>
<p>${escapeHTML(what)}</p>
<p style="color:#555;font-size:14px">${escapeHTML(user.email)} · ${escapeHTML(when)}</p>
<p><strong>Didn't do this?</strong> Reply to this email or contact Banner 61 right away${process.env.B61_SUPPORT_EMAIL ? ` (${escapeHTML(process.env.B61_SUPPORT_EMAIL)})` : ''}.</p>`
  await payload.sendEmail({
    to: user.email,
    from: sender.from,
    replyTo: process.env.B61_SUPPORT_EMAIL || sender.replyTo,
    subject,
    html: brandedEmail(sender, body),
    b61: { school: sender.school, kind: 'security' },
  } as any)
}
