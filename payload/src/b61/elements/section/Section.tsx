import type { CSSProperties } from 'react'
import { asMedia, focusOf, imgProps } from '../../lib/media'
import Inner from '../../kit/render/Inner'

/* Ported from elements/Section/html.twig and elements/Sidebar (plugin 1.77.1). */
export default function B61Section({ block, path }: { block: any; index?: number; path?: string }) {
  const choice = block.surface ?? 'none'
  const bg = imgProps(block.image, '100vw')
  const surface = bg && ['none', 'accent'].includes(choice) ? 'dark' : choice
  const floor = surface === 'soft' ? 75 : 70
  const shade = Math.max(Number(block.overlayStrength ?? 70), floor)
  const focus = focusOf(block.image)
  const cols = block.columns ?? 'full'
  const rail = cols !== 'full'
  const sticky = rail && Boolean(block.railSticky)
  const mid = rail && !sticky && block.railAlign === 'center'
  const stk = ['rail-first', 'rail-last'].includes(block.railStack) ? block.railStack : ''
  const rStep = rail && block.railWidthStep ? Math.min(Math.max(Math.round(block.railWidthStep), 1), 7) : null
  const rv = block.entrance === 'off' ? 'off' : 'on'
  const pt = block.padTop ?? 'normal'
  const pb = block.padBottom ?? 'normal'
  const pat = asMedia(block.patternImage)
  const wm = asMedia(block.watermarkImage)
  const style: Record<string, string> = {}
  if (block.patternOn && pat?.url) style['--b61-pattern'] = `url('${encodeURI(pat.url)}')`
  const px = block.tileSize ? Math.min(Math.max(Number(block.tileSize), 4), 600) : 0
  if (block.patternOn && px) style['--b61-pattern-size'] = `${px}px ${pat?.url ? 'auto' : `${px}px`}`
  if (block.watermarkOn && wm?.url) style['--b61-watermark'] = `url('${encodeURI(wm.url)}')`
  if (block.watermarkOn && block.watermarkSize) {
    const p = Math.min(Math.max(Number(block.watermarkSize), 5), 100)
    style['--b61-watermark-size'] = `${p}% auto`
    style['--b61-watermark-size-sm'] = `${p}% auto`
  }
  if (block.watermarkOn && block.watermarkStrength > 0) style['--b61-watermark-opacity'] = String(Math.min(Number(block.watermarkStrength), 30) / 100)

  return (
    <div className={`b61-section${block.pullUp ? ' b61-section--pull' : ''}`}>
      <div
        className={[
          'b61-section__region',
          `b61-surface--${surface}`,
          surface !== 'none' && `b61-band--${surface}`,
          bg && 'b61-has-bg b61-on-photo',
          block.patternOn && 'b61-deco-pattern',
          block.watermarkOn && 'b61-deco-watermark',
          `b61-section__region--pt-${pt}`,
          `b61-section__region--pb-${pb}`,
        ]
          .filter(Boolean)
          .join(' ')}
        data-b61-reveal={rv}
        style={Object.keys(style).length ? (style as CSSProperties) : undefined}
      >
        {bg && (
          <div className="b61-bg" aria-hidden="true">
            <img className="b61-bg__media" {...bg} alt="" loading="lazy" decoding="async" style={focus ? ({ '--b61-photo-focus': focus } as CSSProperties) : undefined} />
            {surface !== 'none' && <div className="b61-bg__scrim" style={{ opacity: shade / 100 }} />}
          </div>
        )}
        <div
          className={[
            'b61-section__inner',
            rail && `b61-section__inner--${cols} b61-section__inner--rail-standard`,
            sticky && 'b61-section__inner--rail-sticky',
            mid && 'b61-section__inner--rail-center',
            stk && `b61-section__inner--stack-${stk}`,
          ]
            .filter(Boolean)
            .join(' ')}
          style={rStep ? ({ '--b61-section-aside-w': `var(--b61-rail-${rStep})` } as CSSProperties) : undefined}
        >
          {cols === 'rail-left' && rail && (
            <div className="b61-aside">
              <Inner blocks={block.side} path={path && `${path}.side`} />
            </div>
          )}
          <Inner blocks={block.content} path={path && `${path}.content`} />
          {cols === 'rail-right' && (
            <div className="b61-aside">
              <Inner blocks={block.side} path={path && `${path}.side`} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
