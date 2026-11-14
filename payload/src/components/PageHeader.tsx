import type { ReactNode } from "react";

export default function PageHeader({ eyebrow, title, intro }: { eyebrow?: string; title: string; intro?: ReactNode }) {
  return (
    <section className="tone-muted py-14 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        {eyebrow && <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-brand">{eyebrow}</p>}
        <h1 className="text-4xl sm:text-5xl">{title}</h1>
        {intro && <div className="soft mt-4 max-w-2xl text-lg">{intro}</div>}
      </div>
    </section>
  );
}
