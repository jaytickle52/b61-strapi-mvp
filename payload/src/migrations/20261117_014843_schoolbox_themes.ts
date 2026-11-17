import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/*
 * Schoolbox themes: the five style themes become Classic, Heritage, Warm and
 * Bold (Soft -> Warm, Editorial -> Heritage, Modern -> no theme, i.e. Classic),
 * and Nunito joins the font choices. Data in step with the enum changes.
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_school_settings_heading_font" ADD VALUE 'Nunito' BEFORE 'Nunito Sans';
  ALTER TYPE "public"."enum_school_settings_accent_font" ADD VALUE 'Nunito' BEFORE 'Nunito Sans';
  ALTER TYPE "public"."enum__school_settings_v_version_heading_font" ADD VALUE 'Nunito' BEFORE 'Nunito Sans';
  ALTER TYPE "public"."enum__school_settings_v_version_accent_font" ADD VALUE 'Nunito' BEFORE 'Nunito Sans';
  ALTER TABLE "school_settings" ALTER COLUMN "style_theme" SET DATA TYPE text;
  UPDATE "school_settings" SET "style_theme" = CASE "style_theme" WHEN 'soft' THEN 'warm' WHEN 'editorial' THEN 'heritage' WHEN 'modern' THEN NULL ELSE "style_theme" END;
  DROP TYPE "public"."enum_school_settings_style_theme";
  CREATE TYPE "public"."enum_school_settings_style_theme" AS ENUM('classic', 'heritage', 'warm', 'bold');
  ALTER TABLE "school_settings" ALTER COLUMN "style_theme" SET DATA TYPE "public"."enum_school_settings_style_theme" USING "style_theme"::"public"."enum_school_settings_style_theme";
  ALTER TABLE "_school_settings_v" ALTER COLUMN "version_style_theme" SET DATA TYPE text;
  UPDATE "_school_settings_v" SET "version_style_theme" = CASE "version_style_theme" WHEN 'soft' THEN 'warm' WHEN 'editorial' THEN 'heritage' WHEN 'modern' THEN NULL ELSE "version_style_theme" END;
  DROP TYPE "public"."enum__school_settings_v_version_style_theme";
  CREATE TYPE "public"."enum__school_settings_v_version_style_theme" AS ENUM('classic', 'heritage', 'warm', 'bold');
  ALTER TABLE "_school_settings_v" ALTER COLUMN "version_style_theme" SET DATA TYPE "public"."enum__school_settings_v_version_style_theme" USING "version_style_theme"::"public"."enum__school_settings_v_version_style_theme";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   UPDATE "school_settings" SET "heading_font" = 'Nunito Sans' WHERE "heading_font" = 'Nunito';
  UPDATE "school_settings" SET "accent_font" = NULL WHERE "accent_font" = 'Nunito';
  UPDATE "_school_settings_v" SET "version_heading_font" = 'Nunito Sans' WHERE "version_heading_font" = 'Nunito';
  UPDATE "_school_settings_v" SET "version_accent_font" = NULL WHERE "version_accent_font" = 'Nunito';
   ALTER TABLE "school_settings" ALTER COLUMN "heading_font" SET DATA TYPE text;
  ALTER TABLE "school_settings" ALTER COLUMN "heading_font" SET DEFAULT 'Fraunces'::text;
  DROP TYPE "public"."enum_school_settings_heading_font";
  CREATE TYPE "public"."enum_school_settings_heading_font" AS ENUM('Fraunces', 'Playfair Display', 'Merriweather', 'EB Garamond', 'Lora', 'Libre Baskerville', 'Cormorant Garamond', 'Crimson Pro', 'Roboto Slab', 'Montserrat', 'Poppins', 'Inter', 'Source Sans 3', 'Lato', 'Open Sans', 'Raleway', 'Nunito Sans', 'Work Sans', 'DM Sans', 'Roboto', 'Josefin Sans', 'Oswald');
  ALTER TABLE "school_settings" ALTER COLUMN "heading_font" SET DEFAULT 'Fraunces'::"public"."enum_school_settings_heading_font";
  ALTER TABLE "school_settings" ALTER COLUMN "heading_font" SET DATA TYPE "public"."enum_school_settings_heading_font" USING "heading_font"::"public"."enum_school_settings_heading_font";
  ALTER TABLE "school_settings" ALTER COLUMN "accent_font" SET DATA TYPE text;
  DROP TYPE "public"."enum_school_settings_accent_font";
  CREATE TYPE "public"."enum_school_settings_accent_font" AS ENUM('Fraunces', 'Playfair Display', 'Merriweather', 'EB Garamond', 'Lora', 'Libre Baskerville', 'Cormorant Garamond', 'Crimson Pro', 'Roboto Slab', 'Montserrat', 'Poppins', 'Inter', 'Source Sans 3', 'Lato', 'Open Sans', 'Raleway', 'Nunito Sans', 'Work Sans', 'DM Sans', 'Roboto', 'Josefin Sans', 'Oswald');
  ALTER TABLE "school_settings" ALTER COLUMN "accent_font" SET DATA TYPE "public"."enum_school_settings_accent_font" USING "accent_font"::"public"."enum_school_settings_accent_font";
  ALTER TABLE "school_settings" ALTER COLUMN "style_theme" SET DATA TYPE text;
  UPDATE "school_settings" SET "style_theme" = CASE "style_theme" WHEN 'warm' THEN 'soft' WHEN 'heritage' THEN 'editorial' ELSE "style_theme" END;
  DROP TYPE "public"."enum_school_settings_style_theme";
  CREATE TYPE "public"."enum_school_settings_style_theme" AS ENUM('classic', 'modern', 'bold', 'soft', 'editorial');
  ALTER TABLE "school_settings" ALTER COLUMN "style_theme" SET DATA TYPE "public"."enum_school_settings_style_theme" USING "style_theme"::"public"."enum_school_settings_style_theme";
  ALTER TABLE "_school_settings_v" ALTER COLUMN "version_heading_font" SET DATA TYPE text;
  ALTER TABLE "_school_settings_v" ALTER COLUMN "version_heading_font" SET DEFAULT 'Fraunces'::text;
  DROP TYPE "public"."enum__school_settings_v_version_heading_font";
  CREATE TYPE "public"."enum__school_settings_v_version_heading_font" AS ENUM('Fraunces', 'Playfair Display', 'Merriweather', 'EB Garamond', 'Lora', 'Libre Baskerville', 'Cormorant Garamond', 'Crimson Pro', 'Roboto Slab', 'Montserrat', 'Poppins', 'Inter', 'Source Sans 3', 'Lato', 'Open Sans', 'Raleway', 'Nunito Sans', 'Work Sans', 'DM Sans', 'Roboto', 'Josefin Sans', 'Oswald');
  ALTER TABLE "_school_settings_v" ALTER COLUMN "version_heading_font" SET DEFAULT 'Fraunces'::"public"."enum__school_settings_v_version_heading_font";
  ALTER TABLE "_school_settings_v" ALTER COLUMN "version_heading_font" SET DATA TYPE "public"."enum__school_settings_v_version_heading_font" USING "version_heading_font"::"public"."enum__school_settings_v_version_heading_font";
  ALTER TABLE "_school_settings_v" ALTER COLUMN "version_accent_font" SET DATA TYPE text;
  DROP TYPE "public"."enum__school_settings_v_version_accent_font";
  CREATE TYPE "public"."enum__school_settings_v_version_accent_font" AS ENUM('Fraunces', 'Playfair Display', 'Merriweather', 'EB Garamond', 'Lora', 'Libre Baskerville', 'Cormorant Garamond', 'Crimson Pro', 'Roboto Slab', 'Montserrat', 'Poppins', 'Inter', 'Source Sans 3', 'Lato', 'Open Sans', 'Raleway', 'Nunito Sans', 'Work Sans', 'DM Sans', 'Roboto', 'Josefin Sans', 'Oswald');
  ALTER TABLE "_school_settings_v" ALTER COLUMN "version_accent_font" SET DATA TYPE "public"."enum__school_settings_v_version_accent_font" USING "version_accent_font"::"public"."enum__school_settings_v_version_accent_font";
  ALTER TABLE "_school_settings_v" ALTER COLUMN "version_style_theme" SET DATA TYPE text;
  UPDATE "_school_settings_v" SET "version_style_theme" = CASE "version_style_theme" WHEN 'warm' THEN 'soft' WHEN 'heritage' THEN 'editorial' ELSE "version_style_theme" END;
  DROP TYPE "public"."enum__school_settings_v_version_style_theme";
  CREATE TYPE "public"."enum__school_settings_v_version_style_theme" AS ENUM('classic', 'modern', 'bold', 'soft', 'editorial');
  ALTER TABLE "_school_settings_v" ALTER COLUMN "version_style_theme" SET DATA TYPE "public"."enum__school_settings_v_version_style_theme" USING "version_style_theme"::"public"."enum__school_settings_v_version_style_theme";`)
}
