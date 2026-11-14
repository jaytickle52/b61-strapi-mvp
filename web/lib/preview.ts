import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { secret } from "@/lib/secrets";

// Preview mode for editors. Strapi shows the website inside its admin panel (an
// iframe on another domain), where Chrome blocks ordinary third-party cookies,
// including Next.js's built-in draft-mode cookie. This cookie is "partitioned",
// which browsers allow inside that frame, so the draft shows up in Strapi too.

export const PREVIEW_COOKIE = "b61_preview";

export function previewToken(): string {
  const s = secret("PREVIEW_SECRET");
  return s ? createHash("sha256").update(`b61-preview:${s}`).digest("hex") : "";
}

export async function isPreview(): Promise<boolean> {
  const token = previewToken();
  if (!token) return false;
  return (await cookies()).get(PREVIEW_COOKIE)?.value === token;
}

export const previewCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none" as const,
  partitioned: true,
  path: "/",
  maxAge: 60 * 60 * 4,
};
