import { defineElement, panel } from '../../kit/element'
import { dropdown, step, toggle } from '../../kit/controls'
import { entranceField, frameColorField, photo } from '../../kit/groups'

/* B61 FRAMED IMAGE, port of Banner 61 Elements' B61 Framed Image (plugin 1.77.1). */
const isCustom = { field: 'imageShape', in: ['custom'] }
export const B61FramedImage = defineElement({
  slug: 'b61FramedImage',
  name: 'Framed Image',
  plural: 'Framed Images',
  content: [panel('Photo', [photo('image', 'Photo', { required: true })])],
  design: {
    layout: [
      dropdown(
        'imageShape',
        'Photo shape',
        [['fixed', 'Fixed height'], ['portrait', 'Portrait'], ['square', 'Square'], ['landscape', 'Landscape'], ['wide', 'Wide'], ['custom', 'Custom ratio']],
        { default: 'fixed' },
      ),
      dropdown('imageHeight', 'Height', [['360px', 'Short'], ['460px', 'Medium'], ['560px', 'Tall'], ['680px', 'Extra tall']], {
        default: '460px',
        when: [{ field: 'imageShape', in: ['fixed', null] }],
      }),
      {
        type: 'row',
        admin: { condition: (_: unknown, s: any) => s?.imageShape === 'custom' },
        fields: [
          { name: 'ratioW', label: 'Ratio width', type: 'number', min: 1, defaultValue: 3, admin: { width: '50%' } },
          { name: 'ratioH', label: 'Ratio height', type: 'number', min: 1, defaultValue: 2, admin: { width: '50%' } },
        ],
        custom: { b61When: isCustom },
      } as any,
      toggle('flipFrame', 'Frame on the other side'),
    ],
    size: [step('widthStep', 'Width', { low: 'Narrow', high: 'Wide' })],
    color: [frameColorField()],
    accents: [entranceField()],
  },
})
