import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "videos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"school_id" integer,
  	"title" varchar,
  	"link" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "videos_id" integer;
  ALTER TABLE "videos" ADD CONSTRAINT "videos_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "videos_school_idx" ON "videos" USING btree ("school_id");
  CREATE INDEX "videos_updated_at_idx" ON "videos" USING btree ("updated_at");
  CREATE INDEX "videos_created_at_idx" ON "videos" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_videos_fk" FOREIGN KEY ("videos_id") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_videos_id_idx" ON "payload_locked_documents_rels" USING btree ("videos_id");
  ALTER TABLE "pages_blocks_b61_hero_buttons" DROP COLUMN "link_new_tab";
  ALTER TABLE "pages_blocks_b61_split_buttons" DROP COLUMN "link_new_tab";
  ALTER TABLE "pages_blocks_b61_prose_buttons" DROP COLUMN "link_new_tab";
  ALTER TABLE "pages_blocks_b61_card_grid_cards" DROP COLUMN "link_new_tab";
  ALTER TABLE "pages_blocks_b61_card_grid_buttons" DROP COLUMN "link_new_tab";
  ALTER TABLE "pages_blocks_b61_stats_band_buttons" DROP COLUMN "link_new_tab";
  ALTER TABLE "pages_blocks_b61_gallery_buttons" DROP COLUMN "link_new_tab";
  ALTER TABLE "pages_blocks_b61_accordion_buttons" DROP COLUMN "link_new_tab";
  ALTER TABLE "pages_blocks_b61_cta_buttons" DROP COLUMN "link_new_tab";
  ALTER TABLE "pages_blocks_b61_button_bar" DROP COLUMN "first_link_new_tab";
  ALTER TABLE "pages_blocks_b61_button_bar" DROP COLUMN "second_link_new_tab";
  ALTER TABLE "pages_blocks_b61_logos_logos" DROP COLUMN "link_new_tab";
  ALTER TABLE "pages_blocks_b61_rail_buttons" DROP COLUMN "link_new_tab";
  ALTER TABLE "pages_blocks_b61_rail_links" DROP COLUMN "link_new_tab";
  ALTER TABLE "_pages_v_blocks_b61_hero_buttons" DROP COLUMN "link_new_tab";
  ALTER TABLE "_pages_v_blocks_b61_split_buttons" DROP COLUMN "link_new_tab";
  ALTER TABLE "_pages_v_blocks_b61_prose_buttons" DROP COLUMN "link_new_tab";
  ALTER TABLE "_pages_v_blocks_b61_card_grid_cards" DROP COLUMN "link_new_tab";
  ALTER TABLE "_pages_v_blocks_b61_card_grid_buttons" DROP COLUMN "link_new_tab";
  ALTER TABLE "_pages_v_blocks_b61_stats_band_buttons" DROP COLUMN "link_new_tab";
  ALTER TABLE "_pages_v_blocks_b61_gallery_buttons" DROP COLUMN "link_new_tab";
  ALTER TABLE "_pages_v_blocks_b61_accordion_buttons" DROP COLUMN "link_new_tab";
  ALTER TABLE "_pages_v_blocks_b61_cta_buttons" DROP COLUMN "link_new_tab";
  ALTER TABLE "_pages_v_blocks_b61_button_bar" DROP COLUMN "first_link_new_tab";
  ALTER TABLE "_pages_v_blocks_b61_button_bar" DROP COLUMN "second_link_new_tab";
  ALTER TABLE "_pages_v_blocks_b61_logos_logos" DROP COLUMN "link_new_tab";
  ALTER TABLE "_pages_v_blocks_b61_rail_buttons" DROP COLUMN "link_new_tab";
  ALTER TABLE "_pages_v_blocks_b61_rail_links" DROP COLUMN "link_new_tab";
  ALTER TABLE "announcements" DROP COLUMN "button_link_new_tab";
  ALTER TABLE "_announcements_v" DROP COLUMN "version_button_link_new_tab";
  ALTER TABLE "school_settings_menu_links" DROP COLUMN "link_new_tab";
  ALTER TABLE "school_settings_menu_columns_links" DROP COLUMN "link_new_tab";
  ALTER TABLE "school_settings_menu" DROP COLUMN "link_new_tab";
  ALTER TABLE "school_settings_menu" DROP COLUMN "feature_link_new_tab";
  ALTER TABLE "school_settings_utility_links" DROP COLUMN "link_new_tab";
  ALTER TABLE "school_settings_quick_links" DROP COLUMN "link_new_tab";
  ALTER TABLE "school_settings_footer_columns_links" DROP COLUMN "link_new_tab";
  ALTER TABLE "school_settings_legal_links" DROP COLUMN "link_new_tab";
  ALTER TABLE "school_settings" DROP COLUMN "header_button_link_new_tab";
  ALTER TABLE "_school_settings_v_version_menu_links" DROP COLUMN "link_new_tab";
  ALTER TABLE "_school_settings_v_version_menu_columns_links" DROP COLUMN "link_new_tab";
  ALTER TABLE "_school_settings_v_version_menu" DROP COLUMN "link_new_tab";
  ALTER TABLE "_school_settings_v_version_menu" DROP COLUMN "feature_link_new_tab";
  ALTER TABLE "_school_settings_v_version_utility_links" DROP COLUMN "link_new_tab";
  ALTER TABLE "_school_settings_v_version_quick_links" DROP COLUMN "link_new_tab";
  ALTER TABLE "_school_settings_v_version_footer_columns_links" DROP COLUMN "link_new_tab";
  ALTER TABLE "_school_settings_v_version_legal_links" DROP COLUMN "link_new_tab";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_header_button_link_new_tab";`)

}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "videos" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "videos" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_videos_fk";
  
  DROP INDEX "payload_locked_documents_rels_videos_id_idx";
  ALTER TABLE "pages_blocks_b61_hero_buttons" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "pages_blocks_b61_split_buttons" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "pages_blocks_b61_prose_buttons" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "pages_blocks_b61_card_grid_cards" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "pages_blocks_b61_card_grid_buttons" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "pages_blocks_b61_stats_band_buttons" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "pages_blocks_b61_gallery_buttons" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "pages_blocks_b61_accordion_buttons" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "pages_blocks_b61_cta_buttons" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "pages_blocks_b61_button_bar" ADD COLUMN "first_link_new_tab" boolean;
  ALTER TABLE "pages_blocks_b61_button_bar" ADD COLUMN "second_link_new_tab" boolean;
  ALTER TABLE "pages_blocks_b61_logos_logos" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "pages_blocks_b61_rail_buttons" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "pages_blocks_b61_rail_links" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "_pages_v_blocks_b61_hero_buttons" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "_pages_v_blocks_b61_split_buttons" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "_pages_v_blocks_b61_prose_buttons" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "_pages_v_blocks_b61_card_grid_cards" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "_pages_v_blocks_b61_card_grid_buttons" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "_pages_v_blocks_b61_stats_band_buttons" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "_pages_v_blocks_b61_gallery_buttons" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "_pages_v_blocks_b61_accordion_buttons" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "_pages_v_blocks_b61_cta_buttons" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "_pages_v_blocks_b61_button_bar" ADD COLUMN "first_link_new_tab" boolean;
  ALTER TABLE "_pages_v_blocks_b61_button_bar" ADD COLUMN "second_link_new_tab" boolean;
  ALTER TABLE "_pages_v_blocks_b61_logos_logos" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "_pages_v_blocks_b61_rail_buttons" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "_pages_v_blocks_b61_rail_links" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "announcements" ADD COLUMN "button_link_new_tab" boolean;
  ALTER TABLE "_announcements_v" ADD COLUMN "version_button_link_new_tab" boolean;
  ALTER TABLE "school_settings_menu_links" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "school_settings_menu_columns_links" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "school_settings_menu" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "school_settings_menu" ADD COLUMN "feature_link_new_tab" boolean;
  ALTER TABLE "school_settings_utility_links" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "school_settings_quick_links" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "school_settings_footer_columns_links" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "school_settings_legal_links" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "school_settings" ADD COLUMN "header_button_link_new_tab" boolean;
  ALTER TABLE "_school_settings_v_version_menu_links" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "_school_settings_v_version_menu_columns_links" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "_school_settings_v_version_menu" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "_school_settings_v_version_menu" ADD COLUMN "feature_link_new_tab" boolean;
  ALTER TABLE "_school_settings_v_version_utility_links" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "_school_settings_v_version_quick_links" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "_school_settings_v_version_footer_columns_links" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "_school_settings_v_version_legal_links" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_header_button_link_new_tab" boolean;
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "videos_id";`)
}
