import { revalidatePath } from "next/cache";
import { secret as derived } from "@/lib/secrets";

// Strapi calls this after every save. Pages read live today, so this mainly
// clears anything Next.js may hold; it is ready for when caching is turned on.
export async function POST(request: Request) {
  const given = request.headers.get("x-revalidate-secret");
  const expected = derived("REVALIDATE_SECRET");
  if (!expected || given !== expected) {
    return Response.json({ revalidated: false }, { status: 401 });
  }
  revalidatePath("/", "layout");
  return Response.json({ revalidated: true, now: Date.now() });
}
