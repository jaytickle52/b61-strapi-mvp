import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import Sections from "@/components/Sections";
import { getPage } from "@/lib/data";
import { seoMetadata } from "@/seo/metadata";
import { redirectOrNotFound } from "@/seo/redirect";

/*
 * Every page built in the editor lives at /<slug>. Any other address (old
 * WordPress links like /about-us/our-history) is looked up in Redirects.
 */
const slugOf = (path: string[]) => (path.length === 1 ? decodeURIComponent(path[0]) : null);

export async function generateMetadata({ params }: PageProps<"/[...path]">): Promise<Metadata> {
  const { path } = await params;
  const slug = slugOf(path);
  const page = slug ? await getPage(slug) : null;
  return page ? seoMetadata({ title: page.title, meta: page.meta, path: `/${slug}` }) : {};
}

export default async function CmsPage({ params }: PageProps<"/[...path]">) {
  const { path } = await params;
  const slug = slugOf(path);
  if (slug === "home") permanentRedirect("/");
  const page = slug ? await getPage(slug) : null;
  if (!page) return redirectOrNotFound(`/${path.join("/")}`);
  return <Sections sections={page.sections ?? []} />;
}
