import { defineElement, panel } from '../../kit/element'
import { videoLinkField } from '../../kit/video'
import { dropdown, segmented, step, toggle, type WhenRule } from '../../kit/controls'
import { bandHeadFields, buttonsPanel, entranceField, eyebrowRuleField, headingAlignField, list, onlyImages, paddingFields, photo, surfaceField } from '../../kit/groups'

/*
 * B61 GALLERY, port of Banner 61 Elements' B61 Gallery (plugin 1.77.1).
 * As in Split, the plugin's two media choices (Media type, then Show) are one
 * control: Photo / Gallery / Video. Video is a YouTube or Vimeo link.
 */
const isGallery: WhenRule = { field: 'media', in: ['gallery', null] }
const isStrip: WhenRule = { all: [isGallery, { field: 'galleryLayout', in: ['strip', null] }] }
const notStrip: WhenRule = { all: [isGallery, { field: 'galleryLayout', in: ['grid', 'masonry'] }] }

export const B61Gallery = defineElement({
  slug: 'b61Gallery',
  name: 'Gallery',
  plural: 'Galleries',
  open: 'Media',
  mode: { field: 'galleryLayout', labels: { strip: 'Strip', grid: 'Grid', masonry: 'Masonry' } },
  content: [
    panel('Heading', bandHeadFields({ intro: true })),
    panel('Media', [
      segmented('media', 'Type', [['photo', 'Photo', 'image'], ['gallery', 'Gallery', 'slideshow'], ['video', 'Video', 'video']], { default: 'gallery' }),
      photo('image', 'Photo', { when: { field: 'media', in: ['photo'] } }),
      { name: 'caption', label: 'Caption', type: 'text', admin: { condition: (_, s) => s?.media === 'photo' } },
      list(
        'images',
        'Photos',
        'Photo',
        [
          { name: 'image', type: 'upload', relationTo: 'media', filterOptions: onlyImages, required: true },
          { name: 'caption', label: 'Caption', type: 'text' },
        ],
        { admin: { condition: (_, s) => (s?.media ?? 'gallery') === 'gallery' } },
      ),
      {
        name: 'scrollHint',
        label: 'Scroll hint',
        type: 'text',
        defaultValue: 'Scroll',
        admin: { condition: (_, s) => (s?.media ?? 'gallery') === 'gallery' && (s?.galleryLayout ?? 'strip') === 'strip' },
      },
      videoLinkField((s) => s?.media === 'video'),
    ]),
    buttonsPanel(),
  ],
  design: {
    layout: [
      segmented('galleryLayout', 'Gallery layout', [['strip', 'Strip'], ['grid', 'Grid'], ['masonry', 'Masonry']], { default: 'strip', when: isGallery }),
      segmented('textPosition', 'Text position', [['above', 'Above'], ['beside', 'Beside']], {
        default: 'above',
        description: 'A strip always has its text above.',
      }),
      headingAlignField(),
      step('balanceStep', 'Column balance', { low: 'More media', high: 'More text', when: { field: 'textPosition', in: ['beside'] } }),
    ],
    size: [paddingFields()],
    part: {
      label: 'Photos',
      fields: [
        segmented('itemSize', 'Photo size', [['small', 'Small'], ['medium', 'Medium'], ['large', 'Large']], { default: 'medium', when: isStrip }),
        dropdown('columns', 'Columns', [['2', 'Two'], ['3', 'Three'], ['4', 'Four']], { default: '3', when: notStrip }),
        segmented(
          'imageShape',
          'Photo shape',
          [['fixed', 'Fixed height'], ['portrait', 'Portrait'], ['square', 'Square'], ['landscape', 'Landscape'], ['wide', 'Wide']],
          { default: 'fixed', condition: (_, s) => s?.media !== 'video' && s?.galleryLayout !== 'masonry' },
        ),
      ],
    },
    color: [surfaceField()],
    accents: [eyebrowRuleField(), entranceField()],
    advanced: [toggle('duotone', 'Duotone photos', { when: { field: 'media', in: ['gallery', 'photo', null] } })],
  },
})
