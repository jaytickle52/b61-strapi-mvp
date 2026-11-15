import { seoMetadata } from "@/seo/metadata";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Subscribe from "@/events/Subscribe";
import { calendarFeedUrl, eventWhen, getEvents, getEventsBetween, getSettings, type Event } from "@/lib/data";
import { eventDays, isMonth, monthGrid, monthLabel, ymd, zoned } from "@/events/time";

// The month calendar reaches this many months either side of today. Past that, no
// links and a 404, so search engines can't click "next month" forever.
const MONTH_RANGE = 24;
const monthIndex = (m: string) => Number(m.slice(0, 4)) * 12 + Number(m.slice(5, 7)) - 1;
const inRange = (m: string) => Math.abs(monthIndex(m) - monthIndex(ymd(new Date()).slice(0, 7))) <= MONTH_RANGE;

export async function generateMetadata({ searchParams }: PageProps<"/events">) {
  const month = (await searchParams).view === "month";
  // Month pages share the events list's canonical address and stay out of results;
  // their event links are still followed.
  return seoMetadata({
    title: month ? "Calendar" : "Events",
    path: "/events",
    noindexFollow: month,
    fallback: "Upcoming events at {school}: open houses, games, programs and community events, with a calendar you can subscribe to.",
  });
}

const feedName = (e: Event) => (e.importedFrom && typeof e.importedFrom === "object" ? e.importedFrom.name : null);

function Tabs({ view, month }: { view: "list" | "month"; month: string }) {
  const tab = (href: string, label: string, on: boolean, nofollow = false) => (
    <Link href={href} rel={nofollow ? "nofollow" : undefined} aria-current={on ? "page" : undefined} className={`b61-cal-tab${on ? " is-on" : ""}`}>
      {label}
    </Link>
  );
  return (
    <nav aria-label="Calendar view" className="b61-cal-tabs">
      {tab("/events", "Upcoming", view === "list")}
      {tab(`/events?view=month&month=${month}`, "Month", view === "month", true)}
    </nav>
  );
}

function List({ events }: { events: Event[] }) {
  if (events.length === 0) return <p className="soft">No upcoming events right now. Check back soon.</p>;
  return (
    <ul className="divide-y divide-line border-y border-line">
      {events.map((e) => (
        <li key={e.id}>
          <Link href={`/events/${e.slug}`} className="flex flex-col gap-1 py-6 hover:text-brand sm:flex-row sm:gap-8">
            <span className="w-56 shrink-0 font-semibold text-brand">{eventWhen(e)}</span>
            <span>
              <span className="block font-heading text-xl">{e.title}</span>
              {(e.location || feedName(e)) && (
                <span className="soft block text-sm">{[e.location, feedName(e)].filter(Boolean).join(" · ")}</span>
              )}
              {e.summary && <span className="soft mt-1 block">{e.summary}</span>}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function MonthLink({ month, label, children }: { month: string; label: string; children: string }) {
  if (!inRange(month)) return <span className="b61-cal__nav" aria-hidden="true" style={{ visibility: "hidden" }}>{children}</span>;
  return (
    <Link className="b61-cal__nav" rel="nofollow" href={`/events?view=month&month=${month}`} aria-label={`${label}, ${monthLabel(month)}`}>
      {children}
    </Link>
  );
}

function Month({ month, events }: { month: string; events: Event[] }) {
  const { days, prevMonth, nextMonth } = monthGrid(month);
  const today = ymd(new Date());
  const byDay = new Map<string, Event[]>();
  for (const e of events) for (const d of eventDays(e)) byDay.set(d, [...(byDay.get(d) ?? []), e]);
  const time = (e: Event) =>
    e.allDay
      ? null
      : new Date(e.startsAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: process.env.SCHOOL_TIMEZONE || "America/New_York" });
  const weeks = Array.from({ length: 6 }, (_, w) => days.slice(w * 7, w * 7 + 7)).filter(
    (week, i) => i < 5 || week.some((d) => d.startsWith(month)),
  );
  const any = days.some((d) => d.startsWith(month) && byDay.has(d));

  return (
    <div className="b61-cal">
      <div className="b61-cal__head">
        <MonthLink month={prevMonth} label="Previous month">‹</MonthLink>
        <h2 className="b61-cal__title" aria-live="polite">{monthLabel(month)}</h2>
        <MonthLink month={nextMonth} label="Next month">›</MonthLink>
      </div>
      {!any && <p className="soft b61-cal__empty">No events this month.</p>}
      <table className="b61-cal__grid">
        <thead>
          <tr>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <th key={d} scope="col">{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={week[0]}>
              {week.map((d) => {
                const list = byDay.get(d) ?? [];
                const out = !d.startsWith(month);
                const label = new Date(`${d}T12:00:00Z`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" });
                return (
                  <td key={d} className={`${out ? "is-out" : ""}${d === today ? " is-today" : ""}${list.length ? " has-events" : ""}`}>
                    <span className="b61-cal__day">
                      <span aria-hidden="true">{Number(d.slice(8))}</span>
                      <span className="b61-cal__dlabel">{label}</span>
                    </span>
                    {list.length > 0 && (
                      <ul>
                        {list.map((e) => (
                          <li key={e.id}>
                            <Link href={`/events/${e.slug}`} className={e.allDay ? "is-allday" : undefined}>
                              {time(e) && <span className="b61-cal__time">{time(e)}</span>} {e.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function EventsPage({ searchParams }: PageProps<"/events">) {
  const sp = await searchParams;
  const view = sp.view === "month" ? "month" : "list";
  const month = isMonth(sp.month) ? sp.month : ymd(new Date()).slice(0, 7);
  if (view === "month" && !inRange(month)) notFound();
  const [settings, feedUrl] = await Promise.all([getSettings(), calendarFeedUrl()]);

  let events: Event[];
  if (view === "month") {
    const { days } = monthGrid(month);
    events = await getEventsBetween(zoned(days[0]), zoned(days[days.length - 1], 23, 59));
  } else {
    events = await getEvents({ limit: 100 });
  }

  return (
    <>
      <PageHeader eyebrow="Calendar" title={view === "month" ? "Calendar" : "Upcoming events"} intro="Open houses, games, programs and community events." />
      <section className="mx-auto w-full max-w-5xl px-5 py-14 sm:px-8">
        <div className="b61-cal-bar">
          <Tabs view={view} month={month} />
          <Subscribe feedUrl={feedUrl} name={settings.schoolName} />
        </div>
        {view === "month" ? <Month month={month} events={events} /> : <List events={events} />}
      </section>
    </>
  );
}
