import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Sections from "@/components/Sections";
import { getPage, isPreview } from "@/lib/data";
import { seoMetadata } from "@/seo/metadata";
import { firstImage } from "@/seo/text";
import JsonLd from "@/seo/JsonLd";
import { websiteSchema } from "@/seo/schema";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("home");
  // The home page's title is the school's name (the layout's default), unless a meta title is set.
  return page ? seoMetadata({ meta: page.meta, content: page.sections, image: firstImage(page.sections), path: "/" }) : {};
}

export default async function HomePage() {
  const page = await getPage("home");
  if (!page) notFound();
  return (
    <>
      <JsonLd data={await websiteSchema()} />
      <Sections sections={page.sections ?? []} editable={await isPreview()} />
    </>
  );
}
