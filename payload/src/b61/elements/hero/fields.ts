import { defineElement, panel } from '../../kit/element'
import { bunnyBackgroundField } from '../../kit/video'
import { splitWords } from './words'
import { emphasizedPhrase, headingText } from '../../kit/heading'
import { dropdown, link, segmented, step, unit, type WhenRule } from '../../kit/controls'
import type { NumberField } from 'payload'
import {
  buttonsPanel,
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
 * - Column balance sits in Layout (it is arrangement, and Band only).
 * - Heading level defaults to Automatic (H1 first on the page, H2 after).
 */

/**
 * Changing words take turns with the heading's first emphasized words. Older
 * content listed every word, the first of them in the heading as typed; that
 * still works (parts.tsx).
 */
function validateChangingWords(value: unknown, { siblingData }: any): true | string {
  const words = splitWords(value)
  if (!words.length) return true
  if (words.length > 1 && headingText(siblingData?.heading).includes(words[0])) return true
  if (emphasizedPhrase(siblingData?.heading)) return true
  return 'Emphasize the words in the heading that should change (select them, then press Emphasize).'
}

const cover: WhenRule = { field: 'layoutMode', in: ['cover'] }
const band: WhenRule = { field: 'layoutMode', in: ['band'] }
const split: WhenRule = { field: 'layoutMode', in: ['split'] }
// Split, Big headline and Band sit on a coloured surface; Cover on a photo.
const onSurface: WhenRule = { field: 'layoutMode', in: ['band', 'split', 'type'] }
const isCover = (s: any) => (s?.layoutMode ?? 'cover') === 'cover'
const coverBg = (t: string) => (_: unknown, s: any) => isCover(s) && (s?.backgroundType ?? 'image') === t

export const B61Hero = defineElement({
  slug: 'b61Hero',
  name: 'Hero',
  plural: 'Heroes',
  open: 'Heading',
  mode: { field: 'layoutMode', labels: { cover: 'Cover', band: 'Band', split: 'Split', type: 'Big headline' } },

  content: [
    // A dropdown: four two-word choices crowd a row of buttons (EDITING-STANDARD.md section 4).
    dropdown(
      'layoutMode',
      'Hero type',
      [
        ['cover', 'Cover photo'],
        ['band', 'Band with collage'],
        ['split', 'Split screen'],
        ['type', 'Big headline'],
      ],
      { default: 'cover' },
    ),

    panel(
      'Heading',
      headingFields({
        after: [
          {
            name: 'changingWords',
            label: 'Changing words',
            type: 'text',
            validate: validateChangingWords,
            admin: {
              placeholder: 'e.g. Learning, Missions, Athletics',
              description: 'Words that take turns with the emphasized words, separated by commas. Works best at the end of the heading.',
            },
          },
          // One subheadline style (Jay, 19 Nov 2026): the body font.
          { name: 'subheadline', label: 'Subheadline', type: 'textarea', admin: { rows: 2 } },
        ],
      }),
    ),

    buttonsPanel(),

    // A trail above the eyebrow on inner pages, e.g. Banner Connect / Use Cases / For Enrollment.
    panel(
      'Breadcrumb',
      [
        list(
          'breadcrumb',
          'Breadcrumb',
          'Step',
          [
            { name: 'label', type: 'text', required: true },
            link(),
          ],
          {
            maxRows: 5,
            admin: {
              description: 'Optional. The pages above this one, in order; the last step is this page and needs no link. Leave a step\'s link empty to show it as plain text.',
              initCollapsed: true,
            },
          },
        ),
      ],
      { open: false },
    ),

    panel(
      'Background',
      [
        segmented(
          'backgroundType',
          'Type',
          [
            ['image', 'Photo', 'image'],
            ['slideshow', 'Slideshow', 'slideshow'],
            ['video', 'Video', 'video'],
          ],
          { default: 'image', when: cover },
        ),
        // Split screen uses the same photo field: one photo filling its half.
        photo('image', 'Photo', { condition: (d: unknown, s: any) => coverBg('image')(d, s) || s?.layoutMode === 'split' }),
        list('slides', 'Slides', 'Slide', [{ name: 'image', type: 'upload', relationTo: 'media', filterOptions: onlyImages, required: true }], {
          minRows: 2,
          admin: { condition: coverBg('slideshow') },
        }),
        {
          type: 'row',
          admin: { condition: coverBg('video') },
          fields: [
            // Old video files from the Photos library: hidden, still played until moved to Bunny (src/video/moveToBunny.ts).
            { name: 'video', label: 'Video file (old)', type: 'upload', relationTo: 'media', filterOptions: onlyVideos, admin: { width: '50%', hidden: true } },
            { name: 'videoWebm', label: 'Backup video (old)', type: 'upload', relationTo: 'media', filterOptions: onlyVideos, admin: { width: '50%', hidden: true } },
          ],
        },
        bunnyBackgroundField((s: any) => coverBg('video')(undefined, s)),
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
        unit({
          name: 'overlayStrength',
          label: 'Overlay strength',
          type: 'number',
          min: 0,
          max: 100,
          admin: {
            step: 5,
            placeholder: 'Default',
            width: '50%',
            description: 'Below 80%, check the words stay easy to read over the photo.',
            condition: (_: unknown, s: any) => isCover(s),
          },
        } as NumberField, '%'),
      ],
      { when: [cover, split] },
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
        'Height',
        [
          ['compact', 'Compact'],
          ['standard', 'Standard'],
        ],
        { default: 'standard', when: onSurface },
      ),
      segmented(
        'splitSide',
        'Photo side',
        [
          ['right', 'Right', 'side-right'],
          ['left', 'Left', 'side-left'],
        ],
        { default: 'right', when: split },
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
          ['light', 'White'],
          ['primary', 'Dark'],
          ['secondary', 'Secondary'],
        ],
        { default: 'primary', when: [onSurface, { field: 'overlay', in: ['wash'] }] },
      ),
    ],
    accents: [eyebrowRuleField(), entranceField()],
  },
})
