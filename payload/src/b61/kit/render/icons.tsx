/*
 * The built-in B61 icon set (option values in kit/groups.ts ICON_OPTIONS).
 * Solid 24px glyphs that fill with currentColor, so they follow the band's
 * colour like the plugin's chosen icons. "dot" renders nothing: the stylesheet
 * draws the neutral dot itself (.b61-iconlist__mark--dot).
 */
const P: Record<string, string> = {
  question: 'M11.07 12.85c.77-1.39 2.25-2.21 3.11-3.44.91-1.29.4-3.7-2.18-3.7-1.69 0-2.52 1.28-2.87 2.34L6.54 6.96C7.25 4.83 9.18 3 11.99 3c2.35 0 3.96 1.07 4.78 2.41.7 1.15 1.11 3.3.03 4.9-1.2 1.77-2.35 2.31-2.97 3.45-.25.46-.35.76-.35 2.24h-2.89c-.01-.78-.13-2.05.48-3.15zM14 20c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z',
  check: 'M9.5 16.2 5.3 12l-1.4 1.4 5.6 5.6L20.1 8.4 18.7 7z',
  email: 'M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 7.2L4 7.4V17h16V7.4z M4.6 7h14.8L12 11.4z',
  phone: 'M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z',
  location: 'M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z',
  calendar: 'M7 2h2v2h6V2h2v2h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3zm-2 7v10h14V9z',
  clock: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 10.4 3.6 2.1-1 1.7L11 13V6h2z',
  link: 'M10.6 13.4a1 1 0 0 1 0-1.4l3.4-3.4a3 3 0 1 1 4.2 4.2l-2 2-1.4-1.4 2-2a1 1 0 1 0-1.4-1.4L12 13.4a1 1 0 0 1-1.4 0zM13.4 10.6a1 1 0 0 1 0 1.4L10 15.4a3 3 0 1 1-4.2-4.2l2-2 1.4 1.4-2 2a1 1 0 1 0 1.4 1.4l3.4-3.4a1 1 0 0 1 1.4 0z',
  star: 'M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z',
  heart: 'M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.4.7-1.2 2.2-2.4 4.3-2.4 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z',
  book: 'M4 4.5A2.5 2.5 0 0 1 6.5 2H20v16H6.5a.5.5 0 0 0 0 1H20v3H6.5A2.5 2.5 0 0 1 4 19.5z',
  people: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm7.5 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM1 20c0-3.3 3.6-6 8-6s8 2.7 8 6v1H1zm16.5-5.9c3 .4 5.5 2.4 5.5 4.9v2h-4v-1c0-2.3-.6-4.3-1.5-5.9z',
  cross: 'M10.5 2h3v6h6v3h-6v11h-3V11h-6V8h6z',
  school: 'M12 3 1 9l11 6 9-4.9V17h2V9zM5 13.2V17c0 1.7 3.1 3 7 3s7-1.3 7-3v-3.8l-7 3.8z',
}

/**
 * An icon: a built-in glyph by name, or the school's own ("custom") from Photos
 * and videos. A custom icon is drawn inside the same 24px svg, so every place
 * that sizes and colours the built-in icons sizes it too. By default it is a
 * mask over the text colour (its shape, our colour), like the built-in set;
 * Keep its colours shows the file as it is.
 */
export function B61Icon({ name, image, keepColours }: { name?: string | null; image?: unknown; keepColours?: boolean | null }) {
  if (name === 'custom') {
    const media = image && typeof image === 'object' ? (image as { id?: string | number; url?: string | null }) : null
    if (!media?.url) return null
    if (keepColours)
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="b61-icon-own">
          <image href={media.url} x="0" y="0" width="24" height="24" preserveAspectRatio="xMidYMid meet" />
        </svg>
      )
    // One mask per photo: the same icon used twice on a page shares it.
    const id = `b61-icon-${media.id ?? encodeURIComponent(media.url)}`
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="b61-icon-own">
        <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24" style={{ maskType: 'alpha' }}>
          <image href={media.url} x="0" y="0" width="24" height="24" preserveAspectRatio="xMidYMid meet" />
        </mask>
        <rect x="0" y="0" width="24" height="24" mask={`url(#${id})`} style={{ fill: 'currentColor', stroke: 'none' }} />
      </svg>
    )
  }
  const d = name ? P[name] : undefined
  if (!d) return null
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={d} />
    </svg>
  )
}
