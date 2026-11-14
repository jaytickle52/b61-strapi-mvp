'use client'
import { FieldDescription, FieldError, FieldLabel, useField } from '@payloadcms/ui'
import type { RadioFieldClientComponent } from 'payload'
import { Icon } from './icons'

/**
 * Segmented buttons for a radio field (2-5 fixed choices), like Breakdance's
 * button bars. Keyboard: arrow keys move between choices (radiogroup pattern).
 * clientProps.icons maps option values to icon names; clientProps.iconOnly
 * hides the words (they stay as accessible names and tooltips).
 */
export const Segmented: RadioFieldClientComponent = (props) => {
  const { field, path, readOnly } = props
  const { icons = {}, iconOnly = false } = props as typeof props & { icons?: Record<string, string>; iconOnly?: boolean }
  const { value, setValue, showError } = useField<string>({ path })
  const options = (field.options ?? []).map((o) => (typeof o === 'string' ? { label: o, value: o } : o))
  const current = value ?? undefined
  const label = typeof field.label === 'string' ? field.label : field.name

  const move = (dir: number) => {
    const i = Math.max(0, options.findIndex((o) => o.value === current))
    const next = options[(i + dir + options.length) % options.length]
    setValue(next.value)
    requestAnimationFrame(() => document.getElementById(`${path}-${next.value}`)?.focus())
  }

  return (
    <div className={`field-type b61-seg${showError ? ' error' : ''}`}>
      <FieldLabel label={field.label} path={path} required={field.required} />
      <div
        role="radiogroup"
        aria-label={label}
        className="b61-seg__group"
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); move(1) }
          if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); move(-1) }
        }}
      >
        {options.map((o) => {
          const on = o.value === current
          const text = typeof o.label === 'string' ? o.label : o.value
          const icon = icons[o.value]
          return (
            <button
              key={o.value}
              id={`${path}-${o.value}`}
              type="button"
              role="radio"
              aria-checked={on}
              tabIndex={on || (!current && o === options[0]) ? 0 : -1}
              disabled={readOnly}
              title={iconOnly ? text : undefined}
              aria-label={iconOnly ? text : undefined}
              className={`b61-seg__opt${on ? ' is-on' : ''}${iconOnly ? ' is-icon' : ''}`}
              onClick={() => setValue(o.value)}
            >
              {icon && <Icon name={icon} />}
              {!iconOnly && <span>{text}</span>}
            </button>
          )
        })}
      </div>
      <FieldError path={path} />
      <FieldDescription description={field.admin?.description} path={path} />
    </div>
  )
}
