'use client'
import type { TextFieldClientComponent } from 'payload'
import { useField } from '@payloadcms/ui'
import { normalizeHex, textOn } from './color'

/**
 * A colour field: a swatch to pick with, the hex code to paste a brand
 * guide's value into, and a readability check for text placed on it.
 */
export const ColorField: TextFieldClientComponent = ({ field, path }) => {
  const { value, setValue, showError, errorMessage } = useField<string>({ path: path ?? field.name })
  const label = typeof field.label === 'string' ? field.label : field.name
  const description = typeof field.admin?.description === 'string' ? field.admin.description : undefined
  const placeholder = typeof field.admin?.placeholder === 'string' ? field.admin.placeholder : undefined
  const hex = normalizeHex(value)
  const fallback = normalizeHex(placeholder) ?? normalizeHex((field as any).defaultValue) ?? '#888888'
  const check = hex ? textOn(hex) : null
  const id = `field-${path?.replace(/\./g, '__') ?? field.name}`

  return (
    <div className={`field-type text b61-color${showError ? ' error' : ''}`} style={{ flex: '1 1 220px' }}>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          type="color"
          aria-label={`${label}: pick a color`}
          value={hex ?? fallback}
          onChange={(e) => setValue(e.target.value)}
          style={{ width: 44, height: 40, padding: 2, border: '1px solid var(--theme-elevation-150)', borderRadius: 4, background: 'none', cursor: 'pointer', flex: 'none' }}
        />
        <input
          id={id}
          type="text"
          value={value ?? ''}
          placeholder={placeholder}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => {
            const n = normalizeHex(value)
            if (n && n !== value) setValue(n)
          }}
          spellCheck={false}
          style={{ flex: 1, minHeight: 40, padding: '0 12px', fontFamily: 'ui-monospace, monospace' }}
        />
      </div>
      {showError && errorMessage ? (
        <p className="field-description" style={{ color: 'var(--theme-error-500)' }}>{errorMessage}</p>
      ) : check ? (
        <p className="field-description" style={{ color: check.passes ? undefined : 'var(--theme-warning-650, #b45309)' }}>
          {check.passes
            ? `${check.text === 'white' ? 'White' : 'Dark'} text reads well on it (${check.ratio.toFixed(1)}:1).`
            : `Text is hard to read on it: best is ${check.text} text at ${check.ratio.toFixed(1)}:1 (aim for 4.5:1). Fine for borders and accents.`}
          {description ? ` ${description}` : ''}
        </p>
      ) : (
        description && <p className="field-description">{description}</p>
      )}
    </div>
  )
}
