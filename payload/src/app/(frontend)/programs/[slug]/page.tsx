import { permanentRedirect } from "next/navigation";

/*
 * Programs used to live at /programs/<slug>. Since 19 Nov 2026 a program is a
 * page tagged "This page is a program", at /<slug> like any page, so old links
 * move there for good. (A school's own page called "programs" still lives at
 * /programs: this route only handles the address below it.)
 */
export default async function OldProgramAddress({ params }: PageProps<"/programs/[slug]">) {
  const { slug } = await params;
  permanentRedirect(`/${encodeURIComponent(slug)}`);
}
