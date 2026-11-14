import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import { upgradeCardGrids } from '../b61/upgrade'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Keep the old card grids (and their hand-written cards) before their tables go.
  const grids = ((await db.execute(sql`SELECT "id", "_parent_id" AS page, "_order" AS pos, "heading", "intro", "source", "limit", "columns", "tone" FROM "pages_blocks_card_grid"`)) as any).rows ?? []
  const cardRows = ((await db.execute(sql`SELECT "_parent_id" AS grid, "_order" AS pos, "title", "body", "image_id" AS image, "link" FROM "pages_blocks_card_grid_cards" ORDER BY "_order"`)) as any).rows ?? []
  const old = grids.map((g: any) => ({
    page: Number(g.page),
    pos: Number(g.pos),
    heading: g.heading ?? null,
    intro: g.intro ?? null,
    source: g.source ?? null,
    limit: g.limit == null ? null : Number(g.limit),
    columns: g.columns ?? null,
    tone: g.tone ?? null,
    cards: cardRows.filter((c: any) => c.grid === g.id).map((c: any) => ({ title: c.title, body: c.body, image: c.image == null ? null : Number(c.image), link: c.link })),
  }))

  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_cards_icon" AS ENUM('check', 'email', 'phone', 'location', 'calendar', 'clock', 'link', 'star', 'heart', 'book', 'people', 'cross', 'school');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_cards_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_buttons_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_source" AS ENUM('manual', 'programs', 'upcoming-events', 'latest-news', 'staff');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_media_type" AS ENUM('image', 'icon', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_arrangement" AS ENUM('grid', 'carousel');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_columns" AS ENUM('1', '2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_text_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_advance" AS ENUM('one', 'view');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_peek" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_controls_position" AS ENUM('top-right', 'bottom-left', 'bottom-center', 'bottom-right', 'sides', 'hidden');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_card_style" AS ENUM('plain', 'flat', 'bordered', 'overlay');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_card_shape" AS ENUM('portrait', 'square', 'landscape', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_image_shape" AS ENUM('fixed', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_card_text_position" AS ENUM('top', 'center', 'bottom');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_icon_size" AS ENUM('sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_cta_case" AS ENUM('upper', 'normal');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_cta_size" AS ENUM('sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_card_surface" AS ENUM('light', 'soft', 'primary');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_card_overlay" AS ENUM('none', 'gradient', 'wash');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_cards_icon" AS ENUM('check', 'email', 'phone', 'location', 'calendar', 'clock', 'link', 'star', 'heart', 'book', 'people', 'cross', 'school');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_cards_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_buttons_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_source" AS ENUM('manual', 'programs', 'upcoming-events', 'latest-news', 'staff');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_media_type" AS ENUM('image', 'icon', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_arrangement" AS ENUM('grid', 'carousel');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_columns" AS ENUM('1', '2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_text_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_advance" AS ENUM('one', 'view');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_peek" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_controls_position" AS ENUM('top-right', 'bottom-left', 'bottom-center', 'bottom-right', 'sides', 'hidden');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_card_style" AS ENUM('plain', 'flat', 'bordered', 'overlay');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_card_shape" AS ENUM('portrait', 'square', 'landscape', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_image_shape" AS ENUM('fixed', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_card_text_position" AS ENUM('top', 'center', 'bottom');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_icon_size" AS ENUM('sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_cta_case" AS ENUM('upper', 'normal');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_cta_size" AS ENUM('sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_card_surface" AS ENUM('light', 'soft', 'primary');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_card_overlay" AS ENUM('none', 'gradient', 'wash');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_entrance" AS ENUM('on', 'off');
  CREATE TABLE "pages_blocks_b61_card_grid_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_card_grid_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_b61_card_grid_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"icon" "enum_pages_blocks_b61_card_grid_cards_icon" DEFAULT 'star',
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" jsonb,
  	"link_type" "enum_pages_blocks_b61_card_grid_cards_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"link_text" varchar
  );
  
  CREATE TABLE "pages_blocks_b61_card_grid_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum_pages_blocks_b61_card_grid_buttons_variant" DEFAULT 'primary',
  	"link_type" "enum_pages_blocks_b61_card_grid_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"full_width" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_card_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading_level" "enum_pages_blocks_b61_card_grid_heading_level" DEFAULT 'auto',
  	"intro" jsonb,
  	"source" "enum_pages_blocks_b61_card_grid_source" DEFAULT 'manual',
  	"limit" numeric DEFAULT 3,
  	"media_type" "enum_pages_blocks_b61_card_grid_media_type" DEFAULT 'image',
  	"arrangement" "enum_pages_blocks_b61_card_grid_arrangement" DEFAULT 'grid',
  	"columns" "enum_pages_blocks_b61_card_grid_columns" DEFAULT '3',
  	"text_align" "enum_pages_blocks_b61_card_grid_text_align" DEFAULT 'left',
  	"advance" "enum_pages_blocks_b61_card_grid_advance" DEFAULT 'one',
  	"peek" "enum_pages_blocks_b61_card_grid_peek" DEFAULT 'small',
  	"controls_position" "enum_pages_blocks_b61_card_grid_controls_position" DEFAULT 'top-right',
  	"show_counter" boolean,
  	"show_progress" boolean,
  	"pad_top" "enum_pages_blocks_b61_card_grid_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum_pages_blocks_b61_card_grid_pad_bottom" DEFAULT 'normal',
  	"card_style" "enum_pages_blocks_b61_card_grid_card_style" DEFAULT 'bordered',
  	"card_shape" "enum_pages_blocks_b61_card_grid_card_shape" DEFAULT 'portrait',
  	"image_shape" "enum_pages_blocks_b61_card_grid_image_shape" DEFAULT 'fixed',
  	"ratio_w" numeric,
  	"ratio_h" numeric,
  	"card_text_position" "enum_pages_blocks_b61_card_grid_card_text_position" DEFAULT 'bottom',
  	"media_round" boolean,
  	"icon_size" "enum_pages_blocks_b61_card_grid_icon_size" DEFAULT 'sm',
  	"show_numbers" boolean,
  	"cta_case" "enum_pages_blocks_b61_card_grid_cta_case" DEFAULT 'upper',
  	"cta_size" "enum_pages_blocks_b61_card_grid_cta_size" DEFAULT 'sm',
  	"surface" "enum_pages_blocks_b61_card_grid_surface" DEFAULT 'none',
  	"card_surface" "enum_pages_blocks_b61_card_grid_card_surface" DEFAULT 'light',
  	"card_overlay" "enum_pages_blocks_b61_card_grid_card_overlay" DEFAULT 'gradient',
  	"eyebrow_rule" "enum_pages_blocks_b61_card_grid_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum_pages_blocks_b61_card_grid_entrance" DEFAULT 'on',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_card_grid_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_card_grid_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_card_grid_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"icon" "enum__pages_v_blocks_b61_card_grid_cards_icon" DEFAULT 'star',
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" jsonb,
  	"link_type" "enum__pages_v_blocks_b61_card_grid_cards_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"link_text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_card_grid_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum__pages_v_blocks_b61_card_grid_buttons_variant" DEFAULT 'primary',
  	"link_type" "enum__pages_v_blocks_b61_card_grid_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"full_width" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_card_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading_level" "enum__pages_v_blocks_b61_card_grid_heading_level" DEFAULT 'auto',
  	"intro" jsonb,
  	"source" "enum__pages_v_blocks_b61_card_grid_source" DEFAULT 'manual',
  	"limit" numeric DEFAULT 3,
  	"media_type" "enum__pages_v_blocks_b61_card_grid_media_type" DEFAULT 'image',
  	"arrangement" "enum__pages_v_blocks_b61_card_grid_arrangement" DEFAULT 'grid',
  	"columns" "enum__pages_v_blocks_b61_card_grid_columns" DEFAULT '3',
  	"text_align" "enum__pages_v_blocks_b61_card_grid_text_align" DEFAULT 'left',
  	"advance" "enum__pages_v_blocks_b61_card_grid_advance" DEFAULT 'one',
  	"peek" "enum__pages_v_blocks_b61_card_grid_peek" DEFAULT 'small',
  	"controls_position" "enum__pages_v_blocks_b61_card_grid_controls_position" DEFAULT 'top-right',
  	"show_counter" boolean,
  	"show_progress" boolean,
  	"pad_top" "enum__pages_v_blocks_b61_card_grid_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum__pages_v_blocks_b61_card_grid_pad_bottom" DEFAULT 'normal',
  	"card_style" "enum__pages_v_blocks_b61_card_grid_card_style" DEFAULT 'bordered',
  	"card_shape" "enum__pages_v_blocks_b61_card_grid_card_shape" DEFAULT 'portrait',
  	"image_shape" "enum__pages_v_blocks_b61_card_grid_image_shape" DEFAULT 'fixed',
  	"ratio_w" numeric,
  	"ratio_h" numeric,
  	"card_text_position" "enum__pages_v_blocks_b61_card_grid_card_text_position" DEFAULT 'bottom',
  	"media_round" boolean,
  	"icon_size" "enum__pages_v_blocks_b61_card_grid_icon_size" DEFAULT 'sm',
  	"show_numbers" boolean,
  	"cta_case" "enum__pages_v_blocks_b61_card_grid_cta_case" DEFAULT 'upper',
  	"cta_size" "enum__pages_v_blocks_b61_card_grid_cta_size" DEFAULT 'sm',
  	"surface" "enum__pages_v_blocks_b61_card_grid_surface" DEFAULT 'none',
  	"card_surface" "enum__pages_v_blocks_b61_card_grid_card_surface" DEFAULT 'light',
  	"card_overlay" "enum__pages_v_blocks_b61_card_grid_card_overlay" DEFAULT 'gradient',
  	"eyebrow_rule" "enum__pages_v_blocks_b61_card_grid_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum__pages_v_blocks_b61_card_grid_entrance" DEFAULT 'on',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  DROP TABLE "pages_blocks_card_grid_cards" CASCADE;
  DROP TABLE "pages_blocks_card_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_card_grid_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_card_grid" CASCADE;
  ALTER TABLE "pages_blocks_b61_card_grid_lines" ADD CONSTRAINT "pages_blocks_b61_card_grid_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_card_grid_subheads" ADD CONSTRAINT "pages_blocks_b61_card_grid_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_card_grid_cards" ADD CONSTRAINT "pages_blocks_b61_card_grid_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_card_grid_cards" ADD CONSTRAINT "pages_blocks_b61_card_grid_cards_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_card_grid_cards" ADD CONSTRAINT "pages_blocks_b61_card_grid_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_card_grid_buttons" ADD CONSTRAINT "pages_blocks_b61_card_grid_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_card_grid_buttons" ADD CONSTRAINT "pages_blocks_b61_card_grid_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_card_grid" ADD CONSTRAINT "pages_blocks_b61_card_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_card_grid_lines" ADD CONSTRAINT "_pages_v_blocks_b61_card_grid_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_card_grid_subheads" ADD CONSTRAINT "_pages_v_blocks_b61_card_grid_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_card_grid_cards" ADD CONSTRAINT "_pages_v_blocks_b61_card_grid_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_card_grid_cards" ADD CONSTRAINT "_pages_v_blocks_b61_card_grid_cards_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_card_grid_cards" ADD CONSTRAINT "_pages_v_blocks_b61_card_grid_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_card_grid_buttons" ADD CONSTRAINT "_pages_v_blocks_b61_card_grid_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_card_grid_buttons" ADD CONSTRAINT "_pages_v_blocks_b61_card_grid_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_card_grid" ADD CONSTRAINT "_pages_v_blocks_b61_card_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_b61_card_grid_lines_order_idx" ON "pages_blocks_b61_card_grid_lines" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_card_grid_lines_parent_id_idx" ON "pages_blocks_b61_card_grid_lines" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_card_grid_subheads_order_idx" ON "pages_blocks_b61_card_grid_subheads" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_card_grid_subheads_parent_id_idx" ON "pages_blocks_b61_card_grid_subheads" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_card_grid_cards_order_idx" ON "pages_blocks_b61_card_grid_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_card_grid_cards_parent_id_idx" ON "pages_blocks_b61_card_grid_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_card_grid_cards_image_idx" ON "pages_blocks_b61_card_grid_cards" USING btree ("image_id");
  CREATE INDEX "pages_blocks_b61_card_grid_cards_link_link_page_idx" ON "pages_blocks_b61_card_grid_cards" USING btree ("link_page_id");
  CREATE INDEX "pages_blocks_b61_card_grid_buttons_order_idx" ON "pages_blocks_b61_card_grid_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_card_grid_buttons_parent_id_idx" ON "pages_blocks_b61_card_grid_buttons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_card_grid_buttons_link_link_page_idx" ON "pages_blocks_b61_card_grid_buttons" USING btree ("link_page_id");
  CREATE INDEX "pages_blocks_b61_card_grid_order_idx" ON "pages_blocks_b61_card_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_card_grid_parent_id_idx" ON "pages_blocks_b61_card_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_card_grid_path_idx" ON "pages_blocks_b61_card_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_b61_card_grid_lines_order_idx" ON "_pages_v_blocks_b61_card_grid_lines" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_card_grid_lines_parent_id_idx" ON "_pages_v_blocks_b61_card_grid_lines" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_card_grid_subheads_order_idx" ON "_pages_v_blocks_b61_card_grid_subheads" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_card_grid_subheads_parent_id_idx" ON "_pages_v_blocks_b61_card_grid_subheads" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_card_grid_cards_order_idx" ON "_pages_v_blocks_b61_card_grid_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_card_grid_cards_parent_id_idx" ON "_pages_v_blocks_b61_card_grid_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_card_grid_cards_image_idx" ON "_pages_v_blocks_b61_card_grid_cards" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_b61_card_grid_cards_link_link_page_idx" ON "_pages_v_blocks_b61_card_grid_cards" USING btree ("link_page_id");
  CREATE INDEX "_pages_v_blocks_b61_card_grid_buttons_order_idx" ON "_pages_v_blocks_b61_card_grid_buttons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_card_grid_buttons_parent_id_idx" ON "_pages_v_blocks_b61_card_grid_buttons" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_card_grid_buttons_link_link_page_idx" ON "_pages_v_blocks_b61_card_grid_buttons" USING btree ("link_page_id");
  CREATE INDEX "_pages_v_blocks_b61_card_grid_order_idx" ON "_pages_v_blocks_b61_card_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_card_grid_parent_id_idx" ON "_pages_v_blocks_b61_card_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_card_grid_path_idx" ON "_pages_v_blocks_b61_card_grid" USING btree ("_path");
  DROP TYPE "public"."enum_pages_blocks_card_grid_source";
  DROP TYPE "public"."enum_pages_blocks_card_grid_columns";
  DROP TYPE "public"."enum_pages_blocks_card_grid_tone";
  DROP TYPE "public"."enum__pages_v_blocks_card_grid_source";
  DROP TYPE "public"."enum__pages_v_blocks_card_grid_columns";
  DROP TYPE "public"."enum__pages_v_blocks_card_grid_tone";`)

  // Content: each old card grid becomes a B61 Card Grid in the same place.
  await upgradeCardGrids(payload, req, old)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_card_grid_source" AS ENUM('manual', 'programs', 'upcoming-events', 'latest-news', 'staff');
  CREATE TYPE "public"."enum_pages_blocks_card_grid_columns" AS ENUM('two', 'three', 'four');
  CREATE TYPE "public"."enum_pages_blocks_card_grid_tone" AS ENUM('light', 'muted', 'brand', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_card_grid_source" AS ENUM('manual', 'programs', 'upcoming-events', 'latest-news', 'staff');
  CREATE TYPE "public"."enum__pages_v_blocks_card_grid_columns" AS ENUM('two', 'three', 'four');
  CREATE TYPE "public"."enum__pages_v_blocks_card_grid_tone" AS ENUM('light', 'muted', 'brand', 'dark');
  CREATE TABLE "pages_blocks_card_grid_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"image_id" integer,
  	"link" varchar
  );
  
  CREATE TABLE "pages_blocks_card_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"intro" varchar,
  	"source" "enum_pages_blocks_card_grid_source" DEFAULT 'manual',
  	"limit" numeric DEFAULT 3,
  	"columns" "enum_pages_blocks_card_grid_columns" DEFAULT 'three',
  	"tone" "enum_pages_blocks_card_grid_tone" DEFAULT 'light',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_card_grid_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"image_id" integer,
  	"link" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_card_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"intro" varchar,
  	"source" "enum__pages_v_blocks_card_grid_source" DEFAULT 'manual',
  	"limit" numeric DEFAULT 3,
  	"columns" "enum__pages_v_blocks_card_grid_columns" DEFAULT 'three',
  	"tone" "enum__pages_v_blocks_card_grid_tone" DEFAULT 'light',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  DROP TABLE "pages_blocks_b61_card_grid_lines" CASCADE;
  DROP TABLE "pages_blocks_b61_card_grid_subheads" CASCADE;
  DROP TABLE "pages_blocks_b61_card_grid_cards" CASCADE;
  DROP TABLE "pages_blocks_b61_card_grid_buttons" CASCADE;
  DROP TABLE "pages_blocks_b61_card_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_card_grid_lines" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_card_grid_subheads" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_card_grid_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_card_grid_buttons" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_card_grid" CASCADE;
  ALTER TABLE "pages_blocks_card_grid_cards" ADD CONSTRAINT "pages_blocks_card_grid_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_card_grid_cards" ADD CONSTRAINT "pages_blocks_card_grid_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_card_grid" ADD CONSTRAINT "pages_blocks_card_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_card_grid_cards" ADD CONSTRAINT "_pages_v_blocks_card_grid_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_card_grid_cards" ADD CONSTRAINT "_pages_v_blocks_card_grid_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_card_grid" ADD CONSTRAINT "_pages_v_blocks_card_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_card_grid_cards_order_idx" ON "pages_blocks_card_grid_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_card_grid_cards_parent_id_idx" ON "pages_blocks_card_grid_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_card_grid_cards_image_idx" ON "pages_blocks_card_grid_cards" USING btree ("image_id");
  CREATE INDEX "pages_blocks_card_grid_order_idx" ON "pages_blocks_card_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_card_grid_parent_id_idx" ON "pages_blocks_card_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_card_grid_path_idx" ON "pages_blocks_card_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_card_grid_cards_order_idx" ON "_pages_v_blocks_card_grid_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_card_grid_cards_parent_id_idx" ON "_pages_v_blocks_card_grid_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_card_grid_cards_image_idx" ON "_pages_v_blocks_card_grid_cards" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_card_grid_order_idx" ON "_pages_v_blocks_card_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_card_grid_parent_id_idx" ON "_pages_v_blocks_card_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_card_grid_path_idx" ON "_pages_v_blocks_card_grid" USING btree ("_path");
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_cards_icon";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_cards_link_type";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_buttons_variant";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_buttons_link_type";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_heading_level";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_source";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_media_type";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_arrangement";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_columns";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_text_align";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_advance";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_peek";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_controls_position";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_pad_top";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_pad_bottom";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_card_style";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_card_shape";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_image_shape";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_card_text_position";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_icon_size";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_cta_case";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_cta_size";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_surface";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_card_surface";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_card_overlay";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_eyebrow_rule";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_entrance";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_cards_icon";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_cards_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_buttons_variant";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_buttons_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_heading_level";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_source";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_media_type";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_arrangement";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_columns";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_text_align";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_advance";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_peek";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_controls_position";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_pad_top";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_pad_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_card_style";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_card_shape";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_image_shape";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_card_text_position";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_icon_size";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_cta_case";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_cta_size";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_surface";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_card_surface";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_card_overlay";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_eyebrow_rule";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_entrance";`)
}
