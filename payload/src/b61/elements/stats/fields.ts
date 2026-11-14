import { defineElement, panel } from '../../kit/element'
import { dropdown, segmented, toggle } from '../../kit/controls'
import { bandHeadFields, buttonsField, entranceField, eyebrowRuleField, list, paddingFields, surfaceField } from '../../kit/groups'

/*
 * B61 STATS BAND, built on the B61 editing kit (see ../../EDITING-STANDARD.md).
 * Port of Banner 61 Elements' B61 Stats Band (plugin 1.77.1); stored values match it.
 * Figures with one number ("412", "98%", "$2.5M") count up as they arrive.
 */
export const B61StatsBand = defineElement({
  slug: 'b61StatsBand',
  name: 'Stats Band',
  plural: 'Stats Bands',
  content: [
    panel('Heading', bandHeadFields({ intro: true })),
    list(
      'stats',
      'Stats',
      'Stat',
      [
        {
          type: 'row',
          fields: [
            { name: 'figure', label: 'Figure', type: 'text', admin: { width: '35%', placeholder: '96%' } },
            { name: 'label', label: 'Label', type: 'text', admin: { width: '65%' } },
          ],
        },
        { name: 'note', label: 'Note', type: 'text' },
      ],
    ),
    buttonsField(),
  ],
  design: {
    layout: [
      segmented('columns', 'Columns', [['1', 'One'], ['2', 'Two'], ['3', 'Three'], ['4', 'Four']], { default: '3' }),
      {
        type: 'row',
        fields: [
          segmented('labelPosition', 'Label position', [['below', 'Below'], ['above', 'Above']], { default: 'below', width: '50%' }),
          segmented('textAlign', 'Text alignment', [['left', 'Left', 'align-left'], ['center', 'Center', 'align-center']], { default: 'center', iconOnly: true, width: '50%' }),
        ],
      },
    ],
    size: [paddingFields()],
    part: {
      label: 'Stats',
      fields: [
        segmented('itemStyle', 'Stat style', [['plain', 'Plain'], ['divided', 'Divided'], ['boxed', 'Boxed'], ['inline', 'Inline']], { default: 'plain' }),
        toggle('flushEdges', 'Flush left edge', { when: { field: 'itemStyle', in: ['divided'] } }),
        segmented('figureScale', 'Figure size', [['large', 'Large'], ['medium', 'Medium'], ['small', 'Small']], {
          default: 'large',
          when: { field: 'itemStyle', in: ['plain', 'divided', 'boxed'] },
        }),
      ],
    },
    color: [
      { ...surfaceField(), defaultValue: 'soft' } as any,
      dropdown('itemSurface', 'Stat surface', [['card', 'Card'], ['light', 'Light'], ['soft', 'Soft'], ['dark', 'Dark'], ['accent', 'Accent'], ['outline', 'Outline']], {
        default: 'card',
        when: { field: 'itemStyle', in: ['boxed'] },
      }),
    ],
    accents: [eyebrowRuleField(), entranceField()],
  },
})
