import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // This migration first ran under an earlier name (20261114_224735_permissions_invites)
  // when Thread E's first preview deploy migrated the shared database before C and D merged.
  // Its SQL is identical. If that earlier one ran here, the columns already exist: just
  // retire the old name so it isn't listed as an unknown migration.
  const earlier = await db.execute(
    sql`SELECT 1 FROM "payload_migrations" WHERE "name" = '20261114_224735_permissions_invites' LIMIT 1`,
  )
  if ((earlier as any).rows?.length) {
    await db.execute(sql`DELETE FROM "payload_migrations" WHERE "name" = '20261114_224735_permissions_invites'`)
    payload.logger.info('[b61] permissions_invites already applied under its earlier name; skipping')
    return
  }
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
