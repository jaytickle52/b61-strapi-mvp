import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

/**
 * Catch-up after merging the SEO stack (PRs #15-#18) into main.
 *
 * Those branches were cut before PR #12 (dark sites, custom CSS) reached main, so
 * their schema snapshots don't include #12's columns. This migration exists only
 * so the stored snapshot (the .json beside it) matches the merged code, which is
 * what `migrate:create` and the CI drift check compare against.
 *
 * Its SQL would be exactly 20261115_121541_theme_dark_css's (checked statement by
 * statement), and every database that reaches this point has already run that
 * migration, so up and down do nothing.
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {}
