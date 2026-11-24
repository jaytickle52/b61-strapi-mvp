import { headingEditor, simpleEditor } from './editors'
import { toHeading } from './heading'
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
 * The Heading panel's fields, in order: Eyebrow, Heading, then `after` (the
 * element's supporting text, Hero's Changing words), then Heading level, which
 * people touch least. `levels` are the fixed levels besides Automatic
 * (Hero: H1-H3; bands: H2-H4).
 *
 * Heading is one box with one Emphasize button (kit/heading.ts). It also
 * accepts text with *stars* for emphasis and new lines for breaks, so
 * templates, demo content and the connector can write it simply.
 */
export function headingFields(o: { levels?: Level[]; after?: Field[] } = {}): Field[] {
  const levels = o.levels ?? ['h1', 'h2', 'h3']
  return [
    { name: 'eyebrow', label: 'Eyebrow', type: 'text' },
    {
      name: 'heading',
      label: 'Heading',
      type: 'richText',
      editor: headingEditor(),
      hooks: { beforeValidate: [({ value }) => toHeading(value)] },
      custom: { mcpNote: 'send plain text: *stars* emphasize words, a new line (\\n) is a line break; reads back as Lexical JSON' },
      admin: { className: 'b61-heading-field', description: 'Select words and press Emphasize to set them apart. Shift+Enter starts a new line on wider screens.' },
    },
    ...(o.after ?? []),
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
  ['chat', 'Chat'],
  ['share', 'Share'],
  ['document', 'Document'],
  ['pencil', 'Pencil'],
  ['mobile', 'Phone (mobile)'],
  ['bolt', 'Lightning'],
  ['eye', 'Eye'],
  ['search', 'Search'],
  ['grid', 'Grid'],
  ['chart', 'Bar chart'],
  ['trend', 'Trend line'],
  ['upload', 'Upload'],
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

/**
 * An icon choice: the built-in set plus "Your own…", which asks for an image
 * from Photos and videos (an SVG or PNG on a see-through background) and
 * whether it keeps its colours. Stored as `${name}`, `${name}Image`,
 * `${name}Colours`; the renderer is kit/render/icons.tsx B61Icon.
 */
export function iconChoice(
  options: [string, string][],
  o: { name?: string; default: string; width?: string; condition?: Condition } = { default: 'star' },
): Field[] {
  const name = o.name ?? 'icon'
  const isOwn: Condition = (data, sib, ctx) => sib?.[name] === 'custom' && (o.condition ? o.condition(data, sib, ctx) : true)
  return [
    dropdown(name, 'Icon', [...options, ['custom', 'Your own…']], { default: o.default, width: o.width, condition: o.condition }),
    {
      name: `${name}Image`,
      label: 'Your icon',
      type: 'upload',
      relationTo: 'media',
      filterOptions: onlyImages,
      admin: { condition: isOwn, description: 'An SVG or PNG on a see-through background. It takes the text colour, like the other icons.' },
    } as Field,
    { ...toggle(`${name}Colours`, 'Keep its colours'), admin: { condition: isOwn } } as Field,
  ]
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
  // One supporting-text field (EDITING-STANDARD.md section 5): Intro on elements with items, else Subheadings.
  return headingFields({
    levels: o.levels ?? ['h2', 'h3', 'h4'],
    after: o.intro ? [{ name: 'intro', label: 'Intro', type: 'richText', editor: simpleEditor() } as Field] : [subheadsField()],
  })
}
