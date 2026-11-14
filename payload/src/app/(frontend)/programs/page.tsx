import Sections from "@/components/Sections";
import PageHeader from "@/components/PageHeader";

export const metadata = { title: "Programs" };

export default function ProgramsPage() {
  return (
    <>
      <PageHeader eyebrow="Academics" title="Our programs" />
      <Sections sections={[{ blockType: "cardGrid", id: "all", source: "programs", limit: 12, columns: "three", tone: "light" }]} />
    </>
  );
}
