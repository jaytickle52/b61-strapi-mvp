import { seoMetadata } from "@/seo/metadata";
import { cardsFrom } from "@/b61/demo";
import Sections from "@/components/Sections";
import PageHeader from "@/components/PageHeader";
import JsonLd from "@/seo/JsonLd";
import { staffSchema } from "@/seo/schema";
import { getStaff } from "@/lib/data";

export const generateMetadata = () => seoMetadata({ title: "Our team", path: "/staff", fallback: "Meet the teachers and staff of {school}." });

export default async function StaffPage() {
  const people = await getStaff(100);
  return (
    <>
      {people.length > 0 && <JsonLd data={await staffSchema(people)} />}
      <PageHeader eyebrow="People" title="Our team" />
      <Sections sections={[{ ...cardsFrom({ source: "staff", limit: 100, columns: "four", tone: "light" }), id: "all", entrance: "off" }]} />
    </>
  );
}
