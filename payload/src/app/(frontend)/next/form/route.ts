import { headers } from 'next/headers'
import { currentSchool, payloadClient } from '@/lib/data'
import { submitForm } from '@/forms/submit'

/**
 * Where every website form posts. Checks spam and answers, saves the
 * submission (which sends the form's emails) and answers in JSON.
 * Without JavaScript the browser posts here directly; it's then sent back
 * to the page (or the form's thank-you page).
 */
export async function POST(req: Request) {
  const wantsHtml = !(req.headers.get('accept') ?? '').includes('application/json')
  let input: FormData
  try {
    input = await req.formData()
  } catch {
    return Response.json(
      {
        ok: false,
        message: 'Your answers could not be read. The files may be too large (4 MB at most).',
      },
      { status: 413 },
    )
  }
  const payload = await payloadClient()
  const school = await currentSchool()
  const h = await headers()
  const ip = (h.get('x-forwarded-for') ?? '').split(',')[0].trim() || null
  const result = await submitForm(payload, input, { school: school?.id ?? null, ip })

  if (wantsHtml) {
    if (result.ok) {
      // Only back to this site (never an address someone slipped into the form).
      const here = new URL(req.url)
      const pick = [String(input.get('b61_done') || ''), req.headers.get('referer') || '', '/']
        .map((u) => {
          try {
            return u ? new URL(u, here) : null
          } catch {
            return null
          }
        })
        .find((u) => u && u.origin === here.origin)!
      return Response.redirect(pick, 303)
    }
    const list = Object.values(result.errors ?? {})
      .map((e) => `<li>${e.replace(/</g, '&lt;')}</li>`)
      .join('')
    return new Response(
      `<!doctype html><meta charset="utf-8"><title>Please check your answers</title><body style="font:16px/1.6 system-ui;max-width:640px;margin:48px auto;padding:0 20px"><h1>Please check your answers</h1><p>${result.message}</p><ul>${list}</ul><p><a href="javascript:history.back()">Go back to the form</a></p>`,
      { status: result.status, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
    )
  }
  if (result.ok) return Response.json({ ok: true })
  return Response.json(
    { ok: false, message: result.message, errors: result.errors },
    { status: result.status },
  )
}
