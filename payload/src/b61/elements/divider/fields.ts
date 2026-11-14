import { defineElement, panel } from '../../kit/element'
import { dropdown, segmented, step } from '../../kit/controls'
import { entranceField, photo } from '../../kit/groups'

/* B61 DIVIDER, port of Banner 61 Elements' B61 Divider (plugin 1.77.1). */
export const B61Divider = defineElement({
  slug: 'b61Divider',
  name: 'B61 Divider',
  content: [
    panel('Divider', [
      segmented('lineStyle', 'Show', [['rule', 'A line'], ['ornament', 'An ornament image']], { default: 'rule' }),
      photo('ornament', 'Ornament image', { when: { field: 'lineStyle', in: ['ornament'] } }),
    ]),
  ],
  design: {
    layout: [
      segmented('alignment', 'Alignment', [['left', 'Left', 'align-left'], ['center', 'Center', 'align-center'], ['right', 'Right']], { default: 'center' }),
    ],
    size: [step('widthStep', 'Width', { low: 'Short', high: 'Long' })],
    part: {
      label: 'Line',
      fields: [
        segmented('weight', 'Weight', [['hairline', 'Hairline'], ['regular', 'Regular'], ['heavy', 'Heavy']], {
          default: 'regular',
          when: [{ field: 'lineStyle', in: ['rule', null] }],
        }),
      ],
    },
    color: [
      segmented('lineColor', 'Line color', [['accent', 'Accent'], ['ink', 'Ink'], ['muted', 'Muted']], {
        default: 'accent',
        when: [{ field: 'lineStyle', in: ['rule', null] }],
      }),
    ],
    accents: [entranceField()],
  },
})
