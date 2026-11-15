/** Most custom CSS a school can carry (School settings > Look > Custom CSS). */
export const CUSTOM_CSS_MAX = 100_000

/**
 * A school's custom CSS, ready to place inside a <style> tag, or null.
 * Only Banner 61 admins can write it, but it is still kept from closing the
 * tag early (`</style>` would end the stylesheet and start HTML).
 */
export function customCssTag(css: unknown): string | null {
  if (typeof css !== 'string') return null
  const trimmed = css.trim().slice(0, CUSTOM_CSS_MAX)
  if (!trimmed) return null
  return trimmed.replace(/<\/(style)/gi, '<\\/$1').replace(/<!--/g, '<\\!--')
}

/** Element CSS classes: letters, digits, hyphens and underscores, space-separated. */
export const CSS_CLASS = /^\s*(-?[_a-zA-Z][_a-zA-Z0-9-]*)(\s+-?[_a-zA-Z][_a-zA-Z0-9-]*)*\s*$/

export function validateCssClass(value: unknown): true | string {
  if (value == null || value === '') return true
  return CSS_CLASS.test(String(value)) ? true : 'Class names use letters, numbers, hyphens and underscores, separated by spaces (e.g. my-band wide).'
}

/** The class names to put on an element's wrapper, or null. */
export function cssClassOf(block: { cssClass?: unknown } | null | undefined): string | null {
  const v = block?.cssClass
  if (typeof v !== 'string' || !v.trim() || validateCssClass(v) !== true) return null
  return v.trim().split(/\s+/).join(' ')
}
