/*
 * Colour helpers shared by the School settings editor and the site:
 * hex checking and WCAG contrast, so staff see at once whether text stays
 * readable on a colour they pick.
 */

export const HEX_COLOR = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i

/** "#abc" or "abc" or "#AABBCC" → "#aabbcc"; anything else → null. */
export function normalizeHex(v: unknown): string | null {
  if (typeof v !== 'string') return null
  let h = v.trim().replace(/^#?/, '#')
  if (!HEX_COLOR.test(h)) return null
  if (h.length === 4) h = '#' + h.slice(1).split('').map((c) => c + c).join('')
  return h.toLowerCase()
}

function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16)
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2]
}

/** WCAG contrast ratio between two colours (1 to 21). */
export function contrast(a: string, b: string): number {
  const x = normalizeHex(a)
  const y = normalizeHex(b)
  if (!x || !y) return 1
  const [hi, lo] = [luminance(x), luminance(y)].sort((p, q) => q - p)
  return (hi + 0.05) / (lo + 0.05)
}

export const WHITE = '#ffffff'
export const INK = '#1a1a1a'

/** Which text reads best on a colour, and whether it meets WCAG AA for body text (4.5:1). */
export function textOn(bg: string): { text: 'white' | 'dark'; ratio: number; passes: boolean } {
  const w = contrast(bg, WHITE)
  const d = contrast(bg, INK)
  const best = w >= d ? { text: 'white' as const, ratio: w } : { text: 'dark' as const, ratio: d }
  return { ...best, passes: best.ratio >= 4.5 }
}

/** Field validation: empty is fine (defaults apply), otherwise a hex colour. */
export function validateHex(v: unknown): true | string {
  if (v == null || v === '') return true
  return normalizeHex(v) ? true : 'Use a hex color like #1F3A5F (pick one with the swatch).'
}
