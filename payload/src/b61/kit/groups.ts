import { simpleEditor } from './editors'
import type { ArrayField, Condition, Field, FilterOptions, UploadField } from 'payload'
import { dropdown, link, segmented, toggle, whenCondition, type When } from './controls'
import { panel } from './element'
import { videoLinkField } from './video'

/*
 * B61 editing kit: field groups shared by every element. Same names, same
 * stored values (matching the Breakdance plugin), same order everywhere.
 */

export const onlyImages: FilterOptions = { mimeType: { contains: 'image' } }
export const onlyVideos: FilterOptions = { mimeType: { contains: 'video' } }

const ROW_LABEL = '@/b61/kit/admin/RowLabel#LabelRow'

/**
 * A list whose rows are named by their content and carry no second header.
 * Rows start closed, so a long list reads as its names; a list of one-line rows
 * (Heading lines) passes `admin.initCollapsed: false`.
 */
export function list(name: string, label: string, singular: string, fields: Field[], o: Partial<ArrayField> = {}): ArrayField {
  return {
    name,
    label,
    type: 'array',
    labels: { singular, plural: label },
    ...o,
    admin: {
      initCollapsed: true,
      ...(o.admin ?? {}),
      className: ['b61-list', o.admin?.className].filter(Boolean).join(' '),
      components: { RowLabel: ROW_LABEL, ...(o.admin?.components ?? {}) },
    },
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
    ], { admin: { initCollapsed: false } }),
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
  ['question', 'Question mark'],
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
 * Fills for an element's items (Accordion items, boxed stats), in the kit's one
 * colour vocabulary: no fill first, then lightest to darkest. Stored values are
 * the plugin's (card, light, soft...); only the words changed (audit 1.78.0).
 * Page = the page's own ground (white on a light site); White card = always
 * white with a border.
 */
export const ITEM_SURFACES: [string, string][] = [
  ['outline', 'Outline'],
  ['light', 'Page'],
  ['card', 'White card'],
  ['soft', 'Light wash'],
  ['dark', 'Dark'],
  ['accent', 'Accent'],
]

/** The band surface: the shared four, from utilities.css. */
export function surfaceField(o: { standalone?: string } = {}): Field {
  const f = segmented(
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
  if (!o.standalone) return f
  // An element that has its own colour when it stands alone (Stats Band, CTA Band) stores no
  // starting value: on its own it shows `standalone`; inside a Section, Tabs or Carousel it shows
  // None, so it shares the container's colour until someone picks one. The editor highlights
  // whichever applies (Segmented's `unset`); the element applies the same rule (Inner's `nested`).
  const { defaultValue: _d, ...rest } = f as any
  const field = rest.admin.components.Field
  return {
    ...rest,
    admin: {
      ...rest.admin,
      description: 'Inside a Section, Tabs or a Carousel this starts as None, so it shares that colour.',
      components: { ...rest.admin.components, Field: { ...field, clientProps: { ...field.clientProps, unset: { top: o.standalone, nested: 'none' } } } },
    },
  } as Field
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
    // Opens a page or address, or plays a video in a pop-up over the page.
    segmented('action', 'Opens', [['link', 'A link'], ['video', 'A video']], { default: 'link' }),
    { ...link(), admin: { hideGutter: true, condition: (_: unknown, s: any) => s?.action !== 'video' } } as Field,
    videoLinkField((s) => s?.action === 'video'),
    // A full-width text link is a hit area with no visible edges.
    toggle('fullWidth', 'Full width', { condition: (_, s) => s?.variant !== 'link' }),
  ])
}

/**
 * The Buttons panel: closed, its header listing the button labels. The list's own
 * title is hidden so the name isn't said twice (EDITING-STANDARD.md section 4).
 */
export function buttonsPanel(): Field {
  const f = buttonsField()
  return panel('Buttons', [{ ...f, admin: { ...f.admin, className: 'b61-list b61-list--bare' } } as Field])
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

/** The heading panel of a band: eyebrow, heading lines, level, subheadings and (optionally) an intro. */
export function bandHeadFields(o: { levels?: ('h1' | 'h2' | 'h3' | 'h4')[]; intro?: boolean } = {}): Field[] {
  return [
    ...headingFields({ levels: o.levels ?? ['h2', 'h3', 'h4'] }),
    // One supporting-text field (EDITING-STANDARD.md section 5): Intro on elements with items, else Subheadings.
    ...(o.intro ? [{ name: 'intro', label: 'Intro', type: 'richText', editor: simpleEditor() } as Field] : [subheadsField()]),
  ]
}
