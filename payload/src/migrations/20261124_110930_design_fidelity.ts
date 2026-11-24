import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_b61_hero_breadcrumb_link_type" AS ENUM('page', 'document', 'url');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_hero_breadcrumb_link_type" AS ENUM('page', 'document', 'url');
  CREATE TYPE "public"."enum_school_settings_brand_fonts_style" AS ENUM('normal', 'italic');
  CREATE TYPE "public"."enum_school_settings_button_color" AS ENUM('primary', 'secondary', 'accent');
  CREATE TYPE "public"."enum__school_settings_v_version_brand_fonts_style" AS ENUM('normal', 'italic');
  CREATE TYPE "public"."enum__school_settings_v_version_button_color" AS ENUM('primary', 'secondary', 'accent');
  CREATE TABLE "pages_blocks_b61_hero_breadcrumb" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link_type" "enum_pages_blocks_b61_hero_breadcrumb_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_document_id" integer,
  	"link_url" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_hero_breadcrumb" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link_type" "enum__pages_v_blocks_b61_hero_breadcrumb_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_document_id" integer,
  	"link_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "school_settings_brand_fonts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"family" varchar,
  	"file_id" integer,
  	"weight" numeric DEFAULT 400,
  	"style" "enum_school_settings_brand_fonts_style" DEFAULT 'normal'
  );
  
  CREATE TABLE "_school_settings_v_version_brand_fonts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"family" varchar,
  	"file_id" integer,
  	"weight" numeric DEFAULT 400,
  	"style" "enum__school_settings_v_version_brand_fonts_style" DEFAULT 'normal',
  	"_uuid" varchar
  );
  
  ALTER TABLE "pages_blocks_b61_hero" ADD COLUMN "anchor" varchar;
  ALTER TABLE "pages_blocks_b61_split" ADD COLUMN "anchor" varchar;
  ALTER TABLE "pages_blocks_b61_prose" ADD COLUMN "anchor" varchar;
  ALTER TABLE "pages_blocks_b61_card_grid" ADD COLUMN "connect_steps" boolean;
  ALTER TABLE "pages_blocks_b61_card_grid" ADD COLUMN "anchor" varchar;
  ALTER TABLE "pages_blocks_b61_stats_band" ADD COLUMN "anchor" varchar;
  ALTER TABLE "pages_blocks_b61_gallery" ADD COLUMN "anchor" varchar;
  ALTER TABLE "pages_blocks_b61_testimonial" ADD COLUMN "anchor" varchar;
  ALTER TABLE "pages_blocks_b61_accordion" ADD COLUMN "anchor" varchar;
  ALTER TABLE "pages_blocks_b61_tabs" ADD COLUMN "anchor" varchar;
  ALTER TABLE "pages_blocks_b61_carousel" ADD COLUMN "anchor" varchar;
  ALTER TABLE "pages_blocks_b61_framed_image" ADD COLUMN "anchor" varchar;
  ALTER TABLE "pages_blocks_b61_cta" ADD COLUMN "anchor" varchar;
  ALTER TABLE "pages_blocks_b61_form" ADD COLUMN "anchor" varchar;
  ALTER TABLE "pages_blocks_b61_button_bar" ADD COLUMN "anchor" varchar;
  ALTER TABLE "pages_blocks_b61_divider" ADD COLUMN "anchor" varchar;
  ALTER TABLE "pages_blocks_b61_logos" ADD COLUMN "anchor" varchar;
  ALTER TABLE "pages_blocks_b61_rail" ADD COLUMN "anchor" varchar;
  ALTER TABLE "pages_blocks_b61_section" ADD COLUMN "anchor" varchar;
  ALTER TABLE "_pages_v_blocks_b61_hero" ADD COLUMN "anchor" varchar;
  ALTER TABLE "_pages_v_blocks_b61_split" ADD COLUMN "anchor" varchar;
  ALTER TABLE "_pages_v_blocks_b61_prose" ADD COLUMN "anchor" varchar;
  ALTER TABLE "_pages_v_blocks_b61_card_grid" ADD COLUMN "connect_steps" boolean;
  ALTER TABLE "_pages_v_blocks_b61_card_grid" ADD COLUMN "anchor" varchar;
  ALTER TABLE "_pages_v_blocks_b61_stats_band" ADD COLUMN "anchor" varchar;
  ALTER TABLE "_pages_v_blocks_b61_gallery" ADD COLUMN "anchor" varchar;
  ALTER TABLE "_pages_v_blocks_b61_testimonial" ADD COLUMN "anchor" varchar;
  ALTER TABLE "_pages_v_blocks_b61_accordion" ADD COLUMN "anchor" varchar;
  ALTER TABLE "_pages_v_blocks_b61_tabs" ADD COLUMN "anchor" varchar;
  ALTER TABLE "_pages_v_blocks_b61_carousel" ADD COLUMN "anchor" varchar;
  ALTER TABLE "_pages_v_blocks_b61_framed_image" ADD COLUMN "anchor" varchar;
  ALTER TABLE "_pages_v_blocks_b61_cta" ADD COLUMN "anchor" varchar;
  ALTER TABLE "_pages_v_blocks_b61_form" ADD COLUMN "anchor" varchar;
  ALTER TABLE "_pages_v_blocks_b61_button_bar" ADD COLUMN "anchor" varchar;
  ALTER TABLE "_pages_v_blocks_b61_divider" ADD COLUMN "anchor" varchar;
  ALTER TABLE "_pages_v_blocks_b61_logos" ADD COLUMN "anchor" varchar;
  ALTER TABLE "_pages_v_blocks_b61_rail" ADD COLUMN "anchor" varchar;
  ALTER TABLE "_pages_v_blocks_b61_section" ADD COLUMN "anchor" varchar;
  ALTER TABLE "school_settings" ADD COLUMN "button_color" "enum_school_settings_button_color" DEFAULT 'primary';
  ALTER TABLE "school_settings" ADD COLUMN "heading_font_brand" varchar;
  ALTER TABLE "school_settings" ADD COLUMN "body_font_brand" varchar;
  ALTER TABLE "school_settings" ADD COLUMN "ui_font_brand" varchar;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_button_color" "enum__school_settings_v_version_button_color" DEFAULT 'primary';
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_heading_font_brand" varchar;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_body_font_brand" varchar;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_ui_font_brand" varchar;
  ALTER TABLE "pages_blocks_b61_hero_breadcrumb" ADD CONSTRAINT "pages_blocks_b61_hero_breadcrumb_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_hero_breadcrumb" ADD CONSTRAINT "pages_blocks_b61_hero_breadcrumb_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_hero_breadcrumb" ADD CONSTRAINT "pages_blocks_b61_hero_breadcrumb_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_hero_breadcrumb" ADD CONSTRAINT "_pages_v_blocks_b61_hero_breadcrumb_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_hero_breadcrumb" ADD CONSTRAINT "_pages_v_blocks_b61_hero_breadcrumb_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_hero_breadcrumb" ADD CONSTRAINT "_pages_v_blocks_b61_hero_breadcrumb_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "school_settings_brand_fonts" ADD CONSTRAINT "school_settings_brand_fonts_file_id_documents_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "school_settings_brand_fonts" ADD CONSTRAINT "school_settings_brand_fonts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."school_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_brand_fonts" ADD CONSTRAINT "_school_settings_v_version_brand_fonts_file_id_documents_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_brand_fonts" ADD CONSTRAINT "_school_settings_v_version_brand_fonts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_school_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_b61_hero_breadcrumb_order_idx" ON "pages_blocks_b61_hero_breadcrumb" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_hero_breadcrumb_parent_id_idx" ON "pages_blocks_b61_hero_breadcrumb" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_hero_breadcrumb_link_link_page_idx" ON "pages_blocks_b61_hero_breadcrumb" USING btree ("link_page_id");
  CREATE INDEX "pages_blocks_b61_hero_breadcrumb_link_link_document_idx" ON "pages_blocks_b61_hero_breadcrumb" USING btree ("link_document_id");
  CREATE INDEX "_pages_v_blocks_b61_hero_breadcrumb_order_idx" ON "_pages_v_blocks_b61_hero_breadcrumb" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_hero_breadcrumb_parent_id_idx" ON "_pages_v_blocks_b61_hero_breadcrumb" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_hero_breadcrumb_link_link_page_idx" ON "_pages_v_blocks_b61_hero_breadcrumb" USING btree ("link_page_id");
  CREATE INDEX "_pages_v_blocks_b61_hero_breadcrumb_link_link_document_idx" ON "_pages_v_blocks_b61_hero_breadcrumb" USING btree ("link_document_id");
  CREATE INDEX "school_settings_brand_fonts_order_idx" ON "school_settings_brand_fonts" USING btree ("_order");
  CREATE INDEX "school_settings_brand_fonts_parent_id_idx" ON "school_settings_brand_fonts" USING btree ("_parent_id");
  CREATE INDEX "school_settings_brand_fonts_file_idx" ON "school_settings_brand_fonts" USING btree ("file_id");
  CREATE INDEX "_school_settings_v_version_brand_fonts_order_idx" ON "_school_settings_v_version_brand_fonts" USING btree ("_order");
  CREATE INDEX "_school_settings_v_version_brand_fonts_parent_id_idx" ON "_school_settings_v_version_brand_fonts" USING btree ("_parent_id");
  CREATE INDEX "_school_settings_v_version_brand_fonts_file_idx" ON "_school_settings_v_version_brand_fonts" USING btree ("file_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_b61_hero_breadcrumb" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_hero_breadcrumb" CASCADE;
  DROP TABLE "school_settings_brand_fonts" CASCADE;
  DROP TABLE "_school_settings_v_version_brand_fonts" CASCADE;
  ALTER TABLE "pages_blocks_b61_hero" DROP COLUMN "anchor";
  ALTER TABLE "pages_blocks_b61_split" DROP COLUMN "anchor";
  ALTER TABLE "pages_blocks_b61_prose" DROP COLUMN "anchor";
  ALTER TABLE "pages_blocks_b61_card_grid" DROP COLUMN "connect_steps";
  ALTER TABLE "pages_blocks_b61_card_grid" DROP COLUMN "anchor";
  ALTER TABLE "pages_blocks_b61_stats_band" DROP COLUMN "anchor";
  ALTER TABLE "pages_blocks_b61_gallery" DROP COLUMN "anchor";
  ALTER TABLE "pages_blocks_b61_testimonial" DROP COLUMN "anchor";
  ALTER TABLE "pages_blocks_b61_accordion" DROP COLUMN "anchor";
  ALTER TABLE "pages_blocks_b61_tabs" DROP COLUMN "anchor";
  ALTER TABLE "pages_blocks_b61_carousel" DROP COLUMN "anchor";
  ALTER TABLE "pages_blocks_b61_framed_image" DROP COLUMN "anchor";
  ALTER TABLE "pages_blocks_b61_cta" DROP COLUMN "anchor";
  ALTER TABLE "pages_blocks_b61_form" DROP COLUMN "anchor";
  ALTER TABLE "pages_blocks_b61_button_bar" DROP COLUMN "anchor";
  ALTER TABLE "pages_blocks_b61_divider" DROP COLUMN "anchor";
  ALTER TABLE "pages_blocks_b61_logos" DROP COLUMN "anchor";
  ALTER TABLE "pages_blocks_b61_rail" DROP COLUMN "anchor";
  ALTER TABLE "pages_blocks_b61_section" DROP COLUMN "anchor";
  ALTER TABLE "_pages_v_blocks_b61_hero" DROP COLUMN "anchor";
  ALTER TABLE "_pages_v_blocks_b61_split" DROP COLUMN "anchor";
  ALTER TABLE "_pages_v_blocks_b61_prose" DROP COLUMN "anchor";
  ALTER TABLE "_pages_v_blocks_b61_card_grid" DROP COLUMN "connect_steps";
  ALTER TABLE "_pages_v_blocks_b61_card_grid" DROP COLUMN "anchor";
  ALTER TABLE "_pages_v_blocks_b61_stats_band" DROP COLUMN "anchor";
  ALTER TABLE "_pages_v_blocks_b61_gallery" DROP COLUMN "anchor";
  ALTER TABLE "_pages_v_blocks_b61_testimonial" DROP COLUMN "anchor";
  ALTER TABLE "_pages_v_blocks_b61_accordion" DROP COLUMN "anchor";
  ALTER TABLE "_pages_v_blocks_b61_tabs" DROP COLUMN "anchor";
  ALTER TABLE "_pages_v_blocks_b61_carousel" DROP COLUMN "anchor";
  ALTER TABLE "_pages_v_blocks_b61_framed_image" DROP COLUMN "anchor";
  ALTER TABLE "_pages_v_blocks_b61_cta" DROP COLUMN "anchor";
  ALTER TABLE "_pages_v_blocks_b61_form" DROP COLUMN "anchor";
  ALTER TABLE "_pages_v_blocks_b61_button_bar" DROP COLUMN "anchor";
  ALTER TABLE "_pages_v_blocks_b61_divider" DROP COLUMN "anchor";
  ALTER TABLE "_pages_v_blocks_b61_logos" DROP COLUMN "anchor";
  ALTER TABLE "_pages_v_blocks_b61_rail" DROP COLUMN "anchor";
  ALTER TABLE "_pages_v_blocks_b61_section" DROP COLUMN "anchor";
  ALTER TABLE "school_settings" DROP COLUMN "button_color";
  ALTER TABLE "school_settings" DROP COLUMN "heading_font_brand";
  ALTER TABLE "school_settings" DROP COLUMN "body_font_brand";
  ALTER TABLE "school_settings" DROP COLUMN "ui_font_brand";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_button_color";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_heading_font_brand";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_body_font_brand";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_ui_font_brand";
  DROP TYPE "public"."enum_pages_blocks_b61_hero_breadcrumb_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_b61_hero_breadcrumb_link_type";
  DROP TYPE "public"."enum_school_settings_brand_fonts_style";
  DROP TYPE "public"."enum_school_settings_button_color";
  DROP TYPE "public"."enum__school_settings_v_version_brand_fonts_style";
  DROP TYPE "public"."enum__school_settings_v_version_button_color";`)
}
