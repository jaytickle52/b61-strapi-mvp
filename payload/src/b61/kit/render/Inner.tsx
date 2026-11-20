import B61Split from '../../elements/split/Split'
import { WithClass } from './custom-class'
import B61Prose from '../../elements/prose/Prose'
import B61Cta from '../../elements/cta/Cta'
import B61CardGrid from '../../elements/cards/CardGrid'
import B61StatsBand from '../../elements/stats/StatsBand'
import B61Testimonial from '../../elements/testimonial/Testimonial'
import B61Gallery from '../../elements/gallery/Gallery'
import B61FramedImage from '../../elements/framed/FramedImage'
import B61Divider from '../../elements/divider/Divider'
import B61Logos from '../../elements/logos/Logos'
import B61ButtonBar from '../../elements/buttonbar/ButtonBar'
import B61Accordion from '../../elements/accordion/Accordion'
import B61Tabs from '../../elements/tabs/Tabs'
import B61Rail from '../../elements/rail/Rail'
import B61Form from '../../elements/form/Form'
import EditMark, { elementName } from '../preview/EditMark'
import { Fragment } from 'react'

export const INNER: Record<string, (p: { block: any; index?: number; nested?: boolean }) => any> = {
  b61Split: B61Split,
  b61Prose: B61Prose,
  b61Cta: B61Cta,
  b61CardGrid: B61CardGrid,
  b61StatsBand: B61StatsBand,
  b61Testimonial: B61Testimonial,
  b61Gallery: B61Gallery,
  b61FramedImage: B61FramedImage,
  b61Divider: B61Divider,
  b61Logos: B61Logos,
  b61ButtonBar: B61ButtonBar,
  b61Accordion: B61Accordion,
  // A Tabs inside a container only comes from an old nested Tabbed Features (20 Nov 2026).
  b61Tabs: B61Tabs,
  b61Rail: B61Rail,
  b61Form: B61Form,
}

/** Renders a container's child elements. Index 1, so Automatic headings are H2, never H1. */
/** `path` (live preview only) is where these children live in the editor, e.g. "sections.2.content". */
export default function Inner({ blocks, path }: { blocks?: any[] | null; path?: string }) {
  return (
    <>
      {(blocks ?? []).map((b, i) => {
        const El = INNER[b.blockType]
        if (!El) return null
        return (
          <Fragment key={b.id ?? i}>
            <WithClass block={b}>
              {path && <EditMark path={`${path}.${i}`} label={elementName(b.blockType)} />}
              <El block={b} index={i + 1} nested />
            </WithClass>
          </Fragment>
        )
      })}
    </>
  )
}
