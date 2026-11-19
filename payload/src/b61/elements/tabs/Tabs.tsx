import { resolveHeadingLevel } from '../../kit/groups'
import { BandHead, eruleClass, revealAttr } from '../../kit/render/parts'
import Inner from '../../kit/render/Inner'
import TabsInit from './TabsInit'
import { headingText } from '../../kit/heading'

/* Ported from elements/Tabs/html.twig and elements/Tab/html.twig (plugin 1.77.1). */
export default function B61Tabs({ block, index = 0, path }: { block: any; index?: number; path?: string }) {
  const ri = revealAttr(block.entrance)
  const rv = block.entrance === 'off' ? 'off' : 'on'
  const as = resolveHeadingLevel(block.headingLevel, index)
  const surface = block.surface ?? 'none'
  const pos = block.tabPosition ?? 'top'
  const talign = block.tabAlign ?? 'left'
  const openFirst = block.firstItemOpen !== false
  const uid = String(block.id ?? index)
  const id = `b61-tabs-${uid}`
  const title = headingText(block.heading)
  const Wrap = title ? 'section' : 'div'
  const tabs = (block.tabs ?? []).filter((t: any) => t?.label)
  const ha = block.headingAlign ?? 'left'
  return (
    <div className={['b61-tabs', eruleClass(block.eyebrowRule)].filter(Boolean).join(' ')}>
      <Wrap
        className={[
          'b61-tabs__region',
          `b61-surface--${surface}`,
          surface !== 'none' && `b61-band--${surface}`,
          `b61-tabs__region--tabs-${pos}`,
          pos === 'top' && `b61-tabs__region--align-${talign}`,
          `b61-tabs__region--pt-${block.padTop ?? 'normal'}`,
          `b61-tabs__region--pb-${block.padBottom ?? 'normal'}`,
        ]
          .filter(Boolean)
          .join(' ')}
        data-b61-reveal={rv}
        {...(title ? { 'aria-labelledby': `${id}-heading` } : {})}
      >
        <BandHead block={block} prefix="b61-tabs" as={as} headingId={`${id}-heading`} ri={ri} headClass={`b61-halign-${ha} b61-headw-${ha}`} itemClass="b61-block" />
        <div className="b61-tabs__layout">
          {tabs.length > 0 && (
            <div className="b61-tabs__tablist js-b61-tabs-list" {...ri} data-b61-orientation={pos === 'top' ? 'horizontal' : 'vertical'} data-b61-label={title || 'Tabs'}>
              {tabs.map((t: any, i: number) => {
                const active = openFirst && i === 0
                return (
                  <button key={t.id ?? i} type="button" id={`${id}-tab-${i + 1}`} className={`b61-tabs__tab js-b61-tabs-tab${active ? ' is-active' : ''}`} data-b61-selected={active ? 'true' : 'false'}>
                    <span className="b61-tabs__title">{t.label}</span>
                  </button>
                )
              })}
            </div>
          )}
          <div className="b61-tabs__panels js-b61-tabs-panels" data-b61-tabs-id={uid}>
            {tabs.map((t: any, i: number) => (
              <div key={t.id ?? i} className="b61-pane">
                <h3 className="b61-pane__label js-b61-pane-label">{t.label}</h3>
                <div className="b61-pane__content">
                  <Inner blocks={t.content} path={path && `${path}.tabs.${i}.content`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Wrap>
      <TabsInit />
    </div>
  )
}
