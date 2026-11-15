import type { CollectionConfig } from 'payload'
import { guardPublishing, isB61Admin, publishedOrSignedIn, publishersOnly } from '../access'
import { previewUrl } from './content'
import { footerFields, headerFields } from '../b61/chrome/fields'
import { testEmailEndpoint } from '../email/endpoints'

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
  // Contributors can look but not change settings (they go live at once).
  access: { read: publishedOrSignedIn, create: publishersOnly, update: publishersOnly },
  hooks: { beforeChange: [guardPublishing] },
  endpoints: [testEmailEndpoint],
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
          label: 'Email',
          description: 'How emails from this website (form notifications and confirmations) are sent.',
          fields: [
            {
              name: 'formRecipients',
              label: 'Form notifications go to',
              type: 'text',
              admin: {
                placeholder: 'office@school.org, admissions@school.org',
                description: 'One or more addresses, separated by commas. Used when a form doesn\'t name its own. Empty: the school email.',
              },
            },
            {
              type: 'row',
              fields: [
                { name: 'emailFromName', label: 'Sender name', type: 'text', admin: { width: '50%', placeholder: 'The school name' } },
                {
                  name: 'emailReplyTo',
                  label: 'Replies go to',
                  type: 'email',
                  admin: { width: '50%', placeholder: 'The school email' },
                },
              ],
            },
            {
              name: 'emailFromAddress',
              label: 'Sender address',
              type: 'email',
              access: { update: ({ req }) => isB61Admin(req.user), create: ({ req }) => isB61Admin(req.user) },
              admin: {
                description: 'Set by Banner 61 once the school\'s domain is verified for sending. Empty: the Banner 61 address, with replies going to the school.',
              },
            },
            {
              name: 'testEmail',
              type: 'ui',
              admin: { components: { Field: '@/email/TestEmailButton#TestEmailButton' } },
            },
          ],
        },
        {
          label: 'Search engines',
          description: 'How this school shows up in Google and when its pages are shared.',
          fields: [
            {
              name: 'shareImage',
              label: 'Default share image',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Shown when a page without its own image is shared on social media or in a text. 1200 × 630 works best.' },
            },
            {
              name: 'googleVerification',
              label: 'Google Search Console code',
              type: 'text',
              admin: { description: 'Optional. The content="…" value from Google\'s HTML-tag verification.' },
            },
            {
              name: 'hideFromSearch',
              label: 'Hide this whole site from search engines',
              type: 'checkbox',
              admin: { description: 'For a site that is still being built. Demo and preview addresses are always hidden.' },
            },
          ],
        },
        {
          label: 'Analytics',
          description: 'Google Analytics: counts visitors on the live website and feeds the Analytics page in this editor.',
          fields: [
            {
              name: 'gaMeasurementId',
              label: 'Google Analytics tag ID',
              type: 'text',
              validate: (v: unknown) =>
                !v || /^G-[A-Z0-9]{4,}$/.test(String(v).trim()) ? true : 'This should look like G-ABC123XYZ (Admin > Data streams in Google Analytics).',
              admin: {
                placeholder: 'G-ABC123XYZ',
                description:
                  'Adds Google Analytics to the live website. Not added on demo or preview addresses, or while the site is hidden from search engines.',
              },
            },
            {
              name: 'gaPropertyId',
              label: 'Google Analytics property ID',
              type: 'text',
              access: {
                read: ({ req }) => Boolean(req.user),
                create: ({ req }) => isB61Admin(req.user),
                update: ({ req }) => isB61Admin(req.user),
              },
              validate: (v: unknown) =>
                !v || /^\d{6,}$/.test(String(v).trim()) ? true : 'A number, like 412345678 (Admin > Property details in Google Analytics).',
              admin: {
                placeholder: '412345678',
                description: 'Set by Banner 61. Lets the Analytics page show this school\'s numbers.',
              },
            },
            {
              name: 'gaSetup',
              type: 'ui',
              admin: { components: { Field: '@/analytics/SetupNote#SetupNote' } },
            },
          ],
        },
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
