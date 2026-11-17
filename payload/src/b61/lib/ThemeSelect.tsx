'use client'
import type { SelectFieldClientComponent } from 'payload'
import { SelectField, useForm } from '@payloadcms/ui'
import { THEMES, type ThemeName } from './style'

/**
 * School settings > Look > Style > Theme. Picking a theme also sets the three
 * fonts it was drawn with (heading, body, buttons and labels), in the form, so
 * the font menus and the preview above change at once and the school's fonts
 * stay editable afterwards. Classic leaves the fonts alone.
 */
export const ThemeSelect: SelectFieldClientComponent = (props) => {
  const { dispatchFields, setModified } = useForm()
  const onChange = (value: string | string[]) => {
    const fonts = THEMES[value as ThemeName]?.fonts
    if (!fonts) return
    for (const [path, font] of Object.entries(fonts)) {
      dispatchFields({ type: 'UPDATE', path, value: font } as any)
    }
    setModified(true)
  }
  return <SelectField {...props} onChange={onChange} />
}
