import type { ReactNode } from "react";
import Link from "next/link";
import JsonLd from "@/seo/JsonLd";
import { breadcrumbSchema } from "@/seo/schema";

export type Crumb = { name: string; path: string };

/*
 * The header band of a program, event, news or list page. `crumbs` adds a
 * breadcrumb trail above the eyebrow (Home › Programs › Lower School), and the
 * same trail as BreadcrumbList data for search engines. Home is added first.
 */
export default async function PageHeader({ eyebrow, title, intro, crumbs }: { eyebrow?: string; title: string; intro?: ReactNode; crumbs?: Crumb[] }) {
  const trail = crumbs ? [{ name: "Home", path: "/" }, ...crumbs] : null;
  return (
    <section className="tone-muted py-14 sm:py-20">
      {trail && <JsonLd data={await breadcrumbSchema(trail)} />}
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        {trail && (
          <nav aria-label="Breadcrumb" className="b61-crumbs mb-4 text-sm">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
              {trail.map((c, i) => (
                <li key={c.path + i} className="flex items-center gap-2">
                  {i > 0 && (
                    <span aria-hidden="true" className="soft">
                      ›
                    </span>
                  )}
                  {i < trail.length - 1 ? (
                    <Link href={c.path} className="soft underline-offset-4 hover:text-brand hover:underline">
                      {c.name}
                    </Link>
                  ) : (
                    <span aria-current="page" className="soft">
                      {c.name}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {eyebrow && <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-brand">{eyebrow}</p>}
        <h1 className="text-4xl sm:text-5xl">{title}</h1>
        {intro && <div className="soft mt-4 max-w-2xl text-lg">{intro}</div>}
      </div>
    </section>
  );
}
