import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Thread G: Google Analytics tag ID and property ID in School settings > Analytics.
// IF [NOT] EXISTS because preview deploys share the live database, so this may
// already have run there under an earlier name.

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "school_settings" ADD COLUMN IF NOT EXISTS "ga_measurement_id" varchar;
  ALTER TABLE "school_settings" ADD COLUMN IF NOT EXISTS "ga_property_id" varchar;
  ALTER TABLE "_school_settings_v" ADD COLUMN IF NOT EXISTS "version_ga_measurement_id" varchar;
  ALTER TABLE "_school_settings_v" ADD COLUMN IF NOT EXISTS "version_ga_property_id" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "school_settings" DROP COLUMN IF EXISTS "ga_measurement_id";
  ALTER TABLE "school_settings" DROP COLUMN IF EXISTS "ga_property_id";
  ALTER TABLE "_school_settings_v" DROP COLUMN IF EXISTS "version_ga_measurement_id";
  ALTER TABLE "_school_settings_v" DROP COLUMN IF EXISTS "version_ga_property_id";`)
}
