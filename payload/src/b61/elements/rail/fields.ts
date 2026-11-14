import type { Block } from 'payload'
import { defineElement, panel } from '../../kit/element'
import { dropdown, link, segmented, toggle } from '../../kit/controls'
import { buttonsField, ICON_OPTIONS, list } from '../../kit/groups'

/* B61 RAIL, port of Banner 61 Elements' B61 Rail (plugin 1.77.1): buttons and a link list for a Section's side column. */
export const B61Rail: Block = defineElement({
  slug: 'b61Rail',
  name: 'B61 Rail',
  content: [
    buttonsField(),
    panel('Link list', [
      { name: 'linksLabel', label: 'List heading', type: 'text', defaultValue: 'Keep exploring' },
      list('links', 'Links', 'Link', [
        {
          type: 'row',
          fields: [
            { name: 'label', label: 'Label', type: 'text', required: true, admin: { width: '65%' } },
            dropdown('icon', 'Icon', [['arrow', 'Arrow'], ...ICON_OPTIONS.filter(([v]) => v !== 'dot')], { default: 'arrow', width: '35%' }),
          ],
        },
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
      dropdown('surface', 'Panel', [['plain', 'White card'], ['soft', 'Light wash'], ['dark', 'Dark'], ['accent', 'Accent'], ['none', 'No panel']], { default: 'plain' }),
    ],
  },
})
