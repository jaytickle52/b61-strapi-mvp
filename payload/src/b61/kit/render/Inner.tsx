import B61Split from '../../elements/split/Split'
import B61Prose from '../../elements/prose/Prose'
import B61Cta from '../../elements/cta/Cta'
import B61CardGrid from '../../elements/cards/CardGrid'
import B61StatsBand from '../../elements/stats/StatsBand'
import B61Testimonial from '../../elements/testimonial/Testimonial'
import B61Gallery from '../../elements/gallery/Gallery'
import B61FramedImage from '../../elements/framed/FramedImage'
import B61Divider from '../../elements/divider/Divider'
import B61ButtonBar from '../../elements/buttonbar/ButtonBar'
import B61Accordion from '../../elements/accordion/Accordion'
import B61Pillars from '../../elements/pillars/Pillars'
import B61Rail from '../../elements/rail/Rail'

export const INNER: Record<string, (p: { block: any; index?: number }) => any> = {
  b61Split: B61Split,
  b61Prose: B61Prose,
  b61Cta: B61Cta,
  b61CardGrid: B61CardGrid,
  b61StatsBand: B61StatsBand,
  b61Testimonial: B61Testimonial,
  b61Gallery: B61Gallery,
  b61FramedImage: B61FramedImage,
  b61Divider: B61Divider,
  b61ButtonBar: B61ButtonBar,
  b61Accordion: B61Accordion,
  b61Pillars: B61Pillars,
  b61Rail: B61Rail,
}

/** Renders a container's child elements. Index 1, so Automatic headings are H2, never H1. */
export default function Inner({ blocks }: { blocks?: any[] | null }) {
  return (
    <>
      {(blocks ?? []).map((b, i) => {
        const El = INNER[b.blockType]
        return El ? <El key={b.id ?? i} block={b} index={i + 1} /> : null
      })}
    </>
  )
}
