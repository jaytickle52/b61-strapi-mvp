import { defineElement, panel } from '../../kit/element'
import { segmented, step, toggle } from '../../kit/controls'
import { entranceField, eyebrowRuleField, paddingFields, photo, surfaceField } from '../../kit/groups'

/*
 * B61 TESTIMONIAL, built on the B61 editing kit (see ../../EDITING-STANDARD.md).
 * Port of Banner 61 Elements' B61 Testimonial (plugin 1.77.1); stored values match it.
 */
export const B61Testimonial = defineElement({
  slug: 'b61Testimonial',
  name: 'Testimonial',
  plural: 'Testimonials',
  content: [
    panel('Quote', [
      { name: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { name: 'quote', label: 'Quote', type: 'textarea', required: true, admin: { rows: 3 } },
      { name: 'attribution', label: 'Attribution', type: 'text' },
      { ...photo('watermark', 'Watermark logo'), admin: { description: 'A faint logo behind the quote.' } },
    ]),
  ],
  design: {
    layout: [
      {
        type: 'row',
        fields: [
          segmented('textAlign', 'Text alignment', [['left', 'Left', 'align-left'], ['center', 'Center', 'align-center']], { default: 'center', iconOnly: true, width: '50%' }),
          segmented('textStyle', 'Quote text', [['italic', 'Italic'], ['normal', 'Normal']], { default: 'italic', width: '50%' }),
        ],
      },
    ],
    size: [step('widthStep', 'Width', { low: 'Narrow', high: 'Wide' }), paddingFields()],
    color: [surfaceField()],
    accents: [
      eyebrowRuleField(),
      { ...toggle('showMark', 'Show quotation mark'), defaultValue: true } as any,
      toggle('markRoom', 'Space above the mark', { when: { field: 'showMark', in: [true] } }),
      entranceField(),
    ],
  },
})
