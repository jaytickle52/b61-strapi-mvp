import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import { generateNKeysBetween } from 'payload/shared'

const NAME = '20261115_012311_school_features'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Preview deploys share the live database (see the handoff). If this
  // migration ran there under an earlier name (before a rebase re-created it),
  // everything below already exists: retire the old name and stop.
  const earlier: any = await db.execute(
    sql`SELECT "name" FROM "payload_migrations" WHERE "name" LIKE '%_school_features' AND "name" <> ${NAME}`,
  )
  if (earlier.rows?.length) {
    await db.execute(sql`DELETE FROM "payload_migrations" WHERE "name" LIKE '%_school_features' AND "name" <> ${NAME}`)
    payload.logger.info('[b61] school_features already applied under an earlier name; skipping')
    return
  }
  await db.execute(sql`
   CREATE TYPE "public"."enum_calendar_feeds_audience" AS ENUM('public', 'parents');
  CREATE TYPE "public"."enum_announcements_button_link_type" AS ENUM('page', 'document', 'url');
  CREATE TYPE "public"."enum_announcements_style" AS ENUM('standard', 'urgent', 'celebrate');
  CREATE TYPE "public"."enum_announcements_show_on" AS ENUM('all', 'home');
  CREATE TYPE "public"."enum_announcements_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__announcements_v_version_button_link_type" AS ENUM('page', 'document', 'url');
  CREATE TYPE "public"."enum__announcements_v_version_style" AS ENUM('standard', 'urgent', 'celebrate');
  CREATE TYPE "public"."enum__announcements_v_version_show_on" AS ENUM('all', 'home');
  CREATE TYPE "public"."enum__announcements_v_version_status" AS ENUM('draft', 'published');
  ALTER TYPE "public"."enum_payload_jobs_log_task_slug" ADD VALUE 'importCalendars' BEFORE 'schedulePublish';
  ALTER TYPE "public"."enum_payload_jobs_task_slug" ADD VALUE 'importCalendars' BEFORE 'schedulePublish';
  CREATE TABLE "calendar_feeds" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"school_id" integer,
  	"name" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"audience" "enum_calendar_feeds_audience" DEFAULT 'public' NOT NULL,
  	"active" boolean DEFAULT true,
  	"last_imported_at" timestamp(3) with time zone,
  	"last_result" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "news_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"news_categories_id" integer
  );
  
  CREATE TABLE "_news_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"news_categories_id" integer
  );
  
  CREATE TABLE "announcements" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"school_id" integer,
  	"title" varchar,
  	"message" varchar,
  	"button_label" varchar,
  	"button_link_type" "enum_announcements_button_link_type" DEFAULT 'page',
  	"button_link_page_id" integer,
  	"button_link_document_id" integer,
  	"button_link_url" varchar,
  	"button_link_new_tab" boolean,
  	"style" "enum_announcements_style" DEFAULT 'standard',
  	"starts_at" timestamp(3) with time zone,
  	"ends_at" timestamp(3) with time zone,
  	"show_on" "enum_announcements_show_on" DEFAULT 'all',
  	"dismissible" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_announcements_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_announcements_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_school_id" integer,
  	"version_title" varchar,
  	"version_message" varchar,
  	"version_button_label" varchar,
  	"version_button_link_type" "enum__announcements_v_version_button_link_type" DEFAULT 'page',
  	"version_button_link_page_id" integer,
  	"version_button_link_document_id" integer,
  	"version_button_link_url" varchar,
  	"version_button_link_new_tab" boolean,
  	"version_style" "enum__announcements_v_version_style" DEFAULT 'standard',
  	"version_starts_at" timestamp(3) with time zone,
  	"version_ends_at" timestamp(3) with time zone,
  	"version_show_on" "enum__announcements_v_version_show_on" DEFAULT 'all',
  	"version_dismissible" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__announcements_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "news_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"school_id" integer,
  	"name" varchar NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_jobs_stats" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"stats" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "events" ADD COLUMN "all_day" boolean DEFAULT false;
  ALTER TABLE "events" ADD COLUMN "imported_from_id" integer;
  ALTER TABLE "events" ADD COLUMN "import_uid" varchar;
  ALTER TABLE "events" ADD COLUMN "import_hash" varchar;
  ALTER TABLE "_events_v" ADD COLUMN "version_all_day" boolean DEFAULT false;
  ALTER TABLE "_events_v" ADD COLUMN "version_imported_from_id" integer;
  ALTER TABLE "_events_v" ADD COLUMN "version_import_uid" varchar;
  ALTER TABLE "_events_v" ADD COLUMN "version_import_hash" varchar;
  ALTER TABLE "programs" ADD COLUMN "_order" varchar;
  ALTER TABLE "_programs_v" ADD COLUMN "version__order" varchar;
  ALTER TABLE "staff" ADD COLUMN "_order" varchar;
  ALTER TABLE "_staff_v" ADD COLUMN "version__order" varchar;
  ALTER TABLE "payload_jobs" ADD COLUMN "meta" jsonb;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "calendar_feeds_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "announcements_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "news_categories_id" integer;
  ALTER TABLE "calendar_feeds" ADD CONSTRAINT "calendar_feeds_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_rels" ADD CONSTRAINT "news_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_rels" ADD CONSTRAINT "news_rels_news_categories_fk" FOREIGN KEY ("news_categories_id") REFERENCES "public"."news_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_rels" ADD CONSTRAINT "_news_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_news_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_rels" ADD CONSTRAINT "_news_v_rels_news_categories_fk" FOREIGN KEY ("news_categories_id") REFERENCES "public"."news_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "announcements" ADD CONSTRAINT "announcements_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "announcements" ADD CONSTRAINT "announcements_button_link_page_id_pages_id_fk" FOREIGN KEY ("button_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "announcements" ADD CONSTRAINT "announcements_button_link_document_id_documents_id_fk" FOREIGN KEY ("button_link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_announcements_v" ADD CONSTRAINT "_announcements_v_parent_id_announcements_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."announcements"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_announcements_v" ADD CONSTRAINT "_announcements_v_version_school_id_schools_id_fk" FOREIGN KEY ("version_school_id") REFERENCES "public"."schools"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_announcements_v" ADD CONSTRAINT "_announcements_v_version_button_link_page_id_pages_id_fk" FOREIGN KEY ("version_button_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_announcements_v" ADD CONSTRAINT "_announcements_v_version_button_link_document_id_documents_id_fk" FOREIGN KEY ("version_button_link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_categories" ADD CONSTRAINT "news_categories_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "calendar_feeds_school_idx" ON "calendar_feeds" USING btree ("school_id");
  CREATE INDEX "calendar_feeds_updated_at_idx" ON "calendar_feeds" USING btree ("updated_at");
  CREATE INDEX "calendar_feeds_created_at_idx" ON "calendar_feeds" USING btree ("created_at");
  CREATE INDEX "news_rels_order_idx" ON "news_rels" USING btree ("order");
  CREATE INDEX "news_rels_parent_idx" ON "news_rels" USING btree ("parent_id");
  CREATE INDEX "news_rels_path_idx" ON "news_rels" USING btree ("path");
  CREATE INDEX "news_rels_news_categories_id_idx" ON "news_rels" USING btree ("news_categories_id");
  CREATE INDEX "_news_v_rels_order_idx" ON "_news_v_rels" USING btree ("order");
  CREATE INDEX "_news_v_rels_parent_idx" ON "_news_v_rels" USING btree ("parent_id");
  CREATE INDEX "_news_v_rels_path_idx" ON "_news_v_rels" USING btree ("path");
  CREATE INDEX "_news_v_rels_news_categories_id_idx" ON "_news_v_rels" USING btree ("news_categories_id");
  CREATE INDEX "announcements_school_idx" ON "announcements" USING btree ("school_id");
  CREATE INDEX "announcements_button_link_button_link_page_idx" ON "announcements" USING btree ("button_link_page_id");
  CREATE INDEX "announcements_button_link_button_link_document_idx" ON "announcements" USING btree ("button_link_document_id");
  CREATE INDEX "announcements_updated_at_idx" ON "announcements" USING btree ("updated_at");
  CREATE INDEX "announcements_created_at_idx" ON "announcements" USING btree ("created_at");
  CREATE INDEX "announcements__status_idx" ON "announcements" USING btree ("_status");
  CREATE INDEX "_announcements_v_parent_idx" ON "_announcements_v" USING btree ("parent_id");
  CREATE INDEX "_announcements_v_version_version_school_idx" ON "_announcements_v" USING btree ("version_school_id");
  CREATE INDEX "_announcements_v_version_button_link_version_button_link_idx" ON "_announcements_v" USING btree ("version_button_link_page_id");
  CREATE INDEX "_announcements_v_version_button_link_version_button_li_1_idx" ON "_announcements_v" USING btree ("version_button_link_document_id");
  CREATE INDEX "_announcements_v_version_version_updated_at_idx" ON "_announcements_v" USING btree ("version_updated_at");
  CREATE INDEX "_announcements_v_version_version_created_at_idx" ON "_announcements_v" USING btree ("version_created_at");
  CREATE INDEX "_announcements_v_version_version__status_idx" ON "_announcements_v" USING btree ("version__status");
  CREATE INDEX "_announcements_v_created_at_idx" ON "_announcements_v" USING btree ("created_at");
  CREATE INDEX "_announcements_v_updated_at_idx" ON "_announcements_v" USING btree ("updated_at");
  CREATE INDEX "_announcements_v_latest_idx" ON "_announcements_v" USING btree ("latest");
  CREATE INDEX "_announcements_v_autosave_idx" ON "_announcements_v" USING btree ("autosave");
  CREATE INDEX "news_categories__order_idx" ON "news_categories" USING btree ("_order");
  CREATE INDEX "news_categories_school_idx" ON "news_categories" USING btree ("school_id");
  CREATE INDEX "news_categories_slug_idx" ON "news_categories" USING btree ("slug");
  CREATE INDEX "news_categories_updated_at_idx" ON "news_categories" USING btree ("updated_at");
  CREATE INDEX "news_categories_created_at_idx" ON "news_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "school_slug_4_idx" ON "news_categories" USING btree ("school_id","slug");
  ALTER TABLE "events" ADD CONSTRAINT "events_imported_from_id_calendar_feeds_id_fk" FOREIGN KEY ("imported_from_id") REFERENCES "public"."calendar_feeds"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_imported_from_id_calendar_feeds_id_fk" FOREIGN KEY ("version_imported_from_id") REFERENCES "public"."calendar_feeds"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_calendar_feeds_fk" FOREIGN KEY ("calendar_feeds_id") REFERENCES "public"."calendar_feeds"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_announcements_fk" FOREIGN KEY ("announcements_id") REFERENCES "public"."announcements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_categories_fk" FOREIGN KEY ("news_categories_id") REFERENCES "public"."news_categories"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "events_imported_from_idx" ON "events" USING btree ("imported_from_id");
  CREATE INDEX "events_import_uid_idx" ON "events" USING btree ("import_uid");
  CREATE INDEX "_events_v_version_version_imported_from_idx" ON "_events_v" USING btree ("version_imported_from_id");
  CREATE INDEX "_events_v_version_version_import_uid_idx" ON "_events_v" USING btree ("version_import_uid");
  CREATE INDEX "programs__order_idx" ON "programs" USING btree ("_order");
  CREATE INDEX "_programs_v_version_version__order_idx" ON "_programs_v" USING btree ("version__order");
  CREATE INDEX "staff__order_idx" ON "staff" USING btree ("_order");
  CREATE INDEX "_staff_v_version_version__order_idx" ON "_staff_v" USING btree ("version__order");
  CREATE INDEX "payload_locked_documents_rels_calendar_feeds_id_idx" ON "payload_locked_documents_rels" USING btree ("calendar_feeds_id");
  CREATE INDEX "payload_locked_documents_rels_announcements_id_idx" ON "payload_locked_documents_rels" USING btree ("announcements_id");
  CREATE INDEX "payload_locked_documents_rels_news_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("news_categories_id");`)

  // Staff and programs are now ordered by dragging (_order). Give every
  // existing row a place in its old "Sort order", so nothing moves.
  for (const table of ['staff', 'programs']) {
    const rows: any = await db.execute(
      sql.raw(`SELECT "id" FROM "${table}" WHERE "_order" IS NULL ORDER BY "school_id", "sort_order" NULLS LAST, "id"`),
    )
    const ids: number[] = (rows.rows ?? []).map((r: any) => r.id)
    if (!ids.length) continue
    const last: any = await db.execute(sql.raw(`SELECT max("_order") AS "max" FROM "${table}"`))
    const keys = generateNKeysBetween(last.rows?.[0]?.max ?? null, null, ids.length)
    for (let i = 0; i < ids.length; i++) {
      await db.execute(sql.raw(`UPDATE "${table}" SET "_order" = '${keys[i]}' WHERE "id" = ${Number(ids[i])}`))
    }
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "calendar_feeds" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "news_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_news_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "announcements" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_announcements_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "news_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_jobs_stats" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "calendar_feeds" CASCADE;
  DROP TABLE "news_rels" CASCADE;
  DROP TABLE "_news_v_rels" CASCADE;
  DROP TABLE "announcements" CASCADE;
  DROP TABLE "_announcements_v" CASCADE;
  DROP TABLE "news_categories" CASCADE;
  DROP TABLE "payload_jobs_stats" CASCADE;
  ALTER TABLE "events" DROP CONSTRAINT "events_imported_from_id_calendar_feeds_id_fk";
  
  ALTER TABLE "_events_v" DROP CONSTRAINT "_events_v_version_imported_from_id_calendar_feeds_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_calendar_feeds_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_announcements_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_news_categories_fk";
  
  ALTER TABLE "payload_jobs_log" ALTER COLUMN "task_slug" SET DATA TYPE text;
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  ALTER TABLE "payload_jobs_log" ALTER COLUMN "task_slug" SET DATA TYPE "public"."enum_payload_jobs_log_task_slug" USING "task_slug"::"public"."enum_payload_jobs_log_task_slug";
  ALTER TABLE "payload_jobs" ALTER COLUMN "task_slug" SET DATA TYPE text;
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  ALTER TABLE "payload_jobs" ALTER COLUMN "task_slug" SET DATA TYPE "public"."enum_payload_jobs_task_slug" USING "task_slug"::"public"."enum_payload_jobs_task_slug";
  DROP INDEX "events_imported_from_idx";
  DROP INDEX "events_import_uid_idx";
  DROP INDEX "_events_v_version_version_imported_from_idx";
  DROP INDEX "_events_v_version_version_import_uid_idx";
  DROP INDEX "programs__order_idx";
  DROP INDEX "_programs_v_version_version__order_idx";
  DROP INDEX "staff__order_idx";
  DROP INDEX "_staff_v_version_version__order_idx";
  DROP INDEX "payload_locked_documents_rels_calendar_feeds_id_idx";
  DROP INDEX "payload_locked_documents_rels_announcements_id_idx";
  DROP INDEX "payload_locked_documents_rels_news_categories_id_idx";
  ALTER TABLE "events" DROP COLUMN "all_day";
  ALTER TABLE "events" DROP COLUMN "imported_from_id";
  ALTER TABLE "events" DROP COLUMN "import_uid";
  ALTER TABLE "events" DROP COLUMN "import_hash";
  ALTER TABLE "_events_v" DROP COLUMN "version_all_day";
  ALTER TABLE "_events_v" DROP COLUMN "version_imported_from_id";
  ALTER TABLE "_events_v" DROP COLUMN "version_import_uid";
  ALTER TABLE "_events_v" DROP COLUMN "version_import_hash";
  ALTER TABLE "programs" DROP COLUMN "_order";
  ALTER TABLE "_programs_v" DROP COLUMN "version__order";
  ALTER TABLE "staff" DROP COLUMN "_order";
  ALTER TABLE "_staff_v" DROP COLUMN "version__order";
  ALTER TABLE "payload_jobs" DROP COLUMN "meta";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "calendar_feeds_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "announcements_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "news_categories_id";
  DROP TYPE "public"."enum_calendar_feeds_audience";
  DROP TYPE "public"."enum_announcements_button_link_type";
  DROP TYPE "public"."enum_announcements_style";
  DROP TYPE "public"."enum_announcements_show_on";
  DROP TYPE "public"."enum_announcements_status";
  DROP TYPE "public"."enum__announcements_v_version_button_link_type";
  DROP TYPE "public"."enum__announcements_v_version_style";
  DROP TYPE "public"."enum__announcements_v_version_show_on";
  DROP TYPE "public"."enum__announcements_v_version_status";`)
}
