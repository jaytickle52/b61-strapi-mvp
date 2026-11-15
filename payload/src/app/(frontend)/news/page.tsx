import { seoMetadata } from "@/seo/metadata";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { formatDate, getNews } from "@/lib/data";

export const generateMetadata = () => seoMetadata({ title: "News", path: "/news" });

export default async function NewsPage() {
  const posts = await getNews();
  return (
    <>
      <PageHeader eyebrow="News" title="What's happening" />
      <section className="mx-auto w-full max-w-4xl px-5 py-14 sm:px-8">
        {posts.length === 0 ? (
          <p className="soft">No news yet.</p>
        ) : (
          <ul className="space-y-8">
            {posts.map((p) => (
              <li key={p.id}>
                <Link href={`/news/${p.slug}`} className="block hover:text-brand">
                  <span className="text-sm font-semibold text-brand">{formatDate(p.date)}</span>
                  <span className="mt-1 block font-heading text-2xl">{p.title}</span>
                  {p.summary && <span className="soft mt-2 block">{p.summary}</span>}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
