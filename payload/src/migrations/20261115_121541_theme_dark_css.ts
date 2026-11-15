import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_school_settings_site_tone" AS ENUM('light', 'dark');
  CREATE TYPE "public"."enum__school_settings_v_version_site_tone" AS ENUM('light', 'dark');
  ALTER TABLE "pages_blocks_b61_framed_image" ALTER COLUMN "width_step" SET DEFAULT 4;
  ALTER TABLE "_pages_v_blocks_b61_framed_image" ALTER COLUMN "width_step" SET DEFAULT 4;
  ALTER TABLE "pages_blocks_b61_hero" ADD COLUMN "css_class" varchar;
  ALTER TABLE "pages_blocks_b61_split" ADD COLUMN "css_class" varchar;
  ALTER TABLE "pages_blocks_b61_prose" ADD COLUMN "css_class" varchar;
  ALTER TABLE "pages_blocks_b61_card_grid" ADD COLUMN "css_class" varchar;
  ALTER TABLE "pages_blocks_b61_stats_band" ADD COLUMN "css_class" varchar;
  ALTER TABLE "pages_blocks_b61_gallery" ADD COLUMN "css_class" varchar;
  ALTER TABLE "pages_blocks_b61_testimonial" ADD COLUMN "css_class" varchar;
  ALTER TABLE "pages_blocks_b61_accordion" ADD COLUMN "css_class" varchar;
  ALTER TABLE "pages_blocks_b61_tabs" ADD COLUMN "css_class" varchar;
  ALTER TABLE "pages_blocks_b61_pillars" ADD COLUMN "css_class" varchar;
  ALTER TABLE "pages_blocks_b61_carousel" ADD COLUMN "css_class" varchar;
  ALTER TABLE "pages_blocks_b61_framed_image" ADD COLUMN "css_class" varchar;
  ALTER TABLE "pages_blocks_b61_cta" ADD COLUMN "css_class" varchar;
  ALTER TABLE "pages_blocks_b61_form" ADD COLUMN "css_class" varchar;
  ALTER TABLE "pages_blocks_b61_button_bar" ADD COLUMN "css_class" varchar;
  ALTER TABLE "pages_blocks_b61_divider" ADD COLUMN "css_class" varchar;
  ALTER TABLE "pages_blocks_b61_rail" ADD COLUMN "css_class" varchar;
  ALTER TABLE "pages_blocks_b61_section" ADD COLUMN "pattern_strength" numeric;
  ALTER TABLE "pages_blocks_b61_section" ADD COLUMN "css_class" varchar;
  ALTER TABLE "_pages_v_blocks_b61_hero" ADD COLUMN "css_class" varchar;
  ALTER TABLE "_pages_v_blocks_b61_split" ADD COLUMN "css_class" varchar;
  ALTER TABLE "_pages_v_blocks_b61_prose" ADD COLUMN "css_class" varchar;
  ALTER TABLE "_pages_v_blocks_b61_card_grid" ADD COLUMN "css_class" varchar;
  ALTER TABLE "_pages_v_blocks_b61_stats_band" ADD COLUMN "css_class" varchar;
  ALTER TABLE "_pages_v_blocks_b61_gallery" ADD COLUMN "css_class" varchar;
  ALTER TABLE "_pages_v_blocks_b61_testimonial" ADD COLUMN "css_class" varchar;
  ALTER TABLE "_pages_v_blocks_b61_accordion" ADD COLUMN "css_class" varchar;
  ALTER TABLE "_pages_v_blocks_b61_tabs" ADD COLUMN "css_class" varchar;
  ALTER TABLE "_pages_v_blocks_b61_pillars" ADD COLUMN "css_class" varchar;
  ALTER TABLE "_pages_v_blocks_b61_carousel" ADD COLUMN "css_class" varchar;
  ALTER TABLE "_pages_v_blocks_b61_framed_image" ADD COLUMN "css_class" varchar;
  ALTER TABLE "_pages_v_blocks_b61_cta" ADD COLUMN "css_class" varchar;
  ALTER TABLE "_pages_v_blocks_b61_form" ADD COLUMN "css_class" varchar;
  ALTER TABLE "_pages_v_blocks_b61_button_bar" ADD COLUMN "css_class" varchar;
  ALTER TABLE "_pages_v_blocks_b61_divider" ADD COLUMN "css_class" varchar;
  ALTER TABLE "_pages_v_blocks_b61_rail" ADD COLUMN "css_class" varchar;
  ALTER TABLE "_pages_v_blocks_b61_section" ADD COLUMN "pattern_strength" numeric;
  ALTER TABLE "_pages_v_blocks_b61_section" ADD COLUMN "css_class" varchar;
  ALTER TABLE "school_settings" ADD COLUMN "site_tone" "enum_school_settings_site_tone" DEFAULT 'light';
  ALTER TABLE "school_settings" ADD COLUMN "background_color" varchar;
  ALTER TABLE "school_settings" ADD COLUMN "text_color" varchar;
  ALTER TABLE "school_settings" ADD COLUMN "custom_css" varchar;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_site_tone" "enum__school_settings_v_version_site_tone" DEFAULT 'light';
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_background_color" varchar;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_text_color" varchar;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_custom_css" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_b61_framed_image" ALTER COLUMN "width_step" DROP DEFAULT;
  ALTER TABLE "_pages_v_blocks_b61_framed_image" ALTER COLUMN "width_step" DROP DEFAULT;
  ALTER TABLE "pages_blocks_b61_hero" DROP COLUMN "css_class";
  ALTER TABLE "pages_blocks_b61_split" DROP COLUMN "css_class";
  ALTER TABLE "pages_blocks_b61_prose" DROP COLUMN "css_class";
  ALTER TABLE "pages_blocks_b61_card_grid" DROP COLUMN "css_class";
  ALTER TABLE "pages_blocks_b61_stats_band" DROP COLUMN "css_class";
  ALTER TABLE "pages_blocks_b61_gallery" DROP COLUMN "css_class";
  ALTER TABLE "pages_blocks_b61_testimonial" DROP COLUMN "css_class";
  ALTER TABLE "pages_blocks_b61_accordion" DROP COLUMN "css_class";
  ALTER TABLE "pages_blocks_b61_tabs" DROP COLUMN "css_class";
  ALTER TABLE "pages_blocks_b61_pillars" DROP COLUMN "css_class";
  ALTER TABLE "pages_blocks_b61_carousel" DROP COLUMN "css_class";
  ALTER TABLE "pages_blocks_b61_framed_image" DROP COLUMN "css_class";
  ALTER TABLE "pages_blocks_b61_cta" DROP COLUMN "css_class";
  ALTER TABLE "pages_blocks_b61_form" DROP COLUMN "css_class";
  ALTER TABLE "pages_blocks_b61_button_bar" DROP COLUMN "css_class";
  ALTER TABLE "pages_blocks_b61_divider" DROP COLUMN "css_class";
  ALTER TABLE "pages_blocks_b61_rail" DROP COLUMN "css_class";
  ALTER TABLE "pages_blocks_b61_section" DROP COLUMN "pattern_strength";
  ALTER TABLE "pages_blocks_b61_section" DROP COLUMN "css_class";
  ALTER TABLE "_pages_v_blocks_b61_hero" DROP COLUMN "css_class";
  ALTER TABLE "_pages_v_blocks_b61_split" DROP COLUMN "css_class";
  ALTER TABLE "_pages_v_blocks_b61_prose" DROP COLUMN "css_class";
  ALTER TABLE "_pages_v_blocks_b61_card_grid" DROP COLUMN "css_class";
  ALTER TABLE "_pages_v_blocks_b61_stats_band" DROP COLUMN "css_class";
  ALTER TABLE "_pages_v_blocks_b61_gallery" DROP COLUMN "css_class";
  ALTER TABLE "_pages_v_blocks_b61_testimonial" DROP COLUMN "css_class";
  ALTER TABLE "_pages_v_blocks_b61_accordion" DROP COLUMN "css_class";
  ALTER TABLE "_pages_v_blocks_b61_tabs" DROP COLUMN "css_class";
  ALTER TABLE "_pages_v_blocks_b61_pillars" DROP COLUMN "css_class";
  ALTER TABLE "_pages_v_blocks_b61_carousel" DROP COLUMN "css_class";
  ALTER TABLE "_pages_v_blocks_b61_framed_image" DROP COLUMN "css_class";
  ALTER TABLE "_pages_v_blocks_b61_cta" DROP COLUMN "css_class";
  ALTER TABLE "_pages_v_blocks_b61_form" DROP COLUMN "css_class";
  ALTER TABLE "_pages_v_blocks_b61_button_bar" DROP COLUMN "css_class";
  ALTER TABLE "_pages_v_blocks_b61_divider" DROP COLUMN "css_class";
  ALTER TABLE "_pages_v_blocks_b61_rail" DROP COLUMN "css_class";
  ALTER TABLE "_pages_v_blocks_b61_section" DROP COLUMN "pattern_strength";
  ALTER TABLE "_pages_v_blocks_b61_section" DROP COLUMN "css_class";
  ALTER TABLE "school_settings" DROP COLUMN "site_tone";
  ALTER TABLE "school_settings" DROP COLUMN "background_color";
  ALTER TABLE "school_settings" DROP COLUMN "text_color";
  ALTER TABLE "school_settings" DROP COLUMN "custom_css";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_site_tone";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_background_color";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_text_color";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_custom_css";
  DROP TYPE "public"."enum_school_settings_site_tone";
  DROP TYPE "public"."enum__school_settings_v_version_site_tone";`)
}
