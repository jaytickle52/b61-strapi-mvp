import type { Payload } from 'payload'
import type { School } from '../payload-types'
import { toBody } from './kit/body'
import { ensureDemoImages, statsFrom } from './demo'

/*
 * "Layout ideas": one demo page showing the options added after the Wake
 * Christian review (Nov 2026), arranged like a strong school home page:
 * a hero with changing words and a video button, a stats band pulled up over
 * it, a Split with a corner badge, a dark duotone Section holding staggered
 * cards beside their heading, a carousel that runs off the screen edge, and
 * Side buttons for Cedar Ridge. Demo schools only; created once, never
 * overwritten, so edits made to it by hand stay.
 */
const para = (text: string) => ({
  root: {
    type: 'root', format: '', indent: 0, version: 1, direction: 'ltr',
    children: [{ type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0,
      children: [{ type: 'text', text, format: 0, style: '', mode: 'normal', detail: 0, version: 1 }] }],
  },
})

export async function ensurePatternsDemo(payload: Payload, school: School) {
  const mine = { school: { equals: school.id } }
  const found = await payload.find({ collection: 'pages', where: { and: [mine, { slug: { equals: 'layout-ideas' } }] }, limit: 1, depth: 0, draft: true, overrideAccess: true })
  if (found.totalDocs > 0) return
  const settings = (await payload.find({ collection: 'school-settings', where: mine, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
  const imgs = (await ensureDemoImages(payload, { a: settings?.primaryColor || '#1F3A5F', b: settings?.secondaryColor || '#C8A24A' }, school.id as number)) as number[]
  const pic = (i: number) => imgs[i % imgs.length]
  const go = (l: string) => ({ type: 'url', url: '/' + l })
  const video = 'https://www.youtube.com/watch?v=aqz-KE-bpKQ'

  const sections: any[] = [
    {
      blockType: 'b61Hero', layoutMode: 'cover', backgroundType: 'image', image: pic(0), overlay: 'gradient', height: 'tall',
      eyebrow: `${school.name}`,
      lines: [{ text: 'Excellence in Learning.' }, { text: 'Christ in everything.', emphasize: true }],
      changingWords: 'Learning, Missions, Athletics',
      buttons: [
        { label: 'Request information', variant: 'light', action: 'link', link: go('inquire') },
        { label: 'Watch our story', variant: 'link', action: 'video', video },
      ],
    },
    {
      ...statsFrom({ tone: 'dark', stats: [
        { value: '20', label: 'Colleges our graduates chose' }, { value: '$4.2M', label: 'In scholarships offered' }, { value: '28', label: 'Athletics teams' },
      ] }),
      itemStyle: 'plain', columns: '3', bandWidth: 'right', pullUp: true,
    },
    {
      blockType: 'b61Split', eyebrow: 'The experience', lines: [{ text: 'Shaping the leaders' }, { text: 'of tomorrow', emphasize: true }],
      media: 'photo', image: pic(1), badge: pic(3), imageSide: 'left', overlap: true, textPanel: 'soft',
      body: toBody([{ type: 'body', body: para('We are more than a school: a family rooted in faith and committed to excellence, from the classroom to the field.') }]),
      buttons: [{ label: 'Our beliefs', variant: 'primary', action: 'link', link: go('about') }],
    },
    {
      blockType: 'b61Section', surface: 'dark', image: pic(2), overlayStrength: 85, duotone: true,
      content: [
        {
          blockType: 'b61CardGrid', headBeside: true, stagger: true, hoverReveal: true, altTint: true,
          lines: [{ text: 'What our graduates carry' }], headingLevel: 'h2',
          intro: para('Graduates are sent out to make a difference. We do this by teaching:'),
          source: 'manual', mediaType: 'image', arrangement: 'grid', columns: '2', cardStyle: 'overlay', cardShape: 'landscape', cardOverlay: 'gradient',
          padTop: 'none', padBottom: 'none',
          cards: [
            ['Godliness', 'Knowing and loving God, and living it out.'],
            ['Excellence', 'Doing every task, large or small, as well as it can be done.'],
            ['Integrity', 'Being the same person in every room.'],
            ['Citizenship', 'Serving the city and the people in it.'],
            ['Servanthood', 'Putting others first, as Jesus did.'],
          ].map(([title, body], i) => ({ title, body: para(body), image: pic(i) })),
        },
      ],
    },
    {
      blockType: 'b61CardGrid', headBeside: true, bleed: true, surface: 'soft',
      eyebrow: 'Academics', lines: [{ text: 'Find your place' }],
      intro: para('Christian education is more than knowledge: it is a Biblical worldview in every subject.'),
      source: 'manual', mediaType: 'image', arrangement: 'carousel', columns: '3', peek: 'medium', advance: 'one', controlsPosition: 'bottom-left',
      cardStyle: 'overlay', cardShape: 'portrait', cardOverlay: 'gradient',
      cards: ['Kindergarten', 'Elementary', 'Middle School', 'High School', 'Fine Arts'].map((title, i) => ({
        title, image: pic(i + 1), link: go('programs'), linkText: 'Learn more',
      })),
    },
    {
      blockType: 'b61Testimonial', eyebrow: 'From our families', surface: 'dark',
      quote: 'Choosing this school has been one of the best decisions we have made. Our girls have grown spiritually and academically.',
      attribution: 'Parents of two',
    },
  ]

  await payload.create({
    collection: 'pages',
    data: {
      school: school.id,
      title: 'Layout ideas',
      slug: 'layout-ideas',
      meta: { description: 'Demo: layout options for school home pages.', noindex: true },
      sections,
      _status: 'published',
    } as any,
    overrideAccess: true,
    context: { b61Demo: true },
  })

  // Side buttons on Cedar Ridge only, so the two demo schools can be compared.
  if (school.slug === 'cedar-ridge' && settings && !(settings.quickLinks ?? []).length) {
    await payload.update({
      collection: 'school-settings',
      id: settings.id,
      data: {
        quickLinks: [
          { label: 'Inquire', icon: 'question', link: go('inquire') },
          { label: 'Visit', icon: 'calendar', link: go('schedule-a-tour') },
          { label: 'Apply', icon: 'check', link: go('apply') },
        ],
      } as any,
      overrideAccess: true,
      context: { b61Demo: true },
    })
  }
  payload.logger.info(`[b61] Layout ideas page added for ${school.name}`)
}

/*
 * "More layout ideas": the options added after the Canterbury review (Nov
 * 2026): Pillars as a scroll story, tabs holding sets of cards with a larger
 * middle card, duotone photos, and Logos rows (still and scrolling). Demo
 * schools only; created once, never overwritten.
 */
export async function ensurePatternsDemo2(payload: Payload, school: School) {
  const mine = { school: { equals: school.id } }
  const found = await payload.find({ collection: 'pages', where: { and: [mine, { slug: { equals: 'more-layout-ideas' } }] }, limit: 1, depth: 0, draft: true, overrideAccess: true })
  if (found.totalDocs > 0) return
  const settings = (await payload.find({ collection: 'school-settings', where: mine, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any
  const imgs = (await ensureDemoImages(payload, { a: settings?.primaryColor || '#1F3A5F', b: settings?.secondaryColor || '#C8A24A' }, school.id as number)) as number[]
  const pic = (i: number) => imgs[i % imgs.length]
  const go = (l: string) => ({ type: 'url', url: '/' + l })
  const cardSet = (titles: string[], from: number) => ({
    blockType: 'b61CardGrid', source: 'manual', mediaType: 'image', arrangement: 'grid', columns: '3', featureMiddle: true,
    cardStyle: 'overlay', cardShape: 'portrait', cardOverlay: 'gradient', padTop: 'none', padBottom: 'none',
    cards: titles.map((title, i) => ({ title, image: pic(from + i) })),
  })

  const sections: any[] = [
    {
      blockType: 'b61Pillars', scrollStory: true, lines: [{ text: 'An education that is' }, { text: 'personal', emphasize: true }],
      intro: para('No two students are alike, so no two educations here are the same.'),
      items: [
        ['Broad, rich curriculum', 'A wide range of courses builds the foundation colleges look for and room to find new interests.'],
        ['Challenge and support', 'Rigour that stretches every student, with teachers alongside at every step.'],
        ['Tradition and innovation', 'Classic texts and new tools: clear writing, careful thinking and digital skill.'],
        ['Adults in your corner', 'Advisors, coaches and teachers who know each student by name.'],
      ].map(([title, body], i) => ({ title, body: para(body), image: pic(i) })),
    },
    {
      blockType: 'b61Tabs', lines: [{ text: 'Well-balanced' }, { text: 'well-being', emphasize: true }], tabPosition: 'top', tabAlign: 'center',
      tabs: [
        { label: 'Student life', content: [cardSet(['Healthy connections', 'A vibrant community', 'Try something new'], 0)] },
        { label: 'Athletics', content: [cardSet(['Team first', 'Game day', 'Every level'], 2)] },
        { label: 'Arts', content: [cardSet(['On stage', 'In the studio', 'In the choir'], 4)] },
      ],
    },
    {
      blockType: 'b61CardGrid', duotone: true, lines: [{ text: 'A culture of' }, { text: 'community', emphasize: true }],
      source: 'manual', mediaType: 'image', arrangement: 'grid', columns: '4', cardStyle: 'overlay', cardShape: 'portrait', cardOverlay: 'gradient',
      cards: ['Faith', 'Service', 'Friendship', 'Belonging'].map((title, i) => ({ title, image: pic(i + 1) })),
    },
    {
      blockType: 'b61Gallery', duotone: true, eyebrow: 'Our people', lines: [{ text: 'Faces of the school' }], media: 'gallery', galleryLayout: 'grid', columns: '4',
      images: [0, 1, 2, 3].map((i) => ({ image: pic(i + 2) })),
    },
    {
      blockType: 'b61Logos', eyebrow: 'Where graduates go', lines: [{ text: 'Colleges our seniors chose' }], motion: 'scroll', oneColour: true,
      logos: [0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({ image: pic(i) })),
    },
    {
      blockType: 'b61Logos', eyebrow: 'Accredited by', motion: 'still', oneColour: true, surface: 'soft', logoStep: 3,
      logos: [0, 1, 2].map((i) => ({ image: pic(i + 3), link: go('about') })),
    },
  ]

  await payload.create({
    collection: 'pages',
    data: { school: school.id, title: 'More layout ideas', slug: 'more-layout-ideas', meta: { description: 'Demo: more layout options for school pages.', noindex: true }, sections, _status: 'published' } as any,
    overrideAccess: true,
    context: { b61Demo: true },
  })
  payload.logger.info(`[b61] More layout ideas page added for ${school.name}`)
}
