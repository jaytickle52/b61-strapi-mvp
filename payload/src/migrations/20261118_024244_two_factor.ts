import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_email_log_kind" ADD VALUE IF NOT EXISTS 'security' BEFORE 'other';
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
  ALTER TABLE "email_log" ALTER COLUMN "kind" SET DATA TYPE text;
  DROP TYPE "public"."enum_email_log_kind";
  CREATE TYPE "public"."enum_email_log_kind" AS ENUM('form', 'test', 'password', 'invite', 'other');
  ALTER TABLE "email_log" ALTER COLUMN "kind" SET DATA TYPE "public"."enum_email_log_kind" USING "kind"::"public"."enum_email_log_kind";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "totp_secret";`)
}
