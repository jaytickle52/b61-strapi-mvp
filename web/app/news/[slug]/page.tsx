import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Blocks from "@/components/Blocks";
import PageHeader from "@/components/PageHeader";
import { formatEventDate, getNewsPost, mediaUrl } from "@/lib/strapi";

export async function generateMetadata({ params }: PageProps<"/news/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNewsPost(slug);
  return post && post.audience === "public" ? { title: post.title, description: post.summary } : {};
}

export default async function NewsPostPage({ params }: PageProps<"/news/[slug]">) {
  const { slug } = await params;
  const post = await getNewsPost(slug);
  if (!post || post.audience !== "public") notFound();
  const img = mediaUrl(post.image);
  return (
    <>
      <PageHeader eyebrow={formatEventDate(post.date)} title={post.title} intro={post.summary} />
      <article className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-8">
        {img && <img src={img} alt="" className="mb-8 w-full rounded-3xl" />}
        <Blocks content={post.body} />
      </article>
    </>
  );
}
