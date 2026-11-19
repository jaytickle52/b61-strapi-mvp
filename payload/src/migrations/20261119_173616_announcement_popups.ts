import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_announcements_popup_position" AS ENUM('center', 'corner');
  CREATE TYPE "public"."enum_announcements_popup_opens" AS ENUM('soon', 'later', 'scroll');
  CREATE TYPE "public"."enum_announcements_popup_repeat" AS ENUM('once', 'week', 'visit');
  CREATE TYPE "public"."enum__announcements_v_version_popup_position" AS ENUM('center', 'corner');
  CREATE TYPE "public"."enum__announcements_v_version_popup_opens" AS ENUM('soon', 'later', 'scroll');
  CREATE TYPE "public"."enum__announcements_v_version_popup_repeat" AS ENUM('once', 'week', 'visit');
  ALTER TYPE "public"."enum_announcements_show_on" ADD VALUE 'pages';
  ALTER TYPE "public"."enum__announcements_v_version_show_on" ADD VALUE 'pages';
  CREATE TABLE "announcements_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer
  );
  
  CREATE TABLE "_announcements_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer
  );
  
  ALTER TABLE "announcements" ADD COLUMN "popup_position" "enum_announcements_popup_position" DEFAULT 'center';
  ALTER TABLE "announcements" ADD COLUMN "popup_opens" "enum_announcements_popup_opens" DEFAULT 'soon';
  ALTER TABLE "announcements" ADD COLUMN "popup_repeat" "enum_announcements_popup_repeat" DEFAULT 'once';
  ALTER TABLE "announcements" ADD COLUMN "form_id" integer;
  ALTER TABLE "_announcements_v" ADD COLUMN "version_popup_position" "enum__announcements_v_version_popup_position" DEFAULT 'center';
  ALTER TABLE "_announcements_v" ADD COLUMN "version_popup_opens" "enum__announcements_v_version_popup_opens" DEFAULT 'soon';
  ALTER TABLE "_announcements_v" ADD COLUMN "version_popup_repeat" "enum__announcements_v_version_popup_repeat" DEFAULT 'once';
  ALTER TABLE "_announcements_v" ADD COLUMN "version_form_id" integer;
  ALTER TABLE "announcements_rels" ADD CONSTRAINT "announcements_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."announcements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "announcements_rels" ADD CONSTRAINT "announcements_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_announcements_v_rels" ADD CONSTRAINT "_announcements_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_announcements_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_announcements_v_rels" ADD CONSTRAINT "_announcements_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "announcements_rels_order_idx" ON "announcements_rels" USING btree ("order");
  CREATE INDEX "announcements_rels_parent_idx" ON "announcements_rels" USING btree ("parent_id");
  CREATE INDEX "announcements_rels_path_idx" ON "announcements_rels" USING btree ("path");
  CREATE INDEX "announcements_rels_pages_id_idx" ON "announcements_rels" USING btree ("pages_id");
  CREATE INDEX "_announcements_v_rels_order_idx" ON "_announcements_v_rels" USING btree ("order");
  CREATE INDEX "_announcements_v_rels_parent_idx" ON "_announcements_v_rels" USING btree ("parent_id");
  CREATE INDEX "_announcements_v_rels_path_idx" ON "_announcements_v_rels" USING btree ("path");
  CREATE INDEX "_announcements_v_rels_pages_id_idx" ON "_announcements_v_rels" USING btree ("pages_id");
  ALTER TABLE "announcements" ADD CONSTRAINT "announcements_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_announcements_v" ADD CONSTRAINT "_announcements_v_version_form_id_forms_id_fk" FOREIGN KEY ("version_form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "announcements_form_idx" ON "announcements" USING btree ("form_id");
  CREATE INDEX "_announcements_v_version_version_form_idx" ON "_announcements_v" USING btree ("version_form_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "announcements_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_announcements_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "announcements_rels" CASCADE;
  DROP TABLE "_announcements_v_rels" CASCADE;
  ALTER TABLE "announcements" DROP CONSTRAINT "announcements_form_id_forms_id_fk";
  
  ALTER TABLE "_announcements_v" DROP CONSTRAINT "_announcements_v_version_form_id_forms_id_fk";
  
  ALTER TABLE "announcements" ALTER COLUMN "show_on" SET DATA TYPE text;
  ALTER TABLE "announcements" ALTER COLUMN "show_on" SET DEFAULT 'all'::text;
  DROP TYPE "public"."enum_announcements_show_on";
  CREATE TYPE "public"."enum_announcements_show_on" AS ENUM('all', 'home');
  ALTER TABLE "announcements" ALTER COLUMN "show_on" SET DEFAULT 'all'::"public"."enum_announcements_show_on";
  ALTER TABLE "announcements" ALTER COLUMN "show_on" SET DATA TYPE "public"."enum_announcements_show_on" USING "show_on"::"public"."enum_announcements_show_on";
  ALTER TABLE "_announcements_v" ALTER COLUMN "version_show_on" SET DATA TYPE text;
  ALTER TABLE "_announcements_v" ALTER COLUMN "version_show_on" SET DEFAULT 'all'::text;
  DROP TYPE "public"."enum__announcements_v_version_show_on";
  CREATE TYPE "public"."enum__announcements_v_version_show_on" AS ENUM('all', 'home');
  ALTER TABLE "_announcements_v" ALTER COLUMN "version_show_on" SET DEFAULT 'all'::"public"."enum__announcements_v_version_show_on";
  ALTER TABLE "_announcements_v" ALTER COLUMN "version_show_on" SET DATA TYPE "public"."enum__announcements_v_version_show_on" USING "version_show_on"::"public"."enum__announcements_v_version_show_on";
  DROP INDEX "announcements_form_idx";
  DROP INDEX "_announcements_v_version_version_form_idx";
  ALTER TABLE "announcements" DROP COLUMN "popup_position";
  ALTER TABLE "announcements" DROP COLUMN "popup_opens";
  ALTER TABLE "announcements" DROP COLUMN "popup_repeat";
  ALTER TABLE "announcements" DROP COLUMN "form_id";
  ALTER TABLE "_announcements_v" DROP COLUMN "version_popup_position";
  ALTER TABLE "_announcements_v" DROP COLUMN "version_popup_opens";
  ALTER TABLE "_announcements_v" DROP COLUMN "version_popup_repeat";
  ALTER TABLE "_announcements_v" DROP COLUMN "version_form_id";
  DROP TYPE "public"."enum_announcements_popup_position";
  DROP TYPE "public"."enum_announcements_popup_opens";
  DROP TYPE "public"."enum_announcements_popup_repeat";
  DROP TYPE "public"."enum__announcements_v_version_popup_position";
  DROP TYPE "public"."enum__announcements_v_version_popup_opens";
  DROP TYPE "public"."enum__announcements_v_version_popup_repeat";`)
}
