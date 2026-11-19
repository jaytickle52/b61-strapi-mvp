import { bodyField, hasBodyBlock } from '../../kit/body'
import { defineElement, panel } from '../../kit/element'
import { dropdown, segmented, step, toggle, type WhenRule } from '../../kit/controls'
import {
  buttonsPanel,
  entranceField,
  eyebrowRuleField,
  headingFields,
  paddingFields,
  subheadsField,
  surfaceField,
} from '../../kit/groups'

/*
 * B61 PROSE, built on the B61 editing kit (see ../../EDITING-STANDARD.md).
 * Port of Banner 61 Elements' B61 Prose (plugin 1.77.1); stored values match it.
 *
 * A band whose content is text: heading, then a stack of body copy, emphasis
 * lines, pull quotes and icon rows, then buttons. The heading sits above the
 * text or beside it.
 *
 * Differences from the Breakdance form, on purpose:
 * - Heading level defaults to Automatic (H1 if Prose opens the page, else H2).
 * - Icon list style moved from Layout to the element's own part panel, "Icon
 *   list", with the lines toggle, since it styles the list, not the layout.
 * - The Width slider and Heading width sit in Size & spacing; Column balance
 *   joins Layout beside Heading position, where it takes effect.
 */

const beside: WhenRule = { field: 'headPosition', in: ['beside'] }
const above: WhenRule = { field: 'headPosition', in: ['above'] }

export const B61Prose = defineElement({
  slug: 'b61Prose',
  name: 'Prose',
  plural: 'Prose',
  mode: { field: 'headPosition', labels: { above: 'Heading above', beside: 'Heading beside' } },

  content: [
    panel('Heading', headingFields({ levels: ['h1', 'h2', 'h3', 'h4'], after: [subheadsField()] })),
    bodyField({ emphasisScale: true, dividers: true }),
    buttonsPanel(),
  ],

  design: {
    layout: [
      segmented(
        'headPosition',
        'Heading position',
        [
          ['above', 'Above the text'],
          ['beside', 'Beside the text'],
        ],
        { default: 'above' },
      ),
      step('columnBalance', 'Column balance', { low: 'Wider heading', high: 'Wider text', when: beside }),
      segmented(
        'textAlign',
        'Text alignment',
        [
          ['left', 'Left', 'align-left'],
          ['center', 'Center', 'align-center'],
        ],
        { default: 'left', iconOnly: true },
      ),
    ],
    // Block position sits by Width, which it depends on (audit 1.78.0).
    size: [
      step('measureStep', 'Width', { low: 'Narrow', high: 'Wide' }),
      segmented(
        'position',
        'Block position',
        [
          ['left', 'Left'],
          ['center', 'Center'],
        ],
        { default: 'center' },
      ),
      segmented(
        'headingWidth',
        'Heading width',
        [
          ['text', 'Match text'],
          ['full', 'Full'],
        ],
        { default: 'text', when: above },
      ),
      paddingFields(),
    ],
    part: {
      label: 'Icon list',
      // Only once the text has an Icon list in it (audit 1.78.0).
      condition: (_: unknown, s: any) => hasBodyBlock(s?.body, 'iconList'),
      fields: [
        segmented(
          'iconlistStyle',
          'Style',
          [
            ['standard', 'Standard'],
            ['links', 'Link list'],
          ],
          { default: 'standard' },
        ),
        toggle('iconlistEdges', 'Lines above and below', { when: { field: 'iconlistStyle', in: ['links'] } }),
      ],
    },
    color: [surfaceField()],
    accents: [
      eyebrowRuleField(),
      dropdown(
        'headingRule',
        'Heading rule',
        [
          ['site', 'Site default'],
          ['none', 'None'],
          ['trailing', 'Trailing'],
        ],
        { default: 'site' },
      ),
      entranceField(),
    ],
  },
})
