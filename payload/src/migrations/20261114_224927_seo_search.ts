import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_redirects_to_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_redirects_type" AS ENUM('301', '302');
  CREATE TABLE "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"school_id" integer,
  	"from" varchar NOT NULL,
  	"to_type" "enum_redirects_to_type" DEFAULT 'reference',
  	"to_url" varchar,
  	"type" "enum_redirects_type" NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"news_id" integer,
  	"events_id" integer,
  	"programs_id" integer
  );
  
  CREATE TABLE "search" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"school_id" integer,
  	"title" varchar,
  	"priority" numeric,
  	"url" varchar,
  	"summary" varchar,
  	"text" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "search_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"news_id" integer,
  	"events_id" integer,
  	"programs_id" integer
  );
  
  ALTER TABLE "pages" ADD COLUMN "library_version" numeric;
  ALTER TABLE "pages" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "pages" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "pages" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "pages" ADD COLUMN "meta_noindex" boolean;
  ALTER TABLE "_pages_v" ADD COLUMN "version_library_version" numeric;
  ALTER TABLE "_pages_v" ADD COLUMN "version_meta_title" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_meta_description" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_meta_image_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_meta_noindex" boolean;
  ALTER TABLE "events" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "events" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "events" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "events" ADD COLUMN "meta_noindex" boolean;
  ALTER TABLE "_events_v" ADD COLUMN "version_meta_title" varchar;
  ALTER TABLE "_events_v" ADD COLUMN "version_meta_description" varchar;
  ALTER TABLE "_events_v" ADD COLUMN "version_meta_image_id" integer;
  ALTER TABLE "_events_v" ADD COLUMN "version_meta_noindex" boolean;
  ALTER TABLE "news" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "news" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "news" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "news" ADD COLUMN "meta_noindex" boolean;
  ALTER TABLE "_news_v" ADD COLUMN "version_meta_title" varchar;
  ALTER TABLE "_news_v" ADD COLUMN "version_meta_description" varchar;
  ALTER TABLE "_news_v" ADD COLUMN "version_meta_image_id" integer;
  ALTER TABLE "_news_v" ADD COLUMN "version_meta_noindex" boolean;
  ALTER TABLE "programs" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "programs" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "programs" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "programs" ADD COLUMN "meta_noindex" boolean;
  ALTER TABLE "_programs_v" ADD COLUMN "version_meta_title" varchar;
  ALTER TABLE "_programs_v" ADD COLUMN "version_meta_description" varchar;
  ALTER TABLE "_programs_v" ADD COLUMN "version_meta_image_id" integer;
  ALTER TABLE "_programs_v" ADD COLUMN "version_meta_noindex" boolean;
  ALTER TABLE "school_settings" ADD COLUMN "share_image_id" integer;
  ALTER TABLE "school_settings" ADD COLUMN "google_verification" varchar;
  ALTER TABLE "school_settings" ADD COLUMN "hide_from_search" boolean;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_share_image_id" integer;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_google_verification" varchar;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_hide_from_search" boolean;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "redirects_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "search_id" integer;
  ALTER TABLE "redirects" ADD CONSTRAINT "redirects_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_programs_fk" FOREIGN KEY ("programs_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search" ADD CONSTRAINT "search_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_programs_fk" FOREIGN KEY ("programs_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "redirects_school_idx" ON "redirects" USING btree ("school_id");
  CREATE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE UNIQUE INDEX "school_from_idx" ON "redirects" USING btree ("school_id","from");
  CREATE INDEX "redirects_rels_order_idx" ON "redirects_rels" USING btree ("order");
  CREATE INDEX "redirects_rels_parent_idx" ON "redirects_rels" USING btree ("parent_id");
  CREATE INDEX "redirects_rels_path_idx" ON "redirects_rels" USING btree ("path");
  CREATE INDEX "redirects_rels_pages_id_idx" ON "redirects_rels" USING btree ("pages_id");
  CREATE INDEX "redirects_rels_news_id_idx" ON "redirects_rels" USING btree ("news_id");
  CREATE INDEX "redirects_rels_events_id_idx" ON "redirects_rels" USING btree ("events_id");
  CREATE INDEX "redirects_rels_programs_id_idx" ON "redirects_rels" USING btree ("programs_id");
  CREATE INDEX "search_school_idx" ON "search" USING btree ("school_id");
  CREATE INDEX "search_updated_at_idx" ON "search" USING btree ("updated_at");
  CREATE INDEX "search_created_at_idx" ON "search" USING btree ("created_at");
  CREATE INDEX "search_rels_order_idx" ON "search_rels" USING btree ("order");
  CREATE INDEX "search_rels_parent_idx" ON "search_rels" USING btree ("parent_id");
  CREATE INDEX "search_rels_path_idx" ON "search_rels" USING btree ("path");
  CREATE INDEX "search_rels_pages_id_idx" ON "search_rels" USING btree ("pages_id");
  CREATE INDEX "search_rels_news_id_idx" ON "search_rels" USING btree ("news_id");
  CREATE INDEX "search_rels_events_id_idx" ON "search_rels" USING btree ("events_id");
  CREATE INDEX "search_rels_programs_id_idx" ON "search_rels" USING btree ("programs_id");
  ALTER TABLE "pages" ADD CONSTRAINT "pages_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs" ADD CONSTRAINT "programs_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v" ADD CONSTRAINT "_programs_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "school_settings" ADD CONSTRAINT "school_settings_share_image_id_media_id_fk" FOREIGN KEY ("share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_school_settings_v" ADD CONSTRAINT "_school_settings_v_version_share_image_id_media_id_fk" FOREIGN KEY ("version_share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_search_fk" FOREIGN KEY ("search_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages" USING btree ("meta_image_id");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v" USING btree ("version_meta_image_id");
  CREATE INDEX "events_meta_meta_image_idx" ON "events" USING btree ("meta_image_id");
  CREATE INDEX "_events_v_version_meta_version_meta_image_idx" ON "_events_v" USING btree ("version_meta_image_id");
  CREATE INDEX "news_meta_meta_image_idx" ON "news" USING btree ("meta_image_id");
  CREATE INDEX "_news_v_version_meta_version_meta_image_idx" ON "_news_v" USING btree ("version_meta_image_id");
  CREATE INDEX "programs_meta_meta_image_idx" ON "programs" USING btree ("meta_image_id");
  CREATE INDEX "_programs_v_version_meta_version_meta_image_idx" ON "_programs_v" USING btree ("version_meta_image_id");
  CREATE INDEX "school_settings_share_image_idx" ON "school_settings" USING btree ("share_image_id");
  CREATE INDEX "_school_settings_v_version_version_share_image_idx" ON "_school_settings_v" USING btree ("version_share_image_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "payload_locked_documents_rels_search_id_idx" ON "payload_locked_documents_rels" USING btree ("search_id");
  ALTER TABLE "redirects" ALTER COLUMN "type" SET DEFAULT '301';
  -- Versions whose page was deleted outside the editor; they show up as blank drafts.
  DELETE FROM "_pages_v" WHERE "parent_id" IS NULL;
  DELETE FROM "_events_v" WHERE "parent_id" IS NULL;
  DELETE FROM "_news_v" WHERE "parent_id" IS NULL;
  DELETE FROM "_programs_v" WHERE "parent_id" IS NULL;
  DELETE FROM "_staff_v" WHERE "parent_id" IS NULL;
  DELETE FROM "_school_settings_v" WHERE "parent_id" IS NULL;
  UPDATE "pages" SET "meta_description" = "seo_description" WHERE "seo_description" IS NOT NULL;
  UPDATE "_pages_v" SET "version_meta_description" = "version_seo_description" WHERE "version_seo_description" IS NOT NULL;
  ALTER TABLE "pages" DROP COLUMN "seo_description";
  ALTER TABLE "_pages_v" DROP COLUMN "version_seo_description";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "redirects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "redirects_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "search" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "search_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "redirects_rels" CASCADE;
  DROP TABLE "search" CASCADE;
  DROP TABLE "search_rels" CASCADE;
  ALTER TABLE "pages" DROP CONSTRAINT "pages_meta_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_meta_image_id_media_id_fk";
  
  ALTER TABLE "events" DROP CONSTRAINT "events_meta_image_id_media_id_fk";
  
  ALTER TABLE "_events_v" DROP CONSTRAINT "_events_v_version_meta_image_id_media_id_fk";
  
  ALTER TABLE "news" DROP CONSTRAINT "news_meta_image_id_media_id_fk";
  
  ALTER TABLE "_news_v" DROP CONSTRAINT "_news_v_version_meta_image_id_media_id_fk";
  
  ALTER TABLE "programs" DROP CONSTRAINT "programs_meta_image_id_media_id_fk";
  
  ALTER TABLE "_programs_v" DROP CONSTRAINT "_programs_v_version_meta_image_id_media_id_fk";
  
  ALTER TABLE "school_settings" DROP CONSTRAINT "school_settings_share_image_id_media_id_fk";
  
  ALTER TABLE "_school_settings_v" DROP CONSTRAINT "_school_settings_v_version_share_image_id_media_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_redirects_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_search_fk";
  
  DROP INDEX "pages_meta_meta_image_idx";
  DROP INDEX "_pages_v_version_meta_version_meta_image_idx";
  DROP INDEX "events_meta_meta_image_idx";
  DROP INDEX "_events_v_version_meta_version_meta_image_idx";
  DROP INDEX "news_meta_meta_image_idx";
  DROP INDEX "_news_v_version_meta_version_meta_image_idx";
  DROP INDEX "programs_meta_meta_image_idx";
  DROP INDEX "_programs_v_version_meta_version_meta_image_idx";
  DROP INDEX "school_settings_share_image_idx";
  DROP INDEX "_school_settings_v_version_version_share_image_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_redirects_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_search_id_idx";
  ALTER TABLE "pages" ADD COLUMN "seo_description" varchar;
  ALTER TABLE "_pages_v" ADD COLUMN "version_seo_description" varchar;
  UPDATE "pages" SET "seo_description" = "meta_description";
  UPDATE "_pages_v" SET "version_seo_description" = "version_meta_description";
  ALTER TABLE "pages" DROP COLUMN "library_version";
  ALTER TABLE "pages" DROP COLUMN "meta_title";
  ALTER TABLE "pages" DROP COLUMN "meta_description";
  ALTER TABLE "pages" DROP COLUMN "meta_image_id";
  ALTER TABLE "pages" DROP COLUMN "meta_noindex";
  ALTER TABLE "_pages_v" DROP COLUMN "version_library_version";
  ALTER TABLE "_pages_v" DROP COLUMN "version_meta_title";
  ALTER TABLE "_pages_v" DROP COLUMN "version_meta_description";
  ALTER TABLE "_pages_v" DROP COLUMN "version_meta_image_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_meta_noindex";
  ALTER TABLE "events" DROP COLUMN "meta_title";
  ALTER TABLE "events" DROP COLUMN "meta_description";
  ALTER TABLE "events" DROP COLUMN "meta_image_id";
  ALTER TABLE "events" DROP COLUMN "meta_noindex";
  ALTER TABLE "_events_v" DROP COLUMN "version_meta_title";
  ALTER TABLE "_events_v" DROP COLUMN "version_meta_description";
  ALTER TABLE "_events_v" DROP COLUMN "version_meta_image_id";
  ALTER TABLE "_events_v" DROP COLUMN "version_meta_noindex";
  ALTER TABLE "news" DROP COLUMN "meta_title";
  ALTER TABLE "news" DROP COLUMN "meta_description";
  ALTER TABLE "news" DROP COLUMN "meta_image_id";
  ALTER TABLE "news" DROP COLUMN "meta_noindex";
  ALTER TABLE "_news_v" DROP COLUMN "version_meta_title";
  ALTER TABLE "_news_v" DROP COLUMN "version_meta_description";
  ALTER TABLE "_news_v" DROP COLUMN "version_meta_image_id";
  ALTER TABLE "_news_v" DROP COLUMN "version_meta_noindex";
  ALTER TABLE "programs" DROP COLUMN "meta_title";
  ALTER TABLE "programs" DROP COLUMN "meta_description";
  ALTER TABLE "programs" DROP COLUMN "meta_image_id";
  ALTER TABLE "programs" DROP COLUMN "meta_noindex";
  ALTER TABLE "_programs_v" DROP COLUMN "version_meta_title";
  ALTER TABLE "_programs_v" DROP COLUMN "version_meta_description";
  ALTER TABLE "_programs_v" DROP COLUMN "version_meta_image_id";
  ALTER TABLE "_programs_v" DROP COLUMN "version_meta_noindex";
  ALTER TABLE "school_settings" DROP COLUMN "share_image_id";
  ALTER TABLE "school_settings" DROP COLUMN "google_verification";
  ALTER TABLE "school_settings" DROP COLUMN "hide_from_search";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_share_image_id";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_google_verification";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_hide_from_search";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "redirects_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "search_id";
  DROP TYPE "public"."enum_redirects_to_type";
  DROP TYPE "public"."enum_redirects_type";`)
}
