import { defineElement, panel } from '../../kit/element'
import { dropdown, link, segmented } from '../../kit/controls'
import { entranceField } from '../../kit/groups'

/* B61 BUTTON BAR, port of Banner 61 Elements' B61 Button Bar (plugin 1.77.1): two big half-width links. */
const COLORS: [string, string][] = [['dark', 'Dark'], ['accent', 'Accent'], ['soft', 'Light wash'], ['plain', 'White']]
export const B61ButtonBar = defineElement({
  slug: 'b61ButtonBar',
  name: 'Button Bar',
  plural: 'Button Bars',
  content: [
    panel('First button', [{ name: 'firstLabel', label: 'Label', type: 'text' }, { ...link('firstLink') }] as any),
    panel('Second button', [{ name: 'secondLabel', label: 'Label', type: 'text' }, { ...link('secondLink') }] as any),
  ],
  design: {
    layout: [segmented('size', 'Size', [['standard', 'Standard'], ['large', 'Large']], { default: 'standard' })],
    color: [
      {
        type: 'row',
        fields: [
          dropdown('firstColor', 'First color', COLORS, { default: 'dark', width: '50%' }),
          dropdown('secondColor', 'Second color', COLORS, { default: 'accent', width: '50%' }),
        ],
      },
    ],
    accents: [entranceField()],
  },
})
