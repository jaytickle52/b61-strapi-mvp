/* Small line icons for segmented controls. Named, so field configs stay serializable. */
const paths: Record<string, string> = {
  'align-left': 'M3 5h14M3 9h9M3 13h14M3 17h9',
  'align-center': 'M3 5h14M6 9h8M3 13h14M6 17h8',
  'v-top': 'M3 3h14M10 7v10M6 11l4-4 4 4',
  'v-center': 'M3 10h14M10 3v4M10 13v4M7 5l3 2 3-2M7 15l3-2 3 2',
  'v-bottom': 'M3 17h14M10 3v10M6 9l4 4 4-4',
  image: 'M3 4h14v12H3zM3 13l4-4 3 3 2-2 5 5M13 7.5a1 1 0 1 0 0 .01',
  slideshow: 'M5 6h12v10H5zM3 4h12',
  video: 'M3 5h10v10H3zM13 9l4-2v6l-4-2',
  cover: 'M2 4h16v12H2zM2 12l5-4 4 3 3-2 4 3M5 13h6',
  band: 'M2 4h16v12H2zM4 8h5M4 11h4M11 6h5v8h-5z',
}

export function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const d = paths[name]
  if (!d) return null
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  )
}
