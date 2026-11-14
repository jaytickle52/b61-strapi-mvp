import type { CollectionConfig } from 'payload'
import { publishedOrSignedIn, signedIn } from '../access'
import { previewUrl } from './content'
import { footerFields, headerFields } from '../b61/chrome/fields'

/**
 * One per school (the multi-school plugin makes this behave like a single
 * settings page for whichever school is selected in the admin).
 */
export const SchoolSettings: CollectionConfig = {
  slug: 'school-settings',
  labels: { singular: 'School settings', plural: 'School settings' },
  admin: {
    useAsTitle: 'schoolName',
    description: 'Name, contact details, colors, fonts, header menu and footer for this school.',
    livePreview: { url: ({ data }) => previewUrl('/', (data as any)?.school) },
  },
  access: { read: publishedOrSignedIn, create: signedIn, update: signedIn },
  versions: { drafts: { autosave: { interval: 400 } }, maxPerDoc: 25 },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'School',
          fields: [
            { name: 'schoolName', type: 'text', required: true },
            { name: 'tagline', type: 'text' },
            { name: 'logo', type: 'upload', relationTo: 'media' },
            { name: 'phone', type: 'text' },
            { name: 'email', type: 'email' },
            { name: 'address', type: 'textarea' },
          ],
        },
        {
          label: 'Look',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'primaryColor', type: 'text', defaultValue: '#1F3A5F', admin: { description: 'Hex color, e.g. #1F3A5F' } },
                { name: 'secondaryColor', type: 'text', defaultValue: '#C8A24A' },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'accentColor', type: 'text', defaultValue: '#B23A2E', admin: { description: 'Rules, frames, accent words' } },
                { name: 'paperColor', type: 'text', defaultValue: '#F7F3EC', admin: { description: 'Soft background' } },
              ],
            },
            {
              type: 'collapsible',
              label: 'Color shades',
              admin: {
                initCollapsed: true,
                description: 'Leave empty to work them out from the colors above. Set them when a brand guide specifies them.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'primaryDeep', type: 'text', admin: { placeholder: 'Darker primary' } },
                    { name: 'secondarySoft', type: 'text', admin: { placeholder: 'Lighter secondary' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'accentStrong', type: 'text', admin: { placeholder: 'Accent for small text' } },
                    { name: 'accentDeep', type: 'text', admin: { placeholder: 'Darker accent' } },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'headingFont',
                  type: 'select',
                  defaultValue: 'Fraunces',
                  options: ['Fraunces', 'Playfair Display', 'Merriweather', 'EB Garamond', 'Montserrat', 'Poppins'],
                },
                {
                  name: 'bodyFont',
                  type: 'select',
                  defaultValue: 'Inter',
                  options: ['Inter', 'Source Sans 3', 'Lato', 'Open Sans', 'EB Garamond'],
                },
                {
                  name: 'uiFont',
                  label: 'Buttons and labels font',
                  type: 'select',
                  defaultValue: 'Montserrat',
                  options: ['Montserrat', 'Inter', 'Poppins', 'Lato', 'Source Sans 3'],
                },
              ],
            },
          ],
        },
        { label: 'Header', fields: headerFields },
        { label: 'Footer', fields: footerFields },
        {
          label: 'Parents',
          fields: [
            {
              name: 'parentPassword',
              label: 'Parent feed password',
              type: 'text',
              access: { read: ({ req }) => Boolean(req.user) },
              admin: { description: 'One shared password families use to open the parent feed. Leave empty to keep the feed closed.' },
            },
          ],
        },
      ],
    },
  ],
}
