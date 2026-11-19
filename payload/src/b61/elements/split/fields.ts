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

export const B61Split = defineElement({
  slug: 'b61Split',
  name: 'Split',
  plural: 'Splits',
  mode: { field: 'imageSide', labels: { right: 'Image right', left: 'Image left' } },

  content: [
    panel('Heading', headingFields({ levels: ['h2', 'h3', 'h4'], after: [subheadsField()] })),

    bodyField(),

    buttonsPanel(),

    panel('Media', [
      segmented(
        'media',
        'Type',
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
      // No column count (Jay, 19 Nov 2026): the gallery arranges however many
      // photos there are to fill the media column, so a fourth photo just fits.
      segmented(
        'galleryLayout',
        'Gallery layout',
        [
          ['grid', 'Grid'],
          ['masonry', 'Masonry'],
          ['strip', 'Strip'],
        ],
        { default: 'grid', when: isGallery },
      ),
      videoLinkField((s) => s?.media === 'video'),
      dropdown(
        'imageShape',
        'Photo shape',
        [
          ['fixed', 'Fixed height'],
          ['portrait', 'Portrait'],
          ['square', 'Square'],
          ['landscape', 'Landscape'],
          ['wide', 'Wide'],
        ],
        { default: 'fixed', when: [isPhoto, { all: [isGallery, { field: 'galleryLayout', in: ['grid', 'strip', null] }] }] },
      ),
      {
        ...photo('badge', 'Badge'),
        admin: { description: 'A seal or award on the outer corner of the photo, e.g. an anniversary seal. A PNG with a see-through background works best.' },
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
      // Overlap only reads right when the text column fits its content (Jay, 19 Nov 2026).
      toggle('overlap', 'Overlap the image', { when: { field: 'columnHeight', in: ['fit', null] } }),
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
