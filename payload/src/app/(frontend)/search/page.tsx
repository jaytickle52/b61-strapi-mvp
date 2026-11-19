import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { searchSite } from "@/lib/data";
import { seoMetadata } from "@/seo/metadata";

export const generateMetadata = () => seoMetadata({ title: "Search", path: "/search", meta: { noindex: true } });

const KIND: Record<string, string> = { pages: "Page", events: "Event", news: "News" };

/* Site search over this school's published pages (programs are pages), events and news. */
export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const raw = (await searchParams).q;
  const q = (Array.isArray(raw) ? raw[0] : raw)?.toString().slice(0, 100) ?? "";
  const results = q ? await searchSite(q) : [];
  return (
    <>
      <PageHeader title="Search" />
      <section className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-8">
        <form action="/search" method="get" role="search" className="b61-search">
          <label htmlFor="b61-search-q" className="b61-search__label">
            Search this site
          </label>
          <div className="b61-search__row">
            <input id="b61-search-q" name="q" type="search" defaultValue={q} className="b61-search__input" placeholder="Tuition, tours, athletics…" autoComplete="off" />
            <button type="submit" className="b61-btn b61-btn--primary">
              Search
            </button>
          </div>
        </form>
        {q && (
          <p className="b61-search__count" role="status">
            {results.length === 0 ? `No results for “${q}”.` : `${results.length} result${results.length === 1 ? "" : "s"} for “${q}”`}
          </p>
        )}
        {results.length > 0 && (
          <ol className="b61-search__results">
            {results.map((r: any) => (
              <li key={r.id} className="b61-search__result">
                <span className="b61-search__kind">{KIND[r.doc?.relationTo] ?? "Page"}</span>
                <Link href={r.url || "/"} className="b61-search__title">
                  {r.title}
                </Link>
                {r.summary && <p className="b61-search__summary">{r.summary}</p>}
              </li>
            ))}
          </ol>
        )}
      </section>
    </>
  );
}
