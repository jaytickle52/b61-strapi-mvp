import type { CSSProperties } from 'react'
import type { Page } from '@/payload-types'
import { asMedia, focusOf, imgProps } from '../../lib/media'

export type FramedImageBlock = Extract<NonNullable<Page['sections']>[number], { blockType: 'b61FramedImage' }>

/* Ported from elements/Framed_Image/html.twig (plugin 1.77.1). */
export default function B61FramedImage({ block }: { block: FramedImageBlock; index?: number }) {
  const rv = block.entrance === 'off' ? 'off' : 'on'
  const fc = block.frameColor ?? 'primary'
  const w = 'full'
  const shape = block.imageShape ?? 'fixed'
  const style: Record<string, string> = {}
  if (shape === 'fixed') style.minHeight = ['360px', '460px', '560px', '680px'].includes(block.imageHeight ?? '') ? block.imageHeight! : '460px'
  if (shape === 'custom') {
    const rw = Math.min(Math.max(Number(block.ratioW) || 3, 0.1), 10000)
    const rh = Math.min(Math.max(Number(block.ratioH) || 2, 0.1), 10000)
    style.aspectRatio = `${rw} / ${rh}`
    style.minHeight = '0'
  }
  const focus = focusOf(block.image)
  if (focus) style['--b61-photo-focus'] = focus
  const wStep = block.widthStep ? Math.min(Math.max(Math.round(block.widthStep), 1), 7) : null
  const img = imgProps(block.image, '100vw')
  return (
    <div className="b61-fimg" style={wStep ? ({ '--b61-fimg-max': `var(--b61-box-${wStep})` } as CSSProperties) : undefined}>
      <div
        className={[
          'b61-fimg__frame',
          `b61-fimg__frame--${fc}`,
          `b61-fimg__frame--w${w}`,
          `b61-fimg__frame--shape-${shape}`,
          block.flipFrame && 'b61-fimg__frame--flip',
          wStep && 'b61-fimg__frame--wstep',
        ]
          .filter(Boolean)
          .join(' ')}
        data-b61-reveal={rv}
        {...(rv === 'on' ? { 'data-b61-reveal-item': '' } : {})}
      >
        <div className="b61-fimg__media" style={style as CSSProperties}>
          {img && <img {...img} alt={asMedia(block.image)?.alt ?? ''} loading="lazy" />}
        </div>
      </div>
    </div>
  )
}
