import { createHmac } from "node:crypto";

/**
 * Mirrors cms/config/secrets.ts: with the same SCHOOL_SECRET set on the website
 * and on that school's Strapi, both sides derive matching tokens. An explicitly
 * set variable (e.g. STRAPI_API_TOKEN) still wins.
 */
export function secret(name: string, explicitEnv?: string): string {
  const explicit = process.env[explicitEnv ?? name];
  if (explicit) return explicit;
  const master = process.env.SCHOOL_SECRET;
  if (!master) return "";
  return createHmac("sha256", master).update(`b61:${name}`).digest("hex");
}
