import { revalidatePath } from "next/cache";

// Strapi calls this after every save. Pages read live today, so this mainly
// clears anything Next.js may hold; it is ready for when caching is turned on.
export async function POST(request: Request) {
  const secret = request.headers.get("x-revalidate-secret");
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ revalidated: false }, { status: 401 });
  }
  revalidatePath("/", "layout");
  return Response.json({ revalidated: true, now: Date.now() });
}
