import type { Block, BlocksField } from 'payload'
import { B61Split } from './elements/split/fields'
import { B61Prose } from './elements/prose/fields'
import { B61Cta } from './elements/cta/fields'
import { B61CardGrid } from './elements/cards/fields'
import { B61StatsBand } from './elements/stats/fields'
import { B61Testimonial } from './elements/testimonial/fields'
import { B61Gallery } from './elements/gallery/fields'
import { B61FramedImage } from './elements/framed/fields'
import { B61Divider } from './elements/divider/fields'
import { B61ButtonBar } from './elements/buttonbar/fields'
import { B61Accordion } from './elements/accordion/fields'
import { B61Rail } from './elements/rail/fields'
import { B61Form } from './elements/form/fields'
import { B61Logos } from './elements/logos/fields'

/*
 * Elements that can sit INSIDE a container (a Tab, a Carousel slide, a
 * Section). Containers themselves are left out, so nesting stays one level
 * deep and the editor never shows a Section inside a Tab inside a Section.
 */
export const innerBlocks: Block[] = [
  B61Prose,
  B61Split,
  B61CardGrid,
  B61StatsBand,
  B61Gallery,
  B61Testimonial,
  B61FramedImage,
  B61Accordion,
  B61Cta,
  B61Form,
  B61ButtonBar,
  B61Divider,
  B61Logos,
]

/** The short set for a carousel slide. */
export const slideBlocks: Block[] = [B61Testimonial, B61Split, B61Prose]

/** A tab panel: the slide set plus Card Grid (a set of cards per tab). */
export const tabBlocks: Block[] = [...slideBlocks, B61CardGrid]

export function innerField(name: string, label: string, o: { rail?: boolean; only?: Block[]; description?: string; condition?: any } = {}): BlocksField {
  return {
    name,
    label,
    type: 'blocks',
    blocks: o.only ?? (o.rail ? [B61Rail, ...innerBlocks] : innerBlocks),
    labels: { singular: 'Element', plural: 'Elements' },
    admin: { initCollapsed: true, description: o.description, condition: o.condition },
  }
}
