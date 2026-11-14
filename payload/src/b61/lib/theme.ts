import type { CSSProperties } from 'react'

const HEX = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i

function rgbTriple(hex: string | null | undefined): string | null {
  const m = hex?.trim().match(HEX)
  if (!m) return null
  let h = m[1]
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  const n = parseInt(h, 16)
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`
}

const color = (v: string | null | undefined, fallback: string) => (v && HEX.test(v.trim()) ? (v.trim().startsWith('#') ? v.trim() : `#${v.trim()}`) : fallback)
const mix = (base: string, other: string, pct: number) => `color-mix(in srgb, ${base} ${pct}%, ${other})`

export const FONT_STACKS: Record<string, string> = {
  Fraunces: '"Fraunces", Georgia, serif',
  'Playfair Display': '"Playfair Display", Georgia, serif',
  Merriweather: '"Merriweather", Georgia, serif',
  'EB Garamond': '"EB Garamond", Georgia, serif',
  Montserrat: '"Montserrat", system-ui, sans-serif',
  Poppins: '"Poppins", system-ui, sans-serif',
  Inter: '"Inter", system-ui, sans-serif',
  'Source Sans 3': '"Source Sans 3", system-ui, sans-serif',
  Lato: '"Lato", system-ui, sans-serif',
  'Open Sans': '"Open Sans", system-ui, sans-serif',
}

type Settings = {
  primaryColor?: string | null
  secondaryColor?: string | null
  accentColor?: string | null
  paperColor?: string | null
  primaryDeep?: string | null
  secondarySoft?: string | null
  accentStrong?: string | null
  accentDeep?: string | null
  headingFont?: string | null
  bodyFont?: string | null
  uiFont?: string | null
}

/**
 * The B61 raw palette for this school, the values a Breakdance site registers
 * under Settings > Variables. Shades left empty are mixed from the base colour.
 */
export function b61Theme(s: Settings): CSSProperties {
  const primary = color(s.primaryColor, '#1f3a5f')
  const secondary = color(s.secondaryColor, '#c8a24a')
  const accent = color(s.accentColor, '#b23a2e')
  const paper = color(s.paperColor, '#f7f3ec')
  return {
    '--b61-palette-primary': primary,
    '--b61-palette-primary-deep': s.primaryDeep ? color(s.primaryDeep, primary) : mix(primary, '#000', 78),
    '--b61-palette-secondary': secondary,
    '--b61-palette-secondary-soft': s.secondarySoft ? color(s.secondarySoft, secondary) : mix(secondary, '#fff', 35),
    '--b61-palette-accent': accent,
    '--b61-palette-accent-strong': s.accentStrong ? color(s.accentStrong, accent) : mix(accent, '#000', 85),
    '--b61-palette-accent-deep': s.accentDeep ? color(s.accentDeep, accent) : mix(accent, '#000', 70),
    '--b61-palette-paper': paper,
    '--b61-scrim-rgb': rgbTriple(primary) ?? '31 58 95',
    '--b61-light-scrim-rgb': rgbTriple(paper) ?? '247 243 236',
    '--b61-font-display': FONT_STACKS[s.headingFont ?? ''] ?? FONT_STACKS.Fraunces,
    '--b61-font-body': FONT_STACKS[s.bodyFont ?? ''] ?? FONT_STACKS.Inter,
    '--b61-font-ui': FONT_STACKS[s.uiFont ?? ''] ?? FONT_STACKS.Montserrat,
  } as CSSProperties
}
