import { getSettings } from '@/lib/data'
import { asMedia } from '@/b61/lib/media'
import { textOn } from '@/branding/color'

/** The school's own browser-tab icon: its Site icon, else its logo. */
export async function schoolIcon() {
  const settings = await getSettings()
  return asMedia((settings as any).siteIcon) ?? asMedia(settings.logo)
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/**
 * A plain stand-in icon for a school with no Site icon or logo yet: the first
 * letter of its name on its brand colour, like the letter mark in the header.
 */
export async function letterIcon(): Promise<string> {
  const settings = await getSettings()
  const bg = /^#[0-9a-f]{6}$/i.test(settings.primaryColor ?? '') ? settings.primaryColor! : '#1f3a5f'
  const fg = textOn(bg).text === 'white' ? '#ffffff' : '#1c1b22'
  const letter = esc((settings.schoolName.trim().charAt(0) || 'S').toUpperCase())
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${bg}"/><text x="32" y="44" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="38" font-weight="700" fill="${fg}">${letter}</text></svg>`
}
