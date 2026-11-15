import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_tenants_role" AS ENUM('schoolAdmin', 'editor', 'contributor');
  ALTER TYPE "public"."enum_email_log_kind" ADD VALUE 'invite' BEFORE 'other';
  ALTER TABLE "users_tenants" ADD COLUMN "role" "enum_users_tenants_role" DEFAULT 'editor' NOT NULL;
  ALTER TABLE "users" ADD COLUMN "invited_at" timestamp(3) with time zone;
  ALTER TABLE "users" ADD COLUMN "last_sign_in_at" timestamp(3) with time zone;
  -- Accounts made before invites existed already work; don't show them as "waiting".
  UPDATE "users" SET "last_sign_in_at" = "updated_at";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "email_log" ALTER COLUMN "kind" SET DATA TYPE text;
  DROP TYPE "public"."enum_email_log_kind";
  CREATE TYPE "public"."enum_email_log_kind" AS ENUM('form', 'test', 'password', 'other');
  ALTER TABLE "email_log" ALTER COLUMN "kind" SET DATA TYPE "public"."enum_email_log_kind" USING "kind"::"public"."enum_email_log_kind";
  ALTER TABLE "users_tenants" DROP COLUMN "role";
  ALTER TABLE "users" DROP COLUMN "invited_at";
  ALTER TABLE "users" DROP COLUMN "last_sign_in_at";
  DROP TYPE "public"."enum_users_tenants_role";`)
}
