import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PREVIEW_COOKIE, previewCookieOptions } from "@/lib/preview";

export async function POST() {
  (await cookies()).set(PREVIEW_COOKIE, "", { ...previewCookieOptions, maxAge: 0 });
  redirect("/");
}
