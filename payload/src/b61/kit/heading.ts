/*
 * The Heading field (EDITING-STANDARD.md section 2): one box, typed like a
 * sentence, with one Emphasize button. Stored as Lexical JSON. Emphasized
 * words carry Lexical's `highlight` text format; a line break (Shift+Enter) or
 * a new paragraph starts a new line on wider screens. Phones let the heading
 * flow and balance it, so a typed break can't leave a stray word.
 *
 * Pure functions, safe on the server and in the browser.
 */

/** Lexical's bit for the `highlight` text format, which the Emphasize button sets. */
export const EMPHASIS = 128

export type HeadingRun = { text: string; em: boolean }
/** A heading as lines of runs. */
export type HeadingLines = HeadingRun[][]

type Node = { type?: string; text?: string; format?: number | string; children?: Node[] }

const textNode = (text: string, em: boolean) => ({ type: 'text', text, format: em ? EMPHASIS : 0, detail: 0, mode: 'normal', style: '', version: 1 })
const lineBreak = () => ({ type: 'linebreak', version: 1 })

/** Lexical JSON for lines of runs: one paragraph, lines joined by line breaks. */
export function headingFromLines(lines: HeadingLines): object | null {
  const kept = lines.map((l) => l.filter((r) => r.text)).filter((l) => l.length)
  if (!kept.length) return null
  const children: object[] = []
  kept.forEach((line, i) => {
    if (i > 0) children.push(lineBreak())
    line.forEach((r) => children.push(textNode(r.text, r.em)))
  })
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: null,
      children: [{ type: 'paragraph', format: '', indent: 0, version: 1, direction: null, textFormat: 0, textStyle: '', children }],
    },
  }
}

/**
 * Anything a heading may be given, as Lexical JSON:
 * - Lexical JSON as it is;
 * - text, where *stars* mark emphasis and a new line is a line break
 *   ("Rooted in faith.\n*Ready for life.*") — for templates, demo content and the connector;
 * - the old heading lines ([{ text, emphasize }] or plain strings), one line each.
 */
export function toHeading(value: unknown): object | null {
  if (value === null || value === undefined || value === '') return null
  if (typeof value === 'object' && !Array.isArray(value) && (value as any).root) return value as object
  if (typeof value === 'string') {
    return headingFromLines(
      value.split(/\r?\n/).map((line) =>
        line
          .split(/(\*[^*]+\*)/)
          .filter(Boolean)
          .map((part) => (part.startsWith('*') && part.endsWith('*') && part.length > 2 ? { text: part.slice(1, -1), em: true } : { text: part, em: false })),
      ),
    )
  }
  if (Array.isArray(value)) {
    return headingFromLines(
      value.map((l: any) => (typeof l === 'string' ? [{ text: l, em: false }] : [{ text: String(l?.text ?? ''), em: Boolean(l?.emphasize) }])),
    )
  }
  return null
}

/** A heading's lines of runs. Paragraphs and line breaks both start a new line. */
export function headingLines(value: unknown): HeadingLines {
  const rich = toHeading(value) as { root?: Node } | null
  const lines: HeadingLines = []
  let line: HeadingRun[] = []
  const end = () => {
    const kept = line.filter((r) => r.text)
    if (kept.length && kept.some((r) => r.text.trim())) lines.push(kept)
    line = []
  }
  const walk = (n: Node, em: boolean) => {
    if (n.type === 'linebreak') return end()
    if (n.type === 'text') {
      const f = typeof n.format === 'number' ? n.format : 0
      line.push({ text: n.text ?? '', em: em || (f & EMPHASIS) !== 0 })
      return
    }
    for (const c of n.children ?? []) walk(c, em)
    if (n.type === 'paragraph' || n.type === 'heading') end()
  }
  for (const c of rich?.root?.children ?? []) walk(c, false)
  end()
  return lines
}

/** The heading as plain words (labels, search, the page outline). */
export function headingText(value: unknown): string {
  return headingLines(value)
    .map((l) => l.map((r) => r.text).join(''))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export const hasHeading = (value: unknown) => headingText(value).length > 0

/** The words that Changing words rotate: the first emphasized phrase. */
export function emphasizedPhrase(value: unknown): string {
  const run = headingLines(value).flat().find((r) => r.em && r.text.trim())
  return run ? run.text.trim() : ''
}
