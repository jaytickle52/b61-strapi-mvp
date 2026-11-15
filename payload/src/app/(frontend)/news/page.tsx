import { seoMetadata } from "@/seo/metadata";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { formatDate, getNews, getNewsCategories, type NewsCategory } from "@/lib/data";

export async function generateMetadata({ searchParams }: PageProps<"/news">) {
  const slug = (await searchParams).category;
  const cat = typeof slug === "string" ? (await getNewsCategories()).find((c) => c.slug === slug) : undefined;
  return seoMetadata({ title: cat ? `${cat.name} news` : "News", path: cat ? `/news?category=${cat.slug}` : "/news" });
}

const names = (cats: unknown) =>
  (Array.isArray(cats) ? cats : []).filter((c): c is NewsCategory => Boolean(c) && typeof c === "object").map((c) => c.name);

export default async function NewsPage({ searchParams }: PageProps<"/news">) {
  const slug = (await searchParams).category;
  const categories = await getNewsCategories();
  const active = typeof slug === "string" ? categories.find((c) => c.slug === slug) : undefined;
  const posts = await getNews({ category: active?.id });

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
      </section>
    </>
  );
}
