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
