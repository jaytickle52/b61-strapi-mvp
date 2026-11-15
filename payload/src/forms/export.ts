import type { Endpoint } from 'payload'
import { canPublishAt } from '../access'

/**
 * GET /api/form-submissions/export?form=<id>
 * One form's submissions as a spreadsheet (CSV, opens in Excel and Google
 * Sheets): one row per submission, one column per question, in form order.
 */
export const exportEndpoint: Endpoint = {
  path: '/export',
  method: 'get',
  handler: async (req) => {
    if (!req.user) return new Response('Sign in first.', { status: 401 })
    const formId = Number(req.searchParams.get('form'))
    if (!formId) return new Response('Which form? Add ?form=<id>.', { status: 400 })
    const form: any = await req.payload
      .findByID({ collection: 'forms', id: formId, depth: 0, overrideAccess: true })
      .catch(() => null)
    if (!form) return new Response('Form not found.', { status: 404 })
    if (!canPublishAt(req.user, form.school))
      return new Response('Not your school.', { status: 403 })

    const subs: any[] = []
    for (let page = 1; ; page++) {
      const res = await req.payload.find({
        collection: 'form-submissions',
        where: { form: { equals: formId } },
        sort: '-createdAt',
        depth: 1,
        limit: 500,
        page,
        overrideAccess: true,
      })
      subs.push(...res.docs)
      if (!res.hasNextPage) break
    }

    // Columns: the form's questions in order, then anything older submissions had.
    const cols: { key: string; label: string }[] = []
    const seen = new Set<string>()
    const add = (key: string, label?: string) => {
      if (!key || seen.has(key) || key === 'formSubmissionID') return
      seen.add(key)
      cols.push({ key, label: label || key })
    }
    for (const f of form.fields ?? [])
      if (f?.name && f.blockType !== 'message') add(f.name, f.label)
    for (const s of subs) {
      for (const a of s.submissionData ?? []) add(a.field)
      for (const u of s.submissionUploads ?? []) add(u.field)
    }

    const origin = new URL(req.url ?? 'http://localhost').origin
    const rows = subs.map((s) => {
      const values: Record<string, string> = {}
      for (const a of s.submissionData ?? []) values[a.field] = a.value ?? ''
      for (const u of s.submissionUploads ?? []) {
        values[u.field] = (u.value ?? [])
          .map((v: any) => {
            const doc = v?.value
            return doc && typeof doc === 'object'
              ? `${doc.filename} (${origin}${doc.url})`
              : String(doc ?? '')
          })
          .join('\n')
      }
      return [
        new Date(s.createdAt).toLocaleString('en-US', { timeZone: 'America/New_York' }),
        ...cols.map((c) => values[c.key] ?? ''),
      ]
    })

    const csv = [['Submitted (ET)', ...cols.map((c) => c.label)], ...rows]
      .map((r) => r.map(cell).join(','))
      .join('\r\n')
    const filename = `${(form.title || 'form').replace(/[^\w\- ]+/g, '').trim() || 'form'} submissions.csv`
    return new Response('﻿' + csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    })
  },
}

/** Quotes a CSV cell, and stops spreadsheet apps reading an answer as a formula. */
function cell(v: unknown) {
  let s = String(v ?? '')
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}
