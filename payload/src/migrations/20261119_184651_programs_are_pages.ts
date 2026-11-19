import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import { toBody } from '../b61/kit/body'
import { tidyRemovedNodes } from '../b61/kit/editors'
import { plainToRich } from '../b61/kit/plain'

/*
 * Programs become pages (19 Nov 2026). Each program is copied to a page at
 * /<its slug> with "This page is a program" switched on and its grades,
 * summary, photo and list order on the program card. Its description becomes
 * a Prose section (grades as eyebrow, name as heading). If the school already
 * has a page at that address, that page is tagged instead and keeps its
 * sections. SEO fields come along, redirects that pointed at the program point
 * at its page, and the program's search entries are dropped (the build re-indexes).
 * Old /programs/<slug> links redirect in the app (app/(frontend)/programs/[slug]).
 */
async function moveProgramsToPages({ db, payload, req }: Pick<MigrateUpArgs, 'db' | 'payload' | 'req'>) {
  const exists: any = await db.execute(sql`SELECT to_regclass('public.programs') AS t`)
  if (!(exists.rows ?? exists)[0]?.t) return
  const res: any = await db.execute(sql`
    SELECT id, school_id, name, slug, grades, summary, description, image_id, _status, _order,
           meta_title, meta_description, meta_image_id, meta_noindex
    FROM programs ORDER BY school_id, _order NULLS LAST, id`)
  const rows: any[] = res.rows ?? res
  const rank = new Map<number, number>()
  for (const p of rows) {
    const n = (rank.get(p.school_id) ?? 0) + 1
    rank.set(p.school_id, n)
    const program = { grades: p.grades, summary: p.summary, image: p.image_id ?? null, order: n * 10 }
    const meta = { title: p.meta_title, description: p.meta_description ?? p.summary, image: p.meta_image_id ?? null, noindex: p.meta_noindex ?? false }
    const description = tidyRemovedNodes(typeof p.description === 'string' ? JSON.parse(p.description) : p.description)
    const hasWords = Boolean((description as any)?.root?.children?.some((c: any) => c?.children?.length))
    const slug = p.slug || String(p.name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

    const found = await payload.find({
      collection: 'pages', where: { and: [{ school: { equals: p.school_id } }, { slug: { equals: slug } }] },
      limit: 1, depth: 0, draft: true, overrideAccess: true, req,
    })
    let pageId: number | string
    const ctx = { b61Migration: true }
    if (found.docs[0]) {
      pageId = found.docs[0].id
      await payload.update({
        collection: 'pages', id: pageId, data: { isProgram: true, program } as any,
        overrideAccess: true, req, context: ctx, draft: (found.docs[0] as any)._status !== 'published',
      })
    } else {
      const sections = [
        {
          blockType: 'b61Prose',
          ...(p.grades ? { eyebrow: `Grades ${p.grades}` } : {}),
          headingLevel: 'auto',
          heading: [{ text: p.name, emphasize: false }],
          ...(hasWords ? { body: toBody([{ type: 'body', body: description }]) } : p.summary ? { body: toBody([{ type: 'body', body: plainToRich(p.summary) }]) } : {}),
          textAlign: 'left', position: 'center', surface: 'none', eyebrowRule: 'site', headingRule: 'site', entrance: 'on',
        },
      ]
      const page = await payload.create({
        collection: 'pages',
        data: { school: p.school_id, title: p.name, slug, generateSlug: false, isProgram: true, program, meta, sections, _status: p._status === 'published' ? 'published' : 'draft' } as any,
        overrideAccess: true, req, context: ctx, draft: p._status !== 'published',
      })
      pageId = page.id
    }
    await db.execute(sql`UPDATE redirects_rels SET pages_id = ${pageId}, programs_id = NULL WHERE programs_id = ${p.id}`)
  }
  await db.execute(sql`DELETE FROM search WHERE id IN (SELECT parent_id FROM search_rels WHERE programs_id IS NOT NULL)`)
  payload.logger.info(`[b61] Moved ${rows.length} program(s) to pages`)
}


export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // 1. Pages get "This page is a program" and the program card fields.
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

  // 2. Every program becomes a page tagged as a program (Jay, 19 Nov 2026).
  await moveProgramsToPages({ db, payload, req })

  // 3. The Programs collection goes. (Its school + slug index was number 3;
  //    News categories' index takes that number, as Payload counts them.)
  await db.execute(sql`
  ALTER TABLE "programs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_programs_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "programs" CASCADE;
  DROP TABLE "_programs_v" CASCADE;
  ALTER TABLE "redirects_rels" DROP CONSTRAINT IF EXISTS "redirects_rels_programs_fk";
  ALTER TABLE "search_rels" DROP CONSTRAINT IF EXISTS "search_rels_programs_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_programs_fk";
  DROP INDEX IF EXISTS "redirects_rels_programs_id_idx";
  DROP INDEX IF EXISTS "search_rels_programs_id_idx";
  DROP INDEX IF EXISTS "school_slug_4_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_programs_id_idx";
  CREATE UNIQUE INDEX "school_slug_3_idx" ON "news_categories" USING btree ("school_id","slug");
  ALTER TABLE "redirects_rels" DROP COLUMN IF EXISTS "programs_id";
  ALTER TABLE "search_rels" DROP COLUMN IF EXISTS "programs_id";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "programs_find";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "programs_create";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "programs_update";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "programs_id";
  DROP TYPE "public"."enum_programs_status";
  DROP TYPE "public"."enum__programs_v_version_status";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_programs_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__programs_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "programs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"school_id" integer,
  	"name" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"grades" varchar,
  	"summary" varchar,
  	"description" jsonb,
  	"image_id" integer,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"meta_noindex" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_programs_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_programs_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_school_id" integer,
  	"version_name" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_grades" varchar,
  	"version_summary" varchar,
  	"version_description" jsonb,
  	"version_image_id" integer,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_noindex" boolean,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__programs_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "pages" DROP CONSTRAINT "pages_program_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_program_image_id_media_id_fk";
  
  DROP INDEX "pages_program_program_image_idx";
  DROP INDEX "_pages_v_version_program_version_program_image_idx";
  DROP INDEX "school_slug_3_idx";
  ALTER TABLE "redirects_rels" ADD COLUMN "programs_id" integer;
  ALTER TABLE "search_rels" ADD COLUMN "programs_id" integer;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "programs_find" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "programs_create" boolean DEFAULT false;
  ALTER TABLE "payload_mcp_api_keys" ADD COLUMN "programs_update" boolean DEFAULT false;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "programs_id" integer;
  ALTER TABLE "programs" ADD CONSTRAINT "programs_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs" ADD CONSTRAINT "programs_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs" ADD CONSTRAINT "programs_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v" ADD CONSTRAINT "_programs_v_parent_id_programs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."programs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v" ADD CONSTRAINT "_programs_v_version_school_id_schools_id_fk" FOREIGN KEY ("version_school_id") REFERENCES "public"."schools"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v" ADD CONSTRAINT "_programs_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v" ADD CONSTRAINT "_programs_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "programs__order_idx" ON "programs" USING btree ("_order");
  CREATE INDEX "programs_school_idx" ON "programs" USING btree ("school_id");
  CREATE INDEX "programs_slug_idx" ON "programs" USING btree ("slug");
  CREATE INDEX "programs_image_idx" ON "programs" USING btree ("image_id");
  CREATE INDEX "programs_meta_meta_image_idx" ON "programs" USING btree ("meta_image_id");
  CREATE INDEX "programs_updated_at_idx" ON "programs" USING btree ("updated_at");
  CREATE INDEX "programs_created_at_idx" ON "programs" USING btree ("created_at");
  CREATE INDEX "programs__status_idx" ON "programs" USING btree ("_status");
  CREATE UNIQUE INDEX "school_slug_3_idx" ON "programs" USING btree ("school_id","slug");
  CREATE INDEX "_programs_v_parent_idx" ON "_programs_v" USING btree ("parent_id");
  CREATE INDEX "_programs_v_version_version__order_idx" ON "_programs_v" USING btree ("version__order");
  CREATE INDEX "_programs_v_version_version_school_idx" ON "_programs_v" USING btree ("version_school_id");
  CREATE INDEX "_programs_v_version_version_slug_idx" ON "_programs_v" USING btree ("version_slug");
  CREATE INDEX "_programs_v_version_version_image_idx" ON "_programs_v" USING btree ("version_image_id");
  CREATE INDEX "_programs_v_version_meta_version_meta_image_idx" ON "_programs_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_programs_v_version_version_updated_at_idx" ON "_programs_v" USING btree ("version_updated_at");
  CREATE INDEX "_programs_v_version_version_created_at_idx" ON "_programs_v" USING btree ("version_created_at");
  CREATE INDEX "_programs_v_version_version__status_idx" ON "_programs_v" USING btree ("version__status");
  CREATE INDEX "_programs_v_created_at_idx" ON "_programs_v" USING btree ("created_at");
  CREATE INDEX "_programs_v_updated_at_idx" ON "_programs_v" USING btree ("updated_at");
  CREATE INDEX "_programs_v_latest_idx" ON "_programs_v" USING btree ("latest");
  CREATE INDEX "_programs_v_autosave_idx" ON "_programs_v" USING btree ("autosave");
  CREATE INDEX "version_school_version_slug_3_idx" ON "_programs_v" USING btree ("version_school_id","version_slug");
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_programs_fk" FOREIGN KEY ("programs_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_programs_fk" FOREIGN KEY ("programs_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_programs_fk" FOREIGN KEY ("programs_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "redirects_rels_programs_id_idx" ON "redirects_rels" USING btree ("programs_id");
  CREATE INDEX "search_rels_programs_id_idx" ON "search_rels" USING btree ("programs_id");
  CREATE UNIQUE INDEX "school_slug_4_idx" ON "news_categories" USING btree ("school_id","slug");
  CREATE INDEX "payload_locked_documents_rels_programs_id_idx" ON "payload_locked_documents_rels" USING btree ("programs_id");
  ALTER TABLE "pages" DROP COLUMN "is_program";
  ALTER TABLE "pages" DROP COLUMN "program_grades";
  ALTER TABLE "pages" DROP COLUMN "program_summary";
  ALTER TABLE "pages" DROP COLUMN "program_image_id";
  ALTER TABLE "pages" DROP COLUMN "program_order";
  ALTER TABLE "_pages_v" DROP COLUMN "version_is_program";
  ALTER TABLE "_pages_v" DROP COLUMN "version_program_grades";
  ALTER TABLE "_pages_v" DROP COLUMN "version_program_summary";
  ALTER TABLE "_pages_v" DROP COLUMN "version_program_image_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_program_order";`)
}
