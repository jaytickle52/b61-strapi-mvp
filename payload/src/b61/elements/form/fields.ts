import { defineElement, panel } from '../../kit/element'
import { segmented, step } from '../../kit/controls'
import {
  entranceField,
  eyebrowRuleField,
  headingFields,
  paddingFields,
  subheadsField,
  surfaceField,
  textAlignField,
} from '../../kit/groups'

/*
 * B61 FORM: puts one of the school's forms (Forms > Forms) on a page, in the
 * B61 design. New in the Payload build; the Breakdance sites used Fluent Forms.
 * The form itself (questions, emails, thank-you) is edited in Forms.
 */
export const B61Form = defineElement({
  slug: 'b61Form',
  name: 'Form',
  plural: 'Forms',
  content: [
    panel('Form', [
      {
        name: 'form',
        label: 'Form',
        type: 'relationship',
        relationTo: 'forms',
        required: true,
        admin: { description: 'Questions, emails and the thank-you message are edited in Forms.' },
      },
    ]),
    panel('Heading', [...headingFields({ levels: ['h2', 'h3', 'h4'] }), subheadsField()]),
  ],
  design: {
    layout: [textAlignField()],
    size: [step('widthStep', 'Width', { low: 'Narrow', high: 'Wide' }), paddingFields()],
    part: {
      label: 'Fields',
      fields: [
        segmented(
          'card',
          'Form panel',
          [
            ['none', 'None'],
            ['card', 'White card'],
          ],
          {
            default: 'none',
            description: 'On a Dark or Accent surface the form always sits on a white card.',
          },
        ),
      ],
    },
    color: [surfaceField()],
    accents: [eyebrowRuleField(), entranceField()],
  },
})
