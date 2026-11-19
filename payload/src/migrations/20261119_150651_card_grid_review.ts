import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Overlay cards become "Card text: On the photo". Remember which grids used
  // the old Overlay style before that option leaves the list, then flag them
  // once the new Card text column exists.
  await db.execute(sql.raw(`
  CREATE TABLE IF NOT EXISTS "b61_overlay_grids" ("tbl" text, "id" text);
  INSERT INTO "b61_overlay_grids" SELECT 'pages', "id"::text FROM "pages_blocks_b61_card_grid" WHERE "card_style"::text = 'overlay';
  INSERT INTO "b61_overlay_grids" SELECT 'versions', "id"::text FROM "_pages_v_blocks_b61_card_grid" WHERE "card_style"::text = 'overlay';
  UPDATE "pages_blocks_b61_card_grid" SET "card_style" = 'bordered' WHERE "card_style"::text = 'overlay';
  UPDATE "_pages_v_blocks_b61_card_grid" SET "card_style" = 'bordered' WHERE "card_style"::text = 'overlay';
  `))
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_card_text" AS ENUM('below', 'on');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_card_text" AS ENUM('below', 'on');
  CREATE TYPE "public"."enum_school_settings_style_card_link_case" AS ENUM('capitals', 'typed');
  CREATE TYPE "public"."enum_school_settings_style_card_link_size" AS ENUM('small', 'medium', 'large');
  CREATE TYPE "public"."enum_school_settings_style_carousel_peek" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__school_settings_v_version_style_card_link_case" AS ENUM('capitals', 'typed');
  CREATE TYPE "public"."enum__school_settings_v_version_style_card_link_size" AS ENUM('small', 'medium', 'large');
  CREATE TYPE "public"."enum__school_settings_v_version_style_carousel_peek" AS ENUM('none', 'small', 'medium', 'large');
  ALTER TYPE "public"."enum_pages_blocks_b61_card_grid_cards_icon" ADD VALUE 'custom';
  ALTER TYPE "public"."enum_pages_blocks_b61_rail_links_icon" ADD VALUE 'custom';
  ALTER TYPE "public"."enum__pages_v_blocks_b61_card_grid_cards_icon" ADD VALUE 'custom';
  ALTER TYPE "public"."enum__pages_v_blocks_b61_rail_links_icon" ADD VALUE 'custom';
  ALTER TYPE "public"."enum_school_settings_quick_links_icon" ADD VALUE 'custom';
  ALTER TYPE "public"."enum__school_settings_v_version_quick_links_icon" ADD VALUE 'custom';
  ALTER TABLE "pages_blocks_b61_card_grid" ALTER COLUMN "card_style" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_b61_card_grid" ALTER COLUMN "card_style" SET DEFAULT 'bordered'::text;
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_card_style";
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_card_style" AS ENUM('plain', 'flat', 'bordered');
  ALTER TABLE "pages_blocks_b61_card_grid" ALTER COLUMN "card_style" SET DEFAULT 'bordered'::"public"."enum_pages_blocks_b61_card_grid_card_style";
  ALTER TABLE "pages_blocks_b61_card_grid" ALTER COLUMN "card_style" SET DATA TYPE "public"."enum_pages_blocks_b61_card_grid_card_style" USING "card_style"::"public"."enum_pages_blocks_b61_card_grid_card_style";
  ALTER TABLE "_pages_v_blocks_b61_card_grid" ALTER COLUMN "card_style" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_b61_card_grid" ALTER COLUMN "card_style" SET DEFAULT 'bordered'::text;
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_card_style";
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_card_style" AS ENUM('plain', 'flat', 'bordered');
  ALTER TABLE "_pages_v_blocks_b61_card_grid" ALTER COLUMN "card_style" SET DEFAULT 'bordered'::"public"."enum__pages_v_blocks_b61_card_grid_card_style";
  ALTER TABLE "_pages_v_blocks_b61_card_grid" ALTER COLUMN "card_style" SET DATA TYPE "public"."enum__pages_v_blocks_b61_card_grid_card_style" USING "card_style"::"public"."enum__pages_v_blocks_b61_card_grid_card_style";
  ALTER TABLE "pages_blocks_b61_card_grid_cards" ADD COLUMN "icon_image_id" integer;
  ALTER TABLE "pages_blocks_b61_card_grid_cards" ADD COLUMN "icon_colours" boolean;
  ALTER TABLE "pages_blocks_b61_card_grid" ADD COLUMN "card_text" "enum_pages_blocks_b61_card_grid_card_text" DEFAULT 'below';
  ALTER TABLE "pages_blocks_b61_rail_links" ADD COLUMN "icon_image_id" integer;
  ALTER TABLE "pages_blocks_b61_rail_links" ADD COLUMN "icon_colours" boolean;
  ALTER TABLE "_pages_v_blocks_b61_card_grid_cards" ADD COLUMN "icon_image_id" integer;
  ALTER TABLE "_pages_v_blocks_b61_card_grid_cards" ADD COLUMN "icon_colours" boolean;
  ALTER TABLE "_pages_v_blocks_b61_card_grid" ADD COLUMN "card_text" "enum__pages_v_blocks_b61_card_grid_card_text" DEFAULT 'below';
  ALTER TABLE "_pages_v_blocks_b61_rail_links" ADD COLUMN "icon_image_id" integer;
  ALTER TABLE "_pages_v_blocks_b61_rail_links" ADD COLUMN "icon_colours" boolean;
  ALTER TABLE "school_settings_quick_links" ADD COLUMN "icon_image_id" integer;
  ALTER TABLE "school_settings_quick_links" ADD COLUMN "icon_colours" boolean;
  ALTER TABLE "school_settings" ADD COLUMN "style_card_link_case" "enum_school_settings_style_card_link_case";
  ALTER TABLE "school_settings" ADD COLUMN "style_card_link_size" "enum_school_settings_style_card_link_size";
  ALTER TABLE "school_settings" ADD COLUMN "style_carousel_peek" "enum_school_settings_style_carousel_peek";
  ALTER TABLE "_school_settings_v_version_quick_links" ADD COLUMN "icon_image_id" integer;
  ALTER TABLE "_school_settings_v_version_quick_links" ADD COLUMN "icon_colours" boolean;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_style_card_link_case" "enum__school_settings_v_version_style_card_link_case";
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_style_card_link_size" "enum__school_settings_v_version_style_card_link_size";
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_style_carousel_peek" "enum__school_settings_v_version_style_carousel_peek";
  ALTER TABLE "pages_blocks_b61_card_grid_cards" ADD CONSTRAINT "pages_blocks_b61_card_grid_cards_icon_image_id_media_id_fk" FOREIGN KEY ("icon_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_rail_links" ADD CONSTRAINT "pages_blocks_b61_rail_links_icon_image_id_media_id_fk" FOREIGN KEY ("icon_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_card_grid_cards" ADD CONSTRAINT "_pages_v_blocks_b61_card_grid_cards_icon_image_id_media_id_fk" FOREIGN KEY ("icon_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_rail_links" ADD CONSTRAINT "_pages_v_blocks_b61_rail_links_icon_image_id_media_id_fk" FOREIGN KEY ("icon_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "school_settings_quick_links" ADD CONSTRAINT "school_settings_quick_links_icon_image_id_media_id_fk" FOREIGN KEY ("icon_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_quick_links" ADD CONSTRAINT "_school_settings_v_version_quick_links_icon_image_id_media_id_fk" FOREIGN KEY ("icon_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_b61_card_grid_cards_icon_image_idx" ON "pages_blocks_b61_card_grid_cards" USING btree ("icon_image_id");
  CREATE INDEX "pages_blocks_b61_rail_links_icon_image_idx" ON "pages_blocks_b61_rail_links" USING btree ("icon_image_id");
  CREATE INDEX "_pages_v_blocks_b61_card_grid_cards_icon_image_idx" ON "_pages_v_blocks_b61_card_grid_cards" USING btree ("icon_image_id");
  CREATE INDEX "_pages_v_blocks_b61_rail_links_icon_image_idx" ON "_pages_v_blocks_b61_rail_links" USING btree ("icon_image_id");
  CREATE INDEX "school_settings_quick_links_icon_image_idx" ON "school_settings_quick_links" USING btree ("icon_image_id");
  CREATE INDEX "_school_settings_v_version_quick_links_icon_image_idx" ON "_school_settings_v_version_quick_links" USING btree ("icon_image_id");
  ALTER TABLE "pages_blocks_b61_card_grid" DROP COLUMN "peek";
  ALTER TABLE "pages_blocks_b61_card_grid" DROP COLUMN "cta_case";
  ALTER TABLE "pages_blocks_b61_card_grid" DROP COLUMN "cta_size";
  ALTER TABLE "pages_blocks_b61_carousel" DROP COLUMN "peek";
  ALTER TABLE "_pages_v_blocks_b61_card_grid" DROP COLUMN "peek";
  ALTER TABLE "_pages_v_blocks_b61_card_grid" DROP COLUMN "cta_case";
  ALTER TABLE "_pages_v_blocks_b61_card_grid" DROP COLUMN "cta_size";
  ALTER TABLE "_pages_v_blocks_b61_carousel" DROP COLUMN "peek";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_peek";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_cta_case";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_cta_size";
  DROP TYPE "public"."enum_pages_blocks_b61_carousel_peek";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_peek";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_cta_case";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_cta_size";
  DROP TYPE "public"."enum__pages_v_blocks_b61_carousel_peek";`)
  await db.execute(sql.raw(`
  UPDATE "pages_blocks_b61_card_grid" SET "card_text" = 'on' WHERE "id"::text IN (SELECT "id" FROM "b61_overlay_grids" WHERE "tbl" = 'pages');
  UPDATE "_pages_v_blocks_b61_card_grid" SET "card_text" = 'on' WHERE "id"::text IN (SELECT "id" FROM "b61_overlay_grids" WHERE "tbl" = 'versions');
  DROP TABLE "b61_overlay_grids";
  `))

}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_peek" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_cta_case" AS ENUM('upper', 'normal');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_cta_size" AS ENUM('sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_b61_carousel_peek" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_peek" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_cta_case" AS ENUM('upper', 'normal');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_cta_size" AS ENUM('sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_carousel_peek" AS ENUM('none', 'small', 'medium', 'large');
  ALTER TYPE "public"."enum_pages_blocks_b61_card_grid_card_style" ADD VALUE 'overlay';
  ALTER TYPE "public"."enum__pages_v_blocks_b61_card_grid_card_style" ADD VALUE 'overlay';
  ALTER TABLE "pages_blocks_b61_card_grid_cards" DROP CONSTRAINT "pages_blocks_b61_card_grid_cards_icon_image_id_media_id_fk";
  
  ALTER TABLE "pages_blocks_b61_rail_links" DROP CONSTRAINT "pages_blocks_b61_rail_links_icon_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_b61_card_grid_cards" DROP CONSTRAINT "_pages_v_blocks_b61_card_grid_cards_icon_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_b61_rail_links" DROP CONSTRAINT "_pages_v_blocks_b61_rail_links_icon_image_id_media_id_fk";
  
  ALTER TABLE "school_settings_quick_links" DROP CONSTRAINT "school_settings_quick_links_icon_image_id_media_id_fk";
  
  ALTER TABLE "_school_settings_v_version_quick_links" DROP CONSTRAINT "_school_settings_v_version_quick_links_icon_image_id_media_id_fk";
  
  ALTER TABLE "pages_blocks_b61_card_grid_cards" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_b61_card_grid_cards" ALTER COLUMN "icon" SET DEFAULT 'star'::text;
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_cards_icon";
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_cards_icon" AS ENUM('check', 'question', 'email', 'phone', 'location', 'calendar', 'clock', 'link', 'star', 'heart', 'book', 'people', 'cross', 'school');
  ALTER TABLE "pages_blocks_b61_card_grid_cards" ALTER COLUMN "icon" SET DEFAULT 'star'::"public"."enum_pages_blocks_b61_card_grid_cards_icon";
  ALTER TABLE "pages_blocks_b61_card_grid_cards" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_pages_blocks_b61_card_grid_cards_icon" USING "icon"::"public"."enum_pages_blocks_b61_card_grid_cards_icon";
  ALTER TABLE "pages_blocks_b61_rail_links" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_b61_rail_links" ALTER COLUMN "icon" SET DEFAULT 'arrow'::text;
  DROP TYPE "public"."enum_pages_blocks_b61_rail_links_icon";
  CREATE TYPE "public"."enum_pages_blocks_b61_rail_links_icon" AS ENUM('arrow', 'check', 'question', 'email', 'phone', 'location', 'calendar', 'clock', 'link', 'star', 'heart', 'book', 'people', 'cross', 'school');
  ALTER TABLE "pages_blocks_b61_rail_links" ALTER COLUMN "icon" SET DEFAULT 'arrow'::"public"."enum_pages_blocks_b61_rail_links_icon";
  ALTER TABLE "pages_blocks_b61_rail_links" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_pages_blocks_b61_rail_links_icon" USING "icon"::"public"."enum_pages_blocks_b61_rail_links_icon";
  ALTER TABLE "_pages_v_blocks_b61_card_grid_cards" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_b61_card_grid_cards" ALTER COLUMN "icon" SET DEFAULT 'star'::text;
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_cards_icon";
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_cards_icon" AS ENUM('check', 'question', 'email', 'phone', 'location', 'calendar', 'clock', 'link', 'star', 'heart', 'book', 'people', 'cross', 'school');
  ALTER TABLE "_pages_v_blocks_b61_card_grid_cards" ALTER COLUMN "icon" SET DEFAULT 'star'::"public"."enum__pages_v_blocks_b61_card_grid_cards_icon";
  ALTER TABLE "_pages_v_blocks_b61_card_grid_cards" ALTER COLUMN "icon" SET DATA TYPE "public"."enum__pages_v_blocks_b61_card_grid_cards_icon" USING "icon"::"public"."enum__pages_v_blocks_b61_card_grid_cards_icon";
  ALTER TABLE "_pages_v_blocks_b61_rail_links" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_b61_rail_links" ALTER COLUMN "icon" SET DEFAULT 'arrow'::text;
  DROP TYPE "public"."enum__pages_v_blocks_b61_rail_links_icon";
  CREATE TYPE "public"."enum__pages_v_blocks_b61_rail_links_icon" AS ENUM('arrow', 'check', 'question', 'email', 'phone', 'location', 'calendar', 'clock', 'link', 'star', 'heart', 'book', 'people', 'cross', 'school');
  ALTER TABLE "_pages_v_blocks_b61_rail_links" ALTER COLUMN "icon" SET DEFAULT 'arrow'::"public"."enum__pages_v_blocks_b61_rail_links_icon";
  ALTER TABLE "_pages_v_blocks_b61_rail_links" ALTER COLUMN "icon" SET DATA TYPE "public"."enum__pages_v_blocks_b61_rail_links_icon" USING "icon"::"public"."enum__pages_v_blocks_b61_rail_links_icon";
  ALTER TABLE "school_settings_quick_links" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "school_settings_quick_links" ALTER COLUMN "icon" SET DEFAULT 'link'::text;
  DROP TYPE "public"."enum_school_settings_quick_links_icon";
  CREATE TYPE "public"."enum_school_settings_quick_links_icon" AS ENUM('check', 'question', 'email', 'phone', 'location', 'calendar', 'clock', 'link', 'star', 'heart', 'book', 'people', 'cross', 'school');
  ALTER TABLE "school_settings_quick_links" ALTER COLUMN "icon" SET DEFAULT 'link'::"public"."enum_school_settings_quick_links_icon";
  ALTER TABLE "school_settings_quick_links" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_school_settings_quick_links_icon" USING "icon"::"public"."enum_school_settings_quick_links_icon";
  ALTER TABLE "_school_settings_v_version_quick_links" ALTER COLUMN "icon" SET DATA TYPE text;
  ALTER TABLE "_school_settings_v_version_quick_links" ALTER COLUMN "icon" SET DEFAULT 'link'::text;
  DROP TYPE "public"."enum__school_settings_v_version_quick_links_icon";
  CREATE TYPE "public"."enum__school_settings_v_version_quick_links_icon" AS ENUM('check', 'question', 'email', 'phone', 'location', 'calendar', 'clock', 'link', 'star', 'heart', 'book', 'people', 'cross', 'school');
  ALTER TABLE "_school_settings_v_version_quick_links" ALTER COLUMN "icon" SET DEFAULT 'link'::"public"."enum__school_settings_v_version_quick_links_icon";
  ALTER TABLE "_school_settings_v_version_quick_links" ALTER COLUMN "icon" SET DATA TYPE "public"."enum__school_settings_v_version_quick_links_icon" USING "icon"::"public"."enum__school_settings_v_version_quick_links_icon";
  DROP INDEX "pages_blocks_b61_card_grid_cards_icon_image_idx";
  DROP INDEX "pages_blocks_b61_rail_links_icon_image_idx";
  DROP INDEX "_pages_v_blocks_b61_card_grid_cards_icon_image_idx";
  DROP INDEX "_pages_v_blocks_b61_rail_links_icon_image_idx";
  DROP INDEX "school_settings_quick_links_icon_image_idx";
  DROP INDEX "_school_settings_v_version_quick_links_icon_image_idx";
  ALTER TABLE "pages_blocks_b61_card_grid" ADD COLUMN "peek" "enum_pages_blocks_b61_card_grid_peek" DEFAULT 'small';
  ALTER TABLE "pages_blocks_b61_card_grid" ADD COLUMN "cta_case" "enum_pages_blocks_b61_card_grid_cta_case" DEFAULT 'upper';
  ALTER TABLE "pages_blocks_b61_card_grid" ADD COLUMN "cta_size" "enum_pages_blocks_b61_card_grid_cta_size" DEFAULT 'sm';
  ALTER TABLE "pages_blocks_b61_carousel" ADD COLUMN "peek" "enum_pages_blocks_b61_carousel_peek" DEFAULT 'medium';
  ALTER TABLE "_pages_v_blocks_b61_card_grid" ADD COLUMN "peek" "enum__pages_v_blocks_b61_card_grid_peek" DEFAULT 'small';
  ALTER TABLE "_pages_v_blocks_b61_card_grid" ADD COLUMN "cta_case" "enum__pages_v_blocks_b61_card_grid_cta_case" DEFAULT 'upper';
  ALTER TABLE "_pages_v_blocks_b61_card_grid" ADD COLUMN "cta_size" "enum__pages_v_blocks_b61_card_grid_cta_size" DEFAULT 'sm';
  ALTER TABLE "_pages_v_blocks_b61_carousel" ADD COLUMN "peek" "enum__pages_v_blocks_b61_carousel_peek" DEFAULT 'medium';
  ALTER TABLE "pages_blocks_b61_card_grid_cards" DROP COLUMN "icon_image_id";
  ALTER TABLE "pages_blocks_b61_card_grid_cards" DROP COLUMN "icon_colours";
  ALTER TABLE "pages_blocks_b61_card_grid" DROP COLUMN "card_text";
  ALTER TABLE "pages_blocks_b61_rail_links" DROP COLUMN "icon_image_id";
  ALTER TABLE "pages_blocks_b61_rail_links" DROP COLUMN "icon_colours";
  ALTER TABLE "_pages_v_blocks_b61_card_grid_cards" DROP COLUMN "icon_image_id";
  ALTER TABLE "_pages_v_blocks_b61_card_grid_cards" DROP COLUMN "icon_colours";
  ALTER TABLE "_pages_v_blocks_b61_card_grid" DROP COLUMN "card_text";
  ALTER TABLE "_pages_v_blocks_b61_rail_links" DROP COLUMN "icon_image_id";
  ALTER TABLE "_pages_v_blocks_b61_rail_links" DROP COLUMN "icon_colours";
  ALTER TABLE "school_settings_quick_links" DROP COLUMN "icon_image_id";
  ALTER TABLE "school_settings_quick_links" DROP COLUMN "icon_colours";
  ALTER TABLE "school_settings" DROP COLUMN "style_card_link_case";
  ALTER TABLE "school_settings" DROP COLUMN "style_card_link_size";
  ALTER TABLE "school_settings" DROP COLUMN "style_carousel_peek";
  ALTER TABLE "_school_settings_v_version_quick_links" DROP COLUMN "icon_image_id";
  ALTER TABLE "_school_settings_v_version_quick_links" DROP COLUMN "icon_colours";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_style_card_link_case";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_style_card_link_size";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_style_carousel_peek";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_card_text";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_card_text";
  DROP TYPE "public"."enum_school_settings_style_card_link_case";
  DROP TYPE "public"."enum_school_settings_style_card_link_size";
  DROP TYPE "public"."enum_school_settings_style_carousel_peek";
  DROP TYPE "public"."enum__school_settings_v_version_style_card_link_case";
  DROP TYPE "public"."enum__school_settings_v_version_style_card_link_size";
  DROP TYPE "public"."enum__school_settings_v_version_style_carousel_peek";`)
}
