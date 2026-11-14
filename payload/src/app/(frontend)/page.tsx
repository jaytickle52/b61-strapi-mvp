import { notFound } from "next/navigation";
import Sections from "@/components/Sections";
import { getPage } from "@/lib/data";

export default async function HomePage() {
  const page = await getPage("home");
  if (!page) notFound();
  return <Sections sections={page.sections ?? []} />;
}
