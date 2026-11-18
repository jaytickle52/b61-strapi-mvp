import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/*
 * Drops the hidden "Sort order" columns on Staff and Programs. Drag ordering
 * (_order) replaced them in Thread F; they were kept only because preview
 * deploys used to migrate the live database. Previews have their own Neon
 * branch now (confirmed 17 Nov 2026: production ran 20261117_111456_mcp_keys
 * itself after that branch's previews had built), so this is safe.
 * IF EXISTS so it copes with a database that already lost them.
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "programs" DROP COLUMN IF EXISTS "sort_order";
  ALTER TABLE "_programs_v" DROP COLUMN IF EXISTS "version_sort_order";
  ALTER TABLE "staff" DROP COLUMN IF EXISTS "sort_order";
  ALTER TABLE "_staff_v" DROP COLUMN IF EXISTS "version_sort_order";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "programs" ADD COLUMN IF NOT EXISTS "sort_order" numeric DEFAULT 100;
  ALTER TABLE "_programs_v" ADD COLUMN IF NOT EXISTS "version_sort_order" numeric DEFAULT 100;
  ALTER TABLE "staff" ADD COLUMN IF NOT EXISTS "sort_order" numeric DEFAULT 100;
  ALTER TABLE "_staff_v" ADD COLUMN IF NOT EXISTS "version_sort_order" numeric DEFAULT 100;`)
}
