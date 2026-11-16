import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_b61_logos_logos_link_type" AS ENUM('page', 'document', 'url');
  CREATE TYPE "public"."enum_pages_blocks_b61_logos_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum_pages_blocks_b61_logos_motion" AS ENUM('still', 'scroll');
  CREATE TYPE "public"."enum_pages_blocks_b61_logos_heading_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_b61_logos_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_logos_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_logos_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_pages_blocks_b61_logos_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum_pages_blocks_b61_logos_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_logos_logos_link_type" AS ENUM('page', 'document', 'url');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_logos_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_logos_motion" AS ENUM('still', 'scroll');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_logos_heading_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_logos_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_logos_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_logos_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_logos_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_logos_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum_school_settings_accent_font" AS ENUM('Fraunces', 'Playfair Display', 'Merriweather', 'EB Garamond', 'Lora', 'Libre Baskerville', 'Cormorant Garamond', 'Crimson Pro', 'Roboto Slab', 'Montserrat', 'Poppins', 'Inter', 'Source Sans 3', 'Lato', 'Open Sans', 'Raleway', 'Nunito Sans', 'Work Sans', 'DM Sans', 'Roboto', 'Josefin Sans', 'Oswald');
  CREATE TYPE "public"."enum__school_settings_v_version_accent_font" AS ENUM('Fraunces', 'Playfair Display', 'Merriweather', 'EB Garamond', 'Lora', 'Libre Baskerville', 'Cormorant Garamond', 'Crimson Pro', 'Roboto Slab', 'Montserrat', 'Poppins', 'Inter', 'Source Sans 3', 'Lato', 'Open Sans', 'Raleway', 'Nunito Sans', 'Work Sans', 'DM Sans', 'Roboto', 'Josefin Sans', 'Oswald');
  CREATE TABLE "pages_blocks_b61_logos_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_logos_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_b61_logos_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"link_type" "enum_pages_blocks_b61_logos_logos_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_document_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading_level" "enum_pages_blocks_b61_logos_heading_level" DEFAULT 'auto',
  	"motion" "enum_pages_blocks_b61_logos_motion" DEFAULT 'still',
  	"heading_align" "enum_pages_blocks_b61_logos_heading_align" DEFAULT 'left',
  	"logo_step" numeric,
  	"pad_top" "enum_pages_blocks_b61_logos_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum_pages_blocks_b61_logos_pad_bottom" DEFAULT 'normal',
  	"surface" "enum_pages_blocks_b61_logos_surface" DEFAULT 'none',
  	"one_colour" boolean,
  	"eyebrow_rule" "enum_pages_blocks_b61_logos_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum_pages_blocks_b61_logos_entrance" DEFAULT 'on',
  	"css_class" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_logos_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_logos_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_logos_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"link_type" "enum__pages_v_blocks_b61_logos_logos_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_document_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading_level" "enum__pages_v_blocks_b61_logos_heading_level" DEFAULT 'auto',
  	"motion" "enum__pages_v_blocks_b61_logos_motion" DEFAULT 'still',
  	"heading_align" "enum__pages_v_blocks_b61_logos_heading_align" DEFAULT 'left',
  	"logo_step" numeric,
  	"pad_top" "enum__pages_v_blocks_b61_logos_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum__pages_v_blocks_b61_logos_pad_bottom" DEFAULT 'normal',
  	"surface" "enum__pages_v_blocks_b61_logos_surface" DEFAULT 'none',
  	"one_colour" boolean,
  	"eyebrow_rule" "enum__pages_v_blocks_b61_logos_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum__pages_v_blocks_b61_logos_entrance" DEFAULT 'on',
  	"css_class" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_b61_card_grid" ADD COLUMN "feature_middle" boolean;
  ALTER TABLE "pages_blocks_b61_card_grid" ADD COLUMN "duotone" boolean;
  ALTER TABLE "pages_blocks_b61_gallery" ADD COLUMN "duotone" boolean;
  ALTER TABLE "pages_blocks_b61_pillars" ADD COLUMN "scroll_story" boolean;
  ALTER TABLE "_pages_v_blocks_b61_card_grid" ADD COLUMN "feature_middle" boolean;
  ALTER TABLE "_pages_v_blocks_b61_card_grid" ADD COLUMN "duotone" boolean;
  ALTER TABLE "_pages_v_blocks_b61_gallery" ADD COLUMN "duotone" boolean;
  ALTER TABLE "_pages_v_blocks_b61_pillars" ADD COLUMN "scroll_story" boolean;
  ALTER TABLE "school_settings" ADD COLUMN "accent_font" "enum_school_settings_accent_font";
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_accent_font" "enum__school_settings_v_version_accent_font";
  ALTER TABLE "pages_blocks_b61_logos_lines" ADD CONSTRAINT "pages_blocks_b61_logos_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_logos_subheads" ADD CONSTRAINT "pages_blocks_b61_logos_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_logos_logos" ADD CONSTRAINT "pages_blocks_b61_logos_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_logos_logos" ADD CONSTRAINT "pages_blocks_b61_logos_logos_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_logos_logos" ADD CONSTRAINT "pages_blocks_b61_logos_logos_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_logos_logos" ADD CONSTRAINT "pages_blocks_b61_logos_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_logos" ADD CONSTRAINT "pages_blocks_b61_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_logos_lines" ADD CONSTRAINT "_pages_v_blocks_b61_logos_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_logos_subheads" ADD CONSTRAINT "_pages_v_blocks_b61_logos_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_logos_logos" ADD CONSTRAINT "_pages_v_blocks_b61_logos_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_logos_logos" ADD CONSTRAINT "_pages_v_blocks_b61_logos_logos_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_logos_logos" ADD CONSTRAINT "_pages_v_blocks_b61_logos_logos_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_logos_logos" ADD CONSTRAINT "_pages_v_blocks_b61_logos_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_logos" ADD CONSTRAINT "_pages_v_blocks_b61_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_b61_logos_lines_order_idx" ON "pages_blocks_b61_logos_lines" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_logos_lines_parent_id_idx" ON "pages_blocks_b61_logos_lines" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_logos_subheads_order_idx" ON "pages_blocks_b61_logos_subheads" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_logos_subheads_parent_id_idx" ON "pages_blocks_b61_logos_subheads" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_logos_logos_order_idx" ON "pages_blocks_b61_logos_logos" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_logos_logos_parent_id_idx" ON "pages_blocks_b61_logos_logos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_logos_logos_image_idx" ON "pages_blocks_b61_logos_logos" USING btree ("image_id");
  CREATE INDEX "pages_blocks_b61_logos_logos_link_link_page_idx" ON "pages_blocks_b61_logos_logos" USING btree ("link_page_id");
  CREATE INDEX "pages_blocks_b61_logos_logos_link_link_document_idx" ON "pages_blocks_b61_logos_logos" USING btree ("link_document_id");
  CREATE INDEX "pages_blocks_b61_logos_order_idx" ON "pages_blocks_b61_logos" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_logos_parent_id_idx" ON "pages_blocks_b61_logos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_logos_path_idx" ON "pages_blocks_b61_logos" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_b61_logos_lines_order_idx" ON "_pages_v_blocks_b61_logos_lines" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_logos_lines_parent_id_idx" ON "_pages_v_blocks_b61_logos_lines" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_logos_subheads_order_idx" ON "_pages_v_blocks_b61_logos_subheads" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_logos_subheads_parent_id_idx" ON "_pages_v_blocks_b61_logos_subheads" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_logos_logos_order_idx" ON "_pages_v_blocks_b61_logos_logos" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_logos_logos_parent_id_idx" ON "_pages_v_blocks_b61_logos_logos" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_logos_logos_image_idx" ON "_pages_v_blocks_b61_logos_logos" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_b61_logos_logos_link_link_page_idx" ON "_pages_v_blocks_b61_logos_logos" USING btree ("link_page_id");
  CREATE INDEX "_pages_v_blocks_b61_logos_logos_link_link_document_idx" ON "_pages_v_blocks_b61_logos_logos" USING btree ("link_document_id");
  CREATE INDEX "_pages_v_blocks_b61_logos_order_idx" ON "_pages_v_blocks_b61_logos" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_logos_parent_id_idx" ON "_pages_v_blocks_b61_logos" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_logos_path_idx" ON "_pages_v_blocks_b61_logos" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_b61_logos_lines" CASCADE;
  DROP TABLE "pages_blocks_b61_logos_subheads" CASCADE;
  DROP TABLE "pages_blocks_b61_logos_logos" CASCADE;
  DROP TABLE "pages_blocks_b61_logos" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_logos_lines" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_logos_subheads" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_logos_logos" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_logos" CASCADE;
  ALTER TABLE "pages_blocks_b61_card_grid" DROP COLUMN "feature_middle";
  ALTER TABLE "pages_blocks_b61_card_grid" DROP COLUMN "duotone";
  ALTER TABLE "pages_blocks_b61_gallery" DROP COLUMN "duotone";
  ALTER TABLE "pages_blocks_b61_pillars" DROP COLUMN "scroll_story";
  ALTER TABLE "_pages_v_blocks_b61_card_grid" DROP COLUMN "feature_middle";
  ALTER TABLE "_pages_v_blocks_b61_card_grid" DROP COLUMN "duotone";
  ALTER TABLE "_pages_v_blocks_b61_gallery" DROP COLUMN "duotone";
  ALTER TABLE "_pages_v_blocks_b61_pillars" DROP COLUMN "scroll_story";
  ALTER TABLE "school_settings" DROP COLUMN "accent_font";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_accent_font";
  DROP TYPE "public"."enum_pages_blocks_b61_logos_logos_link_type";
  DROP TYPE "public"."enum_pages_blocks_b61_logos_heading_level";
  DROP TYPE "public"."enum_pages_blocks_b61_logos_motion";
  DROP TYPE "public"."enum_pages_blocks_b61_logos_heading_align";
  DROP TYPE "public"."enum_pages_blocks_b61_logos_pad_top";
  DROP TYPE "public"."enum_pages_blocks_b61_logos_pad_bottom";
  DROP TYPE "public"."enum_pages_blocks_b61_logos_surface";
  DROP TYPE "public"."enum_pages_blocks_b61_logos_eyebrow_rule";
  DROP TYPE "public"."enum_pages_blocks_b61_logos_entrance";
  DROP TYPE "public"."enum__pages_v_blocks_b61_logos_logos_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_b61_logos_heading_level";
  DROP TYPE "public"."enum__pages_v_blocks_b61_logos_motion";
  DROP TYPE "public"."enum__pages_v_blocks_b61_logos_heading_align";
  DROP TYPE "public"."enum__pages_v_blocks_b61_logos_pad_top";
  DROP TYPE "public"."enum__pages_v_blocks_b61_logos_pad_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_b61_logos_surface";
  DROP TYPE "public"."enum__pages_v_blocks_b61_logos_eyebrow_rule";
  DROP TYPE "public"."enum__pages_v_blocks_b61_logos_entrance";
  DROP TYPE "public"."enum_school_settings_accent_font";
  DROP TYPE "public"."enum__school_settings_v_version_accent_font";`)
}
