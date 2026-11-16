import { defineElement, panel } from '../../kit/element'
import { dropdown, segmented, toggle } from '../../kit/controls'
import { bandHeadFields, entranceField, eyebrowRuleField, headingAlignField, list, paddingFields, surfaceField } from '../../kit/groups'
import { innerField, slideBlocks } from '../../inner'

/*
 * B61 CAROUSEL, port of Banner 61 Elements' B61 Carousel + Carousel Slide
 * (plugin 1.77.1). Each slide is a row holding the elements shown on it
 * (a Testimonial, a Split, a Framed Image...).
 */
export const B61Carousel = defineElement({
  slug: 'b61Carousel',
  name: 'Carousel',
  plural: 'Carousels',
  content: [
    panel('Heading', [
      ...bandHeadFields({ intro: true }),
      { name: 'label', label: 'Name for screen readers', type: 'text', admin: { description: 'Used only when there is no heading.', condition: (_, s) => !(s?.lines ?? []).length } },
    ]),
    list('slides', 'Slides', 'Slide', [
      { name: 'label', label: 'Name for screen readers', type: 'text' },
      innerField('content', 'Slide content', { only: slideBlocks }),
    ]),
  ],
  design: {
    layout: [
      segmented('perView', 'Slides in view', [['1', 'One'], ['2', 'Two'], ['3', 'Three'], ['4', 'Four']], { default: '1' }),
      headingAlignField(),
      panel('Carousel', [
        segmented('advance', 'Advance by', [['one', 'One slide'], ['view', 'A full view']], { default: 'one' }),
        dropdown('peek', 'Next slide peek', [['none', 'None'], ['small', 'Small'], ['medium', 'Medium'], ['large', 'Large']], { default: 'medium' }),
        dropdown(
          'controlsPosition',
          'Controls',
          [['top-right', 'Top right'], ['bottom-left', 'Bottom left'], ['bottom-center', 'Bottom center'], ['bottom-right', 'Bottom right'], ['sides', 'Sides'], ['hidden', 'Hidden']],
          { default: 'top-right' },
        ),
        {
          type: 'row',
          fields: [
            { ...toggle('showCounter', 'Slide counter', { width: '50%' }), defaultValue: true } as any,
            { ...toggle('showProgress', 'Progress bar', { width: '50%' }), defaultValue: true } as any,
          ],
        },
      ]),
    ],
    size: [paddingFields()],
    color: [surfaceField()],
    accents: [eyebrowRuleField(), entranceField()],
  },
})
