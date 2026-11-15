import type { Field } from 'payload'

/*
 * School tab: the address in parts, the map pin, office hours and the
 * "School facts" families ask about (and AI tools answer from). Rows and
 * collapsibles only arrange the form; the data stays flat (EDITING-STANDARD 7).
 * Shown on the site by Card Grid > Fill with > School facts, and sent to
 * search engines in the School structured data (src/seo/schema.ts).
 */

const DAYS: [string, string][] = [
  ['Mo', 'Mon'],
  ['Tu', 'Tue'],
  ['We', 'Wed'],
  ['Th', 'Thu'],
  ['Fr', 'Fri'],
  ['Sa', 'Sat'],
  ['Su', 'Sun'],
]

const time = (v: unknown) => !v || /^([01]?\d|2[0-3]):[0-5]\d$/.test(String(v).trim()) || 'Use 24-hour time, like 07:30 or 16:00.'

/** A web address that goes somewhere: https and a path past the site's home page. */
export const profileUrl = (v: unknown): true | string => {
  if (!v) return true
  try {
    const u = new URL(String(v).trim())
    if (!/^https?:$/.test(u.protocol)) return 'Start the address with https://'
    if (u.pathname.replace(/\/+$/, '') === '' && !u.search) return 'Use the full address of the school\'s own page, e.g. https://facebook.com/yourschool'
    return true
  } catch {
    return 'Paste the full web address, starting with https://'
  }
}

const named = (name: string, label: string, rowLabel: string, description: string): Field => ({
  name,
  label,
  type: 'array',
  labels: { singular: rowLabel, plural: label },
  admin: { description, initCollapsed: true, components: { RowLabel: '@/school/NameRowLabel#NameRowLabel' } },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', label: 'Name', type: 'text', required: true, admin: { width: '45%' } },
        { name: 'url', label: 'Web address', type: 'text', validate: profileUrl, admin: { width: '55%', placeholder: 'https://' } },
      ],
    },
  ],
})

/** The street address, city, state and ZIP, plus the map pin and office hours. */
export const addressFields: Field[] = [
  { name: 'street', label: 'Street address', type: 'text' },
  {
    type: 'row',
    fields: [
      { name: 'city', label: 'City', type: 'text', admin: { width: '45%' } },
      { name: 'state', label: 'State', type: 'text', admin: { width: '20%', placeholder: 'SC' } },
      { name: 'postalCode', label: 'ZIP', type: 'text', admin: { width: '35%' } },
    ],
  },
  // The whole address as one block, filled in from the parts above on every save.
  // The footer, calendar files and search still read it.
  { name: 'address', type: 'textarea', admin: { hidden: true } },
  {
    type: 'collapsible',
    label: 'Map pin and office hours',
    admin: { initCollapsed: true },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'latitude',
            label: 'Latitude',
            type: 'number',
            min: -90,
            max: 90,
            admin: { width: '50%', step: 0.000001, description: 'In Google Maps, right-click the school\'s front door and click the two numbers at the top to copy them.' },
          },
          { name: 'longitude', label: 'Longitude', type: 'number', min: -180, max: 180, admin: { width: '50%', step: 0.000001 } },
        ],
      },
      {
        name: 'officeDays',
        label: 'Office open',
        type: 'select',
        hasMany: true,
        options: DAYS.map(([value, label]) => ({ value, label })),
      },
      {
        type: 'row',
        fields: [
          { name: 'officeOpens', label: 'From', type: 'text', validate: time, admin: { width: '50%', placeholder: '07:30' } },
          { name: 'officeCloses', label: 'Until', type: 'text', validate: time, admin: { width: '50%', placeholder: '16:00' } },
        ],
      },
    ],
  },
]

/** The facts families ask about. Every one is optional. */
export const factFields: Field[] = [
  {
    type: 'collapsible',
    label: 'School facts',
    admin: {
      initCollapsed: true,
      description: 'Shown wherever a Card Grid is set to Fill with > School facts, and given to Google and AI tools.',
    },
    fields: [
      {
        type: 'row',
        fields: [
          { name: 'shortName', label: 'Short name', type: 'text', admin: { width: '50%', placeholder: 'e.g. Cedar Ridge' } },
          { name: 'grades', label: 'Grades served', type: 'text', admin: { width: '50%', placeholder: 'e.g. PreK–12' } },
        ],
      },
      {
        type: 'row',
        fields: [
          { name: 'foundedYear', label: 'Year founded', type: 'number', min: 1600, max: 2100, admin: { width: '33%' } },
          { name: 'enrollment', label: 'Students enrolled', type: 'number', min: 0, admin: { width: '33%' } },
          { name: 'studentTeacherRatio', label: 'Student-teacher ratio', type: 'text', admin: { width: '34%', placeholder: 'e.g. 12:1' } },
        ],
      },
      {
        type: 'row',
        fields: [
          { name: 'denomination', label: 'Denomination or tradition', type: 'text', admin: { width: '50%', placeholder: 'e.g. Nondenominational' } },
          { name: 'transportation', label: 'Transportation', type: 'text', admin: { width: '50%', placeholder: 'e.g. Bus routes from Greer and Taylors' } },
        ],
      },
      {
        type: 'row',
        fields: [
          { name: 'churchName', label: 'Sponsoring church', type: 'text', admin: { width: '45%' } },
          { name: 'churchUrl', label: 'Church website', type: 'text', validate: profileUrl, admin: { width: '55%', placeholder: 'https://' } },
        ],
      },
      { name: 'beforeAfterCare', label: 'Before and after care available', type: 'checkbox' },
      named('accreditations', 'Accreditation', 'Accreditation', 'Who accredits the school, e.g. ACSI or Cognia.'),
      named('memberships', 'Memberships', 'Membership', 'Associations the school belongs to.'),
      named(
        'profiles',
        'Other profiles',
        'Profile',
        'The school\'s own page on Google (Business Profile), Niche, GreatSchools and similar. Helps search engines and AI tools match them to this site.',
      ),
    ],
  },
]

/** "410 Cedar Ridge Road\nGreenville, SC 29601" from the parts. */
export function joinAddress(d: { street?: string | null; city?: string | null; state?: string | null; postalCode?: string | null }): string {
  const place = [d.city?.trim(), [d.state?.trim(), d.postalCode?.trim()].filter(Boolean).join(' ')].filter(Boolean).join(', ')
  return [d.street?.trim(), place].filter(Boolean).join('\n')
}

/** beforeChange (collection): the one-block address follows the parts. */
export function withJoinedAddress<T extends Record<string, any>>(data: T): T {
  if (!data) return data
  const parts = ['street', 'city', 'state', 'postalCode'] as const
  if (parts.some((p) => p in data) && parts.some((p) => data[p])) (data as any).address = joinAddress(data)
  return data
}

/** Splits an old one-block address into parts (used by the migration). */
export function splitAddress(address: string): { street: string; city: string; state: string; postalCode: string } {
  const lines = String(address ?? '')
    .split(/\n|,(?=[^,]*,\s*[A-Za-z]{2}\b)/)
    .map((s) => s.trim())
    .filter(Boolean)
  const last = lines.length > 1 ? lines.pop()! : ''
  const m = last.match(/^(.*?),\s*([A-Za-z]{2})\s+(\d{5}(?:-\d{4})?)$/) ?? last.match(/^(.*?),\s*([A-Za-z]{2})$/)
  return {
    street: lines.join(', '),
    city: m ? m[1].trim() : last,
    state: m ? m[2].toUpperCase() : '',
    postalCode: m?.[3] ?? '',
  }
}
