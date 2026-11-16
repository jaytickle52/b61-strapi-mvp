import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_b61_card_grid_subheads" CASCADE;
  DROP TABLE "pages_blocks_b61_stats_band_subheads" CASCADE;
  DROP TABLE "pages_blocks_b61_gallery_subheads" CASCADE;
  DROP TABLE "pages_blocks_b61_accordion_subheads" CASCADE;
  DROP TABLE "pages_blocks_b61_tabs_subheads" CASCADE;
  DROP TABLE "pages_blocks_b61_pillars_subheads" CASCADE;
  DROP TABLE "pages_blocks_b61_carousel_subheads" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_card_grid_subheads" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_stats_band_subheads" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_gallery_subheads" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_accordion_subheads" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_tabs_subheads" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_pillars_subheads" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_carousel_subheads" CASCADE;
  ALTER TABLE "pages_blocks_b61_hero" ALTER COLUMN "subheadline_scale" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_b61_hero" ALTER COLUMN "subheadline_scale" SET DEFAULT 'body'::text;
  DROP TYPE "public"."enum_pages_blocks_b61_hero_subheadline_scale";
  CREATE TYPE "public"."enum_pages_blocks_b61_hero_subheadline_scale" AS ENUM('body', 'display', 'meta');
  ALTER TABLE "pages_blocks_b61_hero" ALTER COLUMN "subheadline_scale" SET DEFAULT 'body'::"public"."enum_pages_blocks_b61_hero_subheadline_scale";
  ALTER TABLE "pages_blocks_b61_hero" ALTER COLUMN "subheadline_scale" SET DATA TYPE "public"."enum_pages_blocks_b61_hero_subheadline_scale" USING "subheadline_scale"::"public"."enum_pages_blocks_b61_hero_subheadline_scale";
  ALTER TABLE "pages_blocks_b61_stats_band" ALTER COLUMN "item_surface" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_b61_stats_band" ALTER COLUMN "item_surface" SET DEFAULT 'card'::text;
  DROP TYPE "public"."enum_pages_blocks_b61_stats_band_item_surface";
  CREATE TYPE "public"."enum_pages_blocks_b61_stats_band_item_surface" AS ENUM('outline', 'light', 'card', 'soft', 'dark', 'accent');
  ALTER TABLE "pages_blocks_b61_stats_band" ALTER COLUMN "item_surface" SET DEFAULT 'card'::"public"."enum_pages_blocks_b61_stats_band_item_surface";
  ALTER TABLE "pages_blocks_b61_stats_band" ALTER COLUMN "item_surface" SET DATA TYPE "public"."enum_pages_blocks_b61_stats_band_item_surface" USING "item_surface"::"public"."enum_pages_blocks_b61_stats_band_item_surface";
  ALTER TABLE "pages_blocks_b61_accordion" ALTER COLUMN "item_surface" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_b61_accordion" ALTER COLUMN "item_surface" SET DEFAULT 'card'::text;
  DROP TYPE "public"."enum_pages_blocks_b61_accordion_item_surface";
  CREATE TYPE "public"."enum_pages_blocks_b61_accordion_item_surface" AS ENUM('outline', 'light', 'card', 'soft', 'dark', 'accent');
  ALTER TABLE "pages_blocks_b61_accordion" ALTER COLUMN "item_surface" SET DEFAULT 'card'::"public"."enum_pages_blocks_b61_accordion_item_surface";
  ALTER TABLE "pages_blocks_b61_accordion" ALTER COLUMN "item_surface" SET DATA TYPE "public"."enum_pages_blocks_b61_accordion_item_surface" USING "item_surface"::"public"."enum_pages_blocks_b61_accordion_item_surface";
  ALTER TABLE "pages_blocks_b61_button_bar" ALTER COLUMN "first_color" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_b61_button_bar" ALTER COLUMN "first_color" SET DEFAULT 'dark'::text;
  DROP TYPE "public"."enum_pages_blocks_b61_button_bar_first_color";
  CREATE TYPE "public"."enum_pages_blocks_b61_button_bar_first_color" AS ENUM('plain', 'soft', 'dark', 'accent');
  ALTER TABLE "pages_blocks_b61_button_bar" ALTER COLUMN "first_color" SET DEFAULT 'dark'::"public"."enum_pages_blocks_b61_button_bar_first_color";
  ALTER TABLE "pages_blocks_b61_button_bar" ALTER COLUMN "first_color" SET DATA TYPE "public"."enum_pages_blocks_b61_button_bar_first_color" USING "first_color"::"public"."enum_pages_blocks_b61_button_bar_first_color";
  ALTER TABLE "pages_blocks_b61_button_bar" ALTER COLUMN "second_color" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_b61_button_bar" ALTER COLUMN "second_color" SET DEFAULT 'accent'::text;
  DROP TYPE "public"."enum_pages_blocks_b61_button_bar_second_color";
  CREATE TYPE "public"."enum_pages_blocks_b61_button_bar_second_color" AS ENUM('plain', 'soft', 'dark', 'accent');
  ALTER TABLE "pages_blocks_b61_button_bar" ALTER COLUMN "second_color" SET DEFAULT 'accent'::"public"."enum_pages_blocks_b61_button_bar_second_color";
  ALTER TABLE "pages_blocks_b61_button_bar" ALTER COLUMN "second_color" SET DATA TYPE "public"."enum_pages_blocks_b61_button_bar_second_color" USING "second_color"::"public"."enum_pages_blocks_b61_button_bar_second_color";
  ALTER TABLE "pages_blocks_b61_rail" ALTER COLUMN "surface" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_b61_rail" ALTER COLUMN "surface" SET DEFAULT 'plain'::text;
  DROP TYPE "public"."enum_pages_blocks_b61_rail_surface";
  CREATE TYPE "public"."enum_pages_blocks_b61_rail_surface" AS ENUM('none', 'plain', 'soft', 'dark', 'accent');
  ALTER TABLE "pages_blocks_b61_rail" ALTER COLUMN "surface" SET DEFAULT 'plain'::"public"."enum_pages_blocks_b61_rail_surface";
  ALTER TABLE "pages_blocks_b61_rail" ALTER COLUMN "surface" SET DATA TYPE "public"."enum_pages_blocks_b61_rail_surface" USING "surface"::"public"."enum_pages_blocks_b61_rail_surface";
  ALTER TABLE "_pages_v_blocks_b61_hero" ALTER COLUMN "subheadline_scale" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_b61_hero" ALTER COLUMN "subheadline_scale" SET DEFAULT 'body'::text;
  DROP TYPE "public"."enum__pages_v_blocks_b61_hero_subheadline_scale";
  CREATE TYPE "public"."enum__pages_v_blocks_b61_hero_subheadline_scale" AS ENUM('body', 'display', 'meta');
  ALTER TABLE "_pages_v_blocks_b61_hero" ALTER COLUMN "subheadline_scale" SET DEFAULT 'body'::"public"."enum__pages_v_blocks_b61_hero_subheadline_scale";
  ALTER TABLE "_pages_v_blocks_b61_hero" ALTER COLUMN "subheadline_scale" SET DATA TYPE "public"."enum__pages_v_blocks_b61_hero_subheadline_scale" USING "subheadline_scale"::"public"."enum__pages_v_blocks_b61_hero_subheadline_scale";
  ALTER TABLE "_pages_v_blocks_b61_stats_band" ALTER COLUMN "item_surface" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_b61_stats_band" ALTER COLUMN "item_surface" SET DEFAULT 'card'::text;
  DROP TYPE "public"."enum__pages_v_blocks_b61_stats_band_item_surface";
  CREATE TYPE "public"."enum__pages_v_blocks_b61_stats_band_item_surface" AS ENUM('outline', 'light', 'card', 'soft', 'dark', 'accent');
  ALTER TABLE "_pages_v_blocks_b61_stats_band" ALTER COLUMN "item_surface" SET DEFAULT 'card'::"public"."enum__pages_v_blocks_b61_stats_band_item_surface";
  ALTER TABLE "_pages_v_blocks_b61_stats_band" ALTER COLUMN "item_surface" SET DATA TYPE "public"."enum__pages_v_blocks_b61_stats_band_item_surface" USING "item_surface"::"public"."enum__pages_v_blocks_b61_stats_band_item_surface";
  ALTER TABLE "_pages_v_blocks_b61_accordion" ALTER COLUMN "item_surface" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_b61_accordion" ALTER COLUMN "item_surface" SET DEFAULT 'card'::text;
  DROP TYPE "public"."enum__pages_v_blocks_b61_accordion_item_surface";
  CREATE TYPE "public"."enum__pages_v_blocks_b61_accordion_item_surface" AS ENUM('outline', 'light', 'card', 'soft', 'dark', 'accent');
  ALTER TABLE "_pages_v_blocks_b61_accordion" ALTER COLUMN "item_surface" SET DEFAULT 'card'::"public"."enum__pages_v_blocks_b61_accordion_item_surface";
  ALTER TABLE "_pages_v_blocks_b61_accordion" ALTER COLUMN "item_surface" SET DATA TYPE "public"."enum__pages_v_blocks_b61_accordion_item_surface" USING "item_surface"::"public"."enum__pages_v_blocks_b61_accordion_item_surface";
  ALTER TABLE "_pages_v_blocks_b61_button_bar" ALTER COLUMN "first_color" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_b61_button_bar" ALTER COLUMN "first_color" SET DEFAULT 'dark'::text;
  DROP TYPE "public"."enum__pages_v_blocks_b61_button_bar_first_color";
  CREATE TYPE "public"."enum__pages_v_blocks_b61_button_bar_first_color" AS ENUM('plain', 'soft', 'dark', 'accent');
  ALTER TABLE "_pages_v_blocks_b61_button_bar" ALTER COLUMN "first_color" SET DEFAULT 'dark'::"public"."enum__pages_v_blocks_b61_button_bar_first_color";
  ALTER TABLE "_pages_v_blocks_b61_button_bar" ALTER COLUMN "first_color" SET DATA TYPE "public"."enum__pages_v_blocks_b61_button_bar_first_color" USING "first_color"::"public"."enum__pages_v_blocks_b61_button_bar_first_color";
  ALTER TABLE "_pages_v_blocks_b61_button_bar" ALTER COLUMN "second_color" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_b61_button_bar" ALTER COLUMN "second_color" SET DEFAULT 'accent'::text;
  DROP TYPE "public"."enum__pages_v_blocks_b61_button_bar_second_color";
  CREATE TYPE "public"."enum__pages_v_blocks_b61_button_bar_second_color" AS ENUM('plain', 'soft', 'dark', 'accent');
  ALTER TABLE "_pages_v_blocks_b61_button_bar" ALTER COLUMN "second_color" SET DEFAULT 'accent'::"public"."enum__pages_v_blocks_b61_button_bar_second_color";
  ALTER TABLE "_pages_v_blocks_b61_button_bar" ALTER COLUMN "second_color" SET DATA TYPE "public"."enum__pages_v_blocks_b61_button_bar_second_color" USING "second_color"::"public"."enum__pages_v_blocks_b61_button_bar_second_color";
  ALTER TABLE "_pages_v_blocks_b61_rail" ALTER COLUMN "surface" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_b61_rail" ALTER COLUMN "surface" SET DEFAULT 'plain'::text;
  DROP TYPE "public"."enum__pages_v_blocks_b61_rail_surface";
  CREATE TYPE "public"."enum__pages_v_blocks_b61_rail_surface" AS ENUM('none', 'plain', 'soft', 'dark', 'accent');
  ALTER TABLE "_pages_v_blocks_b61_rail" ALTER COLUMN "surface" SET DEFAULT 'plain'::"public"."enum__pages_v_blocks_b61_rail_surface";
  ALTER TABLE "_pages_v_blocks_b61_rail" ALTER COLUMN "surface" SET DATA TYPE "public"."enum__pages_v_blocks_b61_rail_surface" USING "surface"::"public"."enum__pages_v_blocks_b61_rail_surface";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_b61_card_grid_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_b61_stats_band_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_b61_gallery_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_b61_accordion_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_b61_tabs_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_b61_pillars_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_b61_carousel_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_card_grid_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_stats_band_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_gallery_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_accordion_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_tabs_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_pillars_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_carousel_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "pages_blocks_b61_hero" ALTER COLUMN "subheadline_scale" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_b61_hero" ALTER COLUMN "subheadline_scale" SET DEFAULT 'body'::text;
  DROP TYPE "public"."enum_pages_blocks_b61_hero_subheadline_scale";
  CREATE TYPE "public"."enum_pages_blocks_b61_hero_subheadline_scale" AS ENUM('display', 'body', 'meta');
  ALTER TABLE "pages_blocks_b61_hero" ALTER COLUMN "subheadline_scale" SET DEFAULT 'body'::"public"."enum_pages_blocks_b61_hero_subheadline_scale";
  ALTER TABLE "pages_blocks_b61_hero" ALTER COLUMN "subheadline_scale" SET DATA TYPE "public"."enum_pages_blocks_b61_hero_subheadline_scale" USING "subheadline_scale"::"public"."enum_pages_blocks_b61_hero_subheadline_scale";
  ALTER TABLE "pages_blocks_b61_stats_band" ALTER COLUMN "item_surface" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_b61_stats_band" ALTER COLUMN "item_surface" SET DEFAULT 'card'::text;
  DROP TYPE "public"."enum_pages_blocks_b61_stats_band_item_surface";
  CREATE TYPE "public"."enum_pages_blocks_b61_stats_band_item_surface" AS ENUM('card', 'light', 'soft', 'dark', 'accent', 'outline');
  ALTER TABLE "pages_blocks_b61_stats_band" ALTER COLUMN "item_surface" SET DEFAULT 'card'::"public"."enum_pages_blocks_b61_stats_band_item_surface";
  ALTER TABLE "pages_blocks_b61_stats_band" ALTER COLUMN "item_surface" SET DATA TYPE "public"."enum_pages_blocks_b61_stats_band_item_surface" USING "item_surface"::"public"."enum_pages_blocks_b61_stats_band_item_surface";
  ALTER TABLE "pages_blocks_b61_accordion" ALTER COLUMN "item_surface" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_b61_accordion" ALTER COLUMN "item_surface" SET DEFAULT 'card'::text;
  DROP TYPE "public"."enum_pages_blocks_b61_accordion_item_surface";
  CREATE TYPE "public"."enum_pages_blocks_b61_accordion_item_surface" AS ENUM('card', 'light', 'soft', 'dark', 'accent', 'outline');
  ALTER TABLE "pages_blocks_b61_accordion" ALTER COLUMN "item_surface" SET DEFAULT 'card'::"public"."enum_pages_blocks_b61_accordion_item_surface";
  ALTER TABLE "pages_blocks_b61_accordion" ALTER COLUMN "item_surface" SET DATA TYPE "public"."enum_pages_blocks_b61_accordion_item_surface" USING "item_surface"::"public"."enum_pages_blocks_b61_accordion_item_surface";
  ALTER TABLE "pages_blocks_b61_button_bar" ALTER COLUMN "first_color" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_b61_button_bar" ALTER COLUMN "first_color" SET DEFAULT 'dark'::text;
  DROP TYPE "public"."enum_pages_blocks_b61_button_bar_first_color";
  CREATE TYPE "public"."enum_pages_blocks_b61_button_bar_first_color" AS ENUM('dark', 'accent', 'soft', 'plain');
  ALTER TABLE "pages_blocks_b61_button_bar" ALTER COLUMN "first_color" SET DEFAULT 'dark'::"public"."enum_pages_blocks_b61_button_bar_first_color";
  ALTER TABLE "pages_blocks_b61_button_bar" ALTER COLUMN "first_color" SET DATA TYPE "public"."enum_pages_blocks_b61_button_bar_first_color" USING "first_color"::"public"."enum_pages_blocks_b61_button_bar_first_color";
  ALTER TABLE "pages_blocks_b61_button_bar" ALTER COLUMN "second_color" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_b61_button_bar" ALTER COLUMN "second_color" SET DEFAULT 'accent'::text;
  DROP TYPE "public"."enum_pages_blocks_b61_button_bar_second_color";
  CREATE TYPE "public"."enum_pages_blocks_b61_button_bar_second_color" AS ENUM('dark', 'accent', 'soft', 'plain');
  ALTER TABLE "pages_blocks_b61_button_bar" ALTER COLUMN "second_color" SET DEFAULT 'accent'::"public"."enum_pages_blocks_b61_button_bar_second_color";
  ALTER TABLE "pages_blocks_b61_button_bar" ALTER COLUMN "second_color" SET DATA TYPE "public"."enum_pages_blocks_b61_button_bar_second_color" USING "second_color"::"public"."enum_pages_blocks_b61_button_bar_second_color";
  ALTER TABLE "pages_blocks_b61_rail" ALTER COLUMN "surface" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_b61_rail" ALTER COLUMN "surface" SET DEFAULT 'plain'::text;
  DROP TYPE "public"."enum_pages_blocks_b61_rail_surface";
  CREATE TYPE "public"."enum_pages_blocks_b61_rail_surface" AS ENUM('plain', 'soft', 'dark', 'accent', 'none');
  ALTER TABLE "pages_blocks_b61_rail" ALTER COLUMN "surface" SET DEFAULT 'plain'::"public"."enum_pages_blocks_b61_rail_surface";
  ALTER TABLE "pages_blocks_b61_rail" ALTER COLUMN "surface" SET DATA TYPE "public"."enum_pages_blocks_b61_rail_surface" USING "surface"::"public"."enum_pages_blocks_b61_rail_surface";
  ALTER TABLE "_pages_v_blocks_b61_hero" ALTER COLUMN "subheadline_scale" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_b61_hero" ALTER COLUMN "subheadline_scale" SET DEFAULT 'body'::text;
  DROP TYPE "public"."enum__pages_v_blocks_b61_hero_subheadline_scale";
  CREATE TYPE "public"."enum__pages_v_blocks_b61_hero_subheadline_scale" AS ENUM('display', 'body', 'meta');
  ALTER TABLE "_pages_v_blocks_b61_hero" ALTER COLUMN "subheadline_scale" SET DEFAULT 'body'::"public"."enum__pages_v_blocks_b61_hero_subheadline_scale";
  ALTER TABLE "_pages_v_blocks_b61_hero" ALTER COLUMN "subheadline_scale" SET DATA TYPE "public"."enum__pages_v_blocks_b61_hero_subheadline_scale" USING "subheadline_scale"::"public"."enum__pages_v_blocks_b61_hero_subheadline_scale";
  ALTER TABLE "_pages_v_blocks_b61_stats_band" ALTER COLUMN "item_surface" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_b61_stats_band" ALTER COLUMN "item_surface" SET DEFAULT 'card'::text;
  DROP TYPE "public"."enum__pages_v_blocks_b61_stats_band_item_surface";
  CREATE TYPE "public"."enum__pages_v_blocks_b61_stats_band_item_surface" AS ENUM('card', 'light', 'soft', 'dark', 'accent', 'outline');
  ALTER TABLE "_pages_v_blocks_b61_stats_band" ALTER COLUMN "item_surface" SET DEFAULT 'card'::"public"."enum__pages_v_blocks_b61_stats_band_item_surface";
  ALTER TABLE "_pages_v_blocks_b61_stats_band" ALTER COLUMN "item_surface" SET DATA TYPE "public"."enum__pages_v_blocks_b61_stats_band_item_surface" USING "item_surface"::"public"."enum__pages_v_blocks_b61_stats_band_item_surface";
  ALTER TABLE "_pages_v_blocks_b61_accordion" ALTER COLUMN "item_surface" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_b61_accordion" ALTER COLUMN "item_surface" SET DEFAULT 'card'::text;
  DROP TYPE "public"."enum__pages_v_blocks_b61_accordion_item_surface";
  CREATE TYPE "public"."enum__pages_v_blocks_b61_accordion_item_surface" AS ENUM('card', 'light', 'soft', 'dark', 'accent', 'outline');
  ALTER TABLE "_pages_v_blocks_b61_accordion" ALTER COLUMN "item_surface" SET DEFAULT 'card'::"public"."enum__pages_v_blocks_b61_accordion_item_surface";
  ALTER TABLE "_pages_v_blocks_b61_accordion" ALTER COLUMN "item_surface" SET DATA TYPE "public"."enum__pages_v_blocks_b61_accordion_item_surface" USING "item_surface"::"public"."enum__pages_v_blocks_b61_accordion_item_surface";
  ALTER TABLE "_pages_v_blocks_b61_button_bar" ALTER COLUMN "first_color" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_b61_button_bar" ALTER COLUMN "first_color" SET DEFAULT 'dark'::text;
  DROP TYPE "public"."enum__pages_v_blocks_b61_button_bar_first_color";
  CREATE TYPE "public"."enum__pages_v_blocks_b61_button_bar_first_color" AS ENUM('dark', 'accent', 'soft', 'plain');
  ALTER TABLE "_pages_v_blocks_b61_button_bar" ALTER COLUMN "first_color" SET DEFAULT 'dark'::"public"."enum__pages_v_blocks_b61_button_bar_first_color";
  ALTER TABLE "_pages_v_blocks_b61_button_bar" ALTER COLUMN "first_color" SET DATA TYPE "public"."enum__pages_v_blocks_b61_button_bar_first_color" USING "first_color"::"public"."enum__pages_v_blocks_b61_button_bar_first_color";
  ALTER TABLE "_pages_v_blocks_b61_button_bar" ALTER COLUMN "second_color" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_b61_button_bar" ALTER COLUMN "second_color" SET DEFAULT 'accent'::text;
  DROP TYPE "public"."enum__pages_v_blocks_b61_button_bar_second_color";
  CREATE TYPE "public"."enum__pages_v_blocks_b61_button_bar_second_color" AS ENUM('dark', 'accent', 'soft', 'plain');
  ALTER TABLE "_pages_v_blocks_b61_button_bar" ALTER COLUMN "second_color" SET DEFAULT 'accent'::"public"."enum__pages_v_blocks_b61_button_bar_second_color";
  ALTER TABLE "_pages_v_blocks_b61_button_bar" ALTER COLUMN "second_color" SET DATA TYPE "public"."enum__pages_v_blocks_b61_button_bar_second_color" USING "second_color"::"public"."enum__pages_v_blocks_b61_button_bar_second_color";
  ALTER TABLE "_pages_v_blocks_b61_rail" ALTER COLUMN "surface" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_b61_rail" ALTER COLUMN "surface" SET DEFAULT 'plain'::text;
  DROP TYPE "public"."enum__pages_v_blocks_b61_rail_surface";
  CREATE TYPE "public"."enum__pages_v_blocks_b61_rail_surface" AS ENUM('plain', 'soft', 'dark', 'accent', 'none');
  ALTER TABLE "_pages_v_blocks_b61_rail" ALTER COLUMN "surface" SET DEFAULT 'plain'::"public"."enum__pages_v_blocks_b61_rail_surface";
  ALTER TABLE "_pages_v_blocks_b61_rail" ALTER COLUMN "surface" SET DATA TYPE "public"."enum__pages_v_blocks_b61_rail_surface" USING "surface"::"public"."enum__pages_v_blocks_b61_rail_surface";
  ALTER TABLE "pages_blocks_b61_card_grid_subheads" ADD CONSTRAINT "pages_blocks_b61_card_grid_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_stats_band_subheads" ADD CONSTRAINT "pages_blocks_b61_stats_band_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_stats_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_gallery_subheads" ADD CONSTRAINT "pages_blocks_b61_gallery_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_accordion_subheads" ADD CONSTRAINT "pages_blocks_b61_accordion_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_tabs_subheads" ADD CONSTRAINT "pages_blocks_b61_tabs_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_pillars_subheads" ADD CONSTRAINT "pages_blocks_b61_pillars_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_pillars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_carousel_subheads" ADD CONSTRAINT "pages_blocks_b61_carousel_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_card_grid_subheads" ADD CONSTRAINT "_pages_v_blocks_b61_card_grid_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_stats_band_subheads" ADD CONSTRAINT "_pages_v_blocks_b61_stats_band_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_stats_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_gallery_subheads" ADD CONSTRAINT "_pages_v_blocks_b61_gallery_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_accordion_subheads" ADD CONSTRAINT "_pages_v_blocks_b61_accordion_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_tabs_subheads" ADD CONSTRAINT "_pages_v_blocks_b61_tabs_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_pillars_subheads" ADD CONSTRAINT "_pages_v_blocks_b61_pillars_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_pillars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_carousel_subheads" ADD CONSTRAINT "_pages_v_blocks_b61_carousel_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_carousel"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_b61_card_grid_subheads_order_idx" ON "pages_blocks_b61_card_grid_subheads" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_card_grid_subheads_parent_id_idx" ON "pages_blocks_b61_card_grid_subheads" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_stats_band_subheads_order_idx" ON "pages_blocks_b61_stats_band_subheads" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_stats_band_subheads_parent_id_idx" ON "pages_blocks_b61_stats_band_subheads" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_gallery_subheads_order_idx" ON "pages_blocks_b61_gallery_subheads" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_gallery_subheads_parent_id_idx" ON "pages_blocks_b61_gallery_subheads" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_accordion_subheads_order_idx" ON "pages_blocks_b61_accordion_subheads" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_accordion_subheads_parent_id_idx" ON "pages_blocks_b61_accordion_subheads" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_tabs_subheads_order_idx" ON "pages_blocks_b61_tabs_subheads" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_tabs_subheads_parent_id_idx" ON "pages_blocks_b61_tabs_subheads" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_pillars_subheads_order_idx" ON "pages_blocks_b61_pillars_subheads" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_pillars_subheads_parent_id_idx" ON "pages_blocks_b61_pillars_subheads" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_carousel_subheads_order_idx" ON "pages_blocks_b61_carousel_subheads" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_carousel_subheads_parent_id_idx" ON "pages_blocks_b61_carousel_subheads" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_card_grid_subheads_order_idx" ON "_pages_v_blocks_b61_card_grid_subheads" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_card_grid_subheads_parent_id_idx" ON "_pages_v_blocks_b61_card_grid_subheads" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_stats_band_subheads_order_idx" ON "_pages_v_blocks_b61_stats_band_subheads" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_stats_band_subheads_parent_id_idx" ON "_pages_v_blocks_b61_stats_band_subheads" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_gallery_subheads_order_idx" ON "_pages_v_blocks_b61_gallery_subheads" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_gallery_subheads_parent_id_idx" ON "_pages_v_blocks_b61_gallery_subheads" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_accordion_subheads_order_idx" ON "_pages_v_blocks_b61_accordion_subheads" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_accordion_subheads_parent_id_idx" ON "_pages_v_blocks_b61_accordion_subheads" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_tabs_subheads_order_idx" ON "_pages_v_blocks_b61_tabs_subheads" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_tabs_subheads_parent_id_idx" ON "_pages_v_blocks_b61_tabs_subheads" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_pillars_subheads_order_idx" ON "_pages_v_blocks_b61_pillars_subheads" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_pillars_subheads_parent_id_idx" ON "_pages_v_blocks_b61_pillars_subheads" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_carousel_subheads_order_idx" ON "_pages_v_blocks_b61_carousel_subheads" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_carousel_subheads_parent_id_idx" ON "_pages_v_blocks_b61_carousel_subheads" USING btree ("_parent_id");`)
}
