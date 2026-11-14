import { defineElement, panel } from '../../kit/element'
import { segmented, step, type WhenRule } from '../../kit/controls'
import {
  buttonsField,
  entranceField,
  eyebrowRuleField,
  headingFields,
  list,
  onlyImages,
  onlyVideos,
  paddingFields,
  photo,
  textAlignField,
} from '../../kit/groups'

/*
 * B61 HERO, built on the B61 editing kit (see ../../EDITING-STANDARD.md).
 * Port of Banner 61 Elements' B61 Hero (plugin 1.77.1); stored values match it.
 *
 * Differences from the Breakdance form, on purpose:
 * - Cover / Band is the first choice on Content, because it decides what the
 *   editor supplies (background vs collage).
 * - Subheadline Scale comes before the text it switches.
 * - Column balance sits in Layout (it is arrangement, and Band only).
 * - Heading level defaults to Automatic (H1 first on the page, H2 after).
 */

const cover: WhenRule = { field: 'layoutMode', in: ['cover'] }
const band: WhenRule = { field: 'layoutMode', in: ['band'] }
const coverBg = (t: string) => (_: unknown, s: any) => s?.layoutMode !== 'band' && (s?.backgroundType ?? 'image') === t

export const B61Hero = defineElement({
  slug: 'b61Hero',
  name: 'B61 Hero',
  plural: 'B61 Heroes',
  mode: { field: 'layoutMode', labels: { cover: 'Cover', band: 'Band' } },

  content: [
    segmented(
      'layoutMode',
      'Hero type',
      [
        ['cover', 'Cover photo', 'cover'],
        ['band', 'Band with collage', 'band'],
      ],
      { default: 'cover' },
    ),

    panel('Heading', headingFields()),

    panel('Subheadline', [
      segmented(
        'subheadlineScale',
        'Scale',
        [
          ['display', 'Normal'],
          ['body', 'Large'],
          ['meta', 'Meta line'],
        ],
        { default: 'body' },
      ),
      {
        name: 'subheadline',
        label: 'Text',
        type: 'textarea',
        admin: { rows: 2, condition: (_, s) => s?.subheadlineScale !== 'meta' },
      },
      list('metaItems', 'Items', 'Item', [{ name: 'text', label: 'Text', type: 'text', required: true }], {
        admin: {
          condition: (_, s) => s?.subheadlineScale === 'meta',
          description: 'Short facts, e.g. "Grades PK-8", "Est. 1951".',
        },
      }),
    ]),

    buttonsField(),

    panel(
      'Background',
      [
        segmented(
          'backgroundType',
          'Type',
          [
            ['image', 'Image', 'image'],
            ['slideshow', 'Slideshow', 'slideshow'],
            ['video', 'Video', 'video'],
          ],
          { default: 'image' },
        ),
        photo('image', 'Image', { condition: coverBg('image') }),
        list('slides', 'Slides', 'Slide', [{ name: 'image', type: 'upload', relationTo: 'media', filterOptions: onlyImages, required: true }], {
          minRows: 2,
          admin: { condition: coverBg('slideshow') },
        }),
        {
          type: 'row',
          admin: { condition: coverBg('video') },
          fields: [
            { name: 'video', label: 'Video', type: 'upload', relationTo: 'media', filterOptions: onlyVideos, admin: { width: '50%' } },
            { name: 'videoWebm', label: 'WebM version (optional)', type: 'upload', relationTo: 'media', filterOptions: onlyVideos, admin: { width: '50%' } },
          ],
        },
        {
          name: 'poster',
          label: 'Video poster',
          type: 'upload',
          relationTo: 'media',
          filterOptions: onlyImages,
          admin: {
            condition: coverBg('video'),
            description: 'Shows while the video loads, if autoplay is blocked, and when motion is turned off.',
          },
        },
        {
          name: 'overlayStrength',
          label: 'Overlay strength (%)',
          type: 'number',
          min: 80,
          max: 100,
          admin: { step: 5, placeholder: 'Default', width: '50%' },
        },
      ],
      { when: cover },
    ),

    list('collage', 'Collage', 'Photo', [{ name: 'image', type: 'upload', relationTo: 'media', filterOptions: onlyImages, required: true }], {
      maxRows: 3,
      admin: { condition: (_, s) => s?.layoutMode === 'band', description: '1 to 3 photos beside the text.' },
    }),
  ],

  design: {
    layout: [
      segmented(
        'height',
        'Height',
        [
          ['short', 'Short'],
          ['medium', 'Medium'],
          ['tall', 'Tall'],
          ['full', 'Full'],
        ],
        { default: 'tall', when: cover },
      ),
      segmented(
        'bandSize',
        'Band height',
        [
          ['compact', 'Compact'],
          ['standard', 'Standard'],
        ],
        { default: 'standard', when: band },
      ),
      {
        type: 'row',
        fields: [
          segmented(
            'verticalPosition',
            'Vertical position',
            [
              ['top', 'Top', 'v-top'],
              ['center', 'Center', 'v-center'],
              ['bottom', 'Bottom', 'v-bottom'],
            ],
            { default: 'bottom', when: cover, iconOnly: true, width: '50%' },
          ),
          { ...textAlignField(), admin: { ...(textAlignField() as any).admin, width: '50%' } },
        ],
      },
      step('columnBalance', 'Column balance', { low: 'More photo', high: 'More text', when: band }),
    ],
    size: [step('subheadlineWidth', 'Subheadline width', { low: 'Narrow', high: 'Wide' }), paddingFields()],
    color: [
      segmented(
        'overlay',
        'Overlay',
        [
          ['gradient', 'Gradient'],
          ['wash', 'Wash'],
        ],
        { default: 'gradient', when: cover },
      ),
      // Overlay + surface resolve to one scheme that carries its own text
      // colours, so no reachable combination fails contrast.
      segmented(
        'surface',
        'Surface',
        [
          ['light', 'Light'],
          ['primary', 'Primary'],
          ['secondary', 'Secondary'],
        ],
        { default: 'primary', when: [band, { field: 'overlay', in: ['wash'] }] },
      ),
    ],
    accents: [eyebrowRuleField(), entranceField()],
  },
})
