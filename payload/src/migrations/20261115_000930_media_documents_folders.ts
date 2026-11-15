import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // This migration first ran under an earlier name (20261114_224543_media_documents_folders)
  // when Thread D's preview deploys migrated the shared database before Thread C merged.
  // Its SQL is identical. If that earlier one ran here, the tables already exist: just
  // retire the old name so it isn't listed as an unknown migration.
  const earlier = await db.execute(
    sql`SELECT 1 FROM "payload_migrations" WHERE "name" = '20261114_224543_media_documents_folders' LIMIT 1`,
  )
  if ((earlier as any).rows?.length) {
    await db.execute(sql`DELETE FROM "payload_migrations" WHERE "name" = '20261114_224543_media_documents_folders'`)
    payload.logger.info('[b61] media_documents_folders already applied under its earlier name; skipping')
    return
  }
  await db.execute(sql`
   CREATE TYPE "public"."enum_payload_folders_folder_type" AS ENUM('media', 'documents');
  ALTER TYPE "public"."enum_pages_blocks_b61_hero_buttons_link_type" ADD VALUE 'document' BEFORE 'url';
  ALTER TYPE "public"."enum_pages_blocks_b61_split_buttons_link_type" ADD VALUE 'document' BEFORE 'url';
  ALTER TYPE "public"."enum_pages_blocks_b61_prose_buttons_link_type" ADD VALUE 'document' BEFORE 'url';
  ALTER TYPE "public"."enum_pages_blocks_b61_card_grid_cards_link_type" ADD VALUE 'document' BEFORE 'url';
  ALTER TYPE "public"."enum_pages_blocks_b61_card_grid_buttons_link_type" ADD VALUE 'document' BEFORE 'url';
  ALTER TYPE "public"."enum_pages_blocks_b61_stats_band_buttons_link_type" ADD VALUE 'document' BEFORE 'url';
  ALTER TYPE "public"."enum_pages_blocks_b61_gallery_buttons_link_type" ADD VALUE 'document' BEFORE 'url';
  ALTER TYPE "public"."enum_pages_blocks_b61_accordion_buttons_link_type" ADD VALUE 'document' BEFORE 'url';
  ALTER TYPE "public"."enum_pages_blocks_b61_cta_buttons_link_type" ADD VALUE 'document' BEFORE 'url';
  ALTER TYPE "public"."enum_pages_blocks_b61_button_bar_first_link_type" ADD VALUE 'document' BEFORE 'url';
  ALTER TYPE "public"."enum_pages_blocks_b61_button_bar_second_link_type" ADD VALUE 'document' BEFORE 'url';
  ALTER TYPE "public"."enum_pages_blocks_b61_rail_buttons_link_type" ADD VALUE 'document' BEFORE 'url';
  ALTER TYPE "public"."enum_pages_blocks_b61_rail_links_link_type" ADD VALUE 'document' BEFORE 'url';
  ALTER TYPE "public"."enum__pages_v_blocks_b61_hero_buttons_link_type" ADD VALUE 'document' BEFORE 'url';
  ALTER TYPE "public"."enum__pages_v_blocks_b61_split_buttons_link_type" ADD VALUE 'document' BEFORE 'url';
  ALTER TYPE "public"."enum__pages_v_blocks_b61_prose_buttons_link_type" ADD VALUE 'document' BEFORE 'url';
  ALTER TYPE "public"."enum__pages_v_blocks_b61_card_grid_cards_link_type" ADD VALUE 'document' BEFORE 'url';
  ALTER TYPE "public"."enum__pages_v_blocks_b61_card_grid_buttons_link_type" ADD VALUE 'document' BEFORE 'url';
  ALTER TYPE "public"."enum__pages_v_blocks_b61_stats_band_buttons_link_type" ADD VALUE 'document' BEFORE 'url';
  ALTER TYPE "public"."enum__pages_v_blocks_b61_gallery_buttons_link_type" ADD VALUE 'document' BEFORE 'url';
  ALTER TYPE "public"."enum__pages_v_blocks_b61_accordion_buttons_link_type" ADD VALUE 'document' BEFORE 'url';
  ALTER TYPE "public"."enum__pages_v_blocks_b61_cta_buttons_link_type" ADD VALUE 'document' BEFORE 'url';
  ALTER TYPE "public"."enum__pages_v_blocks_b61_button_bar_first_link_type" ADD VALUE 'document' BEFORE 'url';
  ALTER TYPE "public"."enum__pages_v_blocks_b61_button_bar_second_link_type" ADD VALUE 'document' BEFORE 'url';
  ALTER TYPE "public"."enum__pages_v_blocks_b61_rail_buttons_link_type" ADD VALUE 'document' BEFORE 'url';
  ALTER TYPE "public"."enum__pages_v_blocks_b61_rail_links_link_type" ADD VALUE 'document' BEFORE 'url';
  ALTER TYPE "public"."enum_school_settings_menu_links_link_type" ADD VALUE 'document' BEFORE 'url';
  ALTER TYPE "public"."enum_school_settings_menu_columns_links_link_type" ADD VALUE 'document' BEFORE 'url';
  ALTER TYPE "public"."enum_school_settings_menu_link_type" ADD VALUE 'document' BEFORE 'url';
  ALTER TYPE "public"."enum_school_settings_menu_feature_link_type" ADD VALUE 'document' BEFORE 'url';
  ALTER TYPE "public"."enum_school_settings_utility_links_link_type" ADD VALUE 'document' BEFORE 'url';
  ALTER TYPE "public"."enum_school_settings_footer_columns_links_link_type" ADD VALUE 'document' BEFORE 'url';
  ALTER TYPE "public"."enum_school_settings_legal_links_link_type" ADD VALUE 'document' BEFORE 'url';
  ALTER TYPE "public"."enum_school_settings_header_button_link_type" ADD VALUE 'document' BEFORE 'url';
  ALTER TYPE "public"."enum__school_settings_v_version_menu_links_link_type" ADD VALUE 'document' BEFORE 'url';
  ALTER TYPE "public"."enum__school_settings_v_version_menu_columns_links_link_type" ADD VALUE 'document' BEFORE 'url';
  ALTER TYPE "public"."enum__school_settings_v_version_menu_link_type" ADD VALUE 'document' BEFORE 'url';
  ALTER TYPE "public"."enum__school_settings_v_version_menu_feature_link_type" ADD VALUE 'document' BEFORE 'url';
  ALTER TYPE "public"."enum__school_settings_v_version_utility_links_link_type" ADD VALUE 'document' BEFORE 'url';
  ALTER TYPE "public"."enum__school_settings_v_version_footer_columns_links_link_type" ADD VALUE 'document' BEFORE 'url';
  ALTER TYPE "public"."enum__school_settings_v_version_legal_links_link_type" ADD VALUE 'document' BEFORE 'url';
  ALTER TYPE "public"."enum__school_settings_v_version_header_button_link_type" ADD VALUE 'document' BEFORE 'url';
  CREATE TABLE "documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"school_id" integer,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"prefix" varchar DEFAULT 'documents',
  	"_objectkey" varchar,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "payload_folders_folder_type" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_payload_folders_folder_type",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "payload_folders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"school_id" integer,
  	"name" varchar NOT NULL,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "pages_blocks_b61_hero_buttons" ADD COLUMN "link_document_id" integer;
  ALTER TABLE "pages_blocks_b61_split_buttons" ADD COLUMN "link_document_id" integer;
  ALTER TABLE "pages_blocks_b61_prose_buttons" ADD COLUMN "link_document_id" integer;
  ALTER TABLE "pages_blocks_b61_card_grid_cards" ADD COLUMN "link_document_id" integer;
  ALTER TABLE "pages_blocks_b61_card_grid_buttons" ADD COLUMN "link_document_id" integer;
  ALTER TABLE "pages_blocks_b61_stats_band_buttons" ADD COLUMN "link_document_id" integer;
  ALTER TABLE "pages_blocks_b61_gallery_buttons" ADD COLUMN "link_document_id" integer;
  ALTER TABLE "pages_blocks_b61_accordion_buttons" ADD COLUMN "link_document_id" integer;
  ALTER TABLE "pages_blocks_b61_cta_buttons" ADD COLUMN "link_document_id" integer;
  ALTER TABLE "pages_blocks_b61_button_bar" ADD COLUMN "first_link_document_id" integer;
  ALTER TABLE "pages_blocks_b61_button_bar" ADD COLUMN "second_link_document_id" integer;
  ALTER TABLE "pages_blocks_b61_rail_buttons" ADD COLUMN "link_document_id" integer;
  ALTER TABLE "pages_blocks_b61_rail_links" ADD COLUMN "link_document_id" integer;
  ALTER TABLE "_pages_v_blocks_b61_hero_buttons" ADD COLUMN "link_document_id" integer;
  ALTER TABLE "_pages_v_blocks_b61_split_buttons" ADD COLUMN "link_document_id" integer;
  ALTER TABLE "_pages_v_blocks_b61_prose_buttons" ADD COLUMN "link_document_id" integer;
  ALTER TABLE "_pages_v_blocks_b61_card_grid_cards" ADD COLUMN "link_document_id" integer;
  ALTER TABLE "_pages_v_blocks_b61_card_grid_buttons" ADD COLUMN "link_document_id" integer;
  ALTER TABLE "_pages_v_blocks_b61_stats_band_buttons" ADD COLUMN "link_document_id" integer;
  ALTER TABLE "_pages_v_blocks_b61_gallery_buttons" ADD COLUMN "link_document_id" integer;
  ALTER TABLE "_pages_v_blocks_b61_accordion_buttons" ADD COLUMN "link_document_id" integer;
  ALTER TABLE "_pages_v_blocks_b61_cta_buttons" ADD COLUMN "link_document_id" integer;
  ALTER TABLE "_pages_v_blocks_b61_button_bar" ADD COLUMN "first_link_document_id" integer;
  ALTER TABLE "_pages_v_blocks_b61_button_bar" ADD COLUMN "second_link_document_id" integer;
  ALTER TABLE "_pages_v_blocks_b61_rail_buttons" ADD COLUMN "link_document_id" integer;
  ALTER TABLE "_pages_v_blocks_b61_rail_links" ADD COLUMN "link_document_id" integer;
  ALTER TABLE "media" ADD COLUMN "caption" varchar;
  ALTER TABLE "media" ADD COLUMN "credit" varchar;
  ALTER TABLE "media" ADD COLUMN "folder_id" integer;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_wide_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_wide_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_wide_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_wide_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_wide_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_wide_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_social_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_social_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_social_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_social_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_social_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_social_filename" varchar;
  ALTER TABLE "school_settings_menu_links" ADD COLUMN "link_document_id" integer;
  ALTER TABLE "school_settings_menu_columns_links" ADD COLUMN "link_document_id" integer;
  ALTER TABLE "school_settings_menu" ADD COLUMN "link_document_id" integer;
  ALTER TABLE "school_settings_menu" ADD COLUMN "feature_link_document_id" integer;
  ALTER TABLE "school_settings_utility_links" ADD COLUMN "link_document_id" integer;
  ALTER TABLE "school_settings_footer_columns_links" ADD COLUMN "link_document_id" integer;
  ALTER TABLE "school_settings_legal_links" ADD COLUMN "link_document_id" integer;
  ALTER TABLE "school_settings" ADD COLUMN "header_button_link_document_id" integer;
  ALTER TABLE "_school_settings_v_version_menu_links" ADD COLUMN "link_document_id" integer;
  ALTER TABLE "_school_settings_v_version_menu_columns_links" ADD COLUMN "link_document_id" integer;
  ALTER TABLE "_school_settings_v_version_menu" ADD COLUMN "link_document_id" integer;
  ALTER TABLE "_school_settings_v_version_menu" ADD COLUMN "feature_link_document_id" integer;
  ALTER TABLE "_school_settings_v_version_utility_links" ADD COLUMN "link_document_id" integer;
  ALTER TABLE "_school_settings_v_version_footer_columns_links" ADD COLUMN "link_document_id" integer;
  ALTER TABLE "_school_settings_v_version_legal_links" ADD COLUMN "link_document_id" integer;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_header_button_link_document_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "documents_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_folders_id" integer;
  ALTER TABLE "documents" ADD CONSTRAINT "documents_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "documents" ADD CONSTRAINT "documents_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_folders_folder_type" ADD CONSTRAINT "payload_folders_folder_type_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders" ADD CONSTRAINT "payload_folders_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_folders" ADD CONSTRAINT "payload_folders_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "documents_school_idx" ON "documents" USING btree ("school_id");
  CREATE INDEX "documents_folder_idx" ON "documents" USING btree ("folder_id");
  CREATE INDEX "documents_updated_at_idx" ON "documents" USING btree ("updated_at");
  CREATE INDEX "documents_created_at_idx" ON "documents" USING btree ("created_at");
  CREATE UNIQUE INDEX "documents_filename_idx" ON "documents" USING btree ("filename");
  CREATE INDEX "payload_folders_folder_type_order_idx" ON "payload_folders_folder_type" USING btree ("order");
  CREATE INDEX "payload_folders_folder_type_parent_idx" ON "payload_folders_folder_type" USING btree ("parent_id");
  CREATE INDEX "payload_folders_school_idx" ON "payload_folders" USING btree ("school_id");
  CREATE INDEX "payload_folders_name_idx" ON "payload_folders" USING btree ("name");
  CREATE INDEX "payload_folders_folder_idx" ON "payload_folders" USING btree ("folder_id");
  CREATE INDEX "payload_folders_updated_at_idx" ON "payload_folders" USING btree ("updated_at");
  CREATE INDEX "payload_folders_created_at_idx" ON "payload_folders" USING btree ("created_at");
  ALTER TABLE "pages_blocks_b61_hero_buttons" ADD CONSTRAINT "pages_blocks_b61_hero_buttons_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_split_buttons" ADD CONSTRAINT "pages_blocks_b61_split_buttons_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_prose_buttons" ADD CONSTRAINT "pages_blocks_b61_prose_buttons_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_card_grid_cards" ADD CONSTRAINT "pages_blocks_b61_card_grid_cards_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_card_grid_buttons" ADD CONSTRAINT "pages_blocks_b61_card_grid_buttons_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_stats_band_buttons" ADD CONSTRAINT "pages_blocks_b61_stats_band_buttons_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_gallery_buttons" ADD CONSTRAINT "pages_blocks_b61_gallery_buttons_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_accordion_buttons" ADD CONSTRAINT "pages_blocks_b61_accordion_buttons_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_cta_buttons" ADD CONSTRAINT "pages_blocks_b61_cta_buttons_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_button_bar" ADD CONSTRAINT "pages_blocks_b61_button_bar_first_link_document_id_documents_id_fk" FOREIGN KEY ("first_link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_button_bar" ADD CONSTRAINT "pages_blocks_b61_button_bar_second_link_document_id_documents_id_fk" FOREIGN KEY ("second_link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_rail_buttons" ADD CONSTRAINT "pages_blocks_b61_rail_buttons_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_rail_links" ADD CONSTRAINT "pages_blocks_b61_rail_links_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_hero_buttons" ADD CONSTRAINT "_pages_v_blocks_b61_hero_buttons_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_split_buttons" ADD CONSTRAINT "_pages_v_blocks_b61_split_buttons_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_prose_buttons" ADD CONSTRAINT "_pages_v_blocks_b61_prose_buttons_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_card_grid_cards" ADD CONSTRAINT "_pages_v_blocks_b61_card_grid_cards_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_card_grid_buttons" ADD CONSTRAINT "_pages_v_blocks_b61_card_grid_buttons_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_stats_band_buttons" ADD CONSTRAINT "_pages_v_blocks_b61_stats_band_buttons_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_gallery_buttons" ADD CONSTRAINT "_pages_v_blocks_b61_gallery_buttons_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_accordion_buttons" ADD CONSTRAINT "_pages_v_blocks_b61_accordion_buttons_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_cta_buttons" ADD CONSTRAINT "_pages_v_blocks_b61_cta_buttons_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_button_bar" ADD CONSTRAINT "_pages_v_blocks_b61_button_bar_first_link_document_id_documents_id_fk" FOREIGN KEY ("first_link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_button_bar" ADD CONSTRAINT "_pages_v_blocks_b61_button_bar_second_link_document_id_documents_id_fk" FOREIGN KEY ("second_link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_rail_buttons" ADD CONSTRAINT "_pages_v_blocks_b61_rail_buttons_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_rail_links" ADD CONSTRAINT "_pages_v_blocks_b61_rail_links_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "school_settings_menu_links" ADD CONSTRAINT "school_settings_menu_links_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "school_settings_menu_columns_links" ADD CONSTRAINT "school_settings_menu_columns_links_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "school_settings_menu" ADD CONSTRAINT "school_settings_menu_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "school_settings_menu" ADD CONSTRAINT "school_settings_menu_feature_link_document_id_documents_id_fk" FOREIGN KEY ("feature_link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "school_settings_utility_links" ADD CONSTRAINT "school_settings_utility_links_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "school_settings_footer_columns_links" ADD CONSTRAINT "school_settings_footer_columns_links_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "school_settings_legal_links" ADD CONSTRAINT "school_settings_legal_links_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "school_settings" ADD CONSTRAINT "school_settings_header_button_link_document_id_documents_id_fk" FOREIGN KEY ("header_button_link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_menu_links" ADD CONSTRAINT "_school_settings_v_version_menu_links_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_menu_columns_links" ADD CONSTRAINT "_school_settings_v_version_menu_columns_links_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_menu" ADD CONSTRAINT "_school_settings_v_version_menu_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_menu" ADD CONSTRAINT "_school_settings_v_version_menu_feature_link_document_id_documents_id_fk" FOREIGN KEY ("feature_link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_utility_links" ADD CONSTRAINT "_school_settings_v_version_utility_links_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_footer_columns_links" ADD CONSTRAINT "_school_settings_v_version_footer_columns_links_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_legal_links" ADD CONSTRAINT "_school_settings_v_version_legal_links_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_school_settings_v" ADD CONSTRAINT "_school_settings_v_version_header_button_link_document_id_documents_id_fk" FOREIGN KEY ("version_header_button_link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_documents_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_folders_fk" FOREIGN KEY ("payload_folders_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_b61_hero_buttons_link_link_document_idx" ON "pages_blocks_b61_hero_buttons" USING btree ("link_document_id");
  CREATE INDEX "pages_blocks_b61_split_buttons_link_link_document_idx" ON "pages_blocks_b61_split_buttons" USING btree ("link_document_id");
  CREATE INDEX "pages_blocks_b61_prose_buttons_link_link_document_idx" ON "pages_blocks_b61_prose_buttons" USING btree ("link_document_id");
  CREATE INDEX "pages_blocks_b61_card_grid_cards_link_link_document_idx" ON "pages_blocks_b61_card_grid_cards" USING btree ("link_document_id");
  CREATE INDEX "pages_blocks_b61_card_grid_buttons_link_link_document_idx" ON "pages_blocks_b61_card_grid_buttons" USING btree ("link_document_id");
  CREATE INDEX "pages_blocks_b61_stats_band_buttons_link_link_document_idx" ON "pages_blocks_b61_stats_band_buttons" USING btree ("link_document_id");
  CREATE INDEX "pages_blocks_b61_gallery_buttons_link_link_document_idx" ON "pages_blocks_b61_gallery_buttons" USING btree ("link_document_id");
  CREATE INDEX "pages_blocks_b61_accordion_buttons_link_link_document_idx" ON "pages_blocks_b61_accordion_buttons" USING btree ("link_document_id");
  CREATE INDEX "pages_blocks_b61_cta_buttons_link_link_document_idx" ON "pages_blocks_b61_cta_buttons" USING btree ("link_document_id");
  CREATE INDEX "pages_blocks_b61_button_bar_first_link_first_link_docume_idx" ON "pages_blocks_b61_button_bar" USING btree ("first_link_document_id");
  CREATE INDEX "pages_blocks_b61_button_bar_second_link_second_link_docu_idx" ON "pages_blocks_b61_button_bar" USING btree ("second_link_document_id");
  CREATE INDEX "pages_blocks_b61_rail_buttons_link_link_document_idx" ON "pages_blocks_b61_rail_buttons" USING btree ("link_document_id");
  CREATE INDEX "pages_blocks_b61_rail_links_link_link_document_idx" ON "pages_blocks_b61_rail_links" USING btree ("link_document_id");
  CREATE INDEX "_pages_v_blocks_b61_hero_buttons_link_link_document_idx" ON "_pages_v_blocks_b61_hero_buttons" USING btree ("link_document_id");
  CREATE INDEX "_pages_v_blocks_b61_split_buttons_link_link_document_idx" ON "_pages_v_blocks_b61_split_buttons" USING btree ("link_document_id");
  CREATE INDEX "_pages_v_blocks_b61_prose_buttons_link_link_document_idx" ON "_pages_v_blocks_b61_prose_buttons" USING btree ("link_document_id");
  CREATE INDEX "_pages_v_blocks_b61_card_grid_cards_link_link_document_idx" ON "_pages_v_blocks_b61_card_grid_cards" USING btree ("link_document_id");
  CREATE INDEX "_pages_v_blocks_b61_card_grid_buttons_link_link_document_idx" ON "_pages_v_blocks_b61_card_grid_buttons" USING btree ("link_document_id");
  CREATE INDEX "_pages_v_blocks_b61_stats_band_buttons_link_link_documen_idx" ON "_pages_v_blocks_b61_stats_band_buttons" USING btree ("link_document_id");
  CREATE INDEX "_pages_v_blocks_b61_gallery_buttons_link_link_document_idx" ON "_pages_v_blocks_b61_gallery_buttons" USING btree ("link_document_id");
  CREATE INDEX "_pages_v_blocks_b61_accordion_buttons_link_link_document_idx" ON "_pages_v_blocks_b61_accordion_buttons" USING btree ("link_document_id");
  CREATE INDEX "_pages_v_blocks_b61_cta_buttons_link_link_document_idx" ON "_pages_v_blocks_b61_cta_buttons" USING btree ("link_document_id");
  CREATE INDEX "_pages_v_blocks_b61_button_bar_first_link_first_link_doc_idx" ON "_pages_v_blocks_b61_button_bar" USING btree ("first_link_document_id");
  CREATE INDEX "_pages_v_blocks_b61_button_bar_second_link_second_link_d_idx" ON "_pages_v_blocks_b61_button_bar" USING btree ("second_link_document_id");
  CREATE INDEX "_pages_v_blocks_b61_rail_buttons_link_link_document_idx" ON "_pages_v_blocks_b61_rail_buttons" USING btree ("link_document_id");
  CREATE INDEX "_pages_v_blocks_b61_rail_links_link_link_document_idx" ON "_pages_v_blocks_b61_rail_links" USING btree ("link_document_id");
  CREATE INDEX "media_folder_idx" ON "media" USING btree ("folder_id");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_wide_sizes_wide_filename_idx" ON "media" USING btree ("sizes_wide_filename");
  CREATE INDEX "media_sizes_social_sizes_social_filename_idx" ON "media" USING btree ("sizes_social_filename");
  CREATE INDEX "school_settings_menu_links_link_link_document_idx" ON "school_settings_menu_links" USING btree ("link_document_id");
  CREATE INDEX "school_settings_menu_columns_links_link_link_document_idx" ON "school_settings_menu_columns_links" USING btree ("link_document_id");
  CREATE INDEX "school_settings_menu_link_link_document_idx" ON "school_settings_menu" USING btree ("link_document_id");
  CREATE INDEX "school_settings_menu_feature_link_feature_link_document_idx" ON "school_settings_menu" USING btree ("feature_link_document_id");
  CREATE INDEX "school_settings_utility_links_link_link_document_idx" ON "school_settings_utility_links" USING btree ("link_document_id");
  CREATE INDEX "school_settings_footer_columns_links_link_link_document_idx" ON "school_settings_footer_columns_links" USING btree ("link_document_id");
  CREATE INDEX "school_settings_legal_links_link_link_document_idx" ON "school_settings_legal_links" USING btree ("link_document_id");
  CREATE INDEX "school_settings_header_button_link_header_button_link_do_idx" ON "school_settings" USING btree ("header_button_link_document_id");
  CREATE INDEX "_school_settings_v_version_menu_links_link_link_document_idx" ON "_school_settings_v_version_menu_links" USING btree ("link_document_id");
  CREATE INDEX "_school_settings_v_version_menu_columns_links_link_lin_1_idx" ON "_school_settings_v_version_menu_columns_links" USING btree ("link_document_id");
  CREATE INDEX "_school_settings_v_version_menu_link_link_document_idx" ON "_school_settings_v_version_menu" USING btree ("link_document_id");
  CREATE INDEX "_school_settings_v_version_menu_feature_link_feature_l_1_idx" ON "_school_settings_v_version_menu" USING btree ("feature_link_document_id");
  CREATE INDEX "_school_settings_v_version_utility_links_link_link_docum_idx" ON "_school_settings_v_version_utility_links" USING btree ("link_document_id");
  CREATE INDEX "_school_settings_v_version_footer_columns_links_link_l_1_idx" ON "_school_settings_v_version_footer_columns_links" USING btree ("link_document_id");
  CREATE INDEX "_school_settings_v_version_legal_links_link_link_documen_idx" ON "_school_settings_v_version_legal_links" USING btree ("link_document_id");
  CREATE INDEX "_school_settings_v_version_header_button_link_version__1_idx" ON "_school_settings_v" USING btree ("version_header_button_link_document_id");
  CREATE INDEX "payload_locked_documents_rels_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("documents_id");
  CREATE INDEX "payload_locked_documents_rels_payload_folders_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_folders_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "documents" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_folders_folder_type" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_folders" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "documents" CASCADE;
  DROP TABLE "payload_folders_folder_type" CASCADE;
  DROP TABLE "payload_folders" CASCADE;
  ALTER TABLE "pages_blocks_b61_hero_buttons" DROP CONSTRAINT "pages_blocks_b61_hero_buttons_link_document_id_documents_id_fk";
  
  ALTER TABLE "pages_blocks_b61_split_buttons" DROP CONSTRAINT "pages_blocks_b61_split_buttons_link_document_id_documents_id_fk";
  
  ALTER TABLE "pages_blocks_b61_prose_buttons" DROP CONSTRAINT "pages_blocks_b61_prose_buttons_link_document_id_documents_id_fk";
  
  ALTER TABLE "pages_blocks_b61_card_grid_cards" DROP CONSTRAINT "pages_blocks_b61_card_grid_cards_link_document_id_documents_id_fk";
  
  ALTER TABLE "pages_blocks_b61_card_grid_buttons" DROP CONSTRAINT "pages_blocks_b61_card_grid_buttons_link_document_id_documents_id_fk";
  
  ALTER TABLE "pages_blocks_b61_stats_band_buttons" DROP CONSTRAINT "pages_blocks_b61_stats_band_buttons_link_document_id_documents_id_fk";
  
  ALTER TABLE "pages_blocks_b61_gallery_buttons" DROP CONSTRAINT "pages_blocks_b61_gallery_buttons_link_document_id_documents_id_fk";
  
  ALTER TABLE "pages_blocks_b61_accordion_buttons" DROP CONSTRAINT "pages_blocks_b61_accordion_buttons_link_document_id_documents_id_fk";
  
  ALTER TABLE "pages_blocks_b61_cta_buttons" DROP CONSTRAINT "pages_blocks_b61_cta_buttons_link_document_id_documents_id_fk";
  
  ALTER TABLE "pages_blocks_b61_button_bar" DROP CONSTRAINT "pages_blocks_b61_button_bar_first_link_document_id_documents_id_fk";
  
  ALTER TABLE "pages_blocks_b61_button_bar" DROP CONSTRAINT "pages_blocks_b61_button_bar_second_link_document_id_documents_id_fk";
  
  ALTER TABLE "pages_blocks_b61_rail_buttons" DROP CONSTRAINT "pages_blocks_b61_rail_buttons_link_document_id_documents_id_fk";
  
  ALTER TABLE "pages_blocks_b61_rail_links" DROP CONSTRAINT "pages_blocks_b61_rail_links_link_document_id_documents_id_fk";
  
  ALTER TABLE "_pages_v_blocks_b61_hero_buttons" DROP CONSTRAINT "_pages_v_blocks_b61_hero_buttons_link_document_id_documents_id_fk";
  
  ALTER TABLE "_pages_v_blocks_b61_split_buttons" DROP CONSTRAINT "_pages_v_blocks_b61_split_buttons_link_document_id_documents_id_fk";
  
  ALTER TABLE "_pages_v_blocks_b61_prose_buttons" DROP CONSTRAINT "_pages_v_blocks_b61_prose_buttons_link_document_id_documents_id_fk";
  
  ALTER TABLE "_pages_v_blocks_b61_card_grid_cards" DROP CONSTRAINT "_pages_v_blocks_b61_card_grid_cards_link_document_id_documents_id_fk";
  
  ALTER TABLE "_pages_v_blocks_b61_card_grid_buttons" DROP CONSTRAINT "_pages_v_blocks_b61_card_grid_buttons_link_document_id_documents_id_fk";
  
  ALTER TABLE "_pages_v_blocks_b61_stats_band_buttons" DROP CONSTRAINT "_pages_v_blocks_b61_stats_band_buttons_link_document_id_documents_id_fk";
  
  ALTER TABLE "_pages_v_blocks_b61_gallery_buttons" DROP CONSTRAINT "_pages_v_blocks_b61_gallery_buttons_link_document_id_documents_id_fk";
  
  ALTER TABLE "_pages_v_blocks_b61_accordion_buttons" DROP CONSTRAINT "_pages_v_blocks_b61_accordion_buttons_link_document_id_documents_id_fk";
  
  ALTER TABLE "_pages_v_blocks_b61_cta_buttons" DROP CONSTRAINT "_pages_v_blocks_b61_cta_buttons_link_document_id_documents_id_fk";
  
  ALTER TABLE "_pages_v_blocks_b61_button_bar" DROP CONSTRAINT "_pages_v_blocks_b61_button_bar_first_link_document_id_documents_id_fk";
  
  ALTER TABLE "_pages_v_blocks_b61_button_bar" DROP CONSTRAINT "_pages_v_blocks_b61_button_bar_second_link_document_id_documents_id_fk";
  
  ALTER TABLE "_pages_v_blocks_b61_rail_buttons" DROP CONSTRAINT "_pages_v_blocks_b61_rail_buttons_link_document_id_documents_id_fk";
  
  ALTER TABLE "_pages_v_blocks_b61_rail_links" DROP CONSTRAINT "_pages_v_blocks_b61_rail_links_link_document_id_documents_id_fk";
  
  ALTER TABLE "media" DROP CONSTRAINT "media_folder_id_payload_folders_id_fk";
  
  ALTER TABLE "school_settings_menu_links" DROP CONSTRAINT "school_settings_menu_links_link_document_id_documents_id_fk";
  
  ALTER TABLE "school_settings_menu_columns_links" DROP CONSTRAINT "school_settings_menu_columns_links_link_document_id_documents_id_fk";
  
  ALTER TABLE "school_settings_menu" DROP CONSTRAINT "school_settings_menu_link_document_id_documents_id_fk";
  
  ALTER TABLE "school_settings_menu" DROP CONSTRAINT "school_settings_menu_feature_link_document_id_documents_id_fk";
  
  ALTER TABLE "school_settings_utility_links" DROP CONSTRAINT "school_settings_utility_links_link_document_id_documents_id_fk";
  
  ALTER TABLE "school_settings_footer_columns_links" DROP CONSTRAINT "school_settings_footer_columns_links_link_document_id_documents_id_fk";
  
  ALTER TABLE "school_settings_legal_links" DROP CONSTRAINT "school_settings_legal_links_link_document_id_documents_id_fk";
  
  ALTER TABLE "school_settings" DROP CONSTRAINT "school_settings_header_button_link_document_id_documents_id_fk";
  
  ALTER TABLE "_school_settings_v_version_menu_links" DROP CONSTRAINT "_school_settings_v_version_menu_links_link_document_id_documents_id_fk";
  
  ALTER TABLE "_school_settings_v_version_menu_columns_links" DROP CONSTRAINT "_school_settings_v_version_menu_columns_links_link_document_id_documents_id_fk";
  
  ALTER TABLE "_school_settings_v_version_menu" DROP CONSTRAINT "_school_settings_v_version_menu_link_document_id_documents_id_fk";
  
  ALTER TABLE "_school_settings_v_version_menu" DROP CONSTRAINT "_school_settings_v_version_menu_feature_link_document_id_documents_id_fk";
  
  ALTER TABLE "_school_settings_v_version_utility_links" DROP CONSTRAINT "_school_settings_v_version_utility_links_link_document_id_documents_id_fk";
  
  ALTER TABLE "_school_settings_v_version_footer_columns_links" DROP CONSTRAINT "_school_settings_v_version_footer_columns_links_link_document_id_documents_id_fk";
  
  ALTER TABLE "_school_settings_v_version_legal_links" DROP CONSTRAINT "_school_settings_v_version_legal_links_link_document_id_documents_id_fk";
  
  ALTER TABLE "_school_settings_v" DROP CONSTRAINT "_school_settings_v_version_header_button_link_document_id_documents_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_documents_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_payload_folders_fk";
  
  ALTER TABLE "pages_blocks_b61_hero_buttons" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_b61_hero_buttons" ALTER COLUMN "link_type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum_pages_blocks_b61_hero_buttons_link_type";
  CREATE TYPE "public"."enum_pages_blocks_b61_hero_buttons_link_type" AS ENUM('page', 'url');
  ALTER TABLE "pages_blocks_b61_hero_buttons" ALTER COLUMN "link_type" SET DEFAULT 'page'::"public"."enum_pages_blocks_b61_hero_buttons_link_type";
  ALTER TABLE "pages_blocks_b61_hero_buttons" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum_pages_blocks_b61_hero_buttons_link_type" USING "link_type"::"public"."enum_pages_blocks_b61_hero_buttons_link_type";
  ALTER TABLE "pages_blocks_b61_split_buttons" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_b61_split_buttons" ALTER COLUMN "link_type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum_pages_blocks_b61_split_buttons_link_type";
  CREATE TYPE "public"."enum_pages_blocks_b61_split_buttons_link_type" AS ENUM('page', 'url');
  ALTER TABLE "pages_blocks_b61_split_buttons" ALTER COLUMN "link_type" SET DEFAULT 'page'::"public"."enum_pages_blocks_b61_split_buttons_link_type";
  ALTER TABLE "pages_blocks_b61_split_buttons" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum_pages_blocks_b61_split_buttons_link_type" USING "link_type"::"public"."enum_pages_blocks_b61_split_buttons_link_type";
  ALTER TABLE "pages_blocks_b61_prose_buttons" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_b61_prose_buttons" ALTER COLUMN "link_type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum_pages_blocks_b61_prose_buttons_link_type";
  CREATE TYPE "public"."enum_pages_blocks_b61_prose_buttons_link_type" AS ENUM('page', 'url');
  ALTER TABLE "pages_blocks_b61_prose_buttons" ALTER COLUMN "link_type" SET DEFAULT 'page'::"public"."enum_pages_blocks_b61_prose_buttons_link_type";
  ALTER TABLE "pages_blocks_b61_prose_buttons" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum_pages_blocks_b61_prose_buttons_link_type" USING "link_type"::"public"."enum_pages_blocks_b61_prose_buttons_link_type";
  ALTER TABLE "pages_blocks_b61_card_grid_cards" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_b61_card_grid_cards" ALTER COLUMN "link_type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_cards_link_type";
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_cards_link_type" AS ENUM('page', 'url');
  ALTER TABLE "pages_blocks_b61_card_grid_cards" ALTER COLUMN "link_type" SET DEFAULT 'page'::"public"."enum_pages_blocks_b61_card_grid_cards_link_type";
  ALTER TABLE "pages_blocks_b61_card_grid_cards" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum_pages_blocks_b61_card_grid_cards_link_type" USING "link_type"::"public"."enum_pages_blocks_b61_card_grid_cards_link_type";
  ALTER TABLE "pages_blocks_b61_card_grid_buttons" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_b61_card_grid_buttons" ALTER COLUMN "link_type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_buttons_link_type";
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_buttons_link_type" AS ENUM('page', 'url');
  ALTER TABLE "pages_blocks_b61_card_grid_buttons" ALTER COLUMN "link_type" SET DEFAULT 'page'::"public"."enum_pages_blocks_b61_card_grid_buttons_link_type";
  ALTER TABLE "pages_blocks_b61_card_grid_buttons" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum_pages_blocks_b61_card_grid_buttons_link_type" USING "link_type"::"public"."enum_pages_blocks_b61_card_grid_buttons_link_type";
  ALTER TABLE "pages_blocks_b61_stats_band_buttons" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_b61_stats_band_buttons" ALTER COLUMN "link_type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum_pages_blocks_b61_stats_band_buttons_link_type";
  CREATE TYPE "public"."enum_pages_blocks_b61_stats_band_buttons_link_type" AS ENUM('page', 'url');
  ALTER TABLE "pages_blocks_b61_stats_band_buttons" ALTER COLUMN "link_type" SET DEFAULT 'page'::"public"."enum_pages_blocks_b61_stats_band_buttons_link_type";
  ALTER TABLE "pages_blocks_b61_stats_band_buttons" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum_pages_blocks_b61_stats_band_buttons_link_type" USING "link_type"::"public"."enum_pages_blocks_b61_stats_band_buttons_link_type";
  ALTER TABLE "pages_blocks_b61_gallery_buttons" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_b61_gallery_buttons" ALTER COLUMN "link_type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum_pages_blocks_b61_gallery_buttons_link_type";
  CREATE TYPE "public"."enum_pages_blocks_b61_gallery_buttons_link_type" AS ENUM('page', 'url');
  ALTER TABLE "pages_blocks_b61_gallery_buttons" ALTER COLUMN "link_type" SET DEFAULT 'page'::"public"."enum_pages_blocks_b61_gallery_buttons_link_type";
  ALTER TABLE "pages_blocks_b61_gallery_buttons" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum_pages_blocks_b61_gallery_buttons_link_type" USING "link_type"::"public"."enum_pages_blocks_b61_gallery_buttons_link_type";
  ALTER TABLE "pages_blocks_b61_accordion_buttons" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_b61_accordion_buttons" ALTER COLUMN "link_type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum_pages_blocks_b61_accordion_buttons_link_type";
  CREATE TYPE "public"."enum_pages_blocks_b61_accordion_buttons_link_type" AS ENUM('page', 'url');
  ALTER TABLE "pages_blocks_b61_accordion_buttons" ALTER COLUMN "link_type" SET DEFAULT 'page'::"public"."enum_pages_blocks_b61_accordion_buttons_link_type";
  ALTER TABLE "pages_blocks_b61_accordion_buttons" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum_pages_blocks_b61_accordion_buttons_link_type" USING "link_type"::"public"."enum_pages_blocks_b61_accordion_buttons_link_type";
  ALTER TABLE "pages_blocks_b61_cta_buttons" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_b61_cta_buttons" ALTER COLUMN "link_type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum_pages_blocks_b61_cta_buttons_link_type";
  CREATE TYPE "public"."enum_pages_blocks_b61_cta_buttons_link_type" AS ENUM('page', 'url');
  ALTER TABLE "pages_blocks_b61_cta_buttons" ALTER COLUMN "link_type" SET DEFAULT 'page'::"public"."enum_pages_blocks_b61_cta_buttons_link_type";
  ALTER TABLE "pages_blocks_b61_cta_buttons" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum_pages_blocks_b61_cta_buttons_link_type" USING "link_type"::"public"."enum_pages_blocks_b61_cta_buttons_link_type";
  ALTER TABLE "pages_blocks_b61_button_bar" ALTER COLUMN "first_link_type" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_b61_button_bar" ALTER COLUMN "first_link_type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum_pages_blocks_b61_button_bar_first_link_type";
  CREATE TYPE "public"."enum_pages_blocks_b61_button_bar_first_link_type" AS ENUM('page', 'url');
  ALTER TABLE "pages_blocks_b61_button_bar" ALTER COLUMN "first_link_type" SET DEFAULT 'page'::"public"."enum_pages_blocks_b61_button_bar_first_link_type";
  ALTER TABLE "pages_blocks_b61_button_bar" ALTER COLUMN "first_link_type" SET DATA TYPE "public"."enum_pages_blocks_b61_button_bar_first_link_type" USING "first_link_type"::"public"."enum_pages_blocks_b61_button_bar_first_link_type";
  ALTER TABLE "pages_blocks_b61_button_bar" ALTER COLUMN "second_link_type" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_b61_button_bar" ALTER COLUMN "second_link_type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum_pages_blocks_b61_button_bar_second_link_type";
  CREATE TYPE "public"."enum_pages_blocks_b61_button_bar_second_link_type" AS ENUM('page', 'url');
  ALTER TABLE "pages_blocks_b61_button_bar" ALTER COLUMN "second_link_type" SET DEFAULT 'page'::"public"."enum_pages_blocks_b61_button_bar_second_link_type";
  ALTER TABLE "pages_blocks_b61_button_bar" ALTER COLUMN "second_link_type" SET DATA TYPE "public"."enum_pages_blocks_b61_button_bar_second_link_type" USING "second_link_type"::"public"."enum_pages_blocks_b61_button_bar_second_link_type";
  ALTER TABLE "pages_blocks_b61_rail_buttons" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_b61_rail_buttons" ALTER COLUMN "link_type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum_pages_blocks_b61_rail_buttons_link_type";
  CREATE TYPE "public"."enum_pages_blocks_b61_rail_buttons_link_type" AS ENUM('page', 'url');
  ALTER TABLE "pages_blocks_b61_rail_buttons" ALTER COLUMN "link_type" SET DEFAULT 'page'::"public"."enum_pages_blocks_b61_rail_buttons_link_type";
  ALTER TABLE "pages_blocks_b61_rail_buttons" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum_pages_blocks_b61_rail_buttons_link_type" USING "link_type"::"public"."enum_pages_blocks_b61_rail_buttons_link_type";
  ALTER TABLE "pages_blocks_b61_rail_links" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_b61_rail_links" ALTER COLUMN "link_type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum_pages_blocks_b61_rail_links_link_type";
  CREATE TYPE "public"."enum_pages_blocks_b61_rail_links_link_type" AS ENUM('page', 'url');
  ALTER TABLE "pages_blocks_b61_rail_links" ALTER COLUMN "link_type" SET DEFAULT 'page'::"public"."enum_pages_blocks_b61_rail_links_link_type";
  ALTER TABLE "pages_blocks_b61_rail_links" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum_pages_blocks_b61_rail_links_link_type" USING "link_type"::"public"."enum_pages_blocks_b61_rail_links_link_type";
  ALTER TABLE "_pages_v_blocks_b61_hero_buttons" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_b61_hero_buttons" ALTER COLUMN "link_type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum__pages_v_blocks_b61_hero_buttons_link_type";
  CREATE TYPE "public"."enum__pages_v_blocks_b61_hero_buttons_link_type" AS ENUM('page', 'url');
  ALTER TABLE "_pages_v_blocks_b61_hero_buttons" ALTER COLUMN "link_type" SET DEFAULT 'page'::"public"."enum__pages_v_blocks_b61_hero_buttons_link_type";
  ALTER TABLE "_pages_v_blocks_b61_hero_buttons" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum__pages_v_blocks_b61_hero_buttons_link_type" USING "link_type"::"public"."enum__pages_v_blocks_b61_hero_buttons_link_type";
  ALTER TABLE "_pages_v_blocks_b61_split_buttons" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_b61_split_buttons" ALTER COLUMN "link_type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_buttons_link_type";
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_buttons_link_type" AS ENUM('page', 'url');
  ALTER TABLE "_pages_v_blocks_b61_split_buttons" ALTER COLUMN "link_type" SET DEFAULT 'page'::"public"."enum__pages_v_blocks_b61_split_buttons_link_type";
  ALTER TABLE "_pages_v_blocks_b61_split_buttons" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum__pages_v_blocks_b61_split_buttons_link_type" USING "link_type"::"public"."enum__pages_v_blocks_b61_split_buttons_link_type";
  ALTER TABLE "_pages_v_blocks_b61_prose_buttons" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_b61_prose_buttons" ALTER COLUMN "link_type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum__pages_v_blocks_b61_prose_buttons_link_type";
  CREATE TYPE "public"."enum__pages_v_blocks_b61_prose_buttons_link_type" AS ENUM('page', 'url');
  ALTER TABLE "_pages_v_blocks_b61_prose_buttons" ALTER COLUMN "link_type" SET DEFAULT 'page'::"public"."enum__pages_v_blocks_b61_prose_buttons_link_type";
  ALTER TABLE "_pages_v_blocks_b61_prose_buttons" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum__pages_v_blocks_b61_prose_buttons_link_type" USING "link_type"::"public"."enum__pages_v_blocks_b61_prose_buttons_link_type";
  ALTER TABLE "_pages_v_blocks_b61_card_grid_cards" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_b61_card_grid_cards" ALTER COLUMN "link_type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_cards_link_type";
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_cards_link_type" AS ENUM('page', 'url');
  ALTER TABLE "_pages_v_blocks_b61_card_grid_cards" ALTER COLUMN "link_type" SET DEFAULT 'page'::"public"."enum__pages_v_blocks_b61_card_grid_cards_link_type";
  ALTER TABLE "_pages_v_blocks_b61_card_grid_cards" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum__pages_v_blocks_b61_card_grid_cards_link_type" USING "link_type"::"public"."enum__pages_v_blocks_b61_card_grid_cards_link_type";
  ALTER TABLE "_pages_v_blocks_b61_card_grid_buttons" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_b61_card_grid_buttons" ALTER COLUMN "link_type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_buttons_link_type";
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_buttons_link_type" AS ENUM('page', 'url');
  ALTER TABLE "_pages_v_blocks_b61_card_grid_buttons" ALTER COLUMN "link_type" SET DEFAULT 'page'::"public"."enum__pages_v_blocks_b61_card_grid_buttons_link_type";
  ALTER TABLE "_pages_v_blocks_b61_card_grid_buttons" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum__pages_v_blocks_b61_card_grid_buttons_link_type" USING "link_type"::"public"."enum__pages_v_blocks_b61_card_grid_buttons_link_type";
  ALTER TABLE "_pages_v_blocks_b61_stats_band_buttons" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_b61_stats_band_buttons" ALTER COLUMN "link_type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum__pages_v_blocks_b61_stats_band_buttons_link_type";
  CREATE TYPE "public"."enum__pages_v_blocks_b61_stats_band_buttons_link_type" AS ENUM('page', 'url');
  ALTER TABLE "_pages_v_blocks_b61_stats_band_buttons" ALTER COLUMN "link_type" SET DEFAULT 'page'::"public"."enum__pages_v_blocks_b61_stats_band_buttons_link_type";
  ALTER TABLE "_pages_v_blocks_b61_stats_band_buttons" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum__pages_v_blocks_b61_stats_band_buttons_link_type" USING "link_type"::"public"."enum__pages_v_blocks_b61_stats_band_buttons_link_type";
  ALTER TABLE "_pages_v_blocks_b61_gallery_buttons" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_b61_gallery_buttons" ALTER COLUMN "link_type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum__pages_v_blocks_b61_gallery_buttons_link_type";
  CREATE TYPE "public"."enum__pages_v_blocks_b61_gallery_buttons_link_type" AS ENUM('page', 'url');
  ALTER TABLE "_pages_v_blocks_b61_gallery_buttons" ALTER COLUMN "link_type" SET DEFAULT 'page'::"public"."enum__pages_v_blocks_b61_gallery_buttons_link_type";
  ALTER TABLE "_pages_v_blocks_b61_gallery_buttons" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum__pages_v_blocks_b61_gallery_buttons_link_type" USING "link_type"::"public"."enum__pages_v_blocks_b61_gallery_buttons_link_type";
  ALTER TABLE "_pages_v_blocks_b61_accordion_buttons" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_b61_accordion_buttons" ALTER COLUMN "link_type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum__pages_v_blocks_b61_accordion_buttons_link_type";
  CREATE TYPE "public"."enum__pages_v_blocks_b61_accordion_buttons_link_type" AS ENUM('page', 'url');
  ALTER TABLE "_pages_v_blocks_b61_accordion_buttons" ALTER COLUMN "link_type" SET DEFAULT 'page'::"public"."enum__pages_v_blocks_b61_accordion_buttons_link_type";
  ALTER TABLE "_pages_v_blocks_b61_accordion_buttons" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum__pages_v_blocks_b61_accordion_buttons_link_type" USING "link_type"::"public"."enum__pages_v_blocks_b61_accordion_buttons_link_type";
  ALTER TABLE "_pages_v_blocks_b61_cta_buttons" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_b61_cta_buttons" ALTER COLUMN "link_type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum__pages_v_blocks_b61_cta_buttons_link_type";
  CREATE TYPE "public"."enum__pages_v_blocks_b61_cta_buttons_link_type" AS ENUM('page', 'url');
  ALTER TABLE "_pages_v_blocks_b61_cta_buttons" ALTER COLUMN "link_type" SET DEFAULT 'page'::"public"."enum__pages_v_blocks_b61_cta_buttons_link_type";
  ALTER TABLE "_pages_v_blocks_b61_cta_buttons" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum__pages_v_blocks_b61_cta_buttons_link_type" USING "link_type"::"public"."enum__pages_v_blocks_b61_cta_buttons_link_type";
  ALTER TABLE "_pages_v_blocks_b61_button_bar" ALTER COLUMN "first_link_type" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_b61_button_bar" ALTER COLUMN "first_link_type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum__pages_v_blocks_b61_button_bar_first_link_type";
  CREATE TYPE "public"."enum__pages_v_blocks_b61_button_bar_first_link_type" AS ENUM('page', 'url');
  ALTER TABLE "_pages_v_blocks_b61_button_bar" ALTER COLUMN "first_link_type" SET DEFAULT 'page'::"public"."enum__pages_v_blocks_b61_button_bar_first_link_type";
  ALTER TABLE "_pages_v_blocks_b61_button_bar" ALTER COLUMN "first_link_type" SET DATA TYPE "public"."enum__pages_v_blocks_b61_button_bar_first_link_type" USING "first_link_type"::"public"."enum__pages_v_blocks_b61_button_bar_first_link_type";
  ALTER TABLE "_pages_v_blocks_b61_button_bar" ALTER COLUMN "second_link_type" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_b61_button_bar" ALTER COLUMN "second_link_type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum__pages_v_blocks_b61_button_bar_second_link_type";
  CREATE TYPE "public"."enum__pages_v_blocks_b61_button_bar_second_link_type" AS ENUM('page', 'url');
  ALTER TABLE "_pages_v_blocks_b61_button_bar" ALTER COLUMN "second_link_type" SET DEFAULT 'page'::"public"."enum__pages_v_blocks_b61_button_bar_second_link_type";
  ALTER TABLE "_pages_v_blocks_b61_button_bar" ALTER COLUMN "second_link_type" SET DATA TYPE "public"."enum__pages_v_blocks_b61_button_bar_second_link_type" USING "second_link_type"::"public"."enum__pages_v_blocks_b61_button_bar_second_link_type";
  ALTER TABLE "_pages_v_blocks_b61_rail_buttons" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_b61_rail_buttons" ALTER COLUMN "link_type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum__pages_v_blocks_b61_rail_buttons_link_type";
  CREATE TYPE "public"."enum__pages_v_blocks_b61_rail_buttons_link_type" AS ENUM('page', 'url');
  ALTER TABLE "_pages_v_blocks_b61_rail_buttons" ALTER COLUMN "link_type" SET DEFAULT 'page'::"public"."enum__pages_v_blocks_b61_rail_buttons_link_type";
  ALTER TABLE "_pages_v_blocks_b61_rail_buttons" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum__pages_v_blocks_b61_rail_buttons_link_type" USING "link_type"::"public"."enum__pages_v_blocks_b61_rail_buttons_link_type";
  ALTER TABLE "_pages_v_blocks_b61_rail_links" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_b61_rail_links" ALTER COLUMN "link_type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum__pages_v_blocks_b61_rail_links_link_type";
  CREATE TYPE "public"."enum__pages_v_blocks_b61_rail_links_link_type" AS ENUM('page', 'url');
  ALTER TABLE "_pages_v_blocks_b61_rail_links" ALTER COLUMN "link_type" SET DEFAULT 'page'::"public"."enum__pages_v_blocks_b61_rail_links_link_type";
  ALTER TABLE "_pages_v_blocks_b61_rail_links" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum__pages_v_blocks_b61_rail_links_link_type" USING "link_type"::"public"."enum__pages_v_blocks_b61_rail_links_link_type";
  ALTER TABLE "school_settings_menu_links" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "school_settings_menu_links" ALTER COLUMN "link_type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum_school_settings_menu_links_link_type";
  CREATE TYPE "public"."enum_school_settings_menu_links_link_type" AS ENUM('page', 'url');
  ALTER TABLE "school_settings_menu_links" ALTER COLUMN "link_type" SET DEFAULT 'page'::"public"."enum_school_settings_menu_links_link_type";
  ALTER TABLE "school_settings_menu_links" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum_school_settings_menu_links_link_type" USING "link_type"::"public"."enum_school_settings_menu_links_link_type";
  ALTER TABLE "school_settings_menu_columns_links" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "school_settings_menu_columns_links" ALTER COLUMN "link_type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum_school_settings_menu_columns_links_link_type";
  CREATE TYPE "public"."enum_school_settings_menu_columns_links_link_type" AS ENUM('page', 'url');
  ALTER TABLE "school_settings_menu_columns_links" ALTER COLUMN "link_type" SET DEFAULT 'page'::"public"."enum_school_settings_menu_columns_links_link_type";
  ALTER TABLE "school_settings_menu_columns_links" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum_school_settings_menu_columns_links_link_type" USING "link_type"::"public"."enum_school_settings_menu_columns_links_link_type";
  ALTER TABLE "school_settings_menu" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "school_settings_menu" ALTER COLUMN "link_type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum_school_settings_menu_link_type";
  CREATE TYPE "public"."enum_school_settings_menu_link_type" AS ENUM('page', 'url');
  ALTER TABLE "school_settings_menu" ALTER COLUMN "link_type" SET DEFAULT 'page'::"public"."enum_school_settings_menu_link_type";
  ALTER TABLE "school_settings_menu" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum_school_settings_menu_link_type" USING "link_type"::"public"."enum_school_settings_menu_link_type";
  ALTER TABLE "school_settings_menu" ALTER COLUMN "feature_link_type" SET DATA TYPE text;
  ALTER TABLE "school_settings_menu" ALTER COLUMN "feature_link_type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum_school_settings_menu_feature_link_type";
  CREATE TYPE "public"."enum_school_settings_menu_feature_link_type" AS ENUM('page', 'url');
  ALTER TABLE "school_settings_menu" ALTER COLUMN "feature_link_type" SET DEFAULT 'page'::"public"."enum_school_settings_menu_feature_link_type";
  ALTER TABLE "school_settings_menu" ALTER COLUMN "feature_link_type" SET DATA TYPE "public"."enum_school_settings_menu_feature_link_type" USING "feature_link_type"::"public"."enum_school_settings_menu_feature_link_type";
  ALTER TABLE "school_settings_utility_links" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "school_settings_utility_links" ALTER COLUMN "link_type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum_school_settings_utility_links_link_type";
  CREATE TYPE "public"."enum_school_settings_utility_links_link_type" AS ENUM('page', 'url');
  ALTER TABLE "school_settings_utility_links" ALTER COLUMN "link_type" SET DEFAULT 'page'::"public"."enum_school_settings_utility_links_link_type";
  ALTER TABLE "school_settings_utility_links" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum_school_settings_utility_links_link_type" USING "link_type"::"public"."enum_school_settings_utility_links_link_type";
  ALTER TABLE "school_settings_footer_columns_links" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "school_settings_footer_columns_links" ALTER COLUMN "link_type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum_school_settings_footer_columns_links_link_type";
  CREATE TYPE "public"."enum_school_settings_footer_columns_links_link_type" AS ENUM('page', 'url');
  ALTER TABLE "school_settings_footer_columns_links" ALTER COLUMN "link_type" SET DEFAULT 'page'::"public"."enum_school_settings_footer_columns_links_link_type";
  ALTER TABLE "school_settings_footer_columns_links" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum_school_settings_footer_columns_links_link_type" USING "link_type"::"public"."enum_school_settings_footer_columns_links_link_type";
  ALTER TABLE "school_settings_legal_links" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "school_settings_legal_links" ALTER COLUMN "link_type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum_school_settings_legal_links_link_type";
  CREATE TYPE "public"."enum_school_settings_legal_links_link_type" AS ENUM('page', 'url');
  ALTER TABLE "school_settings_legal_links" ALTER COLUMN "link_type" SET DEFAULT 'page'::"public"."enum_school_settings_legal_links_link_type";
  ALTER TABLE "school_settings_legal_links" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum_school_settings_legal_links_link_type" USING "link_type"::"public"."enum_school_settings_legal_links_link_type";
  ALTER TABLE "school_settings" ALTER COLUMN "header_button_link_type" SET DATA TYPE text;
  ALTER TABLE "school_settings" ALTER COLUMN "header_button_link_type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum_school_settings_header_button_link_type";
  CREATE TYPE "public"."enum_school_settings_header_button_link_type" AS ENUM('page', 'url');
  ALTER TABLE "school_settings" ALTER COLUMN "header_button_link_type" SET DEFAULT 'page'::"public"."enum_school_settings_header_button_link_type";
  ALTER TABLE "school_settings" ALTER COLUMN "header_button_link_type" SET DATA TYPE "public"."enum_school_settings_header_button_link_type" USING "header_button_link_type"::"public"."enum_school_settings_header_button_link_type";
  ALTER TABLE "_school_settings_v_version_menu_links" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "_school_settings_v_version_menu_links" ALTER COLUMN "link_type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum__school_settings_v_version_menu_links_link_type";
  CREATE TYPE "public"."enum__school_settings_v_version_menu_links_link_type" AS ENUM('page', 'url');
  ALTER TABLE "_school_settings_v_version_menu_links" ALTER COLUMN "link_type" SET DEFAULT 'page'::"public"."enum__school_settings_v_version_menu_links_link_type";
  ALTER TABLE "_school_settings_v_version_menu_links" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum__school_settings_v_version_menu_links_link_type" USING "link_type"::"public"."enum__school_settings_v_version_menu_links_link_type";
  ALTER TABLE "_school_settings_v_version_menu_columns_links" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "_school_settings_v_version_menu_columns_links" ALTER COLUMN "link_type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum__school_settings_v_version_menu_columns_links_link_type";
  CREATE TYPE "public"."enum__school_settings_v_version_menu_columns_links_link_type" AS ENUM('page', 'url');
  ALTER TABLE "_school_settings_v_version_menu_columns_links" ALTER COLUMN "link_type" SET DEFAULT 'page'::"public"."enum__school_settings_v_version_menu_columns_links_link_type";
  ALTER TABLE "_school_settings_v_version_menu_columns_links" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum__school_settings_v_version_menu_columns_links_link_type" USING "link_type"::"public"."enum__school_settings_v_version_menu_columns_links_link_type";
  ALTER TABLE "_school_settings_v_version_menu" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "_school_settings_v_version_menu" ALTER COLUMN "link_type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum__school_settings_v_version_menu_link_type";
  CREATE TYPE "public"."enum__school_settings_v_version_menu_link_type" AS ENUM('page', 'url');
  ALTER TABLE "_school_settings_v_version_menu" ALTER COLUMN "link_type" SET DEFAULT 'page'::"public"."enum__school_settings_v_version_menu_link_type";
  ALTER TABLE "_school_settings_v_version_menu" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum__school_settings_v_version_menu_link_type" USING "link_type"::"public"."enum__school_settings_v_version_menu_link_type";
  ALTER TABLE "_school_settings_v_version_menu" ALTER COLUMN "feature_link_type" SET DATA TYPE text;
  ALTER TABLE "_school_settings_v_version_menu" ALTER COLUMN "feature_link_type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum__school_settings_v_version_menu_feature_link_type";
  CREATE TYPE "public"."enum__school_settings_v_version_menu_feature_link_type" AS ENUM('page', 'url');
  ALTER TABLE "_school_settings_v_version_menu" ALTER COLUMN "feature_link_type" SET DEFAULT 'page'::"public"."enum__school_settings_v_version_menu_feature_link_type";
  ALTER TABLE "_school_settings_v_version_menu" ALTER COLUMN "feature_link_type" SET DATA TYPE "public"."enum__school_settings_v_version_menu_feature_link_type" USING "feature_link_type"::"public"."enum__school_settings_v_version_menu_feature_link_type";
  ALTER TABLE "_school_settings_v_version_utility_links" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "_school_settings_v_version_utility_links" ALTER COLUMN "link_type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum__school_settings_v_version_utility_links_link_type";
  CREATE TYPE "public"."enum__school_settings_v_version_utility_links_link_type" AS ENUM('page', 'url');
  ALTER TABLE "_school_settings_v_version_utility_links" ALTER COLUMN "link_type" SET DEFAULT 'page'::"public"."enum__school_settings_v_version_utility_links_link_type";
  ALTER TABLE "_school_settings_v_version_utility_links" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum__school_settings_v_version_utility_links_link_type" USING "link_type"::"public"."enum__school_settings_v_version_utility_links_link_type";
  ALTER TABLE "_school_settings_v_version_footer_columns_links" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "_school_settings_v_version_footer_columns_links" ALTER COLUMN "link_type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum__school_settings_v_version_footer_columns_links_link_type";
  CREATE TYPE "public"."enum__school_settings_v_version_footer_columns_links_link_type" AS ENUM('page', 'url');
  ALTER TABLE "_school_settings_v_version_footer_columns_links" ALTER COLUMN "link_type" SET DEFAULT 'page'::"public"."enum__school_settings_v_version_footer_columns_links_link_type";
  ALTER TABLE "_school_settings_v_version_footer_columns_links" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum__school_settings_v_version_footer_columns_links_link_type" USING "link_type"::"public"."enum__school_settings_v_version_footer_columns_links_link_type";
  ALTER TABLE "_school_settings_v_version_legal_links" ALTER COLUMN "link_type" SET DATA TYPE text;
  ALTER TABLE "_school_settings_v_version_legal_links" ALTER COLUMN "link_type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum__school_settings_v_version_legal_links_link_type";
  CREATE TYPE "public"."enum__school_settings_v_version_legal_links_link_type" AS ENUM('page', 'url');
  ALTER TABLE "_school_settings_v_version_legal_links" ALTER COLUMN "link_type" SET DEFAULT 'page'::"public"."enum__school_settings_v_version_legal_links_link_type";
  ALTER TABLE "_school_settings_v_version_legal_links" ALTER COLUMN "link_type" SET DATA TYPE "public"."enum__school_settings_v_version_legal_links_link_type" USING "link_type"::"public"."enum__school_settings_v_version_legal_links_link_type";
  ALTER TABLE "_school_settings_v" ALTER COLUMN "version_header_button_link_type" SET DATA TYPE text;
  ALTER TABLE "_school_settings_v" ALTER COLUMN "version_header_button_link_type" SET DEFAULT 'page'::text;
  DROP TYPE "public"."enum__school_settings_v_version_header_button_link_type";
  CREATE TYPE "public"."enum__school_settings_v_version_header_button_link_type" AS ENUM('page', 'url');
  ALTER TABLE "_school_settings_v" ALTER COLUMN "version_header_button_link_type" SET DEFAULT 'page'::"public"."enum__school_settings_v_version_header_button_link_type";
  ALTER TABLE "_school_settings_v" ALTER COLUMN "version_header_button_link_type" SET DATA TYPE "public"."enum__school_settings_v_version_header_button_link_type" USING "version_header_button_link_type"::"public"."enum__school_settings_v_version_header_button_link_type";
  DROP INDEX "pages_blocks_b61_hero_buttons_link_link_document_idx";
  DROP INDEX "pages_blocks_b61_split_buttons_link_link_document_idx";
  DROP INDEX "pages_blocks_b61_prose_buttons_link_link_document_idx";
  DROP INDEX "pages_blocks_b61_card_grid_cards_link_link_document_idx";
  DROP INDEX "pages_blocks_b61_card_grid_buttons_link_link_document_idx";
  DROP INDEX "pages_blocks_b61_stats_band_buttons_link_link_document_idx";
  DROP INDEX "pages_blocks_b61_gallery_buttons_link_link_document_idx";
  DROP INDEX "pages_blocks_b61_accordion_buttons_link_link_document_idx";
  DROP INDEX "pages_blocks_b61_cta_buttons_link_link_document_idx";
  DROP INDEX "pages_blocks_b61_button_bar_first_link_first_link_docume_idx";
  DROP INDEX "pages_blocks_b61_button_bar_second_link_second_link_docu_idx";
  DROP INDEX "pages_blocks_b61_rail_buttons_link_link_document_idx";
  DROP INDEX "pages_blocks_b61_rail_links_link_link_document_idx";
  DROP INDEX "_pages_v_blocks_b61_hero_buttons_link_link_document_idx";
  DROP INDEX "_pages_v_blocks_b61_split_buttons_link_link_document_idx";
  DROP INDEX "_pages_v_blocks_b61_prose_buttons_link_link_document_idx";
  DROP INDEX "_pages_v_blocks_b61_card_grid_cards_link_link_document_idx";
  DROP INDEX "_pages_v_blocks_b61_card_grid_buttons_link_link_document_idx";
  DROP INDEX "_pages_v_blocks_b61_stats_band_buttons_link_link_documen_idx";
  DROP INDEX "_pages_v_blocks_b61_gallery_buttons_link_link_document_idx";
  DROP INDEX "_pages_v_blocks_b61_accordion_buttons_link_link_document_idx";
  DROP INDEX "_pages_v_blocks_b61_cta_buttons_link_link_document_idx";
  DROP INDEX "_pages_v_blocks_b61_button_bar_first_link_first_link_doc_idx";
  DROP INDEX "_pages_v_blocks_b61_button_bar_second_link_second_link_d_idx";
  DROP INDEX "_pages_v_blocks_b61_rail_buttons_link_link_document_idx";
  DROP INDEX "_pages_v_blocks_b61_rail_links_link_link_document_idx";
  DROP INDEX "media_folder_idx";
  DROP INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx";
  DROP INDEX "media_sizes_wide_sizes_wide_filename_idx";
  DROP INDEX "media_sizes_social_sizes_social_filename_idx";
  DROP INDEX "school_settings_menu_links_link_link_document_idx";
  DROP INDEX "school_settings_menu_columns_links_link_link_document_idx";
  DROP INDEX "school_settings_menu_link_link_document_idx";
  DROP INDEX "school_settings_menu_feature_link_feature_link_document_idx";
  DROP INDEX "school_settings_utility_links_link_link_document_idx";
  DROP INDEX "school_settings_footer_columns_links_link_link_document_idx";
  DROP INDEX "school_settings_legal_links_link_link_document_idx";
  DROP INDEX "school_settings_header_button_link_header_button_link_do_idx";
  DROP INDEX "_school_settings_v_version_menu_links_link_link_document_idx";
  DROP INDEX "_school_settings_v_version_menu_columns_links_link_lin_1_idx";
  DROP INDEX "_school_settings_v_version_menu_link_link_document_idx";
  DROP INDEX "_school_settings_v_version_menu_feature_link_feature_l_1_idx";
  DROP INDEX "_school_settings_v_version_utility_links_link_link_docum_idx";
  DROP INDEX "_school_settings_v_version_footer_columns_links_link_l_1_idx";
  DROP INDEX "_school_settings_v_version_legal_links_link_link_documen_idx";
  DROP INDEX "_school_settings_v_version_header_button_link_version__1_idx";
  DROP INDEX "payload_locked_documents_rels_documents_id_idx";
  DROP INDEX "payload_locked_documents_rels_payload_folders_id_idx";
  ALTER TABLE "pages_blocks_b61_hero_buttons" DROP COLUMN "link_document_id";
  ALTER TABLE "pages_blocks_b61_split_buttons" DROP COLUMN "link_document_id";
  ALTER TABLE "pages_blocks_b61_prose_buttons" DROP COLUMN "link_document_id";
  ALTER TABLE "pages_blocks_b61_card_grid_cards" DROP COLUMN "link_document_id";
  ALTER TABLE "pages_blocks_b61_card_grid_buttons" DROP COLUMN "link_document_id";
  ALTER TABLE "pages_blocks_b61_stats_band_buttons" DROP COLUMN "link_document_id";
  ALTER TABLE "pages_blocks_b61_gallery_buttons" DROP COLUMN "link_document_id";
  ALTER TABLE "pages_blocks_b61_accordion_buttons" DROP COLUMN "link_document_id";
  ALTER TABLE "pages_blocks_b61_cta_buttons" DROP COLUMN "link_document_id";
  ALTER TABLE "pages_blocks_b61_button_bar" DROP COLUMN "first_link_document_id";
  ALTER TABLE "pages_blocks_b61_button_bar" DROP COLUMN "second_link_document_id";
  ALTER TABLE "pages_blocks_b61_rail_buttons" DROP COLUMN "link_document_id";
  ALTER TABLE "pages_blocks_b61_rail_links" DROP COLUMN "link_document_id";
  ALTER TABLE "_pages_v_blocks_b61_hero_buttons" DROP COLUMN "link_document_id";
  ALTER TABLE "_pages_v_blocks_b61_split_buttons" DROP COLUMN "link_document_id";
  ALTER TABLE "_pages_v_blocks_b61_prose_buttons" DROP COLUMN "link_document_id";
  ALTER TABLE "_pages_v_blocks_b61_card_grid_cards" DROP COLUMN "link_document_id";
  ALTER TABLE "_pages_v_blocks_b61_card_grid_buttons" DROP COLUMN "link_document_id";
  ALTER TABLE "_pages_v_blocks_b61_stats_band_buttons" DROP COLUMN "link_document_id";
  ALTER TABLE "_pages_v_blocks_b61_gallery_buttons" DROP COLUMN "link_document_id";
  ALTER TABLE "_pages_v_blocks_b61_accordion_buttons" DROP COLUMN "link_document_id";
  ALTER TABLE "_pages_v_blocks_b61_cta_buttons" DROP COLUMN "link_document_id";
  ALTER TABLE "_pages_v_blocks_b61_button_bar" DROP COLUMN "first_link_document_id";
  ALTER TABLE "_pages_v_blocks_b61_button_bar" DROP COLUMN "second_link_document_id";
  ALTER TABLE "_pages_v_blocks_b61_rail_buttons" DROP COLUMN "link_document_id";
  ALTER TABLE "_pages_v_blocks_b61_rail_links" DROP COLUMN "link_document_id";
  ALTER TABLE "media" DROP COLUMN "caption";
  ALTER TABLE "media" DROP COLUMN "credit";
  ALTER TABLE "media" DROP COLUMN "folder_id";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_url";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_width";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_height";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_wide_url";
  ALTER TABLE "media" DROP COLUMN "sizes_wide_width";
  ALTER TABLE "media" DROP COLUMN "sizes_wide_height";
  ALTER TABLE "media" DROP COLUMN "sizes_wide_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_wide_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_wide_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_social_url";
  ALTER TABLE "media" DROP COLUMN "sizes_social_width";
  ALTER TABLE "media" DROP COLUMN "sizes_social_height";
  ALTER TABLE "media" DROP COLUMN "sizes_social_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_social_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_social_filename";
  ALTER TABLE "school_settings_menu_links" DROP COLUMN "link_document_id";
  ALTER TABLE "school_settings_menu_columns_links" DROP COLUMN "link_document_id";
  ALTER TABLE "school_settings_menu" DROP COLUMN "link_document_id";
  ALTER TABLE "school_settings_menu" DROP COLUMN "feature_link_document_id";
  ALTER TABLE "school_settings_utility_links" DROP COLUMN "link_document_id";
  ALTER TABLE "school_settings_footer_columns_links" DROP COLUMN "link_document_id";
  ALTER TABLE "school_settings_legal_links" DROP COLUMN "link_document_id";
  ALTER TABLE "school_settings" DROP COLUMN "header_button_link_document_id";
  ALTER TABLE "_school_settings_v_version_menu_links" DROP COLUMN "link_document_id";
  ALTER TABLE "_school_settings_v_version_menu_columns_links" DROP COLUMN "link_document_id";
  ALTER TABLE "_school_settings_v_version_menu" DROP COLUMN "link_document_id";
  ALTER TABLE "_school_settings_v_version_menu" DROP COLUMN "feature_link_document_id";
  ALTER TABLE "_school_settings_v_version_utility_links" DROP COLUMN "link_document_id";
  ALTER TABLE "_school_settings_v_version_footer_columns_links" DROP COLUMN "link_document_id";
  ALTER TABLE "_school_settings_v_version_legal_links" DROP COLUMN "link_document_id";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_header_button_link_document_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "documents_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "payload_folders_id";
  DROP TYPE "public"."enum_payload_folders_folder_type";`)
}
