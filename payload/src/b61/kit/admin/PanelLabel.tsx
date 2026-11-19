'use client'
import { useFormFields, useRowLabel } from '@payloadcms/ui'
import { usePhotoName } from './photoName'

type Rule = { field?: string; in?: (string | boolean | null)[]; filled?: boolean; all?: Rule[] }
type DesignSummary = { name: string; labels?: Record<string, string>; unset?: string; prefix?: string; when?: Rule | Rule[] }
type ContentSummary = { name: string; kind: 'text' | 'rich' | 'list' | 'upload' | 'choice'; one?: string; many?: string; labels?: Record<string, string> }
type Spec = { label: string; summary?: DesignSummary[]; content?: ContentSummary[]; holds?: string[] }

/** First words of a rich-text value. */
function firstWords(rich: any): string {
  const walk = (n: any): string => (n?.text ? n.text : Array.isArray(n?.children) ? n.children.map(walk).join(' ') : '')
  return walk(rich?.root).replace(/\s+/g, ' ').trim().slice(0, 80)
}

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

/**
 * A panel header that shows what is set inside it, so a closed panel still says
 * what it holds. Design panels list their choices ("Padding · Normal / Tight");
 * Content panels show the first thing filled in ("Heading · A place to grow",
 * "Buttons · Schedule a tour, Apply now", "Media · Students in the library").
 * The kit builds the spec from the panel's own fields; nothing is hand-written per element.
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
      const state = fields[`${prefix}${s.name}`] as any
      // A control hidden by its own condition (e.g. Card Grid's link text styles) says nothing.
      if (state?.passesCondition === false) return null
      const v = state?.value
      if (v === null || v === undefined || v === '') return s.unset ?? null
      // "Site default" says nothing about this element, so it stays out of the header.
      if (v === 'site') return null
      if (typeof v === 'boolean') return v ? s.labels?.true ?? null : null
      if (s.prefix) return `${s.prefix} ${v}`
      return s.labels?.[String(v)] ?? String(v)
    }),
  )

  // A plain string (not an object), so the header only re-renders when it changes.
  const content = useFormFields(([fields]) => {
    for (const s of props.content ?? []) {
      const key = `${prefix}${s.name}`
      const state = fields[key] as any
      if (!state || state.passesCondition === false) continue
      const v = state.value
      if (s.kind === 'text') {
        // An uploaded video's player address says where files are kept; editors see what it is.
        if (/mediadelivery\.net/i.test(str(v))) return 'Uploaded video'
        if (str(v)) return str(v)
      } else if (s.kind === 'rich') {
        const t = firstWords(v)
        if (t) return t
      } else if (s.kind === 'choice') {
        if (v !== null && v !== undefined && v !== '') return s.labels?.[String(v)] ?? String(v)
      } else if (s.kind === 'upload') {
        const id = v && typeof v === 'object' ? v.id : v
        if (id !== null && id !== undefined && id !== '') return `\u0000photo:${id}`
      } else if (s.kind === 'list') {
        const n = typeof v === 'number' ? v : Array.isArray(v) ? v.length : state.rows?.length ?? 0
        if (!n) continue
        const names: string[] = []
        for (let i = 0; i < n; i++) {
          const row = `${key}.${i}.`
          const t =
            str(fields[`${row}label`]?.value) ||
            str(fields[`${row}text`]?.value) ||
            str(fields[`${row}title`]?.value) ||
            firstWords(fields[`${row}body`]?.value)
          if (t) names.push(t)
        }
        if (names.length) return names.join(s.name === 'lines' ? ' ' : ', ')
        return `${n} ${n === 1 ? s.one ?? 'item' : s.many ?? 'items'}`
      }
    }
    return ''
  })

  const photoId = content.startsWith('\u0000photo:') ? content.slice(7) : null
  const photo = usePhotoName(photoId)
  const contentText = photoId ? photo : content

  const shown = props.content ? (contentText ? [contentText] : []) : values.filter(Boolean)
  return (
    <span className="b61-panel-label" data-b61-panel-of={props.holds ? parent : undefined} data-b61-holds={props.holds?.join(' ')}>
      <span>{props.label}</span>
      {shown.length > 0 && <span className="b61-panel-label__sum">{shown.join(' / ')}</span>}
    </span>
  )
}
