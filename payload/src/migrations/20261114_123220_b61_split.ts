import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import { upgradeDemoSplits } from '../b61/upgrade'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Where each page's old "Text and image" block sat, before its table goes.
  const old = await db.execute(sql`SELECT "_parent_id" AS page, MIN("_order") AS pos FROM "pages_blocks_split" GROUP BY "_parent_id"`)
  const oldPositions: Record<number, number> = {}
  for (const r of (old as any).rows ?? []) oldPositions[Number(r.page)] = Number(r.pos)

  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_b61_split_content_blocks_type" AS ENUM('body', 'emphasis', 'quote', 'iconrow');
  CREATE TYPE "public"."enum_pages_blocks_b61_split_content_blocks_icon" AS ENUM('dot', 'check', 'email', 'phone', 'location', 'calendar', 'clock', 'link', 'star', 'heart', 'book', 'people', 'cross', 'school');
  CREATE TYPE "public"."enum_pages_blocks_b61_split_content_blocks_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum_pages_blocks_b61_split_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum_pages_blocks_b61_split_buttons_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum_pages_blocks_b61_split_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum_pages_blocks_b61_split_media" AS ENUM('photo', 'gallery', 'video');
  CREATE TYPE "public"."enum_pages_blocks_b61_split_columns" AS ENUM('1', '2', '3');
  CREATE TYPE "public"."enum_pages_blocks_b61_split_image_shape" AS ENUM('fixed', 'portrait', 'square', 'landscape', 'wide');
  CREATE TYPE "public"."enum_pages_blocks_b61_split_image_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_b61_split_vertical_position" AS ENUM('top', 'center');
  CREATE TYPE "public"."enum_pages_blocks_b61_split_stack_order" AS ENUM('text', 'media');
  CREATE TYPE "public"."enum_pages_blocks_b61_split_column_height" AS ENUM('fit', 'fill');
  CREATE TYPE "public"."enum_pages_blocks_b61_split_heading_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_b61_split_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_split_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_split_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_pages_blocks_b61_split_text_panel" AS ENUM('none', 'plain', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_pages_blocks_b61_split_frame_color" AS ENUM('primary', 'secondary', 'accent');
  CREATE TYPE "public"."enum_pages_blocks_b61_split_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum_pages_blocks_b61_split_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_content_blocks_type" AS ENUM('body', 'emphasis', 'quote', 'iconrow');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_content_blocks_icon" AS ENUM('dot', 'check', 'email', 'phone', 'location', 'calendar', 'clock', 'link', 'star', 'heart', 'book', 'people', 'cross', 'school');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_content_blocks_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_buttons_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_media" AS ENUM('photo', 'gallery', 'video');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_columns" AS ENUM('1', '2', '3');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_image_shape" AS ENUM('fixed', 'portrait', 'square', 'landscape', 'wide');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_image_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_vertical_position" AS ENUM('top', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_stack_order" AS ENUM('text', 'media');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_column_height" AS ENUM('fit', 'fill');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_heading_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_text_panel" AS ENUM('none', 'plain', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_frame_color" AS ENUM('primary', 'secondary', 'accent');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_entrance" AS ENUM('on', 'off');
  CREATE TABLE "pages_blocks_b61_split_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_split_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_b61_split_content_blocks" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_pages_blocks_b61_split_content_blocks_type" DEFAULT 'body',
  	"body" jsonb,
  	"text" varchar,
  	"attribution" varchar,
  	"photo_id" integer,
  	"icon" "enum_pages_blocks_b61_split_content_blocks_icon" DEFAULT 'dot',
  	"has_link" boolean,
  	"link_type" "enum_pages_blocks_b61_split_content_blocks_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_split_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum_pages_blocks_b61_split_buttons_variant" DEFAULT 'primary',
  	"link_type" "enum_pages_blocks_b61_split_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"full_width" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_split_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "pages_blocks_b61_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading_level" "enum_pages_blocks_b61_split_heading_level" DEFAULT 'auto',
  	"media" "enum_pages_blocks_b61_split_media" DEFAULT 'photo',
  	"image_id" integer,
  	"caption" varchar,
  	"columns" "enum_pages_blocks_b61_split_columns" DEFAULT '2',
  	"video" varchar,
  	"image_shape" "enum_pages_blocks_b61_split_image_shape" DEFAULT 'fixed',
  	"image_side" "enum_pages_blocks_b61_split_image_side" DEFAULT 'right',
  	"vertical_position" "enum_pages_blocks_b61_split_vertical_position" DEFAULT 'center',
  	"stack_order" "enum_pages_blocks_b61_split_stack_order" DEFAULT 'text',
  	"column_height" "enum_pages_blocks_b61_split_column_height" DEFAULT 'fit',
  	"overlap" boolean,
  	"heading_align" "enum_pages_blocks_b61_split_heading_align" DEFAULT 'left',
  	"column_balance" numeric,
  	"pad_top" "enum_pages_blocks_b61_split_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum_pages_blocks_b61_split_pad_bottom" DEFAULT 'normal',
  	"surface" "enum_pages_blocks_b61_split_surface" DEFAULT 'none',
  	"text_panel" "enum_pages_blocks_b61_split_text_panel" DEFAULT 'none',
  	"frame_color" "enum_pages_blocks_b61_split_frame_color" DEFAULT 'primary',
  	"eyebrow_rule" "enum_pages_blocks_b61_split_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum_pages_blocks_b61_split_entrance" DEFAULT 'on',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_split_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_split_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_split_content_blocks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum__pages_v_blocks_b61_split_content_blocks_type" DEFAULT 'body',
  	"body" jsonb,
  	"text" varchar,
  	"attribution" varchar,
  	"photo_id" integer,
  	"icon" "enum__pages_v_blocks_b61_split_content_blocks_icon" DEFAULT 'dot',
  	"has_link" boolean,
  	"link_type" "enum__pages_v_blocks_b61_split_content_blocks_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_split_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum__pages_v_blocks_b61_split_buttons_variant" DEFAULT 'primary',
  	"link_type" "enum__pages_v_blocks_b61_split_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"full_width" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_split_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading_level" "enum__pages_v_blocks_b61_split_heading_level" DEFAULT 'auto',
  	"media" "enum__pages_v_blocks_b61_split_media" DEFAULT 'photo',
  	"image_id" integer,
  	"caption" varchar,
  	"columns" "enum__pages_v_blocks_b61_split_columns" DEFAULT '2',
  	"video" varchar,
  	"image_shape" "enum__pages_v_blocks_b61_split_image_shape" DEFAULT 'fixed',
  	"image_side" "enum__pages_v_blocks_b61_split_image_side" DEFAULT 'right',
  	"vertical_position" "enum__pages_v_blocks_b61_split_vertical_position" DEFAULT 'center',
  	"stack_order" "enum__pages_v_blocks_b61_split_stack_order" DEFAULT 'text',
  	"column_height" "enum__pages_v_blocks_b61_split_column_height" DEFAULT 'fit',
  	"overlap" boolean,
  	"heading_align" "enum__pages_v_blocks_b61_split_heading_align" DEFAULT 'left',
  	"column_balance" numeric,
  	"pad_top" "enum__pages_v_blocks_b61_split_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum__pages_v_blocks_b61_split_pad_bottom" DEFAULT 'normal',
  	"surface" "enum__pages_v_blocks_b61_split_surface" DEFAULT 'none',
  	"text_panel" "enum__pages_v_blocks_b61_split_text_panel" DEFAULT 'none',
  	"frame_color" "enum__pages_v_blocks_b61_split_frame_color" DEFAULT 'primary',
  	"eyebrow_rule" "enum__pages_v_blocks_b61_split_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum__pages_v_blocks_b61_split_entrance" DEFAULT 'on',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  DROP TABLE "pages_blocks_split" CASCADE;
  DROP TABLE "_pages_v_blocks_split" CASCADE;
  ALTER TABLE "pages_blocks_b61_split_lines" ADD CONSTRAINT "pages_blocks_b61_split_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_split_subheads" ADD CONSTRAINT "pages_blocks_b61_split_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_split_content_blocks" ADD CONSTRAINT "pages_blocks_b61_split_content_blocks_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_split_content_blocks" ADD CONSTRAINT "pages_blocks_b61_split_content_blocks_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_split_content_blocks" ADD CONSTRAINT "pages_blocks_b61_split_content_blocks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_split_buttons" ADD CONSTRAINT "pages_blocks_b61_split_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_split_buttons" ADD CONSTRAINT "pages_blocks_b61_split_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_split_images" ADD CONSTRAINT "pages_blocks_b61_split_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_split_images" ADD CONSTRAINT "pages_blocks_b61_split_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_split" ADD CONSTRAINT "pages_blocks_b61_split_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_split" ADD CONSTRAINT "pages_blocks_b61_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_split_lines" ADD CONSTRAINT "_pages_v_blocks_b61_split_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_split_subheads" ADD CONSTRAINT "_pages_v_blocks_b61_split_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_split_content_blocks" ADD CONSTRAINT "_pages_v_blocks_b61_split_content_blocks_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_split_content_blocks" ADD CONSTRAINT "_pages_v_blocks_b61_split_content_blocks_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_split_content_blocks" ADD CONSTRAINT "_pages_v_blocks_b61_split_content_blocks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_split_buttons" ADD CONSTRAINT "_pages_v_blocks_b61_split_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_split_buttons" ADD CONSTRAINT "_pages_v_blocks_b61_split_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_split_images" ADD CONSTRAINT "_pages_v_blocks_b61_split_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_split_images" ADD CONSTRAINT "_pages_v_blocks_b61_split_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_split" ADD CONSTRAINT "_pages_v_blocks_b61_split_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_split" ADD CONSTRAINT "_pages_v_blocks_b61_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_b61_split_lines_order_idx" ON "pages_blocks_b61_split_lines" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_split_lines_parent_id_idx" ON "pages_blocks_b61_split_lines" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_split_subheads_order_idx" ON "pages_blocks_b61_split_subheads" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_split_subheads_parent_id_idx" ON "pages_blocks_b61_split_subheads" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_split_content_blocks_order_idx" ON "pages_blocks_b61_split_content_blocks" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_split_content_blocks_parent_id_idx" ON "pages_blocks_b61_split_content_blocks" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_split_content_blocks_photo_idx" ON "pages_blocks_b61_split_content_blocks" USING btree ("photo_id");
  CREATE INDEX "pages_blocks_b61_split_content_blocks_link_link_page_idx" ON "pages_blocks_b61_split_content_blocks" USING btree ("link_page_id");
  CREATE INDEX "pages_blocks_b61_split_buttons_order_idx" ON "pages_blocks_b61_split_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_split_buttons_parent_id_idx" ON "pages_blocks_b61_split_buttons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_split_buttons_link_link_page_idx" ON "pages_blocks_b61_split_buttons" USING btree ("link_page_id");
  CREATE INDEX "pages_blocks_b61_split_images_order_idx" ON "pages_blocks_b61_split_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_split_images_parent_id_idx" ON "pages_blocks_b61_split_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_split_images_image_idx" ON "pages_blocks_b61_split_images" USING btree ("image_id");
  CREATE INDEX "pages_blocks_b61_split_order_idx" ON "pages_blocks_b61_split" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_split_parent_id_idx" ON "pages_blocks_b61_split" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_split_path_idx" ON "pages_blocks_b61_split" USING btree ("_path");
  CREATE INDEX "pages_blocks_b61_split_image_idx" ON "pages_blocks_b61_split" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_b61_split_lines_order_idx" ON "_pages_v_blocks_b61_split_lines" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_split_lines_parent_id_idx" ON "_pages_v_blocks_b61_split_lines" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_split_subheads_order_idx" ON "_pages_v_blocks_b61_split_subheads" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_split_subheads_parent_id_idx" ON "_pages_v_blocks_b61_split_subheads" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_split_content_blocks_order_idx" ON "_pages_v_blocks_b61_split_content_blocks" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_split_content_blocks_parent_id_idx" ON "_pages_v_blocks_b61_split_content_blocks" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_split_content_blocks_photo_idx" ON "_pages_v_blocks_b61_split_content_blocks" USING btree ("photo_id");
  CREATE INDEX "_pages_v_blocks_b61_split_content_blocks_link_link_page_idx" ON "_pages_v_blocks_b61_split_content_blocks" USING btree ("link_page_id");
  CREATE INDEX "_pages_v_blocks_b61_split_buttons_order_idx" ON "_pages_v_blocks_b61_split_buttons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_split_buttons_parent_id_idx" ON "_pages_v_blocks_b61_split_buttons" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_split_buttons_link_link_page_idx" ON "_pages_v_blocks_b61_split_buttons" USING btree ("link_page_id");
  CREATE INDEX "_pages_v_blocks_b61_split_images_order_idx" ON "_pages_v_blocks_b61_split_images" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_split_images_parent_id_idx" ON "_pages_v_blocks_b61_split_images" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_split_images_image_idx" ON "_pages_v_blocks_b61_split_images" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_b61_split_order_idx" ON "_pages_v_blocks_b61_split" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_split_parent_id_idx" ON "_pages_v_blocks_b61_split" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_split_path_idx" ON "_pages_v_blocks_b61_split" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_b61_split_image_idx" ON "_pages_v_blocks_b61_split" USING btree ("image_id");
  DROP TYPE "public"."enum_pages_blocks_split_image_position";
  DROP TYPE "public"."enum_pages_blocks_split_tone";
  DROP TYPE "public"."enum_pages_blocks_split_button_style";
  DROP TYPE "public"."enum__pages_v_blocks_split_image_position";
  DROP TYPE "public"."enum__pages_v_blocks_split_tone";
  DROP TYPE "public"."enum__pages_v_blocks_split_button_style";`)

  // Content: put B61 Splits on the demo pages.
  await upgradeDemoSplits(payload, req, oldPositions)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_split_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_split_tone" AS ENUM('light', 'muted', 'brand', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_split_button_style" AS ENUM('primary', 'secondary', 'link');
  CREATE TYPE "public"."enum__pages_v_blocks_split_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_split_tone" AS ENUM('light', 'muted', 'brand', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_split_button_style" AS ENUM('primary', 'secondary', 'link');
  CREATE TABLE "pages_blocks_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" jsonb,
  	"image_id" integer,
  	"image_position" "enum_pages_blocks_split_image_position" DEFAULT 'right',
  	"tone" "enum_pages_blocks_split_tone" DEFAULT 'light',
  	"button_label" varchar,
  	"button_url" varchar,
  	"button_style" "enum_pages_blocks_split_button_style" DEFAULT 'primary',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" jsonb,
  	"image_id" integer,
  	"image_position" "enum__pages_v_blocks_split_image_position" DEFAULT 'right',
  	"tone" "enum__pages_v_blocks_split_tone" DEFAULT 'light',
  	"button_label" varchar,
  	"button_url" varchar,
  	"button_style" "enum__pages_v_blocks_split_button_style" DEFAULT 'primary',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  DROP TABLE "pages_blocks_b61_split_lines" CASCADE;
  DROP TABLE "pages_blocks_b61_split_subheads" CASCADE;
  DROP TABLE "pages_blocks_b61_split_content_blocks" CASCADE;
  DROP TABLE "pages_blocks_b61_split_buttons" CASCADE;
  DROP TABLE "pages_blocks_b61_split_images" CASCADE;
  DROP TABLE "pages_blocks_b61_split" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_split_lines" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_split_subheads" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_split_content_blocks" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_split_buttons" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_split_images" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_split" CASCADE;
  ALTER TABLE "pages_blocks_split" ADD CONSTRAINT "pages_blocks_split_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_split" ADD CONSTRAINT "pages_blocks_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_split" ADD CONSTRAINT "_pages_v_blocks_split_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_split" ADD CONSTRAINT "_pages_v_blocks_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_split_order_idx" ON "pages_blocks_split" USING btree ("_order");
  CREATE INDEX "pages_blocks_split_parent_id_idx" ON "pages_blocks_split" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_split_path_idx" ON "pages_blocks_split" USING btree ("_path");
  CREATE INDEX "pages_blocks_split_image_idx" ON "pages_blocks_split" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_split_order_idx" ON "_pages_v_blocks_split" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_split_parent_id_idx" ON "_pages_v_blocks_split" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_split_path_idx" ON "_pages_v_blocks_split" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_split_image_idx" ON "_pages_v_blocks_split" USING btree ("image_id");
  DROP TYPE "public"."enum_pages_blocks_b61_split_content_blocks_type";
  DROP TYPE "public"."enum_pages_blocks_b61_split_content_blocks_icon";
  DROP TYPE "public"."enum_pages_blocks_b61_split_content_blocks_link_type";
  DROP TYPE "public"."enum_pages_blocks_b61_split_buttons_variant";
  DROP TYPE "public"."enum_pages_blocks_b61_split_buttons_link_type";
  DROP TYPE "public"."enum_pages_blocks_b61_split_heading_level";
  DROP TYPE "public"."enum_pages_blocks_b61_split_media";
  DROP TYPE "public"."enum_pages_blocks_b61_split_columns";
  DROP TYPE "public"."enum_pages_blocks_b61_split_image_shape";
  DROP TYPE "public"."enum_pages_blocks_b61_split_image_side";
  DROP TYPE "public"."enum_pages_blocks_b61_split_vertical_position";
  DROP TYPE "public"."enum_pages_blocks_b61_split_stack_order";
  DROP TYPE "public"."enum_pages_blocks_b61_split_column_height";
  DROP TYPE "public"."enum_pages_blocks_b61_split_heading_align";
  DROP TYPE "public"."enum_pages_blocks_b61_split_pad_top";
  DROP TYPE "public"."enum_pages_blocks_b61_split_pad_bottom";
  DROP TYPE "public"."enum_pages_blocks_b61_split_surface";
  DROP TYPE "public"."enum_pages_blocks_b61_split_text_panel";
  DROP TYPE "public"."enum_pages_blocks_b61_split_frame_color";
  DROP TYPE "public"."enum_pages_blocks_b61_split_eyebrow_rule";
  DROP TYPE "public"."enum_pages_blocks_b61_split_entrance";
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_content_blocks_type";
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_content_blocks_icon";
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_content_blocks_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_buttons_variant";
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_buttons_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_heading_level";
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_media";
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_columns";
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_image_shape";
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_image_side";
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_vertical_position";
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_stack_order";
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_column_height";
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_heading_align";
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_pad_top";
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_pad_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_surface";
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_text_panel";
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_frame_color";
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_eyebrow_rule";
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_entrance";`)
}
