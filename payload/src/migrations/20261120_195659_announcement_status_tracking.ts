import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "form_submissions" ADD COLUMN "from_announcement_id" integer;
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_from_announcement_id_announcements_id_fk" FOREIGN KEY ("from_announcement_id") REFERENCES "public"."announcements"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "form_submissions_from_announcement_idx" ON "form_submissions" USING btree ("from_announcement_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "form_submissions" DROP CONSTRAINT "form_submissions_from_announcement_id_announcements_id_fk";
  
  DROP INDEX "form_submissions_from_announcement_idx";
  ALTER TABLE "form_submissions" DROP COLUMN "from_announcement_id";`)
}
