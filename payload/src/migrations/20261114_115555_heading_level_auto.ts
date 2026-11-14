import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_pages_blocks_b61_hero_heading_level" ADD VALUE 'auto' BEFORE 'h1';
  ALTER TYPE "public"."enum__pages_v_blocks_b61_hero_heading_level" ADD VALUE 'auto' BEFORE 'h1';`)
  // The column default stays as it was: Postgres cannot use a new enum value in
  // the same transaction that adds it, and Payload applies the field default
  // ('auto') itself when a hero is created.
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_b61_hero" ALTER COLUMN "heading_level" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_b61_hero" ALTER COLUMN "heading_level" SET DEFAULT 'h1'::text;
  DROP TYPE "public"."enum_pages_blocks_b61_hero_heading_level";
  CREATE TYPE "public"."enum_pages_blocks_b61_hero_heading_level" AS ENUM('h1', 'h2', 'h3');
  ALTER TABLE "pages_blocks_b61_hero" ALTER COLUMN "heading_level" SET DEFAULT 'h1'::"public"."enum_pages_blocks_b61_hero_heading_level";
  ALTER TABLE "pages_blocks_b61_hero" ALTER COLUMN "heading_level" SET DATA TYPE "public"."enum_pages_blocks_b61_hero_heading_level" USING "heading_level"::"public"."enum_pages_blocks_b61_hero_heading_level";
  ALTER TABLE "_pages_v_blocks_b61_hero" ALTER COLUMN "heading_level" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_b61_hero" ALTER COLUMN "heading_level" SET DEFAULT 'h1'::text;
  DROP TYPE "public"."enum__pages_v_blocks_b61_hero_heading_level";
  CREATE TYPE "public"."enum__pages_v_blocks_b61_hero_heading_level" AS ENUM('h1', 'h2', 'h3');
  ALTER TABLE "_pages_v_blocks_b61_hero" ALTER COLUMN "heading_level" SET DEFAULT 'h1'::"public"."enum__pages_v_blocks_b61_hero_heading_level";
  ALTER TABLE "_pages_v_blocks_b61_hero" ALTER COLUMN "heading_level" SET DATA TYPE "public"."enum__pages_v_blocks_b61_hero_heading_level" USING "heading_level"::"public"."enum__pages_v_blocks_b61_hero_heading_level";`)
}
