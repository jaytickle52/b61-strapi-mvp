import type { Field, FilterOptions } from 'payload'

/*
 * Shared B61 field definitions. Every element imports these, so "Buttons",
 * "Padding" or "Entrance animation" mean one thing across the library and
 * change in one place (the equivalent of the shared four button styles and
 * the shared panels in the Breakdance plugin).
 *
 * Collapsibles and rows only arrange the form. They do not nest the data, so
 * controls can be regrouped later without a migration.
 */

export const onlyImages: FilterOptions = { mimeType: { contains: 'image' } }
export const onlyVideos: FilterOptions = { mimeType: { contains: 'video' } }

/** A link to a page on this site (survives slug changes) or any URL. */
export const linkField = (name = 'link', label = 'Link'): Field => ({
  name,
  label,
  type: 'group',
  admin: { hideGutter: true },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          label: 'Link to',
          type: 'radio',
          defaultValue: 'page',
          options: [
            { label: 'A page', value: 'page' },
            { label: 'A web address', value: 'url' },
          ],
          admin: { layout: 'horizontal', width: '100%' },
        },
      ],
    },
    {
      name: 'page',
      type: 'relationship',
      relationTo: 'pages',
      admin: { condition: (_, s) => s?.type !== 'url' },
    },
    {
      name: 'url',
      label: 'Web address',
      type: 'text',
      admin: { condition: (_, s) => s?.type === 'url', placeholder: 'https://' },
    },
    { name: 'newTab', label: 'Open in a new tab', type: 'checkbox' },
  ],
})

/** The shared four button styles. `link` is the text link with an arrow. */
export const buttonsField = (): Field => ({
  name: 'buttons',
  label: 'Buttons',
  type: 'array',
  labels: { singular: 'Button', plural: 'Buttons' },
  admin: { initCollapsed: false, components: { RowLabel: '@/b61/admin/RowLabel#LabelRow' } },
  fields: [
    { name: 'label', label: 'Label', type: 'text', required: true },
    linkField(),
    {
      type: 'collapsible',
      label: 'Style',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'variant',
              label: 'Style',
              type: 'select',
              defaultValue: 'primary',
              required: true,
              options: [
                { label: 'Primary', value: 'primary' },
                { label: 'Secondary', value: 'secondary' },
                { label: 'Light', value: 'light' },
                { label: 'Text link', value: 'link' },
              ],
              admin: { width: '50%' },
            },
            {
              name: 'fullWidth',
              label: 'Full width',
              type: 'checkbox',
              // A full-width text link is a hit area with no visible edges.
              admin: { width: '50%', condition: (_, s) => s?.variant !== 'link', style: { alignSelf: 'flex-end' } },
            },
          ],
        },
      ],
    },
  ],
})

export const paddingFields = (): Field => ({
  type: 'collapsible',
  label: 'Padding',
  admin: { initCollapsed: true },
  fields: [
    {
      type: 'row',
      fields: (['padTop', 'padBottom'] as const).map((name) => ({
        name,
        label: name === 'padTop' ? 'Top padding' : 'Bottom padding',
        type: 'radio' as const,
        defaultValue: 'normal',
        options: [
          { label: 'Normal', value: 'normal' },
          { label: 'Tight', value: 'tight' },
          { label: 'None', value: 'none' },
        ],
        admin: { layout: 'horizontal' as const, width: '50%' },
      })),
    },
  ],
})

export const eyebrowRuleField = (): Field => ({
  name: 'eyebrowRule',
  label: 'Eyebrow rule',
  type: 'select',
  defaultValue: 'site',
  options: [
    { label: 'Site default', value: 'site' },
    { label: 'None', value: 'none' },
    { label: 'Leading', value: 'leading' },
    { label: 'Trailing', value: 'trailing' },
    { label: 'Both sides', value: 'both' },
  ],
})

export const entranceField = (): Field => ({
  name: 'entrance',
  label: 'Entrance animation',
  type: 'radio',
  defaultValue: 'on',
  options: [
    { label: 'On', value: 'on' },
    { label: 'Off', value: 'off' },
  ],
  admin: { layout: 'horizontal' },
})

/** A 1-7 stop on a site-wide step scale (tokens.css). Empty = site default. */
export const stepField = (name: string, label: string, condition?: (data: any, sibling: any) => boolean): Field => ({
  name,
  label,
  type: 'number',
  min: 1,
  max: 7,
  admin: { step: 1, placeholder: 'Site default', description: '1 to 7', condition, width: '50%' },
})
