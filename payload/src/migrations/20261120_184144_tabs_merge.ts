import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Tabs and Tabbed Features become one Tabs element (Jay, 20 Nov 2026).
  // 1. The new Tabs columns (layout, side; a photo and text per tab).
  await db.execute(sql`
  CREATE TYPE "public"."enum_pages_blocks_b61_tabs_layout" AS ENUM('top', 'beside', 'list', 'story');
  CREATE TYPE "public"."enum_pages_blocks_b61_tabs_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_tabs_layout" AS ENUM('top', 'beside', 'list', 'story');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_tabs_side" AS ENUM('left', 'right');
  ALTER TABLE "pages_blocks_b61_tabs_tabs" ADD COLUMN "body" jsonb;
  ALTER TABLE "pages_blocks_b61_tabs_tabs" ADD COLUMN "image_id" integer;
  ALTER TABLE "pages_blocks_b61_tabs" ADD COLUMN "layout" "enum_pages_blocks_b61_tabs_layout" DEFAULT 'top';
  ALTER TABLE "pages_blocks_b61_tabs" ADD COLUMN "side" "enum_pages_blocks_b61_tabs_side" DEFAULT 'left';
  ALTER TABLE "_pages_v_blocks_b61_tabs_tabs" ADD COLUMN "body" jsonb;
  ALTER TABLE "_pages_v_blocks_b61_tabs_tabs" ADD COLUMN "image_id" integer;
  ALTER TABLE "_pages_v_blocks_b61_tabs" ADD COLUMN "layout" "enum__pages_v_blocks_b61_tabs_layout" DEFAULT 'top';
  ALTER TABLE "_pages_v_blocks_b61_tabs" ADD COLUMN "side" "enum__pages_v_blocks_b61_tabs_side" DEFAULT 'left';
  ALTER TABLE "pages_blocks_b61_tabs_tabs" ADD CONSTRAINT "pages_blocks_b61_tabs_tabs_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_tabs_tabs" ADD CONSTRAINT "_pages_v_blocks_b61_tabs_tabs_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_b61_tabs_tabs_image_idx" ON "pages_blocks_b61_tabs_tabs" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_b61_tabs_tabs_image_idx" ON "_pages_v_blocks_b61_tabs_tabs" USING btree ("image_id");
`)

  // 2. Existing Tabs keep their look (tab position -> layout and side); every
  //    Tabbed Features section is copied into Tabs, in the same place, as a
  //    Feature list (or Scroll story / Tabs on top, as it was set).
  await db.execute(sql.raw(`
    UPDATE "pages_blocks_b61_tabs" SET
    "layout" = (CASE WHEN "tab_position"::text IN ('left', 'right') THEN 'beside' ELSE 'top' END)::"enum_pages_blocks_b61_tabs_layout",
    "side" = (CASE WHEN "tab_position"::text = 'right' THEN 'right' ELSE 'left' END)::"enum_pages_blocks_b61_tabs_side"
    WHERE "tab_position" IS NOT NULL;
  UPDATE "_pages_v_blocks_b61_tabs" SET
    "layout" = (CASE WHEN "tab_position"::text IN ('left', 'right') THEN 'beside' ELSE 'top' END)::"enum__pages_v_blocks_b61_tabs_layout",
    "side" = (CASE WHEN "tab_position"::text = 'right' THEN 'right' ELSE 'left' END)::"enum__pages_v_blocks_b61_tabs_side"
    WHERE "tab_position" IS NOT NULL;
  INSERT INTO "pages_blocks_b61_tabs" ("_order", "_parent_id", "_path", "id", "eyebrow", "intro", "first_item_open", "block_name", "css_class", "heading", "heading_level", "tab_align", "heading_align", "pad_top", "pad_bottom", "surface", "eyebrow_rule", "entrance", "layout", "side")
    SELECT "_order", "_parent_id", "_path", "id", "eyebrow", "intro", "first_item_open", "block_name", "css_class", "heading", "heading_level"::text::"enum_pages_blocks_b61_tabs_heading_level", "tab_align"::text::"enum_pages_blocks_b61_tabs_tab_align", "heading_align"::text::"enum_pages_blocks_b61_tabs_heading_align", "pad_top"::text::"enum_pages_blocks_b61_tabs_pad_top", "pad_bottom"::text::"enum_pages_blocks_b61_tabs_pad_bottom", "surface"::text::"enum_pages_blocks_b61_tabs_surface", "eyebrow_rule"::text::"enum_pages_blocks_b61_tabs_eyebrow_rule", "entrance"::text::"enum_pages_blocks_b61_tabs_entrance", (CASE WHEN "scroll_story" THEN 'story' WHEN "tab_position"::text = 'top' THEN 'top' ELSE 'list' END)::"enum_pages_blocks_b61_tabs_layout", (CASE WHEN "tab_position"::text = 'right' THEN 'right' ELSE 'left' END)::"enum_pages_blocks_b61_tabs_side" FROM "pages_blocks_b61_pillars";
  INSERT INTO "pages_blocks_b61_tabs_tabs" ("_order", "_parent_id", "id", "label", "body", "image_id")
    SELECT "_order", "_parent_id", "id", "title", "body", "image_id" FROM "pages_blocks_b61_pillars_items";
  INSERT INTO "_pages_v_blocks_b61_tabs" ("_order", "_parent_id", "_path", "_uuid", "eyebrow", "intro", "first_item_open", "block_name", "css_class", "heading", "heading_level", "tab_align", "heading_align", "pad_top", "pad_bottom", "surface", "eyebrow_rule", "entrance", "layout", "side")
    SELECT "_order", "_parent_id", "_path", "_uuid", "eyebrow", "intro", "first_item_open", "block_name", "css_class", "heading", "heading_level"::text::"enum__pages_v_blocks_b61_tabs_heading_level", "tab_align"::text::"enum__pages_v_blocks_b61_tabs_tab_align", "heading_align"::text::"enum__pages_v_blocks_b61_tabs_heading_align", "pad_top"::text::"enum__pages_v_blocks_b61_tabs_pad_top", "pad_bottom"::text::"enum__pages_v_blocks_b61_tabs_pad_bottom", "surface"::text::"enum__pages_v_blocks_b61_tabs_surface", "eyebrow_rule"::text::"enum__pages_v_blocks_b61_tabs_eyebrow_rule", "entrance"::text::"enum__pages_v_blocks_b61_tabs_entrance", (CASE WHEN "scroll_story" THEN 'story' WHEN "tab_position"::text = 'top' THEN 'top' ELSE 'list' END)::"enum__pages_v_blocks_b61_tabs_layout", (CASE WHEN "tab_position"::text = 'right' THEN 'right' ELSE 'left' END)::"enum__pages_v_blocks_b61_tabs_side" FROM "_pages_v_blocks_b61_pillars";
  INSERT INTO "_pages_v_blocks_b61_tabs_tabs" ("_order", "_parent_id", "label", "body", "image_id", "_uuid")
    SELECT i."_order", t."id", i."title", i."body", i."image_id", i."_uuid"
    FROM "_pages_v_blocks_b61_pillars_items" i
    JOIN "_pages_v_blocks_b61_pillars" p ON p."id" = i."_parent_id"
    JOIN "_pages_v_blocks_b61_tabs" t ON t."_parent_id" = p."_parent_id" AND t."_path" = p."_path" AND t."_uuid" = p."_uuid";
  `))

  // 3. Then the old tables and columns go.
  await db.execute(sql`
  ALTER TABLE "pages_blocks_b61_tabs" DROP COLUMN "tab_position";
  ALTER TABLE "_pages_v_blocks_b61_tabs" DROP COLUMN "tab_position";
  ALTER TABLE "pages_blocks_b61_pillars_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_b61_pillars" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_b61_pillars_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_b61_pillars" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_b61_pillars_items" CASCADE;
  DROP TABLE "pages_blocks_b61_pillars" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_pillars_items" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_pillars" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_b61_tabs_tab_position";
  DROP TYPE "public"."enum_pages_blocks_b61_pillars_heading_level";
  DROP TYPE "public"."enum_pages_blocks_b61_pillars_tab_position";
  DROP TYPE "public"."enum_pages_blocks_b61_pillars_tab_align";
  DROP TYPE "public"."enum_pages_blocks_b61_pillars_heading_align";
  DROP TYPE "public"."enum_pages_blocks_b61_pillars_pad_top";
  DROP TYPE "public"."enum_pages_blocks_b61_pillars_pad_bottom";
  DROP TYPE "public"."enum_pages_blocks_b61_pillars_surface";
  DROP TYPE "public"."enum_pages_blocks_b61_pillars_eyebrow_rule";
  DROP TYPE "public"."enum_pages_blocks_b61_pillars_entrance";
  DROP TYPE "public"."enum__pages_v_blocks_b61_tabs_tab_position";
  DROP TYPE "public"."enum__pages_v_blocks_b61_pillars_heading_level";
  DROP TYPE "public"."enum__pages_v_blocks_b61_pillars_tab_position";
  DROP TYPE "public"."enum__pages_v_blocks_b61_pillars_tab_align";
  DROP TYPE "public"."enum__pages_v_blocks_b61_pillars_heading_align";
  DROP TYPE "public"."enum__pages_v_blocks_b61_pillars_pad_top";
  DROP TYPE "public"."enum__pages_v_blocks_b61_pillars_pad_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_b61_pillars_surface";
  DROP TYPE "public"."enum__pages_v_blocks_b61_pillars_eyebrow_rule";
  DROP TYPE "public"."enum__pages_v_blocks_b61_pillars_entrance";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_b61_tabs_tab_position" AS ENUM('top', 'left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_b61_pillars_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum_pages_blocks_b61_pillars_tab_position" AS ENUM('left', 'right', 'top');
  CREATE TYPE "public"."enum_pages_blocks_b61_pillars_tab_align" AS ENUM('left', 'center', 'full');
  CREATE TYPE "public"."enum_pages_blocks_b61_pillars_heading_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_b61_pillars_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_pillars_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_pillars_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_pages_blocks_b61_pillars_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum_pages_blocks_b61_pillars_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_tabs_tab_position" AS ENUM('top', 'left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_pillars_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_pillars_tab_position" AS ENUM('left', 'right', 'top');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_pillars_tab_align" AS ENUM('left', 'center', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_pillars_heading_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_pillars_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_pillars_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_pillars_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_pillars_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_pillars_entrance" AS ENUM('on', 'off');
  CREATE TABLE "pages_blocks_b61_pillars_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" jsonb,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_b61_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" jsonb,
  	"intro" jsonb,
  	"heading_level" "enum_pages_blocks_b61_pillars_heading_level" DEFAULT 'auto',
  	"first_item_open" boolean DEFAULT true,
  	"tab_position" "enum_pages_blocks_b61_pillars_tab_position" DEFAULT 'left',
  	"tab_align" "enum_pages_blocks_b61_pillars_tab_align" DEFAULT 'left',
  	"heading_align" "enum_pages_blocks_b61_pillars_heading_align" DEFAULT 'left',
  	"pad_top" "enum_pages_blocks_b61_pillars_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum_pages_blocks_b61_pillars_pad_bottom" DEFAULT 'normal',
  	"surface" "enum_pages_blocks_b61_pillars_surface" DEFAULT 'none',
  	"eyebrow_rule" "enum_pages_blocks_b61_pillars_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum_pages_blocks_b61_pillars_entrance" DEFAULT 'on',
  	"scroll_story" boolean,
  	"css_class" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_pillars_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" jsonb,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" jsonb,
  	"intro" jsonb,
  	"heading_level" "enum__pages_v_blocks_b61_pillars_heading_level" DEFAULT 'auto',
  	"first_item_open" boolean DEFAULT true,
  	"tab_position" "enum__pages_v_blocks_b61_pillars_tab_position" DEFAULT 'left',
  	"tab_align" "enum__pages_v_blocks_b61_pillars_tab_align" DEFAULT 'left',
  	"heading_align" "enum__pages_v_blocks_b61_pillars_heading_align" DEFAULT 'left',
  	"pad_top" "enum__pages_v_blocks_b61_pillars_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum__pages_v_blocks_b61_pillars_pad_bottom" DEFAULT 'normal',
  	"surface" "enum__pages_v_blocks_b61_pillars_surface" DEFAULT 'none',
  	"eyebrow_rule" "enum__pages_v_blocks_b61_pillars_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum__pages_v_blocks_b61_pillars_entrance" DEFAULT 'on',
  	"scroll_story" boolean,
  	"css_class" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_b61_tabs_tabs" DROP CONSTRAINT "pages_blocks_b61_tabs_tabs_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_b61_tabs_tabs" DROP CONSTRAINT "_pages_v_blocks_b61_tabs_tabs_image_id_media_id_fk";
  
  DROP INDEX "pages_blocks_b61_tabs_tabs_image_idx";
  DROP INDEX "_pages_v_blocks_b61_tabs_tabs_image_idx";
  ALTER TABLE "pages_blocks_b61_tabs" ADD COLUMN "tab_position" "enum_pages_blocks_b61_tabs_tab_position" DEFAULT 'top';
  ALTER TABLE "_pages_v_blocks_b61_tabs" ADD COLUMN "tab_position" "enum__pages_v_blocks_b61_tabs_tab_position" DEFAULT 'top';
  ALTER TABLE "pages_blocks_b61_pillars_items" ADD CONSTRAINT "pages_blocks_b61_pillars_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_pillars_items" ADD CONSTRAINT "pages_blocks_b61_pillars_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_pillars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_pillars" ADD CONSTRAINT "pages_blocks_b61_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_pillars_items" ADD CONSTRAINT "_pages_v_blocks_b61_pillars_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_pillars_items" ADD CONSTRAINT "_pages_v_blocks_b61_pillars_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_pillars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_pillars" ADD CONSTRAINT "_pages_v_blocks_b61_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_b61_pillars_items_order_idx" ON "pages_blocks_b61_pillars_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_pillars_items_parent_id_idx" ON "pages_blocks_b61_pillars_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_pillars_items_image_idx" ON "pages_blocks_b61_pillars_items" USING btree ("image_id");
  CREATE INDEX "pages_blocks_b61_pillars_order_idx" ON "pages_blocks_b61_pillars" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_pillars_parent_id_idx" ON "pages_blocks_b61_pillars" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_pillars_path_idx" ON "pages_blocks_b61_pillars" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_b61_pillars_items_order_idx" ON "_pages_v_blocks_b61_pillars_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_pillars_items_parent_id_idx" ON "_pages_v_blocks_b61_pillars_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_pillars_items_image_idx" ON "_pages_v_blocks_b61_pillars_items" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_b61_pillars_order_idx" ON "_pages_v_blocks_b61_pillars" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_pillars_parent_id_idx" ON "_pages_v_blocks_b61_pillars" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_pillars_path_idx" ON "_pages_v_blocks_b61_pillars" USING btree ("_path");
  ALTER TABLE "pages_blocks_b61_tabs_tabs" DROP COLUMN "body";
  ALTER TABLE "pages_blocks_b61_tabs_tabs" DROP COLUMN "image_id";
  ALTER TABLE "pages_blocks_b61_tabs" DROP COLUMN "layout";
  ALTER TABLE "pages_blocks_b61_tabs" DROP COLUMN "side";
  ALTER TABLE "_pages_v_blocks_b61_tabs_tabs" DROP COLUMN "body";
  ALTER TABLE "_pages_v_blocks_b61_tabs_tabs" DROP COLUMN "image_id";
  ALTER TABLE "_pages_v_blocks_b61_tabs" DROP COLUMN "layout";
  ALTER TABLE "_pages_v_blocks_b61_tabs" DROP COLUMN "side";
  DROP TYPE "public"."enum_pages_blocks_b61_tabs_layout";
  DROP TYPE "public"."enum_pages_blocks_b61_tabs_side";
  DROP TYPE "public"."enum__pages_v_blocks_b61_tabs_layout";
  DROP TYPE "public"."enum__pages_v_blocks_b61_tabs_side";`)
}
