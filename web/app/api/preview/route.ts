import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { secret as derived } from "@/lib/secrets";

// Strapi's Preview button opens this URL. It turns on Draft Mode so the page
// shows saved drafts, then sends the editor to the page they were editing.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const path = searchParams.get("path") ?? "/";
  const status = searchParams.get("status");

  const expected = derived("PREVIEW_SECRET");
  if (!expected || secret !== expected) {
    return new Response("Invalid preview link", { status: 401 });
  }
  // Only allow site-relative paths, never a redirect to another site.
  const safePath = path.startsWith("/") && !path.startsWith("//") ? path : "/";

  const draft = await draftMode();
  if (status === "published") draft.disable();
  else draft.enable();
  redirect(safePath);
}
