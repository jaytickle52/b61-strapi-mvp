import type { CheckboxField, Condition, Field, NumberField, RadioField, SelectField } from 'payload'

/*
 * B61 editing kit: single controls. Every element builds its form from these,
 * so a choice looks and behaves the same everywhere (EDITING-STANDARD.md, 4).
 */

/**
 * Show a control only when another control in the same element has one of
 * these values (`in`), or has any value at all (`filled`). A list means "any
 * of these". Written as data, not a function, so panel headers can apply the
 * same rule when they summarise what is set.
 */
export type WhenRule = { field?: string; in?: (string | boolean | null)[]; filled?: boolean; all?: WhenRule[] }
export type When = WhenRule | WhenRule[]

const ruleMatches = (r: WhenRule, sibling: Record<string, unknown> | undefined): boolean =>
  r.all
    ? r.all.every((x) => ruleMatches(x, sibling))
    : r.filled
      ? Boolean(sibling?.[r.field!])
      : (r.in ?? []).includes((sibling?.[r.field!] as any) ?? null)

/** A list of rules means "any of these"; a rule with `all` means "every one of these". */
export const matches = (w: When, sibling: Record<string, unknown> | undefined) =>
  (Array.isArray(w) ? w : [w]).some((r) => ruleMatches(r, sibling))

export const whenCondition = (w?: When): Condition | undefined => (w ? (_, sibling) => matches(w, sibling) : undefined)

type Option = [value: string, label: string, icon?: string]

/** Two to five fixed choices as segmented buttons (icons optional). */
export function segmented(
  name: string,
  label: string,
  options: Option[],
  o: { default: string; when?: When; condition?: Condition; iconOnly?: boolean; description?: string; width?: string } ,
): RadioField {
  const icons = Object.fromEntries(options.filter((x) => x[2]).map((x) => [x[0], x[2]!]))
  return {
    name,
    label,
    type: 'radio',
    defaultValue: o.default,
    options: options.map(([value, l]) => ({ value, label: l })),
    custom: { b61When: o.when },
    admin: {
      condition: o.condition ?? whenCondition(o.when),
      description: o.description,
      width: o.width,
      components: {
        Field: { path: '@/b61/kit/admin/Segmented#Segmented', clientProps: { icons, iconOnly: Boolean(o.iconOnly) } },
      },
    },
  }
}

/** Six or more choices, or choices with long names. */
export function dropdown(
  name: string,
  label: string,
  options: Option[],
  o: { default: string; when?: When; condition?: Condition; width?: string; required?: boolean },
): SelectField {
  return {
    name,
    label,
    type: 'select',
    defaultValue: o.default,
    required: o.required,
    options: options.map(([value, l]) => ({ value, label: l })),
    custom: { b61When: o.when },
    admin: { condition: o.condition ?? whenCondition(o.when), width: o.width, isClearable: false },
  }
}

/** On/off. */
export function toggle(name: string, label: string, o: { when?: When; condition?: Condition; width?: string } = {}): CheckboxField {
  return {
    name,
    label,
    type: 'checkbox',
    custom: { b61When: o.when },
    admin: { condition: o.condition ?? whenCondition(o.when), width: o.width },
  }
}

/** A stop on a site-wide 1-7 scale. Empty = site default. */
export function step(name: string, label: string, o: { low: string; high: string; when?: When; default?: number }): NumberField {
  return {
    name,
    label,
    type: 'number',
    min: 1,
    max: 7,
    ...(o.default ? { defaultValue: o.default } : {}),
    custom: { b61When: o.when, b61Step: true },
    admin: {
      condition: whenCondition(o.when),
      components: { Field: { path: '@/b61/kit/admin/StepSlider#StepSlider', clientProps: { low: o.low, high: o.high } } },
    },
  }
}

/** One compact link: a page on this site (survives slug changes), a document (handbook, PDF) or a web address. */
export function link(name = 'link'): Field {
  return {
    name,
    type: 'group',
    label: false,
    admin: { hideGutter: true },
    fields: [
      {
        type: 'row',
        fields: [
          segmented('type', 'Link to', [['page', 'Page'], ['document', 'Document'], ['url', 'Web address']], { default: 'page' }),
          {
            name: 'page',
            label: 'Page',
            type: 'relationship',
            relationTo: 'pages',
            admin: { condition: (_, s) => s?.type !== 'url' && s?.type !== 'document', width: '60%' },
          },
          {
            name: 'document',
            label: 'Document',
            type: 'relationship',
            relationTo: 'documents',
            admin: { condition: (_, s) => s?.type === 'document', width: '60%' },
          },
          {
            name: 'url',
            label: 'Web address',
            type: 'text',
            admin: { condition: (_, s) => s?.type === 'url', placeholder: 'https:// or /page', width: '60%' },
          },
        ],
      },
      { name: 'newTab', label: 'Open in a new tab', type: 'checkbox' },
    ],
  }
}

/** Shows a unit after a number field ("%", "px") instead of in its label. */
export function unit<T extends Field>(field: T, u: string): T {
  const f: any = field
  return {
    ...f,
    admin: {
      ...(f.admin ?? {}),
      components: { ...(f.admin?.components ?? {}), afterInput: [{ path: '@/b61/kit/admin/Unit#Unit', clientProps: { unit: u } }] },
    },
  }
}
