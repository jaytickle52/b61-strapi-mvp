import { cookies } from 'next/headers'
import { THEMES, type ThemeName } from './style'

export const THEME_PREVIEW_COOKIE = 'b61-theme-preview'

/**
 * The theme picked with /next/theme/<name>, when the page is on a demo or
 * preview address (`hidden` = hiddenFromSearch()). Never on a school's own
 * domain: visitors there always get the school's real theme.
 */
export async function themePreview(hidden: boolean): Promise<ThemeName | null> {
  if (!hidden) return null
  const name = (await cookies()).get(THEME_PREVIEW_COOKIE)?.value
  return name && name in THEMES ? (name as ThemeName) : null
}

/** School settings as they would be with that theme: its style and its fonts. The school's own dials are dropped. */
export function withTheme<T extends Record<string, any>>(settings: T, theme: ThemeName | null): T {
  if (!theme) return settings
  return { ...settings, ...(THEMES[theme].fonts ?? {}), style: { theme } }
}
