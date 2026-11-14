import type { Payload } from 'payload'
import { cardsFrom, ensureDemoImages, statsFrom } from './demo'

/*
 * The Element library: one page showing every B61 element, so staff can see
 * what each looks like and open it in the editor to see how it is set up.
 * Rebuilt on start whenever LIBRARY_VERSION changes; edits made to the page
 * by hand survive until the next version bump.
 */
const LIBRARY_VERSION = 1
const MARK = `[b61-library v${LIBRARY_VERSION}]`

const para = (text: string) => ({
  root: {
    type: 'root', format: '', indent: 0, version: 1, direction: 'ltr',
    children: [{ type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0,
      children: [{ type: 'text', text, format: 0, style: '', mode: 'normal', detail: 0, version: 1 }] }],
  },
})

const label = (name: string, note: string) => ({
  blockType: 'b61Prose', eyebrow: 'Element', lines: [{ text: name }], headingLevel: 'h2',
  contentBlocks: [{ type: 'body', body: para(note) }], padTop: 'normal', padBottom: 'tight', surface: 'none',
})

export async function syncElementLibrary(payload: Payload) {
  const found = await payload.find({ collection: 'pages', where: { slug: { equals: 'elements' } }, limit: 1, depth: 0, draft: true })
  const page = found.docs[0]
  if (page?.seoDescription?.includes(MARK)) return
  const settings = await payload.findGlobal({ slug: 'school-settings', depth: 0 })
  const imgs = (await ensureDemoImages(payload, { a: settings.primaryColor || '#1F3A5F', b: settings.secondaryColor || '#C8A24A' })) as number[]
  const pic = (i: number) => imgs[i % imgs.length]
  const go = (l: string) => ({ type: 'url', url: '/' + l })

  const sections: any[] = [
    {
      blockType: 'b61Hero', layoutMode: 'band', surface: 'primary', bandSize: 'compact', eyebrow: 'Banner 61',
      lines: [{ text: 'Element library' }],
      subheadline: 'Every section a page can be built from, each shown once. Open this page in the editor to see how each one is set up.',
    },
    label('Stats Band', 'Figures with one number count up as they arrive.'),
    statsFrom({ heading: 'By the numbers', tone: 'light', stats: [
      { value: '412', label: 'Students' }, { value: '14:1', label: 'Student to teacher ratio' }, { value: '98%', label: 'Go on to college' },
    ] }),
    label('Testimonial', 'A single quote with its attribution.'),
    {
      blockType: 'b61Testimonial', eyebrow: 'From our families', surface: 'soft',
      quote: 'Our kids are known here. Teachers notice the small things, and that has made all the difference.',
      attribution: 'Parent of a 4th and 7th grader',
    },
    label('Gallery', 'A scrolling strip, a grid or a masonry wall of photos, or a single photo or video.'),
    {
      blockType: 'b61Gallery', eyebrow: 'Campus life', lines: [{ text: 'A day on campus' }], media: 'gallery', galleryLayout: 'strip',
      images: [0, 1, 2, 3, 0, 2].map((i, n) => ({ image: pic(i), caption: ['Chapel', 'Reading corner', 'Science lab', 'The field', 'Arrival', 'Art room'][n] })),
    },
    {
      blockType: 'b61Gallery', lines: [{ text: 'The same photos as a grid' }], headingLevel: 'h3', media: 'gallery', galleryLayout: 'grid', columns: '3',
      imageShape: 'landscape', surface: 'soft', images: [0, 1, 2, 3, 2, 0].map((i) => ({ image: pic(i) })),
    },
    label('Card Grid', 'Hand-written cards, or filled from Programs, Events, News or Staff.'),
    cardsFrom({ heading: 'Programs', source: 'programs', limit: 3, columns: 'three', tone: 'light' }),
    label('Framed Image', 'One photo with a colored frame along its edge.'),
    { blockType: 'b61FramedImage', image: pic(0), imageShape: 'fixed', imageHeight: '460px', frameColor: 'secondary', widthStep: 4 },
    label('Divider', 'A short rule or an ornament between sections.'),
    { blockType: 'b61Divider', alignment: 'center', weight: 'regular', lineColor: 'accent' },
    label('Button Bar', 'Two large half-width links, often at the foot of a page.'),
    { blockType: 'b61ButtonBar', firstLabel: 'Schedule a visit', firstLink: go('visit'), secondLabel: 'Start an application', secondLink: go('admissions'), size: 'large' },
  ]

  const data = { title: 'Element library', slug: 'elements', seoDescription: `Every Banner 61 element on one page. ${MARK}`, sections, _status: 'published' as const }
  if (page) await payload.update({ collection: 'pages', id: page.id, data: data as any })
  else await payload.create({ collection: 'pages', data: data as any })
  payload.logger.info(`[b61] Element library page updated (v${LIBRARY_VERSION})`)
}
