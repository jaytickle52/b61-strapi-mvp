import type { Block, Condition, Field } from 'payload'
import { whenCondition, type When } from './controls'

/*
 * defineElement(): the one way to build a B61 element's form.
 *
 * It applies EDITING-STANDARD.md for you: the Content and Design tabs, the
 * Design panels in their fixed order and names, Layout open and the rest
 * closed with their current values in the header, and a section label that
 * names the element after its heading. An element supplies only its fields.
 */

type DesignPanels = {
  layout?: Field[]
  size?: Field[]
  /** The element's own part, e.g. { label: 'Cards', fields } */
  part?: { label: string; fields: Field[] }
  color?: Field[]
  accents?: Field[]
}

export type ElementSpec = {
  slug: string
  name: string
  plural?: string
  /** Which field, if any, picks the element's variant (shown in the section label). */
  mode?: { field: string; labels: Record<string, string> }
  content: Field[]
  design: DesignPanels
}

/** A Content panel (open by default). */
export function panel(label: string, fields: Field[], o: { condition?: Condition; when?: When; open?: boolean } = {}): Field {
  return {
    type: 'collapsible',
    label,
    fields,
    admin: {
      initCollapsed: o.open === false,
      className: 'b61-panel',
      condition: o.condition ?? whenCondition(o.when),
    },
  }
}

type Summary = { name: string; labels?: Record<string, string>; unset?: string; prefix?: string; when?: When }

/** Reads a panel's own fields to build its header summary. */
function summarise(fields: Field[]): Summary[] {
  const out: Summary[] = []
  for (const f of fields) {
    if (f.type === 'row' || f.type === 'collapsible') {
      out.push(...summarise(f.fields))
      continue
    }
    if (!('name' in f)) continue
    const w = (f as any).custom?.b61When as When | undefined
    if (f.type === 'radio' || f.type === 'select') {
      const labels = Object.fromEntries(
        (f.options ?? []).map((o) => (typeof o === 'string' ? [o, o] : [o.value, typeof o.label === 'string' ? o.label : o.value])),
      )
      out.push({ name: f.name, labels, when: w })
    } else if (f.type === 'number' && (f as any).custom?.b61Step) {
      out.push({ name: f.name, prefix: typeof f.label === 'string' ? f.label : f.name, when: w })
    } else if (f.type === 'checkbox') {
      out.push({ name: f.name, labels: { true: typeof f.label === 'string' ? f.label : f.name }, when: w })
    }
  }
  return out
}

function designPanel(label: string, fields: Field[] | undefined, open: boolean): Field[] {
  if (!fields?.length) return []
  return [
    {
      type: 'collapsible',
      label,
      fields,
      admin: {
        initCollapsed: !open,
        className: 'b61-panel',
        components: {
          Label: { path: '@/b61/kit/admin/PanelLabel#PanelLabel', clientProps: { label, summary: summarise(fields) } },
        },
      },
    } as Field,
  ]
}

export function defineElement(spec: ElementSpec): Block {
  const d = spec.design
  return {
    slug: spec.slug,
    labels: { singular: spec.name, plural: spec.plural ?? `${spec.name}s` },
    admin: {
      components: {
        Label: {
          path: '@/b61/kit/admin/ElementLabel#ElementLabel',
          clientProps: { name: spec.name, modeField: spec.mode?.field, modes: spec.mode?.labels },
        },
      },
    },
    fields: [
      {
        type: 'tabs',
        tabs: [
          { label: 'Content', fields: spec.content },
          {
            label: 'Design',
            fields: [
              ...designPanel('Layout', d.layout, true),
              ...designPanel('Size & spacing', d.size, false),
              ...(d.part ? designPanel(d.part.label, d.part.fields, false) : []),
              ...designPanel('Color', d.color, false),
              ...designPanel('Accents', d.accents, false),
            ],
          },
        ],
      },
    ],
  }
}
