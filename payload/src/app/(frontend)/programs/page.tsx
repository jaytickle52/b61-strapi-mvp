import { seoMetadata } from "@/seo/metadata";
import { cardsFrom } from "@/b61/demo";
import Sections from "@/components/Sections";
import PageHeader from "@/components/PageHeader";

export const generateMetadata = () => seoMetadata({ title: "Programs", path: "/programs", fallback: "Programs at {school}: what students learn at each stage, from the early grades up." });

export default function ProgramsPage() {
  return (
    <>
      <PageHeader eyebrow="Academics" title="Our programs" />
      <Sections sections={[{ ...cardsFrom({ source: "programs", limit: 12, columns: "three", tone: "light" }), id: "all", entrance: "off" }]} />
    </>
  );
}
