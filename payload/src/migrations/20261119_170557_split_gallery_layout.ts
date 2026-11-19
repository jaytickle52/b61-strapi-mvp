import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_b61_split_gallery_layout" AS ENUM('grid', 'masonry', 'strip');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_gallery_layout" AS ENUM('grid', 'masonry', 'strip');
  ALTER TABLE "pages_blocks_b61_split" ADD COLUMN "gallery_layout" "enum_pages_blocks_b61_split_gallery_layout" DEFAULT 'grid';
  ALTER TABLE "_pages_v_blocks_b61_split" ADD COLUMN "gallery_layout" "enum__pages_v_blocks_b61_split_gallery_layout" DEFAULT 'grid';
  ALTER TABLE "pages_blocks_b61_split" DROP COLUMN "columns";
  ALTER TABLE "_pages_v_blocks_b61_split" DROP COLUMN "columns";
  DROP TYPE "public"."enum_pages_blocks_b61_split_columns";
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_columns";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_b61_split_columns" AS ENUM('1', '2', '3');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_columns" AS ENUM('1', '2', '3');
  ALTER TABLE "pages_blocks_b61_split" ADD COLUMN "columns" "enum_pages_blocks_b61_split_columns" DEFAULT '2';
  ALTER TABLE "_pages_v_blocks_b61_split" ADD COLUMN "columns" "enum__pages_v_blocks_b61_split_columns" DEFAULT '2';
  ALTER TABLE "pages_blocks_b61_split" DROP COLUMN "gallery_layout";
  ALTER TABLE "_pages_v_blocks_b61_split" DROP COLUMN "gallery_layout";
  DROP TYPE "public"."enum_pages_blocks_b61_split_gallery_layout";
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_gallery_layout";`)
}
