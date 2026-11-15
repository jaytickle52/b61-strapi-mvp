import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

const NAME = '20261115_015924_branding_video'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Preview deploys share the live database. If this migration ran there under
  // an earlier name (before a rebase re-created it), everything below already
  // exists: retire the old name and stop.
  const earlier: any = await db.execute(
    sql`SELECT "name" FROM "payload_migrations" WHERE "name" LIKE '%_branding_video' AND "name" <> ${NAME}`,
  )
  if (earlier.rows?.length) {
    await db.execute(sql`DELETE FROM "payload_migrations" WHERE "name" LIKE '%_branding_video' AND "name" <> ${NAME}`)
    payload.logger.info('[b61] branding_video already applied under an earlier name; skipping')
    return
  }
  await db.execute(sql`
   ALTER TYPE "public"."enum_school_settings_heading_font" ADD VALUE 'Lora' BEFORE 'Montserrat';
  ALTER TYPE "public"."enum_school_settings_heading_font" ADD VALUE 'Libre Baskerville' BEFORE 'Montserrat';
  ALTER TYPE "public"."enum_school_settings_heading_font" ADD VALUE 'Cormorant Garamond' BEFORE 'Montserrat';
  ALTER TYPE "public"."enum_school_settings_heading_font" ADD VALUE 'Crimson Pro' BEFORE 'Montserrat';
  ALTER TYPE "public"."enum_school_settings_heading_font" ADD VALUE 'Roboto Slab' BEFORE 'Montserrat';
  ALTER TYPE "public"."enum_school_settings_heading_font" ADD VALUE 'Inter';
  ALTER TYPE "public"."enum_school_settings_heading_font" ADD VALUE 'Source Sans 3';
  ALTER TYPE "public"."enum_school_settings_heading_font" ADD VALUE 'Lato';
  ALTER TYPE "public"."enum_school_settings_heading_font" ADD VALUE 'Open Sans';
  ALTER TYPE "public"."enum_school_settings_heading_font" ADD VALUE 'Raleway';
  ALTER TYPE "public"."enum_school_settings_heading_font" ADD VALUE 'Nunito Sans';
  ALTER TYPE "public"."enum_school_settings_heading_font" ADD VALUE 'Work Sans';
  ALTER TYPE "public"."enum_school_settings_heading_font" ADD VALUE 'DM Sans';
  ALTER TYPE "public"."enum_school_settings_heading_font" ADD VALUE 'Roboto';
  ALTER TYPE "public"."enum_school_settings_heading_font" ADD VALUE 'Josefin Sans';
  ALTER TYPE "public"."enum_school_settings_heading_font" ADD VALUE 'Oswald';
  ALTER TYPE "public"."enum_school_settings_body_font" ADD VALUE 'Nunito Sans' BEFORE 'EB Garamond';
  ALTER TYPE "public"."enum_school_settings_body_font" ADD VALUE 'Work Sans' BEFORE 'EB Garamond';
  ALTER TYPE "public"."enum_school_settings_body_font" ADD VALUE 'DM Sans' BEFORE 'EB Garamond';
  ALTER TYPE "public"."enum_school_settings_body_font" ADD VALUE 'Roboto' BEFORE 'EB Garamond';
  ALTER TYPE "public"."enum_school_settings_body_font" ADD VALUE 'Raleway' BEFORE 'EB Garamond';
  ALTER TYPE "public"."enum_school_settings_body_font" ADD VALUE 'Lora' BEFORE 'EB Garamond';
  ALTER TYPE "public"."enum_school_settings_body_font" ADD VALUE 'Merriweather' BEFORE 'EB Garamond';
  ALTER TYPE "public"."enum_school_settings_body_font" ADD VALUE 'Crimson Pro';
  ALTER TYPE "public"."enum_school_settings_body_font" ADD VALUE 'Libre Baskerville';
  ALTER TYPE "public"."enum_school_settings_ui_font" ADD VALUE 'Open Sans';
  ALTER TYPE "public"."enum_school_settings_ui_font" ADD VALUE 'Raleway';
  ALTER TYPE "public"."enum_school_settings_ui_font" ADD VALUE 'Nunito Sans';
  ALTER TYPE "public"."enum_school_settings_ui_font" ADD VALUE 'Work Sans';
  ALTER TYPE "public"."enum_school_settings_ui_font" ADD VALUE 'DM Sans';
  ALTER TYPE "public"."enum_school_settings_ui_font" ADD VALUE 'Roboto';
  ALTER TYPE "public"."enum_school_settings_ui_font" ADD VALUE 'Josefin Sans';
  ALTER TYPE "public"."enum_school_settings_ui_font" ADD VALUE 'Oswald';
  ALTER TYPE "public"."enum__school_settings_v_version_heading_font" ADD VALUE 'Lora' BEFORE 'Montserrat';
  ALTER TYPE "public"."enum__school_settings_v_version_heading_font" ADD VALUE 'Libre Baskerville' BEFORE 'Montserrat';
  ALTER TYPE "public"."enum__school_settings_v_version_heading_font" ADD VALUE 'Cormorant Garamond' BEFORE 'Montserrat';
  ALTER TYPE "public"."enum__school_settings_v_version_heading_font" ADD VALUE 'Crimson Pro' BEFORE 'Montserrat';
  ALTER TYPE "public"."enum__school_settings_v_version_heading_font" ADD VALUE 'Roboto Slab' BEFORE 'Montserrat';
  ALTER TYPE "public"."enum__school_settings_v_version_heading_font" ADD VALUE 'Inter';
  ALTER TYPE "public"."enum__school_settings_v_version_heading_font" ADD VALUE 'Source Sans 3';
  ALTER TYPE "public"."enum__school_settings_v_version_heading_font" ADD VALUE 'Lato';
  ALTER TYPE "public"."enum__school_settings_v_version_heading_font" ADD VALUE 'Open Sans';
  ALTER TYPE "public"."enum__school_settings_v_version_heading_font" ADD VALUE 'Raleway';
  ALTER TYPE "public"."enum__school_settings_v_version_heading_font" ADD VALUE 'Nunito Sans';
  ALTER TYPE "public"."enum__school_settings_v_version_heading_font" ADD VALUE 'Work Sans';
  ALTER TYPE "public"."enum__school_settings_v_version_heading_font" ADD VALUE 'DM Sans';
  ALTER TYPE "public"."enum__school_settings_v_version_heading_font" ADD VALUE 'Roboto';
  ALTER TYPE "public"."enum__school_settings_v_version_heading_font" ADD VALUE 'Josefin Sans';
  ALTER TYPE "public"."enum__school_settings_v_version_heading_font" ADD VALUE 'Oswald';
  ALTER TYPE "public"."enum__school_settings_v_version_body_font" ADD VALUE 'Nunito Sans' BEFORE 'EB Garamond';
  ALTER TYPE "public"."enum__school_settings_v_version_body_font" ADD VALUE 'Work Sans' BEFORE 'EB Garamond';
  ALTER TYPE "public"."enum__school_settings_v_version_body_font" ADD VALUE 'DM Sans' BEFORE 'EB Garamond';
  ALTER TYPE "public"."enum__school_settings_v_version_body_font" ADD VALUE 'Roboto' BEFORE 'EB Garamond';
  ALTER TYPE "public"."enum__school_settings_v_version_body_font" ADD VALUE 'Raleway' BEFORE 'EB Garamond';
  ALTER TYPE "public"."enum__school_settings_v_version_body_font" ADD VALUE 'Lora' BEFORE 'EB Garamond';
  ALTER TYPE "public"."enum__school_settings_v_version_body_font" ADD VALUE 'Merriweather' BEFORE 'EB Garamond';
  ALTER TYPE "public"."enum__school_settings_v_version_body_font" ADD VALUE 'Crimson Pro';
  ALTER TYPE "public"."enum__school_settings_v_version_body_font" ADD VALUE 'Libre Baskerville';
  ALTER TYPE "public"."enum__school_settings_v_version_ui_font" ADD VALUE 'Open Sans';
  ALTER TYPE "public"."enum__school_settings_v_version_ui_font" ADD VALUE 'Raleway';
  ALTER TYPE "public"."enum__school_settings_v_version_ui_font" ADD VALUE 'Nunito Sans';
  ALTER TYPE "public"."enum__school_settings_v_version_ui_font" ADD VALUE 'Work Sans';
  ALTER TYPE "public"."enum__school_settings_v_version_ui_font" ADD VALUE 'DM Sans';
  ALTER TYPE "public"."enum__school_settings_v_version_ui_font" ADD VALUE 'Roboto';
  ALTER TYPE "public"."enum__school_settings_v_version_ui_font" ADD VALUE 'Josefin Sans';
  ALTER TYPE "public"."enum__school_settings_v_version_ui_font" ADD VALUE 'Oswald';
  ALTER TABLE "school_settings" ADD COLUMN "logo_on_dark_id" integer;
  ALTER TABLE "school_settings" ADD COLUMN "site_icon_id" integer;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_logo_on_dark_id" integer;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_site_icon_id" integer;
  ALTER TABLE "school_settings" ADD CONSTRAINT "school_settings_logo_on_dark_id_media_id_fk" FOREIGN KEY ("logo_on_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "school_settings" ADD CONSTRAINT "school_settings_site_icon_id_media_id_fk" FOREIGN KEY ("site_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_school_settings_v" ADD CONSTRAINT "_school_settings_v_version_logo_on_dark_id_media_id_fk" FOREIGN KEY ("version_logo_on_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_school_settings_v" ADD CONSTRAINT "_school_settings_v_version_site_icon_id_media_id_fk" FOREIGN KEY ("version_site_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "school_settings_logo_on_dark_idx" ON "school_settings" USING btree ("logo_on_dark_id");
  CREATE INDEX "school_settings_site_icon_idx" ON "school_settings" USING btree ("site_icon_id");
  CREATE INDEX "_school_settings_v_version_version_logo_on_dark_idx" ON "_school_settings_v" USING btree ("version_logo_on_dark_id");
  CREATE INDEX "_school_settings_v_version_version_site_icon_idx" ON "_school_settings_v" USING btree ("version_site_icon_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "school_settings" DROP CONSTRAINT "school_settings_logo_on_dark_id_media_id_fk";
  
  ALTER TABLE "school_settings" DROP CONSTRAINT "school_settings_site_icon_id_media_id_fk";
  
  ALTER TABLE "_school_settings_v" DROP CONSTRAINT "_school_settings_v_version_logo_on_dark_id_media_id_fk";
  
  ALTER TABLE "_school_settings_v" DROP CONSTRAINT "_school_settings_v_version_site_icon_id_media_id_fk";
  
  ALTER TABLE "school_settings" ALTER COLUMN "heading_font" SET DATA TYPE text;
  ALTER TABLE "school_settings" ALTER COLUMN "heading_font" SET DEFAULT 'Fraunces'::text;
  DROP TYPE "public"."enum_school_settings_heading_font";
  CREATE TYPE "public"."enum_school_settings_heading_font" AS ENUM('Fraunces', 'Playfair Display', 'Merriweather', 'EB Garamond', 'Montserrat', 'Poppins');
  ALTER TABLE "school_settings" ALTER COLUMN "heading_font" SET DEFAULT 'Fraunces'::"public"."enum_school_settings_heading_font";
  ALTER TABLE "school_settings" ALTER COLUMN "heading_font" SET DATA TYPE "public"."enum_school_settings_heading_font" USING "heading_font"::"public"."enum_school_settings_heading_font";
  ALTER TABLE "school_settings" ALTER COLUMN "body_font" SET DATA TYPE text;
  ALTER TABLE "school_settings" ALTER COLUMN "body_font" SET DEFAULT 'Inter'::text;
  DROP TYPE "public"."enum_school_settings_body_font";
  CREATE TYPE "public"."enum_school_settings_body_font" AS ENUM('Inter', 'Source Sans 3', 'Lato', 'Open Sans', 'EB Garamond');
  ALTER TABLE "school_settings" ALTER COLUMN "body_font" SET DEFAULT 'Inter'::"public"."enum_school_settings_body_font";
  ALTER TABLE "school_settings" ALTER COLUMN "body_font" SET DATA TYPE "public"."enum_school_settings_body_font" USING "body_font"::"public"."enum_school_settings_body_font";
  ALTER TABLE "school_settings" ALTER COLUMN "ui_font" SET DATA TYPE text;
  ALTER TABLE "school_settings" ALTER COLUMN "ui_font" SET DEFAULT 'Montserrat'::text;
  DROP TYPE "public"."enum_school_settings_ui_font";
  CREATE TYPE "public"."enum_school_settings_ui_font" AS ENUM('Montserrat', 'Inter', 'Poppins', 'Lato', 'Source Sans 3');
  ALTER TABLE "school_settings" ALTER COLUMN "ui_font" SET DEFAULT 'Montserrat'::"public"."enum_school_settings_ui_font";
  ALTER TABLE "school_settings" ALTER COLUMN "ui_font" SET DATA TYPE "public"."enum_school_settings_ui_font" USING "ui_font"::"public"."enum_school_settings_ui_font";
  ALTER TABLE "_school_settings_v" ALTER COLUMN "version_heading_font" SET DATA TYPE text;
  ALTER TABLE "_school_settings_v" ALTER COLUMN "version_heading_font" SET DEFAULT 'Fraunces'::text;
  DROP TYPE "public"."enum__school_settings_v_version_heading_font";
  CREATE TYPE "public"."enum__school_settings_v_version_heading_font" AS ENUM('Fraunces', 'Playfair Display', 'Merriweather', 'EB Garamond', 'Montserrat', 'Poppins');
  ALTER TABLE "_school_settings_v" ALTER COLUMN "version_heading_font" SET DEFAULT 'Fraunces'::"public"."enum__school_settings_v_version_heading_font";
  ALTER TABLE "_school_settings_v" ALTER COLUMN "version_heading_font" SET DATA TYPE "public"."enum__school_settings_v_version_heading_font" USING "version_heading_font"::"public"."enum__school_settings_v_version_heading_font";
  ALTER TABLE "_school_settings_v" ALTER COLUMN "version_body_font" SET DATA TYPE text;
  ALTER TABLE "_school_settings_v" ALTER COLUMN "version_body_font" SET DEFAULT 'Inter'::text;
  DROP TYPE "public"."enum__school_settings_v_version_body_font";
  CREATE TYPE "public"."enum__school_settings_v_version_body_font" AS ENUM('Inter', 'Source Sans 3', 'Lato', 'Open Sans', 'EB Garamond');
  ALTER TABLE "_school_settings_v" ALTER COLUMN "version_body_font" SET DEFAULT 'Inter'::"public"."enum__school_settings_v_version_body_font";
  ALTER TABLE "_school_settings_v" ALTER COLUMN "version_body_font" SET DATA TYPE "public"."enum__school_settings_v_version_body_font" USING "version_body_font"::"public"."enum__school_settings_v_version_body_font";
  ALTER TABLE "_school_settings_v" ALTER COLUMN "version_ui_font" SET DATA TYPE text;
  ALTER TABLE "_school_settings_v" ALTER COLUMN "version_ui_font" SET DEFAULT 'Montserrat'::text;
  DROP TYPE "public"."enum__school_settings_v_version_ui_font";
  CREATE TYPE "public"."enum__school_settings_v_version_ui_font" AS ENUM('Montserrat', 'Inter', 'Poppins', 'Lato', 'Source Sans 3');
  ALTER TABLE "_school_settings_v" ALTER COLUMN "version_ui_font" SET DEFAULT 'Montserrat'::"public"."enum__school_settings_v_version_ui_font";
  ALTER TABLE "_school_settings_v" ALTER COLUMN "version_ui_font" SET DATA TYPE "public"."enum__school_settings_v_version_ui_font" USING "version_ui_font"::"public"."enum__school_settings_v_version_ui_font";
  DROP INDEX "school_settings_logo_on_dark_idx";
  DROP INDEX "school_settings_site_icon_idx";
  DROP INDEX "_school_settings_v_version_version_logo_on_dark_idx";
  DROP INDEX "_school_settings_v_version_version_site_icon_idx";
  ALTER TABLE "school_settings" DROP COLUMN "logo_on_dark_id";
  ALTER TABLE "school_settings" DROP COLUMN "site_icon_id";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_logo_on_dark_id";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_site_icon_id";`)
}
