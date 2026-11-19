import { simpleEditor } from '../../kit/editors'
import { defineElement, panel } from '../../kit/element'
import { dropdown, link, segmented, toggle, type WhenRule } from '../../kit/controls'
import {
  buttonsPanel,
  entranceField,
  eyebrowRuleField,
  headingFields,
  ICON_OPTIONS,
  list,
  onlyImages,
  paddingFields,
  surfaceField,
} from '../../kit/groups'

/*
 * B61 CARD GRID, built on the B61 editing kit (see ../../EDITING-STANDARD.md).
 * Port of Banner 61 Elements' B61 Card Grid (plugin 1.77.1); stored values match it.
 *
 * Added for Payload: "Fill with" pulls cards from Programs, Upcoming events,
 * Latest news, Staff or School facts (School settings > School), so an item
 * entered once shows here too. Hand-written
 * cards remain the default.
 *
 * Left out: the per-element "Text link hover color" picker (per-site flair
 * belongs in site tokens, per the plugin's own rule).
 */

const manual: WhenRule = { field: 'source', in: ['manual'] }
const isImage: WhenRule = { field: 'mediaType', in: ['image'] }
const isIcon: WhenRule = { field: 'mediaType', in: ['icon'] }
const overlayImg: WhenRule = { all: [{ field: 'cardStyle', in: ['overlay'] }, isImage] }
const notOverlayImg: WhenRule = { all: [{ field: 'cardStyle', in: ['plain', 'flat', 'bordered'] }, isImage] }
const surfacedImg: WhenRule = { all: [{ field: 'cardStyle', in: ['flat', 'bordered'] }, isImage] }
const customRatio: WhenRule[] = [
  { all: [overlayImg, { field: 'cardShape', in: ['custom'] }] },
  { all: [notOverlayImg, { field: 'imageShape', in: ['custom'] }] },
]
const carousel: WhenRule = { field: 'arrangement', in: ['carousel'] }

export const B61CardGrid = defineElement({
  slug: 'b61CardGrid',
  name: 'Card Grid',
  plural: 'Card Grids',
  open: 'Cards',
  mode: { field: 'source', labels: { manual: 'Cards', programs: 'Programs', 'upcoming-events': 'Events', 'latest-news': 'News', staff: 'Staff', 'school-facts': 'School facts' } },

  content: [
    panel('Heading', headingFields({ levels: ['h2', 'h3', 'h4'], after: [{ name: 'intro', label: 'Intro', type: 'richText', editor: simpleEditor() }] })),
    panel('Cards', [
      dropdown(
        'source',
        'Fill with',
        [
          ['manual', 'Cards I write here'],
          ['programs', 'Programs'],
          ['upcoming-events', 'Upcoming events'],
          ['latest-news', 'Latest news'],
          ['staff', 'Staff'],
          ['school-facts', 'School facts'],
        ],
        { default: 'manual' },
      ),
      {
        name: 'limit',
        label: 'How many',
        type: 'number',
        defaultValue: 3,
        min: 1,
        max: 12,
        admin: { condition: (_, s) => !['manual', 'school-facts'].includes(s?.source ?? 'manual'), width: '50%' },
      },
      segmented(
        'mediaType',
        'Card media',
        [
          ['image', 'Image', 'image'],
          ['icon', 'Icon'],
          ['none', 'None'],
        ],
        { default: 'image' },
      ),
      list(
        'cards',
        'Cards',
        'Card',
        [
          {
            name: 'image',
            label: 'Image',
            type: 'upload',
            relationTo: 'media',
            filterOptions: onlyImages,
            admin: { condition: (_, __, { blockData }) => ((blockData as any)?.mediaType ?? 'image') === 'image' },
          },
          dropdown('icon', 'Icon', ICON_OPTIONS.filter(([v]) => v !== 'dot'), {
            default: 'star',
            condition: (_, __, { blockData }) => (blockData as any)?.mediaType === 'icon',
          }),
          {
            type: 'row',
            fields: [
              { name: 'eyebrow', label: 'Eyebrow', type: 'text', admin: { width: '40%' } },
              { name: 'title', label: 'Title', type: 'text', admin: { width: '60%' } },
            ],
          },
          { name: 'body', label: 'Body', type: 'richText', editor: simpleEditor() },
          link(),
          { name: 'linkText', label: 'Link text', type: 'text', admin: { description: 'Shows a "Read more"-style link. Leave empty to link the title.' } },
        ],
        { admin: { condition: (_, s) => (s?.source ?? 'manual') === 'manual' } },
      ),
    ]),
    buttonsPanel(),
  ],

  design: {
    layout: [
      segmented(
        'arrangement',
        'Arrangement',
        [
          ['grid', 'Grid'],
          ['carousel', 'Carousel'],
        ],
        { default: 'grid' },
      ),
      segmented(
        'columns',
        'Columns',
        [
          ['1', 'One'],
          ['2', 'Two'],
          ['3', 'Three'],
          ['4', 'Four'],
        ],
        { default: '3' },
      ),
      segmented(
        'textAlign',
        'Text alignment',
        [
          ['left', 'Left', 'align-left'],
          ['center', 'Center', 'align-center'],
        ],
        { default: 'left', iconOnly: true },
      ),
      panel(
        'Carousel',
        [
          segmented(
            'advance',
            'Advance by',
            [
              ['one', 'One card'],
              ['view', 'A full view'],
            ],
            { default: 'one' },
          ),
          dropdown(
            'peek',
            'Next card peek',
            [
              ['none', 'None'],
              ['small', 'Small'],
              ['medium', 'Medium'],
              ['large', 'Large'],
            ],
            { default: 'small' },
          ),
          dropdown(
            'controlsPosition',
            'Controls',
            [
              ['top-right', 'Top right'],
              ['bottom-left', 'Bottom left'],
              ['bottom-center', 'Bottom center'],
              ['bottom-right', 'Bottom right'],
              ['sides', 'Sides'],
              ['hidden', 'Hidden'],
            ],
            { default: 'top-right' },
          ),
          {
            type: 'row',
            fields: [toggle('showCounter', 'Slide counter', { width: '50%' }), toggle('showProgress', 'Progress bar', { width: '50%' })],
          },
        ],
        { when: carousel },
      ),
    ],
    size: [paddingFields()],
    part: {
      label: 'Cards',
      fields: [
        segmented(
          'cardStyle',
          'Card style',
          [
            ['plain', 'Plain'],
            ['flat', 'Flat'],
            ['bordered', 'Bordered'],
            ['overlay', 'Overlay'],
          ],
          { default: 'bordered' },
        ),
        dropdown(
          'cardShape',
          'Photo shape',
          [
            ['portrait', 'Portrait'],
            ['square', 'Square'],
            ['landscape', 'Landscape'],
            ['custom', 'Custom ratio'],
          ],
          { default: 'portrait', when: overlayImg },
        ),
        dropdown(
          'imageShape',
          'Photo shape',
          [
            ['fixed', 'Fixed height'],
            ['custom', 'Custom ratio'],
          ],
          { default: 'fixed', when: notOverlayImg },
        ),
        {
          type: 'row',
          fields: [
            { name: 'ratioW', label: 'Ratio width', type: 'number', min: 1, admin: { width: '50%', placeholder: '3', condition: (_, s) => customRatio.some((r) => matchesRule(r, s)) } },
            { name: 'ratioH', label: 'Ratio height', type: 'number', min: 1, admin: { width: '50%', placeholder: '2', condition: (_, s) => customRatio.some((r) => matchesRule(r, s)) } },
          ],
        },
        segmented(
          'cardTextPosition',
          'Text position',
          [
            ['top', 'Top', 'v-top'],
            ['center', 'Center', 'v-center'],
            ['bottom', 'Bottom', 'v-bottom'],
          ],
          { default: 'bottom', iconOnly: true, when: overlayImg },
        ),
        toggle('mediaRound', 'Round image corners', { when: surfacedImg }),
        segmented(
          'iconSize',
          'Icon size',
          [
            ['sm', 'S'],
            ['md', 'M'],
            ['lg', 'L'],
          ],
          { default: 'sm', when: isIcon },
        ),
        toggle('showNumbers', 'Show numbers', { when: { field: 'mediaType', in: ['image', 'none'] } }),
        {
          type: 'row',
          // Only once a card has link text to style (audit 1.78.0).
          admin: { condition: (_: unknown, s: any) => Array.isArray(s?.cards) && s.cards.some((c: any) => c?.linkText) && (s?.source ?? 'manual') === 'manual' },
          fields: [
            segmented(
              'ctaCase',
              'Link text case',
              [
                ['upper', 'Uppercase'],
                ['normal', 'Normal'],
              ],
              { default: 'upper', width: '50%' },
            ),
            segmented(
              'ctaSize',
              'Link text size',
              [
                ['sm', 'Small'],
                ['md', 'Medium'],
                ['lg', 'Large'],
              ],
              { default: 'sm', width: '50%' },
            ),
          ],
        },
      ],
    },
    color: [
      surfaceField(),
      segmented(
        'cardSurface',
        'Card surface',
        [
          ['light', 'White'],
          ['soft', 'Light wash'],
          ['primary', 'Dark'],
        ],
        { default: 'light', when: { field: 'cardStyle', in: ['flat', 'bordered'] } },
      ),
      segmented(
        'cardOverlay',
        'Overlay',
        [
          ['none', 'None'],
          ['gradient', 'Gradient'],
          ['wash', 'Wash'],
        ],
        { default: 'gradient', when: overlayImg },
      ),
    ],
    accents: [eyebrowRuleField(), entranceField()],
    advanced: [
      toggle('headBeside', 'Heading beside the cards'),
      toggle('stagger', 'Staggered cards', { when: { all: [{ field: 'arrangement', in: ['grid', null] }, { field: 'columns', in: ['2', '3', '4', null] }] } }),
      toggle('bleed', 'Run off the screen edge', { when: { all: [carousel, { field: 'headBeside', in: [true] }] } }),
      toggle('hoverReveal', 'Show card text on hover', { when: overlayImg }),
      toggle('altTint', 'Accent tint on every other photo', { when: overlayImg }),
      toggle('featureMiddle', 'Larger middle card', { when: { all: [{ field: 'arrangement', in: ['grid', null] }, { field: 'columns', in: ['3'] }] } }),
      toggle('duotone', 'Duotone photos', { when: { field: 'mediaType', in: ['image', null] } }),
    ],
  },
})

function matchesRule(r: WhenRule, s: any): boolean {
  if (r.all) return r.all.every((x) => matchesRule(x, s))
  return (r.in ?? []).includes(s?.[r.field!] ?? null)
}
