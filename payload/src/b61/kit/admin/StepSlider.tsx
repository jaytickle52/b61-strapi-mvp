'use client'
import { FieldLabel, useField } from '@payloadcms/ui'
import type { NumberFieldClientComponent } from 'payload'

/**
 * A stop on a site-wide 1-7 scale (tokens.css). Empty means "site default",
 * shown as such, with a reset. Named ends say which way is which.
 */
export const StepSlider: NumberFieldClientComponent = (props) => {
  const { field, path, readOnly } = props
  const { value, setValue } = useField<number | null>({ path })
  const { low = 'Narrow', high = 'Wide' } = props as typeof props & { low?: string; high?: string }
  const isSet = typeof value === 'number'
  return (
    <div className="field-type b61-step">
      <div className="b61-step__head">
        <FieldLabel label={field.label} path={path} />
        <span className="b61-step__value">
          {isSet ? `Step ${value}` : 'Site default'}
          {isSet && !readOnly && (
            <button type="button" className="b61-step__reset" onClick={() => setValue(null)}>
              Reset
            </button>
          )}
        </span>
      </div>
      <input
        type="range"
        min={1}
        max={7}
        step={1}
        value={isSet ? value : 4}
        disabled={readOnly}
        aria-label={typeof field.label === 'string' ? field.label : field.name}
        aria-valuetext={isSet ? `Step ${value} of 7` : 'Site default'}
        className={`b61-step__range${isSet ? '' : ' is-default'}`}
        onChange={(e) => setValue(Number(e.target.value))}
      />
      <div className="b61-step__ends" aria-hidden="true">
        <span>{low}</span>
        <span>{high}</span>
      </div>
    </div>
  )
}
