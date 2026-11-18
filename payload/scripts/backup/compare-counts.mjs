// Restore test: compares each table's row count in the restored database with
// the live database's counts taken just before and just after the dump. A
// table that changed while the dump ran (a form answer arriving, the email log)
// passes if the restored count is within the two; anything else must match.
//
//   node scripts/backup/compare-counts.mjs before.tsv after.tsv restored.tsv
import { readFileSync } from 'node:fs'

const read = (f) =>
  new Map(
    readFileSync(f, 'utf8')
      .split('\n')
      .filter(Boolean)
      .map((l) => {
        const [t, n] = l.split('\t')
        return [t, Number(n)]
      }),
  )
const [before, after, restored] = process.argv.slice(2, 5).map(read)
const problems = []
let rows = 0
for (const [table, b] of before) {
  const a = after.get(table) ?? b
  const r = restored.get(table)
  if (r === undefined) problems.push(`${table}: missing from the restored database`)
  else if (r < Math.min(a, b) || r > Math.max(a, b)) problems.push(`${table}: live ${b === a ? b : `${b}→${a}`}, restored ${r}`)
  else rows += r
}
for (const table of restored.keys()) if (!before.has(table)) problems.push(`${table}: only in the restored database`)
if (problems.length) {
  console.error(`::error::The restored database doesn't match the live one:\n${problems.join('\n')}`)
  process.exit(1)
}
console.log(`All ${before.size} tables match (${rows} rows)`)
