import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_b61_hero_split_side" AS ENUM('right', 'left');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_hero_split_side" AS ENUM('right', 'left');
  CREATE TYPE "public"."enum_school_settings_style_header" AS ENUM('classic', 'centred', 'overlay');
  CREATE TYPE "public"."enum_school_settings_style_footer" AS ENUM('classic', 'wordmark');
  CREATE TYPE "public"."enum__school_settings_v_version_style_header" AS ENUM('classic', 'centred', 'overlay');
  CREATE TYPE "public"."enum__school_settings_v_version_style_footer" AS ENUM('classic', 'wordmark');
  ALTER TYPE "public"."enum_pages_blocks_b61_hero_layout_mode" ADD VALUE 'split';
  ALTER TYPE "public"."enum_pages_blocks_b61_hero_layout_mode" ADD VALUE 'type';
  ALTER TYPE "public"."enum__pages_v_blocks_b61_hero_layout_mode" ADD VALUE 'split';
  ALTER TYPE "public"."enum__pages_v_blocks_b61_hero_layout_mode" ADD VALUE 'type';
  ALTER TABLE "pages_blocks_b61_hero" ADD COLUMN "split_side" "enum_pages_blocks_b61_hero_split_side" DEFAULT 'right';
  ALTER TABLE "_pages_v_blocks_b61_hero" ADD COLUMN "split_side" "enum__pages_v_blocks_b61_hero_split_side" DEFAULT 'right';
  ALTER TABLE "school_settings" ADD COLUMN "style_header" "enum_school_settings_style_header";
  ALTER TABLE "school_settings" ADD COLUMN "style_footer" "enum_school_settings_style_footer";
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_style_header" "enum__school_settings_v_version_style_header";
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_style_footer" "enum__school_settings_v_version_style_footer";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_b61_hero" ALTER COLUMN "layout_mode" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_b61_hero" ALTER COLUMN "layout_mode" SET DEFAULT 'cover'::text;
  DROP TYPE "public"."enum_pages_blocks_b61_hero_layout_mode";
  CREATE TYPE "public"."enum_pages_blocks_b61_hero_layout_mode" AS ENUM('cover', 'band');
  ALTER TABLE "pages_blocks_b61_hero" ALTER COLUMN "layout_mode" SET DEFAULT 'cover'::"public"."enum_pages_blocks_b61_hero_layout_mode";
  ALTER TABLE "pages_blocks_b61_hero" ALTER COLUMN "layout_mode" SET DATA TYPE "public"."enum_pages_blocks_b61_hero_layout_mode" USING "layout_mode"::"public"."enum_pages_blocks_b61_hero_layout_mode";
  ALTER TABLE "_pages_v_blocks_b61_hero" ALTER COLUMN "layout_mode" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_b61_hero" ALTER COLUMN "layout_mode" SET DEFAULT 'cover'::text;
  DROP TYPE "public"."enum__pages_v_blocks_b61_hero_layout_mode";
  CREATE TYPE "public"."enum__pages_v_blocks_b61_hero_layout_mode" AS ENUM('cover', 'band');
  ALTER TABLE "_pages_v_blocks_b61_hero" ALTER COLUMN "layout_mode" SET DEFAULT 'cover'::"public"."enum__pages_v_blocks_b61_hero_layout_mode";
  ALTER TABLE "_pages_v_blocks_b61_hero" ALTER COLUMN "layout_mode" SET DATA TYPE "public"."enum__pages_v_blocks_b61_hero_layout_mode" USING "layout_mode"::"public"."enum__pages_v_blocks_b61_hero_layout_mode";
  ALTER TABLE "pages_blocks_b61_hero" DROP COLUMN "split_side";
  ALTER TABLE "_pages_v_blocks_b61_hero" DROP COLUMN "split_side";
  ALTER TABLE "school_settings" DROP COLUMN "style_header";
  ALTER TABLE "school_settings" DROP COLUMN "style_footer";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_style_header";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_style_footer";
  DROP TYPE "public"."enum_pages_blocks_b61_hero_split_side";
  DROP TYPE "public"."enum__pages_v_blocks_b61_hero_split_side";
  DROP TYPE "public"."enum_school_settings_style_header";
  DROP TYPE "public"."enum_school_settings_style_footer";
  DROP TYPE "public"."enum__school_settings_v_version_style_header";
  DROP TYPE "public"."enum__school_settings_v_version_style_footer";`)
}
