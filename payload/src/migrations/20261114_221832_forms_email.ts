import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_b61_form_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum_pages_blocks_b61_form_text_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_b61_form_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_form_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_form_card" AS ENUM('none', 'card');
  CREATE TYPE "public"."enum_pages_blocks_b61_form_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_pages_blocks_b61_form_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum_pages_blocks_b61_form_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_form_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_form_text_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_form_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_form_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_form_card" AS ENUM('none', 'card');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_form_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_form_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_form_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum_email_log_status" AS ENUM('sent', 'failed', 'logged');
  CREATE TYPE "public"."enum_email_log_kind" AS ENUM('form', 'test', 'password', 'other');
  CREATE TYPE "public"."enum_forms_blocks_checkbox_width" AS ENUM('100', '50', '33');
  CREATE TYPE "public"."enum_forms_blocks_checkbox_show_is" AS ENUM('equals', 'notEquals', 'filled', 'empty');
  CREATE TYPE "public"."enum_forms_blocks_country_width" AS ENUM('100', '50', '33');
  CREATE TYPE "public"."enum_forms_blocks_country_show_is" AS ENUM('equals', 'notEquals', 'filled', 'empty');
  CREATE TYPE "public"."enum_forms_blocks_email_width" AS ENUM('100', '50', '33');
  CREATE TYPE "public"."enum_forms_blocks_email_show_is" AS ENUM('equals', 'notEquals', 'filled', 'empty');
  CREATE TYPE "public"."enum_forms_blocks_message_show_is" AS ENUM('equals', 'notEquals', 'filled', 'empty');
  CREATE TYPE "public"."enum_forms_blocks_number_width" AS ENUM('100', '50', '33');
  CREATE TYPE "public"."enum_forms_blocks_number_show_is" AS ENUM('equals', 'notEquals', 'filled', 'empty');
  CREATE TYPE "public"."enum_forms_blocks_select_width" AS ENUM('100', '50', '33');
  CREATE TYPE "public"."enum_forms_blocks_select_show_is" AS ENUM('equals', 'notEquals', 'filled', 'empty');
  CREATE TYPE "public"."enum_forms_blocks_state_width" AS ENUM('100', '50', '33');
  CREATE TYPE "public"."enum_forms_blocks_state_show_is" AS ENUM('equals', 'notEquals', 'filled', 'empty');
  CREATE TYPE "public"."enum_forms_blocks_text_width" AS ENUM('100', '50', '33');
  CREATE TYPE "public"."enum_forms_blocks_text_show_is" AS ENUM('equals', 'notEquals', 'filled', 'empty');
  CREATE TYPE "public"."enum_forms_blocks_textarea_width" AS ENUM('100', '50', '33');
  CREATE TYPE "public"."enum_forms_blocks_textarea_show_is" AS ENUM('equals', 'notEquals', 'filled', 'empty');
  CREATE TYPE "public"."enum_forms_blocks_upload_upload_collection" AS ENUM('form-uploads');
  CREATE TYPE "public"."enum_forms_blocks_upload_width" AS ENUM('100', '50', '33');
  CREATE TYPE "public"."enum_forms_blocks_upload_show_is" AS ENUM('equals', 'notEquals', 'filled', 'empty');
  CREATE TYPE "public"."enum_forms_blocks_phone_width" AS ENUM('100', '50', '33');
  CREATE TYPE "public"."enum_forms_blocks_phone_show_is" AS ENUM('equals', 'notEquals', 'filled', 'empty');
  CREATE TYPE "public"."enum_forms_blocks_radio_width" AS ENUM('100', '50', '33');
  CREATE TYPE "public"."enum_forms_blocks_radio_show_is" AS ENUM('equals', 'notEquals', 'filled', 'empty');
  CREATE TYPE "public"."enum_forms_blocks_date_width" AS ENUM('100', '50', '33');
  CREATE TYPE "public"."enum_forms_blocks_date_show_is" AS ENUM('equals', 'notEquals', 'filled', 'empty');
  CREATE TYPE "public"."enum_forms_blocks_signature_width" AS ENUM('100', '50', '33');
  CREATE TYPE "public"."enum_forms_blocks_signature_show_is" AS ENUM('equals', 'notEquals', 'filled', 'empty');
  CREATE TYPE "public"."enum_forms_confirmation_type" AS ENUM('message', 'redirect');
  CREATE TYPE "public"."enum_forms_redirect_type" AS ENUM('reference', 'custom');
  CREATE TABLE "pages_blocks_b61_form_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_form_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_b61_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"eyebrow" varchar,
  	"heading_level" "enum_pages_blocks_b61_form_heading_level" DEFAULT 'auto',
  	"text_align" "enum_pages_blocks_b61_form_text_align" DEFAULT 'left',
  	"width_step" numeric,
  	"pad_top" "enum_pages_blocks_b61_form_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum_pages_blocks_b61_form_pad_bottom" DEFAULT 'normal',
  	"card" "enum_pages_blocks_b61_form_card" DEFAULT 'none',
  	"surface" "enum_pages_blocks_b61_form_surface" DEFAULT 'none',
  	"eyebrow_rule" "enum_pages_blocks_b61_form_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum_pages_blocks_b61_form_entrance" DEFAULT 'on',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_form_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_form_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"eyebrow" varchar,
  	"heading_level" "enum__pages_v_blocks_b61_form_heading_level" DEFAULT 'auto',
  	"text_align" "enum__pages_v_blocks_b61_form_text_align" DEFAULT 'left',
  	"width_step" numeric,
  	"pad_top" "enum__pages_v_blocks_b61_form_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum__pages_v_blocks_b61_form_pad_bottom" DEFAULT 'normal',
  	"card" "enum__pages_v_blocks_b61_form_card" DEFAULT 'none',
  	"surface" "enum__pages_v_blocks_b61_form_surface" DEFAULT 'none',
  	"eyebrow_rule" "enum__pages_v_blocks_b61_form_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum__pages_v_blocks_b61_form_entrance" DEFAULT 'on',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "form_uploads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"school_id" integer,
  	"prefix" varchar DEFAULT 'form-uploads',
  	"_objectkey" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "email_log" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"subject" varchar,
  	"to" varchar,
  	"status" "enum_email_log_status",
  	"kind" "enum_email_log_kind",
  	"detail" varchar,
  	"school_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "forms_blocks_checkbox" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"name" varchar,
  	"default_value" boolean,
  	"help" varchar,
  	"width" "enum_forms_blocks_checkbox_width" DEFAULT '100',
  	"required" boolean,
  	"show_if" varchar,
  	"show_is" "enum_forms_blocks_checkbox_show_is" DEFAULT 'equals',
  	"show_value" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_country" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"name" varchar,
  	"help" varchar,
  	"width" "enum_forms_blocks_country_width" DEFAULT '100',
  	"required" boolean,
  	"show_if" varchar,
  	"show_is" "enum_forms_blocks_country_show_is" DEFAULT 'equals',
  	"show_value" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_email" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"name" varchar,
  	"help" varchar,
  	"width" "enum_forms_blocks_email_width" DEFAULT '100',
  	"required" boolean,
  	"show_if" varchar,
  	"show_is" "enum_forms_blocks_email_show_is" DEFAULT 'equals',
  	"show_value" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_message" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"message" jsonb,
  	"show_if" varchar,
  	"show_is" "enum_forms_blocks_message_show_is" DEFAULT 'equals',
  	"show_value" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_number" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"name" varchar,
  	"default_value" numeric,
  	"help" varchar,
  	"width" "enum_forms_blocks_number_width" DEFAULT '100',
  	"required" boolean,
  	"show_if" varchar,
  	"show_is" "enum_forms_blocks_number_show_is" DEFAULT 'equals',
  	"show_value" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_select_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_select" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"name" varchar,
  	"default_value" varchar,
  	"placeholder" varchar,
  	"help" varchar,
  	"width" "enum_forms_blocks_select_width" DEFAULT '100',
  	"required" boolean,
  	"show_if" varchar,
  	"show_is" "enum_forms_blocks_select_show_is" DEFAULT 'equals',
  	"show_value" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_state" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"name" varchar,
  	"help" varchar,
  	"width" "enum_forms_blocks_state_width" DEFAULT '100',
  	"required" boolean,
  	"show_if" varchar,
  	"show_is" "enum_forms_blocks_state_show_is" DEFAULT 'equals',
  	"show_value" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"name" varchar,
  	"default_value" varchar,
  	"help" varchar,
  	"width" "enum_forms_blocks_text_width" DEFAULT '100',
  	"required" boolean,
  	"show_if" varchar,
  	"show_is" "enum_forms_blocks_text_show_is" DEFAULT 'equals',
  	"show_value" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_textarea" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"name" varchar,
  	"default_value" varchar,
  	"help" varchar,
  	"width" "enum_forms_blocks_textarea_width" DEFAULT '100',
  	"required" boolean,
  	"show_if" varchar,
  	"show_is" "enum_forms_blocks_textarea_show_is" DEFAULT 'equals',
  	"show_value" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_upload_mime_types" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"mime_type" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_upload" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"name" varchar,
  	"upload_collection" "enum_forms_blocks_upload_upload_collection" DEFAULT 'form-uploads' NOT NULL,
  	"max_file_size" numeric DEFAULT 4194304,
  	"multiple" boolean,
  	"help" varchar,
  	"width" "enum_forms_blocks_upload_width" DEFAULT '100',
  	"required" boolean,
  	"show_if" varchar,
  	"show_is" "enum_forms_blocks_upload_show_is" DEFAULT 'equals',
  	"show_value" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_phone" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"name" varchar,
  	"help" varchar,
  	"width" "enum_forms_blocks_phone_width" DEFAULT '100',
  	"required" boolean,
  	"show_if" varchar,
  	"show_is" "enum_forms_blocks_phone_show_is" DEFAULT 'equals',
  	"show_value" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_radio_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "forms_blocks_radio" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"name" varchar,
  	"default_value" varchar,
  	"help" varchar,
  	"width" "enum_forms_blocks_radio_width" DEFAULT '100',
  	"required" boolean,
  	"show_if" varchar,
  	"show_is" "enum_forms_blocks_radio_show_is" DEFAULT 'equals',
  	"show_value" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_date" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"name" varchar,
  	"default_value" timestamp(3) with time zone,
  	"help" varchar,
  	"width" "enum_forms_blocks_date_width" DEFAULT '100',
  	"required" boolean,
  	"show_if" varchar,
  	"show_is" "enum_forms_blocks_date_show_is" DEFAULT 'equals',
  	"show_value" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_blocks_signature" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"name" varchar,
  	"statement" varchar,
  	"help" varchar,
  	"width" "enum_forms_blocks_signature_width" DEFAULT '100',
  	"required" boolean,
  	"show_if" varchar,
  	"show_is" "enum_forms_blocks_signature_show_is" DEFAULT 'equals',
  	"show_value" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "forms_emails" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email_to" varchar,
  	"reply_to" varchar,
  	"cc" varchar,
  	"bcc" varchar,
  	"subject" varchar,
  	"message" jsonb
  );
  
  CREATE TABLE "forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"school_id" integer,
  	"title" varchar NOT NULL,
  	"submit_button_label" varchar,
  	"confirmation_type" "enum_forms_confirmation_type" DEFAULT 'message',
  	"confirmation_message" jsonb,
  	"redirect_type" "enum_forms_redirect_type" DEFAULT 'reference',
  	"redirect_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "forms_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer
  );
  
  CREATE TABLE "form_submissions_submission_data" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "form_submissions_submission_uploads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"field" varchar NOT NULL
  );
  
  CREATE TABLE "form_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"school_id" integer,
  	"summary" varchar,
  	"form_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "form_submissions_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"form_uploads_id" integer
  );
  
  ALTER TABLE "school_settings" ADD COLUMN "form_recipients" varchar;
  ALTER TABLE "school_settings" ADD COLUMN "email_from_name" varchar;
  ALTER TABLE "school_settings" ADD COLUMN "email_reply_to" varchar;
  ALTER TABLE "school_settings" ADD COLUMN "email_from_address" varchar;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_form_recipients" varchar;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_email_from_name" varchar;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_email_reply_to" varchar;
  ALTER TABLE "_school_settings_v" ADD COLUMN "version_email_from_address" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "form_uploads_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "email_log_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "forms_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "form_submissions_id" integer;
  ALTER TABLE "pages_blocks_b61_form_lines" ADD CONSTRAINT "pages_blocks_b61_form_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_form_subheads" ADD CONSTRAINT "pages_blocks_b61_form_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_form" ADD CONSTRAINT "pages_blocks_b61_form_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_form" ADD CONSTRAINT "pages_blocks_b61_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_form_lines" ADD CONSTRAINT "_pages_v_blocks_b61_form_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_form_subheads" ADD CONSTRAINT "_pages_v_blocks_b61_form_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_form" ADD CONSTRAINT "_pages_v_blocks_b61_form_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_form" ADD CONSTRAINT "_pages_v_blocks_b61_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_uploads" ADD CONSTRAINT "form_uploads_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "email_log" ADD CONSTRAINT "email_log_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "forms_blocks_checkbox" ADD CONSTRAINT "forms_blocks_checkbox_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_country" ADD CONSTRAINT "forms_blocks_country_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_email" ADD CONSTRAINT "forms_blocks_email_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_message" ADD CONSTRAINT "forms_blocks_message_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_number" ADD CONSTRAINT "forms_blocks_number_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select_options" ADD CONSTRAINT "forms_blocks_select_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_select"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_select" ADD CONSTRAINT "forms_blocks_select_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_state" ADD CONSTRAINT "forms_blocks_state_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_text" ADD CONSTRAINT "forms_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_textarea" ADD CONSTRAINT "forms_blocks_textarea_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_upload_mime_types" ADD CONSTRAINT "forms_blocks_upload_mime_types_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_upload"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_upload" ADD CONSTRAINT "forms_blocks_upload_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_phone" ADD CONSTRAINT "forms_blocks_phone_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_radio_options" ADD CONSTRAINT "forms_blocks_radio_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_blocks_radio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_radio" ADD CONSTRAINT "forms_blocks_radio_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_date" ADD CONSTRAINT "forms_blocks_date_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_blocks_signature" ADD CONSTRAINT "forms_blocks_signature_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_emails" ADD CONSTRAINT "forms_emails_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms" ADD CONSTRAINT "forms_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "forms_rels" ADD CONSTRAINT "forms_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_rels" ADD CONSTRAINT "forms_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions_submission_data" ADD CONSTRAINT "form_submissions_submission_data_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions_submission_uploads" ADD CONSTRAINT "form_submissions_submission_uploads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "form_submissions_rels" ADD CONSTRAINT "form_submissions_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "form_submissions_rels" ADD CONSTRAINT "form_submissions_rels_form_uploads_fk" FOREIGN KEY ("form_uploads_id") REFERENCES "public"."form_uploads"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_b61_form_lines_order_idx" ON "pages_blocks_b61_form_lines" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_form_lines_parent_id_idx" ON "pages_blocks_b61_form_lines" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_form_subheads_order_idx" ON "pages_blocks_b61_form_subheads" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_form_subheads_parent_id_idx" ON "pages_blocks_b61_form_subheads" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_form_order_idx" ON "pages_blocks_b61_form" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_form_parent_id_idx" ON "pages_blocks_b61_form" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_form_path_idx" ON "pages_blocks_b61_form" USING btree ("_path");
  CREATE INDEX "pages_blocks_b61_form_form_idx" ON "pages_blocks_b61_form" USING btree ("form_id");
  CREATE INDEX "_pages_v_blocks_b61_form_lines_order_idx" ON "_pages_v_blocks_b61_form_lines" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_form_lines_parent_id_idx" ON "_pages_v_blocks_b61_form_lines" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_form_subheads_order_idx" ON "_pages_v_blocks_b61_form_subheads" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_form_subheads_parent_id_idx" ON "_pages_v_blocks_b61_form_subheads" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_form_order_idx" ON "_pages_v_blocks_b61_form" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_form_parent_id_idx" ON "_pages_v_blocks_b61_form" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_form_path_idx" ON "_pages_v_blocks_b61_form" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_b61_form_form_idx" ON "_pages_v_blocks_b61_form" USING btree ("form_id");
  CREATE INDEX "form_uploads_school_idx" ON "form_uploads" USING btree ("school_id");
  CREATE INDEX "form_uploads_updated_at_idx" ON "form_uploads" USING btree ("updated_at");
  CREATE INDEX "form_uploads_created_at_idx" ON "form_uploads" USING btree ("created_at");
  CREATE UNIQUE INDEX "form_uploads_filename_idx" ON "form_uploads" USING btree ("filename");
  CREATE INDEX "email_log_school_idx" ON "email_log" USING btree ("school_id");
  CREATE INDEX "email_log_updated_at_idx" ON "email_log" USING btree ("updated_at");
  CREATE INDEX "email_log_created_at_idx" ON "email_log" USING btree ("created_at");
  CREATE INDEX "forms_blocks_checkbox_order_idx" ON "forms_blocks_checkbox" USING btree ("_order");
  CREATE INDEX "forms_blocks_checkbox_parent_id_idx" ON "forms_blocks_checkbox" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_checkbox_path_idx" ON "forms_blocks_checkbox" USING btree ("_path");
  CREATE INDEX "forms_blocks_country_order_idx" ON "forms_blocks_country" USING btree ("_order");
  CREATE INDEX "forms_blocks_country_parent_id_idx" ON "forms_blocks_country" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_country_path_idx" ON "forms_blocks_country" USING btree ("_path");
  CREATE INDEX "forms_blocks_email_order_idx" ON "forms_blocks_email" USING btree ("_order");
  CREATE INDEX "forms_blocks_email_parent_id_idx" ON "forms_blocks_email" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_email_path_idx" ON "forms_blocks_email" USING btree ("_path");
  CREATE INDEX "forms_blocks_message_order_idx" ON "forms_blocks_message" USING btree ("_order");
  CREATE INDEX "forms_blocks_message_parent_id_idx" ON "forms_blocks_message" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_message_path_idx" ON "forms_blocks_message" USING btree ("_path");
  CREATE INDEX "forms_blocks_number_order_idx" ON "forms_blocks_number" USING btree ("_order");
  CREATE INDEX "forms_blocks_number_parent_id_idx" ON "forms_blocks_number" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_number_path_idx" ON "forms_blocks_number" USING btree ("_path");
  CREATE INDEX "forms_blocks_select_options_order_idx" ON "forms_blocks_select_options" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_options_parent_id_idx" ON "forms_blocks_select_options" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_select_order_idx" ON "forms_blocks_select" USING btree ("_order");
  CREATE INDEX "forms_blocks_select_parent_id_idx" ON "forms_blocks_select" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_select_path_idx" ON "forms_blocks_select" USING btree ("_path");
  CREATE INDEX "forms_blocks_state_order_idx" ON "forms_blocks_state" USING btree ("_order");
  CREATE INDEX "forms_blocks_state_parent_id_idx" ON "forms_blocks_state" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_state_path_idx" ON "forms_blocks_state" USING btree ("_path");
  CREATE INDEX "forms_blocks_text_order_idx" ON "forms_blocks_text" USING btree ("_order");
  CREATE INDEX "forms_blocks_text_parent_id_idx" ON "forms_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_text_path_idx" ON "forms_blocks_text" USING btree ("_path");
  CREATE INDEX "forms_blocks_textarea_order_idx" ON "forms_blocks_textarea" USING btree ("_order");
  CREATE INDEX "forms_blocks_textarea_parent_id_idx" ON "forms_blocks_textarea" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_textarea_path_idx" ON "forms_blocks_textarea" USING btree ("_path");
  CREATE INDEX "forms_blocks_upload_mime_types_order_idx" ON "forms_blocks_upload_mime_types" USING btree ("_order");
  CREATE INDEX "forms_blocks_upload_mime_types_parent_id_idx" ON "forms_blocks_upload_mime_types" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_upload_order_idx" ON "forms_blocks_upload" USING btree ("_order");
  CREATE INDEX "forms_blocks_upload_parent_id_idx" ON "forms_blocks_upload" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_upload_path_idx" ON "forms_blocks_upload" USING btree ("_path");
  CREATE INDEX "forms_blocks_phone_order_idx" ON "forms_blocks_phone" USING btree ("_order");
  CREATE INDEX "forms_blocks_phone_parent_id_idx" ON "forms_blocks_phone" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_phone_path_idx" ON "forms_blocks_phone" USING btree ("_path");
  CREATE INDEX "forms_blocks_radio_options_order_idx" ON "forms_blocks_radio_options" USING btree ("_order");
  CREATE INDEX "forms_blocks_radio_options_parent_id_idx" ON "forms_blocks_radio_options" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_radio_order_idx" ON "forms_blocks_radio" USING btree ("_order");
  CREATE INDEX "forms_blocks_radio_parent_id_idx" ON "forms_blocks_radio" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_radio_path_idx" ON "forms_blocks_radio" USING btree ("_path");
  CREATE INDEX "forms_blocks_date_order_idx" ON "forms_blocks_date" USING btree ("_order");
  CREATE INDEX "forms_blocks_date_parent_id_idx" ON "forms_blocks_date" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_date_path_idx" ON "forms_blocks_date" USING btree ("_path");
  CREATE INDEX "forms_blocks_signature_order_idx" ON "forms_blocks_signature" USING btree ("_order");
  CREATE INDEX "forms_blocks_signature_parent_id_idx" ON "forms_blocks_signature" USING btree ("_parent_id");
  CREATE INDEX "forms_blocks_signature_path_idx" ON "forms_blocks_signature" USING btree ("_path");
  CREATE INDEX "forms_emails_order_idx" ON "forms_emails" USING btree ("_order");
  CREATE INDEX "forms_emails_parent_id_idx" ON "forms_emails" USING btree ("_parent_id");
  CREATE INDEX "forms_school_idx" ON "forms" USING btree ("school_id");
  CREATE INDEX "forms_updated_at_idx" ON "forms" USING btree ("updated_at");
  CREATE INDEX "forms_created_at_idx" ON "forms" USING btree ("created_at");
  CREATE INDEX "forms_rels_order_idx" ON "forms_rels" USING btree ("order");
  CREATE INDEX "forms_rels_parent_idx" ON "forms_rels" USING btree ("parent_id");
  CREATE INDEX "forms_rels_path_idx" ON "forms_rels" USING btree ("path");
  CREATE INDEX "forms_rels_pages_id_idx" ON "forms_rels" USING btree ("pages_id");
  CREATE INDEX "form_submissions_submission_data_order_idx" ON "form_submissions_submission_data" USING btree ("_order");
  CREATE INDEX "form_submissions_submission_data_parent_id_idx" ON "form_submissions_submission_data" USING btree ("_parent_id");
  CREATE INDEX "form_submissions_submission_uploads_order_idx" ON "form_submissions_submission_uploads" USING btree ("_order");
  CREATE INDEX "form_submissions_submission_uploads_parent_id_idx" ON "form_submissions_submission_uploads" USING btree ("_parent_id");
  CREATE INDEX "form_submissions_school_idx" ON "form_submissions" USING btree ("school_id");
  CREATE INDEX "form_submissions_form_idx" ON "form_submissions" USING btree ("form_id");
  CREATE INDEX "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  CREATE INDEX "form_submissions_rels_order_idx" ON "form_submissions_rels" USING btree ("order");
  CREATE INDEX "form_submissions_rels_parent_idx" ON "form_submissions_rels" USING btree ("parent_id");
  CREATE INDEX "form_submissions_rels_path_idx" ON "form_submissions_rels" USING btree ("path");
  CREATE INDEX "form_submissions_rels_form_uploads_id_idx" ON "form_submissions_rels" USING btree ("form_uploads_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_uploads_fk" FOREIGN KEY ("form_uploads_id") REFERENCES "public"."form_uploads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_email_log_fk" FOREIGN KEY ("email_log_id") REFERENCES "public"."email_log"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_fk" FOREIGN KEY ("forms_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_form_uploads_id_idx" ON "payload_locked_documents_rels" USING btree ("form_uploads_id");
  CREATE INDEX "payload_locked_documents_rels_email_log_id_idx" ON "payload_locked_documents_rels" USING btree ("email_log_id");
  CREATE INDEX "payload_locked_documents_rels_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("forms_id");
  CREATE INDEX "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_b61_form_lines" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_b61_form_subheads" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_b61_form" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_b61_form_lines" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_b61_form_subheads" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_b61_form" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "form_uploads" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "email_log" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_checkbox" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_country" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_email" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_message" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_number" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_select_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_select" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_state" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_textarea" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_upload_mime_types" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_upload" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_phone" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_radio_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_radio" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_date" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_blocks_signature" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_emails" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "forms_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "form_submissions_submission_data" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "form_submissions_submission_uploads" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "form_submissions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "form_submissions_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_b61_form_lines" CASCADE;
  DROP TABLE "pages_blocks_b61_form_subheads" CASCADE;
  DROP TABLE "pages_blocks_b61_form" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_form_lines" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_form_subheads" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_form" CASCADE;
  DROP TABLE "form_uploads" CASCADE;
  DROP TABLE "email_log" CASCADE;
  DROP TABLE "forms_blocks_checkbox" CASCADE;
  DROP TABLE "forms_blocks_country" CASCADE;
  DROP TABLE "forms_blocks_email" CASCADE;
  DROP TABLE "forms_blocks_message" CASCADE;
  DROP TABLE "forms_blocks_number" CASCADE;
  DROP TABLE "forms_blocks_select_options" CASCADE;
  DROP TABLE "forms_blocks_select" CASCADE;
  DROP TABLE "forms_blocks_state" CASCADE;
  DROP TABLE "forms_blocks_text" CASCADE;
  DROP TABLE "forms_blocks_textarea" CASCADE;
  DROP TABLE "forms_blocks_upload_mime_types" CASCADE;
  DROP TABLE "forms_blocks_upload" CASCADE;
  DROP TABLE "forms_blocks_phone" CASCADE;
  DROP TABLE "forms_blocks_radio_options" CASCADE;
  DROP TABLE "forms_blocks_radio" CASCADE;
  DROP TABLE "forms_blocks_date" CASCADE;
  DROP TABLE "forms_blocks_signature" CASCADE;
  DROP TABLE "forms_emails" CASCADE;
  DROP TABLE "forms" CASCADE;
  DROP TABLE "forms_rels" CASCADE;
  DROP TABLE "form_submissions_submission_data" CASCADE;
  DROP TABLE "form_submissions_submission_uploads" CASCADE;
  DROP TABLE "form_submissions" CASCADE;
  DROP TABLE "form_submissions_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_form_uploads_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_email_log_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_forms_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_form_submissions_fk";
  
  DROP INDEX "payload_locked_documents_rels_form_uploads_id_idx";
  DROP INDEX "payload_locked_documents_rels_email_log_id_idx";
  DROP INDEX "payload_locked_documents_rels_forms_id_idx";
  DROP INDEX "payload_locked_documents_rels_form_submissions_id_idx";
  ALTER TABLE "school_settings" DROP COLUMN "form_recipients";
  ALTER TABLE "school_settings" DROP COLUMN "email_from_name";
  ALTER TABLE "school_settings" DROP COLUMN "email_reply_to";
  ALTER TABLE "school_settings" DROP COLUMN "email_from_address";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_form_recipients";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_email_from_name";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_email_reply_to";
  ALTER TABLE "_school_settings_v" DROP COLUMN "version_email_from_address";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "form_uploads_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "email_log_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "forms_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "form_submissions_id";
  DROP TYPE "public"."enum_pages_blocks_b61_form_heading_level";
  DROP TYPE "public"."enum_pages_blocks_b61_form_text_align";
  DROP TYPE "public"."enum_pages_blocks_b61_form_pad_top";
  DROP TYPE "public"."enum_pages_blocks_b61_form_pad_bottom";
  DROP TYPE "public"."enum_pages_blocks_b61_form_card";
  DROP TYPE "public"."enum_pages_blocks_b61_form_surface";
  DROP TYPE "public"."enum_pages_blocks_b61_form_eyebrow_rule";
  DROP TYPE "public"."enum_pages_blocks_b61_form_entrance";
  DROP TYPE "public"."enum__pages_v_blocks_b61_form_heading_level";
  DROP TYPE "public"."enum__pages_v_blocks_b61_form_text_align";
  DROP TYPE "public"."enum__pages_v_blocks_b61_form_pad_top";
  DROP TYPE "public"."enum__pages_v_blocks_b61_form_pad_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_b61_form_card";
  DROP TYPE "public"."enum__pages_v_blocks_b61_form_surface";
  DROP TYPE "public"."enum__pages_v_blocks_b61_form_eyebrow_rule";
  DROP TYPE "public"."enum__pages_v_blocks_b61_form_entrance";
  DROP TYPE "public"."enum_email_log_status";
  DROP TYPE "public"."enum_email_log_kind";
  DROP TYPE "public"."enum_forms_blocks_checkbox_width";
  DROP TYPE "public"."enum_forms_blocks_checkbox_show_is";
  DROP TYPE "public"."enum_forms_blocks_country_width";
  DROP TYPE "public"."enum_forms_blocks_country_show_is";
  DROP TYPE "public"."enum_forms_blocks_email_width";
  DROP TYPE "public"."enum_forms_blocks_email_show_is";
  DROP TYPE "public"."enum_forms_blocks_message_show_is";
  DROP TYPE "public"."enum_forms_blocks_number_width";
  DROP TYPE "public"."enum_forms_blocks_number_show_is";
  DROP TYPE "public"."enum_forms_blocks_select_width";
  DROP TYPE "public"."enum_forms_blocks_select_show_is";
  DROP TYPE "public"."enum_forms_blocks_state_width";
  DROP TYPE "public"."enum_forms_blocks_state_show_is";
  DROP TYPE "public"."enum_forms_blocks_text_width";
  DROP TYPE "public"."enum_forms_blocks_text_show_is";
  DROP TYPE "public"."enum_forms_blocks_textarea_width";
  DROP TYPE "public"."enum_forms_blocks_textarea_show_is";
  DROP TYPE "public"."enum_forms_blocks_upload_upload_collection";
  DROP TYPE "public"."enum_forms_blocks_upload_width";
  DROP TYPE "public"."enum_forms_blocks_upload_show_is";
  DROP TYPE "public"."enum_forms_blocks_phone_width";
  DROP TYPE "public"."enum_forms_blocks_phone_show_is";
  DROP TYPE "public"."enum_forms_blocks_radio_width";
  DROP TYPE "public"."enum_forms_blocks_radio_show_is";
  DROP TYPE "public"."enum_forms_blocks_date_width";
  DROP TYPE "public"."enum_forms_blocks_date_show_is";
  DROP TYPE "public"."enum_forms_blocks_signature_width";
  DROP TYPE "public"."enum_forms_blocks_signature_show_is";
  DROP TYPE "public"."enum_forms_confirmation_type";
  DROP TYPE "public"."enum_forms_redirect_type";`)
}
