/**
 * Brand fonts: a school's own licensed font files (School settings > Look >
 * Brand fonts), used in place of the Google font for headings, body or buttons.
 *
 * The files live in Documents (Vercel Blob, another domain). Browsers only load
 * a font from another domain when it sends CORS headers, so the page asks for
 * each file through this site's own address (/next/brand-font/<id>), which
 * passes the file on (app/(frontend)/next/brand-font/[id]/route.ts).
 */

export const FONT_MIME_TYPES = [
  'font/woff2',
  'font/woff',
  'font/otf',
  'font/ttf',
  'font/sfnt',
  'font/collection',
  'application/font-woff',
  'application/font-woff2',
  'application/font-sfnt',
  'application/vnd.ms-opentype',
  'application/x-font-otf',
  'application/x-font-ttf',
  'application/x-font-opentype',
  'application/x-font-truetype',
]

/** Which @font-face format() hint goes with a file, by its name. */
export function fontFormat(filename: string | null | undefined): string | null {
  const ext = filename?.toLowerCase().split('.').pop()
  return ext === 'woff2'
    ? 'woff2'
    : ext === 'woff'
      ? 'woff'
      : ext === 'otf'
        ? 'opentype'
        : ext === 'ttf'
          ? 'truetype'
          : null
}

const CONTENT_TYPES: Record<string, string> = {
  woff2: 'font/woff2',
  woff: 'font/woff',
  otf: 'font/otf',
  ttf: 'font/ttf',
}

/** The Content-Type to serve a font with, from its file name only (null: not a font). */
export function fontContentType(filename: string | null | undefined): string | null {
  const ext = filename?.toLowerCase().split('.').pop() ?? ''
  return CONTENT_TYPES[ext] ?? null
}

export const isFontFile = (filename: string | null | undefined, mimeType?: string | null) =>
  Boolean(fontFormat(filename)) || (mimeType ? FONT_MIME_TYPES.includes(mimeType) : false)

const FAMILY = /^[A-Za-z0-9][A-Za-z0-9 \-]{0,59}$/

/** A family name is used inside CSS, so keep it to letters, digits, spaces and hyphens. */
export function validateFontFamily(v: unknown): true | string {
  if (v == null || v === '') return true
  if (typeof v !== 'string' || !FAMILY.test(v.trim()))
    return 'Use letters, numbers, spaces and hyphens, e.g. DIN Pro Condensed.'
  return true
}

/** "Headings use" and the like: empty, or the family name of a row in Font files above. */
export function validateBrandFontRole(v: unknown, { data }: { data?: any }): true | string {
  if (v == null || v === '') return true
  const ok = validateFontFamily(v)
  if (ok !== true) return ok
  const families = ((data?.brandFonts ?? []) as BrandFontRow[]).map((r) =>
    typeof r?.family === 'string' ? r.family.trim() : '',
  )
  if (!families.includes(String(v).trim())) {
    return families.length
      ? `Type one of the family names above exactly: ${families.filter(Boolean).join(', ')}.`
      : 'Add a font file above first, then type its family name here.'
  }
  return true
}

const cleanFamily = (v: unknown): string | null =>
  typeof v === 'string' && FAMILY.test(v.trim()) ? v.trim() : null

type BrandFontRow = {
  family?: string | null
  file?: unknown
  weight?: number | null
  style?: string | null
}
type BrandFontSettings = {
  brandFonts?: BrandFontRow[] | null
  headingFontBrand?: string | null
  bodyFontBrand?: string | null
  uiFontBrand?: string | null
}

/** The @font-face rules for a school's uploaded fonts (empty when it has none). */
export function brandFontFaces(s: BrandFontSettings): string {
  const rules: string[] = []
  for (const row of s.brandFonts ?? []) {
    const family = cleanFamily(row?.family)
    const doc =
      row?.file && typeof row.file === 'object'
        ? (row.file as {
            id?: number | string
            filename?: string | null
            mimeType?: string | null
            updatedAt?: string | null
            filesize?: number | null
          })
        : null
    if (!family || !doc?.id || !fontContentType(doc.filename)) continue
    const weight = Math.min(900, Math.max(100, Math.round(Number(row.weight) || 400)))
    const style = row.style === 'italic' ? 'italic' : 'normal'
    const fmt = fontFormat(doc.filename)
    // The version changes when the Document's file is replaced (same id), so browsers fetch the new font.
    const version = encodeURIComponent(
      `${doc.updatedAt ?? ''}-${doc.filesize ?? ''}-${doc.filename ?? ''}`.replace(
        /[^A-Za-z0-9._-]/g,
        '',
      ),
    )
    const src = `url("/next/brand-font/${encodeURIComponent(String(doc.id))}?v=${version}")${fmt ? ` format("${fmt}")` : ''}`
    rules.push(
      `@font-face{font-family:"${family}";src:${src};font-weight:${weight};font-style:${style};font-display:swap}`,
    )
  }
  return rules.join('\n')
}

/** Families the school has actually uploaded (so a typo in "Headings use" falls back cleanly). */
function uploadedFamilies(s: BrandFontSettings): Set<string> {
  return new Set(
    (s.brandFonts ?? []).map((r) => cleanFamily(r?.family)).filter((f): f is string => Boolean(f)),
  )
}

/**
 * CSS variables that put a brand font in front of the Google font's stack,
 * for each role the school pointed at an uploaded family.
 */
export function brandFontVars(
  s: BrandFontSettings,
  stacks: { display: string; body: string; ui: string },
): Record<string, string> {
  const have = uploadedFamilies(s)
  const out: Record<string, string> = {}
  const use = (v: unknown) => {
    const f = cleanFamily(v)
    return f && have.has(f) ? f : null
  }
  const h = use(s.headingFontBrand)
  const b = use(s.bodyFontBrand)
  const u = use(s.uiFontBrand)
  if (h) out['--b61-font-display'] = `"${h}", ${stacks.display}`
  if (b) out['--b61-font-body'] = `"${b}", ${stacks.body}`
  if (u) out['--b61-font-ui'] = `"${u}", ${stacks.ui}`
  return out
}
