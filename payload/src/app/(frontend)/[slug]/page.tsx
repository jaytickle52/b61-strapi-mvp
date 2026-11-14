import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Sections from "@/components/Sections";
import { getPage } from "@/lib/data";

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  return page ? { title: page.title, description: page.seoDescription } : {};
}

export default async function CmsPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) notFound();
  return <Sections sections={page.sections ?? []} />;
}
