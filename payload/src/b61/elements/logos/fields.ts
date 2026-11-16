import { defineElement, panel } from '../../kit/element'
import { link, segmented, step, toggle } from '../../kit/controls'
import { bandHeadFields, entranceField, eyebrowRuleField, headingAlignField, list, paddingFields, photo, surfaceField } from '../../kit/groups'

/*
 * LOGOS: a row of logos (colleges graduates attend, accreditations, partner
 * churches, sponsors), still or slowly scrolling. Payload-only element (no
 * Breakdance counterpart). A scrolling row has a pause button and stops on
 * hover, on keyboard focus and for visitors who ask for less motion.
 */
export const B61Logos = defineElement({
  slug: 'b61Logos',
  name: 'Logos',
  plural: 'Logo rows',
  mode: { field: 'motion', labels: { still: 'Still', scroll: 'Scrolling' } },
  content: [
    panel('Heading', bandHeadFields()),
    list('logos', 'Logos', 'Logo', [
      { ...photo('image', 'Logo', { required: true }), admin: { description: "The logo's alt text should be the name (e.g. \"Wake Forest University\")." } } as any,
      { ...link(), label: 'Link (optional)' } as any,
    ], { minRows: 0, maxRows: 40 }),
  ],
  design: {
    layout: [
      segmented('motion', 'Motion', [['still', 'Still'], ['scroll', 'Scrolling']], { default: 'still' }),
      headingAlignField(),
    ],
    size: [step('logoStep', 'Logo size', { low: 'Small', high: 'Large' }), paddingFields()],
    color: [surfaceField(), toggle('oneColour', 'Logos in one colour')],
    accents: [eyebrowRuleField(), entranceField()],
  },
})
