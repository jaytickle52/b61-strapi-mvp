import type { ArrayField, Condition, Field, FilterOptions, UploadField } from 'payload'
import { dropdown, link, segmented, toggle, whenCondition, type When } from './controls'

/*
 * B61 editing kit: field groups shared by every element. Same names, same
 * stored values (matching the Breakdance plugin), same order everywhere.
 */

export const onlyImages: FilterOptions = { mimeType: { contains: 'image' } }
export const onlyVideos: FilterOptions = { mimeType: { contains: 'video' } }

const ROW_LABEL = '@/b61/kit/admin/RowLabel#LabelRow'

/** A list whose rows are named by their content and carry no second header. */
export function list(name: string, label: string, singular: string, fields: Field[], o: Partial<ArrayField> = {}): ArrayField {
  return {
    name,
    label,
    type: 'array',
    labels: { singular, plural: label },
    ...o,
    admin: { ...(o.admin ?? {}), className: 'b61-list', components: { RowLabel: ROW_LABEL, ...(o.admin?.components ?? {}) } },
    fields,
  } as ArrayField
}

/** Eyebrow, heading lines (each can be emphasised), heading level. */
export function headingFields(): Field[] {
  return [
    { name: 'eyebrow', label: 'Eyebrow', type: 'text' },
    list('lines', 'Heading lines', 'Line', [
      {
        type: 'row',
        fields: [
          { name: 'text', label: 'Line', type: 'text', required: true, admin: { width: '70%' } },
          { ...toggle('emphasize', 'Emphasize'), admin: { width: '30%', style: { alignSelf: 'flex-end', paddingBottom: 10 } } },
        ],
      },
    ]),
    dropdown(
      'headingLevel',
      'Heading level',
      [
        ['auto', 'Automatic'],
        ['h1', 'H1'],
        ['h2', 'H2'],
        ['h3', 'H3'],
      ],
      { default: 'auto', width: '50%' },
    ),
  ]
}

/** Automatic = H1 for the first section on a page, H2 after it. */
export function resolveHeadingLevel(level: string | null | undefined, index: number): 'h1' | 'h2' | 'h3' {
  if (level === 'h1' || level === 'h2' || level === 'h3') return level
  return index === 0 ? 'h1' : 'h2'
}

/** The shared four button styles, with a compact row per button. */
export function buttonsField(): ArrayField {
  return list('buttons', 'Buttons', 'Button', [
    {
      type: 'row',
      fields: [
        { name: 'label', label: 'Label', type: 'text', required: true, admin: { width: '60%' } },
        dropdown(
          'variant',
          'Style',
          [
            ['primary', 'Primary'],
            ['secondary', 'Secondary'],
            ['light', 'Light'],
            ['link', 'Text link'],
          ],
          { default: 'primary', width: '40%', required: true },
        ),
      ],
    },
    link(),
    // A full-width text link is a hit area with no visible edges.
    toggle('fullWidth', 'Full width', { condition: (_, s) => s?.variant !== 'link' }),
  ])
}

/** A photo field. Focal point and crop live on the photo itself, in Media. */
export function photo(name: string, label: string, o: { when?: When; condition?: Condition; required?: boolean } = {}): UploadField {
  return {
    name,
    label,
    type: 'upload',
    relationTo: 'media',
    filterOptions: onlyImages,
    required: o.required,
    admin: {
      condition: o.condition ?? whenCondition(o.when),
      description: 'To set the focal point, click the pencil on the photo, then Edit image.',
    },
  }
}

export function paddingFields(): Field {
  const opts: [string, string][] = [
    ['normal', 'Normal'],
    ['tight', 'Tight'],
    ['none', 'None'],
  ]
  return {
    type: 'row',
    fields: [
      segmented('padTop', 'Top padding', opts, { default: 'normal', width: '50%' }),
      segmented('padBottom', 'Bottom padding', opts, { default: 'normal', width: '50%' }),
    ],
  }
}

/** Shown only when the element has an eyebrow. */
export function eyebrowRuleField(): Field {
  return dropdown(
    'eyebrowRule',
    'Eyebrow rule',
    [
      ['site', 'Site default'],
      ['none', 'None'],
      ['leading', 'Leading'],
      ['trailing', 'Trailing'],
      ['both', 'Both sides'],
    ],
    { default: 'site', when: { field: 'eyebrow', filled: true } },
  )
}

export function entranceField(): Field {
  return segmented(
    'entrance',
    'Entrance animation',
    [
      ['on', 'On'],
      ['off', 'Off'],
    ],
    { default: 'on' },
  )
}

export function textAlignField(): Field {
  return segmented(
    'textAlign',
    'Text alignment',
    [
      ['left', 'Left', 'align-left'],
      ['center', 'Center', 'align-center'],
    ],
    { default: 'left', iconOnly: true },
  )
}
