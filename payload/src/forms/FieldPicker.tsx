'use client'
import { SelectField, useForm } from '@payloadcms/ui'
import { useEffect, useState } from 'react'

const TAKES_ANSWER = new Set([
  'text',
  'textarea',
  'email',
  'phone',
  'number',
  'select',
  'radio',
  'checkbox',
  'date',
  'state',
  'country',
])

/** "Show only when … " picks another question on this form by its label. */
export function FieldPicker(props: any) {
  const { fields, getDataByPath } = useForm()
  const [options, setOptions] = useState<{ label: string; value: string }[]>([])
  const own = String(props.path ?? '')
    .split('.')
    .slice(0, 2)
    .join('.')

  useEffect(() => {
    const blocks = (getDataByPath('fields') as any[]) ?? []
    setOptions(
      blocks
        .map((b, i) => ({ b, path: `fields.${i}` }))
        .filter(({ b, path }) => b?.name && TAKES_ANSWER.has(b.blockType) && path !== own)
        .map(({ b }) => ({ label: b.label || b.name, value: b.name })),
    )
  }, [fields, getDataByPath, own])

  return (
    <SelectField
      {...props}
      field={{
        ...(props.field ?? {}),
        options,
        admin: {
          ...(props.field?.admin ?? {}),
          description: options.length
            ? props.field?.admin?.description
            : 'Save the form once to choose from its questions.',
        },
      }}
    />
  )
}
