import type { CSSProperties, ReactNode } from 'react'
import type { Page } from '@/payload-types'
import { resolveHeadingLevel } from '../../kit/groups'
import { Buttons, ContentBlocks, HeadingLines, revealAttr } from '../../kit/render/parts'
import { fromBody } from '../../kit/body'

export type ProseBlock = Extract<NonNullable<Page['sections']>[number], { blockType: 'b61Prose' }>

/*
 * B61 Prose markup, ported from elements/Prose/html.twig (plugin 1.77.1).
 * Same classes and structure, so the plugin's stylesheet styles it unchanged.
 */
export default function B61Prose({ block, index = 0 }: { block: ProseBlock; index?: number }) {
  const ri = revealAttr(block.entrance)
  const rv = block.entrance === 'off' ? 'off' : 'on'
  const Heading = resolveHeadingLevel(block.headingLevel, index)
  const surface = block.surface ?? 'none'
  const align = block.textAlign ?? 'left'
  const position = block.position === 'left' ? 'left' : 'center'
  const pt = block.padTop ?? 'normal'
  const pb = block.padBottom ?? 'normal'
  const beside = block.headPosition === 'beside'
  const headFull = !beside && block.headingWidth === 'full'
  const linkList = block.iconlistStyle === 'links'
  const lines = (block.lines ?? []).filter((l) => l?.text)
  const hasHeading = lines.length > 0
  const headingId = `b61-prose-${block.id ?? index}-heading`
  const Wrap = hasHeading ? 'section' : 'div'

  const mStep = block.measureStep ? Math.min(Math.max(Math.round(block.measureStep), 1), 7) : null
  const bStep = beside && block.columnBalance ? Math.min(Math.max(Math.round(block.columnBalance), 1), 7) : null
  const rootClass = [
    'b61-prose',
    `b61-talign-${align}`,
    block.eyebrowRule && block.eyebrowRule !== 'site' && `b61-erule-${block.eyebrowRule}`,
    block.headingRule && block.headingRule !== 'site' && `b61-prose--hrule-${block.headingRule}`,
    mStep && 'b61-prose--mstep',
    bStep && 'b61-prose--bstep',
  ]
    .filter(Boolean)
    .join(' ')
  const rootStyle = {
    ...(mStep ? { '--b61-prose-mstep': `var(--b61-measure-step-${mStep})` } : {}),
    ...(bStep ? { '--b61-prose-bstep': `var(--b61-balance-${bStep})` } : {}),
  } as CSSProperties

  const head: ReactNode = (
    <>
      {block.eyebrow && (
        <span className="b61-prose__eyebrow b61-block" {...ri}>
          {block.eyebrow}
        </span>
      )}
      <HeadingLines as={Heading} id={headingId} className="b61-prose__heading b61-block" lineClass="b61-prose__heading-line" lines={lines} ri={ri} />
      {(block.subheads ?? [])
        .filter((s) => s?.text)
        .map((s, i) => (
          <p key={s.id ?? i} className="b61-prose__subhead b61-block" {...ri}>
            {s.text}
          </p>
        ))}
    </>
  )
  const main: ReactNode = (
    <>
      <ContentBlocks
        blocks={fromBody(block.body)}
        prefix="b61-prose"
        ri={ri}
        emphasisScale
        linkList={linkList}
        listEdges={Boolean(block.iconlistEdges)}
      />
      <Buttons buttons={block.buttons as any} ri={ri} />
    </>
  )

  return (
    <div className={rootClass} style={rootStyle}>
      <Wrap
        className={[
          'b61-prose__region',
          `b61-surface--${surface}`,
          surface !== 'none' && `b61-band--${surface}`,
          `b61-prose__region--pt-${pt}`,
          `b61-prose__region--pb-${pb}`,
        ]
          .filter(Boolean)
          .join(' ')}
        data-b61-reveal={rv}
        {...(hasHeading ? { 'aria-labelledby': headingId } : {})}
      >
        <div
          className={[
            'b61-prose__inner',
            'b61-prose__inner--mregular',
            `b61-prose__inner--a${align}`,
            `b61-prose__inner--p${position}`,
            beside ? 'b61-prose__inner--beside' : headFull && 'b61-prose__inner--hfull',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {beside ? (
            <>
              <div className="b61-prose__head">{head}</div>
              <div className="b61-prose__main">{main}</div>
            </>
          ) : (
            <>
              {head}
              {main}
            </>
          )}
        </div>
      </Wrap>
    </div>
  )
}
