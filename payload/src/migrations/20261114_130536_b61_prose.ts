import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import { upgradeDemoProse } from '../b61/upgrade'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Keep the old Text blocks' words (heading and body) before their table goes.
  const res = await db.execute(sql`SELECT "_parent_id" AS page, "_order" AS pos, "heading", "body" FROM "pages_blocks_prose"`)
  const old = ((res as any).rows ?? []).map((r: any) => ({ page: Number(r.page), pos: Number(r.pos), heading: r.heading ?? null, body: r.body ?? null }))

  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_b61_prose_content_blocks_type" AS ENUM('body', 'emphasis', 'quote', 'iconrow');
  CREATE TYPE "public"."enum_pages_blocks_b61_prose_content_blocks_icon" AS ENUM('dot', 'check', 'email', 'phone', 'location', 'calendar', 'clock', 'link', 'star', 'heart', 'book', 'people', 'cross', 'school');
  CREATE TYPE "public"."enum_pages_blocks_b61_prose_content_blocks_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum_pages_blocks_b61_prose_content_blocks_scale" AS ENUM('regular', 'display');
  CREATE TYPE "public"."enum_pages_blocks_b61_prose_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum_pages_blocks_b61_prose_buttons_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum_pages_blocks_b61_prose_heading_level" AS ENUM('auto', 'h1', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum_pages_blocks_b61_prose_head_position" AS ENUM('above', 'beside');
  CREATE TYPE "public"."enum_pages_blocks_b61_prose_text_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_b61_prose_position" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_b61_prose_heading_width" AS ENUM('text', 'full');
  CREATE TYPE "public"."enum_pages_blocks_b61_prose_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_prose_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_prose_iconlist_style" AS ENUM('standard', 'links');
  CREATE TYPE "public"."enum_pages_blocks_b61_prose_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_pages_blocks_b61_prose_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum_pages_blocks_b61_prose_heading_rule" AS ENUM('site', 'none', 'trailing');
  CREATE TYPE "public"."enum_pages_blocks_b61_prose_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_prose_content_blocks_type" AS ENUM('body', 'emphasis', 'quote', 'iconrow');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_prose_content_blocks_icon" AS ENUM('dot', 'check', 'email', 'phone', 'location', 'calendar', 'clock', 'link', 'star', 'heart', 'book', 'people', 'cross', 'school');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_prose_content_blocks_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_prose_content_blocks_scale" AS ENUM('regular', 'display');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_prose_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_prose_buttons_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_prose_heading_level" AS ENUM('auto', 'h1', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_prose_head_position" AS ENUM('above', 'beside');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_prose_text_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_prose_position" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_prose_heading_width" AS ENUM('text', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_prose_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_prose_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_prose_iconlist_style" AS ENUM('standard', 'links');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_prose_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_prose_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_prose_heading_rule" AS ENUM('site', 'none', 'trailing');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_prose_entrance" AS ENUM('on', 'off');
  CREATE TABLE "pages_blocks_b61_prose_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_prose_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_b61_prose_content_blocks" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_pages_blocks_b61_prose_content_blocks_type" DEFAULT 'body',
  	"body" jsonb,
  	"text" varchar,
  	"attribution" varchar,
  	"photo_id" integer,
  	"icon" "enum_pages_blocks_b61_prose_content_blocks_icon" DEFAULT 'dot',
  	"has_link" boolean,
  	"link_type" "enum_pages_blocks_b61_prose_content_blocks_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"scale" "enum_pages_blocks_b61_prose_content_blocks_scale" DEFAULT 'regular',
  	"divider" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_prose_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum_pages_blocks_b61_prose_buttons_variant" DEFAULT 'primary',
  	"link_type" "enum_pages_blocks_b61_prose_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"full_width" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_prose" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading_level" "enum_pages_blocks_b61_prose_heading_level" DEFAULT 'auto',
  	"head_position" "enum_pages_blocks_b61_prose_head_position" DEFAULT 'above',
  	"column_balance" numeric,
  	"text_align" "enum_pages_blocks_b61_prose_text_align" DEFAULT 'left',
  	"position" "enum_pages_blocks_b61_prose_position" DEFAULT 'center',
  	"measure_step" numeric,
  	"heading_width" "enum_pages_blocks_b61_prose_heading_width" DEFAULT 'text',
  	"pad_top" "enum_pages_blocks_b61_prose_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum_pages_blocks_b61_prose_pad_bottom" DEFAULT 'normal',
  	"iconlist_style" "enum_pages_blocks_b61_prose_iconlist_style" DEFAULT 'standard',
  	"iconlist_edges" boolean,
  	"surface" "enum_pages_blocks_b61_prose_surface" DEFAULT 'none',
  	"eyebrow_rule" "enum_pages_blocks_b61_prose_eyebrow_rule" DEFAULT 'site',
  	"heading_rule" "enum_pages_blocks_b61_prose_heading_rule" DEFAULT 'site',
  	"entrance" "enum_pages_blocks_b61_prose_entrance" DEFAULT 'on',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_prose_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_prose_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_prose_content_blocks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum__pages_v_blocks_b61_prose_content_blocks_type" DEFAULT 'body',
  	"body" jsonb,
  	"text" varchar,
  	"attribution" varchar,
  	"photo_id" integer,
  	"icon" "enum__pages_v_blocks_b61_prose_content_blocks_icon" DEFAULT 'dot',
  	"has_link" boolean,
  	"link_type" "enum__pages_v_blocks_b61_prose_content_blocks_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"scale" "enum__pages_v_blocks_b61_prose_content_blocks_scale" DEFAULT 'regular',
  	"divider" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_prose_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum__pages_v_blocks_b61_prose_buttons_variant" DEFAULT 'primary',
  	"link_type" "enum__pages_v_blocks_b61_prose_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"full_width" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_prose" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading_level" "enum__pages_v_blocks_b61_prose_heading_level" DEFAULT 'auto',
  	"head_position" "enum__pages_v_blocks_b61_prose_head_position" DEFAULT 'above',
  	"column_balance" numeric,
  	"text_align" "enum__pages_v_blocks_b61_prose_text_align" DEFAULT 'left',
  	"position" "enum__pages_v_blocks_b61_prose_position" DEFAULT 'center',
  	"measure_step" numeric,
  	"heading_width" "enum__pages_v_blocks_b61_prose_heading_width" DEFAULT 'text',
  	"pad_top" "enum__pages_v_blocks_b61_prose_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum__pages_v_blocks_b61_prose_pad_bottom" DEFAULT 'normal',
  	"iconlist_style" "enum__pages_v_blocks_b61_prose_iconlist_style" DEFAULT 'standard',
  	"iconlist_edges" boolean,
  	"surface" "enum__pages_v_blocks_b61_prose_surface" DEFAULT 'none',
  	"eyebrow_rule" "enum__pages_v_blocks_b61_prose_eyebrow_rule" DEFAULT 'site',
  	"heading_rule" "enum__pages_v_blocks_b61_prose_heading_rule" DEFAULT 'site',
  	"entrance" "enum__pages_v_blocks_b61_prose_entrance" DEFAULT 'on',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  DROP TABLE "pages_blocks_prose" CASCADE;
  DROP TABLE "_pages_v_blocks_prose" CASCADE;
  ALTER TABLE "pages_blocks_b61_prose_lines" ADD CONSTRAINT "pages_blocks_b61_prose_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_prose"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_prose_subheads" ADD CONSTRAINT "pages_blocks_b61_prose_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_prose"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_prose_content_blocks" ADD CONSTRAINT "pages_blocks_b61_prose_content_blocks_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_prose_content_blocks" ADD CONSTRAINT "pages_blocks_b61_prose_content_blocks_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_prose_content_blocks" ADD CONSTRAINT "pages_blocks_b61_prose_content_blocks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_prose"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_prose_buttons" ADD CONSTRAINT "pages_blocks_b61_prose_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_prose_buttons" ADD CONSTRAINT "pages_blocks_b61_prose_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_prose"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_prose" ADD CONSTRAINT "pages_blocks_b61_prose_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_prose_lines" ADD CONSTRAINT "_pages_v_blocks_b61_prose_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_prose"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_prose_subheads" ADD CONSTRAINT "_pages_v_blocks_b61_prose_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_prose"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_prose_content_blocks" ADD CONSTRAINT "_pages_v_blocks_b61_prose_content_blocks_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_prose_content_blocks" ADD CONSTRAINT "_pages_v_blocks_b61_prose_content_blocks_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_prose_content_blocks" ADD CONSTRAINT "_pages_v_blocks_b61_prose_content_blocks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_prose"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_prose_buttons" ADD CONSTRAINT "_pages_v_blocks_b61_prose_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_prose_buttons" ADD CONSTRAINT "_pages_v_blocks_b61_prose_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_prose"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_prose" ADD CONSTRAINT "_pages_v_blocks_b61_prose_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_b61_prose_lines_order_idx" ON "pages_blocks_b61_prose_lines" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_prose_lines_parent_id_idx" ON "pages_blocks_b61_prose_lines" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_prose_subheads_order_idx" ON "pages_blocks_b61_prose_subheads" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_prose_subheads_parent_id_idx" ON "pages_blocks_b61_prose_subheads" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_prose_content_blocks_order_idx" ON "pages_blocks_b61_prose_content_blocks" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_prose_content_blocks_parent_id_idx" ON "pages_blocks_b61_prose_content_blocks" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_prose_content_blocks_photo_idx" ON "pages_blocks_b61_prose_content_blocks" USING btree ("photo_id");
  CREATE INDEX "pages_blocks_b61_prose_content_blocks_link_link_page_idx" ON "pages_blocks_b61_prose_content_blocks" USING btree ("link_page_id");
  CREATE INDEX "pages_blocks_b61_prose_buttons_order_idx" ON "pages_blocks_b61_prose_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_prose_buttons_parent_id_idx" ON "pages_blocks_b61_prose_buttons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_prose_buttons_link_link_page_idx" ON "pages_blocks_b61_prose_buttons" USING btree ("link_page_id");
  CREATE INDEX "pages_blocks_b61_prose_order_idx" ON "pages_blocks_b61_prose" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_prose_parent_id_idx" ON "pages_blocks_b61_prose" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_prose_path_idx" ON "pages_blocks_b61_prose" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_b61_prose_lines_order_idx" ON "_pages_v_blocks_b61_prose_lines" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_prose_lines_parent_id_idx" ON "_pages_v_blocks_b61_prose_lines" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_prose_subheads_order_idx" ON "_pages_v_blocks_b61_prose_subheads" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_prose_subheads_parent_id_idx" ON "_pages_v_blocks_b61_prose_subheads" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_prose_content_blocks_order_idx" ON "_pages_v_blocks_b61_prose_content_blocks" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_prose_content_blocks_parent_id_idx" ON "_pages_v_blocks_b61_prose_content_blocks" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_prose_content_blocks_photo_idx" ON "_pages_v_blocks_b61_prose_content_blocks" USING btree ("photo_id");
  CREATE INDEX "_pages_v_blocks_b61_prose_content_blocks_link_link_page_idx" ON "_pages_v_blocks_b61_prose_content_blocks" USING btree ("link_page_id");
  CREATE INDEX "_pages_v_blocks_b61_prose_buttons_order_idx" ON "_pages_v_blocks_b61_prose_buttons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_prose_buttons_parent_id_idx" ON "_pages_v_blocks_b61_prose_buttons" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_prose_buttons_link_link_page_idx" ON "_pages_v_blocks_b61_prose_buttons" USING btree ("link_page_id");
  CREATE INDEX "_pages_v_blocks_b61_prose_order_idx" ON "_pages_v_blocks_b61_prose" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_prose_parent_id_idx" ON "_pages_v_blocks_b61_prose" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_prose_path_idx" ON "_pages_v_blocks_b61_prose" USING btree ("_path");`)

  // Content: each old Text block becomes a B61 Prose in the same place.
  await upgradeDemoProse(payload, req, old)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_prose" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_prose" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  DROP TABLE "pages_blocks_b61_prose_lines" CASCADE;
  DROP TABLE "pages_blocks_b61_prose_subheads" CASCADE;
  DROP TABLE "pages_blocks_b61_prose_content_blocks" CASCADE;
  DROP TABLE "pages_blocks_b61_prose_buttons" CASCADE;
  DROP TABLE "pages_blocks_b61_prose" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_prose_lines" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_prose_subheads" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_prose_content_blocks" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_prose_buttons" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_prose" CASCADE;
  ALTER TABLE "pages_blocks_prose" ADD CONSTRAINT "pages_blocks_prose_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_prose" ADD CONSTRAINT "_pages_v_blocks_prose_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_prose_order_idx" ON "pages_blocks_prose" USING btree ("_order");
  CREATE INDEX "pages_blocks_prose_parent_id_idx" ON "pages_blocks_prose" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_prose_path_idx" ON "pages_blocks_prose" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_prose_order_idx" ON "_pages_v_blocks_prose" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_prose_parent_id_idx" ON "_pages_v_blocks_prose" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_prose_path_idx" ON "_pages_v_blocks_prose" USING btree ("_path");
  DROP TYPE "public"."enum_pages_blocks_b61_prose_content_blocks_type";
  DROP TYPE "public"."enum_pages_blocks_b61_prose_content_blocks_icon";
  DROP TYPE "public"."enum_pages_blocks_b61_prose_content_blocks_link_type";
  DROP TYPE "public"."enum_pages_blocks_b61_prose_content_blocks_scale";
  DROP TYPE "public"."enum_pages_blocks_b61_prose_buttons_variant";
  DROP TYPE "public"."enum_pages_blocks_b61_prose_buttons_link_type";
  DROP TYPE "public"."enum_pages_blocks_b61_prose_heading_level";
  DROP TYPE "public"."enum_pages_blocks_b61_prose_head_position";
  DROP TYPE "public"."enum_pages_blocks_b61_prose_text_align";
  DROP TYPE "public"."enum_pages_blocks_b61_prose_position";
  DROP TYPE "public"."enum_pages_blocks_b61_prose_heading_width";
  DROP TYPE "public"."enum_pages_blocks_b61_prose_pad_top";
  DROP TYPE "public"."enum_pages_blocks_b61_prose_pad_bottom";
  DROP TYPE "public"."enum_pages_blocks_b61_prose_iconlist_style";
  DROP TYPE "public"."enum_pages_blocks_b61_prose_surface";
  DROP TYPE "public"."enum_pages_blocks_b61_prose_eyebrow_rule";
  DROP TYPE "public"."enum_pages_blocks_b61_prose_heading_rule";
  DROP TYPE "public"."enum_pages_blocks_b61_prose_entrance";
  DROP TYPE "public"."enum__pages_v_blocks_b61_prose_content_blocks_type";
  DROP TYPE "public"."enum__pages_v_blocks_b61_prose_content_blocks_icon";
  DROP TYPE "public"."enum__pages_v_blocks_b61_prose_content_blocks_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_b61_prose_content_blocks_scale";
  DROP TYPE "public"."enum__pages_v_blocks_b61_prose_buttons_variant";
  DROP TYPE "public"."enum__pages_v_blocks_b61_prose_buttons_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_b61_prose_heading_level";
  DROP TYPE "public"."enum__pages_v_blocks_b61_prose_head_position";
  DROP TYPE "public"."enum__pages_v_blocks_b61_prose_text_align";
  DROP TYPE "public"."enum__pages_v_blocks_b61_prose_position";
  DROP TYPE "public"."enum__pages_v_blocks_b61_prose_heading_width";
  DROP TYPE "public"."enum__pages_v_blocks_b61_prose_pad_top";
  DROP TYPE "public"."enum__pages_v_blocks_b61_prose_pad_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_b61_prose_iconlist_style";
  DROP TYPE "public"."enum__pages_v_blocks_b61_prose_surface";
  DROP TYPE "public"."enum__pages_v_blocks_b61_prose_eyebrow_rule";
  DROP TYPE "public"."enum__pages_v_blocks_b61_prose_heading_rule";
  DROP TYPE "public"."enum__pages_v_blocks_b61_prose_entrance";`)
}
