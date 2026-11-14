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
