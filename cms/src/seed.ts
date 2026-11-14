import type { Core } from '@strapi/strapi';

// Fictional demo schools for the MVP. Each Strapi instance seeds one of them,
// chosen by SEED_SCHOOL, so two instances from the same code look like two schools.

type Profile = {
  settings: Record<string, unknown>;
  tagline: string;
  mission: string;
  stats: { value: string; label: string }[];
  programs: { name: string; grades: string; summary: string }[];
  staff: { name: string; role: string; department: string; bio: string }[];
};

const PROFILES: Record<string, Profile> = {
  'cedar-ridge': {
    settings: {
      schoolName: 'Cedar Ridge Christian Academy',
      tagline: 'Rooted in faith. Ready for life.',
      primaryColor: '#1F3A5F',
      secondaryColor: '#C8A24A',
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
  'harbor-oaks': {
    settings: {
      schoolName: 'Harbor Oaks Classical School',
      tagline: 'Truth, goodness and beauty, one day at a time.',
      primaryColor: '#2E5E4E',
      secondaryColor: '#D9774B',
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

const slugify = (s: string) =>
  s.toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const p = (text: string) => [{ type: 'paragraph', children: [{ type: 'text', text }] }];

const daysFromNow = (days: number, hour = 18) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};

export async function seedDemoSchool(strapi: Core.Strapi, key: string) {
  const existing = await strapi.documents('api::page.page').findMany({ limit: 1 });
  if (existing.length > 0) return; // already has content; never overwrite a school's work

  const profile = PROFILES[key] ?? PROFILES['cedar-ridge'];
  const name = profile.settings.schoolName as string;
  strapi.log.info(`[b61] Seeding demo content for ${name}`);

  await strapi.documents('api::school-setting.school-setting').create({
    data: {
      ...profile.settings,
      navigation: [
        { label: 'About', url: '/about' },
        { label: 'Programs', url: '/programs' },
        { label: 'Events', url: '/events' },
        { label: 'News', url: '/news' },
        { label: 'Our team', url: '/staff' },
      ],
      headerButton: { label: 'Schedule a tour', url: '/visit', style: 'primary' },
    } as any,
  });

  for (const [i, prog] of profile.programs.entries()) {
    await strapi.documents('api::program.program').create({
      data: { ...prog, slug: slugify(prog.name), description: p(prog.summary), sortOrder: (i + 1) * 10 } as any,
      status: 'published',
    });
  }

  for (const [i, person] of profile.staff.entries()) {
    await strapi.documents('api::staff-member.staff-member').create({
      data: { ...person, sortOrder: (i + 1) * 10 } as any,
      status: 'published',
    });
  }

  const events = [
    { title: 'Spring Open House', startsAt: daysFromNow(10), location: 'Main campus', audience: 'public',
      summary: 'Tour classrooms, meet teachers and ask every question you have.' },
    { title: 'Coffee with the Head of School', startsAt: daysFromNow(17, 8), location: 'Library', audience: 'public',
      summary: 'A relaxed morning conversation for families considering our school.' },
    { title: '3rd Grade Field Trip: Science Center', startsAt: daysFromNow(6, 9), location: 'Roper Mountain Science Center', audience: 'parents',
      summary: 'Permission slips due Friday. Pack a lunch and wear school shirts.' },
    { title: 'Parent-Teacher Conferences', startsAt: daysFromNow(24, 15), location: 'Classrooms', audience: 'parents',
      summary: 'Sign up for a 15-minute slot with your child\'s teacher.' },
  ];
  for (const ev of events) {
    await strapi.documents('api::event.event').create({
      data: { ...ev, slug: slugify(ev.title), description: p(ev.summary) } as any,
      status: 'published',
    });
  }

  const today = new Date().toISOString().slice(0, 10);
  const news = [
    { title: 'Robotics team heads to state', audience: 'public',
      summary: 'Our middle school robotics team placed second at regionals and advances to the state competition.' },
    { title: 'New uniform supplier this spring', audience: 'parents',
      summary: 'Uniform orders now go through our new supplier. Order by the end of the month for spring delivery.' },
    { title: 'Admissions open for next year', audience: 'public',
      summary: 'Applications for next school year are open. Schedule a tour to get started.' },
  ];
  for (const post of news) {
    await strapi.documents('api::news-post.news-post').create({
      data: { ...post, slug: slugify(post.title), date: today, body: p(post.summary) } as any,
      status: 'published',
    });
  }

  const pages = [
    {
      title: 'Home', slug: 'home',
      seoDescription: `${name}: ${profile.tagline}`,
      sections: [
        { __component: 'sections.hero', eyebrow: 'Now enrolling', heading: profile.tagline,
          subheading: profile.mission, layout: 'image-right', tone: 'brand',
          buttons: [ { label: 'Schedule a tour', url: '/visit', style: 'primary' }, { label: 'Our programs', url: '/programs', style: 'secondary' } ] },
        { __component: 'sections.stats-band', heading: `${name} at a glance`, tone: 'light', stats: profile.stats },
        { __component: 'sections.card-grid', heading: 'Programs', intro: 'A path for every stage of your child\'s growth.',
          source: 'programs', limit: 3, columns: 'three', tone: 'muted' },
        { __component: 'sections.card-grid', heading: 'Upcoming events', source: 'upcoming-events', limit: 3, columns: 'three', tone: 'light' },
        { __component: 'sections.cta-band', heading: 'See it for yourself', body: 'The best way to know if we are the right fit is to visit.',
          tone: 'dark', button: { label: 'Schedule a tour', url: '/visit', style: 'primary' } },
      ],
    },
    {
      title: 'About', slug: 'about',
      seoDescription: `About ${name}`,
      sections: [
        { __component: 'sections.hero', heading: 'About us', subheading: profile.mission, layout: 'centered', tone: 'muted', buttons: [] },
        { __component: 'sections.split', heading: 'Our mission', body: p(profile.mission), imagePosition: 'right', tone: 'light' },
        { __component: 'sections.card-grid', heading: 'Meet our leaders', source: 'staff', limit: 4, columns: 'four', tone: 'muted' },
      ],
    },
    {
      title: 'Visit', slug: 'visit',
      seoDescription: `Schedule a tour of ${name}`,
      sections: [
        { __component: 'sections.hero', heading: 'Come visit', subheading: 'Tours run Tuesday through Thursday mornings. We would love to meet your family.', layout: 'centered', tone: 'brand', buttons: [] },
        { __component: 'sections.prose', heading: 'How to schedule', body: p(`Call ${profile.settings.phone} or email ${profile.settings.email} and our admissions team will find a time that works for you.`) },
        { __component: 'sections.card-grid', heading: 'Upcoming events for families', source: 'upcoming-events', limit: 3, columns: 'three', tone: 'muted' },
      ],
    },
  ];
  for (const page of pages) {
    await strapi.documents('api::page.page').create({ data: page as any, status: 'published' });
  }

  strapi.log.info(`[b61] Demo content ready for ${name}`);
}
