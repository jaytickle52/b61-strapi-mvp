import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Sections from "@/components/Sections";
import { getPage, isPreview } from "@/lib/data";
import { seoMetadata } from "@/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("home");
  // The home page's title is the school's name (the layout's default), unless a meta title is set.
  return page ? seoMetadata({ meta: page.meta, path: "/" }) : {};
}

export default async function HomePage() {
  const page = await getPage("home");
  if (!page) notFound();
  return <Sections sections={page.sections ?? []} editable={await isPreview()} />;
}
