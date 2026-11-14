import B61Hero from "@/b61/elements/hero/Hero";
import B61Split from "@/b61/elements/split/Split";
import B61Prose from "@/b61/elements/prose/Prose";
import B61Cta from "@/b61/elements/cta/Cta";
import B61CardGrid from "@/b61/elements/cards/CardGrid";
import B61StatsBand from "@/b61/elements/stats/StatsBand";
import B61Testimonial from "@/b61/elements/testimonial/Testimonial";
import B61Gallery from "@/b61/elements/gallery/Gallery";
import B61FramedImage from "@/b61/elements/framed/FramedImage";
import B61Divider from "@/b61/elements/divider/Divider";
import B61ButtonBar from "@/b61/elements/buttonbar/ButtonBar";
import B61Accordion from "@/b61/elements/accordion/Accordion";
import B61Pillars from "@/b61/elements/pillars/Pillars";
import B61Tabs from "@/b61/elements/tabs/Tabs";
import B61Carousel from "@/b61/elements/carousel/Carousel";
import B61Section from "@/b61/elements/section/Section";

// Every section is a Banner 61 element; each renders the plugin's own markup.
const ELEMENTS: Record<string, (p: { block: any; index?: number }) => any> = {
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
  b61ButtonBar: B61ButtonBar,
  b61Accordion: B61Accordion,
  b61Pillars: B61Pillars,
  b61Tabs: B61Tabs,
  b61Carousel: B61Carousel,
  b61Section: B61Section,
};

export default function Sections({ sections }: { sections: any[] }) {
  return (
    <>
      {sections.map((s, i) => {
        const El = ELEMENTS[s.blockType];
        return El ? <El key={s.id ?? `${s.blockType}-${i}`} block={s} index={i} /> : null;
      })}
    </>
  );
}
