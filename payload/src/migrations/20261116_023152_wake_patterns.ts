import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_b61_hero_buttons_action" AS ENUM('link', 'video');
  CREATE TYPE "public"."enum_pages_blocks_b61_split_buttons_action" AS ENUM('link', 'video');
  CREATE TYPE "public"."enum_pages_blocks_b61_prose_buttons_action" AS ENUM('link', 'video');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_buttons_action" AS ENUM('link', 'video');
  CREATE TYPE "public"."enum_pages_blocks_b61_stats_band_buttons_action" AS ENUM('link', 'video');
  CREATE TYPE "public"."enum_pages_blocks_b61_stats_band_band_width" AS ENUM('full', 'right', 'left');
  CREATE TYPE "public"."enum_pages_blocks_b61_gallery_buttons_action" AS ENUM('link', 'video');
  CREATE TYPE "public"."enum_pages_blocks_b61_accordion_buttons_action" AS ENUM('link', 'video');
  CREATE TYPE "public"."enum_pages_blocks_b61_cta_buttons_action" AS ENUM('link', 'video');
  CREATE TYPE "public"."enum_pages_blocks_b61_rail_buttons_action" AS ENUM('link', 'video');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_hero_buttons_action" AS ENUM('link', 'video');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_buttons_action" AS ENUM('link', 'video');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_prose_buttons_action" AS ENUM('link', 'video');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_buttons_action" AS ENUM('link', 'video');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_stats_band_buttons_action" AS ENUM('link', 'video');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_stats_band_band_width" AS ENUM('full', 'right', 'left');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_gallery_buttons_action" AS ENUM('link', 'video');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_accordion_buttons_action" AS ENUM('link', 'video');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_cta_buttons_action" AS ENUM('link', 'video');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_rail_buttons_action" AS ENUM('link', 'video');
  CREATE TYPE "public"."enum_announcements_display" AS ENUM('bar', 'popup');
  CREATE TYPE "public"."enum__announcements_v_version_display" AS ENUM('bar', 'popup');
  CREATE TYPE "public"."enum_school_settings_quick_links_icon" AS ENUM('check', 'email', 'phone', 'location', 'calendar', 'clock', 'link', 'star', 'heart', 'book', 'people', 'cross', 'school');
  CREATE TYPE "public"."enum_school_settings_quick_links_link_type" AS ENUM('page', 'document', 'url');
  CREATE TYPE "public"."enum_school_settings_style_menu" AS ENUM('bar', 'panel');
  CREATE TYPE "public"."enum__school_settings_v_version_quick_links_icon" AS ENUM('check', 'email', 'phone', 'location', 'calendar', 'clock', 'link', 'star', 'heart', 'book', 'people', 'cross', 'school');
  CREATE TYPE "public"."enum__school_settings_v_version_quick_links_link_type" AS ENUM('page', 'document', 'url');
  CREATE TYPE "public"."enum__school_settings_v_version_style_menu" AS ENUM('bar', 'panel');
  CREATE TABLE "pages_blocks_b61_hero_changing_words" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_hero_changing_words" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "school_settings_quick_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"icon" "enum_school_settings_quick_links_icon" DEFAULT 'link',
  	"link_type" "enum_school_settings_quick_links_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_document_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean
  );
  
  CREATE TABLE "_school_settings_v_version_quick_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"icon" "enum__school_settings_v_version_quick_links_icon" DEFAULT 'link',
  	"link_type" "enum__school_settings_v_version_quick_links_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_document_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"_uuid" varchar
  );
  
  ALTER TABLE "pages_blocks_b61_hero_buttons" ADD COLUMN "action" "enum_pages_blocks_b61_hero_buttons_action" DEFAULT 'link';
  ALTER TABLE "pages_blocks_b61_hero_buttons" ADD COLUMN "video" varchar;
  ALTER TABLE "pages_blocks_b61_split_buttons" ADD COLUMN "action" "enum_pages_blocks_b61_split_buttons_action" DEFAULT 'link';
  ALTER TABLE "pages_blocks_b61_split_buttons" ADD COLUMN "video" varchar;
  ALTER TABLE "pages_blocks_b61_split" ADD COLUMN "badge_id" integer;
  ALTER TABLE "pages_blocks_b61_prose_buttons" ADD COLUMN "action" "enum_pages_blocks_b61_prose_buttons_action" DEFAULT 'link';
  ALTER TABLE "pages_blocks_b61_prose_buttons" ADD COLUMN "video" varchar;
  ALTER TABLE "pages_blocks_b61_card_grid_buttons" ADD COLUMN "action" "enum_pages_blocks_b61_card_grid_buttons_action" DEFAULT 'link';
  ALTER TABLE "pages_blocks_b61_card_grid_buttons" ADD COLUMN "video" varchar;
  ALTER TABLE "pages_blocks_b61_card_grid" ADD COLUMN "head_beside" boolean;
  ALTER TABLE "pages_blocks_b61_card_grid" ADD COLUMN "stagger" boolean;
  ALTER TABLE "pages_blocks_b61_card_grid" ADD COLUMN "bleed" boolean;
  ALTER TABLE "pages_blocks_b61_card_grid" ADD COLUMN "hover_reveal" boolean;
  ALTER TABLE "pages_blocks_b61_card_grid" ADD COLUMN "alt_tint" boolean;
  ALTER TABLE "pages_blocks_b61_stats_band_buttons" ADD COLUMN "action" "enum_pages_blocks_b61_stats_band_buttons_action" DEFAULT 'link';
  ALTER TABLE "pages_blocks_b61_stats_band_buttons" ADD COLUMN "video" varchar;
  ALTER TABLE "pages_blocks_b61_stats_band" ADD COLUMN "band_width" "enum_pages_blocks_b61_stats_band_band_width" DEFAULT 'full';
  ALTER TABLE "pages_blocks_b61_stats_band" ADD COLUMN "pull_up" boolean;
  ALTER TABLE "pages_blocks_b61_gallery_buttons" ADD COLUMN "action" "enum_pages_blocks_b61_gallery_buttons_action" DEFAULT 'link';
  ALTER TABLE "pages_blocks_b61_gallery_buttons" ADD COLUMN "video" varchar;
  ALTER TABLE "pages_blocks_b61_accordion_buttons" ADD COLUMN "action" "enum_pages_blocks_b61_accordion_buttons_action" DEFAULT 'link';
  ALTER TABLE "pages_blocks_b61_accordion_buttons" ADD COLUMN "video" varchar;
  ALTER TABLE "pages_blocks_b61_cta_buttons" ADD COLUMN "action" "enum_pages_blocks_b61_cta_buttons_action" DEFAULT 'link';
  ALTER TABLE "pages_blocks_b61_cta_buttons" ADD COLUMN "video" varchar;
  ALTER TABLE "pages_blocks_b61_rail_buttons" ADD COLUMN "action" "enum_pages_blocks_b61_rail_buttons_action" DEFAULT 'link';
  ALTER TABLE "pages_blocks_b61_rail_buttons" ADD COLUMN "video" varchar;
  ALTER TABLE "pages_blocks_b61_section" ADD COLUMN "duotone" boolean;
  ALTER TABLE "_pages_v_blocks_b61_hero_buttons" ADD COLUMN "action" "enum__pages_v_blocks_b61_hero_buttons_action" DEFAULT 'link';
  ALTER TABLE "_pages_v_blocks_b61_hero_buttons" ADD COLUMN "video" varchar;
  ALTER TABLE "_pages_v_blocks_b61_split_buttons" ADD COLUMN "action" "enum__pages_v_blocks_b61_split_buttons_action" DEFAULT 'link';
  ALTER TABLE "_pages_v_blocks_b61_split_buttons" ADD COLUMN "video" varchar;
  ALTER TABLE "_pages_v_blocks_b61_split" ADD COLUMN "badge_id" integer;
  ALTER TABLE "_pages_v_blocks_b61_prose_buttons" ADD COLUMN "action" "enum__pages_v_blocks_b61_prose_buttons_action" DEFAULT 'link';
  ALTER TABLE "_pages_v_blocks_b61_prose_buttons" ADD COLUMN "video" varchar;
  ALTER TABLE "_pages_v_blocks_b61_card_grid_buttons" ADD COLUMN "action" "enum__pages_v_blocks_b61_card_grid_buttons_action" DEFAULT 'link';
  ALTER TABLE "_pages_v_blocks_b61_card_grid_buttons" ADD COLUMN "video" varchar;
  ALTER TABLE "_pages_v_blocks_b61_card_grid" ADD COLUMN "head_beside" boolean;
  ALTER TABLE "_pages_v_blocks_b61_card_grid" ADD COLUMN "stagger" boolean;
  ALTER TABLE "_pages_v_blocks_b61_card_grid" ADD COLUMN "bleed" boolean;
  ALTER TABLE "_pages_v_blocks_b61_card_grid" ADD COLUMN "hover_reveal" boolean;
  ALTER TABLE "_pages_v_blocks_b61_card_grid" ADD COLUMN "alt_tint" boolean;
  ALTER TABLE "_pages_v_blocks_b61_stats_band_buttons" ADD COLUMN "action" "enum__pages_v_blocks_b61_stats_band_buttons_action" DEFAULT 'link';
  ALTER TABLE "_pages_v_blocks_b61_stats_band_buttons" ADD COLUMN "video" varchar;
  ALTER TABLE "_pages_v_blocks_b61_stats_band" ADD COLUMN "band_width" "enum__pages_v_blocks_b61_stats_band_band_width" DEFAULT 'full';
  ALTER TABLE "_pages_v_blocks_b61_stats_band" ADD COLUMN "pull_up" boolean;
  ALTER TABLE "_pages_v_blocks_b61_gallery_buttons" ADD COLUMN "action" "enum__pages_v_blocks_b61_gallery_buttons_action" DEFAULT 'link';
  ALTER TABLE "_pages_v_blocks_b61_gallery_buttons" ADD COLUMN "video" varchar;
  ALTER TABLE "_pages_v_blocks_b61_accordion_buttons" ADD COLUMN "action" "enum__pages_v_blocks_b61_accordion_buttons_action" DEFAULT 'link';
  ALTER TABLE "_pages_v_blocks_b61_accordion_buttons" ADD COLUMN "video" varchar;
  ALTER TABLE "_pages_v_blocks_b61_cta_buttons" ADD COLUMN "action" "enum__pages_v_blocks_b61_cta_buttons_action" DEFAULT 'link';
  ALTER TABLE "_pages_v_blocks_b61_cta_buttons" ADD COLUMN "video" varchar;
  ALTER TABLE "_pages_v_blocks_b61_rail_buttons" ADD COLUMN "action" "enum__pages_v_blocks_b61_rail_buttons_action" DEFAULT 'link';
  ALTER TABLE "_pages_v_blocks_b61_rail_buttons" ADD COLUMN "video" varchar;
  ALTER TABLE "_pages_v_blocks_b61_section" ADD COLUMN "duotone" boolean;
  ALTER TABLE "announcements" ADD COLUMN "display" "enum_announcements_display" DEFAULT 'bar';
  ALTER TABLE "announcements" ADD COLUMN "image_id" integer;
  ALTER TABLE "_announcements_v" ADD COLUMN "version_display" "enum__announcements_v_version_display" DEFAULT 'bar';
  ALTER TABLE "_announcements_v" ADD COLUMN "version_image_id" integer;
  ALTER TABLE "school_settings" ADD COLUMN "style_menu" "enum_school_settings_style_menu";
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_style_menu" "enum__school_settings_v_version_style_menu";
  ALTER TABLE "pages_blocks_b61_hero_changing_words" ADD CONSTRAINT "pages_blocks_b61_hero_changing_words_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_hero_changing_words" ADD CONSTRAINT "_pages_v_blocks_b61_hero_changing_words_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "school_settings_quick_links" ADD CONSTRAINT "school_settings_quick_links_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "school_settings_quick_links" ADD CONSTRAINT "school_settings_quick_links_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "school_settings_quick_links" ADD CONSTRAINT "school_settings_quick_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."school_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_quick_links" ADD CONSTRAINT "_school_settings_v_version_quick_links_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_quick_links" ADD CONSTRAINT "_school_settings_v_version_quick_links_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_quick_links" ADD CONSTRAINT "_school_settings_v_version_quick_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_school_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_b61_hero_changing_words_order_idx" ON "pages_blocks_b61_hero_changing_words" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_hero_changing_words_parent_id_idx" ON "pages_blocks_b61_hero_changing_words" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_hero_changing_words_order_idx" ON "_pages_v_blocks_b61_hero_changing_words" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_hero_changing_words_parent_id_idx" ON "_pages_v_blocks_b61_hero_changing_words" USING btree ("_parent_id");
  CREATE INDEX "school_settings_quick_links_order_idx" ON "school_settings_quick_links" USING btree ("_order");
  CREATE INDEX "school_settings_quick_links_parent_id_idx" ON "school_settings_quick_links" USING btree ("_parent_id");
  CREATE INDEX "school_settings_quick_links_link_link_page_idx" ON "school_settings_quick_links" USING btree ("link_page_id");
  CREATE INDEX "school_settings_quick_links_link_link_document_idx" ON "school_settings_quick_links" USING btree ("link_document_id");
  CREATE INDEX "_school_settings_v_version_quick_links_order_idx" ON "_school_settings_v_version_quick_links" USING btree ("_order");
  CREATE INDEX "_school_settings_v_version_quick_links_parent_id_idx" ON "_school_settings_v_version_quick_links" USING btree ("_parent_id");
  CREATE INDEX "_school_settings_v_version_quick_links_link_link_page_idx" ON "_school_settings_v_version_quick_links" USING btree ("link_page_id");
  CREATE INDEX "_school_settings_v_version_quick_links_link_link_documen_idx" ON "_school_settings_v_version_quick_links" USING btree ("link_document_id");
  ALTER TABLE "pages_blocks_b61_split" ADD CONSTRAINT "pages_blocks_b61_split_badge_id_media_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_split" ADD CONSTRAINT "_pages_v_blocks_b61_split_badge_id_media_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "announcements" ADD CONSTRAINT "announcements_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_announcements_v" ADD CONSTRAINT "_announcements_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_b61_split_badge_idx" ON "pages_blocks_b61_split" USING btree ("badge_id");
  CREATE INDEX "_pages_v_blocks_b61_split_badge_idx" ON "_pages_v_blocks_b61_split" USING btree ("badge_id");
  CREATE INDEX "announcements_image_idx" ON "announcements" USING btree ("image_id");
  CREATE INDEX "_announcements_v_version_version_image_idx" ON "_announcements_v" USING btree ("version_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_b61_hero_changing_words" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_b61_hero_changing_words" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "school_settings_quick_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_school_settings_v_version_quick_links" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_b61_hero_changing_words" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_hero_changing_words" CASCADE;
  DROP TABLE "school_settings_quick_links" CASCADE;
  DROP TABLE "_school_settings_v_version_quick_links" CASCADE;
  ALTER TABLE "pages_blocks_b61_split" DROP CONSTRAINT "pages_blocks_b61_split_badge_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_b61_split" DROP CONSTRAINT "_pages_v_blocks_b61_split_badge_id_media_id_fk";
  
  ALTER TABLE "announcements" DROP CONSTRAINT "announcements_image_id_media_id_fk";
  
  ALTER TABLE "_announcements_v" DROP CONSTRAINT "_announcements_v_version_image_id_media_id_fk";
  
  DROP INDEX "pages_blocks_b61_split_badge_idx";
  DROP INDEX "_pages_v_blocks_b61_split_badge_idx";
  DROP INDEX "announcements_image_idx";
  DROP INDEX "_announcements_v_version_version_image_idx";
  ALTER TABLE "pages_blocks_b61_hero_buttons" DROP COLUMN "action";
  ALTER TABLE "pages_blocks_b61_hero_buttons" DROP COLUMN "video";
  ALTER TABLE "pages_blocks_b61_split_buttons" DROP COLUMN "action";
  ALTER TABLE "pages_blocks_b61_split_buttons" DROP COLUMN "video";
  ALTER TABLE "pages_blocks_b61_split" DROP COLUMN "badge_id";
  ALTER TABLE "pages_blocks_b61_prose_buttons" DROP COLUMN "action";
  ALTER TABLE "pages_blocks_b61_prose_buttons" DROP COLUMN "video";
  ALTER TABLE "pages_blocks_b61_card_grid_buttons" DROP COLUMN "action";
  ALTER TABLE "pages_blocks_b61_card_grid_buttons" DROP COLUMN "video";
  ALTER TABLE "pages_blocks_b61_card_grid" DROP COLUMN "head_beside";
  ALTER TABLE "pages_blocks_b61_card_grid" DROP COLUMN "stagger";
  ALTER TABLE "pages_blocks_b61_card_grid" DROP COLUMN "bleed";
  ALTER TABLE "pages_blocks_b61_card_grid" DROP COLUMN "hover_reveal";
  ALTER TABLE "pages_blocks_b61_card_grid" DROP COLUMN "alt_tint";
  ALTER TABLE "pages_blocks_b61_stats_band_buttons" DROP COLUMN "action";
  ALTER TABLE "pages_blocks_b61_stats_band_buttons" DROP COLUMN "video";
  ALTER TABLE "pages_blocks_b61_stats_band" DROP COLUMN "band_width";
  ALTER TABLE "pages_blocks_b61_stats_band" DROP COLUMN "pull_up";
  ALTER TABLE "pages_blocks_b61_gallery_buttons" DROP COLUMN "action";
  ALTER TABLE "pages_blocks_b61_gallery_buttons" DROP COLUMN "video";
  ALTER TABLE "pages_blocks_b61_accordion_buttons" DROP COLUMN "action";
  ALTER TABLE "pages_blocks_b61_accordion_buttons" DROP COLUMN "video";
  ALTER TABLE "pages_blocks_b61_cta_buttons" DROP COLUMN "action";
  ALTER TABLE "pages_blocks_b61_cta_buttons" DROP COLUMN "video";
  ALTER TABLE "pages_blocks_b61_rail_buttons" DROP COLUMN "action";
  ALTER TABLE "pages_blocks_b61_rail_buttons" DROP COLUMN "video";
  ALTER TABLE "pages_blocks_b61_section" DROP COLUMN "duotone";
  ALTER TABLE "_pages_v_blocks_b61_hero_buttons" DROP COLUMN "action";
  ALTER TABLE "_pages_v_blocks_b61_hero_buttons" DROP COLUMN "video";
  ALTER TABLE "_pages_v_blocks_b61_split_buttons" DROP COLUMN "action";
  ALTER TABLE "_pages_v_blocks_b61_split_buttons" DROP COLUMN "video";
  ALTER TABLE "_pages_v_blocks_b61_split" DROP COLUMN "badge_id";
  ALTER TABLE "_pages_v_blocks_b61_prose_buttons" DROP COLUMN "action";
  ALTER TABLE "_pages_v_blocks_b61_prose_buttons" DROP COLUMN "video";
  ALTER TABLE "_pages_v_blocks_b61_card_grid_buttons" DROP COLUMN "action";
  ALTER TABLE "_pages_v_blocks_b61_card_grid_buttons" DROP COLUMN "video";
  ALTER TABLE "_pages_v_blocks_b61_card_grid" DROP COLUMN "head_beside";
  ALTER TABLE "_pages_v_blocks_b61_card_grid" DROP COLUMN "stagger";
  ALTER TABLE "_pages_v_blocks_b61_card_grid" DROP COLUMN "bleed";
  ALTER TABLE "_pages_v_blocks_b61_card_grid" DROP COLUMN "hover_reveal";
  ALTER TABLE "_pages_v_blocks_b61_card_grid" DROP COLUMN "alt_tint";
  ALTER TABLE "_pages_v_blocks_b61_stats_band_buttons" DROP COLUMN "action";
  ALTER TABLE "_pages_v_blocks_b61_stats_band_buttons" DROP COLUMN "video";
  ALTER TABLE "_pages_v_blocks_b61_stats_band" DROP COLUMN "band_width";
  ALTER TABLE "_pages_v_blocks_b61_stats_band" DROP COLUMN "pull_up";
  ALTER TABLE "_pages_v_blocks_b61_gallery_buttons" DROP COLUMN "action";
  ALTER TABLE "_pages_v_blocks_b61_gallery_buttons" DROP COLUMN "video";
  ALTER TABLE "_pages_v_blocks_b61_accordion_buttons" DROP COLUMN "action";
  ALTER TABLE "_pages_v_blocks_b61_accordion_buttons" DROP COLUMN "video";
  ALTER TABLE "_pages_v_blocks_b61_cta_buttons" DROP COLUMN "action";
  ALTER TABLE "_pages_v_blocks_b61_cta_buttons" DROP COLUMN "video";
  ALTER TABLE "_pages_v_blocks_b61_rail_buttons" DROP COLUMN "action";
  ALTER TABLE "_pages_v_blocks_b61_rail_buttons" DROP COLUMN "video";
  ALTER TABLE "_pages_v_blocks_b61_section" DROP COLUMN "duotone";
  ALTER TABLE "announcements" DROP COLUMN "display";
  ALTER TABLE "announcements" DROP COLUMN "image_id";
  ALTER TABLE "_announcements_v" DROP COLUMN "version_display";
  ALTER TABLE "_announcements_v" DROP COLUMN "version_image_id";
  ALTER TABLE "school_settings" DROP COLUMN "style_menu";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_style_menu";
  DROP TYPE "public"."enum_pages_blocks_b61_hero_buttons_action";
  DROP TYPE "public"."enum_pages_blocks_b61_split_buttons_action";
  DROP TYPE "public"."enum_pages_blocks_b61_prose_buttons_action";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_buttons_action";
  DROP TYPE "public"."enum_pages_blocks_b61_stats_band_buttons_action";
  DROP TYPE "public"."enum_pages_blocks_b61_stats_band_band_width";
  DROP TYPE "public"."enum_pages_blocks_b61_gallery_buttons_action";
  DROP TYPE "public"."enum_pages_blocks_b61_accordion_buttons_action";
  DROP TYPE "public"."enum_pages_blocks_b61_cta_buttons_action";
  DROP TYPE "public"."enum_pages_blocks_b61_rail_buttons_action";
  DROP TYPE "public"."enum__pages_v_blocks_b61_hero_buttons_action";
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_buttons_action";
  DROP TYPE "public"."enum__pages_v_blocks_b61_prose_buttons_action";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_buttons_action";
  DROP TYPE "public"."enum__pages_v_blocks_b61_stats_band_buttons_action";
  DROP TYPE "public"."enum__pages_v_blocks_b61_stats_band_band_width";
  DROP TYPE "public"."enum__pages_v_blocks_b61_gallery_buttons_action";
  DROP TYPE "public"."enum__pages_v_blocks_b61_accordion_buttons_action";
  DROP TYPE "public"."enum__pages_v_blocks_b61_cta_buttons_action";
  DROP TYPE "public"."enum__pages_v_blocks_b61_rail_buttons_action";
  DROP TYPE "public"."enum_announcements_display";
  DROP TYPE "public"."enum__announcements_v_version_display";
  DROP TYPE "public"."enum_school_settings_quick_links_icon";
  DROP TYPE "public"."enum_school_settings_quick_links_link_type";
  DROP TYPE "public"."enum_school_settings_style_menu";
  DROP TYPE "public"."enum__school_settings_v_version_quick_links_icon";
  DROP TYPE "public"."enum__school_settings_v_version_quick_links_link_type";
  DROP TYPE "public"."enum__school_settings_v_version_style_menu";`)
}
