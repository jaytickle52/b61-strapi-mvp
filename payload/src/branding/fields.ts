import type { Field } from 'payload'
import { validateHex } from './color'

/** A colour setting: swatch + hex + readability check (BrandPreview shows it in use). */
export function colorField(name: string, opts: { label?: string; defaultValue?: string; description?: string; placeholder?: string } = {}): Field {
  return {
    name,
    label: opts.label,
    type: 'text',
    defaultValue: opts.defaultValue,
    validate: validateHex,
    admin: {
      description: opts.description,
      placeholder: opts.placeholder,
      components: { Field: '@/branding/ColorField#ColorField' },
    },
  }
}
