import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "school_settings" ADD COLUMN "bing_verification" varchar;
  ALTER TABLE "school_settings" ADD COLUMN "allow_ai_training" boolean DEFAULT true;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_bing_verification" varchar;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_allow_ai_training" boolean DEFAULT true;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "school_settings" DROP COLUMN "bing_verification";
  ALTER TABLE "school_settings" DROP COLUMN "allow_ai_training";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_bing_verification";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_allow_ai_training";`)
}
