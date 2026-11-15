import type { CollectionBeforeChangeHook, Config, Field } from 'payload'
import type { PluginConfig as FormBuilderPluginConfig } from '@payloadcms/plugin-form-builder/types'
import { publishersOnly, signedIn } from '../access'
import { simpleEditor } from '../b61/kit/editors'
import {
  brandedEmail,
  schoolSender,
  siteOrigin,
  splitAddresses,
  styleTables,
} from '../email/school'
import { PhoneBlock, SignatureBlock, reshapeFormFields } from './fields'
import { exportEndpoint } from './export'

/*
 * Forms (Payload's Form Builder plugin), set up for school sites.
 *
 * - Forms and their submissions belong to a school (multi-tenant plugin).
 * - Visitors never write to the API directly: the website posts to
 *   /next/form (src/app/(frontend)/next/form/route.ts), which checks spam,
 *   required answers and "Show only when" rules, then saves the submission.
 * - Submissions, uploaded files and email settings are staff-only.
 * - No payments (Jay, Nov 2026).
 */

const emailFields: Field[] = [
  {
    type: 'row',
    fields: [
      {
        name: 'emailTo',
        label: 'Send to',
        type: 'text',
        admin: {
          width: '50%',
          placeholder: 'School settings > Email',
          description:
            "Empty: the school's form notification addresses. {{email}} sends to the person who filled it in.",
        },
      },
      {
        name: 'replyTo',
        label: 'Replies go to',
        type: 'text',
        admin: {
          width: '50%',
          placeholder: 'The school email',
          description: '{{email}} lets staff reply straight to the family.',
        },
      },
    ],
  },
  {
    type: 'row',
    fields: [
      { name: 'cc', label: 'CC', type: 'text', admin: { width: '50%' } },
      { name: 'bcc', label: 'BCC', type: 'text', admin: { width: '50%' } },
    ],
  },
  {
    name: 'subject',
    label: 'Subject',
    type: 'text',
    admin: { placeholder: 'New submission: <form title>' },
  },
  {
    name: 'message',
    label: 'Message',
    type: 'richText',
    editor: simpleEditor(),
    admin: {
      description:
        'Use {{name}} for one answer and {{*:table}} for all of them. Empty: all answers as a table.',
    },
  },
]

/**
 * Fills in a new submission's "From" line and its files. Replaces the plugin's
 * own upload hook (see forms/config: replaceSubmissionHooks): the website's form
 * handler has already checked every file, including ones under questions that
 * were hidden by a "Show only when" rule, which the plugin's check can't see.
 */
export const submissionBeforeChange: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== 'create') return data
  const answers: { field: string; value: string }[] = data.submissionData ?? []
  const pick = (re: RegExp) => answers.find((a) => re.test(a.field) && a.value)?.value
  const name =
    [pick(/first.?name/i), pick(/last.?name/i)].filter(Boolean).join(' ') ||
    pick(/(^|-)name$/i) ||
    pick(/name/i)
  const email = pick(/email/i)
  data.summary = [name, email && `<${email}>`].filter(Boolean).join(' ') || 'Website visitor'
  const files = (req.context?.b61Files ?? []) as { field: string; id: number }[]
  const byField = new Map<string, number[]>()
  for (const f of files) byField.set(f.field, [...(byField.get(f.field) ?? []), f.id])
  data.submissionUploads = [...byField].map(([field, ids]) => ({
    field,
    value: ids.map((value) => ({ relationTo: 'form-uploads', value })),
  }))
  return data
}

/** Runs after the Form Builder plugin: submissions use only our beforeChange hook. */
export const replaceSubmissionHooks = (config: Config): Config => ({
  ...config,
  collections: (config.collections ?? []).map((c) =>
    c.slug === 'form-submissions'
      ? { ...c, hooks: { ...c.hooks, beforeChange: [submissionBeforeChange] } }
      : c,
  ),
})

const isEmpty = (html: string) =>
  !html
    .replace(/<[^>]+>/g, '')
    .replace(/^undefined$/, '')
    .trim()

export const formBuilderConfig: FormBuilderPluginConfig = {
  fields: {
    text: true,
    textarea: true,
    email: true,
    phone: PhoneBlock as any,
    number: true,
    select: true,
    radio: true,
    checkbox: true,
    date: true,
    state: true,
    country: true,
    message: true,
    upload: true,
    signature: SignatureBlock as any,
    payment: false,
  },
  uploadCollections: ['form-uploads'],
  redirectRelationships: ['pages'],

  formOverrides: {
    labels: { singular: 'Form', plural: 'Forms' },
    admin: {
      group: 'Forms',
      defaultColumns: ['title', 'updatedAt'],
      description:
        'Inquiry, tour, contact and application forms. Add one to a page with the Form element.',
    },
    // Forms go live as soon as they're saved, so only publishers change them.
    access: { read: signedIn, create: publishersOnly, update: publishersOnly, delete: publishersOnly },
    fields: ({ defaultFields }) => {
      const reshaped = reshapeFormFields(defaultFields).map((f) => {
        if (!('name' in f)) return f
        if (f.name === 'emails' && f.type === 'array') {
          return {
            ...f,
            label: 'Emails',
            labels: { singular: 'Email', plural: 'Emails' },
            admin: {
              ...(f.admin ?? {}),
              description:
                "Sent on every submission, from the school's sender. Add one to notify staff and one to confirm to the family.",
              components: { RowLabel: '@/forms/EmailRowLabel#EmailRowLabel' },
            },
            fields: emailFields,
          } as Field
        }
        if (f.name === 'confirmationMessage' && f.type === 'richText')
          return { ...f, editor: simpleEditor() } as Field
        if (f.name === 'submitButtonLabel')
          return { ...f, label: 'Button text', admin: { placeholder: 'Send' } } as Field
        return f
      })
      return [
        ...reshaped,
        {
          name: 'submissions',
          type: 'ui',
          admin: {
            position: 'sidebar',
            components: { Field: '@/forms/SubmissionsLink#SubmissionsLink' },
          },
        },
      ]
    },
  },

  formSubmissionOverrides: {
    labels: { singular: 'Submission', plural: 'Submissions' },
    admin: {
      group: 'Forms',
      useAsTitle: 'summary',
      defaultColumns: ['summary', 'form', 'createdAt'],
      description:
        "What families sent through the website forms. Download a form's submissions as a spreadsheet from the form.",
    },
    // Only the website's own form handler (Local API) creates submissions.
    // Families' answers: Editors and School Admins only, never Contributors.
    access: { create: () => false, read: publishersOnly, update: () => false, delete: publishersOnly },
    endpoints: [exportEndpoint],
    fields: ({ defaultFields }) => [
      { name: 'summary', label: 'From', type: 'text', admin: { readOnly: true } },
      ...defaultFields,
    ],
    hooks: { beforeChange: [submissionBeforeChange] },
  },

  // Every email: the school's sender and branded layout.
  beforeEmail: async (emails, params) => {
    // Called from the submission's afterChange, so the saved doc is there too.
    const { req, data, doc } = params as typeof params & { doc: any }
    const payload = req.payload
    const form: any = await payload.findByID({
      collection: 'forms',
      id: (data as any).form,
      depth: 0,
      overrideAccess: true,
      req,
    })
    const sender = await schoolSender(payload, form?.school)
    const admin = siteOrigin()
    // Emails show each question's label, not its technical name.
    const labels = new Map<string, string>(
      ((form?.fields ?? []) as any[])
        .filter((f) => f?.name)
        .map((f) => [f.name, f.label || f.name]),
    )
    const fileCount = ((doc as any)?.submissionUploads ?? []).reduce(
      (n: number, u: any) => n + (u?.value?.length ?? 0),
      0,
    )

    return emails.flatMap((email, i) => {
      const template = form?.emails?.[i] ?? {}
      const toFamily = /\{\{/.test(String(template.emailTo ?? ''))
      const to = splitAddresses(String(email.to ?? ''))
      const recipients = template.emailTo ? to : sender.recipients
      if (!recipients.length) {
        payload.logger.warn({
          msg: `Form "${form?.title}": no address to send to. Set School settings > Email.`,
        })
        return []
      }
      let body = String(email.html ?? '').replace(/^<div>|<\/div>$/g, '')
      if (isEmpty(body)) {
        const rows = ((data as any).submissionData ?? [])
          .map(
            (a: any) =>
              `<tr><td>${escape(labels.get(a.field) ?? a.field)}</td><td>${escape(a.value)}</td></tr>`,
          )
          .join('')
        body = `<p>${toFamily ? 'Thank you. Here is a copy of what you sent.' : `A new submission came in through <strong>${escape(form?.title ?? 'a form')}</strong>.`}</p><table>${rows}</table>`
      }
      // The plugin's {{*:table}} includes its internal id; staff don't need it.
      body = body.replace(/<tr><td>formSubmissionID<\/td><td>[^<]*<\/td><\/tr>/g, '')
      for (const [name, label] of labels)
        body = body.split(`<tr><td>${escape(name)}</td>`).join(`<tr><td>${escape(label)}</td>`)
      if (!toFamily) {
        if (fileCount)
          body += `<p>${fileCount} file${fileCount === 1 ? '' : 's'} attached. Open the submission to see ${fileCount === 1 ? 'it' : 'them'}.</p>`
        if (admin)
          body += `<p><a href="${admin}/admin/collections/form-submissions/${doc.id}">Open this submission</a></p>`
      }
      const replyTo = splitAddresses(String(email.replyTo ?? ''))[0] || sender.replyTo
      return [
        {
          ...email,
          to: recipients.join(', '),
          from: sender.from,
          replyTo,
          subject:
            email.subject && email.subject !== "You've received a new message."
              ? email.subject
              : `New submission: ${form?.title ?? 'website form'}`,
          html: brandedEmail(sender, styleTables(body)),
          b61: { school: sender.school, kind: 'form' },
        } as any,
      ]
    })
  },
}

const escape = (v: unknown) =>
  String(v ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  )
