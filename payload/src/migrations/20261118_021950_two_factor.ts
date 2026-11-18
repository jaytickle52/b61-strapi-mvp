import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "totp_attempts" (
  	"id" varchar PRIMARY KEY NOT NULL,
  	"attempts" numeric DEFAULT 0 NOT NULL,
  	"lock_until" timestamp(3) with time zone
  );
  
  ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "totp_secret" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE IF EXISTS "totp_attempts" CASCADE;
  ALTER TABLE "users" DROP COLUMN IF EXISTS "totp_secret";`)
}
