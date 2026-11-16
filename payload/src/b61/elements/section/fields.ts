import { defineElement, panel } from '../../kit/element'
import { dropdown, segmented, step, toggle, type WhenRule } from '../../kit/controls'
import { entranceField, paddingFields, photo } from '../../kit/groups'
import { innerField } from '../../inner'

/*
 * B61 SECTION, port of Banner 61 Elements' B61 Section + B61 Sidebar (plugin
 * 1.77.1). A band that holds other elements, full width or with a side column
 * (a B61 Rail of buttons and links, or any element).
 */
const hasRail: WhenRule = { field: 'columns', in: ['rail-right', 'rail-left'] }
const hasPhoto: WhenRule = { field: 'image', filled: true }

export const B61Section = defineElement({
  slug: 'b61Section',
  name: 'Section',
  plural: 'Sections',
  mode: { field: 'columns', labels: { full: 'Full width', 'rail-right': 'Side column right', 'rail-left': 'Side column left' } },
  content: [
    innerField('content', 'Main column', { description: 'The elements in this section, top to bottom.' }),
    innerField('side', 'Side column', {
      rail: true,
      description: 'Usually one Rail (buttons and a link list).',
      condition: (_: unknown, s: any) => s?.columns === 'rail-right' || s?.columns === 'rail-left',
    }),
    panel('Background photo', [
      photo('image', 'Photo'),
      { name: 'overlayStrength', label: 'Overlay strength (%)', type: 'number', min: 0, max: 100, admin: { step: 5, placeholder: '70', description: 'Check the words stay easy to read over the photo (70% is a safe start).', condition: (_, s) => Boolean(s?.image) } },
    ]),
  ],
  design: {
    layout: [
      dropdown('columns', 'Columns', [['full', 'Full width'], ['rail-right', 'Main + right column'], ['rail-left', 'Main + left column']], { default: 'full' }),
      toggle('railSticky', 'Sticky side column', { when: hasRail }),
      segmented('railAlign', 'Side column alignment', [['start', 'Top', 'v-top'], ['center', 'Center', 'v-center']], {
        default: 'start',
        when: [{ all: [hasRail, { field: 'railSticky', in: [false, null] }] }],
      }),
      dropdown('railStack', 'On tablets and phones', [['source', 'Page order'], ['rail-first', 'Side column first'], ['rail-last', 'Side column last']], { default: 'source', when: hasRail }),
      toggle('pullUp', 'Pull up over the band above'),
    ],
    size: [step('railWidthStep', 'Side column width', { low: 'Narrow', high: 'Wide', when: hasRail }), paddingFields()],
    part: {
      label: 'Background',
      fields: [
        toggle('patternOn', 'Pattern'),
        photo('patternImage', 'Tile image (optional)', { when: { field: 'patternOn', in: [true] } }),
        {
          type: 'row',
          admin: { condition: (_: unknown, s: any) => Boolean(s?.patternOn) },
          fields: [
            { name: 'tileSize', label: 'Tile size (px)', type: 'number', min: 4, max: 600, admin: { width: '50%' } },
            { name: 'patternStrength', label: 'Strength (%)', type: 'number', min: 1, max: 100, admin: { width: '50%', placeholder: '6', step: 1 } },
          ],
        },
        toggle('watermarkOn', 'Watermark'),
        photo('watermarkImage', 'Watermark image', { when: { field: 'watermarkOn', in: [true] } }),
        {
          type: 'row',
          admin: { condition: (_: unknown, s: any) => Boolean(s?.watermarkOn) },
          fields: [
            { name: 'watermarkSize', label: 'Size (% of width)', type: 'number', min: 5, max: 100, admin: { width: '50%' } },
            { name: 'watermarkStrength', label: 'Strength (%)', type: 'number', min: 0, max: 30, admin: { width: '50%' } },
          ],
        },
      ],
    },
    color: [segmented('surface', 'Surface', [['none', 'None'], ['plain', 'White'], ['soft', 'Light wash'], ['dark', 'Dark'], ['accent', 'Accent']], { default: 'none' })],
    accents: [entranceField()],
    advanced: [
      toggle('duotone', 'Duotone photo', { when: hasPhoto }),
    ],
  },
})
