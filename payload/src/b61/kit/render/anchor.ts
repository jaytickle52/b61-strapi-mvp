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
  return id && /^[a-z]/.test(id) && !RESERVED(id) ? { id } : {}
}

/** Ids the page itself uses: the skip link's target and the kit's own generated ids. */
const RESERVED = (id: string) => id === 'main' || id.startsWith('b61-')

/** Every anchor typed anywhere in a document (sections, sections inside Section/Tabs, ...). */
function anchorsIn(value: unknown, out: string[] = []): string[] {
  if (Array.isArray(value)) value.forEach((v) => anchorsIn(v, out))
  else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      if (k === 'anchor') {
        const n = normalizeAnchor(v)
        if (n) out.push(n)
      } else if (v && typeof v === 'object') anchorsIn(v, out)
    }
  }
  return out
}

/** Field validation: empty, or a usable anchor name no other section on the page uses. */
export function validateAnchor(v: unknown, { data }: { data?: unknown } = {}): true | string {
  if (v == null || v === '') return true
  if (typeof v !== 'string') return 'Use letters, numbers and hyphens.'
  const n = normalizeAnchor(v)
  if (!n || !/^[a-z]/.test(n))
    return 'Start with a letter, then letters, numbers or hyphens, e.g. pricing.'
  if (n !== v.trim().replace(/^#+/, ''))
    return `Use lower-case letters, numbers and hyphens, e.g. ${n || 'pricing'}.`
  if (RESERVED(n)) return 'That name is used by the page itself. Try another, e.g. pricing.'
  // A duplicated section copies its anchor; two of the same on one page break the link.
  if (data && anchorsIn(data).filter((a) => a === n).length > 1)
    return `Another section on this page already uses "${n}". Give this one a different name.`
  return true
}
