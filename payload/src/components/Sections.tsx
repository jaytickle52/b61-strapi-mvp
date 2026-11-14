import Link from "next/link";
import RichText from "@/components/RichText";
import B61Hero from "@/b61/elements/hero/Hero";
import B61Split from "@/b61/elements/split/Split";
import B61Prose from "@/b61/elements/prose/Prose";
import B61Cta from "@/b61/elements/cta/Cta";
import {
  formatDate,
  getEvents,
  getNews,
  getPrograms,
  getStaff,
  mediaUrl,
  type Media,
  type Page,
} from "@/lib/data";

type Section = NonNullable<Page["sections"]>[number] & { [key: string]: any };
type Button = { label?: string | null; url?: string | null; style?: string | null };

// One component per section type an editor can add to a page.
// The editor picks content and a few options; the design stays on-brand.

function Btn({ button }: { button?: Button | null }) {
  if (!button?.label || !button.url) return null;
  return (
    <Link href={button.url!} className={`btn btn-${button.style ?? "primary"}`}>
      {button.label}
    </Link>
  );
}

function Picture({ media, className = "", label, size = "card" }: { media?: number | Media | null; className?: string; label?: string; size?: "card" | "hero" }) {
  const src = mediaUrl(media, size);
  if (src) return <img src={src} alt={typeof media === "object" && media ? media.alt : ""} className={`h-full w-full object-cover ${className}`} />;
  return <div aria-label={label ?? "Photo coming soon"} role="img" className={`art-placeholder h-full w-full ${className}`} />;
}

const wrap = "mx-auto w-full max-w-6xl px-5 sm:px-8";

type Card = { title: string; body?: string | null; image?: number | Media | null; link?: string | null; meta?: string };

/** Card grid: hand-written cards, or filled live from programs, events, news or staff. */
async function CardGrid({ s }: { s: Section }) {
  const limit = Number(s.limit ?? 3);
  let cards: Card[] = [];
  switch (s.source) {
    case "programs":
      cards = (await getPrograms(limit)).map((p) => ({ title: p.name, meta: p.grades ? `Grades ${p.grades}` : undefined, body: p.summary, image: p.image, link: `/programs/${p.slug}` }));
      break;
    case "upcoming-events":
      cards = (await getEvents({ limit })).map((e) => ({ title: e.title, meta: formatDate(e.startsAt, { withTime: true }), body: e.summary, image: e.image, link: `/events/${e.slug}` }));
      break;
    case "latest-news":
      cards = (await getNews({ limit })).map((n) => ({ title: n.title, meta: formatDate(n.date), body: n.summary, image: n.image, link: `/news/${n.slug}` }));
      break;
    case "staff":
      cards = (await getStaff(limit)).map((m) => ({ title: m.name, meta: m.role, body: m.bio, image: m.photo }));
      break;
    default:
      cards = ((s.cards ?? []) as Card[]).map((c) => ({ ...c }));
  }
  const cols = { two: "sm:grid-cols-2", three: "sm:grid-cols-2 lg:grid-cols-3", four: "sm:grid-cols-2 lg:grid-cols-4" }[s.columns as string] ?? "sm:grid-cols-2 lg:grid-cols-3";
  const isStaff = s.source === "staff";

  return (
    <section className={`tone-${s.tone ?? "light"} py-16 sm:py-20`}>
      <div className={wrap}>
        {(s.heading || s.intro) && (
          <div className="mb-10 max-w-2xl">
            {s.heading && <h2 className="text-3xl sm:text-4xl">{s.heading}</h2>}
            {s.intro && <p className="soft mt-3 text-lg">{s.intro}</p>}
          </div>
        )}
        {cards.length === 0 ? (
          <p className="soft">Nothing to show here yet.</p>
        ) : (
          <div className={`grid gap-6 ${cols}`}>
            {cards.map((c, i) => {
              const inner = (
                <>
                  <div className={`${isStaff ? "aspect-square" : "aspect-[16/10]"} overflow-hidden`}>
                    <Picture media={c.image} label={c.title} />
                  </div>
                  <div className="p-5">
                    {c.meta && <p className="mb-1 text-sm font-semibold text-brand">{c.meta}</p>}
                    <h3 className="text-xl">{c.title}</h3>
                    {c.body && <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">{c.body}</p>}
                  </div>
                </>
              );
              const cls = "block overflow-hidden rounded-2xl border border-line bg-paper text-ink transition hover:-translate-y-0.5 hover:shadow-lg";
              return c.link ? (
                <Link key={i} href={c.link!} className={cls}>{inner}</Link>
              ) : (
                <div key={i} className={cls}>{inner}</div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}


function StatsBand({ s }: { s: Section }) {
  const stats = (s.stats ?? []) as { value: string; label: string }[];
  return (
    <section className={`tone-${s.tone ?? "light"} py-14 sm:py-20`}>
      <div className={wrap}>
        {s.heading && <h2 className="mb-10 text-center text-2xl sm:text-3xl">{s.heading}</h2>}
        <dl className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {stats.map((st, i) => (
            <div key={i}>
              <dt className="sr-only">{st.label}</dt>
              <dd className="font-heading text-4xl text-accent sm:text-5xl">{st.value}</dd>
              <dd className="soft mt-2 text-sm">{st.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default function Sections({ sections }: { sections: Section[] | any[] }) {
  return (
    <>
      {sections.map((s, i) => {
        const key = s.id ?? `${s.blockType}-${i}`;
        switch (s.blockType) {
          case "b61Hero": return <B61Hero key={key} block={s as any} index={i} />;
          case "b61Split": return <B61Split key={key} block={s as any} index={i} />;
          case "cardGrid": return <CardGrid key={key} s={s} />;
          case "statsBand": return <StatsBand key={key} s={s} />;
          case "b61Cta": return <B61Cta key={key} block={s as any} index={i} />;
          case "b61Prose": return <B61Prose key={key} block={s as any} index={i} />;
          default: return null;
        }
      })}
    </>
  );
}
