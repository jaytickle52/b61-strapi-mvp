/**
 * Site style: the dials and themes in School settings > Look > Style (Banner 61).
 *
 * Colours and fonts are the school's brand. Style is the SHAPE of the site:
 * corners, buttons, how headings are set, frames, spacing, width and motion.
 * A theme is a named set of dial positions; each dial a school sets itself
 * overrides its theme. "Classic" is the original B61 look, so a school with no
 * theme and no dials renders exactly as before (nothing is emitted).
 *
 * Every dial lands on a token the elements already read (tokens.css,
 * site-raw.css) or on one data attribute that style.css keys on. No element
 * markup changes with the style.
 */
import type { CSSProperties } from 'react'
import { FONTS } from './theme'

type Option = {
  value: string
  label: string
  /** CSS variables this position sets on <html>. */
  vars?: Record<string, string>
  /** data-* attributes this position sets on <html> (style.css keys on them). */
  attrs?: Record<string, string>
}

type Dial = {
  label: string
  /** The Classic position: emits nothing. */
  base: string
  options: Option[]
  description?: string
}

export const DIALS = {
  corners: {
    label: 'Corners',
    base: 'rounded',
    options: [
      { value: 'square', label: 'Square', vars: { '--b61-radius': '0px', '--b61-radius-sm': '0px' } },
      { value: 'soft', label: 'Soft', vars: { '--b61-radius': '6px', '--b61-radius-sm': '4px' } },
      { value: 'rounded', label: 'Rounded' },
      { value: 'round', label: 'Round', vars: { '--b61-radius': '26px', '--b61-radius-sm': '14px' } },
    ],
  },
  buttons: {
    label: 'Button shape',
    base: 'pill',
    options: [
      { value: 'pill', label: 'Pill' },
      { value: 'rounded', label: 'Rounded', vars: { '--b61-radius-btn': '10px' } },
      { value: 'square', label: 'Square', vars: { '--b61-radius-btn': '0px' } },
    ],
  },
  buttonCase: {
    label: 'Button letters',
    base: 'typed',
    options: [
      { value: 'typed', label: 'As typed' },
      { value: 'capitals', label: 'Capitals', attrs: { 'data-b61-btn-case': 'upper' } },
    ],
  },
  headingCase: {
    label: 'Heading letters',
    base: 'typed',
    options: [
      { value: 'typed', label: 'As typed' },
      { value: 'capitals', label: 'Capitals', attrs: { 'data-b61-hcase': 'upper' } },
    ],
  },
  headingWeight: {
    label: 'Heading weight',
    base: 'bold',
    description: 'Uses the nearest weight the heading font has.',
    options: [
      { value: 'light', label: 'Light' },
      { value: 'regular', label: 'Regular' },
      { value: 'semibold', label: 'Semibold' },
      { value: 'bold', label: 'Bold' },
      { value: 'heavy', label: 'Heavy' },
    ],
  },
  headingTracking: {
    label: 'Heading spacing',
    base: 'normal',
    options: [
      { value: 'tight', label: 'Tight', attrs: { 'data-b61-htrack': 'tight' } },
      { value: 'normal', label: 'Normal' },
      { value: 'wide', label: 'Wide', attrs: { 'data-b61-htrack': 'wide' } },
    ],
  },
  typeScale: {
    label: 'Heading sizes',
    base: 'standard',
    options: [
      {
        value: 'compact',
        label: 'Compact',
        vars: {
          '--b61-text-h1': 'clamp(2.25rem, 1.5rem + 2.6vw, 3.5rem)',
          '--b61-text-h2': 'clamp(1.75rem, 1.35rem + 1.2vw, 2.25rem)',
          '--b61-text-h3': 'clamp(1.375rem, 1.2rem + 0.6vw, 1.625rem)',
        },
      },
      { value: 'standard', label: 'Standard' },
      {
        value: 'dramatic',
        label: 'Dramatic',
        vars: {
          '--b61-text-h1': 'clamp(2.75rem, 1.2rem + 5.2vw, 6rem)',
          '--b61-text-h2': 'clamp(2.125rem, 1.3rem + 2.6vw, 3.5rem)',
          '--b61-text-h3': 'clamp(1.625rem, 1.25rem + 1.2vw, 2.125rem)',
        },
      },
    ],
  },
  emphasis: {
    label: 'Accent heading line',
    base: 'italic',
    description: 'How a heading line marked Emphasize is set.',
    options: [
      { value: 'italic', label: 'Italic + colour' },
      { value: 'colour', label: 'Colour only', vars: { '--b61-emph-style': 'normal' } },
      {
        value: 'underline',
        label: 'Underlined',
        vars: { '--b61-emph-style': 'normal', '--b61-emph-decoration': 'underline 0.07em', '--b61-emph-offset': '0.16em' },
      },
    ],
  },
  eyebrow: {
    label: 'Eyebrow line',
    base: 'line',
    description: 'Elements set to "Site default" follow this.',
    options: [
      { value: 'line', label: 'Line' },
      { value: 'none', label: 'No line', vars: { '--b61-eyebrow-rule': 'none' } },
    ],
  },
  eyebrowCase: {
    label: 'Eyebrow letters',
    base: 'capitals',
    options: [
      { value: 'capitals', label: 'Capitals' },
      { value: 'typed', label: 'As typed', vars: { '--b61-eyebrow-case': 'none', '--b61-eyebrow-tracking': '0.02em' } },
    ],
  },
  frames: {
    label: 'Photo frames',
    base: 'offset',
    options: [
      { value: 'offset', label: 'Offset frame' },
      { value: 'close', label: 'Close frame', vars: { '--b61-frame-offset': '8px', '--b61-frame-width': '3px' } },
      { value: 'none', label: 'None', vars: { '--b61-frame-offset': '0px', '--b61-frame-width': '0px' } },
    ],
  },
  spacing: {
    label: 'Section spacing',
    base: 'standard',
    options: [
      { value: 'compact', label: 'Compact', vars: { '--b61-pad-block': 'clamp(44px, 6vw, 76px)', '--b61-pad-block-tight': 'clamp(20px, 3vw, 36px)' } },
      { value: 'standard', label: 'Standard' },
      { value: 'airy', label: 'Airy', vars: { '--b61-pad-block': 'clamp(80px, 11vw, 156px)', '--b61-pad-block-tight': 'clamp(36px, 5vw, 64px)' } },
    ],
  },
  width: {
    label: 'Page width',
    base: 'standard',
    options: [
      { value: 'narrow', label: 'Narrow', vars: { '--b61-width': '1080px' } }, // long menus may wrap in the header
      { value: 'standard', label: 'Standard' },
      { value: 'wide', label: 'Wide', vars: { '--b61-width': '1360px' } },
    ],
  },
  heroEdge: {
    label: 'Hero edge line',
    base: 'shown',
    options: [
      { value: 'shown', label: 'Shown' },
      { value: 'hidden', label: 'Hidden', vars: { '--b61-edge': 'none' } },
    ],
  },
  motion: {
    label: 'Entrance motion',
    base: 'rise',
    description: 'Elements with Entrance animation on. Visitors who ask for less motion get none.',
    options: [
      { value: 'rise', label: 'Rise' },
      { value: 'fade', label: 'Fade', vars: { '--b61-rise-shift': '0px', '--b61-rise-shift-card': '0px' } },
      { value: 'float', label: 'Slow float', vars: { '--b61-rise-shift': '48px', '--b61-rise-shift-card': '28px', '--b61-motion-rise': '1100ms' } },
      { value: 'off', label: 'Off', vars: { '--b61-rise-enabled': '0' } },
    ],
  },
} satisfies Record<string, Dial>

export type DialName = keyof typeof DIALS
export type StyleValues = Partial<Record<DialName, string | null>>

/** Nominal weights for Heading weight; the font's nearest weight is used. */
const HEADING_WEIGHTS: Record<string, number> = { light: 300, regular: 400, semibold: 600, bold: 700, heavy: 900 }

export type ThemeName = 'classic' | 'modern' | 'bold' | 'soft' | 'editorial'

/** The themes: a starting position for every dial. Classic is the original B61 look. */
export const THEMES: Record<ThemeName, { label: string; description: string; dials: StyleValues }> = {
  classic: {
    label: 'Classic',
    description: 'The original B61 look: rounded corners, pill buttons, italic accent lines, offset photo frames.',
    dials: {},
  },
  modern: {
    label: 'Modern',
    description: 'Clean and open: soft corners, no frames or eyebrow lines, colour accents, wide and airy.',
    dials: {
      corners: 'soft', buttons: 'rounded', headingWeight: 'semibold', headingTracking: 'tight', emphasis: 'colour',
      eyebrow: 'none', frames: 'none', spacing: 'airy', width: 'wide', heroEdge: 'hidden', motion: 'fade',
    },
  },
  bold: {
    label: 'Bold',
    description: 'Poster-like: square corners and buttons, heavy capital headings, dramatic sizes.',
    dials: {
      corners: 'square', buttons: 'square', buttonCase: 'capitals', headingCase: 'capitals', headingWeight: 'heavy',
      typeScale: 'dramatic', emphasis: 'colour', motion: 'rise',
    },
  },
  soft: {
    label: 'Soft',
    description: 'Warm and friendly: round corners, regular-weight headings, close frames, a slow float.',
    dials: {
      corners: 'round', headingWeight: 'regular', eyebrow: 'none', eyebrowCase: 'typed', frames: 'close',
      spacing: 'airy', motion: 'float',
    },
  },
  editorial: {
    label: 'Editorial',
    description: 'Like a magazine: square, light large headings, airy spacing, no frames.',
    dials: {
      corners: 'square', buttons: 'square', buttonCase: 'capitals', headingWeight: 'light', headingTracking: 'tight',
      typeScale: 'dramatic', spacing: 'airy', frames: 'none', heroEdge: 'hidden', motion: 'fade',
    },
  },
}

export const THEME_OPTIONS = (Object.keys(THEMES) as ThemeName[]).map((value) => ({ label: THEMES[value].label, value }))

type StyleSettings = { style?: ({ theme?: string | null } & StyleValues) | null; headingFont?: string | null }

/** Each dial's position: the school's own, else its theme's, else Classic. */
export function resolveStyle(s: StyleSettings): Record<DialName, string> {
  const own = s.style ?? {}
  const theme = THEMES[(own.theme as ThemeName) ?? 'classic'] ?? THEMES.classic
  const out = {} as Record<DialName, string>
  for (const name of Object.keys(DIALS) as DialName[]) {
    const dial = DIALS[name] as unknown as Dial
    const pick = own[name] ?? theme.dials[name] ?? dial.base
    out[name] = dial.options.some((o) => o.value === pick) ? (pick as string) : dial.base
  }
  return out
}

/** The heading weight to load and use, snapped to what the heading font has (null = the Classic 700). */
export function headingWeightFor(s: StyleSettings): number | null {
  const pos = resolveStyle(s).headingWeight
  if (pos === DIALS.headingWeight.base) return null
  const want = HEADING_WEIGHTS[pos] ?? 700
  const spec = FONTS[s.headingFont ?? ''] ?? FONTS.Fraunces
  return spec.weights.reduce((a, b) => (Math.abs(b - want) < Math.abs(a - want) ? b : a))
}

/**
 * The CSS variables and data attributes for <html>. Only positions that differ
 * from Classic are emitted, so an untouched school's page is unchanged.
 */
export function b61Style(s: StyleSettings): { vars: CSSProperties; attrs: Record<string, string> } {
  const pos = resolveStyle(s)
  const vars: Record<string, string> = {}
  const attrs: Record<string, string> = {}
  for (const name of Object.keys(DIALS) as DialName[]) {
    const opt: Option | undefined = ((DIALS[name] as unknown as Dial).options).find((o) => o.value === pos[name])
    if (opt?.vars) Object.assign(vars, opt.vars)
    if (opt?.attrs) Object.assign(attrs, opt.attrs)
  }
  const weight = headingWeightFor(s)
  if (weight) vars['--b61-text-display-weight'] = String(weight)
  return { vars: vars as CSSProperties, attrs }
}
