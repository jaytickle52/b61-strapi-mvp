import type { CSSProperties, ReactNode } from 'react'
import { asMedia, focusOf, imgProps, type MediaRef } from '../../lib/media'
import ScrollStoryInit from './ScrollStoryInit'

/*
 * SCROLL STORY: a shared arrangement for elements made of titled items with a
 * photo and a few words (Pillars first; Tabs or Accordion can use it later).
 *
 * Wide screens: the item titles stay in view on one side as a list with a
 * progress line; each item scrolls past on the other side as a photo with its
 * words on a card, and its title lights up as it reaches the middle of the
 * screen. Phones: the items stack, each with its own title.
 *
 * Everything is in the page and readable without a script (no hidden panels);
 * the titles are plain links to their items. The script only marks the item
 * in view (ScrollStoryInit).
 */
export type StoryItem = { key: string | number; title: string; body?: ReactNode; image?: MediaRef }

export default function ScrollStory({
  id,
  items,
  label,
  side = 'left',
  titleAs: Title = 'h3',
  aside,
}: {
  id: string
  items: StoryItem[]
  /** Names the list of titles for screen readers ("Our pillars"). */
  label: string
  side?: 'left' | 'right'
  titleAs?: 'h2' | 'h3' | 'h4'
  /** Shown under the titles (buttons). */
  aside?: ReactNode
}) {
  if (!items.length) return null
  return (
    <div className={`b61-story b61-story--nav-${side}`} data-b61-story>
      <div className="b61-story__aside">
        <nav className="b61-story__nav" aria-label={label}>
          <ol className="b61-story__list">
            {items.map((it, i) => (
              <li key={it.key} className={`b61-story__navitem${i === 0 ? ' is-active' : ''}`}>
                <a className="b61-story__link" href={`#${id}-step-${i + 1}`}>
                  <span className="b61-story__dot" aria-hidden="true" />
                  {it.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        {aside}
      </div>
      <div className="b61-story__steps">
        {items.map((it, i) => {
          const img = imgProps(it.image, '(max-width: 1023px) 92vw, 760px')
          const f = focusOf(it.image)
          return (
            <article key={it.key} id={`${id}-step-${i + 1}`} className={`b61-story__step${img ? '' : ' b61-story__step--text'}`} data-b61-story-step={i}>
              {img && (
                <figure className="b61-story__media" style={f ? ({ '--b61-photo-focus': f } as CSSProperties) : undefined}>
                  <img {...img} alt={asMedia(it.image)?.alt ?? ''} loading="lazy" />
                </figure>
              )}
              <div className="b61-story__card">
                <Title className="b61-story__title">{it.title}</Title>
                {it.body && <div className="b61-story__body breakdance-rich-text-styles">{it.body}</div>}
              </div>
            </article>
          )
        })}
      </div>
      <ScrollStoryInit />
    </div>
  )
}
