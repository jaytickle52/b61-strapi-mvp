import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Hero > Changing words becomes one text box ("Learning, Missions"). Words already
  // entered as a list (only on preview copies of the wake-patterns branch) are carried over.
  await db.execute(sql`
  ALTER TABLE "pages_blocks_b61_hero" ADD COLUMN "changing_words" varchar;
  ALTER TABLE "_pages_v_blocks_b61_hero" ADD COLUMN "changing_words" varchar;
  UPDATE "pages_blocks_b61_hero" h SET "changing_words" = (
    SELECT string_agg(w."text", ', ' ORDER BY w."_order") FROM "pages_blocks_b61_hero_changing_words" w WHERE w."_parent_id" = h."id"
  );
  UPDATE "_pages_v_blocks_b61_hero" h SET "changing_words" = (
    SELECT string_agg(w."text", ', ' ORDER BY w."_order") FROM "_pages_v_blocks_b61_hero_changing_words" w WHERE w."_parent_id" = h."id"
  );
  DROP TABLE "pages_blocks_b61_hero_changing_words" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_hero_changing_words" CASCADE;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_b61_hero_changing_words" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_hero_changing_words" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "pages_blocks_b61_hero_changing_words" ADD CONSTRAINT "pages_blocks_b61_hero_changing_words_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_hero_changing_words" ADD CONSTRAINT "_pages_v_blocks_b61_hero_changing_words_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_hero"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_b61_hero_changing_words_order_idx" ON "pages_blocks_b61_hero_changing_words" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_hero_changing_words_parent_id_idx" ON "pages_blocks_b61_hero_changing_words" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_hero_changing_words_order_idx" ON "_pages_v_blocks_b61_hero_changing_words" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_hero_changing_words_parent_id_idx" ON "_pages_v_blocks_b61_hero_changing_words" USING btree ("_parent_id");
  ALTER TABLE "pages_blocks_b61_hero" DROP COLUMN "changing_words";
  ALTER TABLE "_pages_v_blocks_b61_hero" DROP COLUMN "changing_words";`)
}
