import { defineElement, panel } from '../../kit/element'
import { videoLinkField } from '../../kit/video'
import { segmented, step, toggle, type WhenRule } from '../../kit/controls'
import {
  buttonsPanel,
  entranceField,
  eyebrowRuleField,
  frameColorField,
  headingAlignField,
  headingFields,
  list,
  onlyImages,
  paddingFields,
  photo,
  subheadsField,
  surfaceField,
} from '../../kit/groups'
import { dropdown } from '../../kit/controls'
import { bodyField } from '../../kit/body'

/*
 * B61 SPLIT, built on the B61 editing kit (see ../../EDITING-STANDARD.md).
 * Port of Banner 61 Elements' B61 Split (plugin 1.77.1); stored values match it.
 *
 * Text on one side, a photo, a gallery or a video on the other.
 * Differences from the Breakdance form, on purpose:
 * - Media's shape choices (Photo / Gallery / Video) are one control, first in
 *   the Media panel, instead of two (Media type, then Show).
 * - Heading level defaults to Automatic (H2 unless the Split opens the page).
 * - Video is a YouTube or Vimeo link that loads only when played.
 * - Focal point comes from the photo itself (set once in Media).
 */

const isPhoto: WhenRule = { field: 'media', in: ['photo'] }
const isGallery: WhenRule = { field: 'media', in: ['gallery'] }
const isVideo: WhenRule = { field: 'media', in: ['video'] }
const anyImage: WhenRule = { field: 'media', in: ['photo', 'gallery'] }

export const B61Split = defineElement({
  slug: 'b61Split',
  name: 'Split',
  plural: 'Splits',
  mode: { field: 'imageSide', labels: { right: 'Image right', left: 'Image left' } },

  content: [
    panel('Heading', [...headingFields({ levels: ['h2', 'h3', 'h4'] }), subheadsField()]),

    bodyField(),

    buttonsPanel(),

    panel('Media', [
      segmented(
        'media',
        'Show',
        [
          ['photo', 'Photo', 'image'],
          ['gallery', 'Gallery', 'slideshow'],
          ['video', 'Video', 'video'],
        ],
        { default: 'photo' },
      ),
      photo('image', 'Photo', { when: isPhoto }),
      { name: 'caption', label: 'Caption', type: 'text', admin: { condition: (_, s) => (s?.media ?? 'photo') === 'photo' } },
      list(
        'images',
        'Photos',
        'Photo',
        [
          { name: 'image', type: 'upload', relationTo: 'media', filterOptions: onlyImages, required: true },
          { name: 'caption', label: 'Caption', type: 'text' },
        ],
        { admin: { condition: (_, s) => s?.media === 'gallery' } },
      ),
      segmented(
        'columns',
        'Columns',
        [
          ['1', 'One'],
          ['2', 'Two'],
          ['3', 'Three'],
        ],
        { default: '2', when: isGallery },
      ),
      videoLinkField((s) => s?.media === 'video'),
      segmented(
        'imageShape',
        'Photo shape',
        [
          ['fixed', 'Fixed'],
          ['portrait', 'Portrait'],
          ['square', 'Square'],
          ['landscape', 'Landscape'],
          ['wide', 'Wide'],
        ],
        { default: 'fixed', when: anyImage },
      ),
      {
        ...photo('badge', 'Badge'),
        admin: { description: 'Optional. A seal or award on the outer corner of the photo, e.g. an anniversary seal. A PNG with a see-through background works best.' },
      } as any,
    ]),
  ],

  design: {
    layout: [
      {
        type: 'row',
        fields: [
          segmented(
            'imageSide',
            'Image side',
            [
              ['left', 'Left', 'side-left'],
              ['right', 'Right', 'side-right'],
            ],
            { default: 'right', width: '50%' },
          ),
          segmented(
            'verticalPosition',
            'Vertical position',
            [
              ['top', 'Top', 'v-top'],
              ['center', 'Center', 'v-center'],
            ],
            { default: 'center', iconOnly: true, width: '50%' },
          ),
        ],
      },
      segmented(
        'stackOrder',
        'On phones, show first',
        [
          ['text', 'Text'],
          ['media', 'Media'],
        ],
        { default: 'text' },
      ),
      segmented(
        'columnHeight',
        'Text column height',
        [
          ['fit', 'Fit content'],
          ['fill', 'Match the image'],
        ],
        { default: 'fit' },
      ),
      toggle('overlap', 'Overlap the image'),
      headingAlignField(),
      step('columnBalance', 'Column balance', { low: 'More media', high: 'More text' }),
    ],
    size: [paddingFields()],
    color: [
      surfaceField(),
      dropdown(
        'textPanel',
        'Text panel',
        [
          ['none', 'None'],
          ['plain', 'White card'],
          ['soft', 'Light wash'],
          ['dark', 'Dark'],
          ['accent', 'Accent'],
        ],
        { default: 'none' },
      ),
      frameColorField(),
    ],
    accents: [eyebrowRuleField(), entranceField()],
  },
})
