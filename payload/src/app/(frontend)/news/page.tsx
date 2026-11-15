import { seoMetadata } from "@/seo/metadata";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { notFound } from "next/navigation";
import { formatDate, getNewsCategories, getNewsPage, type NewsCategory } from "@/lib/data";

// ?page=2 and up; anything else is page 1.
const pageOf = (v: unknown) => (typeof v === "string" && /^[1-9]\d{0,3}$/.test(v) ? Number(v) : 1);

/** The News address for a category and page, without empty parts. */
const newsHref = (category: string | undefined, page: number) => {
  const q = new URLSearchParams();
  if (category) q.set("category", category);
  if (page > 1) q.set("page", String(page));
  const s = q.toString();
  return s ? `/news?${s}` : "/news";
};

export async function generateMetadata({ searchParams }: PageProps<"/news">) {
  const sp = await searchParams;
  const cat = typeof sp.category === "string" ? (await getNewsCategories()).find((c) => c.slug === sp.category) : undefined;
  const page = pageOf(sp.page);
  const title = `${cat ? `${cat.name} news` : "News"}${page > 1 ? ` (page ${page})` : ""}`;
  // Each page of the full list is its own address, so older posts stay reachable.
  // Category views repeat those posts: kept out of results, links still followed.
  return seoMetadata({
    title,
    path: newsHref(cat?.slug, page),
    noindexFollow: Boolean(cat),
    fallback: cat ? `${cat.name} news from {school}.` : "News and stories from {school}.",
  });
}

const names = (cats: unknown) =>
  (Array.isArray(cats) ? cats : []).filter((c): c is NewsCategory => Boolean(c) && typeof c === "object").map((c) => c.name);

export default async function NewsPage({ searchParams }: PageProps<"/news">) {
  const sp = await searchParams;
  const categories = await getNewsCategories();
  const active = typeof sp.category === "string" ? categories.find((c) => c.slug === sp.category) : undefined;
  const page = pageOf(sp.page);
  const { docs: posts, totalPages } = await getNewsPage({ category: active?.id, page });
  // A page past the last one doesn't exist (and shouldn't look like an empty list to Google).
  if (page > 1 && (posts.length === 0 || page > totalPages)) notFound();

  const chip = (href: string, label: string, on: boolean) => (
    <li key={href}>
      <Link
        href={href}
        aria-current={on ? "page" : undefined}
        className={`inline-block rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
          on ? "border-brand bg-brand text-white" : "border-line hover:border-brand hover:text-brand"
        }`}
      >
        {label}
      </Link>
    </li>
  );

  return (
    <>
      <PageHeader eyebrow="News" title={active ? active.name : "What's happening"} />
      <section className="mx-auto w-full max-w-4xl px-5 py-14 sm:px-8">
        {categories.length > 0 && (
          <nav aria-label="News categories" className="mb-10">
            <ul className="flex flex-wrap gap-2">
              {chip("/news", "All news", !active)}
              {categories.map((c) => chip(`/news?category=${c.slug}`, c.name, active?.id === c.id))}
            </ul>
          </nav>
        )}
        {posts.length === 0 ? (
          <p className="soft">{active ? `No ${active.name.toLowerCase()} news yet.` : "No news yet."}</p>
        ) : (
          <ul className="space-y-8">
            {posts.map((p) => {
              const cats = names(p.categories);
              return (
                <li key={p.id}>
                  <Link href={`/news/${p.slug}`} className="block hover:text-brand">
                    <span className="text-sm font-semibold text-brand">
                      {formatDate(p.date)}
                      {cats.length > 0 && <span className="soft font-normal"> · {cats.join(", ")}</span>}
                    </span>
                    <span className="mt-1 block font-heading text-2xl">{p.title}</span>
                    {p.summary && <span className="soft mt-2 block">{p.summary}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
        {totalPages > 1 && (
          <nav aria-label="More news" className="mt-12 flex items-center justify-between gap-4 border-t border-line pt-6 text-sm font-semibold">
            {page > 1 ? (
              <Link href={newsHref(active?.slug, page - 1)} rel="prev" className="hover:text-brand">
                ← Newer posts
              </Link>
            ) : (
              <span />
            )}
            <span className="soft font-normal">
              Page {page} of {totalPages}
            </span>
            {page < totalPages ? (
              <Link href={newsHref(active?.slug, page + 1)} rel="next" className="hover:text-brand">
                Older posts →
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </section>
    </>
  );
}
