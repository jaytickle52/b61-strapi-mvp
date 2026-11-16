import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_b61_stats_band" ALTER COLUMN "surface" DROP DEFAULT;
  ALTER TABLE "pages_blocks_b61_cta" ALTER COLUMN "surface" DROP DEFAULT;
  ALTER TABLE "_pages_v_blocks_b61_stats_band" ALTER COLUMN "surface" DROP DEFAULT;
  ALTER TABLE "_pages_v_blocks_b61_cta" ALTER COLUMN "surface" DROP DEFAULT;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_b61_stats_band" ALTER COLUMN "surface" SET DEFAULT 'soft';
  ALTER TABLE "pages_blocks_b61_cta" ALTER COLUMN "surface" SET DEFAULT 'soft';
  ALTER TABLE "_pages_v_blocks_b61_stats_band" ALTER COLUMN "surface" SET DEFAULT 'soft';
  ALTER TABLE "_pages_v_blocks_b61_cta" ALTER COLUMN "surface" SET DEFAULT 'soft';`)
}
