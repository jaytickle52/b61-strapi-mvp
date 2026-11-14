import { cardsFrom } from "@/b61/demo";
import Sections from "@/components/Sections";
import PageHeader from "@/components/PageHeader";

export const metadata = { title: "Programs" };

export default function ProgramsPage() {
  return (
    <>
      <PageHeader eyebrow="Academics" title="Our programs" />
      <Sections sections={[{ ...cardsFrom({ source: "programs", limit: 12, columns: "three", tone: "light" }), id: "all", entrance: "off" }]} />
    </>
  );
}
