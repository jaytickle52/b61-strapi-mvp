import { simpleEditor } from '../../kit/editors'
import { defineElement, panel } from '../../kit/element'
import { dropdown, segmented, step, toggle } from '../../kit/controls'
import { bandHeadFields, buttonsField, entranceField, eyebrowRuleField, headingAlignField, list, paddingFields, surfaceField } from '../../kit/groups'

/* B61 ACCORDION, port of Banner 61 Elements' B61 Accordion (Sport_Accordion, plugin 1.77.1). */
export const B61Accordion = defineElement({
  slug: 'b61Accordion',
  name: 'Accordion',
  plural: 'Accordions',
  content: [
    panel('Heading', bandHeadFields({ intro: true })),
    list('items', 'Items', 'Item', [
      {
        type: 'row',
        fields: [
          { name: 'title', label: 'Title', type: 'text', required: true, admin: { width: '65%' } },
          { name: 'subtitle', label: 'Meta label', type: 'text', admin: { width: '35%', placeholder: 'e.g. Fall' } },
        ],
      },
      { name: 'body', label: 'Body', type: 'richText', editor: simpleEditor() },
    ]),
    buttonsField(),
  ],
  design: {
    layout: [headingAlignField()],
    size: [step('widthStep', 'Width', { low: 'Narrow', high: 'Wide' }), paddingFields()],
    part: {
      label: 'Items',
      fields: [
        segmented('itemStyle', 'Item style', [['divided', 'Divided'], ['boxed', 'Boxed'], ['separated', 'Separated']], { default: 'divided' }),
        segmented('iconStyle', 'Icon', [['chevron', 'Chevron'], ['plusminus', 'Plus / minus']], { default: 'chevron' }),
        { ...toggle('singleOpen', 'One open at a time'), defaultValue: true } as any,
        { ...toggle('firstItemOpen', 'First item open'), defaultValue: true } as any,
        { ...toggle('showNumbers', 'Show numbers'), defaultValue: true } as any,
      ],
    },
    color: [
      surfaceField(),
      dropdown('itemSurface', 'Item surface', [['card', 'Card'], ['light', 'Light'], ['soft', 'Soft'], ['dark', 'Dark'], ['accent', 'Accent'], ['outline', 'Outline']], {
        default: 'card',
        when: { field: 'itemStyle', in: ['boxed', 'separated'] },
      }),
    ],
    accents: [eyebrowRuleField(), entranceField()],
  },
})
