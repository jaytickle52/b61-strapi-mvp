import type { Block, Field, FieldHook } from 'payload'
import { segmented } from '../b61/kit/controls'
import { simpleEditor } from '../b61/kit/editors'
import { MAX_UPLOAD_BYTES } from './logic'

/*
 * How a form's questions are edited. Starts from the Form Builder plugin's
 * field blocks and makes them school-staff friendly:
 *
 * - Label first; the technical name fills itself in from the label.
 * - Width is Full / Half / Third, not a percentage.
 * - Every question can have help text and a "Show only when" rule
 *   (conditional logic), checked in the browser and again on the server.
 * - Two extra kinds: Phone and Signature.
 */

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'field'

/** Fills an empty name from the label, unique within the form. */
const autoName: FieldHook = ({ value, siblingData, data }) => {
  if (typeof value === 'string' && value.trim()) return slugify(value)
  const base = slugify(String(siblingData?.label ?? siblingData?.blockType ?? 'field'))
  const taken = new Set(
    ((data?.fields as any[]) ?? []).filter((b) => b !== siblingData).map((b) => b?.name),
  )
  let name = base
  for (let i = 2; taken.has(name); i++) name = `${base}-${i}`
  return name
}

const nameField: Field = {
  name: 'name',
  label: 'Name in emails',
  type: 'text',
  hooks: { beforeValidate: [autoName] },
  admin: { width: '50%', description: 'Fills in from the label. Use it in emails as {{name}}.' },
}

const labelField: Field = {
  name: 'label',
  label: 'Label',
  type: 'text',
  required: true,
  admin: { width: '50%' },
}

const widthField = segmented(
  'width',
  'Width',
  [
    ['100', 'Full'],
    ['50', 'Half'],
    ['33', 'Third'],
  ],
  { default: '100' },
)

const helpField: Field = {
  name: 'help',
  label: 'Help text',
  type: 'text',
  admin: { description: 'One short line under the question.' },
}

export const showWhenField: Field = {
  type: 'collapsible',
  label: 'Show only when',
  admin: {
    initCollapsed: true,
    description: 'Leave empty to always show this. Hidden questions are never required.',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'showIf',
          label: 'Question',
          type: 'text',
          admin: { width: '40%', components: { Field: '@/forms/FieldPicker#FieldPicker' } },
        },
        {
          name: 'showIs',
          label: 'Is',
          type: 'select',
          defaultValue: 'equals',
          options: [
            { label: 'is', value: 'equals' },
            { label: 'is not', value: 'notEquals' },
            { label: 'is answered', value: 'filled' },
            { label: 'is empty', value: 'empty' },
          ],
          admin: { width: '25%', isClearable: false, condition: (_, s) => Boolean(s?.showIf) },
        },
        {
          name: 'showValue',
          label: 'Answer',
          type: 'text',
          admin: {
            width: '35%',
            condition: (_, s) =>
              Boolean(s?.showIf) && (s?.showIs === 'equals' || s?.showIs === 'notEquals'),
            description: 'For a choice, its value. For a checkbox: yes or no.',
          },
        },
      ],
    },
  ],
}

/** Rebuilds one plugin field block in our layout. */
function reshape(block: Block): Block {
  if (block.slug === 'payment') return block
  const flat: Field[] = []
  const walk = (fs: Field[]) => {
    for (const f of fs) {
      if (f.type === 'row') walk(f.fields)
      else flat.push(f)
    }
  }
  walk(block.fields)
  const by = (n: string) => flat.find((f) => 'name' in f && f.name === n)
  const used = new Set(['name', 'label', 'width', 'required'])
  const rest = flat
    .filter((f) => !('name' in f) || !used.has(f.name))
    .map((f) => {
      if ('name' in f && f.type === 'richText') return { ...f, editor: simpleEditor() }
      if ('name' in f && f.name === 'defaultValue') return { ...f, label: 'Prefilled answer' }
      if ('name' in f && f.name === 'uploadCollection')
        return { ...f, defaultValue: 'form-uploads', admin: { ...(f.admin ?? {}), hidden: true } }
      if ('name' in f && f.name === 'mimeTypes')
        return {
          ...f,
          label: 'Allowed file types',
          admin: {
            ...(f.admin ?? {}),
            description: 'e.g. application/pdf or image/*. Empty: PDFs, images and Word files.',
          },
        }
      if ('name' in f && f.name === 'maxFileSize')
        return {
          ...f,
          defaultValue: MAX_UPLOAD_BYTES,
          max: MAX_UPLOAD_BYTES,
          admin: {
            ...(f.admin ?? {}),
            description: 'In bytes. Up to 4 MB (4194304) per form on the current hosting.',
          },
        }
      return f
    }) as Field[]

  const hasName = Boolean(by('name'))
  const fields: Field[] = []
  if (hasName) fields.push({ type: 'row', fields: [labelField, nameField] })
  fields.push(...rest)
  if (hasName) {
    fields.push(helpField)
    fields.push({
      type: 'row',
      fields: [
        { ...widthField, admin: { ...widthField.admin, width: '60%' } },
        { name: 'required', label: 'Required', type: 'checkbox', admin: { width: '40%' } },
      ],
    })
  }
  fields.push(showWhenField)
  return { ...block, fields }
}

/** A phone number (the plugin has none). */
export const PhoneBlock: Block = {
  slug: 'phone',
  labels: { singular: 'Phone', plural: 'Phones' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'label', type: 'text' },
    { name: 'width', type: 'number' },
    { name: 'required', type: 'checkbox' },
  ],
}

/** A drawn signature, with "type your name" for people who can't draw one. */
export const SignatureBlock: Block = {
  slug: 'signature',
  labels: { singular: 'Signature', plural: 'Signatures' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'label', type: 'text', defaultValue: 'Signature' },
    {
      name: 'statement',
      label: 'Agreement text',
      type: 'textarea',
      admin: {
        description:
          'Shown above the signature, e.g. "I confirm the information above is accurate."',
      },
    },
    { name: 'width', type: 'number' },
    { name: 'required', type: 'checkbox', defaultValue: true },
  ],
}

/** Applies our layout to every field block of the Forms collection. */
export function reshapeFormFields(defaultFields: Field[]): Field[] {
  return defaultFields.map((f) => {
    if ('name' in f && f.name === 'fields' && f.type === 'blocks') {
      return {
        ...f,
        label: 'Questions',
        labels: { singular: 'Question', plural: 'Questions' },
        blocks: (f.blocks ?? []).map((b) => reshape(b as Block)),
      }
    }
    return f
  })
}
