import { defineElement, panel } from '../../kit/element'
import { segmented, toggle } from '../../kit/controls'
import { bandHeadFields, entranceField, eyebrowRuleField, headingAlignField, list, paddingFields, photo, surfaceField } from '../../kit/groups'

/* B61 PILLARS (Feature Tabs), port of Banner 61 Elements' B61 Pillars (plugin 1.77.1). */
export const B61Pillars = defineElement({
  slug: 'b61Pillars',
  name: 'B61 Pillars',
  mode: { field: 'tabPosition', labels: { left: 'Tabs left', right: 'Tabs right', top: 'Tabs on top' } },
  content: [
    panel('Heading', bandHeadFields({ intro: true })),
    list('items', 'Tabs', 'Tab', [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'body', label: 'Description', type: 'richText' },
      photo('image', 'Photo'),
    ]),
    { ...toggle('firstItemOpen', 'First tab open'), defaultValue: true } as any,
  ],
  design: {
    layout: [
      segmented('tabPosition', 'Tab position', [['left', 'Left', 'side-left'], ['right', 'Right', 'side-right'], ['top', 'Top']], { default: 'left' }),
      segmented('tabAlign', 'Tab alignment', [['left', 'Left'], ['center', 'Center'], ['full', 'Full width']], { default: 'left', when: { field: 'tabPosition', in: ['top'] } }),
      headingAlignField(),
    ],
    size: [paddingFields()],
    color: [surfaceField()],
    accents: [eyebrowRuleField(), entranceField()],
  },
})
