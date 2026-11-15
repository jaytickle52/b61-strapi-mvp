/*
 * How many main headings (H1) a page's sections would render, from the
 * editor's form state (flat paths like `sections.0.lines.0.text`). Used by the
 * page editor's heading note (admin/HeadingCheck.tsx). Same rule the site
 * renders by (groups.ts resolveHeadingLevel): Automatic is H1 only for the
 * first top-level section; elements inside containers never become H1 on
 * Automatic. A section without heading lines renders no heading at all.
 */

type Block = { top: number | null; level: string; hasLines: boolean }

/** How many H1s a page's form state would render, or null when there are no sections yet. */
export function countH1(fields: Record<string, { value?: unknown } | undefined>): number | null {
  const blocks = new Map<string, Block>()
  const blockOf = (path: string) => {
    const parts = path.split('.')
    let last = -1
    parts.forEach((p, i) => {
      if (/^\d+$/.test(p)) last = i
    })
    if (last < 0) return null
    const key = parts.slice(0, last + 1).join('.')
    const numeric = parts.slice(0, last + 1).filter((p) => /^\d+$/.test(p))
    if (!blocks.has(key)) blocks.set(key, { top: numeric.length === 1 ? Number(numeric[0]) : null, level: 'auto', hasLines: false })
    return blocks.get(key)!
  }
  let any = false
  for (const [path, field] of Object.entries(fields)) {
    if (!path.startsWith('sections.')) continue
    any = true
    const line = path.match(/^(.*)\.lines\.\d+\.text$/)
    if (line) {
      const b = blockOf(line[1])
      if (b && typeof field?.value === 'string' && field.value.trim()) b.hasLines = true
      continue
    }
    if (path.endsWith('.headingLevel')) {
      const b = blockOf(path.slice(0, -'.headingLevel'.length))
      if (b && typeof field?.value === 'string') b.level = field.value
    }
  }
  if (!any) return null
  let count = 0
  for (const b of blocks.values()) {
    if (!b.hasLines) continue
    if (b.level === 'h1' || (b.level === 'auto' && b.top === 0)) count++
  }
  return count
}
