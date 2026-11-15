import { seoMetadata } from "@/seo/metadata";
import { cardsFrom } from "@/b61/demo";
import Sections from "@/components/Sections";
import PageHeader from "@/components/PageHeader";

export const generateMetadata = () => seoMetadata({ title: "Our team", path: "/staff", fallback: "Meet the teachers and staff of {school}." });

export default function StaffPage() {
  return (
    <>
      <PageHeader eyebrow="People" title="Our team" />
      <Sections sections={[{ ...cardsFrom({ source: "staff", limit: 100, columns: "four", tone: "light" }), id: "all", entrance: "off" }]} />
    </>
  );
}
