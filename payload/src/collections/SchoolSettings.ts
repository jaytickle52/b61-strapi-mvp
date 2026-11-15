import type { CollectionConfig } from 'payload'
import { guardPublishing, isB61Admin, publishedOrSignedIn, publishersOnly } from '../access'
import { previewUrl } from './content'
import { footerFields, headerFields } from '../b61/chrome/fields'
import { testEmailEndpoint } from '../email/endpoints'
import { colorField } from '../branding/fields'
import { BODY_FONTS, HEADING_FONTS, UI_FONTS } from '../b61/lib/theme'
import { CUSTOM_CSS_MAX } from '../b61/lib/custom-css'

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
            {
              type: 'row',
              fields: [
                {
                  name: 'logoOnDark',
                  label: 'Logo for dark backgrounds',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { width: '50%', description: 'A light version for the dark footer. Empty: the logo above.' },
                },
                {
                  name: 'siteIcon',
                  label: 'Site icon',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { width: '50%', description: 'The small square icon in browser tabs and bookmarks. Empty: the logo.' },
                },
              ],
            },
            { name: 'phone', type: 'text' },
            { name: 'email', type: 'email' },
            { name: 'address', type: 'textarea' },
          ],
        },
        {
          label: 'Look',
          fields: [
            { name: 'brandPreview', type: 'ui', admin: { components: { Field: '@/branding/BrandPreview#BrandPreview' } } },
            {
              name: 'siteTone',
              label: 'Site tone',
              type: 'radio',
              defaultValue: 'light',
              options: [
                { label: 'Light', value: 'light' },
                { label: 'Dark', value: 'dark' },
              ],
              admin: { layout: 'horizontal', description: 'Dark: light letters on a dark page. Colored bands keep their colors.' },
            },
            {
              type: 'row',
              fields: [
                colorField('backgroundColor', { label: 'Page background', placeholder: 'White, or near-black on a dark site', description: 'Empty: white (light) or #101218 (dark).' }),
                colorField('textColor', { label: 'Text', placeholder: 'Near-black, or off-white on a dark site', description: 'Empty: #111111 (light) or #F2EFE9 (dark).' }),
              ],
            },
            {
              type: 'row',
              fields: [
                colorField('primaryColor', { defaultValue: '#1F3A5F', description: 'Headings, buttons, header links.' }),
                colorField('secondaryColor', { defaultValue: '#C8A24A', description: 'Second buttons and highlights.' }),
              ],
            },
            {
              type: 'row',
              fields: [
                colorField('accentColor', { defaultValue: '#B23A2E', description: 'Rules, frames, accent words.' }),
                colorField('paperColor', { defaultValue: '#F7F3EC', description: 'Soft background (light sites). On dark sites, the light accent on accent bands.' }),
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
                    colorField('primaryDeep', { placeholder: 'Darker primary' }),
                    colorField('secondarySoft', { placeholder: 'Lighter secondary' }),
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    colorField('accentStrong', { placeholder: 'Accent for small text' }),
                    colorField('accentDeep', { placeholder: 'Darker accent' }),
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'headingFont', type: 'select', defaultValue: 'Fraunces', options: HEADING_FONTS },
                { name: 'bodyFont', type: 'select', defaultValue: 'Inter', options: BODY_FONTS },
                { name: 'uiFont', label: 'Buttons and labels font', type: 'select', defaultValue: 'Montserrat', options: UI_FONTS },
              ],
            },
            {
              type: 'collapsible',
              label: 'Custom CSS (Banner 61)',
              admin: {
                initCollapsed: true,
                condition: (_data: unknown, _sibling: unknown, ctx: any) => isB61Admin(ctx?.user),
                description:
                  'Added to every page of this school, after the element styles. Target one element with the CSS class set in its Design tab > Advanced.',
              },
              fields: [
                {
                  name: 'customCss',
                  label: 'Custom CSS',
                  type: 'code',
                  maxLength: CUSTOM_CSS_MAX,
                  access: {
                    create: ({ req }) => isB61Admin(req.user),
                    update: ({ req }) => isB61Admin(req.user),
                  },
                  admin: { language: 'css', editorOptions: { minimap: { enabled: false } } },
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
            {
              name: 'hiddenNote',
              type: 'ui',
              admin: { components: { Field: '@/seo/HiddenNote#HiddenNote' } },
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
