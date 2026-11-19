import { permanentRedirect } from "next/navigation";
import { getPage } from "@/lib/data";
import { redirectOrNotFound } from "@/seo/redirect";

/*
 * Programs used to live at /programs/<slug>. Since 19 Nov 2026 a program is a
 * page tagged "This page is a program", at /<slug> like any page, so an old
 * link to a page that exists moves there for good. Anything else under
 * /programs/ goes through the school's Redirects as before, else Not found.
 * (A school's own page called "programs" lives at /programs: this route only
 * handles addresses below it.)
 */
export default async function OldProgramAddress({ params }: PageProps<"/programs/[slug]">) {
  const { slug } = await params;
  const page = await getPage(decodeURIComponent(slug));
  if (page) permanentRedirect(page.slug === "home" ? "/" : `/${page.slug}`);
  return redirectOrNotFound(`/programs/${slug}`);
}
