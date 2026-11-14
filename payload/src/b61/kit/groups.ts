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

type Level = 'h1' | 'h2' | 'h3' | 'h4'

/**
 * Eyebrow, heading lines (each can be emphasised), heading level.
 * `levels` are the fixed levels an element offers besides Automatic
 * (Hero: H1-H3; bands: H2-H4).
 */
export function headingFields(o: { levels?: Level[] } = {}): Field[] {
  const levels = o.levels ?? ['h1', 'h2', 'h3']
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
    dropdown('headingLevel', 'Heading level', [['auto', 'Automatic'], ...levels.map((l) => [l, l.toUpperCase()] as [string, string])], {
      default: 'auto',
    }),
  ]
}

/** Automatic = H1 for the first section on a page, H2 after it. */
export function resolveHeadingLevel(level: string | null | undefined, index: number): Level {
  if (level === 'h1' || level === 'h2' || level === 'h3' || level === 'h4') return level
  return index === 0 ? 'h1' : 'h2'
}

/** Display-face second headlines under the heading (bands; the Hero uses Subheadline). */
export function subheadsField(): ArrayField {
  return list('subheads', 'Subheadings', 'Subheading', [{ name: 'text', label: 'Text', type: 'text', required: true }])
}

/** The built-in icon set (kit/icons.ts). "Dot" is the neutral default mark. */
export const ICON_OPTIONS: [string, string][] = [
  ['dot', 'Dot'],
  ['check', 'Check'],
  ['email', 'Email'],
  ['phone', 'Phone'],
  ['location', 'Location'],
  ['calendar', 'Calendar'],
  ['clock', 'Clock'],
  ['link', 'Link'],
  ['star', 'Star'],
  ['heart', 'Heart'],
  ['book', 'Book'],
  ['people', 'People'],
  ['cross', 'Cross'],
  ['school', 'School'],
]

/**
 * The text stack a band's content is made of: body copy, emphasis lines,
 * pull quotes and icon rows, in any order. Consecutive icon rows render as one
 * list. Shared by Split, Prose and CTA Band.
 */
export function contentBlocksField(): ArrayField {
  const is = (t: string) => (_: unknown, s: any) => (s?.type ?? 'body') === t
  return list(
    'contentBlocks',
    'Content',
    'Block',
    [
      segmented(
        'type',
        'Type',
        [
          ['body', 'Body copy'],
          ['emphasis', 'Emphasis'],
          ['quote', 'Pull quote'],
          ['iconrow', 'Icon row'],
        ],
        { default: 'body' },
      ),
      { name: 'body', label: 'Body copy', type: 'richText', admin: { condition: is('body') } },
      {
        name: 'text',
        label: 'Text',
        type: 'textarea',
        admin: { rows: 2, condition: (_, s) => (s?.type ?? 'body') !== 'body' },
      },
      {
        type: 'row',
        admin: { condition: is('quote') },
        fields: [
          { name: 'attribution', label: 'Attribution', type: 'text', admin: { width: '60%' } },
          { name: 'photo', label: 'Photo', type: 'upload', relationTo: 'media', filterOptions: onlyImages, admin: { width: '40%' } },
        ],
      },
      {
        type: 'row',
        admin: { condition: is('iconrow') },
        fields: [
          dropdown('icon', 'Icon', ICON_OPTIONS, { default: 'dot', width: '40%' }),
          { name: 'hasLink', label: 'Link this row', type: 'checkbox', admin: { width: '60%', style: { alignSelf: 'flex-end', paddingBottom: 10 } } },
        ],
      },
      { ...link(), admin: { hideGutter: true, condition: (_: unknown, s: any) => s?.type === 'iconrow' && Boolean(s?.hasLink) } } as Field,
    ],
    { admin: { description: 'Body copy, emphasis lines, pull quotes and icon rows, in any order.' } },
  )
}

/** The band surface: the shared four, from utilities.css. */
export function surfaceField(): Field {
  return segmented(
    'surface',
    'Surface',
    [
      ['none', 'None'],
      ['soft', 'Light wash'],
      ['dark', 'Dark'],
      ['accent', 'Accent'],
    ],
    { default: 'none' },
  )
}

export function headingAlignField(): Field {
  return segmented(
    'headingAlign',
    'Heading alignment',
    [
      ['left', 'Left', 'align-left'],
      ['center', 'Center', 'align-center'],
    ],
    { default: 'left', iconOnly: true },
  )
}

export function frameColorField(o: { when?: When } = {}): Field {
  return segmented(
    'frameColor',
    'Frame color',
    [
      ['primary', 'Primary'],
      ['secondary', 'Secondary'],
      ['accent', 'Accent'],
    ],
    { default: 'primary', when: o.when },
  )
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
