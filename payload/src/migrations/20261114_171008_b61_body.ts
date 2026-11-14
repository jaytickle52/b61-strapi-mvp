import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import { upgradeBodies } from '../b61/upgrade'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Keep each element's old Content list before its table goes.
  const byBlock = new Map<string, any[]>()
  for (const t of ['split', 'prose', 'cta']) {
    const extra = t === 'prose' ? sql`, "photo_id", "scale", "divider"` : t === 'split' ? sql`, "photo_id"` : sql``
    const rows = ((await db.execute(sql`SELECT "_parent_id" AS parent, "type", "body", "text", "attribution", "icon", "has_link", "link_type", "link_page_id", "link_url", "link_new_tab"${extra} FROM ${sql.raw(`"pages_blocks_b61_${t}_content_blocks"`)} ORDER BY "_parent_id", "_order"`)) as any).rows ?? []
    for (const r of rows) {
      const list = byBlock.get(r.parent) ?? []
      list.push({
        type: r.type ?? 'body',
        body: r.body ?? undefined,
        text: r.text,
        attribution: r.attribution,
        photo: r.photo_id ?? null,
        icon: r.icon,
        hasLink: r.has_link,
        link: { type: r.link_type ?? 'page', page: r.link_page_id, url: r.link_url, newTab: r.link_new_tab },
        scale: r.scale ?? null,
        divider: r.divider ?? false,
      })
      byBlock.set(r.parent, list)
    }
  }

  await db.execute(sql`
   DROP TABLE "pages_blocks_b61_split_content_blocks" CASCADE;
  DROP TABLE "pages_blocks_b61_prose_content_blocks" CASCADE;
  DROP TABLE "pages_blocks_b61_cta_content_blocks" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_split_content_blocks" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_prose_content_blocks" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_cta_content_blocks" CASCADE;
  ALTER TABLE "pages_blocks_b61_split" ADD COLUMN "body" jsonb;
  ALTER TABLE "pages_blocks_b61_prose" ADD COLUMN "body" jsonb;
  ALTER TABLE "pages_blocks_b61_cta" ADD COLUMN "body" jsonb;
  ALTER TABLE "_pages_v_blocks_b61_split" ADD COLUMN "body" jsonb;
  ALTER TABLE "_pages_v_blocks_b61_prose" ADD COLUMN "body" jsonb;
  ALTER TABLE "_pages_v_blocks_b61_cta" ADD COLUMN "body" jsonb;
  DROP TYPE "public"."enum_pages_blocks_b61_split_content_blocks_type";
  DROP TYPE "public"."enum_pages_blocks_b61_split_content_blocks_icon";
  DROP TYPE "public"."enum_pages_blocks_b61_split_content_blocks_link_type";
  DROP TYPE "public"."enum_pages_blocks_b61_prose_content_blocks_type";
  DROP TYPE "public"."enum_pages_blocks_b61_prose_content_blocks_icon";
  DROP TYPE "public"."enum_pages_blocks_b61_prose_content_blocks_link_type";
  DROP TYPE "public"."enum_pages_blocks_b61_prose_content_blocks_scale";
  DROP TYPE "public"."enum_pages_blocks_b61_cta_content_blocks_type";
  DROP TYPE "public"."enum_pages_blocks_b61_cta_content_blocks_icon";
  DROP TYPE "public"."enum_pages_blocks_b61_cta_content_blocks_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_content_blocks_type";
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_content_blocks_icon";
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_content_blocks_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_b61_prose_content_blocks_type";
  DROP TYPE "public"."enum__pages_v_blocks_b61_prose_content_blocks_icon";
  DROP TYPE "public"."enum__pages_v_blocks_b61_prose_content_blocks_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_b61_prose_content_blocks_scale";
  DROP TYPE "public"."enum__pages_v_blocks_b61_cta_content_blocks_type";
  DROP TYPE "public"."enum__pages_v_blocks_b61_cta_content_blocks_icon";
  DROP TYPE "public"."enum__pages_v_blocks_b61_cta_content_blocks_link_type";`)

  await upgradeBodies(payload, req, byBlock)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_b61_split_content_blocks_type" AS ENUM('body', 'emphasis', 'quote', 'iconrow');
  CREATE TYPE "public"."enum_pages_blocks_b61_split_content_blocks_icon" AS ENUM('dot', 'check', 'email', 'phone', 'location', 'calendar', 'clock', 'link', 'star', 'heart', 'book', 'people', 'cross', 'school');
  CREATE TYPE "public"."enum_pages_blocks_b61_split_content_blocks_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum_pages_blocks_b61_prose_content_blocks_type" AS ENUM('body', 'emphasis', 'quote', 'iconrow');
  CREATE TYPE "public"."enum_pages_blocks_b61_prose_content_blocks_icon" AS ENUM('dot', 'check', 'email', 'phone', 'location', 'calendar', 'clock', 'link', 'star', 'heart', 'book', 'people', 'cross', 'school');
  CREATE TYPE "public"."enum_pages_blocks_b61_prose_content_blocks_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum_pages_blocks_b61_prose_content_blocks_scale" AS ENUM('regular', 'display');
  CREATE TYPE "public"."enum_pages_blocks_b61_cta_content_blocks_type" AS ENUM('body', 'emphasis', 'quote', 'iconrow');
  CREATE TYPE "public"."enum_pages_blocks_b61_cta_content_blocks_icon" AS ENUM('dot', 'check', 'email', 'phone', 'location', 'calendar', 'clock', 'link', 'star', 'heart', 'book', 'people', 'cross', 'school');
  CREATE TYPE "public"."enum_pages_blocks_b61_cta_content_blocks_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_content_blocks_type" AS ENUM('body', 'emphasis', 'quote', 'iconrow');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_content_blocks_icon" AS ENUM('dot', 'check', 'email', 'phone', 'location', 'calendar', 'clock', 'link', 'star', 'heart', 'book', 'people', 'cross', 'school');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_content_blocks_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_prose_content_blocks_type" AS ENUM('body', 'emphasis', 'quote', 'iconrow');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_prose_content_blocks_icon" AS ENUM('dot', 'check', 'email', 'phone', 'location', 'calendar', 'clock', 'link', 'star', 'heart', 'book', 'people', 'cross', 'school');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_prose_content_blocks_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_prose_content_blocks_scale" AS ENUM('regular', 'display');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_cta_content_blocks_type" AS ENUM('body', 'emphasis', 'quote', 'iconrow');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_cta_content_blocks_icon" AS ENUM('dot', 'check', 'email', 'phone', 'location', 'calendar', 'clock', 'link', 'star', 'heart', 'book', 'people', 'cross', 'school');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_cta_content_blocks_link_type" AS ENUM('page', 'url');
  CREATE TABLE "pages_blocks_b61_split_content_blocks" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_pages_blocks_b61_split_content_blocks_type" DEFAULT 'body',
  	"body" jsonb,
  	"text" varchar,
  	"attribution" varchar,
  	"photo_id" integer,
  	"icon" "enum_pages_blocks_b61_split_content_blocks_icon" DEFAULT 'dot',
  	"has_link" boolean,
  	"link_type" "enum_pages_blocks_b61_split_content_blocks_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_prose_content_blocks" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_pages_blocks_b61_prose_content_blocks_type" DEFAULT 'body',
  	"body" jsonb,
  	"text" varchar,
  	"attribution" varchar,
  	"photo_id" integer,
  	"icon" "enum_pages_blocks_b61_prose_content_blocks_icon" DEFAULT 'dot',
  	"has_link" boolean,
  	"link_type" "enum_pages_blocks_b61_prose_content_blocks_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"scale" "enum_pages_blocks_b61_prose_content_blocks_scale" DEFAULT 'regular',
  	"divider" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_cta_content_blocks" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_pages_blocks_b61_cta_content_blocks_type" DEFAULT 'body',
  	"body" jsonb,
  	"text" varchar,
  	"attribution" varchar,
  	"icon" "enum_pages_blocks_b61_cta_content_blocks_icon" DEFAULT 'dot',
  	"has_link" boolean,
  	"link_type" "enum_pages_blocks_b61_cta_content_blocks_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean
  );
  
  CREATE TABLE "_pages_v_blocks_b61_split_content_blocks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum__pages_v_blocks_b61_split_content_blocks_type" DEFAULT 'body',
  	"body" jsonb,
  	"text" varchar,
  	"attribution" varchar,
  	"photo_id" integer,
  	"icon" "enum__pages_v_blocks_b61_split_content_blocks_icon" DEFAULT 'dot',
  	"has_link" boolean,
  	"link_type" "enum__pages_v_blocks_b61_split_content_blocks_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_prose_content_blocks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum__pages_v_blocks_b61_prose_content_blocks_type" DEFAULT 'body',
  	"body" jsonb,
  	"text" varchar,
  	"attribution" varchar,
  	"photo_id" integer,
  	"icon" "enum__pages_v_blocks_b61_prose_content_blocks_icon" DEFAULT 'dot',
  	"has_link" boolean,
  	"link_type" "enum__pages_v_blocks_b61_prose_content_blocks_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"scale" "enum__pages_v_blocks_b61_prose_content_blocks_scale" DEFAULT 'regular',
  	"divider" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_cta_content_blocks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum__pages_v_blocks_b61_cta_content_blocks_type" DEFAULT 'body',
  	"body" jsonb,
  	"text" varchar,
  	"attribution" varchar,
  	"icon" "enum__pages_v_blocks_b61_cta_content_blocks_icon" DEFAULT 'dot',
  	"has_link" boolean,
  	"link_type" "enum__pages_v_blocks_b61_cta_content_blocks_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"_uuid" varchar
  );
  
  ALTER TABLE "pages_blocks_b61_split_content_blocks" ADD CONSTRAINT "pages_blocks_b61_split_content_blocks_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_split_content_blocks" ADD CONSTRAINT "pages_blocks_b61_split_content_blocks_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_split_content_blocks" ADD CONSTRAINT "pages_blocks_b61_split_content_blocks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_prose_content_blocks" ADD CONSTRAINT "pages_blocks_b61_prose_content_blocks_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_prose_content_blocks" ADD CONSTRAINT "pages_blocks_b61_prose_content_blocks_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_prose_content_blocks" ADD CONSTRAINT "pages_blocks_b61_prose_content_blocks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_prose"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_cta_content_blocks" ADD CONSTRAINT "pages_blocks_b61_cta_content_blocks_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_cta_content_blocks" ADD CONSTRAINT "pages_blocks_b61_cta_content_blocks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_split_content_blocks" ADD CONSTRAINT "_pages_v_blocks_b61_split_content_blocks_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_split_content_blocks" ADD CONSTRAINT "_pages_v_blocks_b61_split_content_blocks_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_split_content_blocks" ADD CONSTRAINT "_pages_v_blocks_b61_split_content_blocks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_prose_content_blocks" ADD CONSTRAINT "_pages_v_blocks_b61_prose_content_blocks_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_prose_content_blocks" ADD CONSTRAINT "_pages_v_blocks_b61_prose_content_blocks_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_prose_content_blocks" ADD CONSTRAINT "_pages_v_blocks_b61_prose_content_blocks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_prose"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_cta_content_blocks" ADD CONSTRAINT "_pages_v_blocks_b61_cta_content_blocks_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_cta_content_blocks" ADD CONSTRAINT "_pages_v_blocks_b61_cta_content_blocks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_cta"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_b61_split_content_blocks_order_idx" ON "pages_blocks_b61_split_content_blocks" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_split_content_blocks_parent_id_idx" ON "pages_blocks_b61_split_content_blocks" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_split_content_blocks_photo_idx" ON "pages_blocks_b61_split_content_blocks" USING btree ("photo_id");
  CREATE INDEX "pages_blocks_b61_split_content_blocks_link_link_page_idx" ON "pages_blocks_b61_split_content_blocks" USING btree ("link_page_id");
  CREATE INDEX "pages_blocks_b61_prose_content_blocks_order_idx" ON "pages_blocks_b61_prose_content_blocks" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_prose_content_blocks_parent_id_idx" ON "pages_blocks_b61_prose_content_blocks" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_prose_content_blocks_photo_idx" ON "pages_blocks_b61_prose_content_blocks" USING btree ("photo_id");
  CREATE INDEX "pages_blocks_b61_prose_content_blocks_link_link_page_idx" ON "pages_blocks_b61_prose_content_blocks" USING btree ("link_page_id");
  CREATE INDEX "pages_blocks_b61_cta_content_blocks_order_idx" ON "pages_blocks_b61_cta_content_blocks" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_cta_content_blocks_parent_id_idx" ON "pages_blocks_b61_cta_content_blocks" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_cta_content_blocks_link_link_page_idx" ON "pages_blocks_b61_cta_content_blocks" USING btree ("link_page_id");
  CREATE INDEX "_pages_v_blocks_b61_split_content_blocks_order_idx" ON "_pages_v_blocks_b61_split_content_blocks" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_split_content_blocks_parent_id_idx" ON "_pages_v_blocks_b61_split_content_blocks" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_split_content_blocks_photo_idx" ON "_pages_v_blocks_b61_split_content_blocks" USING btree ("photo_id");
  CREATE INDEX "_pages_v_blocks_b61_split_content_blocks_link_link_page_idx" ON "_pages_v_blocks_b61_split_content_blocks" USING btree ("link_page_id");
  CREATE INDEX "_pages_v_blocks_b61_prose_content_blocks_order_idx" ON "_pages_v_blocks_b61_prose_content_blocks" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_prose_content_blocks_parent_id_idx" ON "_pages_v_blocks_b61_prose_content_blocks" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_prose_content_blocks_photo_idx" ON "_pages_v_blocks_b61_prose_content_blocks" USING btree ("photo_id");
  CREATE INDEX "_pages_v_blocks_b61_prose_content_blocks_link_link_page_idx" ON "_pages_v_blocks_b61_prose_content_blocks" USING btree ("link_page_id");
  CREATE INDEX "_pages_v_blocks_b61_cta_content_blocks_order_idx" ON "_pages_v_blocks_b61_cta_content_blocks" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_cta_content_blocks_parent_id_idx" ON "_pages_v_blocks_b61_cta_content_blocks" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_cta_content_blocks_link_link_page_idx" ON "_pages_v_blocks_b61_cta_content_blocks" USING btree ("link_page_id");
  ALTER TABLE "pages_blocks_b61_split" DROP COLUMN "body";
  ALTER TABLE "pages_blocks_b61_prose" DROP COLUMN "body";
  ALTER TABLE "pages_blocks_b61_cta" DROP COLUMN "body";
  ALTER TABLE "_pages_v_blocks_b61_split" DROP COLUMN "body";
  ALTER TABLE "_pages_v_blocks_b61_prose" DROP COLUMN "body";
  ALTER TABLE "_pages_v_blocks_b61_cta" DROP COLUMN "body";`)
}
