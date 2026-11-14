import { toBody } from './kit/body'
import type { Payload } from 'payload'
import type { School } from '../payload-types'
import { cardsFrom, ensureDemoImages, statsFrom } from './demo'

/*
 * The Element library: one page showing every B61 element, so staff can see
 * what each looks like and open it in the editor to see how it is set up.
 * Rebuilt on start whenever LIBRARY_VERSION changes; edits made to the page
 * by hand survive until the next version bump.
 */
const LIBRARY_VERSION = 2
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
  body: toBody([{ type: 'body', body: para(note) }], { emphasisScale: true, dividers: true }), padTop: 'normal', padBottom: 'tight', surface: 'none',
})

export async function syncElementLibrary(payload: Payload, school: School) {
  const mine = { school: { equals: school.id } }
  const found = await payload.find({ collection: 'pages', where: { and: [mine, { slug: { equals: 'elements' } }] }, limit: 1, depth: 0, draft: true })
  const page = found.docs[0]
  if (page?.seoDescription?.includes(MARK)) return
  const settings = (await payload.find({ collection: 'school-settings', where: mine, limit: 1, depth: 0 })).docs[0]
  const imgs = (await ensureDemoImages(
    payload,
    { a: settings?.primaryColor || '#1F3A5F', b: settings?.secondaryColor || '#C8A24A' },
    school.id as number,
  )) as number[]
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
    label('Accordion', 'Questions and answers, or any list that opens one item at a time.'),
    {
      blockType: 'b61Accordion', eyebrow: 'Admissions', lines: [{ text: 'Common questions' }], itemStyle: 'divided',
      items: [
        { title: 'When can we visit?', subtitle: 'Tours', body: para('Tours run most weekday mornings during the school year. Book a time on the Visit page.') },
        { title: 'Is there tuition assistance?', subtitle: 'Tuition', body: para('Yes. About a third of our families receive need-based aid. Apply when you apply for admission.') },
        { title: 'Do you offer before and after care?', subtitle: 'Daily life', body: para('Care opens at 7:15 and runs until 5:30 for students in every grade.') },
      ],
    },
    label('Tabs', 'Each tab shows its own elements. Here, a Prose and a Split.'),
    {
      blockType: 'b61Tabs', lines: [{ text: 'A path for every stage' }], tabPosition: 'top', surface: 'soft',
      tabs: [
        { label: 'Grammar School', content: [{ blockType: 'b61Prose', headingLevel: 'h3', lines: [{ text: 'Wonder and memory' }], body: toBody([{ type: 'body', body: para('Songs, chants and stories build a store of knowledge and a love of learning.') }], { emphasisScale: true, dividers: true }), padTop: 'none', padBottom: 'none' }] },
        { label: 'Logic School', content: [{ blockType: 'b61Split', headingLevel: 'h3', lines: [{ text: 'Asking why' }], media: 'photo', image: pic(2), body: toBody([{ type: 'body', body: para('Students learn to reason, argue fairly and follow an idea to its source.') }]), padTop: 'none', padBottom: 'none' }] },
      ],
    },
    label('Pillars', 'Feature tabs with a photo for each.'),
    {
      blockType: 'b61Pillars', lines: [{ text: 'What makes us different' }], tabPosition: 'left',
      items: [
        { title: 'Known by name', body: para('Small classes mean every teacher knows every child.'), image: pic(0) },
        { title: 'Great books', body: para('Students read whole books, not excerpts, from the first grade on.'), image: pic(2) },
        { title: 'Faith and reason', body: para('We teach that faith and learning belong together.'), image: pic(3) },
      ],
    },
    label('Carousel', 'Slides of any element. Here, testimonials.'),
    {
      blockType: 'b61Carousel', lines: [{ text: 'What families say' }], perView: '1', controlsPosition: 'top-right',
      slides: [
        { content: [{ blockType: 'b61Testimonial', quote: 'The teachers know our kids better than we expected anyone could.', attribution: 'Parent of a 2nd grader', padTop: 'tight', padBottom: 'tight' }] },
        { content: [{ blockType: 'b61Testimonial', quote: 'My son reads for fun now. That alone was worth it.', attribution: 'Parent of a 6th grader', padTop: 'tight', padBottom: 'tight' }] },
        { content: [{ blockType: 'b61Testimonial', quote: 'It feels like a family, and the academics are serious.', attribution: 'Parent of two', padTop: 'tight', padBottom: 'tight' }] },
      ],
    },
    label('Section', 'A band that holds other elements, here with a side column holding a Rail.'),
    {
      blockType: 'b61Section', columns: 'rail-right', surface: 'soft',
      content: [{ blockType: 'b61Prose', lines: [{ text: 'Admissions at a glance' }], body: toBody([{ type: 'body', body: para('Applications open each fall for the following year. Most families visit, apply, and then spend a morning in class with us.') }], { emphasisScale: true, dividers: true }), padTop: 'none', padBottom: 'none' }],
      side: [{ blockType: 'b61Rail', buttons: [{ label: 'Apply now', variant: 'primary', link: go('admissions'), fullWidth: true }], linksLabel: 'Keep exploring', links: [{ label: 'Tuition', link: go('tuition') }, { label: 'Visit', link: go('visit') }] }],
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
  else await payload.create({ collection: 'pages', data: { ...data, school: school.id } as any })
  payload.logger.info(`[b61] Element library page updated for ${school.name} (v${LIBRARY_VERSION})`)
}
