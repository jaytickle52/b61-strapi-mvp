import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Blocks from "@/components/Blocks";
import PageHeader from "@/components/PageHeader";
import { formatEventDate, getEvent, mediaUrl } from "@/lib/strapi";

export async function generateMetadata({ params }: PageProps<"/events/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  return event && event.audience === "public" ? { title: event.title, description: event.summary } : {};
}

export default async function EventPage({ params }: PageProps<"/events/[slug]">) {
  const { slug } = await params;
  const event = await getEvent(slug);
  // Parents-only events never appear on the public site.
  if (!event || event.audience !== "public") notFound();
  const img = mediaUrl(event.image);
  return (
    <>
      <PageHeader
        eyebrow={formatEventDate(event.startsAt, { withTime: true })}
        title={event.title}
        intro={event.location}
      />
      <article className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-8">
        {img && <img src={img} alt="" className="mb-8 w-full rounded-3xl" />}
        <Blocks content={event.description} />
      </article>
    </>
  );
}
