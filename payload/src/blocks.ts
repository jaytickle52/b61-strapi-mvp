import { B61Hero } from './b61/elements/hero/fields'
import { B61Split } from './b61/elements/split/fields'
import { B61Prose } from './b61/elements/prose/fields'
import { B61Cta } from './b61/elements/cta/fields'
import { B61CardGrid } from './b61/elements/cards/fields'
import { B61StatsBand } from './b61/elements/stats/fields'
import { B61Testimonial } from './b61/elements/testimonial/fields'
import { B61Gallery } from './b61/elements/gallery/fields'
import { B61FramedImage } from './b61/elements/framed/fields'
import { B61Divider } from './b61/elements/divider/fields'
import { B61ButtonBar } from './b61/elements/buttonbar/fields'

// The sections an editor can add, reorder and remove on any page.
// Each is a Banner 61 element built on the B61 editing kit (src/b61).
export const sectionBlocks = [
  B61Hero,
  B61Split,
  B61Prose,
  B61CardGrid,
  B61StatsBand,
  B61Gallery,
  B61Testimonial,
  B61Cta,
  B61FramedImage,
  B61ButtonBar,
  B61Divider,
]
