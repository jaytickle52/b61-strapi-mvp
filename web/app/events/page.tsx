import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { formatEventDate, getEvents } from "@/lib/strapi";

export const metadata = { title: "Events" };

export default async function EventsPage() {
  const events = await getEvents({ audience: "public" });
  return (
    <>
      <PageHeader eyebrow="Calendar" title="Upcoming events" intro="Open houses, tours and community events. Families of current students can see everything in the parent feed." />
      <section className="mx-auto w-full max-w-4xl px-5 py-14 sm:px-8">
        {events.length === 0 ? (
          <p className="soft">No upcoming events right now. Check back soon.</p>
        ) : (
          <ul className="divide-y divide-line border-y border-line">
            {events.map((e) => (
              <li key={e.documentId}>
                <Link href={`/events/${e.slug}`} className="flex flex-col gap-1 py-6 hover:text-brand sm:flex-row sm:gap-8">
                  <span className="w-48 shrink-0 font-semibold text-brand">{formatEventDate(e.startsAt, { withTime: true })}</span>
                  <span>
                    <span className="block font-heading text-xl">{e.title}</span>
                    {e.location && <span className="soft block text-sm">{e.location}</span>}
                    {e.summary && <span className="soft mt-1 block">{e.summary}</span>}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
