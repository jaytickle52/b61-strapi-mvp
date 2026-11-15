import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

// Staff and Programs save drafts, so the admin list shows each item's latest
// version, not the main row. The school_features migration gave every main row
// a place in the drag order (_order) but left the versions empty, so every drag
// in those lists looked like the first one ever and showed Payload's "refresh
// the page and try again" message forever. Copy each item's place into its
// versions. Data only: no schema change, and safe to run more than once.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const table of ['staff', 'programs']) {
    await db.execute(
      sql.raw(`UPDATE "_${table}_v" AS v
        SET "version__order" = t."_order"
        FROM "${table}" AS t
        WHERE v."parent_id" = t."id"
          AND t."_order" IS NOT NULL
          AND (v."version__order" IS NULL OR v."version__order" = '')`),
    )
  }
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Nothing to undo: the copied values match the main rows.
}
