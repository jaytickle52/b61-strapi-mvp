import type { Metadata } from "next";
import RichText from "@/components/RichText";
import PageHeader from "@/components/PageHeader";
import { getProgram, mediaUrl } from "@/lib/data";
import { seoMetadata } from "@/seo/metadata";
import { redirectOrNotFound } from "@/seo/redirect";

export async function generateMetadata({ params }: PageProps<"/programs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgram(slug);
  return program
    ? seoMetadata({ title: program.name, description: program.summary, meta: (program as any).meta, image: program.image, path: `/programs/${slug}` })
    : {};
}

export default async function ProgramPage({ params }: PageProps<"/programs/[slug]">) {
  const { slug } = await params;
  const program = await getProgram(slug);
  if (!program) return redirectOrNotFound(`/programs/${slug}`);
  const img = mediaUrl(program.image);
  return (
    <>
      <PageHeader eyebrow={program.grades ? `Grades ${program.grades}` : "Program"} title={program.name} intro={program.summary} />
      <article className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-8">
        {img && <img src={img} alt="" className="mb-8 w-full rounded-3xl" />}
        <RichText content={program.description} />
      </article>
    </>
  );
}
