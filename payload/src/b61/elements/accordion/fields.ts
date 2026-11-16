import { simpleEditor } from '../../kit/editors'
import { defineElement, panel } from '../../kit/element'
import { dropdown, segmented, step, toggle } from '../../kit/controls'
import { bandHeadFields, buttonsPanel, entranceField, eyebrowRuleField, headingAlignField, list, paddingFields, surfaceField, ITEM_SURFACES } from '../../kit/groups'

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
          { name: 'subtitle', label: 'Tag', type: 'text', admin: { width: '35%', placeholder: 'e.g. Fall' } },
        ],
      },
      { name: 'body', label: 'Body', type: 'richText', editor: simpleEditor() },
    ]),
    // Marks the items as questions and answers for search engines (schema.org FAQPage).
    { ...toggle('faq', 'These are questions and answers'), admin: { description: 'Search engines and AI tools read each title as a question and its body as the answer.' } } as any,
    // How the items open is behaviour, so it sits in Content as on Tabs (audit 1.78.0).
    { ...toggle('firstItemOpen', 'First item open'), defaultValue: true } as any,
    { ...toggle('singleOpen', 'One open at a time'), defaultValue: true } as any,
    buttonsPanel(),
  ],
  design: {
    layout: [headingAlignField()],
    size: [step('widthStep', 'Width', { low: 'Narrow', high: 'Wide' }), paddingFields()],
    part: {
      label: 'Items',
      fields: [
        segmented('itemStyle', 'Item style', [['divided', 'Divided'], ['boxed', 'Boxed'], ['separated', 'Separated']], { default: 'divided' }),
        segmented('iconStyle', 'Icon', [['chevron', 'Chevron'], ['plusminus', 'Plus / minus']], { default: 'chevron' }),
        { ...toggle('showNumbers', 'Show numbers'), defaultValue: true } as any,
      ],
    },
    color: [
      surfaceField(),
      dropdown('itemSurface', 'Item surface', ITEM_SURFACES, {
        default: 'card',
        when: { field: 'itemStyle', in: ['boxed', 'separated'] },
      }),
    ],
    accents: [eyebrowRuleField(), entranceField()],
  },
})
