/*
 * Plain text out of a document for the site search: every Lexical text node,
 * plus the short text fields elements use (headings, eyebrows, quotes...).
 */
const TEXT_KEYS = new Set([
  'title', 'name', 'eyebrow', 'text', 'quote', 'attribution', 'label', 'figure', 'note',
  'summary', 'subheadline', 'caption', 'role', 'department', 'grades', 'location', 'question',
])
const SKIP_KEYS = new Set(['id', 'blockType', 'blockName', 'slug', 'url', 'type', 'format', 'mode', 'style', 'direction'])

export function plainText(value: unknown, max = 20000): string {
  const out: string[] = []
  let size = 0
  const walk = (v: unknown, key?: string) => {
    if (size > max || v == null) return
    if (typeof v === 'string') {
      if (key && TEXT_KEYS.has(key) && v.trim()) {
        out.push(v.trim())
        size += v.length
      }
      return
    }
    if (Array.isArray(v)) return v.forEach((x) => walk(x))
    if (typeof v !== 'object') return
    const o = v as Record<string, unknown>
    // A Lexical text node.
    if (o.type === 'text' && typeof o.text === 'string') {
      out.push(o.text)
      size += o.text.length
      return
    }
    for (const [k, x] of Object.entries(o)) if (!SKIP_KEYS.has(k)) walk(x, k)
  }
  walk(value)
  return out.join(' ').replace(/\s+/g, ' ').trim().slice(0, max)
}

// Words a page shows as running text. Button labels, eyebrows, stat figures and
// names are left out: they read badly as a description.
const PROSE_KEYS = new Set(['text', 'quote', 'summary', 'subheadline', 'caption', 'intro', 'body', 'description'])
// Parts that are headings or buttons, whatever their inner fields are called.
const NOT_PROSE = new Set(['heading', 'lines', 'subheads', 'eyebrow', 'buttons', 'primary', 'secondary', 'button', 'link', 'links', 'cta'])

/**
 * A search-result description (about 155 characters) from a page's own words,
 * for pages whose SEO description is empty. Ends at a sentence where it can,
 * otherwise at a word, with an ellipsis.
 */
export function descriptionFrom(value: unknown, max = 155): string {
  const out: string[] = []
  let size = 0
  const walk = (v: unknown, inProse: boolean) => {
    if (size > 600 || v == null) return
    if (typeof v === 'string') {
      if (inProse && v.trim()) {
        out.push(v.trim())
        size += v.length
      }
      return
    }
    if (Array.isArray(v)) return v.forEach((x) => walk(x, inProse))
    if (typeof v !== 'object') return
    const o = v as Record<string, unknown>
    if (o.type === 'text' && typeof o.text === 'string') {
      out.push(o.text)
      size += o.text.length
      return
    }
    for (const [k, x] of Object.entries(o)) if (!SKIP_KEYS.has(k) && !NOT_PROSE.has(k)) walk(x, inProse || PROSE_KEYS.has(k))
  }
  walk(value, typeof value === 'string')
  return clip(out.join(' ').replace(/\s+/g, ' ').trim(), max)
}

/** Shortens text to `max` characters: at a sentence end if one falls past the halfway mark, else at a word. */
export function clip(text: string, max = 155): string {
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const sentence = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '), cut.lastIndexOf('? '))
  if (sentence > max / 2) return cut.slice(0, sentence + 1)
  const word = cut.lastIndexOf(' ')
  return `${cut.slice(0, word > max / 2 ? word : max - 1).replace(/[\s,;:.-]+$/, '')}…`
}

/** The first photo in a page's sections (its hero, usually), for link previews when no share image is set. */
export function firstImage(value: unknown): unknown {
  let found: unknown = null
  const walk = (v: unknown) => {
    if (found || v == null || typeof v !== 'object') return
    if (Array.isArray(v)) return v.forEach(walk)
    const o = v as Record<string, unknown>
    if (typeof o.url === 'string' && typeof o.mimeType === 'string' && o.mimeType.startsWith('image/') && o.mimeType !== 'image/svg+xml') {
      found = o
      return
    }
    for (const [k, x] of Object.entries(o)) if (!SKIP_KEYS.has(k)) walk(x)
  }
  walk(value)
  return found
}
