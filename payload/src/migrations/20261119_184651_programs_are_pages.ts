import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import { toBody } from '../b61/kit/body'
import { tidyRemovedNodes } from '../b61/kit/editors'
import { plainToRich } from '../b61/kit/plain'

/*
 * Programs become pages tagged as programs (Jay, 19 Nov 2026).
 *
 * 1. Pages get "This page is a program" and the program card fields.
 * 2. Each program is copied to a page at /<its slug> (see moveProgramsToPages).
 * 3. Each school that had programs gets an ordinary "Programs" page with a
 *    programs card grid at /programs, unless it already has a page there.
 *
 * The old programs tables are NOT dropped here. Vercel builds (and runs this)
 * while the previous version of the site is still serving, and that version
 * reads them; dropping them now would break it for the minutes the build
 * takes. A follow-up migration removes them once this version is live.
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "pages" ADD COLUMN "is_program" boolean DEFAULT false;
  ALTER TABLE "pages" ADD COLUMN "program_grades" varchar;
  ALTER TABLE "pages" ADD COLUMN "program_summary" varchar;
  ALTER TABLE "pages" ADD COLUMN "program_image_id" integer;
  ALTER TABLE "pages" ADD COLUMN "program_order" numeric DEFAULT 10;
  ALTER TABLE "_pages_v" ADD COLUMN "version_is_program" boolean DEFAULT false;
  ALTER TABLE "_pages_v" ADD COLUMN "version_program_grades" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_program_summary" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_program_image_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_program_order" numeric DEFAULT 10;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_program_image_id_media_id_fk" FOREIGN KEY ("program_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_program_image_id_media_id_fk" FOREIGN KEY ("version_program_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_program_program_image_idx" ON "pages" USING btree ("program_image_id");
  CREATE INDEX "_pages_v_version_program_version_program_image_idx" ON "_pages_v" USING btree ("version_program_image_id");`)
  await moveProgramsToPages({ db, payload, req })
}

/** Back out the page fields. The programs tables were never touched, so the old site works again. */
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "pages" DROP CONSTRAINT IF EXISTS "pages_program_image_id_media_id_fk";
  ALTER TABLE "_pages_v" DROP CONSTRAINT IF EXISTS "_pages_v_version_program_image_id_media_id_fk";
  DROP INDEX IF EXISTS "pages_program_program_image_idx";
  DROP INDEX IF EXISTS "_pages_v_version_program_version_program_image_idx";
  ALTER TABLE "pages" DROP COLUMN IF EXISTS "is_program", DROP COLUMN IF EXISTS "program_grades", DROP COLUMN IF EXISTS "program_summary", DROP COLUMN IF EXISTS "program_image_id", DROP COLUMN IF EXISTS "program_order";
  ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_is_program", DROP COLUMN IF EXISTS "version_program_grades", DROP COLUMN IF EXISTS "version_program_summary", DROP COLUMN IF EXISTS "version_program_image_id", DROP COLUMN IF EXISTS "version_program_order";`)
}

const rowsOf = (r: any): any[] => r?.rows ?? r ?? []
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const asJson = (v: unknown) => (typeof v === 'string' ? JSON.parse(v) : v)

/** The program's page: a Prose band (grades as eyebrow, name as heading, its description as the text). */
function programSections(o: { name: string; grades?: string | null; summary?: string | null; description?: unknown }) {
  const description = tidyRemovedNodes(asJson(o.description))
  const hasWords = Boolean((description as any)?.root?.children?.some((c: any) => c?.children?.length))
  const body = hasWords ? description : o.summary ? plainToRich(o.summary) : null
  return [
    {
      blockType: 'b61Prose',
      ...(o.grades ? { eyebrow: `Grades ${o.grades}` } : {}),
      headingLevel: 'auto',
      heading: [{ text: o.name, emphasize: false }],
      ...(body ? { body: toBody([{ type: 'body', body }]) } : {}),
      textAlign: 'left', position: 'center', surface: 'none', eyebrowRule: 'site', headingRule: 'site', entrance: 'on',
    },
  ]
}

/*
 * Each program is copied from two places: the program as it is live (the
 * main table) and its latest edit (the newest version, which is where an
 * unpublished draft lives). A published program becomes a published page;
 * if it also has a newer draft, that draft is saved on the page as a draft.
 * A program never published becomes a draft page.
 *
 * If the school already has a page at that address, that page is tagged as
 * the program instead (its live version and its drafts) and keeps its own
 * content; the program's card fields come along.
 *
 * Redirects that pointed at the program now point at its page. The program's
 * search entries are removed (the build re-indexes the pages). No search-engine
 * pings go out from here (context b61Migration; see seo/indexnow.ts).
 */
async function moveProgramsToPages({ db, payload, req }: Pick<MigrateUpArgs, 'db' | 'payload' | 'req'>) {
  if (!rowsOf(await db.execute(sql`SELECT to_regclass('public.programs') AS t`))[0]?.t) return
  const rows = rowsOf(
    await db.execute(sql`
      SELECT p.id, p.school_id, p._status, p._order,
             p.name, p.slug, p.grades, p.summary, p.description, p.image_id,
             p.meta_title, p.meta_description, p.meta_image_id, p.meta_noindex,
             v.version__status AS v_status, v.version_name AS v_name, v.version_slug AS v_slug,
             v.version_grades AS v_grades, v.version_summary AS v_summary, v.version_description AS v_description,
             v.version_image_id AS v_image_id, v.version_meta_title AS v_meta_title,
             v.version_meta_description AS v_meta_description, v.version_meta_image_id AS v_meta_image_id,
             v.version_meta_noindex AS v_meta_noindex
      FROM programs p
      LEFT JOIN LATERAL (
        SELECT * FROM _programs_v WHERE parent_id = p.id ORDER BY latest DESC NULLS LAST, updated_at DESC LIMIT 1
      ) v ON true
      ORDER BY p.school_id, p._order NULLS LAST, p.id`),
  )
  const ctx = { b61Migration: true }
  const rank = new Map<number, number>()
  const schools = new Set<number>()
  for (const r of rows) {
    schools.add(r.school_id)
    const n = (rank.get(r.school_id) ?? 0) + 1
    rank.set(r.school_id, n)
    const published = r._status === 'published'
    // The latest edit, falling back to the live values field by field.
    const latest = {
      name: r.v_name ?? r.name, slug: r.v_slug ?? r.slug, grades: r.v_grades ?? r.grades, summary: r.v_summary ?? r.summary,
      description: r.v_description ?? r.description, image: r.v_image_id ?? r.image_id,
      meta: { title: r.v_meta_title ?? r.meta_title, description: r.v_meta_description ?? r.meta_description, image: r.v_meta_image_id ?? r.meta_image_id, noindex: r.v_meta_noindex ?? r.meta_noindex ?? false },
    }
    const live = {
      name: r.name, slug: r.slug, grades: r.grades, summary: r.summary, description: r.description, image: r.image_id,
      meta: { title: r.meta_title, description: r.meta_description, image: r.meta_image_id, noindex: r.meta_noindex ?? false },
    }
    const base = published ? live : latest
    const name = base.name || latest.name || 'Program'
    const slug = base.slug || latest.slug || slugify(name) || `program-${r.id}`
    const card = (x: typeof live) => ({ grades: x.grades ?? null, summary: x.summary ?? null, image: x.image ?? null, order: n * 10 })

    // The school + slug unique index is on the pages table, so look there.
    const taken = rowsOf(await db.execute(sql`SELECT id FROM pages WHERE school_id = ${r.school_id} AND slug = ${slug} LIMIT 1`))[0]
    let pageId: number
    if (taken) {
      pageId = taken.id
      const c = card(latest)
      await db.execute(sql`UPDATE pages SET is_program = true, program_grades = ${c.grades}, program_summary = ${c.summary}, program_image_id = ${c.image}, program_order = ${c.order} WHERE id = ${pageId}`)
      await db.execute(sql`UPDATE _pages_v SET version_is_program = true, version_program_grades = ${c.grades}, version_program_summary = ${c.summary}, version_program_image_id = ${c.image}, version_program_order = ${c.order} WHERE parent_id = ${pageId}`)
      payload.logger.info(`[b61] Program "${name}" (school ${r.school_id}): tagged the existing page at /${slug}`)
    } else {
      const page = await payload.create({
        collection: 'pages',
        data: {
          school: r.school_id, title: name, slug, generateSlug: false, isProgram: true,
          program: card(base), meta: { ...base.meta, description: base.meta.description ?? base.summary },
          sections: programSections({ name, grades: base.grades, summary: base.summary, description: base.description }),
          _status: published ? 'published' : 'draft',
        } as any,
        overrideAccess: true, req, context: ctx, draft: !published,
      })
      pageId = page.id as number
      // A live program with a newer, unpublished edit: keep that edit as the page's draft.
      if (published && r.v_status === 'draft') {
        const lname = latest.name || name
        await payload.update({
          collection: 'pages', id: pageId, draft: true, overrideAccess: true, req, context: ctx,
          data: {
            title: lname, isProgram: true, program: card(latest), meta: { ...latest.meta, description: latest.meta.description ?? latest.summary },
            sections: programSections({ name: lname, grades: latest.grades, summary: latest.summary, description: latest.description }),
            _status: 'draft',
          } as any,
        })
      }
    }
    await db.execute(sql`UPDATE redirects_rels SET pages_id = ${pageId}, programs_id = NULL WHERE programs_id = ${r.id}`)
  }
  await db.execute(sql`DELETE FROM search WHERE id IN (SELECT parent_id FROM search_rels WHERE programs_id IS NOT NULL)`)

  // /programs was a built-in list; it is now an ordinary page, made here for
  // each school that had programs (unless one is already there).
  for (const school of schools) {
    if (rowsOf(await db.execute(sql`SELECT id FROM pages WHERE school_id = ${school} AND slug = 'programs' LIMIT 1`))[0]) continue
    const schoolName = rowsOf(await db.execute(sql`SELECT name FROM schools WHERE id = ${school}`))[0]?.name ?? 'our school'
    await payload.create({
      collection: 'pages',
      data: {
        school, title: 'Programs', slug: 'programs', generateSlug: false, _status: 'published',
        meta: { description: `Programs at ${schoolName}: every stage, from the youngest learners up.` },
        sections: [
          {
            blockType: 'b61CardGrid', headingLevel: 'auto', heading: [{ text: 'Our programs', emphasize: false }],
            source: 'programs', limit: 12, mediaType: 'image', cards: [], arrangement: 'grid', columns: '3',
            textAlign: 'left', cardStyle: 'bordered', cardSurface: 'light', surface: 'none', entrance: 'on',
          },
        ],
      } as any,
      overrideAccess: true, req, context: ctx,
    })
  }
  payload.logger.info(`[b61] Moved ${rows.length} program(s) to pages; Programs pages for ${schools.size} school(s)`)
}
