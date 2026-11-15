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

/** Blend two hex colours: t = 0 gives a, t = 1 gives b. */
export function mixHex(a: string, b: string, t: number): string {
  const x = normalizeHex(a) ?? WHITE
  const y = normalizeHex(b) ?? WHITE
  const p = (h: string, i: number) => parseInt(h.slice(1 + i * 2, 3 + i * 2), 16)
  const ch = [0, 1, 2].map((i) => Math.round(p(x, i) + (p(y, i) - p(x, i)) * t))
  return '#' + ch.map((c) => c.toString(16).padStart(2, '0')).join('')
}

/**
 * The colour to use for `fg` on `bg` so it reaches `min` contrast: `fg` itself
 * when it already does, else the nearest shade of it moved toward white (on a
 * dark ground) or ink (on a light one). Used for the secondary colour on the
 * dark (primary) surfaces: footer headings, eyebrows and the focus ring.
 */
export function readableOn(fg: string, bg: string, min: number): string {
  const f = normalizeHex(fg)
  const b = normalizeHex(bg)
  if (!f || !b || contrast(f, b) >= min) return f ?? fg
  const toward = contrast(b, WHITE) >= contrast(b, INK) ? WHITE : INK
  for (let t = 0.05; t < 1; t += 0.05) {
    const c = mixHex(f, toward, t)
    if (contrast(c, b) >= min) return c
  }
  return toward
}

/** Field validation: empty is fine (defaults apply), otherwise a hex colour. */
export function validateHex(v: unknown): true | string {
  if (v == null || v === '') return true
  return normalizeHex(v) ? true : 'Use a hex color like #1F3A5F (pick one with the swatch).'
}
