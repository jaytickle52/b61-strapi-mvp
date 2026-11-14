import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { secret as derived } from "@/lib/secrets";
import { PREVIEW_COOKIE, previewCookieOptions, previewToken } from "@/lib/preview";

// Strapi's Preview opens this URL (inside its admin panel or in a new tab).
// It turns on preview mode so pages show saved drafts, then sends the editor
// to the page they were editing.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const given = searchParams.get("secret");
  const path = searchParams.get("path") ?? "/";
  const status = searchParams.get("status");

  const expected = derived("PREVIEW_SECRET");
  if (!expected || given !== expected) {
    return new Response("Invalid preview link", { status: 401 });
  }
  // Only allow site-relative paths, never a redirect to another site.
  const safePath = path.startsWith("/") && !path.startsWith("//") ? path : "/";

  const jar = await cookies();
  if (status === "published") jar.delete({ name: PREVIEW_COOKIE, path: "/" });
  else jar.set(PREVIEW_COOKIE, previewToken(), previewCookieOptions);
  redirect(safePath);
}
