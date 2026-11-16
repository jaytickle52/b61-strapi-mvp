import B61Hero from "@/b61/elements/hero/Hero";
import { WithClass } from "@/b61/kit/render/custom-class";
import B61Split from "@/b61/elements/split/Split";
import B61Prose from "@/b61/elements/prose/Prose";
import B61Cta from "@/b61/elements/cta/Cta";
import B61CardGrid from "@/b61/elements/cards/CardGrid";
import B61StatsBand from "@/b61/elements/stats/StatsBand";
import B61Testimonial from "@/b61/elements/testimonial/Testimonial";
import B61Gallery from "@/b61/elements/gallery/Gallery";
import B61FramedImage from "@/b61/elements/framed/FramedImage";
import B61Divider from "@/b61/elements/divider/Divider";
import B61Logos from "@/b61/elements/logos/Logos";
import B61ButtonBar from "@/b61/elements/buttonbar/ButtonBar";
import B61Accordion from "@/b61/elements/accordion/Accordion";
import B61Pillars from "@/b61/elements/pillars/Pillars";
import B61Tabs from "@/b61/elements/tabs/Tabs";
import B61Carousel from "@/b61/elements/carousel/Carousel";
import B61Section from "@/b61/elements/section/Section";
import B61Form from "@/b61/elements/form/Form";
import EditMark, { elementName } from "@/b61/kit/preview/EditMark";
import { Fragment } from "react";

// Every section is a Banner 61 element; each renders the plugin's own markup.
const ELEMENTS: Record<string, (p: { block: any; index?: number; path?: string }) => any> = {
  b61Hero: B61Hero,
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
  b61Pillars: B61Pillars,
  b61Tabs: B61Tabs,
  b61Carousel: B61Carousel,
  b61Section: B61Section,
  b61Form: B61Form,
};

/**
 * `editable` (live preview only) adds click-to-edit markers; see b61/kit/preview.
 * `titled`: the page already shows its own H1 (PageHeader), so an element set to
 * "Automatic" heading level never makes another one: its index starts at 1.
 */
export default function Sections({ sections, editable = false, titled = false }: { sections: any[]; editable?: boolean; titled?: boolean }) {
  return (
    <>
      {sections.map((s, i) => {
        const El = ELEMENTS[s.blockType];
        if (!El) return null;
        const path = editable ? `sections.${i}` : undefined;
        return (
          <Fragment key={s.id ?? `${s.blockType}-${i}`}>
            <WithClass block={s}>
              {path && <EditMark path={path} label={elementName(s.blockType)} />}
              <El block={s} index={titled ? i + 1 : i} path={path} />
            </WithClass>
          </Fragment>
        );
      })}
    </>
  );
}
