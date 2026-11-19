import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/*
 * Heading lines become one Heading (rich text) on every element that had them
 * (EDITING-STANDARD.md section 2, kit/heading.ts). Before the old line tables
 * are dropped, each element's lines are copied into its new `heading`: one
 * paragraph, lines joined by line breaks, an emphasized line's words carrying
 * the Emphasize format (Lexical's highlight, 128). Pages and their versions;
 * elements inside Tabs, Carousel and Section share the same tables.
 * Hero's Subheadline style and Short facts go (one style, Jay, 19 Nov 2026).
 */
const ELEMENTS = ['hero', 'split', 'prose', 'card_grid', 'stats_band', 'gallery', 'accordion', 'form', 'cta', 'carousel', 'tabs', 'pillars', 'logos']

function copyLines(table: string): string {
  const lines = `${table}_lines`
  return `
  ALTER TABLE "${table}" ADD COLUMN IF NOT EXISTS "heading" jsonb;
  UPDATE "${table}" b SET "heading" = jsonb_build_object('root', jsonb_build_object(
      'type', 'root', 'format', '', 'indent', 0, 'version', 1, 'direction', null,
      'children', jsonb_build_array(jsonb_build_object(
        'type', 'paragraph', 'format', '', 'indent', 0, 'version', 1, 'direction', null, 'textFormat', 0, 'textStyle', '',
        'children', h.children))))
  FROM (
    SELECT pid, jsonb_agg(node ORDER BY rn, sub) AS children
    FROM (
      SELECT l._parent_id::text AS pid, l.rn, 1 AS sub,
        jsonb_build_object('type', 'text', 'text', l.text, 'format', CASE WHEN l.emphasize THEN 128 ELSE 0 END,
          'detail', 0, 'mode', 'normal', 'style', '', 'version', 1) AS node
      FROM (SELECT *, row_number() OVER (PARTITION BY _parent_id ORDER BY _order) AS rn FROM "${lines}" WHERE coalesce(text, '') <> '') l
      UNION ALL
      SELECT l._parent_id::text, l.rn, 0, jsonb_build_object('type', 'linebreak', 'version', 1)
      FROM (SELECT *, row_number() OVER (PARTITION BY _parent_id ORDER BY _order) AS rn FROM "${lines}" WHERE coalesce(text, '') <> '') l
      WHERE l.rn > 1
    ) t
    GROUP BY pid
  ) h
  WHERE b.id::text = h.pid;`
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  for (const el of ELEMENTS) {
    for (const prefix of ['pages_blocks_b61_', '_pages_v_blocks_b61_']) {
      await db.execute(sql.raw(copyLines(`${prefix}${el}`)))
    }
  }
  await db.execute(sql`
   DROP TABLE "pages_blocks_b61_hero_lines" CASCADE;
  DROP TABLE "pages_blocks_b61_hero_meta_items" CASCADE;
  DROP TABLE "pages_blocks_b61_split_lines" CASCADE;
  DROP TABLE "pages_blocks_b61_prose_lines" CASCADE;
  DROP TABLE "pages_blocks_b61_card_grid_lines" CASCADE;
  DROP TABLE "pages_blocks_b61_stats_band_lines" CASCADE;
  DROP TABLE "pages_blocks_b61_gallery_lines" CASCADE;
  DROP TABLE "pages_blocks_b61_accordion_lines" CASCADE;
  DROP TABLE "pages_blocks_b61_tabs_lines" CASCADE;
  DROP TABLE "pages_blocks_b61_pillars_lines" CASCADE;
  DROP TABLE "pages_blocks_b61_carousel_lines" CASCADE;
  DROP TABLE "pages_blocks_b61_cta_lines" CASCADE;
  DROP TABLE "pages_blocks_b61_form_lines" CASCADE;
  DROP TABLE "pages_blocks_b61_logos_lines" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_hero_lines" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_hero_meta_items" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_split_lines" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_prose_lines" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_card_grid_lines" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_stats_band_lines" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_gallery_lines" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_accordion_lines" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_tabs_lines" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_pillars_lines" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_carousel_lines" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_cta_lines" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_form_lines" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_logos_lines" CASCADE;
  ALTER TABLE "pages_blocks_b61_hero" ADD COLUMN IF NOT EXISTS "heading" jsonb;
  ALTER TABLE "pages_blocks_b61_split" ADD COLUMN IF NOT EXISTS "heading" jsonb;
  ALTER TABLE "pages_blocks_b61_prose" ADD COLUMN IF NOT EXISTS "heading" jsonb;
  ALTER TABLE "pages_blocks_b61_card_grid" ADD COLUMN IF NOT EXISTS "heading" jsonb;
  ALTER TABLE "pages_blocks_b61_stats_band" ADD COLUMN IF NOT EXISTS "heading" jsonb;
  ALTER TABLE "pages_blocks_b61_gallery" ADD COLUMN IF NOT EXISTS "heading" jsonb;
  ALTER TABLE "pages_blocks_b61_accordion" ADD COLUMN IF NOT EXISTS "heading" jsonb;
  ALTER TABLE "pages_blocks_b61_tabs" ADD COLUMN IF NOT EXISTS "heading" jsonb;
  ALTER TABLE "pages_blocks_b61_pillars" ADD COLUMN IF NOT EXISTS "heading" jsonb;
  ALTER TABLE "pages_blocks_b61_carousel" ADD COLUMN IF NOT EXISTS "heading" jsonb;
  ALTER TABLE "pages_blocks_b61_cta" ADD COLUMN IF NOT EXISTS "heading" jsonb;
  ALTER TABLE "pages_blocks_b61_form" ADD COLUMN IF NOT EXISTS "heading" jsonb;
  ALTER TABLE "pages_blocks_b61_logos" ADD COLUMN IF NOT EXISTS "heading" jsonb;
  ALTER TABLE "_pages_v_blocks_b61_hero" ADD COLUMN IF NOT EXISTS "heading" jsonb;
  ALTER TABLE "_pages_v_blocks_b61_split" ADD COLUMN IF NOT EXISTS "heading" jsonb;
  ALTER TABLE "_pages_v_blocks_b61_prose" ADD COLUMN IF NOT EXISTS "heading" jsonb;
  ALTER TABLE "_pages_v_blocks_b61_card_grid" ADD COLUMN IF NOT EXISTS "heading" jsonb;
  ALTER TABLE "_pages_v_blocks_b61_stats_band" ADD COLUMN IF NOT EXISTS "heading" jsonb;
  ALTER TABLE "_pages_v_blocks_b61_gallery" ADD COLUMN IF NOT EXISTS "heading" jsonb;
  ALTER TABLE "_pages_v_blocks_b61_accordion" ADD COLUMN IF NOT EXISTS "heading" jsonb;
  ALTER TABLE "_pages_v_blocks_b61_tabs" ADD COLUMN IF NOT EXISTS "heading" jsonb;
  ALTER TABLE "_pages_v_blocks_b61_pillars" ADD COLUMN IF NOT EXISTS "heading" jsonb;
  ALTER TABLE "_pages_v_blocks_b61_carousel" ADD COLUMN IF NOT EXISTS "heading" jsonb;
  ALTER TABLE "_pages_v_blocks_b61_cta" ADD COLUMN IF NOT EXISTS "heading" jsonb;
  ALTER TABLE "_pages_v_blocks_b61_form" ADD COLUMN IF NOT EXISTS "heading" jsonb;
  ALTER TABLE "_pages_v_blocks_b61_logos" ADD COLUMN IF NOT EXISTS "heading" jsonb;
  ALTER TABLE "pages_blocks_b61_hero" DROP COLUMN "subheadline_scale";
  ALTER TABLE "_pages_v_blocks_b61_hero" DROP COLUMN "subheadline_scale";
  DROP TYPE "public"."enum_pages_blocks_b61_hero_subheadline_scale";
  DROP TYPE "public"."enum__pages_v_blocks_b61_hero_subheadline_scale";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_b61_hero_subheadline_scale" AS ENUM('body', 'display', 'meta');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_hero_subheadline_scale" AS ENUM('body', 'display', 'meta');
  CREATE TABLE "pages_blocks_b61_hero_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_hero_meta_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_b61_split_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_prose_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_card_grid_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_stats_band_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_gallery_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_accordion_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_tabs_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_pillars_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_carousel_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_cta_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_form_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_logos_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean
  );
  
  CREATE TABLE "_pages_v_blocks_b61_hero_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_hero_meta_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_split_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_prose_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_card_grid_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_stats_band_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_gallery_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_accordion_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_tabs_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_pillars_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_carousel_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_cta_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_form_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_logos_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean,
  	"_uuid" varchar
  );
  
  ALTER TABLE "pages_blocks_b61_hero" ADD COLUMN "subheadline_scale" "enum_pages_blocks_b61_hero_subheadline_scale" DEFAULT 'body';
  ALTER TABLE "_pages_v_blocks_b61_hero" ADD COLUMN "subheadline_scale" "enum__pages_v_blocks_b61_hero_subheadline_scale" DEFAULT 'body';
  ALTER TABLE "pages_blocks_b61_hero_lines" ADD CONSTRAINT "pages_blocks_b61_hero_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_hero_meta_items" ADD CONSTRAINT "pages_blocks_b61_hero_meta_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_split_lines" ADD CONSTRAINT "pages_blocks_b61_split_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_prose_lines" ADD CONSTRAINT "pages_blocks_b61_prose_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_prose"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_card_grid_lines" ADD CONSTRAINT "pages_blocks_b61_card_grid_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_stats_band_lines" ADD CONSTRAINT "pages_blocks_b61_stats_band_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_stats_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_gallery_lines" ADD CONSTRAINT "pages_blocks_b61_gallery_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_accordion_lines" ADD CONSTRAINT "pages_blocks_b61_accordion_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_tabs_lines" ADD CONSTRAINT "pages_blocks_b61_tabs_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_pillars_lines" ADD CONSTRAINT "pages_blocks_b61_pillars_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_pillars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_carousel_lines" ADD CONSTRAINT "pages_blocks_b61_carousel_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_cta_lines" ADD CONSTRAINT "pages_blocks_b61_cta_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_form_lines" ADD CONSTRAINT "pages_blocks_b61_form_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_logos_lines" ADD CONSTRAINT "pages_blocks_b61_logos_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_hero_lines" ADD CONSTRAINT "_pages_v_blocks_b61_hero_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_hero_meta_items" ADD CONSTRAINT "_pages_v_blocks_b61_hero_meta_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_split_lines" ADD CONSTRAINT "_pages_v_blocks_b61_split_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_prose_lines" ADD CONSTRAINT "_pages_v_blocks_b61_prose_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_prose"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_card_grid_lines" ADD CONSTRAINT "_pages_v_blocks_b61_card_grid_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_stats_band_lines" ADD CONSTRAINT "_pages_v_blocks_b61_stats_band_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_stats_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_gallery_lines" ADD CONSTRAINT "_pages_v_blocks_b61_gallery_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_accordion_lines" ADD CONSTRAINT "_pages_v_blocks_b61_accordion_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_tabs_lines" ADD CONSTRAINT "_pages_v_blocks_b61_tabs_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_pillars_lines" ADD CONSTRAINT "_pages_v_blocks_b61_pillars_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_pillars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_carousel_lines" ADD CONSTRAINT "_pages_v_blocks_b61_carousel_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_cta_lines" ADD CONSTRAINT "_pages_v_blocks_b61_cta_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_form_lines" ADD CONSTRAINT "_pages_v_blocks_b61_form_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_logos_lines" ADD CONSTRAINT "_pages_v_blocks_b61_logos_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_logos"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_b61_hero_lines_order_idx" ON "pages_blocks_b61_hero_lines" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_hero_lines_parent_id_idx" ON "pages_blocks_b61_hero_lines" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_hero_meta_items_order_idx" ON "pages_blocks_b61_hero_meta_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_hero_meta_items_parent_id_idx" ON "pages_blocks_b61_hero_meta_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_split_lines_order_idx" ON "pages_blocks_b61_split_lines" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_split_lines_parent_id_idx" ON "pages_blocks_b61_split_lines" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_prose_lines_order_idx" ON "pages_blocks_b61_prose_lines" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_prose_lines_parent_id_idx" ON "pages_blocks_b61_prose_lines" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_card_grid_lines_order_idx" ON "pages_blocks_b61_card_grid_lines" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_card_grid_lines_parent_id_idx" ON "pages_blocks_b61_card_grid_lines" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_stats_band_lines_order_idx" ON "pages_blocks_b61_stats_band_lines" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_stats_band_lines_parent_id_idx" ON "pages_blocks_b61_stats_band_lines" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_gallery_lines_order_idx" ON "pages_blocks_b61_gallery_lines" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_gallery_lines_parent_id_idx" ON "pages_blocks_b61_gallery_lines" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_accordion_lines_order_idx" ON "pages_blocks_b61_accordion_lines" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_accordion_lines_parent_id_idx" ON "pages_blocks_b61_accordion_lines" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_tabs_lines_order_idx" ON "pages_blocks_b61_tabs_lines" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_tabs_lines_parent_id_idx" ON "pages_blocks_b61_tabs_lines" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_pillars_lines_order_idx" ON "pages_blocks_b61_pillars_lines" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_pillars_lines_parent_id_idx" ON "pages_blocks_b61_pillars_lines" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_carousel_lines_order_idx" ON "pages_blocks_b61_carousel_lines" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_carousel_lines_parent_id_idx" ON "pages_blocks_b61_carousel_lines" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_cta_lines_order_idx" ON "pages_blocks_b61_cta_lines" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_cta_lines_parent_id_idx" ON "pages_blocks_b61_cta_lines" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_form_lines_order_idx" ON "pages_blocks_b61_form_lines" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_form_lines_parent_id_idx" ON "pages_blocks_b61_form_lines" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_logos_lines_order_idx" ON "pages_blocks_b61_logos_lines" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_logos_lines_parent_id_idx" ON "pages_blocks_b61_logos_lines" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_hero_lines_order_idx" ON "_pages_v_blocks_b61_hero_lines" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_hero_lines_parent_id_idx" ON "_pages_v_blocks_b61_hero_lines" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_hero_meta_items_order_idx" ON "_pages_v_blocks_b61_hero_meta_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_hero_meta_items_parent_id_idx" ON "_pages_v_blocks_b61_hero_meta_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_split_lines_order_idx" ON "_pages_v_blocks_b61_split_lines" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_split_lines_parent_id_idx" ON "_pages_v_blocks_b61_split_lines" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_prose_lines_order_idx" ON "_pages_v_blocks_b61_prose_lines" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_prose_lines_parent_id_idx" ON "_pages_v_blocks_b61_prose_lines" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_card_grid_lines_order_idx" ON "_pages_v_blocks_b61_card_grid_lines" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_card_grid_lines_parent_id_idx" ON "_pages_v_blocks_b61_card_grid_lines" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_stats_band_lines_order_idx" ON "_pages_v_blocks_b61_stats_band_lines" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_stats_band_lines_parent_id_idx" ON "_pages_v_blocks_b61_stats_band_lines" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_gallery_lines_order_idx" ON "_pages_v_blocks_b61_gallery_lines" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_gallery_lines_parent_id_idx" ON "_pages_v_blocks_b61_gallery_lines" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_accordion_lines_order_idx" ON "_pages_v_blocks_b61_accordion_lines" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_accordion_lines_parent_id_idx" ON "_pages_v_blocks_b61_accordion_lines" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_tabs_lines_order_idx" ON "_pages_v_blocks_b61_tabs_lines" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_tabs_lines_parent_id_idx" ON "_pages_v_blocks_b61_tabs_lines" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_pillars_lines_order_idx" ON "_pages_v_blocks_b61_pillars_lines" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_pillars_lines_parent_id_idx" ON "_pages_v_blocks_b61_pillars_lines" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_carousel_lines_order_idx" ON "_pages_v_blocks_b61_carousel_lines" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_carousel_lines_parent_id_idx" ON "_pages_v_blocks_b61_carousel_lines" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_cta_lines_order_idx" ON "_pages_v_blocks_b61_cta_lines" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_cta_lines_parent_id_idx" ON "_pages_v_blocks_b61_cta_lines" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_form_lines_order_idx" ON "_pages_v_blocks_b61_form_lines" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_form_lines_parent_id_idx" ON "_pages_v_blocks_b61_form_lines" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_logos_lines_order_idx" ON "_pages_v_blocks_b61_logos_lines" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_logos_lines_parent_id_idx" ON "_pages_v_blocks_b61_logos_lines" USING btree ("_parent_id");
  ALTER TABLE "pages_blocks_b61_hero" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_b61_split" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_b61_prose" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_b61_card_grid" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_b61_stats_band" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_b61_gallery" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_b61_accordion" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_b61_tabs" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_b61_pillars" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_b61_carousel" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_b61_cta" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_b61_form" DROP COLUMN "heading";
  ALTER TABLE "pages_blocks_b61_logos" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_b61_hero" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_b61_split" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_b61_prose" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_b61_card_grid" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_b61_stats_band" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_b61_gallery" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_b61_accordion" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_b61_tabs" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_b61_pillars" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_b61_carousel" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_b61_cta" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_b61_form" DROP COLUMN "heading";
  ALTER TABLE "_pages_v_blocks_b61_logos" DROP COLUMN "heading";`)
}
