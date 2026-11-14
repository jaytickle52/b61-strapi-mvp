import { createHmac } from 'node:crypto';

/**
 * One secret per school. Set SCHOOL_SECRET (a long random string) and every
 * other secret Strapi and the website need is derived from it, so a new school
 * needs one pasted value instead of ten. Any variable set explicitly still wins.
 *
 * The website derives the same shared values from the same SCHOOL_SECRET
 * (see web/lib/secrets.ts), so the two always match.
 */
export function secret(name: string): string {
  const explicit = process.env[name];
  if (explicit) return explicit;
  const master = process.env.SCHOOL_SECRET;
  if (!master) throw new Error(`Set SCHOOL_SECRET (or ${name}) before starting Strapi.`);
  return createHmac('sha256', master).update(`b61:${name}`).digest('hex');
}

export function appKeys(): string[] {
  if (process.env.APP_KEYS) return process.env.APP_KEYS.split(',');
  return [1, 2, 3, 4].map((n) => secret(`APP_KEY_${n}`));
}
