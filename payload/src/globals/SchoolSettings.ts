import type { GlobalConfig } from 'payload'
import { signedIn } from '../access'

export const SchoolSettings: GlobalConfig = {
  slug: 'school-settings',
  label: 'School settings',
  admin: {
    description: 'Name, contact details, colors, fonts and navigation for this school.',
    livePreview: { url: '/next/preview?path=%2F' },
  },
  access: { read: () => true, update: signedIn },
  versions: { drafts: { autosave: { interval: 400 } } },
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
                {
                  name: 'headingFont',
                  type: 'select',
                  defaultValue: 'Fraunces',
                  options: ['Fraunces', 'Playfair Display', 'Merriweather', 'Montserrat', 'Poppins'],
                },
                {
                  name: 'bodyFont',
                  type: 'select',
                  defaultValue: 'Inter',
                  options: ['Inter', 'Source Sans 3', 'Lato', 'Open Sans'],
                },
              ],
            },
          ],
        },
        {
          label: 'Navigation',
          fields: [
            {
              name: 'navigation',
              type: 'array',
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'url', type: 'text', required: true },
              ],
            },
            {
              name: 'headerButton',
              type: 'group',
              fields: [
                { name: 'label', type: 'text' },
                { name: 'url', type: 'text' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
