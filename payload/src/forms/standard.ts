import type { Payload } from 'payload'
import type { School } from '../payload-types'

/*
 * The standard school forms: Inquiry, Tour request, Contact and Application.
 * Created for a school that has no forms yet (the demo schools on every build;
 * a new school at launch), each on its own page. Schools then adjust them.
 * Together they use every kind of question, so they double as a test.
 */

const para = (...texts: string[]) => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: texts.map((text) => ({
      type: 'paragraph',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      textFormat: 0,
      textStyle: '',
      children: [
        { type: 'text', text, format: 0, style: '', mode: 'normal', detail: 0, version: 1 },
      ],
    })),
  },
})

const opts = (...labels: string[]) => labels.map((label) => ({ label, value: label }))
const GRADES = opts(
  'Preschool',
  'Kindergarten',
  '1st',
  '2nd',
  '3rd',
  '4th',
  '5th',
  '6th',
  '7th',
  '8th',
  '9th',
  '10th',
  '11th',
  '12th',
)

const q = (blockType: string, label: string, extra: Record<string, unknown> = {}) => ({
  blockType,
  label,
  width: '100',
  ...extra,
})
const half = { width: '50' }
const third = { width: '33' }
const req = { required: true }

const familyConfirmation = (what: string) => ({
  emailTo: '{{email}}',
  subject: `Thank you for your ${what}`,
  message: para(
    `Thank you for your ${what}. Someone from our office will be in touch within two school days.`,
    'Here is a copy of what you sent:',
    '{{*:table}}',
  ),
})
const staffNotification = (what: string) => ({
  replyTo: '{{email}}',
  subject: `New ${what}: {{first-name}} {{last-name}}`,
})

export function standardForms(schoolName: string) {
  return [
    {
      key: 'inquire',
      page: {
        title: 'Inquire',
        slug: 'inquire',
        heading: 'Start the conversation',
        intro: `Tell us a little about your family and ${schoolName} will be in touch.`,
      },
      form: {
        title: 'Admissions inquiry',
        submitButtonLabel: 'Send inquiry',
        confirmationType: 'message',
        confirmationMessage: para(
          'Thank you! We received your inquiry and will be in touch within two school days.',
        ),
        fields: [
          q('text', 'First name', { ...half, ...req, name: 'first-name' }),
          q('text', 'Last name', { ...half, ...req, name: 'last-name' }),
          q('email', 'Email', { ...half, ...req, name: 'email' }),
          q('phone', 'Phone', { ...half, name: 'phone' }),
          q('text', "Student's name", { ...half, name: 'student-name' }),
          q('select', 'Grade of interest', { ...half, ...req, name: 'grade', options: GRADES }),
          q('radio', 'When would your child start?', {
            name: 'start',
            options: opts('This school year', 'Next school year', 'Not sure yet'),
          }),
          q('select', 'How did you hear about us?', {
            name: 'heard',
            options: opts(
              'A friend or family member',
              'Our church',
              'Online search',
              'Social media',
              'An event',
              'Other',
            ),
          }),
          q('text', 'Where did you hear about us?', {
            name: 'heard-other',
            showIf: 'heard',
            showIs: 'equals',
            showValue: 'Other',
          }),
          q('textarea', 'Anything you would like us to know?', {
            name: 'notes',
            help: 'Questions, what matters most to your family, anything at all.',
          }),
        ],
        emails: [staffNotification('inquiry'), familyConfirmation('inquiry')],
      },
    },
    {
      key: 'tour',
      page: {
        title: 'Schedule a tour',
        slug: 'schedule-a-tour',
        heading: 'Come see us',
        intro: 'Pick a day that suits you and we will confirm a time.',
      },
      form: {
        title: 'Tour request',
        submitButtonLabel: 'Request a tour',
        confirmationType: 'message',
        confirmationMessage: para('Thank you! We will email you to confirm a time for your tour.'),
        fields: [
          q('text', 'First name', { ...half, ...req, name: 'first-name' }),
          q('text', 'Last name', { ...half, ...req, name: 'last-name' }),
          q('email', 'Email', { ...half, ...req, name: 'email' }),
          q('phone', 'Phone', { ...half, ...req, name: 'phone' }),
          q('date', 'Preferred date', { ...half, ...req, name: 'date' }),
          q('radio', 'Time of day', {
            ...half,
            name: 'time',
            options: opts('Morning', 'Afternoon'),
          }),
          q('number', 'How many people are coming?', { ...half, name: 'people', defaultValue: 2 }),
          q('text', 'Grades you are interested in', { ...half, name: 'grades' }),
        ],
        emails: [staffNotification('tour request'), familyConfirmation('tour request')],
      },
    },
    {
      key: 'contact',
      page: {
        title: 'Contact',
        slug: 'contact',
        heading: 'Contact us',
        intro: 'Send us a message and the right person will reply.',
      },
      form: {
        title: 'Contact us',
        submitButtonLabel: 'Send message',
        confirmationType: 'message',
        confirmationMessage: para('Thank you for your message. We will reply soon.'),
        fields: [
          q('text', 'Your name', { ...half, ...req, name: 'name' }),
          q('email', 'Email', { ...half, ...req, name: 'email' }),
          q('phone', 'Phone', { ...half, name: 'phone' }),
          q('select', 'What is this about?', {
            ...half,
            ...req,
            name: 'topic',
            options: opts(
              'Admissions',
              'Current families',
              'Athletics',
              'Employment',
              'Something else',
            ),
          }),
          q('textarea', 'Message', { ...req, name: 'message' }),
        ],
        emails: [{ replyTo: '{{email}}', subject: 'Website message: {{topic}} from {{name}}' }],
      },
    },
    {
      key: 'apply',
      page: {
        title: 'Apply',
        slug: 'apply',
        heading: 'Application for admission',
        intro:
          'This takes about ten minutes. Have a recent report card ready to upload if you have one.',
      },
      form: {
        title: 'Application',
        submitButtonLabel: 'Submit application',
        confirmationType: 'message',
        confirmationMessage: para(
          'Your application is in. We will email you about next steps, including the family interview.',
        ),
        fields: [
          q('message', '', { message: para('About the student') }),
          q('text', "Student's first name", { ...half, ...req, name: 'first-name' }),
          q('text', "Student's last name", { ...half, ...req, name: 'last-name' }),
          q('date', 'Date of birth', { ...half, ...req, name: 'birth-date' }),
          q('select', 'Grade applying for', { ...half, ...req, name: 'grade', options: GRADES }),
          q('text', 'Current school', { name: 'current-school' }),
          q('radio', 'Does the student have an IEP or learning plan?', {
            ...req,
            name: 'iep',
            options: opts('Yes', 'No'),
          }),
          q('upload', 'Upload the plan', {
            name: 'iep-plan',
            ...req,
            showIf: 'iep',
            showIs: 'equals',
            showValue: 'Yes',
            uploadCollection: 'form-uploads',
            mimeTypes: [{ mimeType: 'application/pdf' }, { mimeType: 'image/*' }],
          }),
          q('upload', 'Most recent report card', {
            name: 'report-card',
            uploadCollection: 'form-uploads',
            help: 'A PDF or a photo. Optional.',
          }),
          q('message', '', { message: para('About the family') }),
          q('text', 'Parent or guardian name', { ...half, ...req, name: 'parent-name' }),
          q('email', 'Email', { ...half, ...req, name: 'email' }),
          q('phone', 'Phone', { ...half, ...req, name: 'phone' }),
          q('text', 'Street address', { ...half, name: 'address' }),
          q('text', 'City', { ...third, name: 'city' }),
          q('state', 'State', { ...third, name: 'state' }),
          q('text', 'ZIP code', { ...third, name: 'zip' }),
          q('country', 'Country', { name: 'country' }),
          q('checkbox', 'I have read and agree with the school’s statement of faith', {
            ...req,
            name: 'faith',
          }),
          q('signature', 'Parent or guardian signature', {
            ...req,
            name: 'signature',
            statement: 'I confirm the information in this application is true and complete.',
          }),
        ],
        emails: [
          {
            replyTo: '{{email}}',
            subject: 'New application: {{first-name}} {{last-name}} ({{grade}})',
          },
          familyConfirmation('application'),
        ],
      },
    },
  ]
}

/** Creates the standard forms and their pages for a school with no forms yet. */
export async function ensureStandardForms(payload: Payload, school: School) {
  const mine = { school: { equals: school.id } }
  const has = await payload.count({ collection: 'forms', where: mine, overrideAccess: true })
  if (has.totalDocs > 0) return
  const made: { collection: 'forms' | 'pages'; id: number }[] = []
  try {
    for (const s of standardForms(school.name)) {
      const form = await payload.create({
        collection: 'forms',
        data: { ...s.form, school: school.id } as any,
        overrideAccess: true,
      })
      made.push({ collection: 'forms', id: form.id as number })
      const exists = await payload.count({
        collection: 'pages',
        where: { and: [mine, { slug: { equals: s.page.slug } }] },
        overrideAccess: true,
      })
      if (exists.totalDocs > 0) continue
      const page = await payload.create({
        collection: 'pages',
        overrideAccess: true,
        data: {
          title: s.page.title,
          slug: s.page.slug,
          generateSlug: false,
          school: school.id,
          _status: 'published',
          meta: { description: `${s.page.title} · ${school.name}` },
          sections: [
            {
              blockType: 'b61Form',
              form: form.id,
              lines: [{ text: s.page.heading }],
              subheads: [{ text: s.page.intro }],
              surface: s.key === 'apply' ? 'soft' : 'none',
              card: s.key === 'apply' ? 'card' : 'none',
            },
          ],
        } as any,
      })
      made.push({ collection: 'pages', id: page.id as number })
    }
  } catch (err) {
    // All or nothing, so the next build tries again from a clean slate.
    for (const m of made.reverse())
      await payload
        .delete({ collection: m.collection, id: m.id, overrideAccess: true, context: { b61AllowDelete: true } })
        .catch(() => {})
    throw err
  }
  payload.logger.info(`[b61] Standard forms created for ${school.name}`)
}
