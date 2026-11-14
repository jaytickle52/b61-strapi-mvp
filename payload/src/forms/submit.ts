import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import type { Payload } from 'payload'
import { secret } from '../lib/secrets'
import { ANSWER_TYPES, MAX_UPLOAD_BYTES, isVisible, type Answers, type FormQuestion } from './logic'

/*
 * Checks and saves one form submission from the website.
 * Used by /next/form (src/app/(frontend)/next/form/route.ts).
 *
 * Spam protection (the Form Builder plugin has none):
 *  1. a hidden "website" box people never see; bots fill it in;
 *  2. a signed time stamp: sent in under 3 seconds, or from a page older
 *     than a week, is refused;
 *  3. Cloudflare Turnstile, when TURNSTILE_SECRET_KEY and
 *     NEXT_PUBLIC_TURNSTILE_SITE_KEY are set.
 */

export { HONEYPOT } from './constants'
import { HONEYPOT } from './constants'
const MIN_MS = 3000
const MAX_MS = 7 * 864e5
const DEFAULT_TYPES = [
  'application/pdf',
  'image/*',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

const sign = (v: string) =>
  createHmac('sha256', secret('FORM_SECRET')).update(v).digest('hex').slice(0, 32)

/** The time stamp a form carries, signed so it can't be faked. */
export function formStamp(formId: number | string) {
  const t = String(Date.now())
  return `${t}.${sign(`${formId}.${t}`)}`
}

function stampOk(formId: number | string, stamp: string): 'ok' | 'fast' | 'stale' | 'bad' {
  const [t, sig] = String(stamp ?? '').split('.')
  if (!t || !sig) return 'bad'
  const want = sign(`${formId}.${t}`)
  if (want.length !== sig.length || !timingSafeEqual(Buffer.from(want), Buffer.from(sig)))
    return 'bad'
  const age = Date.now() - Number(t)
  if (age < MIN_MS) return 'fast'
  if (age > MAX_MS) return 'stale'
  return 'ok'
}

async function turnstileOk(token: string, ip?: string | null) {
  const key = process.env.TURNSTILE_SECRET_KEY
  if (!key) return true
  if (!token) return false
  const body = new URLSearchParams({ secret: key, response: token })
  if (ip) body.set('remoteip', ip)
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
    })
    return Boolean((await res.json())?.success)
  } catch {
    // If Cloudflare is down, let the other checks decide rather than lose an inquiry.
    return true
  }
}

const mimeAllowed = (type: string, allowed: string[]) =>
  allowed.some((a) => (a.endsWith('/*') ? type.startsWith(a.slice(0, -1)) : type === a))

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

export type SubmitResult =
  | { ok: true; silent?: boolean; id?: number | string }
  | { ok: false; status: number; message: string; errors?: Record<string, string> }

export async function submitForm(
  payload: Payload,
  input: FormData,
  ctx: { school: number | null; ip?: string | null },
): Promise<SubmitResult> {
  const formId = Number(input.get('form'))
  if (!formId) return { ok: false, status: 400, message: 'This form is missing its id.' }

  // 1. Bots fill in the hidden box: pretend it worked, save nothing.
  if (String(input.get(HONEYPOT) ?? '').trim()) return { ok: true, silent: true }

  const form: any = await payload
    .findByID({ collection: 'forms', id: formId, depth: 0, overrideAccess: true })
    .catch(() => null)
  const formSchool = form?.school && typeof form.school === 'object' ? form.school.id : form?.school
  if (!form || (ctx.school != null && formSchool !== ctx.school))
    return { ok: false, status: 404, message: 'This form is no longer available.' }

  // 2. Time stamp.
  const stamp = stampOk(formId, String(input.get('b61_t') ?? ''))
  if (stamp === 'fast')
    return {
      ok: false,
      status: 429,
      message: 'That was very quick. Please check your answers and send again.',
    }
  if (stamp !== 'ok')
    return {
      ok: false,
      status: 400,
      message: 'This page is out of date. Please reload it and send the form again.',
    }

  // 3. Turnstile.
  if (!(await turnstileOk(String(input.get('cf-turnstile-response') ?? ''), ctx.ip)))
    return {
      ok: false,
      status: 400,
      message: 'Please confirm you are not a robot, then send again.',
    }

  const questions: FormQuestion[] = (form.fields ?? []).filter((q: FormQuestion) => q?.name)
  const answers: Answers = {}
  for (const q of questions) {
    if (!ANSWER_TYPES.has(q.blockType)) continue
    const raw = input.get(q.name!)
    answers[q.name!] = q.blockType === 'checkbox' ? (raw ? 'Yes' : 'No') : String(raw ?? '').trim()
  }

  const errors: Record<string, string> = {}
  const submissionData: { field: string; value: string }[] = []
  const uploads: { q: FormQuestion; files: File[] }[] = []
  const signatures: { q: FormQuestion; png?: Buffer; typed?: string }[] = []
  let totalBytes = 0

  for (const q of questions) {
    const name = q.name!
    const label = q.label || name
    if (!isVisible(q, questions, answers)) continue

    if (ANSWER_TYPES.has(q.blockType)) {
      let v = answers[name]
      const max = q.blockType === 'textarea' ? 10000 : 500
      if (v.length > max) v = v.slice(0, max)
      const empty = v === '' || (q.blockType === 'checkbox' && v === 'No')
      if (q.required && empty) {
        errors[name] =
          q.blockType === 'checkbox' ? `Please tick "${label}".` : `Please fill in ${label}.`
        continue
      }
      if (!empty) {
        if (q.blockType === 'email' && !EMAIL.test(v))
          errors[name] = 'Please enter an email address like name@example.com.'
        if (q.blockType === 'phone' && !/^[0-9+().\-\s]{7,25}(\s*(x|ext\.?)\s*\d{1,6})?$/i.test(v))
          errors[name] = 'Please enter a phone number.'
        if (q.blockType === 'number' && !Number.isFinite(Number(v)))
          errors[name] = 'Please enter a number.'
        if (q.blockType === 'date' && Number.isNaN(Date.parse(v)))
          errors[name] = 'Please enter a date.'
        if (
          (q.blockType === 'select' || q.blockType === 'radio') &&
          q.options?.length &&
          !q.options.some((o) => o.value === v)
        )
          errors[name] = 'Please pick one of the choices.'
      }
      if (v !== '') submissionData.push({ field: name, value: v })
      continue
    }

    if (q.blockType === 'upload') {
      const files = input
        .getAll(name)
        .filter(
          (f): f is File =>
            typeof f === 'object' && f !== null && 'arrayBuffer' in f && (f as File).size > 0,
        )
      if (!files.length) {
        if (q.required) errors[name] = `Please attach ${label}.`
        continue
      }
      if (files.length > 1 && !q.multiple) {
        errors[name] = 'Please attach one file.'
        continue
      }
      const allowed = ((q.mimeTypes as any[]) ?? []).map((m) => m?.mimeType).filter(Boolean)
      const limit = Math.min(Number(q.maxFileSize) || MAX_UPLOAD_BYTES, MAX_UPLOAD_BYTES)
      for (const f of files) {
        totalBytes += f.size
        if (!mimeAllowed(f.type, allowed.length ? allowed : DEFAULT_TYPES))
          errors[name] = `${f.name}: that kind of file can't be sent here.`
        else if (f.size > limit)
          errors[name] = `${f.name} is too big. The limit is ${(limit / 1048576).toFixed(0)} MB.`
      }
      uploads.push({ q, files })
      continue
    }

    if (q.blockType === 'signature') {
      const typed = String(input.get(`${name}__typed`) ?? '')
        .trim()
        .slice(0, 120)
      const drawn = String(input.get(name) ?? '')
      if (typed) signatures.push({ q, typed })
      else if (drawn.startsWith('data:image/png;base64,')) {
        const png = Buffer.from(drawn.slice('data:image/png;base64,'.length), 'base64')
        if (png.length > 400_000)
          errors[name] = 'That signature is too large. Please clear it and sign again.'
        else signatures.push({ q, png })
      } else if (q.required) errors[name] = 'Please sign, or type your full name to sign.'
    }
  }

  if (totalBytes > MAX_UPLOAD_BYTES) {
    const first = uploads[0]?.q.name
    if (first) errors[first] = 'The files together are over 4 MB. Please send smaller files.'
  }
  if (Object.keys(errors).length)
    return { ok: false, status: 422, message: 'Please check the highlighted answers.', errors }

  // Save files under long random names (Blob URLs are public), then the submission.
  const school = formSchool ?? ctx.school
  const created: number[] = []
  const saveFile = async (name: string, mimetype: string, data: Buffer) => {
    const safe = name.replace(/[^\w.\-]+/g, '-').slice(-80) || 'file'
    const doc = await payload.create({
      collection: 'form-uploads',
      data: { school } as any,
      file: {
        name: `${randomBytes(12).toString('hex')}-${safe}`,
        data,
        mimetype,
        size: data.length,
      },
      overrideAccess: true,
    })
    created.push(doc.id as number)
    return doc.id
  }

  try {
    const files: { field: string; id: number }[] = []
    for (const { q, files: list } of uploads) {
      for (const f of list)
        files.push({
          field: q.name!,
          id: (await saveFile(f.name, f.type, Buffer.from(await f.arrayBuffer()))) as number,
        })
    }
    for (const s of signatures) {
      if (s.typed) submissionData.push({ field: s.q.name!, value: `Signed by typing: ${s.typed}` })
      else if (s.png) {
        const id = await saveFile(`signature-${s.q.name}.png`, 'image/png', s.png)
        files.push({ field: s.q.name!, id: id as number })
        submissionData.push({ field: s.q.name!, value: 'Signed (drawing attached)' })
      }
    }

    const doc = await payload.create({
      collection: 'form-submissions',
      data: { form: formId, school, submissionData } as any,
      overrideAccess: true,
      context: { b61Files: files },
    })
    return { ok: true, id: doc.id }
  } catch (err: any) {
    for (const id of created)
      await payload.delete({ collection: 'form-uploads', id, overrideAccess: true }).catch(() => {})
    payload.logger.error({ err, msg: `Form ${formId}: submission not saved` })
    return {
      ok: false,
      status: 500,
      message: 'Sorry, something went wrong and your answers were not sent. Please try again.',
    }
  }
}
