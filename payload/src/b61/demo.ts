import type { Payload, PayloadRequest } from 'payload'
import sharp from 'sharp'

/*
 * Demo content for the B61 Hero: abstract placeholder photos (generated, so
 * nobody mistakes them for the school's own) and one hero per demo page, each
 * showing a different side of the element: cover + image, band + collage,
 * cover + slideshow + meta line.
 */

const DEMO_TAG = '[b61-demo]'

function svgArt(w: number, h: number, a: string, b: string, seed: number) {
  const r = (n: number) => {
    const x = Math.sin(seed * 9301 + n * 49297) * 233280
    return x - Math.floor(x)
  }
  const circles = Array.from({ length: 7 }, (_, i) => {
    const cx = Math.round(r(i) * w)
    const cy = Math.round(r(i + 10) * h)
    const rad = Math.round((0.12 + r(i + 20) * 0.28) * Math.min(w, h))
    const fill = i % 2 ? b : '#ffffff'
    const op = (0.08 + r(i + 30) * 0.22).toFixed(2)
    return `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="${fill}" fill-opacity="${op}"/>`
  }).join('')
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/>
    </linearGradient>
    <filter id="blur"><feGaussianBlur stdDeviation="${Math.round(w / 40)}"/></filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <g filter="url(#blur)">${circles}</g>
</svg>`)
}

/** Creates (once) four placeholder photos in the school's colours. */
export async function ensureDemoImages(payload: Payload, colors: { a: string; b: string }, req?: PayloadRequest) {
  const existing = await payload.find({ collection: 'media', where: { alt: { contains: DEMO_TAG } }, limit: 10, req, sort: 'createdAt' })
  if (existing.totalDocs >= 4) return existing.docs.map((d) => d.id)
  const ids: number[] = []
  const specs = [
    { w: 2000, h: 1300, seed: 1, name: 'demo-campus.jpg', focal: { focalX: 65, focalY: 40 } },
    { w: 1400, h: 1750, seed: 2, name: 'demo-portrait.jpg', focal: undefined },
    { w: 1600, h: 1100, seed: 3, name: 'demo-classroom.jpg', focal: undefined },
    { w: 1600, h: 1100, seed: 4, name: 'demo-field.jpg', focal: undefined },
  ]
  for (const s of specs) {
    const [x, y] = s.seed % 2 ? [colors.a, colors.b] : [colors.b, colors.a]
    const data = await sharp(svgArt(s.w, s.h, x, y, s.seed)).jpeg({ quality: 82 }).toBuffer()
    const doc = await payload.create({
      collection: 'media',
      data: { alt: `Placeholder photo ${s.seed} ${DEMO_TAG}`, ...(s.focal ?? {}) },
      file: { data, mimetype: 'image/jpeg', name: s.name, size: data.length },
      req,
    })
    ids.push(doc.id as number)
  }
  return ids
}

/** "Rooted in faith. Ready for life." -> two lines; one sentence splits at its last comma. */
const splitTagline = (t: string) => {
  const sentences = t.split(/(?<=\.)\s+/).filter(Boolean)
  if (sentences.length > 1) return sentences
  const i = t.lastIndexOf(', ')
  return i > 0 ? [t.slice(0, i + 1), t.slice(i + 2)] : [t]
}

export function demoHeroes(opts: { tagline: string; mission: string; phone?: string; imgs: number[] }) {
  const [img1, img2, img3, img4] = opts.imgs
  const taglineLines = splitTagline(opts.tagline).map((text, i, arr) => ({ text, emphasize: i === arr.length - 1 && arr.length > 1 }))
  return {
    home: {
      blockType: 'b61Hero',
      eyebrow: 'Now enrolling',
      headingLevel: 'auto',
      lines: taglineLines,
      subheadline: opts.mission,
      subheadlineScale: 'body',
      buttons: [
        { label: 'Schedule a tour', link: { type: 'url', url: '/visit' }, variant: 'primary' },
        { label: 'Our programs', link: { type: 'url', url: '/programs' }, variant: 'light' },
      ],
      backgroundType: 'image',
      image: img1,
      layoutMode: 'cover',
      height: 'tall',
      verticalPosition: 'bottom',
      textAlign: 'left',
      overlay: 'gradient',
      surface: 'primary',
      entrance: 'on',
    },
    about: {
      blockType: 'b61Hero',
      eyebrow: 'About us',
      headingLevel: 'auto',
      lines: [
        { text: 'A school that knows', emphasize: false },
        { text: 'every child by name', emphasize: true },
      ],
      subheadline: opts.mission,
      subheadlineScale: 'display',
      buttons: [{ label: 'Meet our team', link: { type: 'url', url: '/staff' }, variant: 'link' }],
      collage: [{ image: img2 }, { image: img3 }, { image: img4 }],
      layoutMode: 'band',
      bandSize: 'standard',
      textAlign: 'left',
      surface: 'primary',
      entrance: 'on',
    },
    visit: {
      blockType: 'b61Hero',
      eyebrow: 'Visit',
      headingLevel: 'auto',
      lines: [
        { text: 'Come see it', emphasize: false },
        { text: 'for yourself', emphasize: true },
      ],
      subheadlineScale: 'meta',
      metaItems: [{ text: 'Tours Tue–Thu' }, { text: '9:00–11:00 AM' }, ...(opts.phone ? [{ text: opts.phone }] : [])],
      buttons: [{ label: 'Call to book a tour', link: { type: 'url', url: opts.phone ? `tel:${opts.phone.replace(/[^0-9+]/g, '')}` : '/visit' }, variant: 'primary' }],
      backgroundType: 'slideshow',
      slides: [{ image: img1 }, { image: img3 }, { image: img4 }],
      layoutMode: 'cover',
      height: 'medium',
      verticalPosition: 'center',
      textAlign: 'center',
      overlay: 'wash',
      surface: 'primary',
      eyebrowRule: 'both',
      entrance: 'on',
    },
  } as const
}

/** One paragraph in Payload's Lexical rich-text format. */
const para = (text: string) => ({
  root: {
    type: 'root', format: '' as const, indent: 0, version: 1, direction: 'ltr' as const,
    children: [{
      type: 'paragraph', format: '' as const, indent: 0, version: 1, direction: 'ltr' as const, textFormat: 0, textStyle: '',
      children: [{ type: 'text', text, format: 0, style: '', mode: 'normal', detail: 0, version: 1 }],
    }],
  },
})

/**
 * Demo B61 Splits: About gets a single photo with body copy, an emphasis line
 * and contact icon rows; Home gets a photo gallery with a pull quote.
 */
export function demoSplits(opts: { name: string; mission: string; phone?: string; email?: string; address?: string; imgs: number[] }) {
  const [img1, img2, img3, img4] = opts.imgs
  const short = opts.name.split(' ').slice(0, 2).join(' ')
  return {
    about: {
      blockType: 'b61Split',
      eyebrow: 'Our mission',
      headingLevel: 'auto',
      lines: [
        { text: 'Why families', emphasize: false },
        { text: `choose ${short}`, emphasize: true },
      ],
      contentBlocks: [
        { type: 'body', body: para(opts.mission) },
        { type: 'emphasis', text: 'Every child known, every day.' },
        ...(opts.phone ? [{ type: 'iconrow', icon: 'phone', text: opts.phone, hasLink: true, link: { type: 'url', url: `tel:${opts.phone.replace(/[^0-9+]/g, '')}` } }] : []),
        ...(opts.email ? [{ type: 'iconrow', icon: 'email', text: opts.email, hasLink: true, link: { type: 'url', url: `mailto:${opts.email}` } }] : []),
        ...(opts.address ? [{ type: 'iconrow', icon: 'location', text: opts.address.replace(/\n/g, ', ') }] : []),
      ],
      buttons: [{ label: 'Schedule a tour', link: { type: 'url', url: '/visit' }, variant: 'primary' }],
      media: 'photo',
      image: img3,
      imageShape: 'fixed',
      imageSide: 'right',
      verticalPosition: 'center',
      stackOrder: 'text',
      columnHeight: 'fit',
      headingAlign: 'left',
      surface: 'none',
      textPanel: 'none',
      frameColor: 'primary',
      entrance: 'on',
    },
    home: {
      blockType: 'b61Split',
      eyebrow: 'Life at school',
      headingLevel: 'auto',
      lines: [
        { text: 'A day in the life', emphasize: false },
        { text: 'of our students', emphasize: true },
      ],
      contentBlocks: [
        { type: 'body', body: para('Mornings start with chapel and close with friends on the field. In between: real books, hands-on science and teachers who know every student by name.') },
        { type: 'quote', text: 'Our kids come home talking about what they learned, not just what they did.', attribution: 'A current parent' },
      ],
      buttons: [{ label: 'See our programs', link: { type: 'url', url: '/programs' }, variant: 'link' }],
      media: 'gallery',
      images: [{ image: img2 }, { image: img4 }, { image: img1 }, { image: img3 }],
      columns: '2',
      imageShape: 'square',
      imageSide: 'left',
      verticalPosition: 'center',
      stackOrder: 'text',
      columnHeight: 'fit',
      headingAlign: 'left',
      surface: 'soft',
      textPanel: 'none',
      frameColor: 'secondary',
      entrance: 'on',
    },
  } as const
}

/**
 * Demo B61 Prose for the Visit page: heading beside the text, body copy, a
 * display-size emphasis line, then a link list of ways to get in touch.
 * `heading` and `body` carry over an existing block's words when upgrading.
 */
export function demoProse(opts: { heading?: string; body?: unknown; phone?: string; email?: string; address?: string }) {
  const rows = [
    ...(opts.phone ? [{ type: 'iconrow', icon: 'phone', text: `Call ${opts.phone}`, hasLink: true, link: { type: 'url', url: `tel:${opts.phone.replace(/[^0-9+]/g, '')}` } }] : []),
    ...(opts.email ? [{ type: 'iconrow', icon: 'email', text: `Email ${opts.email}`, hasLink: true, link: { type: 'url', url: `mailto:${opts.email}` } }] : []),
    ...(opts.address
      ? [{ type: 'iconrow', icon: 'location', text: 'Get directions', hasLink: true, link: { type: 'url', url: `https://maps.google.com/?q=${encodeURIComponent(opts.address.replace(/\n/g, ', '))}`, newTab: true } }]
      : []),
  ]
  return {
    blockType: 'b61Prose',
    eyebrow: 'Plan your visit',
    headingLevel: 'auto',
    lines: [{ text: opts.heading || 'How to schedule', emphasize: false }],
    contentBlocks: [
      {
        type: 'body',
        body:
          opts.body ??
          para('Tours run Tuesday through Thursday mornings and take about an hour. Bring your questions; bring your kids if you like.'),
      },
      { type: 'emphasis', scale: 'display', text: 'Most families know within the first ten minutes.' },
      ...rows.map((r, i) => (i === 0 ? { ...r, divider: true } : r)),
    ],
    headPosition: 'beside',
    textAlign: 'left',
    position: 'center',
    headingWidth: 'text',
    iconlistStyle: 'links',
    iconlistEdges: true,
    surface: 'none',
    eyebrowRule: 'site',
    headingRule: 'site',
    entrance: 'on',
  } as const
}

/**
 * A B61 CTA Band. With a photo it shows the background treatment: Dark
 * surface, shade held at 70% or more, centred text. The words carry over from
 * an existing block when upgrading.
 */
export function demoCta(opts: {
  heading?: string
  body?: string
  buttonLabel?: string
  buttonUrl?: string
  surface?: 'none' | 'soft' | 'dark' | 'accent'
  image?: number
}) {
  return {
    blockType: 'b61Cta',
    eyebrow: 'Admissions',
    headingLevel: 'auto',
    lines: [{ text: opts.heading || 'See it for yourself', emphasize: false }],
    contentBlocks: [{ type: 'body', body: para(opts.body || 'The best way to know if we are the right fit is to visit.') }],
    buttons: [
      { label: opts.buttonLabel || 'Schedule a tour', link: { type: 'url', url: opts.buttonUrl || '/visit' }, variant: 'primary' },
      { label: 'Ask a question', link: { type: 'url', url: '/visit' }, variant: 'light' },
    ],
    ...(opts.image ? { image: opts.image, overlayStrength: 75 } : {}),
    textAlign: 'center',
    position: 'center',
    surface: opts.surface ?? (opts.image ? 'dark' : 'soft'),
    textPanel: 'none',
    eyebrowRule: 'both',
    entrance: 'on',
  } as const
}

/**
 * A B61 Card Grid from the simple card grid's settings (heading, intro,
 * source, limit, columns, tone, cards). Used by the seed and by the upgrade
 * that converts old card grids in place.
 */
export function cardsFrom(o: {
  heading?: string | null
  intro?: string | null
  source?: string | null
  limit?: number | null
  columns?: string | null
  tone?: string | null
  cards?: { title?: string | null; body?: string | null; image?: number | null; link?: string | null }[]
}) {
  const cols: Record<string, string> = { two: '2', three: '3', four: '4' }
  const tone: Record<string, string> = { light: 'none', muted: 'soft', brand: 'accent', dark: 'dark' }
  const source = o.source ?? 'manual'
  return {
    blockType: 'b61CardGrid',
    headingLevel: 'auto',
    lines: o.heading ? [{ text: o.heading, emphasize: false }] : [],
    ...(o.intro ? { intro: para(o.intro) } : {}),
    source,
    limit: o.limit ?? 3,
    mediaType: source === 'manual' && !(o.cards ?? []).some((c) => c.image) ? 'none' : 'image',
    cards: (o.cards ?? []).map((c) => ({
      title: c.title ?? '',
      ...(c.body ? { body: para(c.body) } : {}),
      ...(c.image ? { image: c.image } : {}),
      ...(c.link ? { link: { type: 'url', url: c.link }, linkText: 'Learn more' } : {}),
    })),
    arrangement: 'grid',
    columns: cols[o.columns ?? 'three'] ?? '3',
    textAlign: 'left',
    cardStyle: source === 'staff' ? 'plain' : 'bordered',
    cardSurface: 'light',
    surface: tone[o.tone ?? 'light'] ?? 'none',
    entrance: 'on',
  } as const
}
