import type { CSSProperties } from 'react'
import type { Page } from '@/payload-types'
import { imgProps } from '../../lib/media'
import { anchorAttr } from '../../kit/render/anchor'

export type DividerBlock = Extract<NonNullable<Page['sections']>[number], { blockType: 'b61Divider' }>

/* Ported from elements/Divider/html.twig (plugin 1.77.1). Decorative, so hidden from screen readers. */
export default function B61Divider({ block }: { block: DividerBlock; index?: number }) {
  const reveal = block.entrance !== 'off'
  const w = 'narrow'
  const wStep = block.widthStep ? Math.min(Math.max(Math.round(block.widthStep), 1), 7) : null
  const style = wStep ? ({ '--b61-div-len': `var(--b61-rule-len-${wStep})` } as CSSProperties) : undefined
  const orn = block.lineStyle === 'ornament' ? imgProps(block.ornament, '120px') : null
  return (
    <div {...anchorAttr(block)} className={`b61-rule${wStep ? ' b61-rule--wstep' : ''}`} style={style}>
      <div className={`b61-rule__inner b61-rule__inner--a${block.alignment ?? 'center'}${reveal ? ' b61-rule__inner--reveal' : ''}`} aria-hidden="true">
        {orn ? (
          <span className={`b61-rule__ornament b61-rule__ornament--w${w}`}>
            <img {...orn} alt="" loading="lazy" decoding="async" />
          </span>
        ) : (
          <span className={`b61-rule__line b61-rule__line--w${w} b61-rule__line--${block.weight ?? 'regular'} b61-rule__line--${block.lineColor ?? 'accent'}`} />
        )}
      </div>
    </div>
  )
}
