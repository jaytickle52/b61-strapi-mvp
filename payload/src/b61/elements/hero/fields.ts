import type { Block } from 'payload'
import {
  buttonsField,
  entranceField,
  eyebrowRuleField,
  onlyImages,
  onlyVideos,
  paddingFields,
  stepField,
} from '../../fields/shared'

/*
 * B61 HERO — Payload port of Banner 61 Elements' B61 Hero (plugin 1.77.1).
 *
 * Same controls, same values, same Content / Design split. What changed:
 * - Show/hide rules are one-line functions instead of condition arrays that
 *   repeat every parent's clauses.
 * - Groupings are collapsibles, which only arrange the form: the stored data is
 *   flat, so regrouping later never needs a migration.
 * - Limits are enforced in the form (collage max 3, overlay 80-100) instead of
 *   being clamped silently in the template.
 * - Focal point comes from the photo itself (set once in Media), matching the
 *   1.59 rule that it is a property of the photograph.
 * - Text alignment is one value. Per-screen behavior lives in the CSS.
 * - No legacy fallbacks (design.appearance.*, inline <em>): this starts clean.
 */

const isBand = (s: any) => s?.layoutMode === 'band'
const isCover = (s: any) => !isBand(s)
const bgIs = (t: string) => (s: any) => isCover(s) && (s?.backgroundType ?? 'image') === t

export const B61Hero: Block = {
  slug: 'b61Hero',
  labels: { singular: 'B61 Hero', plural: 'B61 Heroes' },
  admin: { components: { Label: '@/b61/admin/BlockLabel#HeroBlockLabel' } },
  fields: [
    {
      type: 'tabs',
      tabs: [
        /* ============ CONTENT: what an editor types and chooses ============ */
        {
          label: 'Content',
          fields: [
            {
              type: 'collapsible',
              label: 'Heading',
              fields: [
                { name: 'eyebrow', label: 'Eyebrow', type: 'text' },
                {
                  name: 'headingLevel',
                  label: 'Heading level',
                  type: 'radio',
                  defaultValue: 'h1',
                  options: ['h1', 'h2', 'h3'].map((v) => ({ label: v.toUpperCase(), value: v })),
                  admin: { layout: 'horizontal' },
                },
                {
                  name: 'lines',
                  label: 'Heading lines',
                  type: 'array',
                  labels: { singular: 'Heading line', plural: 'Heading lines' },
                  admin: { components: { RowLabel: '@/b61/admin/RowLabel#LabelRow' } },
                  fields: [
                    { name: 'text', label: 'Line', type: 'text', required: true },
                    { name: 'emphasize', label: 'Emphasize this line', type: 'checkbox' },
                  ],
                },
              ],
            },
            {
              type: 'collapsible',
              label: 'Subheadline',
              fields: [
                {
                  name: 'subheadline',
                  label: 'Text',
                  type: 'textarea',
                  admin: { rows: 2, condition: (_, s) => s?.subheadlineScale !== 'meta' },
                },
                {
                  name: 'subheadlineScale',
                  label: 'Scale',
                  type: 'radio',
                  defaultValue: 'body',
                  // Stored values match the plugin (body = Large, display = Normal).
                  options: [
                    { label: 'Normal', value: 'display' },
                    { label: 'Large', value: 'body' },
                    { label: 'Meta line', value: 'meta' },
                  ],
                  admin: { layout: 'horizontal' },
                },
                {
                  name: 'metaItems',
                  label: 'Items',
                  type: 'array',
                  labels: { singular: 'Item', plural: 'Items' },
                  admin: {
                    condition: (_, s) => s?.subheadlineScale === 'meta',
                    description: 'Short facts in small caps, e.g. "Grades PK-8", "Est. 1951".',
                    components: { RowLabel: '@/b61/admin/RowLabel#LabelRow' },
                  },
                  fields: [{ name: 'text', label: 'Text', type: 'text', required: true }],
                },
              ],
            },
            { type: 'collapsible', label: 'Buttons', fields: [buttonsField()] },
            {
              type: 'collapsible',
              label: 'Background',
              fields: [
                {
                  name: 'backgroundType',
                  label: 'Type',
                  type: 'radio',
                  defaultValue: 'image',
                  options: [
                    { label: 'Image', value: 'image' },
                    { label: 'Slideshow', value: 'slideshow' },
                    { label: 'Video', value: 'video' },
                  ],
                  admin: { layout: 'horizontal', condition: (_, s) => isCover(s) },
                },
                {
                  name: 'image',
                  label: 'Image',
                  type: 'upload',
                  relationTo: 'media',
                  filterOptions: onlyImages,
                  admin: { condition: (_, s) => bgIs('image')(s), description: 'Set the focal point on the photo itself (Media).' },
                },
                {
                  name: 'slides',
                  label: 'Slides',
                  type: 'array',
                  labels: { singular: 'Slide', plural: 'Slides' },
                  minRows: 2,
                  admin: { condition: (_, s) => bgIs('slideshow')(s) },
                  fields: [{ name: 'image', type: 'upload', relationTo: 'media', filterOptions: onlyImages, required: true }],
                },
                {
                  type: 'row',
                  admin: { condition: (_, s) => bgIs('video')(s) },
                  fields: [
                    { name: 'video', label: 'Video', type: 'upload', relationTo: 'media', filterOptions: onlyVideos, admin: { width: '50%' } },
                    { name: 'videoWebm', label: 'Video (WebM, optional)', type: 'upload', relationTo: 'media', filterOptions: onlyVideos, admin: { width: '50%' } },
                  ],
                },
                {
                  name: 'poster',
                  label: 'Video poster',
                  type: 'upload',
                  relationTo: 'media',
                  filterOptions: onlyImages,
                  admin: {
                    condition: (_, s) => bgIs('video')(s),
                    description: 'Shows while the video loads, if autoplay is blocked, and for visitors who turn off motion.',
                  },
                },
                {
                  name: 'collage',
                  label: 'Collage',
                  type: 'array',
                  labels: { singular: 'Image', plural: 'Images' },
                  maxRows: 3,
                  admin: { condition: (_, s) => isBand(s), description: '1 to 3 images beside the text.' },
                  fields: [{ name: 'image', type: 'upload', relationTo: 'media', filterOptions: onlyImages, required: true }],
                },
                {
                  name: 'overlayStrength',
                  label: 'Overlay strength (%)',
                  type: 'number',
                  min: 80,
                  max: 100,
                  admin: { step: 5, placeholder: 'Default', condition: (_, s) => isCover(s) },
                },
              ],
            },
          ],
        },

        /* ============ DESIGN: arrangement and finish ============ */
        {
          label: 'Design',
          fields: [
            {
              type: 'collapsible',
              label: 'Layout',
              fields: [
                {
                  name: 'layoutMode',
                  label: 'Layout',
                  type: 'radio',
                  defaultValue: 'cover',
                  options: [
                    { label: 'Cover', value: 'cover' },
                    { label: 'Band', value: 'band' },
                  ],
                  admin: { layout: 'horizontal' },
                },
                {
                  name: 'height',
                  label: 'Height',
                  type: 'radio',
                  defaultValue: 'tall',
                  options: [
                    { label: 'Short', value: 'short' },
                    { label: 'Medium', value: 'medium' },
                    { label: 'Tall', value: 'tall' },
                    { label: 'Full', value: 'full' },
                  ],
                  admin: { layout: 'horizontal', condition: (_, s) => isCover(s) },
                },
                {
                  name: 'bandSize',
                  label: 'Band height',
                  type: 'radio',
                  defaultValue: 'standard',
                  options: [
                    { label: 'Compact', value: 'compact' },
                    { label: 'Standard', value: 'standard' },
                  ],
                  admin: { layout: 'horizontal', condition: (_, s) => isBand(s) },
                },
                {
                  name: 'verticalPosition',
                  label: 'Vertical position',
                  type: 'radio',
                  defaultValue: 'bottom',
                  options: [
                    { label: 'Top', value: 'top' },
                    { label: 'Center', value: 'center' },
                    { label: 'Bottom', value: 'bottom' },
                  ],
                  admin: { layout: 'horizontal', condition: (_, s) => isCover(s) },
                },
                {
                  name: 'textAlign',
                  label: 'Text alignment',
                  type: 'radio',
                  defaultValue: 'left',
                  options: [
                    { label: 'Left', value: 'left' },
                    { label: 'Center', value: 'center' },
                  ],
                  admin: { layout: 'horizontal' },
                },
              ],
            },
            {
              type: 'collapsible',
              label: 'Size & spacing',
              fields: [
                {
                  type: 'collapsible',
                  label: 'Size & width',
                  admin: { initCollapsed: true },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        stepField('subheadlineWidth', 'Subheadline width'),
                        stepField('columnBalance', 'Column balance', (_, s) => isBand(s)),
                      ],
                    },
                  ],
                },
                paddingFields(),
              ],
            },
            {
              type: 'collapsible',
              label: 'Color',
              fields: [
                {
                  name: 'overlay',
                  label: 'Overlay',
                  type: 'radio',
                  defaultValue: 'gradient',
                  options: [
                    { label: 'Gradient', value: 'gradient' },
                    { label: 'Wash', value: 'wash' },
                  ],
                  admin: { layout: 'horizontal', condition: (_, s) => isCover(s) },
                },
                {
                  // Overlay + surface resolve to one scheme that carries its own
                  // text colors, so no reachable combination fails contrast.
                  name: 'surface',
                  label: 'Surface',
                  type: 'radio',
                  defaultValue: 'primary',
                  options: [
                    { label: 'Light', value: 'light' },
                    { label: 'Primary', value: 'primary' },
                    { label: 'Secondary', value: 'secondary' },
                  ],
                  admin: { layout: 'horizontal', condition: (_, s) => isBand(s) || s?.overlay === 'wash' },
                },
              ],
            },
            {
              type: 'collapsible',
              label: 'Accents',
              fields: [eyebrowRuleField(), entranceField()],
            },
          ],
        },
      ],
    },
  ],
}
