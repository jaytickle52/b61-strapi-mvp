import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_pages_blocks_b61_card_grid_cards_icon" ADD VALUE IF NOT EXISTS 'question' BEFORE 'email';
  ALTER TYPE "public"."enum_pages_blocks_b61_rail_links_icon" ADD VALUE IF NOT EXISTS 'question' BEFORE 'email';
  ALTER TYPE "public"."enum__pages_v_blocks_b61_card_grid_cards_icon" ADD VALUE IF NOT EXISTS 'question' BEFORE 'email';
  ALTER TYPE "public"."enum__pages_v_blocks_b61_rail_links_icon" ADD VALUE IF NOT EXISTS 'question' BEFORE 'email';
  ALTER TYPE "public"."enum_school_settings_quick_links_icon" ADD VALUE IF NOT EXISTS 'question' BEFORE 'email';
  ALTER TYPE "public"."enum__school_settings_v_version_quick_links_icon" ADD VALUE IF NOT EXISTS 'question' BEFORE 'email';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_b61_card_grid_cards" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_b61_card_grid_cards" ALTER COLUMN "icon" SET DEFAULT 'star'::text;
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_cards_icon";
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_cards_icon" AS ENUM('check', 'email', 'phone', 'location', 'calendar', 'clock', 'link', 'star', 'heart', 'book', 'people', 'cross', 'school');
  ALTER TABLE "pages_blocks_b61_card_grid_cards" ALTER COLUMN "icon" SET DEFAULT 'star'::"public"."enum_pages_blocks_b61_card_grid_cards_icon";
  ALTER TABLE "pages_blocks_b61_card_grid_cards" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_pages_blocks_b61_card_grid_cards_icon" USING "icon"::"public"."enum_pages_blocks_b61_card_grid_cards_icon";
  ALTER TABLE "pages_blocks_b61_rail_links" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_b61_rail_links" ALTER COLUMN "icon" SET DEFAULT 'arrow'::text;
  DROP TYPE "public"."enum_pages_blocks_b61_rail_links_icon";
  CREATE TYPE "public"."enum_pages_blocks_b61_rail_links_icon" AS ENUM('arrow', 'check', 'email', 'phone', 'location', 'calendar', 'clock', 'link', 'star', 'heart', 'book', 'people', 'cross', 'school');
  ALTER TABLE "pages_blocks_b61_rail_links" ALTER COLUMN "icon" SET DEFAULT 'arrow'::"public"."enum_pages_blocks_b61_rail_links_icon";
  ALTER TABLE "pages_blocks_b61_rail_links" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_pages_blocks_b61_rail_links_icon" USING "icon"::"public"."enum_pages_blocks_b61_rail_links_icon";
  ALTER TABLE "_pages_v_blocks_b61_card_grid_cards" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_b61_card_grid_cards" ALTER COLUMN "icon" SET DEFAULT 'star'::text;
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_cards_icon";
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_cards_icon" AS ENUM('check', 'email', 'phone', 'location', 'calendar', 'clock', 'link', 'star', 'heart', 'book', 'people', 'cross', 'school');
  ALTER TABLE "_pages_v_blocks_b61_card_grid_cards" ALTER COLUMN "icon" SET DEFAULT 'star'::"public"."enum__pages_v_blocks_b61_card_grid_cards_icon";
  ALTER TABLE "_pages_v_blocks_b61_card_grid_cards" ALTER COLUMN "icon" SET DATA TYPE "public"."enum__pages_v_blocks_b61_card_grid_cards_icon" USING "icon"::"public"."enum__pages_v_blocks_b61_card_grid_cards_icon";
  ALTER TABLE "_pages_v_blocks_b61_rail_links" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_b61_rail_links" ALTER COLUMN "icon" SET DEFAULT 'arrow'::text;
  DROP TYPE "public"."enum__pages_v_blocks_b61_rail_links_icon";
  CREATE TYPE "public"."enum__pages_v_blocks_b61_rail_links_icon" AS ENUM('arrow', 'check', 'email', 'phone', 'location', 'calendar', 'clock', 'link', 'star', 'heart', 'book', 'people', 'cross', 'school');
  ALTER TABLE "_pages_v_blocks_b61_rail_links" ALTER COLUMN "icon" SET DEFAULT 'arrow'::"public"."enum__pages_v_blocks_b61_rail_links_icon";
  ALTER TABLE "_pages_v_blocks_b61_rail_links" ALTER COLUMN "icon" SET DATA TYPE "public"."enum__pages_v_blocks_b61_rail_links_icon" USING "icon"::"public"."enum__pages_v_blocks_b61_rail_links_icon";
  ALTER TABLE "school_settings_quick_links" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "school_settings_quick_links" ALTER COLUMN "icon" SET DEFAULT 'link'::text;
  DROP TYPE "public"."enum_school_settings_quick_links_icon";
  CREATE TYPE "public"."enum_school_settings_quick_links_icon" AS ENUM('check', 'email', 'phone', 'location', 'calendar', 'clock', 'link', 'star', 'heart', 'book', 'people', 'cross', 'school');
  ALTER TABLE "school_settings_quick_links" ALTER COLUMN "icon" SET DEFAULT 'link'::"public"."enum_school_settings_quick_links_icon";
  ALTER TABLE "school_settings_quick_links" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_school_settings_quick_links_icon" USING "icon"::"public"."enum_school_settings_quick_links_icon";
  ALTER TABLE "_school_settings_v_version_quick_links" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "_school_settings_v_version_quick_links" ALTER COLUMN "icon" SET DEFAULT 'link'::text;
  DROP TYPE "public"."enum__school_settings_v_version_quick_links_icon";
  CREATE TYPE "public"."enum__school_settings_v_version_quick_links_icon" AS ENUM('check', 'email', 'phone', 'location', 'calendar', 'clock', 'link', 'star', 'heart', 'book', 'people', 'cross', 'school');
  ALTER TABLE "_school_settings_v_version_quick_links" ALTER COLUMN "icon" SET DEFAULT 'link'::"public"."enum__school_settings_v_version_quick_links_icon";
  ALTER TABLE "_school_settings_v_version_quick_links" ALTER COLUMN "icon" SET DATA TYPE "public"."enum__school_settings_v_version_quick_links_icon" USING "icon"::"public"."enum__school_settings_v_version_quick_links_icon";`)
}
