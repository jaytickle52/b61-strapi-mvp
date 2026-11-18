import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_schools_setup_stage" AS ENUM('setup', 'review', 'live');
  ALTER TABLE "schools" ADD COLUMN "setup_stage" "enum_schools_setup_stage";
  ALTER TABLE "schools" ADD COLUMN "setup_spots" jsonb;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "schools" DROP COLUMN "setup_stage";
  ALTER TABLE "schools" DROP COLUMN "setup_spots";
  DROP TYPE "public"."enum_schools_setup_stage";`)
}
