import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import { upgradeDemoCta } from '../b61/upgrade'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Keep the old Call to action blocks' words before their table goes.
  const res = await db.execute(sql`SELECT "_parent_id" AS page, "_order" AS pos, "heading", "body", "tone", "button_label" AS label, "button_url" AS url FROM "pages_blocks_cta_band"`)
  const old = ((res as any).rows ?? []).map((r: any) => ({ page: Number(r.page), pos: Number(r.pos), heading: r.heading ?? null, body: r.body ?? null, tone: r.tone ?? null, label: r.label ?? null, url: r.url ?? null }))

  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_b61_cta_content_blocks_type" AS ENUM('body', 'emphasis', 'quote', 'iconrow');
  CREATE TYPE "public"."enum_pages_blocks_b61_cta_content_blocks_icon" AS ENUM('dot', 'check', 'email', 'phone', 'location', 'calendar', 'clock', 'link', 'star', 'heart', 'book', 'people', 'cross', 'school');
  CREATE TYPE "public"."enum_pages_blocks_b61_cta_content_blocks_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum_pages_blocks_b61_cta_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum_pages_blocks_b61_cta_buttons_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum_pages_blocks_b61_cta_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum_pages_blocks_b61_cta_text_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_b61_cta_position" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_b61_cta_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_cta_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_cta_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_pages_blocks_b61_cta_text_panel" AS ENUM('none', 'plain', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_pages_blocks_b61_cta_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum_pages_blocks_b61_cta_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_cta_content_blocks_type" AS ENUM('body', 'emphasis', 'quote', 'iconrow');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_cta_content_blocks_icon" AS ENUM('dot', 'check', 'email', 'phone', 'location', 'calendar', 'clock', 'link', 'star', 'heart', 'book', 'people', 'cross', 'school');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_cta_content_blocks_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_cta_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_cta_buttons_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_cta_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_cta_text_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_cta_position" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_cta_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_cta_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_cta_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_cta_text_panel" AS ENUM('none', 'plain', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_cta_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_cta_entrance" AS ENUM('on', 'off');
  CREATE TABLE "pages_blocks_b61_cta_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_cta_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_b61_cta_content_blocks" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_pages_blocks_b61_cta_content_blocks_type" DEFAULT 'body',
  	"body" jsonb,
  	"text" varchar,
  	"attribution" varchar,
  	"icon" "enum_pages_blocks_b61_cta_content_blocks_icon" DEFAULT 'dot',
  	"has_link" boolean,
  	"link_type" "enum_pages_blocks_b61_cta_content_blocks_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_cta_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum_pages_blocks_b61_cta_buttons_variant" DEFAULT 'primary',
  	"link_type" "enum_pages_blocks_b61_cta_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"full_width" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading_level" "enum_pages_blocks_b61_cta_heading_level" DEFAULT 'auto',
  	"image_id" integer,
  	"overlay_strength" numeric,
  	"text_align" "enum_pages_blocks_b61_cta_text_align" DEFAULT 'center',
  	"position" "enum_pages_blocks_b61_cta_position" DEFAULT 'center',
  	"width_step" numeric,
  	"pad_top" "enum_pages_blocks_b61_cta_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum_pages_blocks_b61_cta_pad_bottom" DEFAULT 'normal',
  	"surface" "enum_pages_blocks_b61_cta_surface" DEFAULT 'soft',
  	"text_panel" "enum_pages_blocks_b61_cta_text_panel" DEFAULT 'none',
  	"eyebrow_rule" "enum_pages_blocks_b61_cta_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum_pages_blocks_b61_cta_entrance" DEFAULT 'on',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_cta_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_cta_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_cta_content_blocks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum__pages_v_blocks_b61_cta_content_blocks_type" DEFAULT 'body',
  	"body" jsonb,
  	"text" varchar,
  	"attribution" varchar,
  	"icon" "enum__pages_v_blocks_b61_cta_content_blocks_icon" DEFAULT 'dot',
  	"has_link" boolean,
  	"link_type" "enum__pages_v_blocks_b61_cta_content_blocks_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_cta_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum__pages_v_blocks_b61_cta_buttons_variant" DEFAULT 'primary',
  	"link_type" "enum__pages_v_blocks_b61_cta_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"full_width" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading_level" "enum__pages_v_blocks_b61_cta_heading_level" DEFAULT 'auto',
  	"image_id" integer,
  	"overlay_strength" numeric,
  	"text_align" "enum__pages_v_blocks_b61_cta_text_align" DEFAULT 'center',
  	"position" "enum__pages_v_blocks_b61_cta_position" DEFAULT 'center',
  	"width_step" numeric,
  	"pad_top" "enum__pages_v_blocks_b61_cta_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum__pages_v_blocks_b61_cta_pad_bottom" DEFAULT 'normal',
  	"surface" "enum__pages_v_blocks_b61_cta_surface" DEFAULT 'soft',
  	"text_panel" "enum__pages_v_blocks_b61_cta_text_panel" DEFAULT 'none',
  	"eyebrow_rule" "enum__pages_v_blocks_b61_cta_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum__pages_v_blocks_b61_cta_entrance" DEFAULT 'on',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  DROP TABLE "pages_blocks_cta_band" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_band" CASCADE;
  ALTER TABLE "pages_blocks_b61_cta_lines" ADD CONSTRAINT "pages_blocks_b61_cta_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_cta_subheads" ADD CONSTRAINT "pages_blocks_b61_cta_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_cta_content_blocks" ADD CONSTRAINT "pages_blocks_b61_cta_content_blocks_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_cta_content_blocks" ADD CONSTRAINT "pages_blocks_b61_cta_content_blocks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_cta_buttons" ADD CONSTRAINT "pages_blocks_b61_cta_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_cta_buttons" ADD CONSTRAINT "pages_blocks_b61_cta_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_cta" ADD CONSTRAINT "pages_blocks_b61_cta_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_cta" ADD CONSTRAINT "pages_blocks_b61_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_cta_lines" ADD CONSTRAINT "_pages_v_blocks_b61_cta_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_cta_subheads" ADD CONSTRAINT "_pages_v_blocks_b61_cta_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_cta_content_blocks" ADD CONSTRAINT "_pages_v_blocks_b61_cta_content_blocks_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_cta_content_blocks" ADD CONSTRAINT "_pages_v_blocks_b61_cta_content_blocks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_cta_buttons" ADD CONSTRAINT "_pages_v_blocks_b61_cta_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_cta_buttons" ADD CONSTRAINT "_pages_v_blocks_b61_cta_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_cta" ADD CONSTRAINT "_pages_v_blocks_b61_cta_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_cta" ADD CONSTRAINT "_pages_v_blocks_b61_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_b61_cta_lines_order_idx" ON "pages_blocks_b61_cta_lines" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_cta_lines_parent_id_idx" ON "pages_blocks_b61_cta_lines" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_cta_subheads_order_idx" ON "pages_blocks_b61_cta_subheads" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_cta_subheads_parent_id_idx" ON "pages_blocks_b61_cta_subheads" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_cta_content_blocks_order_idx" ON "pages_blocks_b61_cta_content_blocks" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_cta_content_blocks_parent_id_idx" ON "pages_blocks_b61_cta_content_blocks" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_cta_content_blocks_link_link_page_idx" ON "pages_blocks_b61_cta_content_blocks" USING btree ("link_page_id");
  CREATE INDEX "pages_blocks_b61_cta_buttons_order_idx" ON "pages_blocks_b61_cta_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_cta_buttons_parent_id_idx" ON "pages_blocks_b61_cta_buttons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_cta_buttons_link_link_page_idx" ON "pages_blocks_b61_cta_buttons" USING btree ("link_page_id");
  CREATE INDEX "pages_blocks_b61_cta_order_idx" ON "pages_blocks_b61_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_cta_parent_id_idx" ON "pages_blocks_b61_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_cta_path_idx" ON "pages_blocks_b61_cta" USING btree ("_path");
  CREATE INDEX "pages_blocks_b61_cta_image_idx" ON "pages_blocks_b61_cta" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_b61_cta_lines_order_idx" ON "_pages_v_blocks_b61_cta_lines" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_cta_lines_parent_id_idx" ON "_pages_v_blocks_b61_cta_lines" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_cta_subheads_order_idx" ON "_pages_v_blocks_b61_cta_subheads" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_cta_subheads_parent_id_idx" ON "_pages_v_blocks_b61_cta_subheads" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_cta_content_blocks_order_idx" ON "_pages_v_blocks_b61_cta_content_blocks" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_cta_content_blocks_parent_id_idx" ON "_pages_v_blocks_b61_cta_content_blocks" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_cta_content_blocks_link_link_page_idx" ON "_pages_v_blocks_b61_cta_content_blocks" USING btree ("link_page_id");
  CREATE INDEX "_pages_v_blocks_b61_cta_buttons_order_idx" ON "_pages_v_blocks_b61_cta_buttons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_cta_buttons_parent_id_idx" ON "_pages_v_blocks_b61_cta_buttons" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_cta_buttons_link_link_page_idx" ON "_pages_v_blocks_b61_cta_buttons" USING btree ("link_page_id");
  CREATE INDEX "_pages_v_blocks_b61_cta_order_idx" ON "_pages_v_blocks_b61_cta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_cta_parent_id_idx" ON "_pages_v_blocks_b61_cta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_cta_path_idx" ON "_pages_v_blocks_b61_cta" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_b61_cta_image_idx" ON "_pages_v_blocks_b61_cta" USING btree ("image_id");
  DROP TYPE "public"."enum_pages_blocks_cta_band_tone";
  DROP TYPE "public"."enum_pages_blocks_cta_band_button_style";
  DROP TYPE "public"."enum__pages_v_blocks_cta_band_tone";
  DROP TYPE "public"."enum__pages_v_blocks_cta_band_button_style";`)

  // Content: each old Call to action becomes a B61 CTA Band in the same place.
  await upgradeDemoCta(payload, req, old)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_cta_band_tone" AS ENUM('light', 'muted', 'brand', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_cta_band_button_style" AS ENUM('primary', 'secondary', 'link');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_band_tone" AS ENUM('light', 'muted', 'brand', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_band_button_style" AS ENUM('primary', 'secondary', 'link');
  CREATE TABLE "pages_blocks_cta_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar,
  	"tone" "enum_pages_blocks_cta_band_tone" DEFAULT 'dark',
  	"button_label" varchar,
  	"button_url" varchar,
  	"button_style" "enum_pages_blocks_cta_band_button_style" DEFAULT 'primary',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar,
  	"tone" "enum__pages_v_blocks_cta_band_tone" DEFAULT 'dark',
  	"button_label" varchar,
  	"button_url" varchar,
  	"button_style" "enum__pages_v_blocks_cta_band_button_style" DEFAULT 'primary',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  DROP TABLE "pages_blocks_b61_cta_lines" CASCADE;
  DROP TABLE "pages_blocks_b61_cta_subheads" CASCADE;
  DROP TABLE "pages_blocks_b61_cta_content_blocks" CASCADE;
  DROP TABLE "pages_blocks_b61_cta_buttons" CASCADE;
  DROP TABLE "pages_blocks_b61_cta" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_cta_lines" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_cta_subheads" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_cta_content_blocks" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_cta_buttons" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_cta" CASCADE;
  ALTER TABLE "pages_blocks_cta_band" ADD CONSTRAINT "pages_blocks_cta_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_band" ADD CONSTRAINT "_pages_v_blocks_cta_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_cta_band_order_idx" ON "pages_blocks_cta_band" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_band_parent_id_idx" ON "pages_blocks_cta_band" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_band_path_idx" ON "pages_blocks_cta_band" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_band_order_idx" ON "_pages_v_blocks_cta_band" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_band_parent_id_idx" ON "_pages_v_blocks_cta_band" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_band_path_idx" ON "_pages_v_blocks_cta_band" USING btree ("_path");
  DROP TYPE "public"."enum_pages_blocks_b61_cta_content_blocks_type";
  DROP TYPE "public"."enum_pages_blocks_b61_cta_content_blocks_icon";
  DROP TYPE "public"."enum_pages_blocks_b61_cta_content_blocks_link_type";
  DROP TYPE "public"."enum_pages_blocks_b61_cta_buttons_variant";
  DROP TYPE "public"."enum_pages_blocks_b61_cta_buttons_link_type";
  DROP TYPE "public"."enum_pages_blocks_b61_cta_heading_level";
  DROP TYPE "public"."enum_pages_blocks_b61_cta_text_align";
  DROP TYPE "public"."enum_pages_blocks_b61_cta_position";
  DROP TYPE "public"."enum_pages_blocks_b61_cta_pad_top";
  DROP TYPE "public"."enum_pages_blocks_b61_cta_pad_bottom";
  DROP TYPE "public"."enum_pages_blocks_b61_cta_surface";
  DROP TYPE "public"."enum_pages_blocks_b61_cta_text_panel";
  DROP TYPE "public"."enum_pages_blocks_b61_cta_eyebrow_rule";
  DROP TYPE "public"."enum_pages_blocks_b61_cta_entrance";
  DROP TYPE "public"."enum__pages_v_blocks_b61_cta_content_blocks_type";
  DROP TYPE "public"."enum__pages_v_blocks_b61_cta_content_blocks_icon";
  DROP TYPE "public"."enum__pages_v_blocks_b61_cta_content_blocks_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_b61_cta_buttons_variant";
  DROP TYPE "public"."enum__pages_v_blocks_b61_cta_buttons_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_b61_cta_heading_level";
  DROP TYPE "public"."enum__pages_v_blocks_b61_cta_text_align";
  DROP TYPE "public"."enum__pages_v_blocks_b61_cta_position";
  DROP TYPE "public"."enum__pages_v_blocks_b61_cta_pad_top";
  DROP TYPE "public"."enum__pages_v_blocks_b61_cta_pad_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_b61_cta_surface";
  DROP TYPE "public"."enum__pages_v_blocks_b61_cta_text_panel";
  DROP TYPE "public"."enum__pages_v_blocks_b61_cta_eyebrow_rule";
  DROP TYPE "public"."enum__pages_v_blocks_b61_cta_entrance";`)
}
