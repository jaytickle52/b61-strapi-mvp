import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Blocks from "@/components/Blocks";
import PageHeader from "@/components/PageHeader";
import { getProgram, mediaUrl } from "@/lib/strapi";

export async function generateMetadata({ params }: PageProps<"/programs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgram(slug);
  return program ? { title: program.name, description: program.summary } : {};
}

export default async function ProgramPage({ params }: PageProps<"/programs/[slug]">) {
  const { slug } = await params;
  const program = await getProgram(slug);
  if (!program) notFound();
  const img = mediaUrl(program.image);
  return (
    <>
      <PageHeader eyebrow={program.grades ? `Grades ${program.grades}` : "Program"} title={program.name} intro={program.summary} />
      <article className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-8">
        {img && <img src={img} alt="" className="mb-8 w-full rounded-3xl" />}
        <Blocks content={program.description} />
      </article>
    </>
  );
}
