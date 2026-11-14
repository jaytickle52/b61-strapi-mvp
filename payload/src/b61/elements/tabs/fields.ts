import { defineElement, panel } from '../../kit/element'
import { segmented, toggle } from '../../kit/controls'
import { bandHeadFields, entranceField, eyebrowRuleField, headingAlignField, list, paddingFields, surfaceField } from '../../kit/groups'
import { innerField } from '../../inner'

/*
 * B61 TABS, port of Banner 61 Elements' B61 Tabs + B61 Tab (plugin 1.77.1).
 * In Breakdance a Tab is a child element; here each tab is a row with its
 * label and the elements shown in its panel (Prose, Split, Card Grid...).
 */
export const B61Tabs = defineElement({
  slug: 'b61Tabs',
  name: 'B61 Tabs',
  mode: { field: 'tabPosition', labels: { top: 'Tabs on top', left: 'Tabs left', right: 'Tabs right' } },
  content: [
    panel('Heading', bandHeadFields({ intro: true })),
    list('tabs', 'Tabs', 'Tab', [
      { name: 'label', label: 'Label', type: 'text', required: true },
      innerField('content', 'Panel', { description: 'What shows when this tab is selected.' }),
    ]),
    { ...toggle('firstItemOpen', 'First tab open'), defaultValue: true } as any,
  ],
  design: {
    layout: [
      segmented('tabPosition', 'Tab position', [['top', 'Top'], ['left', 'Left', 'side-left'], ['right', 'Right', 'side-right']], { default: 'top' }),
      segmented('tabAlign', 'Tab alignment', [['left', 'Left'], ['center', 'Center'], ['full', 'Full width']], { default: 'left', when: [{ field: 'tabPosition', in: ['top', null] }] }),
      headingAlignField(),
    ],
    size: [paddingFields()],
    color: [surfaceField()],
    accents: [eyebrowRuleField(), entranceField()],
  },
})
