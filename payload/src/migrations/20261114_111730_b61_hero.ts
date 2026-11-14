import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import { upgradeDemoHeroes } from '../b61/upgrade'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_b61_hero_buttons_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum_pages_blocks_b61_hero_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum_pages_blocks_b61_hero_heading_level" AS ENUM('h1', 'h2', 'h3');
  CREATE TYPE "public"."enum_pages_blocks_b61_hero_subheadline_scale" AS ENUM('display', 'body', 'meta');
  CREATE TYPE "public"."enum_pages_blocks_b61_hero_background_type" AS ENUM('image', 'slideshow', 'video');
  CREATE TYPE "public"."enum_pages_blocks_b61_hero_layout_mode" AS ENUM('cover', 'band');
  CREATE TYPE "public"."enum_pages_blocks_b61_hero_height" AS ENUM('short', 'medium', 'tall', 'full');
  CREATE TYPE "public"."enum_pages_blocks_b61_hero_band_size" AS ENUM('compact', 'standard');
  CREATE TYPE "public"."enum_pages_blocks_b61_hero_vertical_position" AS ENUM('top', 'center', 'bottom');
  CREATE TYPE "public"."enum_pages_blocks_b61_hero_text_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_b61_hero_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_hero_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_hero_overlay" AS ENUM('gradient', 'wash');
  CREATE TYPE "public"."enum_pages_blocks_b61_hero_surface" AS ENUM('light', 'primary', 'secondary');
  CREATE TYPE "public"."enum_pages_blocks_b61_hero_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum_pages_blocks_b61_hero_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_hero_buttons_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_hero_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_hero_heading_level" AS ENUM('h1', 'h2', 'h3');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_hero_subheadline_scale" AS ENUM('display', 'body', 'meta');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_hero_background_type" AS ENUM('image', 'slideshow', 'video');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_hero_layout_mode" AS ENUM('cover', 'band');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_hero_height" AS ENUM('short', 'medium', 'tall', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_hero_band_size" AS ENUM('compact', 'standard');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_hero_vertical_position" AS ENUM('top', 'center', 'bottom');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_hero_text_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_hero_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_hero_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_hero_overlay" AS ENUM('gradient', 'wash');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_hero_surface" AS ENUM('light', 'primary', 'secondary');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_hero_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_hero_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum_school_settings_ui_font" AS ENUM('Montserrat', 'Inter', 'Poppins', 'Lato', 'Source Sans 3');
  CREATE TYPE "public"."enum__school_settings_v_version_ui_font" AS ENUM('Montserrat', 'Inter', 'Poppins', 'Lato', 'Source Sans 3');
  ALTER TYPE "public"."enum_school_settings_heading_font" ADD VALUE 'EB Garamond' BEFORE 'Montserrat';
  ALTER TYPE "public"."enum_school_settings_body_font" ADD VALUE 'EB Garamond';
  ALTER TYPE "public"."enum__school_settings_v_version_heading_font" ADD VALUE 'EB Garamond' BEFORE 'Montserrat';
  ALTER TYPE "public"."enum__school_settings_v_version_body_font" ADD VALUE 'EB Garamond';
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
  
  CREATE TABLE "pages_blocks_b61_hero_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link_type" "enum_pages_blocks_b61_hero_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"variant" "enum_pages_blocks_b61_hero_buttons_variant" DEFAULT 'primary',
  	"full_width" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_hero_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_b61_hero_collage" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_b61_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading_level" "enum_pages_blocks_b61_hero_heading_level" DEFAULT 'h1',
  	"subheadline" varchar,
  	"subheadline_scale" "enum_pages_blocks_b61_hero_subheadline_scale" DEFAULT 'body',
  	"background_type" "enum_pages_blocks_b61_hero_background_type" DEFAULT 'image',
  	"image_id" integer,
  	"video_id" integer,
  	"video_webm_id" integer,
  	"poster_id" integer,
  	"overlay_strength" numeric,
  	"layout_mode" "enum_pages_blocks_b61_hero_layout_mode" DEFAULT 'cover',
  	"height" "enum_pages_blocks_b61_hero_height" DEFAULT 'tall',
  	"band_size" "enum_pages_blocks_b61_hero_band_size" DEFAULT 'standard',
  	"vertical_position" "enum_pages_blocks_b61_hero_vertical_position" DEFAULT 'bottom',
  	"text_align" "enum_pages_blocks_b61_hero_text_align" DEFAULT 'left',
  	"subheadline_width" numeric,
  	"column_balance" numeric,
  	"pad_top" "enum_pages_blocks_b61_hero_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum_pages_blocks_b61_hero_pad_bottom" DEFAULT 'normal',
  	"overlay" "enum_pages_blocks_b61_hero_overlay" DEFAULT 'gradient',
  	"surface" "enum_pages_blocks_b61_hero_surface" DEFAULT 'primary',
  	"eyebrow_rule" "enum_pages_blocks_b61_hero_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum_pages_blocks_b61_hero_entrance" DEFAULT 'on',
  	"block_name" varchar
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
  
  CREATE TABLE "_pages_v_blocks_b61_hero_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link_type" "enum__pages_v_blocks_b61_hero_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"variant" "enum__pages_v_blocks_b61_hero_buttons_variant" DEFAULT 'primary',
  	"full_width" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_hero_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_hero_collage" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading_level" "enum__pages_v_blocks_b61_hero_heading_level" DEFAULT 'h1',
  	"subheadline" varchar,
  	"subheadline_scale" "enum__pages_v_blocks_b61_hero_subheadline_scale" DEFAULT 'body',
  	"background_type" "enum__pages_v_blocks_b61_hero_background_type" DEFAULT 'image',
  	"image_id" integer,
  	"video_id" integer,
  	"video_webm_id" integer,
  	"poster_id" integer,
  	"overlay_strength" numeric,
  	"layout_mode" "enum__pages_v_blocks_b61_hero_layout_mode" DEFAULT 'cover',
  	"height" "enum__pages_v_blocks_b61_hero_height" DEFAULT 'tall',
  	"band_size" "enum__pages_v_blocks_b61_hero_band_size" DEFAULT 'standard',
  	"vertical_position" "enum__pages_v_blocks_b61_hero_vertical_position" DEFAULT 'bottom',
  	"text_align" "enum__pages_v_blocks_b61_hero_text_align" DEFAULT 'left',
  	"subheadline_width" numeric,
  	"column_balance" numeric,
  	"pad_top" "enum__pages_v_blocks_b61_hero_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum__pages_v_blocks_b61_hero_pad_bottom" DEFAULT 'normal',
  	"overlay" "enum__pages_v_blocks_b61_hero_overlay" DEFAULT 'gradient',
  	"surface" "enum__pages_v_blocks_b61_hero_surface" DEFAULT 'primary',
  	"eyebrow_rule" "enum__pages_v_blocks_b61_hero_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum__pages_v_blocks_b61_hero_entrance" DEFAULT 'on',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  DROP TABLE "pages_blocks_hero_buttons" CASCADE;
  DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_buttons" CASCADE;
  DROP TABLE "_pages_v_blocks_hero" CASCADE;
  ALTER TABLE "school_settings" ADD COLUMN "accent_color" varchar DEFAULT '#B23A2E';
  ALTER TABLE "school_settings" ADD COLUMN "paper_color" varchar DEFAULT '#F7F3EC';
  ALTER TABLE "school_settings" ADD COLUMN "primary_deep" varchar;
  ALTER TABLE "school_settings" ADD COLUMN "secondary_soft" varchar;
  ALTER TABLE "school_settings" ADD COLUMN "accent_strong" varchar;
  ALTER TABLE "school_settings" ADD COLUMN "accent_deep" varchar;
  ALTER TABLE "school_settings" ADD COLUMN "ui_font" "enum_school_settings_ui_font" DEFAULT 'Montserrat';
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_accent_color" varchar DEFAULT '#B23A2E';
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_paper_color" varchar DEFAULT '#F7F3EC';
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_primary_deep" varchar;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_secondary_soft" varchar;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_accent_strong" varchar;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_accent_deep" varchar;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_ui_font" "enum__school_settings_v_version_ui_font" DEFAULT 'Montserrat';
  ALTER TABLE "pages_blocks_b61_hero_lines" ADD CONSTRAINT "pages_blocks_b61_hero_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_hero_meta_items" ADD CONSTRAINT "pages_blocks_b61_hero_meta_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_hero_buttons" ADD CONSTRAINT "pages_blocks_b61_hero_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_hero_buttons" ADD CONSTRAINT "pages_blocks_b61_hero_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_hero_slides" ADD CONSTRAINT "pages_blocks_b61_hero_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_hero_slides" ADD CONSTRAINT "pages_blocks_b61_hero_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_hero_collage" ADD CONSTRAINT "pages_blocks_b61_hero_collage_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_hero_collage" ADD CONSTRAINT "pages_blocks_b61_hero_collage_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_hero" ADD CONSTRAINT "pages_blocks_b61_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_hero" ADD CONSTRAINT "pages_blocks_b61_hero_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_hero" ADD CONSTRAINT "pages_blocks_b61_hero_video_webm_id_media_id_fk" FOREIGN KEY ("video_webm_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_hero" ADD CONSTRAINT "pages_blocks_b61_hero_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_hero" ADD CONSTRAINT "pages_blocks_b61_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_hero_lines" ADD CONSTRAINT "_pages_v_blocks_b61_hero_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_hero_meta_items" ADD CONSTRAINT "_pages_v_blocks_b61_hero_meta_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_hero_buttons" ADD CONSTRAINT "_pages_v_blocks_b61_hero_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_hero_buttons" ADD CONSTRAINT "_pages_v_blocks_b61_hero_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_hero_slides" ADD CONSTRAINT "_pages_v_blocks_b61_hero_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_hero_slides" ADD CONSTRAINT "_pages_v_blocks_b61_hero_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_hero_collage" ADD CONSTRAINT "_pages_v_blocks_b61_hero_collage_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_hero_collage" ADD CONSTRAINT "_pages_v_blocks_b61_hero_collage_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_hero" ADD CONSTRAINT "_pages_v_blocks_b61_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_hero" ADD CONSTRAINT "_pages_v_blocks_b61_hero_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_hero" ADD CONSTRAINT "_pages_v_blocks_b61_hero_video_webm_id_media_id_fk" FOREIGN KEY ("video_webm_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_hero" ADD CONSTRAINT "_pages_v_blocks_b61_hero_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_hero" ADD CONSTRAINT "_pages_v_blocks_b61_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_b61_hero_lines_order_idx" ON "pages_blocks_b61_hero_lines" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_hero_lines_parent_id_idx" ON "pages_blocks_b61_hero_lines" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_hero_meta_items_order_idx" ON "pages_blocks_b61_hero_meta_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_hero_meta_items_parent_id_idx" ON "pages_blocks_b61_hero_meta_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_hero_buttons_order_idx" ON "pages_blocks_b61_hero_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_hero_buttons_parent_id_idx" ON "pages_blocks_b61_hero_buttons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_hero_buttons_link_link_page_idx" ON "pages_blocks_b61_hero_buttons" USING btree ("link_page_id");
  CREATE INDEX "pages_blocks_b61_hero_slides_order_idx" ON "pages_blocks_b61_hero_slides" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_hero_slides_parent_id_idx" ON "pages_blocks_b61_hero_slides" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_hero_slides_image_idx" ON "pages_blocks_b61_hero_slides" USING btree ("image_id");
  CREATE INDEX "pages_blocks_b61_hero_collage_order_idx" ON "pages_blocks_b61_hero_collage" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_hero_collage_parent_id_idx" ON "pages_blocks_b61_hero_collage" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_hero_collage_image_idx" ON "pages_blocks_b61_hero_collage" USING btree ("image_id");
  CREATE INDEX "pages_blocks_b61_hero_order_idx" ON "pages_blocks_b61_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_hero_parent_id_idx" ON "pages_blocks_b61_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_hero_path_idx" ON "pages_blocks_b61_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_b61_hero_image_idx" ON "pages_blocks_b61_hero" USING btree ("image_id");
  CREATE INDEX "pages_blocks_b61_hero_video_idx" ON "pages_blocks_b61_hero" USING btree ("video_id");
  CREATE INDEX "pages_blocks_b61_hero_video_webm_idx" ON "pages_blocks_b61_hero" USING btree ("video_webm_id");
  CREATE INDEX "pages_blocks_b61_hero_poster_idx" ON "pages_blocks_b61_hero" USING btree ("poster_id");
  CREATE INDEX "_pages_v_blocks_b61_hero_lines_order_idx" ON "_pages_v_blocks_b61_hero_lines" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_hero_lines_parent_id_idx" ON "_pages_v_blocks_b61_hero_lines" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_hero_meta_items_order_idx" ON "_pages_v_blocks_b61_hero_meta_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_hero_meta_items_parent_id_idx" ON "_pages_v_blocks_b61_hero_meta_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_hero_buttons_order_idx" ON "_pages_v_blocks_b61_hero_buttons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_hero_buttons_parent_id_idx" ON "_pages_v_blocks_b61_hero_buttons" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_hero_buttons_link_link_page_idx" ON "_pages_v_blocks_b61_hero_buttons" USING btree ("link_page_id");
  CREATE INDEX "_pages_v_blocks_b61_hero_slides_order_idx" ON "_pages_v_blocks_b61_hero_slides" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_hero_slides_parent_id_idx" ON "_pages_v_blocks_b61_hero_slides" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_hero_slides_image_idx" ON "_pages_v_blocks_b61_hero_slides" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_b61_hero_collage_order_idx" ON "_pages_v_blocks_b61_hero_collage" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_hero_collage_parent_id_idx" ON "_pages_v_blocks_b61_hero_collage" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_hero_collage_image_idx" ON "_pages_v_blocks_b61_hero_collage" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_b61_hero_order_idx" ON "_pages_v_blocks_b61_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_hero_parent_id_idx" ON "_pages_v_blocks_b61_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_hero_path_idx" ON "_pages_v_blocks_b61_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_b61_hero_image_idx" ON "_pages_v_blocks_b61_hero" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_b61_hero_video_idx" ON "_pages_v_blocks_b61_hero" USING btree ("video_id");
  CREATE INDEX "_pages_v_blocks_b61_hero_video_webm_idx" ON "_pages_v_blocks_b61_hero" USING btree ("video_webm_id");
  CREATE INDEX "_pages_v_blocks_b61_hero_poster_idx" ON "_pages_v_blocks_b61_hero" USING btree ("poster_id");
  DROP TYPE "public"."enum_pages_blocks_hero_buttons_style";
  DROP TYPE "public"."enum_pages_blocks_hero_layout";
  DROP TYPE "public"."enum_pages_blocks_hero_tone";
  DROP TYPE "public"."enum__pages_v_blocks_hero_buttons_style";
  DROP TYPE "public"."enum__pages_v_blocks_hero_layout";
  DROP TYPE "public"."enum__pages_v_blocks_hero_tone";`)

  // Content: put a B61 Hero on the demo pages that lost their old hero.
  await upgradeDemoHeroes(payload, req)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_hero_buttons_style" AS ENUM('primary', 'secondary', 'link');
  CREATE TYPE "public"."enum_pages_blocks_hero_layout" AS ENUM('image-right', 'image-background', 'centered');
  CREATE TYPE "public"."enum_pages_blocks_hero_tone" AS ENUM('light', 'muted', 'brand', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_buttons_style" AS ENUM('primary', 'secondary', 'link');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_layout" AS ENUM('image-right', 'image-background', 'centered');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_tone" AS ENUM('light', 'muted', 'brand', 'dark');
  CREATE TABLE "pages_blocks_hero_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"style" "enum_pages_blocks_hero_buttons_style" DEFAULT 'primary'
  );
  
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"subheading" varchar,
  	"image_id" integer,
  	"layout" "enum_pages_blocks_hero_layout" DEFAULT 'image-right',
  	"tone" "enum_pages_blocks_hero_tone" DEFAULT 'light',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"style" "enum__pages_v_blocks_hero_buttons_style" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"subheading" varchar,
  	"image_id" integer,
  	"layout" "enum__pages_v_blocks_hero_layout" DEFAULT 'image-right',
  	"tone" "enum__pages_v_blocks_hero_tone" DEFAULT 'light',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  DROP TABLE "pages_blocks_b61_hero_lines" CASCADE;
  DROP TABLE "pages_blocks_b61_hero_meta_items" CASCADE;
  DROP TABLE "pages_blocks_b61_hero_buttons" CASCADE;
  DROP TABLE "pages_blocks_b61_hero_slides" CASCADE;
  DROP TABLE "pages_blocks_b61_hero_collage" CASCADE;
  DROP TABLE "pages_blocks_b61_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_hero_lines" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_hero_meta_items" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_hero_buttons" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_hero_slides" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_hero_collage" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_hero" CASCADE;
  ALTER TABLE "school_settings" ALTER COLUMN "heading_font" SET DATA TYPE text;
  ALTER TABLE "school_settings" ALTER COLUMN "heading_font" SET DEFAULT 'Fraunces'::text;
  DROP TYPE "public"."enum_school_settings_heading_font";
  CREATE TYPE "public"."enum_school_settings_heading_font" AS ENUM('Fraunces', 'Playfair Display', 'Merriweather', 'Montserrat', 'Poppins');
  ALTER TABLE "school_settings" ALTER COLUMN "heading_font" SET DEFAULT 'Fraunces'::"public"."enum_school_settings_heading_font";
  ALTER TABLE "school_settings" ALTER COLUMN "heading_font" SET DATA TYPE "public"."enum_school_settings_heading_font" USING "heading_font"::"public"."enum_school_settings_heading_font";
  ALTER TABLE "school_settings" ALTER COLUMN "body_font" SET DATA TYPE text;
  ALTER TABLE "school_settings" ALTER COLUMN "body_font" SET DEFAULT 'Inter'::text;
  DROP TYPE "public"."enum_school_settings_body_font";
  CREATE TYPE "public"."enum_school_settings_body_font" AS ENUM('Inter', 'Source Sans 3', 'Lato', 'Open Sans');
  ALTER TABLE "school_settings" ALTER COLUMN "body_font" SET DEFAULT 'Inter'::"public"."enum_school_settings_body_font";
  ALTER TABLE "school_settings" ALTER COLUMN "body_font" SET DATA TYPE "public"."enum_school_settings_body_font" USING "body_font"::"public"."enum_school_settings_body_font";
  ALTER TABLE "_school_settings_v" ALTER COLUMN "version_heading_font" SET DATA TYPE text;
  ALTER TABLE "_school_settings_v" ALTER COLUMN "version_heading_font" SET DEFAULT 'Fraunces'::text;
  DROP TYPE "public"."enum__school_settings_v_version_heading_font";
  CREATE TYPE "public"."enum__school_settings_v_version_heading_font" AS ENUM('Fraunces', 'Playfair Display', 'Merriweather', 'Montserrat', 'Poppins');
  ALTER TABLE "_school_settings_v" ALTER COLUMN "version_heading_font" SET DEFAULT 'Fraunces'::"public"."enum__school_settings_v_version_heading_font";
  ALTER TABLE "_school_settings_v" ALTER COLUMN "version_heading_font" SET DATA TYPE "public"."enum__school_settings_v_version_heading_font" USING "version_heading_font"::"public"."enum__school_settings_v_version_heading_font";
  ALTER TABLE "_school_settings_v" ALTER COLUMN "version_body_font" SET DATA TYPE text;
  ALTER TABLE "_school_settings_v" ALTER COLUMN "version_body_font" SET DEFAULT 'Inter'::text;
  DROP TYPE "public"."enum__school_settings_v_version_body_font";
  CREATE TYPE "public"."enum__school_settings_v_version_body_font" AS ENUM('Inter', 'Source Sans 3', 'Lato', 'Open Sans');
  ALTER TABLE "_school_settings_v" ALTER COLUMN "version_body_font" SET DEFAULT 'Inter'::"public"."enum__school_settings_v_version_body_font";
  ALTER TABLE "_school_settings_v" ALTER COLUMN "version_body_font" SET DATA TYPE "public"."enum__school_settings_v_version_body_font" USING "version_body_font"::"public"."enum__school_settings_v_version_body_font";
  ALTER TABLE "pages_blocks_hero_buttons" ADD CONSTRAINT "pages_blocks_hero_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_buttons" ADD CONSTRAINT "_pages_v_blocks_hero_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_buttons_order_idx" ON "pages_blocks_hero_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_buttons_parent_id_idx" ON "pages_blocks_hero_buttons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_image_idx" ON "pages_blocks_hero" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_hero_buttons_order_idx" ON "_pages_v_blocks_hero_buttons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_buttons_parent_id_idx" ON "_pages_v_blocks_hero_buttons" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_order_idx" ON "_pages_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_parent_id_idx" ON "_pages_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_path_idx" ON "_pages_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_image_idx" ON "_pages_v_blocks_hero" USING btree ("image_id");
  ALTER TABLE "school_settings" DROP COLUMN "accent_color";
  ALTER TABLE "school_settings" DROP COLUMN "paper_color";
  ALTER TABLE "school_settings" DROP COLUMN "primary_deep";
  ALTER TABLE "school_settings" DROP COLUMN "secondary_soft";
  ALTER TABLE "school_settings" DROP COLUMN "accent_strong";
  ALTER TABLE "school_settings" DROP COLUMN "accent_deep";
  ALTER TABLE "school_settings" DROP COLUMN "ui_font";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_accent_color";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_paper_color";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_primary_deep";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_secondary_soft";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_accent_strong";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_accent_deep";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_ui_font";
  DROP TYPE "public"."enum_pages_blocks_b61_hero_buttons_link_type";
  DROP TYPE "public"."enum_pages_blocks_b61_hero_buttons_variant";
  DROP TYPE "public"."enum_pages_blocks_b61_hero_heading_level";
  DROP TYPE "public"."enum_pages_blocks_b61_hero_subheadline_scale";
  DROP TYPE "public"."enum_pages_blocks_b61_hero_background_type";
  DROP TYPE "public"."enum_pages_blocks_b61_hero_layout_mode";
  DROP TYPE "public"."enum_pages_blocks_b61_hero_height";
  DROP TYPE "public"."enum_pages_blocks_b61_hero_band_size";
  DROP TYPE "public"."enum_pages_blocks_b61_hero_vertical_position";
  DROP TYPE "public"."enum_pages_blocks_b61_hero_text_align";
  DROP TYPE "public"."enum_pages_blocks_b61_hero_pad_top";
  DROP TYPE "public"."enum_pages_blocks_b61_hero_pad_bottom";
  DROP TYPE "public"."enum_pages_blocks_b61_hero_overlay";
  DROP TYPE "public"."enum_pages_blocks_b61_hero_surface";
  DROP TYPE "public"."enum_pages_blocks_b61_hero_eyebrow_rule";
  DROP TYPE "public"."enum_pages_blocks_b61_hero_entrance";
  DROP TYPE "public"."enum__pages_v_blocks_b61_hero_buttons_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_b61_hero_buttons_variant";
  DROP TYPE "public"."enum__pages_v_blocks_b61_hero_heading_level";
  DROP TYPE "public"."enum__pages_v_blocks_b61_hero_subheadline_scale";
  DROP TYPE "public"."enum__pages_v_blocks_b61_hero_background_type";
  DROP TYPE "public"."enum__pages_v_blocks_b61_hero_layout_mode";
  DROP TYPE "public"."enum__pages_v_blocks_b61_hero_height";
  DROP TYPE "public"."enum__pages_v_blocks_b61_hero_band_size";
  DROP TYPE "public"."enum__pages_v_blocks_b61_hero_vertical_position";
  DROP TYPE "public"."enum__pages_v_blocks_b61_hero_text_align";
  DROP TYPE "public"."enum__pages_v_blocks_b61_hero_pad_top";
  DROP TYPE "public"."enum__pages_v_blocks_b61_hero_pad_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_b61_hero_overlay";
  DROP TYPE "public"."enum__pages_v_blocks_b61_hero_surface";
  DROP TYPE "public"."enum__pages_v_blocks_b61_hero_eyebrow_rule";
  DROP TYPE "public"."enum__pages_v_blocks_b61_hero_entrance";
  DROP TYPE "public"."enum_school_settings_ui_font";
  DROP TYPE "public"."enum__school_settings_v_version_ui_font";`)
}
