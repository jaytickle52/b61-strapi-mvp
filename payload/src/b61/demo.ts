import { toBody } from './kit/body'
import type { Payload, PayloadRequest } from 'payload'
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'
import type { School } from '../payload-types'
import { DEMO_PHOTOS, photoSetFor } from './demo-photos'

/*
 * Demo content for the B61 Hero: stock photos for each demo school (see
 * demo-photos.ts; generated placeholder art if the files are missing) and one hero per demo page, each
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

const PHOTO_DIR = path.resolve(process.cwd(), 'demo-photos')
const photoFile = (name: string) => path.join(PHOTO_DIR, `${name}.jpg`)
const havePhotos = () => fs.existsSync(photoFile('high-five'))

/** The demo photo a media file holds (`demo-high-five-1.jpg` -> `high-five`), if it is one. */
const photoNameOf = (filename?: string | null) => {
  const m = /^demo-(.+?)(-\d+)?\.jpg$/.exec(filename ?? '')
  if (!m) return null
  if (DEMO_PHOTOS[m[1]]) return m[1]
  return m[2] && DEMO_PHOTOS[m[1] + m[2]] ? m[1] + m[2] : null
}

const photoUpload = (name: string) => {
  const data = fs.readFileSync(photoFile(name))
  return { data, mimetype: 'image/jpeg', name: `demo-${name}.jpg`, size: data.length }
}
const photoData = (name: string) => {
  const p = DEMO_PHOTOS[name]
  return { alt: p.alt, focalX: p.focalX ?? 50, focalY: p.focalY ?? 50 }
}

async function schoolSlug(payload: Payload, school: number, req?: PayloadRequest) {
  const doc = await payload.findByID({ collection: 'schools', id: school, depth: 0, req, overrideAccess: true }).catch(() => null)
  return (doc as any)?.slug as string | undefined
}

/** The school's demo photos already in its Media library, by name. */
async function demoPhotosByName(payload: Payload, school: number, req?: PayloadRequest) {
  const found = await payload.find({
    collection: 'media',
    where: { and: [{ school: { equals: school } }, { filename: { contains: 'demo-' } }] },
    pagination: false,
    depth: 0,
    req,
    overrideAccess: true,
    sort: 'createdAt',
  })
  const byName = new Map<string, number>()
  for (const d of found.docs as any[]) {
    if (String(d.alt ?? '').includes(DEMO_TAG)) continue // old generated placeholder
    const name = photoNameOf(d.filename)
    if (name && !byName.has(name)) byName.set(name, d.id)
  }
  return byName
}

/**
 * The school's demo photos, in its set's order (the first four are the hero,
 * portrait, classroom and banner slots). Uploads any that are missing. Falls
 * back to generated placeholder art when the photo files aren't on disk.
 */
export async function ensureDemoImages(payload: Payload, colors: { a: string; b: string }, school: number, req?: PayloadRequest) {
  if (!havePhotos()) return ensurePlaceholderArt(payload, colors, school, req)
  const set = photoSetFor(await schoolSlug(payload, school, req))
  const byName = await demoPhotosByName(payload, school, req)
  const ids: number[] = []
  for (const name of set.order) {
    let id = byName.get(name)
    if (!id) {
      const doc = await payload.create({ collection: 'media', data: { ...photoData(name), school } as any, file: photoUpload(name), req, overrideAccess: true })
      id = doc.id as number
    }
    ids.push(id)
  }
  return ids
}

/** The old generated placeholders (only used when the photo files are missing). */
async function ensurePlaceholderArt(payload: Payload, colors: { a: string; b: string }, school: number, req?: PayloadRequest) {
  const existing = await payload.find({
    collection: 'media',
    where: { and: [{ alt: { contains: DEMO_TAG } }, { school: { equals: school } }] },
    limit: 10,
    req,
    sort: 'createdAt',
  })
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
      data: { alt: `Placeholder photo ${s.seed} ${DEMO_TAG}`, school, ...(s.focal ?? {}) },
      file: { data, mimetype: 'image/jpeg', name: s.name, size: data.length },
      req,
    })
    ids.push(doc.id as number)
  }
  return ids
}

/**
 * Turns a demo school's four generated placeholders into real photos, in
 * place (same media records, so every page using them shows the photo).
 * Returns true when it did, so the caller can then spread the photos out.
 */
export async function swapPlaceholderPhotos(payload: Payload, school: School) {
  if (!havePhotos()) return false
  const olds = await payload.find({
    collection: 'media',
    where: { and: [{ alt: { contains: DEMO_TAG } }, { school: { equals: school.id } }] },
    pagination: false,
    depth: 0,
    sort: 'createdAt',
    overrideAccess: true,
  })
  if (!olds.totalDocs) return false
  const set = photoSetFor(school.slug)
  for (const [i, doc] of (olds.docs as any[]).entries()) {
    const name = set.order[i % set.order.length]
    await payload.update({ collection: 'media', id: doc.id, data: photoData(name) as any, file: photoUpload(name), overrideAccess: true })
  }
  payload.logger.info(`[b61] Swapped ${olds.totalDocs} placeholder photos for real photos at ${school.name}`)
  return true
}

const PHOTO_KEYS = new Set(['image', 'badge', 'photo'])

/**
 * Spreads a school's demo photos across its content: on each page (and the
 * header's menu card) a photo slot that repeats a photo already on that page
 * gets the next unused photo instead; programs, news and events with no photo
 * get one picked for them. Runs once: right after a demo school is seeded, or
 * right after its placeholders became real photos.
 */
export async function placeDemoPhotos(payload: Payload, school: School) {
  if (!havePhotos()) return
  const id = school.id as number
  const set = photoSetFor(school.slug)
  const settings = (await payload.find({ collection: 'school-settings', where: { school: { equals: id } }, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
  const pool = await ensureDemoImages(payload, { a: settings?.primaryColor || '#1F3A5F', b: settings?.secondaryColor || '#C8A24A' }, id)
  const slots = new Set(pool.slice(0, 4))
  const byName = await demoPhotosByName(payload, id)
  let turn = 0

  /** Rewrites repeated slot photos in a document's JSON. `used` starts with photos the doc should avoid. */
  const spread = (value: any, used: Set<number>): any => {
    if (Array.isArray(value)) return value.map((v) => spread(v, used))
    if (!value || typeof value !== 'object') return value
    const out: any = {}
    for (const [k, v] of Object.entries(value)) {
      if (PHOTO_KEYS.has(k) && typeof v === 'number' && slots.has(v)) {
        let pick = v
        if (used.has(v)) {
          for (let n = 0; n < pool.length; n++) {
            const c = pool[(turn + n) % pool.length]
            if (!used.has(c)) { pick = c; turn = (turn + n + 1) % pool.length; break }
          }
        }
        used.add(pick)
        out[k] = pick
      } else out[k] = spread(v, used)
    }
    return out
  }

  const save = async (collection: any, doc: any, data: any) => {
    const draft = doc._status === 'draft'
    await payload.update({ collection, id: doc.id, data: { ...data, ...(draft ? {} : { _status: 'published' }) }, draft, depth: 0, overrideAccess: true, context: { b61AllowDelete: true } })
  }

  const pages = (await payload.find({ collection: 'pages', where: { school: { equals: id } }, pagination: false, depth: 0, draft: true, overrideAccess: true })).docs as any[]
  for (const page of pages) {
    turn = 4 + (page.id % Math.max(1, pool.length - 4))
    const sections = spread(page.sections ?? [], new Set())
    if (JSON.stringify(sections) !== JSON.stringify(page.sections ?? [])) await save('pages', page, { sections })
  }

  if (settings) {
    turn = 4
    const menu = spread(settings.menu ?? [], new Set(slots))
    if (JSON.stringify(menu) !== JSON.stringify(settings.menu ?? [])) await save('school-settings', settings, { menu })
  }

  const fill = async (collection: 'programs' | 'news' | 'events', pick: (doc: any, i: number) => string | undefined) => {
    const docs = (await payload.find({ collection, where: { school: { equals: id } }, pagination: false, depth: 0, draft: true, overrideAccess: true, sort: 'createdAt' })).docs as any[]
    for (const [i, doc] of docs.entries()) {
      if (doc.image) continue
      const name = pick(doc, i)
      const photo = name ? byName.get(name) : undefined
      if (photo) await save(collection, doc, { image: photo })
    }
  }
  await fill('programs', (_d, i) => set.programs[i])
  await fill('news', (d) => set.items[d.title])
  await fill('events', (d) => set.items[d.title])
  payload.logger.info(`[b61] Demo photos placed for ${school.name}`)
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
      body: toBody([
        { type: 'body', body: para(opts.mission) },
        { type: 'emphasis', text: 'Every child known, every day.' },
        ...(opts.phone ? [{ type: 'iconrow', icon: 'phone', text: opts.phone, hasLink: true, link: { type: 'url', url: `tel:${opts.phone.replace(/[^0-9+]/g, '')}` } }] : []),
        ...(opts.email ? [{ type: 'iconrow', icon: 'email', text: opts.email, hasLink: true, link: { type: 'url', url: `mailto:${opts.email}` } }] : []),
        ...(opts.address ? [{ type: 'iconrow', icon: 'location', text: opts.address.replace(/\n/g, ', ') }] : []),
      ]),
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
      body: toBody([
        { type: 'body', body: para('Mornings start with chapel and close with friends on the field. In between: real books, hands-on science and teachers who know every student by name.') },
        { type: 'quote', text: 'Our kids come home talking about what they learned, not just what they did.', attribution: 'A current parent' },
      ]),
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
    body: toBody([
      {
        type: 'body',
        body:
          opts.body ??
          para('Tours run Tuesday through Thursday mornings and take about an hour. Bring your questions; bring your kids if you like.'),
      },
      { type: 'emphasis', scale: 'display', text: 'Most families know within the first ten minutes.' },
      ...rows.map((r, i) => (i === 0 ? { ...r, divider: true } : r)),
    ], { emphasisScale: true, dividers: true }),
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
    body: toBody([{ type: 'body', body: para(opts.body || 'The best way to know if we are the right fit is to visit.') }], { quotePhoto: false }),
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

/** A B61 Stats Band from a heading, an old MVP tone and figure/label pairs. */
export function statsFrom(o: { heading?: string | null; tone?: string | null; stats: { value?: string | null; label?: string | null }[]; eyebrow?: string }) {
  const surface: Record<string, string> = { light: 'soft', muted: 'soft', brand: 'accent', dark: 'dark' }
  return {
    blockType: 'b61StatsBand' as const,
    eyebrow: o.eyebrow,
    lines: o.heading ? [{ text: o.heading }] : [],
    stats: o.stats.map((s) => ({ figure: s.value ?? '', label: s.label ?? '' })),
    columns: String(Math.min(Math.max(o.stats.length, 1), 4)),
    surface: surface[o.tone ?? 'light'] ?? 'soft',
    itemStyle: 'divided',
  }
}
