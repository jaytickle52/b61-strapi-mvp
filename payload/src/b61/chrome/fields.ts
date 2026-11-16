import type { Field } from 'payload'
import { link, segmented } from '../kit/controls'
import { ICON_OPTIONS, list, photo } from '../kit/groups'
import { profileUrl } from '../../school/fields'

/*
 * Site header and footer, edited in School settings. Same kit controls as the
 * page elements, so a link, a list or a photo looks and behaves the same here.
 *
 * Each top-level menu item is one of three kinds, picked first:
 *   Link       one page or address
 *   Dropdown   a short list of links under the item
 *   Mega menu  2-4 columns of links with headings, plus an optional photo card
 * Phones always get the same items as a slide-in menu; nothing to set up.
 */

const navLink = (o: { description?: boolean } = {}): Field[] => [
  { name: 'label', label: 'Label', type: 'text', required: true },
  link(),
  ...(o.description ? [{ name: 'description', label: 'Short description (optional)', type: 'text' } as Field] : []),
]

const is = (k: string) => (_: unknown, s: any) => (s?.kind ?? 'link') === k

export const headerFields: Field[] = [
  list(
    'menu',
    'Menu',
    'Menu item',
    [
      {
        type: 'row',
        fields: [
          { name: 'label', label: 'Label', type: 'text', required: true, admin: { width: '40%' } },
          {
            ...segmented('kind', 'Opens', [['link', 'A page'], ['dropdown', 'Dropdown'], ['mega', 'Mega menu']], { default: 'link', width: '60%' }),
          },
        ],
      },
      { ...link(), admin: { hideGutter: true, condition: is('link') } } as Field,
      list('links', 'Links', 'Link', navLink({ description: false }), { maxRows: 10, admin: { condition: is('dropdown') } }),
      list(
        'columns',
        'Columns',
        'Column',
        [{ name: 'heading', label: 'Column heading', type: 'text' }, list('links', 'Links', 'Link', navLink({ description: true }), { maxRows: 8 })],
        { minRows: 1, maxRows: 4, admin: { condition: is('mega'), description: 'Two to four columns works best.' } },
      ),
      {
        name: 'feature',
        label: 'Featured card (optional)',
        type: 'group',
        admin: { condition: is('mega'), description: 'A photo card at the right of the mega menu, e.g. "Schedule a visit".' },
        fields: [
          photo('image', 'Photo'),
          { name: 'title', label: 'Title', type: 'text' },
          { name: 'text', label: 'Text', type: 'textarea', admin: { rows: 2 } },
          link(),
        ],
      },
    ],
    { admin: { description: 'The main menu. Order here is the order on the site.' } },
  ),
  list('utilityLinks', 'Small links', 'Small link', navLink(), {
    maxRows: 3,
    admin: { description: 'Quiet links beside the button, e.g. Parents or Give.' },
  }),
  {
    name: 'headerButton',
    label: 'Header button',
    type: 'group',
    fields: [{ name: 'label', label: 'Label', type: 'text' }, link()],
  },
  list(
    'quickLinks',
    'Side buttons',
    'Side button',
    [
      {
        type: 'row',
        fields: [
          { name: 'label', label: 'Label', type: 'text', required: true, maxLength: 18, admin: { width: '60%' } },
          {
            name: 'icon',
            label: 'Icon',
            type: 'select',
            defaultValue: 'link',
            options: ICON_OPTIONS.filter(([v]) => v !== 'dot').map(([value, label]) => ({ value, label })),
            admin: { width: '40%', isClearable: false },
          },
        ],
      },
      link(),
    ],
    {
      maxRows: 3,
      admin: {
        description: 'Up to three short links that stay on screen at the side (along the bottom on phones), e.g. Inquire, Visit, Apply. Leave empty for none.',
      },
    },
  ),
]

const SOCIAL: [string, string][] = [
  ['facebook', 'Facebook'],
  ['instagram', 'Instagram'],
  ['youtube', 'YouTube'],
  ['x', 'X'],
  ['linkedin', 'LinkedIn'],
  ['tiktok', 'TikTok'],
  ['vimeo', 'Vimeo'],
]

export const footerFields: Field[] = [
  list('footerColumns', 'Link columns', 'Column', [{ name: 'heading', label: 'Column heading', type: 'text' }, list('links', 'Links', 'Link', navLink(), { maxRows: 8 })], {
    maxRows: 4,
  }),
  {
    name: 'footerShowContact',
    label: 'Show address, phone and email',
    type: 'checkbox',
    defaultValue: true,
    admin: { description: 'Taken from the School tab.' },
  },
  list(
    'social',
    'Social links',
    'Social link',
    [
      {
        type: 'row',
        fields: [
          { name: 'platform', label: 'Platform', type: 'select', required: true, defaultValue: 'facebook', options: SOCIAL.map(([value, label]) => ({ value, label })), admin: { width: '35%', isClearable: false } },
          { name: 'url', label: 'Web address', type: 'text', required: true, validate: profileUrl, admin: { width: '65%', placeholder: 'https://' } },
        ],
      },
    ],
    { maxRows: 7 },
  ),
  { name: 'footerNote', label: 'Note', type: 'textarea', admin: { rows: 2, description: 'Optional: accreditation, nondiscrimination statement or similar.' } },
  list('legalLinks', 'Bottom links', 'Link', navLink(), { maxRows: 4, admin: { description: 'Small links on the bottom line, e.g. Privacy.' } }),
  {
    name: 'copyright',
    label: 'Copyright line',
    type: 'text',
    admin: { placeholder: '© {year} School name', description: 'Leave empty for "© year School name". {year} becomes the current year.' },
  },
]
