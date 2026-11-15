import type { Metadata } from "next";
import RichText from "@/components/RichText";
import PageHeader from "@/components/PageHeader";
import { formatDate, getNewsPost } from "@/lib/data";
import { seoMetadata } from "@/seo/metadata";
import { redirectOrNotFound } from "@/seo/redirect";
import { articleSchema } from "@/seo/schema";
import JsonLd from "@/seo/JsonLd";
import { imgProps } from "@/b61/lib/media";

export async function generateMetadata({ params }: PageProps<"/news/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNewsPost(slug);
  return post && post.audience === "public"
    ? seoMetadata({ title: post.title, description: post.summary, meta: (post as any).meta, image: post.image, path: `/news/${slug}`, type: "article" })
    : {};
}

export default async function NewsPostPage({ params }: PageProps<"/news/[slug]">) {
  const { slug } = await params;
  const post = await getNewsPost(slug);
  if (!post || post.audience !== "public") return redirectOrNotFound(`/news/${slug}`);
  const img = imgProps(post.image, "(min-width: 768px) 720px, 100vw");
  const alt = typeof post.image === "object" ? post.image?.alt ?? "" : "";
  return (
    <>
      <JsonLd data={await articleSchema(post)} />
      <PageHeader eyebrow={formatDate(post.date)} title={post.title} intro={post.summary} />
      <article className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-8">
        {img && <img {...img} alt={alt} className="mb-8 h-auto w-full rounded-3xl" />}
        <RichText content={post.body} />
      </article>
    </>
  );
}
