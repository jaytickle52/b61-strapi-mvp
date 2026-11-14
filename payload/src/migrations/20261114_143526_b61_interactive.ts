import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_b61_accordion_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum_pages_blocks_b61_accordion_buttons_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum_pages_blocks_b61_accordion_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum_pages_blocks_b61_accordion_heading_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_b61_accordion_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_accordion_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_accordion_item_style" AS ENUM('divided', 'boxed', 'separated');
  CREATE TYPE "public"."enum_pages_blocks_b61_accordion_icon_style" AS ENUM('chevron', 'plusminus');
  CREATE TYPE "public"."enum_pages_blocks_b61_accordion_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_pages_blocks_b61_accordion_item_surface" AS ENUM('card', 'light', 'soft', 'dark', 'accent', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_b61_accordion_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum_pages_blocks_b61_accordion_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum_pages_blocks_b61_pillars_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum_pages_blocks_b61_pillars_tab_position" AS ENUM('left', 'right', 'top');
  CREATE TYPE "public"."enum_pages_blocks_b61_pillars_tab_align" AS ENUM('left', 'center', 'full');
  CREATE TYPE "public"."enum_pages_blocks_b61_pillars_heading_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_b61_pillars_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_pillars_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_pillars_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_pages_blocks_b61_pillars_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum_pages_blocks_b61_pillars_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum_pages_blocks_b61_tabs_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum_pages_blocks_b61_tabs_tab_position" AS ENUM('top', 'left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_b61_tabs_tab_align" AS ENUM('left', 'center', 'full');
  CREATE TYPE "public"."enum_pages_blocks_b61_tabs_heading_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_b61_tabs_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_tabs_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_tabs_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_pages_blocks_b61_tabs_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum_pages_blocks_b61_tabs_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum_pages_blocks_b61_carousel_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum_pages_blocks_b61_carousel_per_view" AS ENUM('1', '2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_b61_carousel_heading_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_b61_carousel_advance" AS ENUM('one', 'view');
  CREATE TYPE "public"."enum_pages_blocks_b61_carousel_peek" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_pages_blocks_b61_carousel_controls_position" AS ENUM('top-right', 'bottom-left', 'bottom-center', 'bottom-right', 'sides', 'hidden');
  CREATE TYPE "public"."enum_pages_blocks_b61_carousel_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_carousel_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_carousel_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_pages_blocks_b61_carousel_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum_pages_blocks_b61_carousel_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum_pages_blocks_b61_rail_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum_pages_blocks_b61_rail_buttons_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum_pages_blocks_b61_rail_links_icon" AS ENUM('arrow', 'check', 'email', 'phone', 'location', 'calendar', 'clock', 'link', 'star', 'heart', 'book', 'people', 'cross', 'school');
  CREATE TYPE "public"."enum_pages_blocks_b61_rail_links_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum_pages_blocks_b61_rail_actions_position" AS ENUM('top', 'bottom');
  CREATE TYPE "public"."enum_pages_blocks_b61_rail_surface" AS ENUM('plain', 'soft', 'dark', 'accent', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_section_columns" AS ENUM('full', 'rail-right', 'rail-left');
  CREATE TYPE "public"."enum_pages_blocks_b61_section_rail_align" AS ENUM('start', 'center');
  CREATE TYPE "public"."enum_pages_blocks_b61_section_rail_stack" AS ENUM('source', 'rail-first', 'rail-last');
  CREATE TYPE "public"."enum_pages_blocks_b61_section_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_section_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_section_surface" AS ENUM('none', 'plain', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_pages_blocks_b61_section_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_accordion_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_accordion_buttons_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_accordion_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_accordion_heading_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_accordion_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_accordion_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_accordion_item_style" AS ENUM('divided', 'boxed', 'separated');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_accordion_icon_style" AS ENUM('chevron', 'plusminus');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_accordion_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_accordion_item_surface" AS ENUM('card', 'light', 'soft', 'dark', 'accent', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_accordion_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_accordion_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_pillars_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_pillars_tab_position" AS ENUM('left', 'right', 'top');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_pillars_tab_align" AS ENUM('left', 'center', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_pillars_heading_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_pillars_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_pillars_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_pillars_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_pillars_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_pillars_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_tabs_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_tabs_tab_position" AS ENUM('top', 'left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_tabs_tab_align" AS ENUM('left', 'center', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_tabs_heading_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_tabs_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_tabs_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_tabs_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_tabs_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_tabs_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_carousel_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_carousel_per_view" AS ENUM('1', '2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_carousel_heading_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_carousel_advance" AS ENUM('one', 'view');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_carousel_peek" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_carousel_controls_position" AS ENUM('top-right', 'bottom-left', 'bottom-center', 'bottom-right', 'sides', 'hidden');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_carousel_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_carousel_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_carousel_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_carousel_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_carousel_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_rail_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_rail_buttons_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_rail_links_icon" AS ENUM('arrow', 'check', 'email', 'phone', 'location', 'calendar', 'clock', 'link', 'star', 'heart', 'book', 'people', 'cross', 'school');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_rail_links_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_rail_actions_position" AS ENUM('top', 'bottom');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_rail_surface" AS ENUM('plain', 'soft', 'dark', 'accent', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_section_columns" AS ENUM('full', 'rail-right', 'rail-left');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_section_rail_align" AS ENUM('start', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_section_rail_stack" AS ENUM('source', 'rail-first', 'rail-last');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_section_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_section_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_section_surface" AS ENUM('none', 'plain', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_section_entrance" AS ENUM('on', 'off');
  CREATE TABLE "pages_blocks_b61_accordion_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_accordion_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_b61_accordion_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"body" jsonb
  );
  
  CREATE TABLE "pages_blocks_b61_accordion_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum_pages_blocks_b61_accordion_buttons_variant" DEFAULT 'primary',
  	"link_type" "enum_pages_blocks_b61_accordion_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"full_width" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_accordion" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading_level" "enum_pages_blocks_b61_accordion_heading_level" DEFAULT 'auto',
  	"intro" jsonb,
  	"heading_align" "enum_pages_blocks_b61_accordion_heading_align" DEFAULT 'left',
  	"width_step" numeric,
  	"pad_top" "enum_pages_blocks_b61_accordion_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum_pages_blocks_b61_accordion_pad_bottom" DEFAULT 'normal',
  	"item_style" "enum_pages_blocks_b61_accordion_item_style" DEFAULT 'divided',
  	"icon_style" "enum_pages_blocks_b61_accordion_icon_style" DEFAULT 'chevron',
  	"single_open" boolean DEFAULT true,
  	"first_item_open" boolean DEFAULT true,
  	"show_numbers" boolean DEFAULT true,
  	"surface" "enum_pages_blocks_b61_accordion_surface" DEFAULT 'none',
  	"item_surface" "enum_pages_blocks_b61_accordion_item_surface" DEFAULT 'card',
  	"eyebrow_rule" "enum_pages_blocks_b61_accordion_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum_pages_blocks_b61_accordion_entrance" DEFAULT 'on',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_b61_tabs_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_tabs_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_b61_pillars_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_pillars_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_b61_pillars_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" jsonb,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_b61_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading_level" "enum_pages_blocks_b61_pillars_heading_level" DEFAULT 'auto',
  	"intro" jsonb,
  	"first_item_open" boolean DEFAULT true,
  	"tab_position" "enum_pages_blocks_b61_pillars_tab_position" DEFAULT 'left',
  	"tab_align" "enum_pages_blocks_b61_pillars_tab_align" DEFAULT 'left',
  	"heading_align" "enum_pages_blocks_b61_pillars_heading_align" DEFAULT 'left',
  	"pad_top" "enum_pages_blocks_b61_pillars_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum_pages_blocks_b61_pillars_pad_bottom" DEFAULT 'normal',
  	"surface" "enum_pages_blocks_b61_pillars_surface" DEFAULT 'none',
  	"eyebrow_rule" "enum_pages_blocks_b61_pillars_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum_pages_blocks_b61_pillars_entrance" DEFAULT 'on',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_b61_tabs_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_b61_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading_level" "enum_pages_blocks_b61_tabs_heading_level" DEFAULT 'auto',
  	"intro" jsonb,
  	"first_item_open" boolean DEFAULT true,
  	"tab_position" "enum_pages_blocks_b61_tabs_tab_position" DEFAULT 'top',
  	"tab_align" "enum_pages_blocks_b61_tabs_tab_align" DEFAULT 'left',
  	"heading_align" "enum_pages_blocks_b61_tabs_heading_align" DEFAULT 'left',
  	"pad_top" "enum_pages_blocks_b61_tabs_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum_pages_blocks_b61_tabs_pad_bottom" DEFAULT 'normal',
  	"surface" "enum_pages_blocks_b61_tabs_surface" DEFAULT 'none',
  	"eyebrow_rule" "enum_pages_blocks_b61_tabs_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum_pages_blocks_b61_tabs_entrance" DEFAULT 'on',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_b61_carousel_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_carousel_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_b61_carousel_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_b61_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading_level" "enum_pages_blocks_b61_carousel_heading_level" DEFAULT 'auto',
  	"intro" jsonb,
  	"label" varchar,
  	"per_view" "enum_pages_blocks_b61_carousel_per_view" DEFAULT '1',
  	"heading_align" "enum_pages_blocks_b61_carousel_heading_align" DEFAULT 'left',
  	"advance" "enum_pages_blocks_b61_carousel_advance" DEFAULT 'one',
  	"peek" "enum_pages_blocks_b61_carousel_peek" DEFAULT 'medium',
  	"controls_position" "enum_pages_blocks_b61_carousel_controls_position" DEFAULT 'top-right',
  	"show_counter" boolean DEFAULT true,
  	"show_progress" boolean DEFAULT true,
  	"pad_top" "enum_pages_blocks_b61_carousel_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum_pages_blocks_b61_carousel_pad_bottom" DEFAULT 'normal',
  	"surface" "enum_pages_blocks_b61_carousel_surface" DEFAULT 'none',
  	"eyebrow_rule" "enum_pages_blocks_b61_carousel_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum_pages_blocks_b61_carousel_entrance" DEFAULT 'on',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_b61_rail_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum_pages_blocks_b61_rail_buttons_variant" DEFAULT 'primary',
  	"link_type" "enum_pages_blocks_b61_rail_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"full_width" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_rail_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"icon" "enum_pages_blocks_b61_rail_links_icon" DEFAULT 'arrow',
  	"link_type" "enum_pages_blocks_b61_rail_links_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_rail" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"links_label" varchar DEFAULT 'Keep exploring',
  	"actions_position" "enum_pages_blocks_b61_rail_actions_position" DEFAULT 'top',
  	"sticky" boolean,
  	"surface" "enum_pages_blocks_b61_rail_surface" DEFAULT 'plain',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_b61_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"overlay_strength" numeric,
  	"columns" "enum_pages_blocks_b61_section_columns" DEFAULT 'full',
  	"rail_sticky" boolean,
  	"rail_align" "enum_pages_blocks_b61_section_rail_align" DEFAULT 'start',
  	"rail_stack" "enum_pages_blocks_b61_section_rail_stack" DEFAULT 'source',
  	"pull_up" boolean,
  	"rail_width_step" numeric,
  	"pad_top" "enum_pages_blocks_b61_section_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum_pages_blocks_b61_section_pad_bottom" DEFAULT 'normal',
  	"pattern_on" boolean,
  	"pattern_image_id" integer,
  	"tile_size" numeric,
  	"watermark_on" boolean,
  	"watermark_image_id" integer,
  	"watermark_size" numeric,
  	"watermark_strength" numeric,
  	"surface" "enum_pages_blocks_b61_section_surface" DEFAULT 'none',
  	"entrance" "enum_pages_blocks_b61_section_entrance" DEFAULT 'on',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_accordion_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_accordion_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_accordion_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"body" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_accordion_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum__pages_v_blocks_b61_accordion_buttons_variant" DEFAULT 'primary',
  	"link_type" "enum__pages_v_blocks_b61_accordion_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"full_width" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_accordion" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading_level" "enum__pages_v_blocks_b61_accordion_heading_level" DEFAULT 'auto',
  	"intro" jsonb,
  	"heading_align" "enum__pages_v_blocks_b61_accordion_heading_align" DEFAULT 'left',
  	"width_step" numeric,
  	"pad_top" "enum__pages_v_blocks_b61_accordion_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum__pages_v_blocks_b61_accordion_pad_bottom" DEFAULT 'normal',
  	"item_style" "enum__pages_v_blocks_b61_accordion_item_style" DEFAULT 'divided',
  	"icon_style" "enum__pages_v_blocks_b61_accordion_icon_style" DEFAULT 'chevron',
  	"single_open" boolean DEFAULT true,
  	"first_item_open" boolean DEFAULT true,
  	"show_numbers" boolean DEFAULT true,
  	"surface" "enum__pages_v_blocks_b61_accordion_surface" DEFAULT 'none',
  	"item_surface" "enum__pages_v_blocks_b61_accordion_item_surface" DEFAULT 'card',
  	"eyebrow_rule" "enum__pages_v_blocks_b61_accordion_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum__pages_v_blocks_b61_accordion_entrance" DEFAULT 'on',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_tabs_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_tabs_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_pillars_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_pillars_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_pillars_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" jsonb,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading_level" "enum__pages_v_blocks_b61_pillars_heading_level" DEFAULT 'auto',
  	"intro" jsonb,
  	"first_item_open" boolean DEFAULT true,
  	"tab_position" "enum__pages_v_blocks_b61_pillars_tab_position" DEFAULT 'left',
  	"tab_align" "enum__pages_v_blocks_b61_pillars_tab_align" DEFAULT 'left',
  	"heading_align" "enum__pages_v_blocks_b61_pillars_heading_align" DEFAULT 'left',
  	"pad_top" "enum__pages_v_blocks_b61_pillars_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum__pages_v_blocks_b61_pillars_pad_bottom" DEFAULT 'normal',
  	"surface" "enum__pages_v_blocks_b61_pillars_surface" DEFAULT 'none',
  	"eyebrow_rule" "enum__pages_v_blocks_b61_pillars_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum__pages_v_blocks_b61_pillars_entrance" DEFAULT 'on',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_tabs_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading_level" "enum__pages_v_blocks_b61_tabs_heading_level" DEFAULT 'auto',
  	"intro" jsonb,
  	"first_item_open" boolean DEFAULT true,
  	"tab_position" "enum__pages_v_blocks_b61_tabs_tab_position" DEFAULT 'top',
  	"tab_align" "enum__pages_v_blocks_b61_tabs_tab_align" DEFAULT 'left',
  	"heading_align" "enum__pages_v_blocks_b61_tabs_heading_align" DEFAULT 'left',
  	"pad_top" "enum__pages_v_blocks_b61_tabs_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum__pages_v_blocks_b61_tabs_pad_bottom" DEFAULT 'normal',
  	"surface" "enum__pages_v_blocks_b61_tabs_surface" DEFAULT 'none',
  	"eyebrow_rule" "enum__pages_v_blocks_b61_tabs_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum__pages_v_blocks_b61_tabs_entrance" DEFAULT 'on',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_carousel_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_carousel_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_carousel_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading_level" "enum__pages_v_blocks_b61_carousel_heading_level" DEFAULT 'auto',
  	"intro" jsonb,
  	"label" varchar,
  	"per_view" "enum__pages_v_blocks_b61_carousel_per_view" DEFAULT '1',
  	"heading_align" "enum__pages_v_blocks_b61_carousel_heading_align" DEFAULT 'left',
  	"advance" "enum__pages_v_blocks_b61_carousel_advance" DEFAULT 'one',
  	"peek" "enum__pages_v_blocks_b61_carousel_peek" DEFAULT 'medium',
  	"controls_position" "enum__pages_v_blocks_b61_carousel_controls_position" DEFAULT 'top-right',
  	"show_counter" boolean DEFAULT true,
  	"show_progress" boolean DEFAULT true,
  	"pad_top" "enum__pages_v_blocks_b61_carousel_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum__pages_v_blocks_b61_carousel_pad_bottom" DEFAULT 'normal',
  	"surface" "enum__pages_v_blocks_b61_carousel_surface" DEFAULT 'none',
  	"eyebrow_rule" "enum__pages_v_blocks_b61_carousel_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum__pages_v_blocks_b61_carousel_entrance" DEFAULT 'on',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_rail_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum__pages_v_blocks_b61_rail_buttons_variant" DEFAULT 'primary',
  	"link_type" "enum__pages_v_blocks_b61_rail_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"full_width" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_rail_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"icon" "enum__pages_v_blocks_b61_rail_links_icon" DEFAULT 'arrow',
  	"link_type" "enum__pages_v_blocks_b61_rail_links_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_rail" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"links_label" varchar DEFAULT 'Keep exploring',
  	"actions_position" "enum__pages_v_blocks_b61_rail_actions_position" DEFAULT 'top',
  	"sticky" boolean,
  	"surface" "enum__pages_v_blocks_b61_rail_surface" DEFAULT 'plain',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"overlay_strength" numeric,
  	"columns" "enum__pages_v_blocks_b61_section_columns" DEFAULT 'full',
  	"rail_sticky" boolean,
  	"rail_align" "enum__pages_v_blocks_b61_section_rail_align" DEFAULT 'start',
  	"rail_stack" "enum__pages_v_blocks_b61_section_rail_stack" DEFAULT 'source',
  	"pull_up" boolean,
  	"rail_width_step" numeric,
  	"pad_top" "enum__pages_v_blocks_b61_section_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum__pages_v_blocks_b61_section_pad_bottom" DEFAULT 'normal',
  	"pattern_on" boolean,
  	"pattern_image_id" integer,
  	"tile_size" numeric,
  	"watermark_on" boolean,
  	"watermark_image_id" integer,
  	"watermark_size" numeric,
  	"watermark_strength" numeric,
  	"surface" "enum__pages_v_blocks_b61_section_surface" DEFAULT 'none',
  	"entrance" "enum__pages_v_blocks_b61_section_entrance" DEFAULT 'on',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_b61_accordion_lines" ADD CONSTRAINT "pages_blocks_b61_accordion_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_accordion_subheads" ADD CONSTRAINT "pages_blocks_b61_accordion_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_accordion_items" ADD CONSTRAINT "pages_blocks_b61_accordion_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_accordion_buttons" ADD CONSTRAINT "pages_blocks_b61_accordion_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_accordion_buttons" ADD CONSTRAINT "pages_blocks_b61_accordion_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_accordion" ADD CONSTRAINT "pages_blocks_b61_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_tabs_lines" ADD CONSTRAINT "pages_blocks_b61_tabs_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_tabs_subheads" ADD CONSTRAINT "pages_blocks_b61_tabs_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_pillars_lines" ADD CONSTRAINT "pages_blocks_b61_pillars_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_pillars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_pillars_subheads" ADD CONSTRAINT "pages_blocks_b61_pillars_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_pillars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_pillars_items" ADD CONSTRAINT "pages_blocks_b61_pillars_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_pillars_items" ADD CONSTRAINT "pages_blocks_b61_pillars_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_pillars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_pillars" ADD CONSTRAINT "pages_blocks_b61_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_tabs_tabs" ADD CONSTRAINT "pages_blocks_b61_tabs_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_tabs" ADD CONSTRAINT "pages_blocks_b61_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_carousel_lines" ADD CONSTRAINT "pages_blocks_b61_carousel_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_carousel_subheads" ADD CONSTRAINT "pages_blocks_b61_carousel_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_carousel_slides" ADD CONSTRAINT "pages_blocks_b61_carousel_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_carousel" ADD CONSTRAINT "pages_blocks_b61_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_rail_buttons" ADD CONSTRAINT "pages_blocks_b61_rail_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_rail_buttons" ADD CONSTRAINT "pages_blocks_b61_rail_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_rail"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_rail_links" ADD CONSTRAINT "pages_blocks_b61_rail_links_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_rail_links" ADD CONSTRAINT "pages_blocks_b61_rail_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_rail"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_rail" ADD CONSTRAINT "pages_blocks_b61_rail_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_section" ADD CONSTRAINT "pages_blocks_b61_section_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_section" ADD CONSTRAINT "pages_blocks_b61_section_pattern_image_id_media_id_fk" FOREIGN KEY ("pattern_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_section" ADD CONSTRAINT "pages_blocks_b61_section_watermark_image_id_media_id_fk" FOREIGN KEY ("watermark_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_section" ADD CONSTRAINT "pages_blocks_b61_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_accordion_lines" ADD CONSTRAINT "_pages_v_blocks_b61_accordion_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_accordion_subheads" ADD CONSTRAINT "_pages_v_blocks_b61_accordion_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_accordion_items" ADD CONSTRAINT "_pages_v_blocks_b61_accordion_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_accordion_buttons" ADD CONSTRAINT "_pages_v_blocks_b61_accordion_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_accordion_buttons" ADD CONSTRAINT "_pages_v_blocks_b61_accordion_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_accordion" ADD CONSTRAINT "_pages_v_blocks_b61_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_tabs_lines" ADD CONSTRAINT "_pages_v_blocks_b61_tabs_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_tabs_subheads" ADD CONSTRAINT "_pages_v_blocks_b61_tabs_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_pillars_lines" ADD CONSTRAINT "_pages_v_blocks_b61_pillars_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_pillars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_pillars_subheads" ADD CONSTRAINT "_pages_v_blocks_b61_pillars_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_pillars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_pillars_items" ADD CONSTRAINT "_pages_v_blocks_b61_pillars_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_pillars_items" ADD CONSTRAINT "_pages_v_blocks_b61_pillars_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_pillars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_pillars" ADD CONSTRAINT "_pages_v_blocks_b61_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_tabs_tabs" ADD CONSTRAINT "_pages_v_blocks_b61_tabs_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_tabs" ADD CONSTRAINT "_pages_v_blocks_b61_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_carousel_lines" ADD CONSTRAINT "_pages_v_blocks_b61_carousel_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_carousel_subheads" ADD CONSTRAINT "_pages_v_blocks_b61_carousel_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_carousel_slides" ADD CONSTRAINT "_pages_v_blocks_b61_carousel_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_carousel" ADD CONSTRAINT "_pages_v_blocks_b61_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_rail_buttons" ADD CONSTRAINT "_pages_v_blocks_b61_rail_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_rail_buttons" ADD CONSTRAINT "_pages_v_blocks_b61_rail_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_rail"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_rail_links" ADD CONSTRAINT "_pages_v_blocks_b61_rail_links_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_rail_links" ADD CONSTRAINT "_pages_v_blocks_b61_rail_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_rail"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_rail" ADD CONSTRAINT "_pages_v_blocks_b61_rail_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_section" ADD CONSTRAINT "_pages_v_blocks_b61_section_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_section" ADD CONSTRAINT "_pages_v_blocks_b61_section_pattern_image_id_media_id_fk" FOREIGN KEY ("pattern_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_section" ADD CONSTRAINT "_pages_v_blocks_b61_section_watermark_image_id_media_id_fk" FOREIGN KEY ("watermark_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_section" ADD CONSTRAINT "_pages_v_blocks_b61_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_b61_accordion_lines_order_idx" ON "pages_blocks_b61_accordion_lines" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_accordion_lines_parent_id_idx" ON "pages_blocks_b61_accordion_lines" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_accordion_subheads_order_idx" ON "pages_blocks_b61_accordion_subheads" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_accordion_subheads_parent_id_idx" ON "pages_blocks_b61_accordion_subheads" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_accordion_items_order_idx" ON "pages_blocks_b61_accordion_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_accordion_items_parent_id_idx" ON "pages_blocks_b61_accordion_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_accordion_buttons_order_idx" ON "pages_blocks_b61_accordion_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_accordion_buttons_parent_id_idx" ON "pages_blocks_b61_accordion_buttons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_accordion_buttons_link_link_page_idx" ON "pages_blocks_b61_accordion_buttons" USING btree ("link_page_id");
  CREATE INDEX "pages_blocks_b61_accordion_order_idx" ON "pages_blocks_b61_accordion" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_accordion_parent_id_idx" ON "pages_blocks_b61_accordion" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_accordion_path_idx" ON "pages_blocks_b61_accordion" USING btree ("_path");
  CREATE INDEX "pages_blocks_b61_tabs_lines_order_idx" ON "pages_blocks_b61_tabs_lines" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_tabs_lines_parent_id_idx" ON "pages_blocks_b61_tabs_lines" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_tabs_subheads_order_idx" ON "pages_blocks_b61_tabs_subheads" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_tabs_subheads_parent_id_idx" ON "pages_blocks_b61_tabs_subheads" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_pillars_lines_order_idx" ON "pages_blocks_b61_pillars_lines" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_pillars_lines_parent_id_idx" ON "pages_blocks_b61_pillars_lines" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_pillars_subheads_order_idx" ON "pages_blocks_b61_pillars_subheads" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_pillars_subheads_parent_id_idx" ON "pages_blocks_b61_pillars_subheads" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_pillars_items_order_idx" ON "pages_blocks_b61_pillars_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_pillars_items_parent_id_idx" ON "pages_blocks_b61_pillars_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_pillars_items_image_idx" ON "pages_blocks_b61_pillars_items" USING btree ("image_id");
  CREATE INDEX "pages_blocks_b61_pillars_order_idx" ON "pages_blocks_b61_pillars" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_pillars_parent_id_idx" ON "pages_blocks_b61_pillars" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_pillars_path_idx" ON "pages_blocks_b61_pillars" USING btree ("_path");
  CREATE INDEX "pages_blocks_b61_tabs_tabs_order_idx" ON "pages_blocks_b61_tabs_tabs" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_tabs_tabs_parent_id_idx" ON "pages_blocks_b61_tabs_tabs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_tabs_order_idx" ON "pages_blocks_b61_tabs" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_tabs_parent_id_idx" ON "pages_blocks_b61_tabs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_tabs_path_idx" ON "pages_blocks_b61_tabs" USING btree ("_path");
  CREATE INDEX "pages_blocks_b61_carousel_lines_order_idx" ON "pages_blocks_b61_carousel_lines" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_carousel_lines_parent_id_idx" ON "pages_blocks_b61_carousel_lines" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_carousel_subheads_order_idx" ON "pages_blocks_b61_carousel_subheads" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_carousel_subheads_parent_id_idx" ON "pages_blocks_b61_carousel_subheads" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_carousel_slides_order_idx" ON "pages_blocks_b61_carousel_slides" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_carousel_slides_parent_id_idx" ON "pages_blocks_b61_carousel_slides" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_carousel_order_idx" ON "pages_blocks_b61_carousel" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_carousel_parent_id_idx" ON "pages_blocks_b61_carousel" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_carousel_path_idx" ON "pages_blocks_b61_carousel" USING btree ("_path");
  CREATE INDEX "pages_blocks_b61_rail_buttons_order_idx" ON "pages_blocks_b61_rail_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_rail_buttons_parent_id_idx" ON "pages_blocks_b61_rail_buttons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_rail_buttons_link_link_page_idx" ON "pages_blocks_b61_rail_buttons" USING btree ("link_page_id");
  CREATE INDEX "pages_blocks_b61_rail_links_order_idx" ON "pages_blocks_b61_rail_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_rail_links_parent_id_idx" ON "pages_blocks_b61_rail_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_rail_links_link_link_page_idx" ON "pages_blocks_b61_rail_links" USING btree ("link_page_id");
  CREATE INDEX "pages_blocks_b61_rail_order_idx" ON "pages_blocks_b61_rail" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_rail_parent_id_idx" ON "pages_blocks_b61_rail" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_rail_path_idx" ON "pages_blocks_b61_rail" USING btree ("_path");
  CREATE INDEX "pages_blocks_b61_section_order_idx" ON "pages_blocks_b61_section" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_section_parent_id_idx" ON "pages_blocks_b61_section" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_section_path_idx" ON "pages_blocks_b61_section" USING btree ("_path");
  CREATE INDEX "pages_blocks_b61_section_image_idx" ON "pages_blocks_b61_section" USING btree ("image_id");
  CREATE INDEX "pages_blocks_b61_section_pattern_image_idx" ON "pages_blocks_b61_section" USING btree ("pattern_image_id");
  CREATE INDEX "pages_blocks_b61_section_watermark_image_idx" ON "pages_blocks_b61_section" USING btree ("watermark_image_id");
  CREATE INDEX "_pages_v_blocks_b61_accordion_lines_order_idx" ON "_pages_v_blocks_b61_accordion_lines" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_accordion_lines_parent_id_idx" ON "_pages_v_blocks_b61_accordion_lines" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_accordion_subheads_order_idx" ON "_pages_v_blocks_b61_accordion_subheads" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_accordion_subheads_parent_id_idx" ON "_pages_v_blocks_b61_accordion_subheads" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_accordion_items_order_idx" ON "_pages_v_blocks_b61_accordion_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_accordion_items_parent_id_idx" ON "_pages_v_blocks_b61_accordion_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_accordion_buttons_order_idx" ON "_pages_v_blocks_b61_accordion_buttons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_accordion_buttons_parent_id_idx" ON "_pages_v_blocks_b61_accordion_buttons" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_accordion_buttons_link_link_page_idx" ON "_pages_v_blocks_b61_accordion_buttons" USING btree ("link_page_id");
  CREATE INDEX "_pages_v_blocks_b61_accordion_order_idx" ON "_pages_v_blocks_b61_accordion" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_accordion_parent_id_idx" ON "_pages_v_blocks_b61_accordion" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_accordion_path_idx" ON "_pages_v_blocks_b61_accordion" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_b61_tabs_lines_order_idx" ON "_pages_v_blocks_b61_tabs_lines" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_tabs_lines_parent_id_idx" ON "_pages_v_blocks_b61_tabs_lines" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_tabs_subheads_order_idx" ON "_pages_v_blocks_b61_tabs_subheads" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_tabs_subheads_parent_id_idx" ON "_pages_v_blocks_b61_tabs_subheads" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_pillars_lines_order_idx" ON "_pages_v_blocks_b61_pillars_lines" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_pillars_lines_parent_id_idx" ON "_pages_v_blocks_b61_pillars_lines" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_pillars_subheads_order_idx" ON "_pages_v_blocks_b61_pillars_subheads" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_pillars_subheads_parent_id_idx" ON "_pages_v_blocks_b61_pillars_subheads" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_pillars_items_order_idx" ON "_pages_v_blocks_b61_pillars_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_pillars_items_parent_id_idx" ON "_pages_v_blocks_b61_pillars_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_pillars_items_image_idx" ON "_pages_v_blocks_b61_pillars_items" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_b61_pillars_order_idx" ON "_pages_v_blocks_b61_pillars" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_pillars_parent_id_idx" ON "_pages_v_blocks_b61_pillars" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_pillars_path_idx" ON "_pages_v_blocks_b61_pillars" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_b61_tabs_tabs_order_idx" ON "_pages_v_blocks_b61_tabs_tabs" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_tabs_tabs_parent_id_idx" ON "_pages_v_blocks_b61_tabs_tabs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_tabs_order_idx" ON "_pages_v_blocks_b61_tabs" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_tabs_parent_id_idx" ON "_pages_v_blocks_b61_tabs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_tabs_path_idx" ON "_pages_v_blocks_b61_tabs" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_b61_carousel_lines_order_idx" ON "_pages_v_blocks_b61_carousel_lines" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_carousel_lines_parent_id_idx" ON "_pages_v_blocks_b61_carousel_lines" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_carousel_subheads_order_idx" ON "_pages_v_blocks_b61_carousel_subheads" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_carousel_subheads_parent_id_idx" ON "_pages_v_blocks_b61_carousel_subheads" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_carousel_slides_order_idx" ON "_pages_v_blocks_b61_carousel_slides" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_carousel_slides_parent_id_idx" ON "_pages_v_blocks_b61_carousel_slides" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_carousel_order_idx" ON "_pages_v_blocks_b61_carousel" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_carousel_parent_id_idx" ON "_pages_v_blocks_b61_carousel" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_carousel_path_idx" ON "_pages_v_blocks_b61_carousel" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_b61_rail_buttons_order_idx" ON "_pages_v_blocks_b61_rail_buttons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_rail_buttons_parent_id_idx" ON "_pages_v_blocks_b61_rail_buttons" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_rail_buttons_link_link_page_idx" ON "_pages_v_blocks_b61_rail_buttons" USING btree ("link_page_id");
  CREATE INDEX "_pages_v_blocks_b61_rail_links_order_idx" ON "_pages_v_blocks_b61_rail_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_rail_links_parent_id_idx" ON "_pages_v_blocks_b61_rail_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_rail_links_link_link_page_idx" ON "_pages_v_blocks_b61_rail_links" USING btree ("link_page_id");
  CREATE INDEX "_pages_v_blocks_b61_rail_order_idx" ON "_pages_v_blocks_b61_rail" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_rail_parent_id_idx" ON "_pages_v_blocks_b61_rail" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_rail_path_idx" ON "_pages_v_blocks_b61_rail" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_b61_section_order_idx" ON "_pages_v_blocks_b61_section" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_section_parent_id_idx" ON "_pages_v_blocks_b61_section" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_section_path_idx" ON "_pages_v_blocks_b61_section" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_b61_section_image_idx" ON "_pages_v_blocks_b61_section" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_b61_section_pattern_image_idx" ON "_pages_v_blocks_b61_section" USING btree ("pattern_image_id");
  CREATE INDEX "_pages_v_blocks_b61_section_watermark_image_idx" ON "_pages_v_blocks_b61_section" USING btree ("watermark_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_b61_accordion_lines" CASCADE;
  DROP TABLE "pages_blocks_b61_accordion_subheads" CASCADE;
  DROP TABLE "pages_blocks_b61_accordion_items" CASCADE;
  DROP TABLE "pages_blocks_b61_accordion_buttons" CASCADE;
  DROP TABLE "pages_blocks_b61_accordion" CASCADE;
  DROP TABLE "pages_blocks_b61_tabs_lines" CASCADE;
  DROP TABLE "pages_blocks_b61_tabs_subheads" CASCADE;
  DROP TABLE "pages_blocks_b61_pillars_lines" CASCADE;
  DROP TABLE "pages_blocks_b61_pillars_subheads" CASCADE;
  DROP TABLE "pages_blocks_b61_pillars_items" CASCADE;
  DROP TABLE "pages_blocks_b61_pillars" CASCADE;
  DROP TABLE "pages_blocks_b61_tabs_tabs" CASCADE;
  DROP TABLE "pages_blocks_b61_tabs" CASCADE;
  DROP TABLE "pages_blocks_b61_carousel_lines" CASCADE;
  DROP TABLE "pages_blocks_b61_carousel_subheads" CASCADE;
  DROP TABLE "pages_blocks_b61_carousel_slides" CASCADE;
  DROP TABLE "pages_blocks_b61_carousel" CASCADE;
  DROP TABLE "pages_blocks_b61_rail_buttons" CASCADE;
  DROP TABLE "pages_blocks_b61_rail_links" CASCADE;
  DROP TABLE "pages_blocks_b61_rail" CASCADE;
  DROP TABLE "pages_blocks_b61_section" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_accordion_lines" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_accordion_subheads" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_accordion_items" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_accordion_buttons" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_accordion" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_tabs_lines" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_tabs_subheads" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_pillars_lines" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_pillars_subheads" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_pillars_items" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_pillars" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_tabs_tabs" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_tabs" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_carousel_lines" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_carousel_subheads" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_carousel_slides" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_carousel" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_rail_buttons" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_rail_links" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_rail" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_section" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_b61_accordion_buttons_variant";
  DROP TYPE "public"."enum_pages_blocks_b61_accordion_buttons_link_type";
  DROP TYPE "public"."enum_pages_blocks_b61_accordion_heading_level";
  DROP TYPE "public"."enum_pages_blocks_b61_accordion_heading_align";
  DROP TYPE "public"."enum_pages_blocks_b61_accordion_pad_top";
  DROP TYPE "public"."enum_pages_blocks_b61_accordion_pad_bottom";
  DROP TYPE "public"."enum_pages_blocks_b61_accordion_item_style";
  DROP TYPE "public"."enum_pages_blocks_b61_accordion_icon_style";
  DROP TYPE "public"."enum_pages_blocks_b61_accordion_surface";
  DROP TYPE "public"."enum_pages_blocks_b61_accordion_item_surface";
  DROP TYPE "public"."enum_pages_blocks_b61_accordion_eyebrow_rule";
  DROP TYPE "public"."enum_pages_blocks_b61_accordion_entrance";
  DROP TYPE "public"."enum_pages_blocks_b61_pillars_heading_level";
  DROP TYPE "public"."enum_pages_blocks_b61_pillars_tab_position";
  DROP TYPE "public"."enum_pages_blocks_b61_pillars_tab_align";
  DROP TYPE "public"."enum_pages_blocks_b61_pillars_heading_align";
  DROP TYPE "public"."enum_pages_blocks_b61_pillars_pad_top";
  DROP TYPE "public"."enum_pages_blocks_b61_pillars_pad_bottom";
  DROP TYPE "public"."enum_pages_blocks_b61_pillars_surface";
  DROP TYPE "public"."enum_pages_blocks_b61_pillars_eyebrow_rule";
  DROP TYPE "public"."enum_pages_blocks_b61_pillars_entrance";
  DROP TYPE "public"."enum_pages_blocks_b61_tabs_heading_level";
  DROP TYPE "public"."enum_pages_blocks_b61_tabs_tab_position";
  DROP TYPE "public"."enum_pages_blocks_b61_tabs_tab_align";
  DROP TYPE "public"."enum_pages_blocks_b61_tabs_heading_align";
  DROP TYPE "public"."enum_pages_blocks_b61_tabs_pad_top";
  DROP TYPE "public"."enum_pages_blocks_b61_tabs_pad_bottom";
  DROP TYPE "public"."enum_pages_blocks_b61_tabs_surface";
  DROP TYPE "public"."enum_pages_blocks_b61_tabs_eyebrow_rule";
  DROP TYPE "public"."enum_pages_blocks_b61_tabs_entrance";
  DROP TYPE "public"."enum_pages_blocks_b61_carousel_heading_level";
  DROP TYPE "public"."enum_pages_blocks_b61_carousel_per_view";
  DROP TYPE "public"."enum_pages_blocks_b61_carousel_heading_align";
  DROP TYPE "public"."enum_pages_blocks_b61_carousel_advance";
  DROP TYPE "public"."enum_pages_blocks_b61_carousel_peek";
  DROP TYPE "public"."enum_pages_blocks_b61_carousel_controls_position";
  DROP TYPE "public"."enum_pages_blocks_b61_carousel_pad_top";
  DROP TYPE "public"."enum_pages_blocks_b61_carousel_pad_bottom";
  DROP TYPE "public"."enum_pages_blocks_b61_carousel_surface";
  DROP TYPE "public"."enum_pages_blocks_b61_carousel_eyebrow_rule";
  DROP TYPE "public"."enum_pages_blocks_b61_carousel_entrance";
  DROP TYPE "public"."enum_pages_blocks_b61_rail_buttons_variant";
  DROP TYPE "public"."enum_pages_blocks_b61_rail_buttons_link_type";
  DROP TYPE "public"."enum_pages_blocks_b61_rail_links_icon";
  DROP TYPE "public"."enum_pages_blocks_b61_rail_links_link_type";
  DROP TYPE "public"."enum_pages_blocks_b61_rail_actions_position";
  DROP TYPE "public"."enum_pages_blocks_b61_rail_surface";
  DROP TYPE "public"."enum_pages_blocks_b61_section_columns";
  DROP TYPE "public"."enum_pages_blocks_b61_section_rail_align";
  DROP TYPE "public"."enum_pages_blocks_b61_section_rail_stack";
  DROP TYPE "public"."enum_pages_blocks_b61_section_pad_top";
  DROP TYPE "public"."enum_pages_blocks_b61_section_pad_bottom";
  DROP TYPE "public"."enum_pages_blocks_b61_section_surface";
  DROP TYPE "public"."enum_pages_blocks_b61_section_entrance";
  DROP TYPE "public"."enum__pages_v_blocks_b61_accordion_buttons_variant";
  DROP TYPE "public"."enum__pages_v_blocks_b61_accordion_buttons_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_b61_accordion_heading_level";
  DROP TYPE "public"."enum__pages_v_blocks_b61_accordion_heading_align";
  DROP TYPE "public"."enum__pages_v_blocks_b61_accordion_pad_top";
  DROP TYPE "public"."enum__pages_v_blocks_b61_accordion_pad_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_b61_accordion_item_style";
  DROP TYPE "public"."enum__pages_v_blocks_b61_accordion_icon_style";
  DROP TYPE "public"."enum__pages_v_blocks_b61_accordion_surface";
  DROP TYPE "public"."enum__pages_v_blocks_b61_accordion_item_surface";
  DROP TYPE "public"."enum__pages_v_blocks_b61_accordion_eyebrow_rule";
  DROP TYPE "public"."enum__pages_v_blocks_b61_accordion_entrance";
  DROP TYPE "public"."enum__pages_v_blocks_b61_pillars_heading_level";
  DROP TYPE "public"."enum__pages_v_blocks_b61_pillars_tab_position";
  DROP TYPE "public"."enum__pages_v_blocks_b61_pillars_tab_align";
  DROP TYPE "public"."enum__pages_v_blocks_b61_pillars_heading_align";
  DROP TYPE "public"."enum__pages_v_blocks_b61_pillars_pad_top";
  DROP TYPE "public"."enum__pages_v_blocks_b61_pillars_pad_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_b61_pillars_surface";
  DROP TYPE "public"."enum__pages_v_blocks_b61_pillars_eyebrow_rule";
  DROP TYPE "public"."enum__pages_v_blocks_b61_pillars_entrance";
  DROP TYPE "public"."enum__pages_v_blocks_b61_tabs_heading_level";
  DROP TYPE "public"."enum__pages_v_blocks_b61_tabs_tab_position";
  DROP TYPE "public"."enum__pages_v_blocks_b61_tabs_tab_align";
  DROP TYPE "public"."enum__pages_v_blocks_b61_tabs_heading_align";
  DROP TYPE "public"."enum__pages_v_blocks_b61_tabs_pad_top";
  DROP TYPE "public"."enum__pages_v_blocks_b61_tabs_pad_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_b61_tabs_surface";
  DROP TYPE "public"."enum__pages_v_blocks_b61_tabs_eyebrow_rule";
  DROP TYPE "public"."enum__pages_v_blocks_b61_tabs_entrance";
  DROP TYPE "public"."enum__pages_v_blocks_b61_carousel_heading_level";
  DROP TYPE "public"."enum__pages_v_blocks_b61_carousel_per_view";
  DROP TYPE "public"."enum__pages_v_blocks_b61_carousel_heading_align";
  DROP TYPE "public"."enum__pages_v_blocks_b61_carousel_advance";
  DROP TYPE "public"."enum__pages_v_blocks_b61_carousel_peek";
  DROP TYPE "public"."enum__pages_v_blocks_b61_carousel_controls_position";
  DROP TYPE "public"."enum__pages_v_blocks_b61_carousel_pad_top";
  DROP TYPE "public"."enum__pages_v_blocks_b61_carousel_pad_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_b61_carousel_surface";
  DROP TYPE "public"."enum__pages_v_blocks_b61_carousel_eyebrow_rule";
  DROP TYPE "public"."enum__pages_v_blocks_b61_carousel_entrance";
  DROP TYPE "public"."enum__pages_v_blocks_b61_rail_buttons_variant";
  DROP TYPE "public"."enum__pages_v_blocks_b61_rail_buttons_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_b61_rail_links_icon";
  DROP TYPE "public"."enum__pages_v_blocks_b61_rail_links_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_b61_rail_actions_position";
  DROP TYPE "public"."enum__pages_v_blocks_b61_rail_surface";
  DROP TYPE "public"."enum__pages_v_blocks_b61_section_columns";
  DROP TYPE "public"."enum__pages_v_blocks_b61_section_rail_align";
  DROP TYPE "public"."enum__pages_v_blocks_b61_section_rail_stack";
  DROP TYPE "public"."enum__pages_v_blocks_b61_section_pad_top";
  DROP TYPE "public"."enum__pages_v_blocks_b61_section_pad_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_b61_section_surface";
  DROP TYPE "public"."enum__pages_v_blocks_b61_section_entrance";`)
}
