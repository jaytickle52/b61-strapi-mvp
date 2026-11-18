import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_b61_hero" ADD COLUMN IF NOT EXISTS "bunny_video" varchar;
  ALTER TABLE "_pages_v_blocks_b61_hero" ADD COLUMN IF NOT EXISTS "bunny_video" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_b61_hero" DROP COLUMN IF EXISTS "bunny_video";
  ALTER TABLE "_pages_v_blocks_b61_hero" DROP COLUMN IF EXISTS "bunny_video";`)
}
