import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/*
 * Staff bios become rich text (19 Nov 2026). Existing bios are plain text:
 * each line becomes a paragraph, nothing is lost. Written by hand because the
 * generated "SET DATA TYPE jsonb" fails on plain text. Skips a table whose
 * column is already jsonb, so running it twice is harmless.
 */

const asRich = (col: string) => sql.raw(`
  CASE WHEN ${col} IS NULL OR btrim(${col}) = '' THEN NULL ELSE jsonb_build_object('root', jsonb_build_object(
    'type', 'root', 'format', '', 'indent', 0, 'version', 1, 'direction', 'ltr',
    'children', (
      SELECT coalesce(jsonb_agg(jsonb_build_object(
        'type', 'paragraph', 'format', '', 'indent', 0, 'version', 1, 'direction', 'ltr', 'textFormat', 0, 'textStyle', '',
        'children', jsonb_build_array(jsonb_build_object('type', 'text', 'text', line, 'format', 0, 'style', '', 'mode', 'normal', 'detail', 0, 'version', 1))
      ) ORDER BY n), '[]'::jsonb)
      FROM (SELECT btrim(x) AS line, n FROM regexp_split_to_table(${col}, E'\\n') WITH ORDINALITY AS t(x, n)) lines
      WHERE line <> ''
    )
  )) END`)

async function convert(db: any, table: string, col: string) {
  const r: any = await db.execute(sql`SELECT data_type FROM information_schema.columns WHERE table_name = ${table} AND column_name = ${col}`)
  const type = (r.rows ?? r)[0]?.data_type
  if (!type || type === 'jsonb') return
  const t = sql.raw(`"${table}"`)
  await db.execute(sql`ALTER TABLE ${t} ADD COLUMN "b61_rich_tmp" jsonb`)
  await db.execute(sql`UPDATE ${t} SET "b61_rich_tmp" = ${asRich(`"${col}"`)}`)
  await db.execute(sql`ALTER TABLE ${t} DROP COLUMN ${sql.raw(`"${col}"`)}`)
  await db.execute(sql`ALTER TABLE ${t} RENAME COLUMN "b61_rich_tmp" TO ${sql.raw(`"${col}"`)}`)
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await convert(db, 'staff', 'bio')
  await convert(db, '_staff_v', 'version_bio')
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Back to text: the paragraphs' words, one per line.
  for (const [table, col] of [['staff', 'bio'], ['_staff_v', 'version_bio']]) {
    const t = sql.raw(`"${table}"`)
    const c = sql.raw(`"${col}"`)
    await db.execute(sql`ALTER TABLE ${t} ADD COLUMN "b61_text_tmp" varchar`)
    await db.execute(sql`UPDATE ${t} SET "b61_text_tmp" = (
      SELECT string_agg(p->'children'->0->>'text', E'\\n') FROM jsonb_array_elements(${c}->'root'->'children') p
    ) WHERE ${c} IS NOT NULL`)
    await db.execute(sql`ALTER TABLE ${t} DROP COLUMN ${c}`)
    await db.execute(sql`ALTER TABLE ${t} RENAME COLUMN "b61_text_tmp" TO ${c}`)
  }
}
