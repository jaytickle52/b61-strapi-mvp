import type { Block, Condition, Field } from 'payload'
import { whenCondition, type When } from './controls'
import { isB61Admin } from '../../access'
import { validateCssClass } from '../lib/custom-css'

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
  /**
   * The Content panel that opens first (by its label). Without it: the first
   * panel, unless the element's main content (a list, the Content editor, a
   * column of elements) sits outside the panels, in which case all start closed.
   */
  open?: string
  design: DesignPanels
}

/** A Content panel. defineElement decides which one opens first and adds its header summary. */
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

type ContentSummary = { name: string; kind: 'text' | 'rich' | 'list' | 'upload' | 'choice'; one?: string; many?: string; labels?: Record<string, string> }

/**
 * What a closed Content panel says about itself: the first thing filled in,
 * e.g. "Heading · A place to grow in faith", "Buttons · Schedule a tour, Apply now",
 * "Media · Students in the library". Heading lines come before the eyebrow.
 */
function summariseContent(fields: Field[]): ContentSummary[] {
  const out: ContentSummary[] = []
  // Choices ("Fill with: Programs") only speak when nothing has been typed.
  const choices: ContentSummary[] = []
  const walk = (list: Field[]) => {
    for (const f of list) {
      if (f.type === 'row' || f.type === 'collapsible') {
        walk(f.fields)
        continue
      }
      if (!('name' in f)) continue
      if (f.type === 'text' || f.type === 'textarea') out.push({ name: f.name, kind: 'text' })
      else if (f.type === 'richText') out.push({ name: f.name, kind: 'rich' })
      else if (f.type === 'upload') out.push({ name: f.name, kind: 'upload' })
      else if ((f.type === 'select' || f.type === 'radio') && f.name !== 'headingLevel') {
        const labels = Object.fromEntries(
          (f.options ?? []).map((o) => (typeof o === 'string' ? [o, o] : [o.value, typeof o.label === 'string' ? o.label : o.value])),
        )
        choices.push({ name: f.name, kind: 'choice', labels })
      }
      else if (f.type === 'array') {
        const labels = (f as any).labels ?? {}
        out.push({
          name: f.name,
          kind: 'list',
          one: typeof labels.singular === 'string' ? labels.singular.toLowerCase() : 'item',
          many: typeof labels.plural === 'string' ? labels.plural.toLowerCase() : 'items',
        })
      }
    }
  }
  walk(fields)
  const lead = out.findIndex((s) => s.name === 'lines')
  if (lead > 0) out.unshift(...out.splice(lead, 1))
  return [...out, ...choices]
}

const MAIN_TYPES = new Set(['array', 'blocks', 'richText'])

/** Content panels start closed with a summary in the header; one opens first (see ElementSpec.open). */
function contentPanels(fields: Field[], open?: string): Field[] {
  const firstPanel = fields.find((f) => f.type === 'collapsible') as any
  const mainOutside = fields.some((f) => MAIN_TYPES.has(f.type))
  const openLabel = open ?? (mainOutside ? null : firstPanel?.label)
  return fields.map((f) => {
    if (f.type !== 'collapsible') return f
    const label = typeof f.label === 'string' ? f.label : ''
    return {
      ...f,
      admin: {
        ...f.admin,
        initCollapsed: label !== openLabel,
        components: {
          ...(f.admin?.components ?? {}),
          Label: { path: '@/b61/kit/admin/PanelLabel#PanelLabel', clientProps: { label, content: summariseContent(f.fields) } },
        },
      },
    } as Field
  })
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

/**
 * Design > Advanced: a CSS class for this one element, so the school's Custom
 * CSS (School settings > Look) can target it. Banner 61 admins only; school
 * staff never see it. The class goes on a wrapper around the element (see
 * kit/render/custom-class.tsx), so no element's own markup changes.
 */
function advancedPanel(): Field[] {
  return [
    {
      type: 'collapsible',
      label: 'Advanced',
      admin: {
        initCollapsed: true,
        className: 'b61-panel',
        condition: (_data: unknown, _sibling: unknown, ctx: any) => isB61Admin(ctx?.user),
      },
      fields: [
        {
          name: 'cssClass',
          label: 'CSS class',
          type: 'text',
          validate: validateCssClass,
          access: {
            create: ({ req }) => isB61Admin(req.user),
            update: ({ req }) => isB61Admin(req.user),
          },
          admin: { placeholder: 'e.g. ls-hero-tilt', description: 'Banner 61 only. Style it in School settings > Look > Custom CSS.' },
        },
      ],
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
          { label: 'Content', fields: contentPanels(spec.content, spec.open) },
          {
            label: 'Design',
            fields: [
              ...designPanel('Layout', d.layout, true),
              ...designPanel('Size & spacing', d.size, false),
              ...(d.part ? designPanel(d.part.label, d.part.fields, false) : []),
              ...designPanel('Color', d.color, false),
              ...designPanel('Accents', d.accents, false),
              ...advancedPanel(),
            ],
          },
        ],
      },
    ],
  }
}
