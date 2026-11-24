import type { CSSProperties } from 'react'
import type { Page } from '@/payload-types'
import { asMedia, focusOf, imgProps } from '../../lib/media'
import { resolveHeadingLevel } from '../../kit/groups'
import { Buttons, ContentBlocks, HeadingLines, revealAttr } from '../../kit/render/parts'
import { fromBody } from '../../kit/body'
import { headingText } from '../../kit/heading'
import { anchorAttr } from '../../kit/render/anchor'

export type CtaBlock = Extract<NonNullable<Page['sections']>[number], { blockType: 'b61Cta' }>

/*
 * B61 CTA Band markup, ported from elements/CTA_Band/html.twig (plugin 1.77.1).
 * Same classes and structure, so the plugin's stylesheet styles it unchanged.
 */
export default function B61Cta({ block, index = 0, nested = false }: { block: CtaBlock; index?: number; nested?: boolean }) {
  const ri = revealAttr(block.entrance)
  const rv = block.entrance === 'off' ? 'off' : 'on'
  const Heading = resolveHeadingLevel(block.headingLevel, index)
  const align = block.textAlign === 'left' ? 'left' : 'center'
  const position = block.position === 'left' || block.position === 'center' ? block.position : align
  const pt = block.padTop ?? 'normal'
  const pb = block.padBottom ?? 'normal'
  const title = headingText(block.heading)
  const hasHeading = Boolean(title)
  const headingId = `b61-cta-${block.id ?? index}-heading`
  const Wrap = hasHeading ? 'section' : 'div'

  const bg = imgProps(block.image, '100vw')
  const panel = block.textPanel ?? 'none'
  const panelled = panel !== 'none'
  const bare = Boolean(bg) && !panelled
  // Not chosen: Light wash on its own, None inside a container (shares its colour).
  const choice = block.surface ?? (nested ? 'none' : 'soft')
  // Copy never sits on a bare photo: no surface (or accent) over a photo reads dark.
  const surface = bare && (choice === 'none' || choice === 'accent') ? 'dark' : choice
  // The overlay is what the editor set (default 70). It used to be raised silently
  // to 70-75% when copy sat on the photo; the field's help now asks them to check.
  const set = typeof block.overlayStrength === 'number' ? block.overlayStrength : 70
  const shade = Math.min(Math.max(Math.round(set), 0), 100)
  const focus = focusOf(block.image)

  const besideButtons = align === 'left' && (block as any).buttonsSide === 'beside' && (block.buttons ?? []).length > 0
  const wStep = block.widthStep ? Math.min(Math.max(Math.round(block.widthStep), 1), 7) : null
  const rootClass = [
    'b61-cta',
    `b61-talign-${align}`,
    block.eyebrowRule && block.eyebrowRule !== 'site' && `b61-erule-${block.eyebrowRule}`,
    wStep && 'b61-cta--wstep',
    wStep && (wStep > 3 ? 'b61-cta--wstep-wide' : 'b61-cta--wstep-narrow'),
  ]
    .filter(Boolean)
    .join(' ')
  const rootStyle = wStep ? ({ '--b61-cta-wstep': `var(--b61-box-${wStep})` } as CSSProperties) : undefined

  return (
    <div {...anchorAttr(block)} className={rootClass} style={rootStyle}>
      <Wrap
        className={[
          'b61-cta__region',
          `b61-surface--${surface}`,
          surface !== 'none' && `b61-band--${surface}`,
          bg && 'b61-has-bg',
          bare && 'b61-on-photo',
          `b61-cta__region--pt-${pt}`,
          `b61-cta__region--pb-${pb}`,
        ]
          .filter(Boolean)
          .join(' ')}
        data-b61-reveal={rv}
        {...(hasHeading ? { 'aria-labelledby': headingId } : {})}
      >
        {bg && (
          <div className="b61-bg" aria-hidden="true">
            <img
              className="b61-bg__media"
              {...bg}
              alt=""
              loading="lazy"
              decoding="async"
              style={focus ? ({ '--b61-photo-focus': focus } as CSSProperties) : undefined}
            />
            {surface !== 'none' && <div className="b61-bg__scrim" style={{ opacity: shade / 100 }} />}
          </div>
        )}
        <div
          className={[
            'b61-cta__inner',
            `b61-cta__inner--a${align}`,
            `b61-cta__inner--p${position}`,
            'b61-cta__inner--wstandard',
            panelled && `b61-cta__inner--panel b61-surface--${panel} b61-band--${panel} b61-card`,
            besideButtons && 'b61-cta__inner--beside',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {(() => {
            const words = (
              <>
                {block.eyebrow && (
                  <span className="b61-cta__eyebrow b61-block" {...ri}>
                    {block.eyebrow}
                  </span>
                )}
                <HeadingLines as={Heading} id={headingId} className="b61-cta__heading b61-block" lineClass="b61-cta__heading-line" heading={block.heading} ri={ri} />
                {(block.subheads ?? [])
                  .filter((s) => s?.text)
                  .map((s, i) => (
                    <p key={s.id ?? i} className="b61-cta__subhead b61-block" {...ri}>
                      {s.text}
                    </p>
                  ))}
                <ContentBlocks blocks={fromBody(block.body)} prefix="b61-cta" ri={ri} />
              </>
            )
            const actions = <Buttons buttons={block.buttons as any} ri={ri} />
            return besideButtons ? (
              <>
                <div className="b61-cta__words">{words}</div>
                <div className="b61-cta__side">{actions}</div>
              </>
            ) : (
              <>
                {words}
                {actions}
              </>
            )
          })()}
        </div>
      </Wrap>
    </div>
  )
}
