import type { Block } from 'payload'
import { defineElement, panel } from '../../kit/element'
import { dropdown, link, segmented, toggle } from '../../kit/controls'
import { buttonsPanel, ICON_OPTIONS, iconChoice, list } from '../../kit/groups'

/* B61 RAIL, port of Banner 61 Elements' B61 Rail (plugin 1.77.1): buttons and a link list for a Section's side column. */
export const B61Rail: Block = defineElement({
  slug: 'b61Rail',
  name: 'Rail',
  plural: 'Rails',
  content: [
    buttonsPanel(),
    panel('Link list', [
      { name: 'linksLabel', label: 'List heading', type: 'text', defaultValue: 'Keep exploring' },
      list('links', 'Links', 'Link', [
        {
          type: 'row',
          fields: [
            { name: 'label', label: 'Label', type: 'text', required: true, admin: { width: '65%' } },
            iconChoice([['arrow', 'Arrow'], ...ICON_OPTIONS.filter(([v]) => v !== 'dot')], { default: 'arrow', width: '35%' })[0],
          ],
        },
        ...iconChoice([], { default: 'arrow' }).slice(1),
        link(),
      ]),
    ]),
  ],
  design: {
    layout: [
      segmented('actionsPosition', 'Buttons', [['top', 'Above the links'], ['bottom', 'Below the links']], { default: 'top' }),
      toggle('sticky', 'Stick on scroll'),
    ],
    color: [
      dropdown('surface', 'Panel', [['none', 'None'], ['plain', 'White card'], ['soft', 'Light wash'], ['dark', 'Dark'], ['accent', 'Accent']], { default: 'plain' }),
    ],
  },
})
