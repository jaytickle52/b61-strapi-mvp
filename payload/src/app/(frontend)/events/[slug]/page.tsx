import type { Metadata } from "next";
import RichText from "@/components/RichText";
import PageHeader from "@/components/PageHeader";
import { eventWhen, getEvent, siteOrigin } from "@/lib/data";
import { googleEventLink } from "@/events/ics";
import { seoMetadata } from "@/seo/metadata";
import { redirectOrNotFound } from "@/seo/redirect";
import { eventSchema } from "@/seo/schema";
import JsonLd from "@/seo/JsonLd";
import { imgProps } from "@/b61/lib/media";

export async function generateMetadata({ params }: PageProps<"/events/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  return event && event.audience === "public"
    ? seoMetadata({ title: event.title, description: event.summary, meta: (event as any).meta, image: event.image, path: `/events/${slug}` })
    : {};
}

export default async function EventPage({ params }: PageProps<"/events/[slug]">) {
  const { slug } = await params;
  const event = await getEvent(slug);
  // Parents-only events never appear on the public site.
  if (!event || event.audience !== "public") return redirectOrNotFound(`/events/${slug}`);
  const img = imgProps(event.image, "(min-width: 768px) 720px, 100vw");
  const alt = typeof event.image === "object" ? event.image?.alt ?? "" : "";
  const origin = await siteOrigin();
  return (
    <>
      <JsonLd data={await eventSchema(event)} />
      <PageHeader
        eyebrow={eventWhen(event)}
        title={event.title}
        intro={event.location}
      />
      <article className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-8">
        <p className="b61-addcal">
          <strong>Add to calendar:</strong>
          <a href={googleEventLink(event as any, origin)} target="_blank" rel="noopener noreferrer">Google</a>
          <a href={`/events/${slug}/event.ics`}>Apple / Outlook (.ics)</a>
        </p>
        {img && <img {...img} alt={alt} className="mb-8 h-auto w-full rounded-3xl" />}
        <RichText content={event.description} />
      </article>
    </>
  );
}
