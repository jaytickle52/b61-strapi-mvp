import type { Endpoint, PayloadRequest } from 'payload'
import crypto from 'crypto'
import escapeHTML from 'escape-html'
import { canManagePeopleAt, idOf, isB61Admin, MANAGERS, SCHOOL_ROLES, schoolsWith, type SchoolRole } from '../access'
import { brandedEmail, schoolSender, siteOrigin } from '../email/school'

/*
 * Inviting people.
 *
 * POST /api/users/invite  { email, name?, school, role }
 *   A School Admin (or Banner 61) adds someone to a school. A new person gets
 *   an account and an email with a link to choose their password (good for
 *   7 days). Someone who already has an account gets the school added and a
 *   "you now have access" email.
 *
 * POST /api/users/:id/resend-invite
 *   Sends a fresh invite link to someone who hasn't signed in yet.
 */

const INVITE_DAYS = 7
const INVITE_MS = INVITE_DAYS * 24 * 60 * 60 * 1000

const ROLE_NAMES: Record<SchoolRole, string> = {
  schoolAdmin: 'School Admin',
  editor: 'Editor',
  contributor: 'Contributor',
}

const ROLE_WHAT: Record<SchoolRole, string> = {
  schoolAdmin: 'edit and publish the website and invite other staff',
  editor: 'edit and publish the website',
  contributor: 'write drafts for the website (someone else publishes them)',
}

const isEmail = (v: unknown): v is string => typeof v === 'string' && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)

const answer = (ok: boolean, message: string, status = ok ? 200 : 400, extra: object = {}) =>
  Response.json({ ok, message, ...extra }, { status })

const origin = (req: PayloadRequest) =>
  (
    siteOrigin() ||
    req.headers?.get?.('origin') ||
    (req.headers?.get?.('host') ? `https://${req.headers.get('host')}` : '')
  ).replace(/\/$/, '')

const button = (href: string, label: string, color: string) =>
  `<p style="margin:28px 0"><a href="${escapeHTML(href)}" style="background:${color};color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:999px;font-weight:600;display:inline-block">${label}</a></p>`

/** Makes a set-password link for an account, good for INVITE_DAYS. */
async function inviteLink(req: PayloadRequest, email: string) {
  const token = await req.payload.forgotPassword({
    collection: 'users',
    data: { email },
    disableEmail: true,
    expiration: INVITE_MS,
    req,
  })
  return `${origin(req)}/admin/reset/${token}`
}

async function sendInviteEmail(
  req: PayloadRequest,
  opts: { to: string; school: unknown; role: SchoolRole; link: string; existing: boolean },
) {
  const sender = await schoolSender(req.payload, opts.school)
  const actor = req.user as any
  const who = escapeHTML(actor?.name || actor?.email || sender.schoolName)
  const school = escapeHTML(sender.schoolName)
  const role = ROLE_NAMES[opts.role]
  const subject = opts.existing
    ? `You now have access to the ${sender.schoolName} website`
    : `You're invited to edit the ${sender.schoolName} website`
  const body = opts.existing
    ? `<h1 style="font:700 22px/1.3 Georgia,serif;margin:16px 0">You now have access to ${school}</h1>
<p>${who} added you to the ${school} website as a <strong>${role}</strong>, so you can ${ROLE_WHAT[opts.role]}.</p>
<p>Sign in with your usual email and password, then pick ${school} from the School menu.</p>
${button(opts.link, 'Sign in', sender.color)}`
    : `<h1 style="font:700 22px/1.3 Georgia,serif;margin:16px 0">You're invited</h1>
<p>${who} invited you to help with the ${school} website as a <strong>${role}</strong>, so you can ${ROLE_WHAT[opts.role]}.</p>
<p>Choose a password to finish setting up your account. You'll sign in with <strong>${escapeHTML(opts.to)}</strong>.</p>
${button(opts.link, 'Choose your password', sender.color)}
<p style="color:#555;font-size:14px">The link works for ${INVITE_DAYS} days. If it runs out, ask ${who} to send a new one. If you weren't expecting this, you can ignore it.</p>`
  await req.payload.sendEmail({
    to: opts.to,
    from: sender.from,
    replyTo: actor?.email || sender.replyTo,
    subject,
    html: brandedEmail(sender, body),
    b61: { school: sender.school, kind: 'invite' },
  } as any)
  return Boolean(process.env.RESEND_API_KEY)
}

const sentMessage = (emailOn: boolean, email: string, what: string) =>
  emailOn
    ? `${what} We emailed ${email}.`
    : `${what} Email isn't switched on yet (no Resend key), so nothing was sent; the email is in the Email log.`

export const inviteEndpoint: Endpoint = {
  path: '/invite',
  method: 'post',
  handler: async (req) => {
    const actor = req.user as any
    if (!actor) return answer(false, 'Sign in first.', 401)
    const body = ((await req.json?.().catch(() => ({}))) ?? {}) as any
    const email = String(body.email ?? '').trim().toLowerCase()
    const name = typeof body.name === 'string' ? body.name.trim().slice(0, 120) : ''
    const school = idOf(body.school)
    const role = body.role as SchoolRole
    if (!isEmail(email)) return answer(false, 'Type a full email address.')
    if (school == null) return answer(false, 'Choose a school.')
    if (!SCHOOL_ROLES.some((r) => r.value === role)) return answer(false, 'Choose a role.')
    if (!canManagePeopleAt(actor, school))
      return answer(false, 'You can only invite people to schools where you are a School Admin.', 403)

    const found = await req.payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
      req,
    })
    const existing: any = found.docs[0]

    try {
      if (existing) {
        if (existing.role === 'admin')
          return answer(false, `${email} is a Banner 61 admin and already sees every school.`, 409)
        const rows: any[] = existing.tenants ?? []
        const row = rows.find((r) => String(idOf(r?.tenant)) === String(school))
        if (row)
          return answer(
            false,
            `${email} is already at this school (${ROLE_NAMES[(row.role as SchoolRole) || 'editor']}). Open their account to change the role.`,
            409,
          )
        // Runs the same checks as any save by this person (src/collections/Users.ts).
        await req.payload.update({
          collection: 'users',
          id: existing.id,
          data: { tenants: [...rows.map((r) => ({ tenant: idOf(r.tenant), role: r.role })), { tenant: school, role }] } as any,
          overrideAccess: true,
          req,
        })
        const signedInBefore = Boolean(existing.lastSignInAt)
        const link = signedInBefore ? `${origin(req)}/admin` : await inviteLink(req, email)
        const emailOn = await sendInviteEmail(req, { to: email, school, role, link, existing: signedInBefore })
        if (!signedInBefore)
          await req.payload.db.updateOne({ collection: 'users', id: existing.id, data: { invitedAt: new Date().toISOString() }, req })
        return answer(true, sentMessage(emailOn, email, `Added ${email} to this school as ${ROLE_NAMES[role]}.`), 200, {
          id: existing.id,
        })
      }

      const created: any = await req.payload.create({
        collection: 'users',
        data: {
          email,
          name: name || undefined,
          role: 'editor',
          tenants: [{ tenant: school, role }],
          // Never used: they choose their own password from the invite link.
          password: crypto.randomBytes(32).toString('base64url'),
        } as any,
        overrideAccess: true,
        req,
      })
      await req.payload.db.updateOne({ collection: 'users', id: created.id, data: { invitedAt: new Date().toISOString() }, req })
      const link = await inviteLink(req, email)
      const emailOn = await sendInviteEmail(req, { to: email, school, role, link, existing: false })
      return answer(true, sentMessage(emailOn, email, `Invited ${email} as ${ROLE_NAMES[role]}.`), 200, { id: created.id })
    } catch (err: any) {
      return answer(false, err?.message ?? 'Something went wrong.', err?.status ?? 500)
    }
  },
}

export const resendInviteEndpoint: Endpoint = {
  path: '/:id/resend-invite',
  method: 'post',
  handler: async (req) => {
    const actor = req.user as any
    if (!actor) return answer(false, 'Sign in first.', 401)
    const id = req.routeParams?.id as string
    const target: any = await req.payload
      .findByID({ collection: 'users', id, depth: 0, overrideAccess: true, req })
      .catch(() => null)
    if (!target) return answer(false, 'That account no longer exists.', 404)
    if (target.lastSignInAt)
      return answer(false, 'They have already signed in. If they forgot their password, they can use "Forgot password" on the sign-in page.', 409)

    const rows: any[] = target.tenants ?? []
    const managed = isB61Admin(actor)
      ? rows
      : rows.filter((r) => schoolsWith(actor, MANAGERS).map(String).includes(String(idOf(r?.tenant))))
    if (!managed.length || (target.role === 'admin' && !isB61Admin(actor)))
      return answer(false, 'You can only resend invites for people at your own school.', 403)

    const row = managed[0]
    try {
      const link = await inviteLink(req, target.email)
      const emailOn = await sendInviteEmail(req, {
        to: target.email,
        school: row.tenant,
        role: (row.role as SchoolRole) || 'editor',
        link,
        existing: false,
      })
      await req.payload.db.updateOne({ collection: 'users', id: target.id, data: { invitedAt: new Date().toISOString() }, req })
      return answer(true, sentMessage(emailOn, target.email, 'New invite link made (the old one no longer works).'))
    } catch (err: any) {
      return answer(false, err?.message ?? 'Something went wrong.', err?.status ?? 500)
    }
  },
}
