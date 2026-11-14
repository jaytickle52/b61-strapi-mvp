import type { PayloadEmailAdapter, SendEmailOptions } from 'payload'
import { resendAdapter } from '@payloadcms/email-resend'

/*
 * How the site sends email.
 *
 * - With RESEND_API_KEY set, mail goes out through Resend.
 * - Without it (local work, CI), mail is written to the server log instead,
 *   so nothing is sent by accident.
 *
 * Either way every message is recorded in the Email log (to, subject, sent or
 * failed and why), so school staff can see whether an inquiry email went out.
 *
 * EMAIL_FROM_ADDRESS / EMAIL_FROM_NAME: the platform sender, used when a
 * school hasn't set its own (School settings > Email). The address must be on
 * a domain verified in Resend.
 */

export const PLATFORM_FROM_ADDRESS = process.env.EMAIL_FROM_ADDRESS || 'no-reply@banner61.com'
export const PLATFORM_FROM_NAME = process.env.EMAIL_FROM_NAME || 'Banner 61'

/** Extra details we pass alongside a message; removed before it is sent. */
export type B61SendOptions = SendEmailOptions & { b61?: { school?: number | null; kind?: string } }

const LOG_DAYS = 90

const asText = (v: unknown): string => {
  if (!v) return ''
  if (typeof v === 'string') return v
  if (Array.isArray(v)) return v.map(asText).filter(Boolean).join(', ')
  if (typeof v === 'object' && 'address' in (v as any)) return String((v as any).address)
  return String(v)
}

export const emailAdapter: PayloadEmailAdapter = (args) => {
  const inner = process.env.RESEND_API_KEY
    ? resendAdapter({
        apiKey: process.env.RESEND_API_KEY,
        defaultFromAddress: PLATFORM_FROM_ADDRESS,
        defaultFromName: PLATFORM_FROM_NAME,
      })(args)
    : {
        name: 'log-only',
        defaultFromAddress: PLATFORM_FROM_ADDRESS,
        defaultFromName: PLATFORM_FROM_NAME,
        sendEmail: async (message: SendEmailOptions) => {
          // For local work: EMAIL_PREVIEW_DIR=/tmp/mail saves each email as an .html file to open.
          if (process.env.EMAIL_PREVIEW_DIR) {
            const { mkdir, writeFile } = await import('node:fs/promises')
            await mkdir(process.env.EMAIL_PREVIEW_DIR, { recursive: true })
            const file = `${process.env.EMAIL_PREVIEW_DIR}/${Date.now()}-${String(
              message.subject ?? 'email',
            )
              .replace(/[^\w]+/g, '-')
              .slice(0, 60)}.html`
            await writeFile(
              file,
              `<!-- to: ${asText(message.to)} | from: ${asText(message.from)} | reply-to: ${asText(message.replyTo)} -->\n${message.html ?? message.text ?? ''}`,
            )
          }
          args.payload.logger.info({
            msg: `Email not sent (no RESEND_API_KEY). To: ${asText(message.to)} · Subject: ${message.subject ?? ''}`,
          })
          return { id: 'log-only' }
        },
      }

  return {
    ...inner,
    sendEmail: async (message: B61SendOptions) => {
      const { b61, ...rest } = message
      const { payload } = args
      const entry = {
        to: asText(rest.to).slice(0, 500),
        subject: String(rest.subject ?? '').slice(0, 300),
        kind:
          b61?.kind ?? (/^Reset your password/.test(String(rest.subject)) ? 'password' : 'other'),
        school: b61?.school ?? undefined,
      }
      const log = async (status: 'sent' | 'failed' | 'logged', detail?: string) => {
        try {
          await payload.create({
            collection: 'email-log',
            data: { ...entry, status, detail: detail?.slice(0, 1000) } as any,
            overrideAccess: true,
          })
          // Keep the log small: drop entries older than LOG_DAYS.
          if (Math.random() < 0.1) {
            const cutoff = new Date(Date.now() - LOG_DAYS * 864e5).toISOString()
            await payload.delete({
              collection: 'email-log',
              where: { createdAt: { less_than: cutoff } },
              overrideAccess: true,
            })
          }
        } catch (err) {
          payload.logger.error({ err, msg: 'Could not write to the email log' })
        }
      }
      try {
        const res: any = await inner.sendEmail(rest)
        await log(
          inner.name === 'log-only' ? 'logged' : 'sent',
          res?.id ? `Resend id ${res.id}` : undefined,
        )
        return res
      } catch (err: any) {
        await log('failed', err?.message ?? String(err))
        throw err
      }
    },
  }
}
