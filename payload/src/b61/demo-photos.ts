/*
 * Real (stock) photos for the demo schools, Nov 2026. The files live in
 * payload/demo-photos/ (2000px, ~250 KB each) and are uploaded to a demo
 * school's Media library as `demo-<name>.jpg` the first time they are needed.
 *
 * Each school gets its own set so the three demos don't look alike. The first
 * four of each set fill the four photo slots the demo pages were built around
 * (wide hero, portrait, classroom, closing banner); the rest are used where a
 * page would otherwise repeat a photo, and are in the library to pick from.
 */

export type DemoPhoto = { alt: string; focalX?: number; focalY?: number }

export const DEMO_PHOTOS: Record<string, DemoPhoto> = {
  'teacher-small-group': { alt: 'A teacher talks with a small group of students around a table', focalX: 40, focalY: 35 },
  'whiteboard-boy': { alt: 'A boy in a school tie points at the interactive whiteboard while his teacher smiles', focalX: 55, focalY: 35 },
  'service-cleanup': { alt: 'Students in gloves picking up litter together on a service day', focalY: 40 },
  'building-blocks': { alt: 'Three young children building with colorful blocks', focalY: 40 },
  'coloring-table': { alt: 'Young children coloring together at a white table', focalX: 40, focalY: 40 },
  'brush-painting': { alt: 'Two children painting with brushes and brown paint on white paper', focalY: 35 },
  'floor-drawing': { alt: 'Children drawing on a large sheet of paper on the floor with a teacher', focalY: 40 },
  'hallway-artwork': { alt: 'Children with backpacks looking at artwork on a school hallway wall', focalX: 60, focalY: 40 },
  'uniform-class-looking-up': { alt: 'Children in school uniforms sitting on the classroom floor, looking up at their teacher', focalY: 40 },
  'science-goggles': { alt: 'Two students in safety goggles doing a science experiment with test tubes', focalX: 55, focalY: 40 },
  'playground-recess': { alt: 'Young students in uniforms playing on the playground with a teacher', focalY: 45 },
  'pledge': { alt: 'Children standing with hands on hearts in their classroom', focalX: 55, focalY: 35 },
  'circle-time': { alt: 'Young children sitting on the floor clapping during circle time', focalY: 40 },
  'uniform-line-up': { alt: 'A smiling class of students in school uniforms standing in front of the whiteboard', focalY: 40 },
  'teacher-at-board': { alt: 'A teacher at the whiteboard in front of a bright, colorful classroom', focalX: 60, focalY: 35 },
  'girls-soccer-sunset': { alt: 'Girls soccer players chasing the ball across a field at sunset', focalX: 60, focalY: 50 },
  'cactus-mural': { alt: 'A girl painting a cactus mural on a bright classroom wall', focalX: 55, focalY: 40 },
  'open-bible': { alt: 'A hand turning the page of an open Bible', focalX: 65, focalY: 50 },
  'basketball-gym': { alt: 'A basketball resting on the gym floor', focalX: 55, focalY: 60 },
  'smiling-uniform-kids': { alt: 'Smiling young students in white school polo shirts', focalX: 65, focalY: 35 },
  'backpack-friends': { alt: 'Two smiling girls with backpacks walking down the school hallway', focalX: 55, focalY: 35 },
  'schoolyard-chat': { alt: 'Students with backpacks and books chatting outside after class', focalX: 50, focalY: 40 },
  'tablet-teamwork': { alt: 'Middle school students working together around a table with tablets', focalY: 40 },
  'high-five': { alt: 'A teacher giving a student a high five in a sunny classroom', focalX: 60, focalY: 35 },
  'teen-study-group': { alt: 'Teenage students studying together and laughing at their desks', focalY: 35 },
  'teens-writing': { alt: 'Two high school students writing at their desks, one smiling at the camera', focalX: 45, focalY: 35 },
  'girls-soccer-field': { alt: 'Teenage girls playing soccer on a turf field', focalX: 55, focalY: 45 },
  'teens-portrait-class': { alt: 'High school students working in a modern classroom', focalY: 45 },
  'round-table-study': { alt: 'Teenagers studying together at a round table while teachers look on', focalY: 40 },
  'two-girls-writing': { alt: 'Two young girls writing at a classroom table', focalX: 45, focalY: 40 },
  'drawing-together': { alt: 'Three young girls drawing with colored pencils together', focalX: 45, focalY: 40 },
}

export type SchoolPhotoSet = {
  /** Slots first (hero, portrait, classroom, banner), then the rest. */
  order: string[]
  /** One per program, in program order (youngest first). */
  programs: string[]
  /** Demo news and event titles to the photo shown on their cards. */
  items: Record<string, string>
}

export const SCHOOL_PHOTOS: Record<string, SchoolPhotoSet> = {
  'cedar-ridge': {
    order: [
      'high-five', 'teens-portrait-class', 'science-goggles', 'girls-soccer-field',
      'whiteboard-boy', 'backpack-friends', 'building-blocks', 'round-table-study', 'basketball-gym', 'service-cleanup',
    ],
    programs: ['building-blocks', 'whiteboard-boy', 'round-table-study'],
    items: {
      'Robotics team heads to state': 'science-goggles',
      'New uniform supplier this spring': 'backpack-friends',
      'Admissions open for next year': 'high-five',
      'Spring Open House': 'backpack-friends',
      'Coffee with the Head of School': 'round-table-study',
      '3rd Grade Field Trip: Science Center': 'science-goggles',
      'Parent-Teacher Conferences': 'whiteboard-boy',
    },
  },
  'harbor-oaks': {
    order: [
      'schoolyard-chat', 'brush-painting', 'teacher-small-group', 'open-bible',
      'uniform-class-looking-up', 'pledge', 'teen-study-group', 'teens-writing', 'girls-soccer-sunset', 'teacher-at-board', 'uniform-line-up',
    ],
    programs: ['uniform-class-looking-up', 'teen-study-group', 'teens-writing'],
    items: {
      'Robotics team heads to state': 'teen-study-group',
      'New uniform supplier this spring': 'uniform-line-up',
      'Admissions open for next year': 'schoolyard-chat',
      'Spring Open House': 'uniform-line-up',
      'Coffee with the Head of School': 'teacher-small-group',
      '3rd Grade Field Trip: Science Center': 'teacher-at-board',
      'Parent-Teacher Conferences': 'teens-writing',
    },
  },
  schoolbox: {
    order: [
      'smiling-uniform-kids', 'cactus-mural', 'two-girls-writing', 'playground-recess',
      'circle-time', 'coloring-table', 'floor-drawing', 'hallway-artwork', 'drawing-together', 'tablet-teamwork',
    ],
    programs: ['circle-time', 'hallway-artwork', 'tablet-teamwork'],
    items: {
      'Robotics team heads to state': 'tablet-teamwork',
      'New uniform supplier this spring': 'smiling-uniform-kids',
      'Admissions open for next year': 'hallway-artwork',
      'Spring Open House': 'hallway-artwork',
      'Coffee with the Head of School': 'coloring-table',
      '3rd Grade Field Trip: Science Center': 'floor-drawing',
      'Parent-Teacher Conferences': 'two-girls-writing',
    },
  },
}

/** Any other school (a new demo profile) borrows Cedar Ridge's set. */
export const photoSetFor = (slug?: string | null) => SCHOOL_PHOTOS[slug ?? ''] ?? SCHOOL_PHOTOS['cedar-ridge']
