'use client'

/** The unit beside a number field ("%", "px"), so the label stays terse (EDITING-STANDARD.md section 5). */
export function Unit({ unit }: { unit: string }) {
  return <span className="b61-unit">{unit}</span>
}
