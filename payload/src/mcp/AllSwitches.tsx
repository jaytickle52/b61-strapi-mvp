'use client'
import { Button, useAllFormFields, useForm } from '@payloadcms/ui'

/*
 * Banner 61 > MCP keys: "Turn all on" / "Turn all off" above the key's
 * permission switches, so a new key doesn't need every box ticked by hand.
 * `paths` (every switch's form path) is worked out on the server from the
 * keys collection's fields in `src/mcp/config.ts`, so a new collection or
 * tool is covered without touching this file. Only changes the form; nothing
 * is saved until Save is pressed.
 */
type Props = { paths?: string[] }

export const AllSwitches = ({ paths = [] }: Props) => {
  const [fields] = useAllFormFields()
  const { dispatchFields, setModified } = useForm()
  const on = paths.filter((p) => fields[p]?.value === true).length

  const setAll = (value: boolean) => {
    for (const path of paths) dispatchFields({ type: 'UPDATE', path, value } as any)
    setModified(true)
  }

  if (!paths.length) return null
  return (
    <div className="b61-mcp-all" style={{ marginBottom: 'var(--base)' }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>Permissions</div>
      <p style={{ margin: '0 0 8px', color: 'var(--theme-elevation-500)' }} data-b61-mcp-count>
        {on} of {paths.length} switched on
      </p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button buttonStyle="secondary" size="small" margin={false} disabled={on === paths.length} onClick={() => setAll(true)}>
          Turn all on
        </Button>
        <Button buttonStyle="secondary" size="small" margin={false} disabled={on === 0} onClick={() => setAll(false)}>
          Turn all off
        </Button>
      </div>
    </div>
  )
}
