'use client'
import { useFormFields, useRowLabel } from '@payloadcms/ui'

type Rule = { field?: string; in?: (string | boolean | null)[]; filled?: boolean; all?: Rule[] }
type Spec = { label: string; summary?: { name: string; labels?: Record<string, string>; unset?: string; prefix?: string; when?: Rule | Rule[] }[] }

/**
 * A panel header that shows what is set inside it, e.g. "Padding · Normal / Tight",
 * so a closed panel still says what it holds. The kit builds the spec from the
 * panel's own fields; nothing is hand-written per element.
 */
export function PanelLabel(props: Spec) {
  const { path } = useRowLabel()
  const parent = path.split('.').slice(0, -1).join('.')
  const prefix = parent ? `${parent}.` : ''
  const values = useFormFields(([fields]) =>
    (props.summary ?? []).map((s) => {
      if (s.when) {
        const rules = Array.isArray(s.when) ? s.when : [s.when]
        const test = (r: Rule): boolean => {
          if (r.all) return r.all.every(test)
          const v = fields[`${prefix}${r.field}`]?.value as any
          return r.filled ? Boolean(v) : (r.in ?? []).includes(v ?? null)
        }
        const ok = rules.some(test)
        if (!ok) return null
      }
      const v = fields[`${prefix}${s.name}`]?.value
      if (v === null || v === undefined || v === '') return s.unset ?? null
      // "Site default" says nothing about this element, so it stays out of the header.
      if (v === 'site') return null
      if (typeof v === 'boolean') return v ? s.labels?.true ?? null : null
      if (s.prefix) return `${s.prefix} ${v}`
      return s.labels?.[String(v)] ?? String(v)
    }),
  )
  const shown = values.filter(Boolean)
  return (
    <span className="b61-panel-label">
      <span>{props.label}</span>
      {shown.length > 0 && <span className="b61-panel-label__sum">{shown.join(' / ')}</span>}
    </span>
  )
}
