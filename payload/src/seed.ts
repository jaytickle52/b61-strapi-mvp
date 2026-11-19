import { plainToRich } from './b61/kit/plain'
import type { Payload } from 'payload'
import type { School } from './payload-types'
import { syncElementLibrary } from './b61/library'
import { ensureStandardForms } from './forms/standard'
import { ensureFeatureDemo } from './b61/features-demo'
import { ensurePatternsDemo, ensurePatternsDemo2 } from './b61/patterns-demo'
import { ensureSchoolboxDemo, SCHOOLBOX_COPY, schoolboxPhotos } from './b61/schoolbox-demo'
import { schoolboxHome } from './templates/schoolbox'
import { demoChrome } from './b61/chrome/demo'
import { cardsFrom, demoProgramSections, demoCta, demoHeroes, demoProse, demoSplits, ensureDemoImages, placeDemoPhotos, statsFrom, swapPlaceholderPhotos } from './b61/demo'

// Fictional demo schools, same content as the Strapi build so the two editors
// can be compared like for like. SEED_SCHOOLS lists which ones to create.

type Profile = {
  settings: Record<string, unknown>;
  tagline: string;
  mission: string;
  stats: { value: string; label: string }[];
  programs: { name: string; grades: string; summary: string }[];
  staff: { name: string; role: string; department: string; bio: string }[];
};

export const PROFILES: Record<string, Profile> = {
  'cedar-ridge': {
    settings: {
      schoolName: 'Cedar Ridge Christian Academy',
      tagline: 'Rooted in faith. Ready for life.',
      primaryColor: '#1F3A5F',
      secondaryColor: '#C8A24A',
      accentColor: '#B23A2E',
      paperColor: '#F7F3EC',
      uiFont: 'Montserrat',
      headingFont: 'Fraunces',
      bodyFont: 'Inter',
      phone: '(864) 555-0142',
      email: 'office@cedarridge.example',
      address: '410 Cedar Ridge Road\nGreenville, SC 29601',
    },
    tagline: 'Rooted in faith. Ready for life.',
    mission:
      'Cedar Ridge partners with families to raise young people who think clearly, love deeply and serve faithfully. Small classes, caring teachers and a Christ-centered culture shape every day.',
    stats: [
      { value: '12:1', label: 'Student to teacher ratio' },
      { value: 'K–12', label: 'Grades served' },
      { value: '1987', label: 'Serving families since' },
      { value: '96%', label: 'Families who would recommend us' },
    ],
    programs: [
      { name: 'Lower School', grades: 'K–5', summary: 'Phonics, wonder and strong foundations in a warm, structured classroom.' },
      { name: 'Middle School', grades: '6–8', summary: 'Growing independence, deeper friendships and a faith that asks real questions.' },
      { name: 'Upper School', grades: '9–12', summary: 'College-prep academics, leadership and service that prepare students for what is next.' },
    ],
    staff: [
      { name: 'Dr. Rebecca Hale', role: 'Head of School', department: 'Administration', bio: 'Rebecca has served in Christian education for twenty years.' },
      { name: 'Marcus Lee', role: 'Director of Admissions', department: 'Admissions', bio: 'Marcus helps families find their place at Cedar Ridge.' },
      { name: 'Anna Brooks', role: 'Lower School Principal', department: 'Lower School', bio: 'Anna loves watching young readers discover books.' },
      { name: 'James Ortiz', role: 'Athletic Director', department: 'Athletics', bio: 'James coaches varsity soccer and leads our athletics program.' },
    ],
  },
  // The Schoolbox demo (src/b61/schoolbox-demo.ts adds its theme pages).
  schoolbox: {
    settings: {
      schoolName: 'Hourglass Christian School',
      tagline: 'Rooted in faith. Ready to lead.',
      primaryColor: '#1E2D4A',
      secondaryColor: '#E58E5A',
      accentColor: '#A3283A',
      paperColor: '#F6F2EC',
      uiFont: 'Nunito Sans',
      headingFont: 'Nunito',
      bodyFont: 'Nunito Sans',
      style: { theme: 'warm' },
      phone: '(864) 555-0161',
      email: 'hello@hourglass.example',
      address: '61 Banner Lane\nGreenville, SC 29607',
    },
    tagline: 'Rooted in faith. Ready to lead.',
    mission:
      'Hourglass Christian School is a K-12 Christian school in Greenville, SC, where students grow in faith, learn to think well and discover the gifts God has given them.',
    stats: [
      { value: '14:1', label: 'Student to teacher ratio' },
      { value: 'K–12', label: 'Grades served' },
      { value: '1994', label: 'Serving families since' },
    ],
    programs: [
      { name: 'Elementary', grades: 'K–5', summary: 'Strong readers, curious thinkers and a love for learning.' },
      { name: 'Middle School', grades: '6–8', summary: 'Growing independence with teachers who walk alongside.' },
      { name: 'High School', grades: '9–12', summary: 'College-prep academics, leadership and service.' },
    ],
    staff: [
      { name: 'Dr. Laura Bennett', role: 'Head of School', department: 'Administration', bio: 'Laura has led Christian schools for fifteen years.' },
      { name: 'David Park', role: 'Director of Admissions', department: 'Admissions', bio: 'David gives every tour himself.' },
    ],
  },
  'harbor-oaks': {
    settings: {
      schoolName: 'Harbor Oaks Classical School',
      tagline: 'Truth, goodness and beauty, one day at a time.',
      primaryColor: '#2E5E4E',
      secondaryColor: '#D9774B',
      accentColor: '#8C2F39',
      paperColor: '#F5F1E8',
      uiFont: 'Lato',
      headingFont: 'Playfair Display',
      bodyFont: 'Source Sans 3',
      phone: '(843) 555-0187',
      email: 'hello@harboroaks.example',
      address: '22 Live Oak Lane\nCharleston, SC 29401',
    },
    tagline: 'Truth, goodness and beauty, one day at a time.',
    mission:
      'Harbor Oaks offers a classical Christian education that cultivates wisdom and virtue. Students read great books, learn to reason well and speak with grace.',
    stats: [
      { value: '15', label: 'Average class size' },
      { value: 'PK–8', label: 'Grades served' },
      { value: '2009', label: 'Founded' },
    ],
    programs: [
      { name: 'Grammar School', grades: 'PK–5', summary: 'Songs, chants and stories that build a love of learning.' },
      { name: 'Logic School', grades: '6–8', summary: 'Reasoning, debate and the great conversation of ideas.' },
    ],
    staff: [
      { name: 'Thomas Reed', role: 'Headmaster', department: 'Administration', bio: 'Thomas taught Latin for a decade before leading Harbor Oaks.' },
      { name: 'Grace Kim', role: 'Admissions Coordinator', department: 'Admissions', bio: 'Grace gives every tour personally.' },
    ],
  },
};

/** A rich text value holding one paragraph, in Payload's Lexical format. */
const p = (text: string) => ({
  root: {
    type: 'root', format: '' as const, indent: 0, version: 1, direction: 'ltr' as const,
    children: [{
      type: 'paragraph', format: '' as const, indent: 0, version: 1, direction: 'ltr' as const, textFormat: 0, textStyle: '',
      children: [{ type: 'text', text, format: 0, style: '', mode: 'normal', detail: 0, version: 1 }],
    }],
  },
})

const slugify = (s: string) =>
  s.toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

/** A date `days` from now at `hour`:00 in the school's own time zone (not the server's). */
const daysFromNow = (days: number, hour = 18) => {
  const tz = process.env.SCHOOL_TIMEZONE || 'America/New_York'
  const target = new Date(Date.now() + days * 86400000)
  const ymd = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(target)
  const guess = new Date(`${ymd}T${String(hour).padStart(2, '0')}:00:00Z`)
  const shownHour = Number(new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', hourCycle: 'h23' }).format(guess))
  let diff = shownHour - hour
  if (diff > 12) diff -= 24
  if (diff < -12) diff += 24
  return new Date(guess.getTime() - diff * 3600000).toISOString()
}

/** Creates the demo school (if missing) and its content (if it has none). Returns the school. */
export async function seedDemoSchool(payload: Payload, key: string): Promise<School | null> {
  const profile = PROFILES[key]
  if (!profile) {
    payload.logger.warn(`[b61] No demo profile called "${key}"`)
    return null
  }
  const name = profile.settings.schoolName as string
  const found = await payload.find({ collection: 'schools', where: { slug: { equals: key } }, limit: 1, depth: 0 })
  const school: School = found.docs[0] ?? (await payload.create({ collection: 'schools', data: { name, slug: key }, context: { b61SkipStarter: true } }))

  const existing = await payload.find({ collection: 'pages', where: { school: { equals: school.id } }, limit: 1, draft: true })
  if (existing.totalDocs > 0) return school // already has content; never overwrite a school's work

  // A demo school with no pages never finished seeding (a build stopped part
  // way). Clear what that attempt left so this run starts clean.
  for (const collection of ['staff', 'events', 'news', 'school-settings', 'media'] as const) {
    await payload.delete({ collection, where: { school: { equals: school.id } }, context: { b61AllowDelete: true } })
  }

  payload.logger.info(`[b61] Seeding demo content for ${name}`)
  const published = { _status: 'published' as const }
  const create = (collection: any, data: any) => payload.create({ collection, data: { ...data, school: school.id, ...published } })
  const programs = profile.programs.map((p) => ({ name: p.name, slug: slugify(p.name) }))

  const settings = await create('school-settings', {
    ...(profile.settings as any),
    ...demoChrome({ name, programs }),
  })

  for (const person of profile.staff) {
    await create('staff', { ...person, bio: plainToRich(person.bio) })
  }

  const events = [
    { title: 'Spring Open House', startsAt: daysFromNow(10), location: 'Main campus', audience: 'public',
      summary: 'Tour classrooms, meet teachers and ask every question you have.' },
    { title: 'Coffee with the Head of School', startsAt: daysFromNow(17, 8), location: 'Library', audience: 'public',
      summary: 'A relaxed morning conversation for families considering our school.' },
    { title: '3rd Grade Field Trip: Science Center', startsAt: daysFromNow(6, 9), location: 'Roper Mountain Science Center', audience: 'parents',
      summary: 'Permission slips due Friday. Pack a lunch and wear school shirts.' },
    { title: 'Parent-Teacher Conferences', startsAt: daysFromNow(24, 15), location: 'Classrooms', audience: 'parents',
      summary: "Sign up for a 15-minute slot with your child's teacher." },
  ]
  for (const ev of events) {
    await create('events', { ...ev, slug: slugify(ev.title), generateSlug: false, description: p(ev.summary) })
  }

  const today = new Date().toISOString()
  const news = [
    { title: 'Robotics team heads to state', audience: 'public',
      summary: 'Our middle school robotics team placed second at regionals and advances to the state competition.' },
    { title: 'New uniform supplier this spring', audience: 'parents',
      summary: 'Uniform orders now go through our new supplier. Order by the end of the month for spring delivery.' },
    { title: 'Admissions open for next year', audience: 'public',
      summary: 'Applications for next school year are open. Schedule a tour to get started.' },
  ]
  for (const post of news) {
    await create('news', { ...post, slug: slugify(post.title), generateSlug: false, date: today, body: p(post.summary) })
  }

  const imgs = await ensureDemoImages(
    payload,
    { a: (profile.settings.primaryColor as string) ?? '#1F3A5F', b: (profile.settings.secondaryColor as string) ?? '#C8A24A' },
    school.id as number,
  )
  await payload.update({
    collection: 'school-settings',
    id: settings.id,
    data: { ...demoChrome({ name, programs, img: imgs[0] as number }), ...published } as any,
  })
  const heroes = demoHeroes({ tagline: profile.tagline, mission: profile.mission, phone: profile.settings.phone as string, imgs })
  const splits = demoSplits({
    name,
    mission: profile.mission,
    phone: profile.settings.phone as string,
    email: profile.settings.email as string,
    address: profile.settings.address as string,
    imgs,
  })

  const pages = [
    {
      title: 'Home', slug: 'home',
      meta: { description: `${name}: ${profile.tagline}` },
      sections: key === 'schoolbox' ? schoolboxHome('warm', SCHOOLBOX_COPY, schoolboxPhotos(imgs as number[])) : [
        heroes.home,
        statsFrom({ heading: `${name} at a glance`, tone: 'light', stats: profile.stats }),
        splits.home,
        cardsFrom({ heading: 'Programs', intro: "A path for every stage of your child's growth.",
          source: 'programs', limit: 3, columns: 'three', tone: 'muted' }),
        cardsFrom({ heading: 'Upcoming events', source: 'upcoming-events', limit: 3, columns: 'three', tone: 'light' }),
        demoCta({ image: imgs[3] }),
      ],
    },
    {
      title: 'About', slug: 'about',
      meta: { description: `About ${name}` },
      sections: [
        heroes.about,
        splits.about,
        cardsFrom({ heading: 'Meet our leaders', source: 'staff', limit: 4, columns: 'four', tone: 'muted' }),
      ],
    },
    {
      title: 'Visit', slug: 'visit',
      meta: { description: `Schedule a tour of ${name}` },
      sections: [
        heroes.visit,
        demoProse({ phone: profile.settings.phone as string, email: profile.settings.email as string, address: profile.settings.address as string }),
        cardsFrom({ heading: 'Upcoming events for families', source: 'upcoming-events', limit: 3, columns: 'three', tone: 'muted' }),
      ],
    },
  ]
  // Programs are pages tagged as programs, at /<slug>; "Programs" is an
  // ordinary page listing them (Jay, 19 Nov 2026).
  pages.push(
    ...profile.programs.map((prog, i) => ({
      title: prog.name, slug: slugify(prog.name),
      meta: { description: prog.summary },
      isProgram: true,
      program: { grades: prog.grades, summary: prog.summary, order: (i + 1) * 10 },
      sections: demoProgramSections(prog),
    })) as any[],
    {
      title: 'Programs', slug: 'programs',
      meta: { description: `Programs at ${name}` },
      sections: [cardsFrom({ heading: 'Our programs', intro: "A path for every stage of your child's growth.", source: 'programs', limit: 12, columns: 'three', tone: 'light' })],
    } as any,
  )
  for (const page of pages) await create('pages', { ...page, generateSlug: false })

  payload.logger.info(`[b61] Demo content ready for ${name}`)
  return school
}

/** Creates every demo school in SEED_SCHOOLS (default: both) and keeps each one's Element library current. */
export async function seedDemoSchools(payload: Payload) {
  const keys = (process.env.SEED_SCHOOLS || 'cedar-ridge,harbor-oaks,schoolbox').split(',').map((k) => k.trim()).filter(Boolean)
  for (const key of keys) {
    // Real photos: an older demo school still on generated placeholders gets them swapped (once);
    // a newly seeded one starts with them. Either way they're spread across its pages at the end.
    const before = (await payload.find({ collection: 'schools', where: { slug: { equals: key } }, limit: 1, depth: 0 })).docs[0]
    const swapped = before ? await swapPlaceholderPhotos(payload, before).catch((e) => (payload.logger.error(`[b61] Demo photos: ${e.message}`), false)) : false
    const fresh = !before || (await payload.find({ collection: 'pages', where: { school: { equals: before.id } }, limit: 1, draft: true, depth: 0 })).totalDocs === 0
    const school = await seedDemoSchool(payload, key)
    if (school) await ensureStandardForms(payload, school).catch((e) => payload.logger.error(`[b61] Standard forms: ${e.message}`))
    if (school) await syncElementLibrary(payload, school).catch((e) => payload.logger.error(`[b61] Element library: ${e.message}`))
    if (school) await ensureFeatureDemo(payload, school).catch((e) => payload.logger.error(`[b61] School features demo: ${e.message}`))
    if (school) await ensureProgramsPage(payload, school).catch((e) => payload.logger.error(`[b61] Programs page: ${e.message}`))
    if (school && key !== 'schoolbox') await ensurePatternsDemo(payload, school).catch((e) => payload.logger.error(`[b61] Layout ideas demo: ${e.message}`))
    if (school && key !== 'schoolbox') await ensurePatternsDemo2(payload, school).catch((e) => payload.logger.error(`[b61] More layout ideas demo: ${e.message}`))
    if (school && key === 'schoolbox') await ensureSchoolboxDemo(payload, school).catch((e) => payload.logger.error(`[b61] Schoolbox demo: ${e.message}`))
    if (school && (fresh || swapped)) await placeDemoPhotos(payload, school).catch((e) => payload.logger.error(`[b61] Demo photos: ${e.message}`))
  }
}

/**
 * Demo schools link to /programs (menu, buttons). Since programs became pages
 * (19 Nov 2026) that address is an ordinary page with a programs card grid;
 * this adds it to a demo school that has program pages but no Programs page.
 */
async function ensureProgramsPage(payload: Payload, school: School) {
  const mine = { school: { equals: school.id } }
  const has = await payload.find({ collection: 'pages', where: { and: [mine, { slug: { equals: 'programs' } }] }, limit: 1, depth: 0, draft: true, overrideAccess: true })
  if (has.totalDocs > 0) return
  const progs = await payload.find({ collection: 'pages', where: { and: [mine, { isProgram: { equals: true } }] }, limit: 1, depth: 0, draft: true, overrideAccess: true })
  if (progs.totalDocs === 0) return
  await payload.create({
    collection: 'pages',
    data: {
      school: school.id, title: 'Programs', slug: 'programs', generateSlug: false, _status: 'published',
      meta: { description: `Programs at ${school.name}` },
      sections: [cardsFrom({ heading: 'Our programs', intro: "A path for every stage of your child's growth.", source: 'programs', limit: 12, columns: 'three', tone: 'light' })],
    } as any,
    overrideAccess: true,
  })
  payload.logger.info(`[b61] Programs page added for ${school.name}`)
}
