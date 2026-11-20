'use client'
import { ArrayField, useField, useForm, useFormFields } from '@payloadcms/ui'
import type { ArrayFieldClientComponent } from 'payload'
import { useEffect, useId, useRef, useState } from 'react'

/*
 * The Tabs element's list of tabs, drawn like the site draws it (Jay, 20 Nov
 * 2026): a row of tab names; click one to edit that tab alone. Add, move and
 * remove sit beside the row.
 *
 * Under the hood it is Payload's own array field (rows, validation, drag
 * state, click-to-field's row ids all unchanged), with every row but the
 * selected one hidden and its row header (the name, drag handle, menu)
 * replaced by the strip. The selected tab is the open row: click-to-field
 * opens a row the usual way (PreviewFocus), and the strip follows.
 */
export const TabStrip: ArrayFieldClientComponent = (props) => {
  const { addFieldRow, removeFieldRow, moveFieldRow, dispatchFields } = useForm()
  const path = props.path ?? props.field.name
  const { rows = [], errorPaths = [] } = useField<number>({ path, hasRows: true })
  const titles = useFormFields(([fields]) => rows.map((_, i) => String(fields[`${path}.${i}.label`]?.value ?? '')))
  const scope = `b61-tabstrip-${useId().replace(/[^\w-]/g, '')}`
  const base = path.split('.').join('-')
  const [active, setActive] = useState(0)
  const prev = useRef<(boolean | undefined)[]>([])
  // A tab just added: selected once its row exists.
  const pending = useRef<number | null>(null)
  const readOnly = Boolean(props.readOnly)

  // Keep exactly one row open: the selected tab. A row opened from elsewhere
  // (click-to-field) becomes the selected tab.
  useEffect(() => {
    const open = rows.map((r: any) => r.collapsed === false)
    const newlyOpened = open.findIndex((o, i) => o && !prev.current[i])
    prev.current = open
    let want = active
    if (pending.current != null) {
      if (rows.length <= pending.current) return
      want = pending.current
      pending.current = null
    } else if (newlyOpened >= 0 && newlyOpened !== active) want = newlyOpened
    if (want > rows.length - 1) want = Math.max(rows.length - 1, 0)
    if (want !== active) setActive(want)
    if (rows.length && rows.some((r: any, i: number) => (r.collapsed === false) !== (i === want))) {
      dispatchFields({ type: 'SET_ROW_COLLAPSED', path, updatedRows: rows.map((r: any, i: number) => ({ ...r, collapsed: i !== want })) } as any)
    }
  }, [rows, active, path, dispatchFields])

  const select = (i: number) => {
    setActive(i)
    dispatchFields({ type: 'SET_ROW_COLLAPSED', path, updatedRows: rows.map((r: any, j: number) => ({ ...r, collapsed: j !== i })) } as any)
  }
  const add = () => {
    pending.current = rows.length
    addFieldRow({ path, rowIndex: rows.length, schemaPath: props.schemaPath ?? props.field.name })
  }
  const move = (to: number) => {
    if (to < 0 || to >= rows.length) return
    moveFieldRow({ path, moveFromIndex: active, moveToIndex: to })
    setActive(to)
  }
  const remove = () => {
    if (!rows.length) return
    const name = titles[active] || `Tab ${active + 1}`
    if (!window.confirm(`Remove the tab "${name}"?`)) return
    removeFieldRow({ path, rowIndex: active })
    setActive(Math.max(0, active - 1))
  }
  const hasError = (i: number) => errorPaths.some((p) => p.startsWith(`${path}.${i}.`))

  return (
    <div id={scope} className="b61-tabstrip">
      <style>{`
        #${scope} > .array-field > .array-field__header,
        #${scope} > .array-field > .array-field__add-row { display: none; }
        #${scope} div[id^="${base}-row-"]:not([id="${base}-row-${active}"]) { display: none; }
        #${scope} div[id="${base}-row-${active}"] > .collapsible > .collapsible__toggle-wrap { display: none; }
        #${scope} div[id="${base}-row-${active}"] > .collapsible { border: 0; }
      `}</style>
      <div className="b61-tabstrip__bar">
        <div className="b61-tabstrip__tabs" role="tablist" aria-label="Tabs">
          {rows.map((r: any, i: number) => (
            <button
              key={r.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              className={`b61-tabstrip__tab${i === active ? ' is-active' : ''}${hasError(i) ? ' has-error' : ''}`}
              onClick={() => select(i)}
            >
              {titles[i] || `Tab ${i + 1}`}
            </button>
          ))}
          {!readOnly && (
            <button type="button" className="b61-tabstrip__add" onClick={add} aria-label="Add a tab">
              + Add tab
            </button>
          )}
        </div>
        {!readOnly && rows.length > 0 && (
          <div className="b61-tabstrip__actions">
            <button type="button" onClick={() => move(active - 1)} disabled={active === 0} aria-label="Move this tab left" title="Move left">
              ←
            </button>
            <button type="button" onClick={() => move(active + 1)} disabled={active >= rows.length - 1} aria-label="Move this tab right" title="Move right">
              →
            </button>
            <button type="button" onClick={remove} className="b61-tabstrip__remove">
              Remove tab
            </button>
          </div>
        )}
      </div>
      {rows.length === 0 && <p className="b61-tabstrip__empty">No tabs yet. Add one to start.</p>}
      <ArrayField {...(props as any)} />
    </div>
  )
}
