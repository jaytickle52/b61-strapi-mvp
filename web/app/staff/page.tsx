import Sections from "@/components/Sections";
import PageHeader from "@/components/PageHeader";

export const metadata = { title: "Our team" };

export default function StaffPage() {
  return (
    <>
      <PageHeader eyebrow="People" title="Our team" />
      <Sections sections={[{ __component: "sections.card-grid", id: 0, source: "staff", limit: 100, columns: "four", tone: "light" }]} />
    </>
  );
}
