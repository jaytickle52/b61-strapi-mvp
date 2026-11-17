import type { Field } from 'payload'
import { isB61Admin } from '../../access'
import { DIALS, THEMES, THEME_OPTIONS, type DialName } from './style'

/** Two dials per row, in the order DIALS lists them. */
function dialRows(): Field[] {
  const names = Object.keys(DIALS) as DialName[]
  const rows: Field[] = []
  for (let i = 0; i < names.length; i += 2) {
    rows.push({
      type: 'row',
      fields: names.slice(i, i + 2).map((name) => {
        const d = DIALS[name] as { label: string; options: { value: string; label: string }[]; description?: string }
        return {
          name,
          label: d.label,
          type: 'select',
          options: d.options.map((o) => ({ label: o.label, value: o.value })),
          admin: { width: '50%', placeholder: 'Theme default', ...(d.description ? { description: d.description } : {}) },
        } as Field
      }),
    })
  }
  return rows
}

/**
 * School settings > Look > Style (Banner 61). A theme plus dials that override
 * it; empty dials follow the theme. Banner 61 admins only: school staff keep
 * colours, fonts and every element's Design tab, and never see this group.
 * Rendering: lib/style.ts (b61Style), hooks in styles/style.css.
 */
export function styleGroup(): Field {
  return {
    name: 'style',
    label: 'Style (Banner 61)',
    type: 'group',
    access: {
      create: ({ req }) => isB61Admin(req.user),
      update: ({ req }) => isB61Admin(req.user),
    },
    admin: {
      condition: (_data: unknown, _sibling: unknown, ctx: any) => isB61Admin(ctx?.user),
      description: 'The shape of the site. Pick a theme, then move any dial to override it; empty dials follow the theme.',
    },
    fields: [
      {
        name: 'theme',
        label: 'Theme',
        type: 'select',
        options: THEME_OPTIONS,
        admin: {
          placeholder: 'Classic',
          description: `${Object.values(THEMES).map((t) => `${t.label}: ${t.description}`).join(' ')} Picking Heritage, Warm or Bold also sets its fonts; change them after if you like.`,
          components: { Field: '@/b61/lib/ThemeSelect#ThemeSelect' },
        },
      },
      ...dialRows(),
    ],
  }
}
