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
