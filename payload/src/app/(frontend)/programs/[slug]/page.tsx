import type { Metadata } from "next";
import RichText from "@/components/RichText";
import PageHeader from "@/components/PageHeader";
import { getProgram, isPreview } from "@/lib/data";
import Sections from "@/components/Sections";
import { firstImage } from "@/seo/text";
import { seoMetadata } from "@/seo/metadata";
import { redirectOrNotFound } from "@/seo/redirect";
import { imgProps } from "@/b61/lib/media";

export async function generateMetadata({ params }: PageProps<"/programs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgram(slug);
  return program
    ? seoMetadata({
        title: program.name,
        description: program.summary,
        meta: (program as any).meta,
        image: program.image ?? firstImage(program.sections ?? []),
        content: program.sections?.length ? program.sections : (program as any).description,
        path: `/programs/${slug}`,
      })
    : {};
}

export default async function ProgramPage({ params }: PageProps<"/programs/[slug]">) {
  const { slug } = await params;
  const program = await getProgram(slug);
  if (!program) return redirectOrNotFound(`/programs/${slug}`);
  // Built with sections: exactly like any page.
  if (program.sections?.length) return <Sections sections={program.sections} editable={await isPreview()} />;
  // Older programs (no sections yet): the header, photo and description.
  const img = imgProps(program.image, "(min-width: 768px) 720px, 100vw");
  const alt = typeof program.image === "object" ? program.image?.alt ?? "" : "";
  return (
    <>
      <PageHeader
        eyebrow={program.grades ? `Grades ${program.grades}` : "Program"}
        title={program.name}
        intro={program.summary}
        crumbs={[{ name: "Programs", path: "/programs" }, { name: program.name, path: `/programs/${slug}` }]}
      />
      <article className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-8">
        {img && <img {...img} alt={alt} className="mb-8 h-auto w-full rounded-3xl" />}
        <RichText content={program.description} />
      </article>
    </>
  );
}
