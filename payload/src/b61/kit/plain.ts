/** Plain text as rich text: one paragraph per line, links left as text. */
export function plainToRich(text: string | null | undefined) {
  const lines = String(text ?? '').split('\n').map((l) => l.trim()).filter(Boolean)
  if (!lines.length) return null
  return {
    root: {
      type: 'root', format: '' as const, indent: 0, version: 1, direction: 'ltr' as const,
      children: lines.map((text) => ({
        type: 'paragraph', format: '' as const, indent: 0, version: 1, direction: 'ltr' as const, textFormat: 0, textStyle: '',
        children: [{ type: 'text', text, format: 0, style: '', mode: 'normal', detail: 0, version: 1 }],
      })),
    },
  }
}
