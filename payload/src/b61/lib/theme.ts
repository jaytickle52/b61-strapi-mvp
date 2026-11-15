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

type FontSpec = { stack: string; weights: number[]; italic: boolean }

const serif = (name: string) => `"${name}", Georgia, serif`
const sans = (name: string) => `"${name}", system-ui, sans-serif`

/**
 * Google Fonts the schools can choose, with the weights each one really has.
 * Asking Google for a weight a family lacks fails the whole stylesheet, so
 * requests only name weights listed here (fontsHref below).
 */
export const FONTS: Record<string, FontSpec> = {
  // Serif
  Fraunces: { stack: serif('Fraunces'), weights: [400, 500, 600, 700], italic: true },
  'Playfair Display': { stack: serif('Playfair Display'), weights: [400, 500, 600, 700], italic: true },
  Merriweather: { stack: serif('Merriweather'), weights: [300, 400, 700, 900], italic: true },
  'EB Garamond': { stack: serif('EB Garamond'), weights: [400, 500, 600, 700], italic: true },
  Lora: { stack: serif('Lora'), weights: [400, 500, 600, 700], italic: true },
  'Libre Baskerville': { stack: serif('Libre Baskerville'), weights: [400, 700], italic: true },
  'Cormorant Garamond': { stack: serif('Cormorant Garamond'), weights: [400, 500, 600, 700], italic: true },
  'Crimson Pro': { stack: serif('Crimson Pro'), weights: [400, 500, 600, 700], italic: true },
  'Roboto Slab': { stack: serif('Roboto Slab'), weights: [400, 500, 600, 700], italic: false },
  // Sans
  Montserrat: { stack: sans('Montserrat'), weights: [400, 500, 600, 700], italic: true },
  Poppins: { stack: sans('Poppins'), weights: [400, 500, 600, 700], italic: true },
  Inter: { stack: sans('Inter'), weights: [400, 500, 600, 700], italic: true },
  'Source Sans 3': { stack: sans('Source Sans 3'), weights: [400, 500, 600, 700], italic: true },
  Lato: { stack: sans('Lato'), weights: [300, 400, 700, 900], italic: true },
  'Open Sans': { stack: sans('Open Sans'), weights: [400, 500, 600, 700], italic: true },
  Raleway: { stack: sans('Raleway'), weights: [400, 500, 600, 700], italic: true },
  'Nunito Sans': { stack: sans('Nunito Sans'), weights: [400, 600, 700], italic: true },
  'Work Sans': { stack: sans('Work Sans'), weights: [400, 500, 600, 700], italic: true },
  'DM Sans': { stack: sans('DM Sans'), weights: [400, 500, 600, 700], italic: true },
  Roboto: { stack: sans('Roboto'), weights: [400, 500, 700], italic: true },
  'Josefin Sans': { stack: sans('Josefin Sans'), weights: [400, 600, 700], italic: true },
  Oswald: { stack: sans('Oswald'), weights: [400, 500, 600, 700], italic: false },
}

/** Font stacks by name (kept for existing callers). */
export const FONT_STACKS: Record<string, string> = Object.fromEntries(Object.entries(FONTS).map(([k, v]) => [k, v.stack]))

const SERIFS = ['Fraunces', 'Playfair Display', 'Merriweather', 'EB Garamond', 'Lora', 'Libre Baskerville', 'Cormorant Garamond', 'Crimson Pro', 'Roboto Slab']
const SANS = ['Montserrat', 'Poppins', 'Inter', 'Source Sans 3', 'Lato', 'Open Sans', 'Raleway', 'Nunito Sans', 'Work Sans', 'DM Sans', 'Roboto', 'Josefin Sans']

/** The choices offered in School settings > Look, per role. */
export const HEADING_FONTS = [...SERIFS, ...SANS, 'Oswald']
export const BODY_FONTS = ['Inter', 'Source Sans 3', 'Lato', 'Open Sans', 'Nunito Sans', 'Work Sans', 'DM Sans', 'Roboto', 'Raleway', 'Lora', 'Merriweather', 'EB Garamond', 'Crimson Pro', 'Libre Baskerville']
export const UI_FONTS = ['Montserrat', 'Inter', 'Poppins', 'Lato', 'Source Sans 3', 'Open Sans', 'Raleway', 'Nunito Sans', 'Work Sans', 'DM Sans', 'Roboto', 'Josefin Sans', 'Oswald']

/** For each wanted weight, the closest weight the family has (no duplicates). */
function weightsFor(spec: FontSpec, want: number[]): number[] {
  const out = new Set<number>()
  for (const w of want) out.add(spec.weights.reduce((a, b) => (Math.abs(b - w) < Math.abs(a - w) ? b : a)))
  return [...out].sort((a, b) => a - b)
}

/**
 * The Google Fonts stylesheet for a school's heading, body and buttons fonts,
 * asking only for weights each family has. Unknown names fall back to defaults.
 */
export function fontsHref(s: { headingFont?: string | null; bodyFont?: string | null; uiFont?: string | null }): string {
  const pick = (name: string | null | undefined, fallback: string) => (name && FONTS[name] ? name : fallback)
  const roles: [string, number[], number[]][] = [
    [pick(s.headingFont, 'Fraunces'), [400, 600, 700], [400, 600]],
    [pick(s.bodyFont, 'Inter'), [400, 600], [400]],
    [pick(s.uiFont, 'Montserrat'), [500, 600, 700], []],
  ]
  const merged = new Map<string, { w: Set<number>; i: Set<number> }>()
  for (const [name, w, i] of roles) {
    const spec = FONTS[name]
    const m = merged.get(name) ?? { w: new Set(), i: new Set() }
    weightsFor(spec, w).forEach((x) => m.w.add(x))
    if (spec.italic && i.length) weightsFor(spec, i).forEach((x) => m.i.add(x))
    merged.set(name, m)
  }
  const families = [...merged].map(([name, { w, i }]) => {
    const fam = `family=${encodeURIComponent(name).replace(/%20/g, '+')}`
    const ws = [...w].sort((a, b) => a - b)
    if (!i.size) return `${fam}:wght@${ws.join(';')}`
    const pairs = [...ws.map((x) => `0,${x}`), ...[...i].sort((a, b) => a - b).map((x) => `1,${x}`)]
    return `${fam}:ital,wght@${pairs.join(';')}`
  })
  return `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`
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
