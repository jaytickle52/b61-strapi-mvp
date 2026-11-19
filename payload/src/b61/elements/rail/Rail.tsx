import { resolveLink } from '../../lib/media'
import { Buttons } from '../../kit/render/parts'
import { B61Icon } from '../../kit/render/icons'

/* Ported from elements/Rail/html.twig (plugin 1.77.1). */
export default function B61Rail({ block, index = 0 }: { block: any; index?: number }) {
  const surface = block.surface ?? 'plain'
  const painted = surface !== 'none'
  const buttons = (block.buttons ?? []).filter((b: any) => b?.label)
  const links = (block.links ?? []).filter((l: any) => l?.label)
  if (!buttons.length && !links.length) return <div className="b61-rail" />
  const id = `b61-rail-${block.id ?? index}-label`
  const actions = buttons.length > 0 && <Buttons buttons={buttons} className="b61-btn-group b61-rail__actions" ri={{}} />
  const nav = links.length > 0 && (
    <nav className="b61-rail__nav" {...(block.linksLabel ? { 'aria-labelledby': id } : {})}>
      {block.linksLabel && (
        <p className="b61-rail__label" id={id}>
          {block.linksLabel}
        </p>
      )}
      <ul className="b61-rail__links">
        {links.map((l: any, i: number) => {
          const { href, newTab } = resolveLink(l.link)
          const icon = l.icon && l.icon !== 'arrow' ? l.icon : null
          return (
            <li key={l.id ?? i} className="b61-rail__item">
              <a className="b61-link b61-rail__link" href={href ?? undefined} {...(newTab ? { target: '_blank', rel: 'noopener' } : {})}>
                <span className={`b61-link-arrow b61-rail__arrow${icon ? ' b61-rail__arrow--icon' : ''}`} aria-hidden="true">
                  {icon ? <B61Icon name={icon} image={l.iconImage} keepColours={l.iconColours} /> : '→'}
                </span>
                <span className="b61-rail__link-text">{l.label}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
  return (
    <div className="b61-rail">
      <div className={`b61-rail__inner${block.sticky ? ' b61-rail__inner--sticky' : ''}`}>
        <div className={`b61-rail__panel${painted ? ` b61-surface--${surface} b61-band--${surface} b61-card` : ''}`}>
          {block.actionsPosition === 'bottom' ? (
            <>
              {nav}
              {actions}
            </>
          ) : (
            <>
              {actions}
              {nav}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
