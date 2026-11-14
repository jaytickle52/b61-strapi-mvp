import qs from "qs";
import { secret } from "@/lib/secrets";
import { isPreview } from "@/lib/preview";

const STRAPI_URL = (process.env.STRAPI_URL || "http://localhost:1337").replace(/\/$/, "");
const TOKEN = secret("FRONTEND_API_TOKEN", "STRAPI_API_TOKEN");

export type Media = { url: string; alternativeText?: string | null; width?: number; height?: number } | null;
export type Button = { label: string; url: string; style?: "primary" | "secondary" | "link" };
export type Block = { type: string; children?: Block[]; [key: string]: unknown };

export type Settings = {
  schoolName: string;
  tagline?: string;
  logo?: Media;
  primaryColor?: string;
  secondaryColor?: string;
  headingFont?: string;
  bodyFont?: string;
  phone?: string;
  email?: string;
  address?: string;
  navigation?: { label: string; url: string }[];
  headerButton?: Button | null;
};

export type Section = { __component: string; id: number; [key: string]: any };
export type Page = { documentId: string; title: string; slug: string; seoDescription?: string; sections: Section[] };
export type Audience = "public" | "parents";
export type Event = {
  documentId: string; title: string; slug: string; startsAt: string; endsAt?: string | null;
  location?: string; audience: Audience; summary?: string; description?: Block[]; image?: Media;
};
export type NewsPost = {
  documentId: string; title: string; slug: string; date: string; audience: Audience;
  summary?: string; body?: Block[]; image?: Media;
};
export type StaffMember = { documentId: string; name: string; role: string; department?: string; email?: string; bio?: string; photo?: Media };
export type Program = { documentId: string; name: string; slug: string; grades?: string; summary?: string; description?: Block[]; image?: Media };

/** Turn a Strapi media path into a full URL. */
export function mediaUrl(media: Media | undefined): string | null {
  if (!media?.url) return null;
  return media.url.startsWith("http") ? media.url : `${STRAPI_URL}${media.url}`;
}

/**
 * Read from the school's Strapi instance. In Draft Mode (an editor clicked Preview)
 * it reads unsaved-to-live drafts; otherwise only published content.
 */
async function get<T>(path: string, params: Record<string, unknown> = {}): Promise<T> {
  const isEnabled = await isPreview();
  const query = qs.stringify({ ...params, status: isEnabled ? "draft" : "published" }, { encodeValuesOnly: true });
  const res = await fetch(`${STRAPI_URL}/api/${path}?${query}`, {
    headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {},
    cache: "no-store",
  });
  if (res.status === 404) return { data: null } as T;
  if (!res.ok) throw new Error(`Strapi ${path} failed: ${res.status} ${await res.text()}`);
  return res.json();
}

const deepSections = {
  sections: {
    on: {
      "sections.hero": { populate: { image: true, buttons: true } },
      "sections.split": { populate: { image: true, button: true } },
      "sections.card-grid": { populate: { cards: { populate: { image: true } } } },
      "sections.stats-band": { populate: { stats: true } },
      "sections.cta-band": { populate: { button: true } },
      "sections.prose": { populate: "*" },
    },
  },
};

export async function getSettings(): Promise<Settings> {
  const res = await get<{ data: Settings | null }>("school-setting", { populate: { logo: true, navigation: true, headerButton: true } });
  return res.data ?? { schoolName: "Our School" };
}

export async function getPage(slug: string): Promise<Page | null> {
  const res = await get<{ data: Page[] }>("pages", { filters: { slug: { $eq: slug } }, populate: deepSections });
  return res.data?.[0] ?? null;
}

export async function getEvents(opts: { audience?: Audience | "all"; upcoming?: boolean; limit?: number } = {}): Promise<Event[]> {
  const filters: Record<string, unknown> = {};
  if (opts.audience && opts.audience !== "all") filters.audience = { $eq: opts.audience };
  if (opts.upcoming !== false) filters.startsAt = { $gte: new Date(Date.now() - 6 * 3600 * 1000).toISOString() };
  const res = await get<{ data: Event[] }>("events", {
    filters, sort: ["startsAt:asc"], populate: { image: true },
    pagination: { pageSize: opts.limit ?? 50 },
  });
  return res.data ?? [];
}

export async function getEvent(slug: string): Promise<Event | null> {
  const res = await get<{ data: Event[] }>("events", { filters: { slug: { $eq: slug } }, populate: { image: true } });
  return res.data?.[0] ?? null;
}

export async function getNews(opts: { audience?: Audience | "all"; limit?: number } = {}): Promise<NewsPost[]> {
  const filters: Record<string, unknown> = {};
  if (opts.audience && opts.audience !== "all") filters.audience = { $eq: opts.audience };
  const res = await get<{ data: NewsPost[] }>("news-posts", {
    filters, sort: ["date:desc", "createdAt:desc"], populate: { image: true },
    pagination: { pageSize: opts.limit ?? 50 },
  });
  return res.data ?? [];
}

export async function getNewsPost(slug: string): Promise<NewsPost | null> {
  const res = await get<{ data: NewsPost[] }>("news-posts", { filters: { slug: { $eq: slug } }, populate: { image: true } });
  return res.data?.[0] ?? null;
}

export async function getPrograms(limit = 50): Promise<Program[]> {
  const res = await get<{ data: Program[] }>("programs", { sort: ["sortOrder:asc", "name:asc"], populate: { image: true }, pagination: { pageSize: limit } });
  return res.data ?? [];
}

export async function getProgram(slug: string): Promise<Program | null> {
  const res = await get<{ data: Program[] }>("programs", { filters: { slug: { $eq: slug } }, populate: { image: true } });
  return res.data?.[0] ?? null;
}

export async function getStaff(limit = 100): Promise<StaffMember[]> {
  const res = await get<{ data: StaffMember[] }>("staff-members", { sort: ["sortOrder:asc", "name:asc"], populate: { photo: true }, pagination: { pageSize: limit } });
  return res.data ?? [];
}

export function formatEventDate(iso: string, opts: { withTime?: boolean } = {}) {
  const d = new Date(iso);
  const tz = process.env.SCHOOL_TIMEZONE || "America/New_York";
  const date = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: tz });
  if (!opts.withTime) return date;
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: tz });
  return `${date} · ${time}`;
}
