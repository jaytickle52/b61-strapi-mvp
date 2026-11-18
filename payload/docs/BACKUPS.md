# Backups and restore

Two layers protect the school sites' content.

| Layer | Covers | How far back | Where |
|---|---|---|---|
| Neon instant restore | The database | 6 hours on the Free plan (1 to 7 days on Launch) | Neon console |
| Nightly backup (this repo) | The database **and** every Vercel Blob file (photos, documents, form uploads) | 30 days; each Sunday's copy 90 days | GitHub > Actions > "Payload backup" > a run > Artifacts |

Neon's own restore is fastest for "someone deleted something an hour ago". The
nightly backup covers everything else: a mistake noticed days later, losing the
Neon project or the Blob store, or leaving either provider.

## How the nightly backup works

`.github/workflows/payload-backup.yml` runs every night at 2:17 AM Eastern
(and whenever you press **Run workflow**):

1. **Backup.** Dumps the live database (`pg_dump`, Postgres 18 tools), records
   each table's row count, copies every Blob file with a checksum list
   (`scripts/backup/blob-download.mjs`), then encrypts both parts with
   `BACKUP_PASSPHRASE` (AES-256). Two files are kept as the run's artifact
   `b61-backup-<date>`: `b61-db-<date>.tar.gpg` and `b61-blob-<date>.tar.gpg`.
   The repo is public, so anyone signed in to GitHub can download these files;
   without the passphrase they're unreadable. Nothing secret is printed in the log.
2. **Restore test, every night.** A second job decrypts that backup, restores
   the database into an empty Postgres and fails unless every table has exactly
   the row count the live database had, and every Blob file matches its
   checksum (`scripts/backup/blob-verify.mjs`).
3. **Full restore test, Sundays** (or **Run workflow** with "full check"). It
   also builds the site on the restored data, adds a throwaway admin inside
   that test database (`src/scripts/restore-check-admin.ts`) and loads every
   school's published pages and the editor (`scripts/smoke.mjs`). Scheduled
   jobs and emails are switched off in that copy (`B61_JOBS_OFF`,
   `EMAIL_PREVIEW_DIR`).

A red run means the backup or its restore test failed. GitHub emails a failed
scheduled run to the person who last changed the workflow's schedule; check
your GitHub notification settings (Settings > Notifications > Actions) so those
emails reach you.

GitHub pauses scheduled workflows in a public repo after 60 days with no
commits. If the repo goes quiet that long, re-enable "Payload backup" under
Actions.

## One-time setup (Jay)

In GitHub: the repo > Settings > Secrets and variables > Actions > New
repository secret. Add three:

| Secret | Where to get it |
|---|---|
| `BACKUP_DATABASE_URL` | Neon console > the b61-schools project > **Connect** > production branch, with **Connection pooling off**, copy the address. (Vercel marks the integration's variables as sensitive, so it can't show them.) |
| `BACKUP_BLOB_TOKEN` | Vercel > Storage > the b61-schools Blob store > its **.env.local** / Quickstart snippet shows `BLOB_READ_WRITE_TOKEN`; copy the value. A read/write token is needed because the backup lists the store. |
| `BACKUP_PASSPHRASE` | Make a long random passphrase in the password manager and save it there first. **Without it no backup can ever be opened.** |

Then Actions > Payload backup > Run workflow, tick "full check", and confirm
both jobs go green. Until the secrets exist the backup skips itself with a
warning.

If the Neon password or the Blob token is ever rotated, update the matching
secret too, or the next night's backup fails (and emails you).

## Restoring

Always restore into a **new** place first, check it, then switch. Never write
over the live database until you know the copy is right.

### Recent mistake (inside Neon's window)

Neon console > the project > Branches > production > Restore, pick a time just
before the mistake. Neon keeps the pre-restore state as a backup branch. On the
Free plan this reaches back 6 hours.

### From a nightly backup

You need: the artifact from the night you want, the passphrase, and Postgres 18
tools (`pg_restore`, `psql`) on the machine doing the restore. A Claude session
can do steps 1 to 4 if you paste the passphrase and addresses when asked.

1. Download the artifact from the run and unzip it.
2. Decrypt:
   ```
   gpg -d b61-db-<date>.tar.gpg   | tar -x -C db/
   gpg -d b61-blob-<date>.tar.gpg | tar -x -C blob/
   ```
3. Database: in Neon create a new branch or database (for example `restore-<date>`),
   then
   ```
   pg_restore --dbname="<its address>" --no-owner --no-acl --exit-on-error db/database.dump
   ```
   Check it: point a Vercel preview at it, or compare `db/counts.tsv` with
   `psql "<address>" -At -f scripts/backup/table-counts.sql`.
4. Files: only if Blob files were lost. With the store's token:
   ```
   BLOB_READ_WRITE_TOKEN=... node scripts/backup/blob-restore.mjs blob/
   ```
   It uploads each file back to its original path and skips files already
   there (set `OVERWRITE=true` to replace them). Photos keep their addresses
   when restored into the same store. Restoring into a new store changes the
   store's web address, so Media and Documents rows would need their URLs
   updated: ask for help before doing that.
5. Switch: make the restored branch Neon's production branch (or update
   `DATABASE_URL` / `DATABASE_URL_UNPOOLED` in Vercel), then redeploy.

## Notes

- Size: the backup copies every Blob file every night. That's fine at today's
  size. When the photo library grows past a few GB, move the files part to a
  bucket that syncs only new files (Cloudflare R2 or similar).
- Preview deploys use their own Neon branch and are not backed up.
- The restore test's copy of live data exists only inside that GitHub job and
  is deleted when the job ends.
