import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/*
 * Follow-up to 20261119_184651_programs_are_pages (#64), which copied every
 * program into a page but left the old programs tables in place so the
 * previous version of the site kept working during that build. #64 is live
 * (20 Nov 2026), so they go now: the two programs tables, their columns in
 * the link tables and API-key permissions, and their status types.
 *
 * News categories' school + slug index then takes the name Payload expects
 * (school_slug_3_idx, which the programs table held until now).
 *
 * Every step checks first, so this is safe to run on any copy (a fresh
 * database never had these tables) and safe to run twice. No schema snapshot
 * change: the snapshot already describes the result (see #64's .json).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "_programs_v" CASCADE;
  DROP TABLE IF EXISTS "programs" CASCADE;
  DROP INDEX IF EXISTS "redirects_rels_programs_id_idx";
  DROP INDEX IF EXISTS "search_rels_programs_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_programs_id_idx";
  ALTER TABLE "redirects_rels" DROP COLUMN IF EXISTS "programs_id";
  ALTER TABLE "search_rels" DROP COLUMN IF EXISTS "programs_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "programs_id";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "programs_find";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "programs_create";
  ALTER TABLE "payload_mcp_api_keys" DROP COLUMN IF EXISTS "programs_update";
  DROP TYPE IF EXISTS "public"."enum_programs_status";
  DROP TYPE IF EXISTS "public"."enum__programs_v_version_status";
  DO $$
  BEGIN
    IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'school_slug_4_idx' AND tablename = 'news_categories')
       AND NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'school_slug_3_idx') THEN
      ALTER INDEX "school_slug_4_idx" RENAME TO "school_slug_3_idx";
    END IF;
  END $$;`)
}

/** The programs now live in pages; there is nothing to bring back. */
export async function down(_: MigrateDownArgs): Promise<void> {}
