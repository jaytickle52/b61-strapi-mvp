import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import { splitAddress } from '../school/fields'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_school_settings_office_days" AS ENUM('Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su');
  CREATE TYPE "public"."enum__school_settings_v_version_office_days" AS ENUM('Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su');
  ALTER TYPE "public"."enum_pages_blocks_b61_card_grid_source" ADD VALUE 'school-facts';
  ALTER TYPE "public"."enum__pages_v_blocks_b61_card_grid_source" ADD VALUE 'school-facts';
  CREATE TABLE "school_settings_office_days" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_school_settings_office_days",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "school_settings_accreditations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "school_settings_memberships" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "school_settings_profiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "_school_settings_v_version_office_days" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__school_settings_v_version_office_days",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_school_settings_v_version_accreditations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_school_settings_v_version_memberships" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_school_settings_v_version_profiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "pages_blocks_b61_accordion" ADD COLUMN "faq" boolean;
  ALTER TABLE "_pages_v_blocks_b61_accordion" ADD COLUMN "faq" boolean;
  ALTER TABLE "school_settings" ADD COLUMN "street" varchar;
  ALTER TABLE "school_settings" ADD COLUMN "city" varchar;
  ALTER TABLE "school_settings" ADD COLUMN "state" varchar;
  ALTER TABLE "school_settings" ADD COLUMN "postal_code" varchar;
  ALTER TABLE "school_settings" ADD COLUMN "latitude" numeric;
  ALTER TABLE "school_settings" ADD COLUMN "longitude" numeric;
  ALTER TABLE "school_settings" ADD COLUMN "office_opens" varchar;
  ALTER TABLE "school_settings" ADD COLUMN "office_closes" varchar;
  ALTER TABLE "school_settings" ADD COLUMN "short_name" varchar;
  ALTER TABLE "school_settings" ADD COLUMN "grades" varchar;
  ALTER TABLE "school_settings" ADD COLUMN "founded_year" numeric;
  ALTER TABLE "school_settings" ADD COLUMN "enrollment" numeric;
  ALTER TABLE "school_settings" ADD COLUMN "student_teacher_ratio" varchar;
  ALTER TABLE "school_settings" ADD COLUMN "denomination" varchar;
  ALTER TABLE "school_settings" ADD COLUMN "transportation" varchar;
  ALTER TABLE "school_settings" ADD COLUMN "church_name" varchar;
  ALTER TABLE "school_settings" ADD COLUMN "church_url" varchar;
  ALTER TABLE "school_settings" ADD COLUMN "before_after_care" boolean;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_street" varchar;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_city" varchar;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_state" varchar;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_postal_code" varchar;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_latitude" numeric;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_longitude" numeric;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_office_opens" varchar;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_office_closes" varchar;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_short_name" varchar;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_grades" varchar;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_founded_year" numeric;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_enrollment" numeric;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_student_teacher_ratio" varchar;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_denomination" varchar;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_transportation" varchar;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_church_name" varchar;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_church_url" varchar;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_before_after_care" boolean;
  ALTER TABLE "school_settings_office_days" ADD CONSTRAINT "school_settings_office_days_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."school_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "school_settings_accreditations" ADD CONSTRAINT "school_settings_accreditations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."school_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "school_settings_memberships" ADD CONSTRAINT "school_settings_memberships_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."school_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "school_settings_profiles" ADD CONSTRAINT "school_settings_profiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."school_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_office_days" ADD CONSTRAINT "_school_settings_v_version_office_days_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_school_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_accreditations" ADD CONSTRAINT "_school_settings_v_version_accreditations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_school_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_memberships" ADD CONSTRAINT "_school_settings_v_version_memberships_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_school_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_profiles" ADD CONSTRAINT "_school_settings_v_version_profiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_school_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "school_settings_office_days_order_idx" ON "school_settings_office_days" USING btree ("order");
  CREATE INDEX "school_settings_office_days_parent_idx" ON "school_settings_office_days" USING btree ("parent_id");
  CREATE INDEX "school_settings_accreditations_order_idx" ON "school_settings_accreditations" USING btree ("_order");
  CREATE INDEX "school_settings_accreditations_parent_id_idx" ON "school_settings_accreditations" USING btree ("_parent_id");
  CREATE INDEX "school_settings_memberships_order_idx" ON "school_settings_memberships" USING btree ("_order");
  CREATE INDEX "school_settings_memberships_parent_id_idx" ON "school_settings_memberships" USING btree ("_parent_id");
  CREATE INDEX "school_settings_profiles_order_idx" ON "school_settings_profiles" USING btree ("_order");
  CREATE INDEX "school_settings_profiles_parent_id_idx" ON "school_settings_profiles" USING btree ("_parent_id");
  CREATE INDEX "_school_settings_v_version_office_days_order_idx" ON "_school_settings_v_version_office_days" USING btree ("order");
  CREATE INDEX "_school_settings_v_version_office_days_parent_idx" ON "_school_settings_v_version_office_days" USING btree ("parent_id");
  CREATE INDEX "_school_settings_v_version_accreditations_order_idx" ON "_school_settings_v_version_accreditations" USING btree ("_order");
  CREATE INDEX "_school_settings_v_version_accreditations_parent_id_idx" ON "_school_settings_v_version_accreditations" USING btree ("_parent_id");
  CREATE INDEX "_school_settings_v_version_memberships_order_idx" ON "_school_settings_v_version_memberships" USING btree ("_order");
  CREATE INDEX "_school_settings_v_version_memberships_parent_id_idx" ON "_school_settings_v_version_memberships" USING btree ("_parent_id");
  CREATE INDEX "_school_settings_v_version_profiles_order_idx" ON "_school_settings_v_version_profiles" USING btree ("_order");
  CREATE INDEX "_school_settings_v_version_profiles_parent_id_idx" ON "_school_settings_v_version_profiles" USING btree ("_parent_id");`)

  // The address was one block of text; it now has parts (street, city, state, ZIP)
  // and the block is built from them. Split each school's address into the parts,
  // in the live settings and in their saved versions (the editor opens the latest).
  const live = await db.execute(sql`SELECT "id", "address" FROM "school_settings" WHERE "address" IS NOT NULL AND "address" <> '' AND "street" IS NULL`)
  for (const row of (live as any).rows ?? []) {
    const a = splitAddress(row.address)
    await db.execute(
      sql`UPDATE "school_settings" SET "street" = ${a.street || null}, "city" = ${a.city || null}, "state" = ${a.state || null}, "postal_code" = ${a.postalCode || null} WHERE "id" = ${row.id}`,
    )
  }
  const versions = await db.execute(
    sql`SELECT "id", "version_address" FROM "_school_settings_v" WHERE "version_address" IS NOT NULL AND "version_address" <> '' AND "version_street" IS NULL`,
  )
  for (const row of (versions as any).rows ?? []) {
    const a = splitAddress(row.version_address)
    await db.execute(
      sql`UPDATE "_school_settings_v" SET "version_street" = ${a.street || null}, "version_city" = ${a.city || null}, "version_state" = ${a.state || null}, "version_postal_code" = ${a.postalCode || null} WHERE "id" = ${row.id}`,
    )
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "school_settings_office_days" CASCADE;
  DROP TABLE "school_settings_accreditations" CASCADE;
  DROP TABLE "school_settings_memberships" CASCADE;
  DROP TABLE "school_settings_profiles" CASCADE;
  DROP TABLE "_school_settings_v_version_office_days" CASCADE;
  DROP TABLE "_school_settings_v_version_accreditations" CASCADE;
  DROP TABLE "_school_settings_v_version_memberships" CASCADE;
  DROP TABLE "_school_settings_v_version_profiles" CASCADE;
  ALTER TABLE "pages_blocks_b61_card_grid" ALTER COLUMN "source" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_b61_card_grid" ALTER COLUMN "source" SET DEFAULT 'manual'::text;
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_source";
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_source" AS ENUM('manual', 'programs', 'upcoming-events', 'latest-news', 'staff');
  ALTER TABLE "pages_blocks_b61_card_grid" ALTER COLUMN "source" SET DEFAULT 'manual'::"public"."enum_pages_blocks_b61_card_grid_source";
  ALTER TABLE "pages_blocks_b61_card_grid" ALTER COLUMN "source" SET DATA TYPE "public"."enum_pages_blocks_b61_card_grid_source" USING "source"::"public"."enum_pages_blocks_b61_card_grid_source";
  ALTER TABLE "_pages_v_blocks_b61_card_grid" ALTER COLUMN "source" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_b61_card_grid" ALTER COLUMN "source" SET DEFAULT 'manual'::text;
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_source";
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_source" AS ENUM('manual', 'programs', 'upcoming-events', 'latest-news', 'staff');
  ALTER TABLE "_pages_v_blocks_b61_card_grid" ALTER COLUMN "source" SET DEFAULT 'manual'::"public"."enum__pages_v_blocks_b61_card_grid_source";
  ALTER TABLE "_pages_v_blocks_b61_card_grid" ALTER COLUMN "source" SET DATA TYPE "public"."enum__pages_v_blocks_b61_card_grid_source" USING "source"::"public"."enum__pages_v_blocks_b61_card_grid_source";
  ALTER TABLE "pages_blocks_b61_accordion" DROP COLUMN "faq";
  ALTER TABLE "_pages_v_blocks_b61_accordion" DROP COLUMN "faq";
  ALTER TABLE "school_settings" DROP COLUMN "street";
  ALTER TABLE "school_settings" DROP COLUMN "city";
  ALTER TABLE "school_settings" DROP COLUMN "state";
  ALTER TABLE "school_settings" DROP COLUMN "postal_code";
  ALTER TABLE "school_settings" DROP COLUMN "latitude";
  ALTER TABLE "school_settings" DROP COLUMN "longitude";
  ALTER TABLE "school_settings" DROP COLUMN "office_opens";
  ALTER TABLE "school_settings" DROP COLUMN "office_closes";
  ALTER TABLE "school_settings" DROP COLUMN "short_name";
  ALTER TABLE "school_settings" DROP COLUMN "grades";
  ALTER TABLE "school_settings" DROP COLUMN "founded_year";
  ALTER TABLE "school_settings" DROP COLUMN "enrollment";
  ALTER TABLE "school_settings" DROP COLUMN "student_teacher_ratio";
  ALTER TABLE "school_settings" DROP COLUMN "denomination";
  ALTER TABLE "school_settings" DROP COLUMN "transportation";
  ALTER TABLE "school_settings" DROP COLUMN "church_name";
  ALTER TABLE "school_settings" DROP COLUMN "church_url";
  ALTER TABLE "school_settings" DROP COLUMN "before_after_care";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_street";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_city";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_state";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_postal_code";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_latitude";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_longitude";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_office_opens";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_office_closes";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_short_name";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_grades";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_founded_year";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_enrollment";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_student_teacher_ratio";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_denomination";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_transportation";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_church_name";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_church_url";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_before_after_care";
  DROP TYPE "public"."enum_school_settings_office_days";
  DROP TYPE "public"."enum__school_settings_v_version_office_days";`)
}
