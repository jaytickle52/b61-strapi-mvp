import { bodyField } from '../../kit/body'
import { defineElement, panel } from '../../kit/element'
import { dropdown, segmented, step } from '../../kit/controls'
import {
  buttonsField,
  entranceField,
  eyebrowRuleField,
  headingFields,
  paddingFields,
  photo,
  subheadsField,
  surfaceField,
} from '../../kit/groups'

/*
 * B61 CTA BAND, built on the B61 editing kit (see ../../EDITING-STANDARD.md).
 * Port of Banner 61 Elements' B61 CTA Band (plugin 1.77.1); stored values match it.
 *
 * A call-to-action band: heading, a short content stack, buttons, and an
 * optional background photo. Copy never sits on a bare photo: with a photo and
 * no text panel, Surface None or Accent renders Dark, and the shade never
 * drops below 70% (75% on Light wash), as in the plugin.
 *
 * Differences from the Breakdance form, on purpose:
 * - Heading level defaults to Automatic.
 * - Quote rows have no photo field (the CTA band never showed one).
 * - Focal point comes from the photo itself (set once in Media).
 */

export const B61Cta = defineElement({
  slug: 'b61Cta',
  name: 'CTA Band',
  plural: 'CTA Bands',
  mode: { field: 'surface', labels: { none: 'No surface', soft: 'Light wash', dark: 'Dark', accent: 'Accent' } },

  content: [
    panel('Heading', [...headingFields({ levels: ['h2', 'h3', 'h4'] }), subheadsField()]),
    bodyField({ quotePhoto: false }),
    buttonsField(),
    panel('Background', [
      photo('image', 'Photo'),
      {
        name: 'overlayStrength',
        label: 'Overlay strength (%)',
        type: 'number',
        min: 0,
        max: 90,
        admin: {
          step: 5,
          placeholder: '70',
          condition: (_, s) => Boolean(s?.image),
          description: 'Without a text panel the shade stays at least 70% so the words stay readable.',
        },
      },
    ]),
  ],

  design: {
    layout: [
      {
        type: 'row',
        fields: [
          segmented(
            'textAlign',
            'Text alignment',
            [
              ['left', 'Left', 'align-left'],
              ['center', 'Center', 'align-center'],
            ],
            { default: 'center', iconOnly: true, width: '50%' },
          ),
          segmented(
            'position',
            'Position',
            [
              ['left', 'Left'],
              ['center', 'Center'],
            ],
            { default: 'center', width: '50%' },
          ),
        ],
      },
    ],
    size: [step('widthStep', 'Width', { low: 'Narrow', high: 'Wide' }), paddingFields()],
    color: [
      { ...surfaceField(), defaultValue: 'soft' } as any,
      dropdown(
        'textPanel',
        'Text panel',
        [
          ['none', 'None'],
          ['plain', 'White card'],
          ['soft', 'Light wash'],
          ['dark', 'Dark'],
          ['accent', 'Accent'],
        ],
        { default: 'none' },
      ),
    ],
    accents: [eyebrowRuleField(), entranceField()],
  },
})
