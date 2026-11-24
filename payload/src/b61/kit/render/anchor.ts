/**
 * Design > Advanced > Anchor: a name for one section, so a button or menu link
 * can jump to it (`/banner-connect#pricing`, or `#pricing` on the same page).
 *
 * The id goes on the element's own root, not on a wrapper, so the rules that
 * rely on two elements sitting next to each other keep working.
 */

/** Lower-case letters, digits and hyphens; anything else becomes a hyphen. */
export function normalizeAnchor(v: unknown): string {
  if (typeof v !== 'string') return ''
  return v
    .trim()
    .replace(/^#+/, '')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
}

/** Spread onto an element's root: `<div {...anchorAttr(block)} ...>`. */
export function anchorAttr(block: { anchor?: unknown } | null | undefined): { id?: string } {
  const id = normalizeAnchor(block?.anchor)
  // An id must not start with a digit for `#…` CSS selectors; links still work, but keep it simple.
  return id && /^[a-z]/.test(id) ? { id } : {}
}

/** Field validation: empty, or a usable anchor name. */
export function validateAnchor(v: unknown): true | string {
  if (v == null || v === '') return true
  if (typeof v !== 'string') return 'Use letters, numbers and hyphens.'
  const n = normalizeAnchor(v)
  if (!n || !/^[a-z]/.test(n)) return 'Start with a letter, then letters, numbers or hyphens, e.g. pricing.'
  if (n !== v.trim().replace(/^#+/, '')) return `Use lower-case letters, numbers and hyphens, e.g. ${n || 'pricing'}.`
  return true
}
