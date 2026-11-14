import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import { upgradeChrome } from '../b61/upgrade'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Keep the old navigation and header button before their columns go.
  const nav = ((await db.execute(sql`SELECT "label", "url" FROM "school_settings_navigation" ORDER BY "_order"`)) as any).rows ?? []
  const btn = (((await db.execute(sql`SELECT "header_button_label" AS label, "header_button_url" AS url FROM "school_settings" LIMIT 1`)) as any).rows ?? [])[0] ?? {}

  await db.execute(sql`
   CREATE TYPE "public"."enum_school_settings_menu_links_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum_school_settings_menu_columns_links_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum_school_settings_menu_kind" AS ENUM('link', 'dropdown', 'mega');
  CREATE TYPE "public"."enum_school_settings_menu_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum_school_settings_menu_feature_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum_school_settings_utility_links_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum_school_settings_footer_columns_links_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum_school_settings_social_platform" AS ENUM('facebook', 'instagram', 'youtube', 'x', 'linkedin', 'tiktok', 'vimeo');
  CREATE TYPE "public"."enum_school_settings_legal_links_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum_school_settings_header_button_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum__school_settings_v_version_menu_links_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum__school_settings_v_version_menu_columns_links_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum__school_settings_v_version_menu_kind" AS ENUM('link', 'dropdown', 'mega');
  CREATE TYPE "public"."enum__school_settings_v_version_menu_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum__school_settings_v_version_menu_feature_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum__school_settings_v_version_utility_links_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum__school_settings_v_version_footer_columns_links_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum__school_settings_v_version_social_platform" AS ENUM('facebook', 'instagram', 'youtube', 'x', 'linkedin', 'tiktok', 'vimeo');
  CREATE TYPE "public"."enum__school_settings_v_version_legal_links_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum__school_settings_v_version_header_button_link_type" AS ENUM('page', 'url');
  CREATE TABLE "school_settings_menu_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link_type" "enum_school_settings_menu_links_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean
  );
  
  CREATE TABLE "school_settings_menu_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link_type" "enum_school_settings_menu_columns_links_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"description" varchar
  );
  
  CREATE TABLE "school_settings_menu_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar
  );
  
  CREATE TABLE "school_settings_menu" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"kind" "enum_school_settings_menu_kind" DEFAULT 'link',
  	"link_type" "enum_school_settings_menu_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"feature_image_id" integer,
  	"feature_title" varchar,
  	"feature_text" varchar,
  	"feature_link_type" "enum_school_settings_menu_feature_link_type" DEFAULT 'page',
  	"feature_link_page_id" integer,
  	"feature_link_url" varchar,
  	"feature_link_new_tab" boolean
  );
  
  CREATE TABLE "school_settings_utility_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link_type" "enum_school_settings_utility_links_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean
  );
  
  CREATE TABLE "school_settings_footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link_type" "enum_school_settings_footer_columns_links_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean
  );
  
  CREATE TABLE "school_settings_footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar
  );
  
  CREATE TABLE "school_settings_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_school_settings_social_platform" DEFAULT 'facebook',
  	"url" varchar
  );
  
  CREATE TABLE "school_settings_legal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link_type" "enum_school_settings_legal_links_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean
  );
  
  CREATE TABLE "_school_settings_v_version_menu_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link_type" "enum__school_settings_v_version_menu_links_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_school_settings_v_version_menu_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link_type" "enum__school_settings_v_version_menu_columns_links_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_school_settings_v_version_menu_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_school_settings_v_version_menu" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"kind" "enum__school_settings_v_version_menu_kind" DEFAULT 'link',
  	"link_type" "enum__school_settings_v_version_menu_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"feature_image_id" integer,
  	"feature_title" varchar,
  	"feature_text" varchar,
  	"feature_link_type" "enum__school_settings_v_version_menu_feature_link_type" DEFAULT 'page',
  	"feature_link_page_id" integer,
  	"feature_link_url" varchar,
  	"feature_link_new_tab" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_school_settings_v_version_utility_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link_type" "enum__school_settings_v_version_utility_links_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_school_settings_v_version_footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link_type" "enum__school_settings_v_version_footer_columns_links_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_school_settings_v_version_footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_school_settings_v_version_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"platform" "enum__school_settings_v_version_social_platform" DEFAULT 'facebook',
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_school_settings_v_version_legal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link_type" "enum__school_settings_v_version_legal_links_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"_uuid" varchar
  );
  
  ALTER TABLE "school_settings_navigation" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_school_settings_v_version_navigation" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "school_settings_navigation" CASCADE;
  DROP TABLE "_school_settings_v_version_navigation" CASCADE;
  ALTER TABLE "school_settings" ADD COLUMN "header_button_link_type" "enum_school_settings_header_button_link_type" DEFAULT 'page';
  ALTER TABLE "school_settings" ADD COLUMN "header_button_link_page_id" integer;
  ALTER TABLE "school_settings" ADD COLUMN "header_button_link_url" varchar;
  ALTER TABLE "school_settings" ADD COLUMN "header_button_link_new_tab" boolean;
  ALTER TABLE "school_settings" ADD COLUMN "footer_show_contact" boolean DEFAULT true;
  ALTER TABLE "school_settings" ADD COLUMN "footer_note" varchar;
  ALTER TABLE "school_settings" ADD COLUMN "copyright" varchar;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_header_button_link_type" "enum__school_settings_v_version_header_button_link_type" DEFAULT 'page';
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_header_button_link_page_id" integer;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_header_button_link_url" varchar;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_header_button_link_new_tab" boolean;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_footer_show_contact" boolean DEFAULT true;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_footer_note" varchar;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_copyright" varchar;
  ALTER TABLE "school_settings_menu_links" ADD CONSTRAINT "school_settings_menu_links_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "school_settings_menu_links" ADD CONSTRAINT "school_settings_menu_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."school_settings_menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "school_settings_menu_columns_links" ADD CONSTRAINT "school_settings_menu_columns_links_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "school_settings_menu_columns_links" ADD CONSTRAINT "school_settings_menu_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."school_settings_menu_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "school_settings_menu_columns" ADD CONSTRAINT "school_settings_menu_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."school_settings_menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "school_settings_menu" ADD CONSTRAINT "school_settings_menu_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "school_settings_menu" ADD CONSTRAINT "school_settings_menu_feature_image_id_media_id_fk" FOREIGN KEY ("feature_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "school_settings_menu" ADD CONSTRAINT "school_settings_menu_feature_link_page_id_pages_id_fk" FOREIGN KEY ("feature_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "school_settings_menu" ADD CONSTRAINT "school_settings_menu_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."school_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "school_settings_utility_links" ADD CONSTRAINT "school_settings_utility_links_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "school_settings_utility_links" ADD CONSTRAINT "school_settings_utility_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."school_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "school_settings_footer_columns_links" ADD CONSTRAINT "school_settings_footer_columns_links_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "school_settings_footer_columns_links" ADD CONSTRAINT "school_settings_footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."school_settings_footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "school_settings_footer_columns" ADD CONSTRAINT "school_settings_footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."school_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "school_settings_social" ADD CONSTRAINT "school_settings_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."school_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "school_settings_legal_links" ADD CONSTRAINT "school_settings_legal_links_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "school_settings_legal_links" ADD CONSTRAINT "school_settings_legal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."school_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_menu_links" ADD CONSTRAINT "_school_settings_v_version_menu_links_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_menu_links" ADD CONSTRAINT "_school_settings_v_version_menu_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_school_settings_v_version_menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_menu_columns_links" ADD CONSTRAINT "_school_settings_v_version_menu_columns_links_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_menu_columns_links" ADD CONSTRAINT "_school_settings_v_version_menu_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_school_settings_v_version_menu_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_menu_columns" ADD CONSTRAINT "_school_settings_v_version_menu_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_school_settings_v_version_menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_menu" ADD CONSTRAINT "_school_settings_v_version_menu_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_menu" ADD CONSTRAINT "_school_settings_v_version_menu_feature_image_id_media_id_fk" FOREIGN KEY ("feature_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_menu" ADD CONSTRAINT "_school_settings_v_version_menu_feature_link_page_id_pages_id_fk" FOREIGN KEY ("feature_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_menu" ADD CONSTRAINT "_school_settings_v_version_menu_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_school_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_utility_links" ADD CONSTRAINT "_school_settings_v_version_utility_links_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_utility_links" ADD CONSTRAINT "_school_settings_v_version_utility_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_school_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_footer_columns_links" ADD CONSTRAINT "_school_settings_v_version_footer_columns_links_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_footer_columns_links" ADD CONSTRAINT "_school_settings_v_version_footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_school_settings_v_version_footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_footer_columns" ADD CONSTRAINT "_school_settings_v_version_footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_school_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_social" ADD CONSTRAINT "_school_settings_v_version_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_school_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_legal_links" ADD CONSTRAINT "_school_settings_v_version_legal_links_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_legal_links" ADD CONSTRAINT "_school_settings_v_version_legal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_school_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "school_settings_menu_links_order_idx" ON "school_settings_menu_links" USING btree ("_order");
  CREATE INDEX "school_settings_menu_links_parent_id_idx" ON "school_settings_menu_links" USING btree ("_parent_id");
  CREATE INDEX "school_settings_menu_links_link_link_page_idx" ON "school_settings_menu_links" USING btree ("link_page_id");
  CREATE INDEX "school_settings_menu_columns_links_order_idx" ON "school_settings_menu_columns_links" USING btree ("_order");
  CREATE INDEX "school_settings_menu_columns_links_parent_id_idx" ON "school_settings_menu_columns_links" USING btree ("_parent_id");
  CREATE INDEX "school_settings_menu_columns_links_link_link_page_idx" ON "school_settings_menu_columns_links" USING btree ("link_page_id");
  CREATE INDEX "school_settings_menu_columns_order_idx" ON "school_settings_menu_columns" USING btree ("_order");
  CREATE INDEX "school_settings_menu_columns_parent_id_idx" ON "school_settings_menu_columns" USING btree ("_parent_id");
  CREATE INDEX "school_settings_menu_order_idx" ON "school_settings_menu" USING btree ("_order");
  CREATE INDEX "school_settings_menu_parent_id_idx" ON "school_settings_menu" USING btree ("_parent_id");
  CREATE INDEX "school_settings_menu_link_link_page_idx" ON "school_settings_menu" USING btree ("link_page_id");
  CREATE INDEX "school_settings_menu_feature_feature_image_idx" ON "school_settings_menu" USING btree ("feature_image_id");
  CREATE INDEX "school_settings_menu_feature_link_feature_link_page_idx" ON "school_settings_menu" USING btree ("feature_link_page_id");
  CREATE INDEX "school_settings_utility_links_order_idx" ON "school_settings_utility_links" USING btree ("_order");
  CREATE INDEX "school_settings_utility_links_parent_id_idx" ON "school_settings_utility_links" USING btree ("_parent_id");
  CREATE INDEX "school_settings_utility_links_link_link_page_idx" ON "school_settings_utility_links" USING btree ("link_page_id");
  CREATE INDEX "school_settings_footer_columns_links_order_idx" ON "school_settings_footer_columns_links" USING btree ("_order");
  CREATE INDEX "school_settings_footer_columns_links_parent_id_idx" ON "school_settings_footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "school_settings_footer_columns_links_link_link_page_idx" ON "school_settings_footer_columns_links" USING btree ("link_page_id");
  CREATE INDEX "school_settings_footer_columns_order_idx" ON "school_settings_footer_columns" USING btree ("_order");
  CREATE INDEX "school_settings_footer_columns_parent_id_idx" ON "school_settings_footer_columns" USING btree ("_parent_id");
  CREATE INDEX "school_settings_social_order_idx" ON "school_settings_social" USING btree ("_order");
  CREATE INDEX "school_settings_social_parent_id_idx" ON "school_settings_social" USING btree ("_parent_id");
  CREATE INDEX "school_settings_legal_links_order_idx" ON "school_settings_legal_links" USING btree ("_order");
  CREATE INDEX "school_settings_legal_links_parent_id_idx" ON "school_settings_legal_links" USING btree ("_parent_id");
  CREATE INDEX "school_settings_legal_links_link_link_page_idx" ON "school_settings_legal_links" USING btree ("link_page_id");
  CREATE INDEX "_school_settings_v_version_menu_links_order_idx" ON "_school_settings_v_version_menu_links" USING btree ("_order");
  CREATE INDEX "_school_settings_v_version_menu_links_parent_id_idx" ON "_school_settings_v_version_menu_links" USING btree ("_parent_id");
  CREATE INDEX "_school_settings_v_version_menu_links_link_link_page_idx" ON "_school_settings_v_version_menu_links" USING btree ("link_page_id");
  CREATE INDEX "_school_settings_v_version_menu_columns_links_order_idx" ON "_school_settings_v_version_menu_columns_links" USING btree ("_order");
  CREATE INDEX "_school_settings_v_version_menu_columns_links_parent_id_idx" ON "_school_settings_v_version_menu_columns_links" USING btree ("_parent_id");
  CREATE INDEX "_school_settings_v_version_menu_columns_links_link_link__idx" ON "_school_settings_v_version_menu_columns_links" USING btree ("link_page_id");
  CREATE INDEX "_school_settings_v_version_menu_columns_order_idx" ON "_school_settings_v_version_menu_columns" USING btree ("_order");
  CREATE INDEX "_school_settings_v_version_menu_columns_parent_id_idx" ON "_school_settings_v_version_menu_columns" USING btree ("_parent_id");
  CREATE INDEX "_school_settings_v_version_menu_order_idx" ON "_school_settings_v_version_menu" USING btree ("_order");
  CREATE INDEX "_school_settings_v_version_menu_parent_id_idx" ON "_school_settings_v_version_menu" USING btree ("_parent_id");
  CREATE INDEX "_school_settings_v_version_menu_link_link_page_idx" ON "_school_settings_v_version_menu" USING btree ("link_page_id");
  CREATE INDEX "_school_settings_v_version_menu_feature_feature_image_idx" ON "_school_settings_v_version_menu" USING btree ("feature_image_id");
  CREATE INDEX "_school_settings_v_version_menu_feature_link_feature_lin_idx" ON "_school_settings_v_version_menu" USING btree ("feature_link_page_id");
  CREATE INDEX "_school_settings_v_version_utility_links_order_idx" ON "_school_settings_v_version_utility_links" USING btree ("_order");
  CREATE INDEX "_school_settings_v_version_utility_links_parent_id_idx" ON "_school_settings_v_version_utility_links" USING btree ("_parent_id");
  CREATE INDEX "_school_settings_v_version_utility_links_link_link_page_idx" ON "_school_settings_v_version_utility_links" USING btree ("link_page_id");
  CREATE INDEX "_school_settings_v_version_footer_columns_links_order_idx" ON "_school_settings_v_version_footer_columns_links" USING btree ("_order");
  CREATE INDEX "_school_settings_v_version_footer_columns_links_parent_id_idx" ON "_school_settings_v_version_footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "_school_settings_v_version_footer_columns_links_link_lin_idx" ON "_school_settings_v_version_footer_columns_links" USING btree ("link_page_id");
  CREATE INDEX "_school_settings_v_version_footer_columns_order_idx" ON "_school_settings_v_version_footer_columns" USING btree ("_order");
  CREATE INDEX "_school_settings_v_version_footer_columns_parent_id_idx" ON "_school_settings_v_version_footer_columns" USING btree ("_parent_id");
  CREATE INDEX "_school_settings_v_version_social_order_idx" ON "_school_settings_v_version_social" USING btree ("_order");
  CREATE INDEX "_school_settings_v_version_social_parent_id_idx" ON "_school_settings_v_version_social" USING btree ("_parent_id");
  CREATE INDEX "_school_settings_v_version_legal_links_order_idx" ON "_school_settings_v_version_legal_links" USING btree ("_order");
  CREATE INDEX "_school_settings_v_version_legal_links_parent_id_idx" ON "_school_settings_v_version_legal_links" USING btree ("_parent_id");
  CREATE INDEX "_school_settings_v_version_legal_links_link_link_page_idx" ON "_school_settings_v_version_legal_links" USING btree ("link_page_id");
  ALTER TABLE "school_settings" ADD CONSTRAINT "school_settings_header_button_link_page_id_pages_id_fk" FOREIGN KEY ("header_button_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_school_settings_v" ADD CONSTRAINT "_school_settings_v_version_header_button_link_page_id_pages_id_fk" FOREIGN KEY ("version_header_button_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "school_settings_header_button_link_header_button_link_pa_idx" ON "school_settings" USING btree ("header_button_link_page_id");
  CREATE INDEX "_school_settings_v_version_header_button_link_version_he_idx" ON "_school_settings_v" USING btree ("version_header_button_link_page_id");
  ALTER TABLE "school_settings" DROP COLUMN "header_button_url";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_header_button_url";`)

  await upgradeChrome(payload, req, { nav, button: { label: btn.label ?? null, url: btn.url ?? null } })
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "school_settings_navigation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "_school_settings_v_version_navigation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "school_settings_menu_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "school_settings_menu_columns_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "school_settings_menu_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "school_settings_menu" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "school_settings_utility_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "school_settings_footer_columns_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "school_settings_footer_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "school_settings_social" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "school_settings_legal_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_school_settings_v_version_menu_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_school_settings_v_version_menu_columns_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_school_settings_v_version_menu_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_school_settings_v_version_menu" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_school_settings_v_version_utility_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_school_settings_v_version_footer_columns_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_school_settings_v_version_footer_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_school_settings_v_version_social" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_school_settings_v_version_legal_links" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "school_settings_menu_links" CASCADE;
  DROP TABLE "school_settings_menu_columns_links" CASCADE;
  DROP TABLE "school_settings_menu_columns" CASCADE;
  DROP TABLE "school_settings_menu" CASCADE;
  DROP TABLE "school_settings_utility_links" CASCADE;
  DROP TABLE "school_settings_footer_columns_links" CASCADE;
  DROP TABLE "school_settings_footer_columns" CASCADE;
  DROP TABLE "school_settings_social" CASCADE;
  DROP TABLE "school_settings_legal_links" CASCADE;
  DROP TABLE "_school_settings_v_version_menu_links" CASCADE;
  DROP TABLE "_school_settings_v_version_menu_columns_links" CASCADE;
  DROP TABLE "_school_settings_v_version_menu_columns" CASCADE;
  DROP TABLE "_school_settings_v_version_menu" CASCADE;
  DROP TABLE "_school_settings_v_version_utility_links" CASCADE;
  DROP TABLE "_school_settings_v_version_footer_columns_links" CASCADE;
  DROP TABLE "_school_settings_v_version_footer_columns" CASCADE;
  DROP TABLE "_school_settings_v_version_social" CASCADE;
  DROP TABLE "_school_settings_v_version_legal_links" CASCADE;
  ALTER TABLE "school_settings" DROP CONSTRAINT "school_settings_header_button_link_page_id_pages_id_fk";
  
  ALTER TABLE "_school_settings_v" DROP CONSTRAINT "_school_settings_v_version_header_button_link_page_id_pages_id_fk";
  
  DROP INDEX "school_settings_header_button_link_header_button_link_pa_idx";
  DROP INDEX "_school_settings_v_version_header_button_link_version_he_idx";
  ALTER TABLE "school_settings" ADD COLUMN "header_button_url" varchar;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_header_button_url" varchar;
  ALTER TABLE "school_settings_navigation" ADD CONSTRAINT "school_settings_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."school_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_navigation" ADD CONSTRAINT "_school_settings_v_version_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_school_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "school_settings_navigation_order_idx" ON "school_settings_navigation" USING btree ("_order");
  CREATE INDEX "school_settings_navigation_parent_id_idx" ON "school_settings_navigation" USING btree ("_parent_id");
  CREATE INDEX "_school_settings_v_version_navigation_order_idx" ON "_school_settings_v_version_navigation" USING btree ("_order");
  CREATE INDEX "_school_settings_v_version_navigation_parent_id_idx" ON "_school_settings_v_version_navigation" USING btree ("_parent_id");
  ALTER TABLE "school_settings" DROP COLUMN "header_button_link_type";
  ALTER TABLE "school_settings" DROP COLUMN "header_button_link_page_id";
  ALTER TABLE "school_settings" DROP COLUMN "header_button_link_url";
  ALTER TABLE "school_settings" DROP COLUMN "header_button_link_new_tab";
  ALTER TABLE "school_settings" DROP COLUMN "footer_show_contact";
  ALTER TABLE "school_settings" DROP COLUMN "footer_note";
  ALTER TABLE "school_settings" DROP COLUMN "copyright";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_header_button_link_type";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_header_button_link_page_id";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_header_button_link_url";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_header_button_link_new_tab";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_footer_show_contact";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_footer_note";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_copyright";
  DROP TYPE "public"."enum_school_settings_menu_links_link_type";
  DROP TYPE "public"."enum_school_settings_menu_columns_links_link_type";
  DROP TYPE "public"."enum_school_settings_menu_kind";
  DROP TYPE "public"."enum_school_settings_menu_link_type";
  DROP TYPE "public"."enum_school_settings_menu_feature_link_type";
  DROP TYPE "public"."enum_school_settings_utility_links_link_type";
  DROP TYPE "public"."enum_school_settings_footer_columns_links_link_type";
  DROP TYPE "public"."enum_school_settings_social_platform";
  DROP TYPE "public"."enum_school_settings_legal_links_link_type";
  DROP TYPE "public"."enum_school_settings_header_button_link_type";
  DROP TYPE "public"."enum__school_settings_v_version_menu_links_link_type";
  DROP TYPE "public"."enum__school_settings_v_version_menu_columns_links_link_type";
  DROP TYPE "public"."enum__school_settings_v_version_menu_kind";
  DROP TYPE "public"."enum__school_settings_v_version_menu_link_type";
  DROP TYPE "public"."enum__school_settings_v_version_menu_feature_link_type";
  DROP TYPE "public"."enum__school_settings_v_version_utility_links_link_type";
  DROP TYPE "public"."enum__school_settings_v_version_footer_columns_links_link_type";
  DROP TYPE "public"."enum__school_settings_v_version_social_platform";
  DROP TYPE "public"."enum__school_settings_v_version_legal_links_link_type";
  DROP TYPE "public"."enum__school_settings_v_version_header_button_link_type";`)
}
