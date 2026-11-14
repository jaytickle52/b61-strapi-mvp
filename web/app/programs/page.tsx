import Sections from "@/components/Sections";
import PageHeader from "@/components/PageHeader";

export const metadata = { title: "Programs" };

export default function ProgramsPage() {
  return (
    <>
      <PageHeader eyebrow="Academics" title="Our programs" />
      <Sections sections={[{ __component: "sections.card-grid", id: 0, source: "programs", limit: 12, columns: "three", tone: "light" }]} />
    </>
  );
}
