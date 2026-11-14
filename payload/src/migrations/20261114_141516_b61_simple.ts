import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import { upgradeStatsBands } from '../b61/upgrade'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Keep the old stats bands (and their figures) before their tables go.
  const bands = ((await db.execute(sql`SELECT "id", "_parent_id" AS page, "_order" AS pos, "heading", "tone" FROM "pages_blocks_stats_band"`)) as any).rows ?? []
  const statRows = ((await db.execute(sql`SELECT "_parent_id" AS band, "value", "label" FROM "pages_blocks_stats_band_stats" ORDER BY "_order"`)) as any).rows ?? []
  const old = bands.map((b: any) => ({
    page: Number(b.page),
    pos: Number(b.pos),
    heading: b.heading ?? null,
    tone: b.tone ?? null,
    stats: statRows.filter((r: any) => r.band === b.id).map((r: any) => ({ value: r.value, label: r.label })),
  }))

  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_b61_stats_band_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum_pages_blocks_b61_stats_band_buttons_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum_pages_blocks_b61_stats_band_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum_pages_blocks_b61_stats_band_columns" AS ENUM('1', '2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_b61_stats_band_label_position" AS ENUM('below', 'above');
  CREATE TYPE "public"."enum_pages_blocks_b61_stats_band_text_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_b61_stats_band_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_stats_band_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_stats_band_item_style" AS ENUM('plain', 'divided', 'boxed', 'inline');
  CREATE TYPE "public"."enum_pages_blocks_b61_stats_band_figure_scale" AS ENUM('large', 'medium', 'small');
  CREATE TYPE "public"."enum_pages_blocks_b61_stats_band_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_pages_blocks_b61_stats_band_item_surface" AS ENUM('card', 'light', 'soft', 'dark', 'accent', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_b61_stats_band_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum_pages_blocks_b61_stats_band_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum_pages_blocks_b61_gallery_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum_pages_blocks_b61_gallery_buttons_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum_pages_blocks_b61_gallery_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum_pages_blocks_b61_gallery_media" AS ENUM('photo', 'gallery', 'video');
  CREATE TYPE "public"."enum_pages_blocks_b61_gallery_gallery_layout" AS ENUM('strip', 'grid', 'masonry');
  CREATE TYPE "public"."enum_pages_blocks_b61_gallery_text_position" AS ENUM('above', 'beside');
  CREATE TYPE "public"."enum_pages_blocks_b61_gallery_heading_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_b61_gallery_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_gallery_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_gallery_item_size" AS ENUM('small', 'medium', 'large');
  CREATE TYPE "public"."enum_pages_blocks_b61_gallery_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_b61_gallery_image_shape" AS ENUM('fixed', 'portrait', 'square', 'landscape', 'wide');
  CREATE TYPE "public"."enum_pages_blocks_b61_gallery_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_pages_blocks_b61_gallery_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum_pages_blocks_b61_gallery_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum_pages_blocks_b61_testimonial_text_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_b61_testimonial_text_style" AS ENUM('italic', 'normal');
  CREATE TYPE "public"."enum_pages_blocks_b61_testimonial_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_testimonial_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_testimonial_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_pages_blocks_b61_testimonial_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum_pages_blocks_b61_testimonial_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum_pages_blocks_b61_framed_image_image_shape" AS ENUM('fixed', 'portrait', 'square', 'landscape', 'wide', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_b61_framed_image_image_height" AS ENUM('360px', '460px', '560px', '680px');
  CREATE TYPE "public"."enum_pages_blocks_b61_framed_image_frame_color" AS ENUM('primary', 'secondary', 'accent');
  CREATE TYPE "public"."enum_pages_blocks_b61_framed_image_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum_pages_blocks_b61_button_bar_first_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum_pages_blocks_b61_button_bar_second_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum_pages_blocks_b61_button_bar_size" AS ENUM('standard', 'large');
  CREATE TYPE "public"."enum_pages_blocks_b61_button_bar_first_color" AS ENUM('dark', 'accent', 'soft', 'plain');
  CREATE TYPE "public"."enum_pages_blocks_b61_button_bar_second_color" AS ENUM('dark', 'accent', 'soft', 'plain');
  CREATE TYPE "public"."enum_pages_blocks_b61_button_bar_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum_pages_blocks_b61_divider_line_style" AS ENUM('rule', 'ornament');
  CREATE TYPE "public"."enum_pages_blocks_b61_divider_alignment" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum_pages_blocks_b61_divider_weight" AS ENUM('hairline', 'regular', 'heavy');
  CREATE TYPE "public"."enum_pages_blocks_b61_divider_line_color" AS ENUM('accent', 'ink', 'muted');
  CREATE TYPE "public"."enum_pages_blocks_b61_divider_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_stats_band_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_stats_band_buttons_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_stats_band_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_stats_band_columns" AS ENUM('1', '2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_stats_band_label_position" AS ENUM('below', 'above');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_stats_band_text_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_stats_band_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_stats_band_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_stats_band_item_style" AS ENUM('plain', 'divided', 'boxed', 'inline');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_stats_band_figure_scale" AS ENUM('large', 'medium', 'small');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_stats_band_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_stats_band_item_surface" AS ENUM('card', 'light', 'soft', 'dark', 'accent', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_stats_band_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_stats_band_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_gallery_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_gallery_buttons_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_gallery_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_gallery_media" AS ENUM('photo', 'gallery', 'video');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_gallery_gallery_layout" AS ENUM('strip', 'grid', 'masonry');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_gallery_text_position" AS ENUM('above', 'beside');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_gallery_heading_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_gallery_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_gallery_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_gallery_item_size" AS ENUM('small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_gallery_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_gallery_image_shape" AS ENUM('fixed', 'portrait', 'square', 'landscape', 'wide');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_gallery_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_gallery_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_gallery_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_testimonial_text_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_testimonial_text_style" AS ENUM('italic', 'normal');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_testimonial_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_testimonial_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_testimonial_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_testimonial_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_testimonial_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_framed_image_image_shape" AS ENUM('fixed', 'portrait', 'square', 'landscape', 'wide', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_framed_image_image_height" AS ENUM('360px', '460px', '560px', '680px');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_framed_image_frame_color" AS ENUM('primary', 'secondary', 'accent');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_framed_image_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_button_bar_first_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_button_bar_second_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_button_bar_size" AS ENUM('standard', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_button_bar_first_color" AS ENUM('dark', 'accent', 'soft', 'plain');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_button_bar_second_color" AS ENUM('dark', 'accent', 'soft', 'plain');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_button_bar_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_divider_line_style" AS ENUM('rule', 'ornament');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_divider_alignment" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_divider_weight" AS ENUM('hairline', 'regular', 'heavy');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_divider_line_color" AS ENUM('accent', 'ink', 'muted');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_divider_entrance" AS ENUM('on', 'off');
  CREATE TABLE "pages_blocks_b61_stats_band_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_stats_band_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_b61_stats_band_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"figure" varchar,
  	"label" varchar,
  	"note" varchar
  );
  
  CREATE TABLE "pages_blocks_b61_stats_band_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum_pages_blocks_b61_stats_band_buttons_variant" DEFAULT 'primary',
  	"link_type" "enum_pages_blocks_b61_stats_band_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"full_width" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_stats_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading_level" "enum_pages_blocks_b61_stats_band_heading_level" DEFAULT 'auto',
  	"intro" jsonb,
  	"columns" "enum_pages_blocks_b61_stats_band_columns" DEFAULT '3',
  	"label_position" "enum_pages_blocks_b61_stats_band_label_position" DEFAULT 'below',
  	"text_align" "enum_pages_blocks_b61_stats_band_text_align" DEFAULT 'center',
  	"pad_top" "enum_pages_blocks_b61_stats_band_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum_pages_blocks_b61_stats_band_pad_bottom" DEFAULT 'normal',
  	"item_style" "enum_pages_blocks_b61_stats_band_item_style" DEFAULT 'plain',
  	"flush_edges" boolean,
  	"figure_scale" "enum_pages_blocks_b61_stats_band_figure_scale" DEFAULT 'large',
  	"surface" "enum_pages_blocks_b61_stats_band_surface" DEFAULT 'soft',
  	"item_surface" "enum_pages_blocks_b61_stats_band_item_surface" DEFAULT 'card',
  	"eyebrow_rule" "enum_pages_blocks_b61_stats_band_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum_pages_blocks_b61_stats_band_entrance" DEFAULT 'on',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_b61_gallery_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_gallery_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_b61_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "pages_blocks_b61_gallery_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum_pages_blocks_b61_gallery_buttons_variant" DEFAULT 'primary',
  	"link_type" "enum_pages_blocks_b61_gallery_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"full_width" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading_level" "enum_pages_blocks_b61_gallery_heading_level" DEFAULT 'auto',
  	"intro" jsonb,
  	"media" "enum_pages_blocks_b61_gallery_media" DEFAULT 'gallery',
  	"image_id" integer,
  	"caption" varchar,
  	"scroll_hint" varchar DEFAULT 'Scroll',
  	"video" varchar,
  	"gallery_layout" "enum_pages_blocks_b61_gallery_gallery_layout" DEFAULT 'strip',
  	"text_position" "enum_pages_blocks_b61_gallery_text_position" DEFAULT 'above',
  	"heading_align" "enum_pages_blocks_b61_gallery_heading_align" DEFAULT 'left',
  	"balance_step" numeric,
  	"pad_top" "enum_pages_blocks_b61_gallery_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum_pages_blocks_b61_gallery_pad_bottom" DEFAULT 'normal',
  	"item_size" "enum_pages_blocks_b61_gallery_item_size" DEFAULT 'medium',
  	"columns" "enum_pages_blocks_b61_gallery_columns" DEFAULT '3',
  	"image_shape" "enum_pages_blocks_b61_gallery_image_shape" DEFAULT 'fixed',
  	"surface" "enum_pages_blocks_b61_gallery_surface" DEFAULT 'none',
  	"eyebrow_rule" "enum_pages_blocks_b61_gallery_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum_pages_blocks_b61_gallery_entrance" DEFAULT 'on',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_b61_testimonial" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"quote" varchar,
  	"attribution" varchar,
  	"watermark_id" integer,
  	"text_align" "enum_pages_blocks_b61_testimonial_text_align" DEFAULT 'center',
  	"text_style" "enum_pages_blocks_b61_testimonial_text_style" DEFAULT 'italic',
  	"width_step" numeric,
  	"pad_top" "enum_pages_blocks_b61_testimonial_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum_pages_blocks_b61_testimonial_pad_bottom" DEFAULT 'normal',
  	"surface" "enum_pages_blocks_b61_testimonial_surface" DEFAULT 'none',
  	"eyebrow_rule" "enum_pages_blocks_b61_testimonial_eyebrow_rule" DEFAULT 'site',
  	"show_mark" boolean DEFAULT true,
  	"mark_room" boolean,
  	"entrance" "enum_pages_blocks_b61_testimonial_entrance" DEFAULT 'on',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_b61_framed_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_shape" "enum_pages_blocks_b61_framed_image_image_shape" DEFAULT 'fixed',
  	"image_height" "enum_pages_blocks_b61_framed_image_image_height" DEFAULT '460px',
  	"ratio_w" numeric DEFAULT 3,
  	"ratio_h" numeric DEFAULT 2,
  	"flip_frame" boolean,
  	"width_step" numeric,
  	"frame_color" "enum_pages_blocks_b61_framed_image_frame_color" DEFAULT 'primary',
  	"entrance" "enum_pages_blocks_b61_framed_image_entrance" DEFAULT 'on',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_b61_button_bar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"first_label" varchar,
  	"first_link_type" "enum_pages_blocks_b61_button_bar_first_link_type" DEFAULT 'page',
  	"first_link_page_id" integer,
  	"first_link_url" varchar,
  	"first_link_new_tab" boolean,
  	"second_label" varchar,
  	"second_link_type" "enum_pages_blocks_b61_button_bar_second_link_type" DEFAULT 'page',
  	"second_link_page_id" integer,
  	"second_link_url" varchar,
  	"second_link_new_tab" boolean,
  	"size" "enum_pages_blocks_b61_button_bar_size" DEFAULT 'standard',
  	"first_color" "enum_pages_blocks_b61_button_bar_first_color" DEFAULT 'dark',
  	"second_color" "enum_pages_blocks_b61_button_bar_second_color" DEFAULT 'accent',
  	"entrance" "enum_pages_blocks_b61_button_bar_entrance" DEFAULT 'on',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_b61_divider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"line_style" "enum_pages_blocks_b61_divider_line_style" DEFAULT 'rule',
  	"ornament_id" integer,
  	"alignment" "enum_pages_blocks_b61_divider_alignment" DEFAULT 'center',
  	"width_step" numeric,
  	"weight" "enum_pages_blocks_b61_divider_weight" DEFAULT 'regular',
  	"line_color" "enum_pages_blocks_b61_divider_line_color" DEFAULT 'accent',
  	"entrance" "enum_pages_blocks_b61_divider_entrance" DEFAULT 'on',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_stats_band_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_stats_band_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_stats_band_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"figure" varchar,
  	"label" varchar,
  	"note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_stats_band_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum__pages_v_blocks_b61_stats_band_buttons_variant" DEFAULT 'primary',
  	"link_type" "enum__pages_v_blocks_b61_stats_band_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"full_width" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_stats_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading_level" "enum__pages_v_blocks_b61_stats_band_heading_level" DEFAULT 'auto',
  	"intro" jsonb,
  	"columns" "enum__pages_v_blocks_b61_stats_band_columns" DEFAULT '3',
  	"label_position" "enum__pages_v_blocks_b61_stats_band_label_position" DEFAULT 'below',
  	"text_align" "enum__pages_v_blocks_b61_stats_band_text_align" DEFAULT 'center',
  	"pad_top" "enum__pages_v_blocks_b61_stats_band_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum__pages_v_blocks_b61_stats_band_pad_bottom" DEFAULT 'normal',
  	"item_style" "enum__pages_v_blocks_b61_stats_band_item_style" DEFAULT 'plain',
  	"flush_edges" boolean,
  	"figure_scale" "enum__pages_v_blocks_b61_stats_band_figure_scale" DEFAULT 'large',
  	"surface" "enum__pages_v_blocks_b61_stats_band_surface" DEFAULT 'soft',
  	"item_surface" "enum__pages_v_blocks_b61_stats_band_item_surface" DEFAULT 'card',
  	"eyebrow_rule" "enum__pages_v_blocks_b61_stats_band_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum__pages_v_blocks_b61_stats_band_entrance" DEFAULT 'on',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_gallery_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_gallery_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_gallery_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum__pages_v_blocks_b61_gallery_buttons_variant" DEFAULT 'primary',
  	"link_type" "enum__pages_v_blocks_b61_gallery_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"full_width" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading_level" "enum__pages_v_blocks_b61_gallery_heading_level" DEFAULT 'auto',
  	"intro" jsonb,
  	"media" "enum__pages_v_blocks_b61_gallery_media" DEFAULT 'gallery',
  	"image_id" integer,
  	"caption" varchar,
  	"scroll_hint" varchar DEFAULT 'Scroll',
  	"video" varchar,
  	"gallery_layout" "enum__pages_v_blocks_b61_gallery_gallery_layout" DEFAULT 'strip',
  	"text_position" "enum__pages_v_blocks_b61_gallery_text_position" DEFAULT 'above',
  	"heading_align" "enum__pages_v_blocks_b61_gallery_heading_align" DEFAULT 'left',
  	"balance_step" numeric,
  	"pad_top" "enum__pages_v_blocks_b61_gallery_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum__pages_v_blocks_b61_gallery_pad_bottom" DEFAULT 'normal',
  	"item_size" "enum__pages_v_blocks_b61_gallery_item_size" DEFAULT 'medium',
  	"columns" "enum__pages_v_blocks_b61_gallery_columns" DEFAULT '3',
  	"image_shape" "enum__pages_v_blocks_b61_gallery_image_shape" DEFAULT 'fixed',
  	"surface" "enum__pages_v_blocks_b61_gallery_surface" DEFAULT 'none',
  	"eyebrow_rule" "enum__pages_v_blocks_b61_gallery_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum__pages_v_blocks_b61_gallery_entrance" DEFAULT 'on',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_testimonial" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"quote" varchar,
  	"attribution" varchar,
  	"watermark_id" integer,
  	"text_align" "enum__pages_v_blocks_b61_testimonial_text_align" DEFAULT 'center',
  	"text_style" "enum__pages_v_blocks_b61_testimonial_text_style" DEFAULT 'italic',
  	"width_step" numeric,
  	"pad_top" "enum__pages_v_blocks_b61_testimonial_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum__pages_v_blocks_b61_testimonial_pad_bottom" DEFAULT 'normal',
  	"surface" "enum__pages_v_blocks_b61_testimonial_surface" DEFAULT 'none',
  	"eyebrow_rule" "enum__pages_v_blocks_b61_testimonial_eyebrow_rule" DEFAULT 'site',
  	"show_mark" boolean DEFAULT true,
  	"mark_room" boolean,
  	"entrance" "enum__pages_v_blocks_b61_testimonial_entrance" DEFAULT 'on',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_framed_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_shape" "enum__pages_v_blocks_b61_framed_image_image_shape" DEFAULT 'fixed',
  	"image_height" "enum__pages_v_blocks_b61_framed_image_image_height" DEFAULT '460px',
  	"ratio_w" numeric DEFAULT 3,
  	"ratio_h" numeric DEFAULT 2,
  	"flip_frame" boolean,
  	"width_step" numeric,
  	"frame_color" "enum__pages_v_blocks_b61_framed_image_frame_color" DEFAULT 'primary',
  	"entrance" "enum__pages_v_blocks_b61_framed_image_entrance" DEFAULT 'on',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_button_bar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_label" varchar,
  	"first_link_type" "enum__pages_v_blocks_b61_button_bar_first_link_type" DEFAULT 'page',
  	"first_link_page_id" integer,
  	"first_link_url" varchar,
  	"first_link_new_tab" boolean,
  	"second_label" varchar,
  	"second_link_type" "enum__pages_v_blocks_b61_button_bar_second_link_type" DEFAULT 'page',
  	"second_link_page_id" integer,
  	"second_link_url" varchar,
  	"second_link_new_tab" boolean,
  	"size" "enum__pages_v_blocks_b61_button_bar_size" DEFAULT 'standard',
  	"first_color" "enum__pages_v_blocks_b61_button_bar_first_color" DEFAULT 'dark',
  	"second_color" "enum__pages_v_blocks_b61_button_bar_second_color" DEFAULT 'accent',
  	"entrance" "enum__pages_v_blocks_b61_button_bar_entrance" DEFAULT 'on',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_divider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"line_style" "enum__pages_v_blocks_b61_divider_line_style" DEFAULT 'rule',
  	"ornament_id" integer,
  	"alignment" "enum__pages_v_blocks_b61_divider_alignment" DEFAULT 'center',
  	"width_step" numeric,
  	"weight" "enum__pages_v_blocks_b61_divider_weight" DEFAULT 'regular',
  	"line_color" "enum__pages_v_blocks_b61_divider_line_color" DEFAULT 'accent',
  	"entrance" "enum__pages_v_blocks_b61_divider_entrance" DEFAULT 'on',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  DROP TABLE "pages_blocks_stats_band_stats" CASCADE;
  DROP TABLE "pages_blocks_stats_band" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_band_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_band" CASCADE;
  ALTER TABLE "pages_blocks_b61_stats_band_lines" ADD CONSTRAINT "pages_blocks_b61_stats_band_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_stats_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_stats_band_subheads" ADD CONSTRAINT "pages_blocks_b61_stats_band_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_stats_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_stats_band_stats" ADD CONSTRAINT "pages_blocks_b61_stats_band_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_stats_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_stats_band_buttons" ADD CONSTRAINT "pages_blocks_b61_stats_band_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_stats_band_buttons" ADD CONSTRAINT "pages_blocks_b61_stats_band_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_stats_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_stats_band" ADD CONSTRAINT "pages_blocks_b61_stats_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_gallery_lines" ADD CONSTRAINT "pages_blocks_b61_gallery_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_gallery_subheads" ADD CONSTRAINT "pages_blocks_b61_gallery_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_gallery_images" ADD CONSTRAINT "pages_blocks_b61_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_gallery_images" ADD CONSTRAINT "pages_blocks_b61_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_gallery_buttons" ADD CONSTRAINT "pages_blocks_b61_gallery_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_gallery_buttons" ADD CONSTRAINT "pages_blocks_b61_gallery_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_gallery" ADD CONSTRAINT "pages_blocks_b61_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_gallery" ADD CONSTRAINT "pages_blocks_b61_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_testimonial" ADD CONSTRAINT "pages_blocks_b61_testimonial_watermark_id_media_id_fk" FOREIGN KEY ("watermark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_testimonial" ADD CONSTRAINT "pages_blocks_b61_testimonial_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_framed_image" ADD CONSTRAINT "pages_blocks_b61_framed_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_framed_image" ADD CONSTRAINT "pages_blocks_b61_framed_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_button_bar" ADD CONSTRAINT "pages_blocks_b61_button_bar_first_link_page_id_pages_id_fk" FOREIGN KEY ("first_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_button_bar" ADD CONSTRAINT "pages_blocks_b61_button_bar_second_link_page_id_pages_id_fk" FOREIGN KEY ("second_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_button_bar" ADD CONSTRAINT "pages_blocks_b61_button_bar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_divider" ADD CONSTRAINT "pages_blocks_b61_divider_ornament_id_media_id_fk" FOREIGN KEY ("ornament_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_divider" ADD CONSTRAINT "pages_blocks_b61_divider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_stats_band_lines" ADD CONSTRAINT "_pages_v_blocks_b61_stats_band_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_stats_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_stats_band_subheads" ADD CONSTRAINT "_pages_v_blocks_b61_stats_band_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_stats_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_stats_band_stats" ADD CONSTRAINT "_pages_v_blocks_b61_stats_band_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_stats_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_stats_band_buttons" ADD CONSTRAINT "_pages_v_blocks_b61_stats_band_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_stats_band_buttons" ADD CONSTRAINT "_pages_v_blocks_b61_stats_band_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_stats_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_stats_band" ADD CONSTRAINT "_pages_v_blocks_b61_stats_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_gallery_lines" ADD CONSTRAINT "_pages_v_blocks_b61_gallery_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_gallery_subheads" ADD CONSTRAINT "_pages_v_blocks_b61_gallery_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_gallery_images" ADD CONSTRAINT "_pages_v_blocks_b61_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_gallery_images" ADD CONSTRAINT "_pages_v_blocks_b61_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_gallery_buttons" ADD CONSTRAINT "_pages_v_blocks_b61_gallery_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_gallery_buttons" ADD CONSTRAINT "_pages_v_blocks_b61_gallery_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_gallery" ADD CONSTRAINT "_pages_v_blocks_b61_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_gallery" ADD CONSTRAINT "_pages_v_blocks_b61_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_testimonial" ADD CONSTRAINT "_pages_v_blocks_b61_testimonial_watermark_id_media_id_fk" FOREIGN KEY ("watermark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_testimonial" ADD CONSTRAINT "_pages_v_blocks_b61_testimonial_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_framed_image" ADD CONSTRAINT "_pages_v_blocks_b61_framed_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_framed_image" ADD CONSTRAINT "_pages_v_blocks_b61_framed_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_button_bar" ADD CONSTRAINT "_pages_v_blocks_b61_button_bar_first_link_page_id_pages_id_fk" FOREIGN KEY ("first_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_button_bar" ADD CONSTRAINT "_pages_v_blocks_b61_button_bar_second_link_page_id_pages_id_fk" FOREIGN KEY ("second_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_button_bar" ADD CONSTRAINT "_pages_v_blocks_b61_button_bar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_divider" ADD CONSTRAINT "_pages_v_blocks_b61_divider_ornament_id_media_id_fk" FOREIGN KEY ("ornament_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_divider" ADD CONSTRAINT "_pages_v_blocks_b61_divider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_b61_stats_band_lines_order_idx" ON "pages_blocks_b61_stats_band_lines" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_stats_band_lines_parent_id_idx" ON "pages_blocks_b61_stats_band_lines" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_stats_band_subheads_order_idx" ON "pages_blocks_b61_stats_band_subheads" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_stats_band_subheads_parent_id_idx" ON "pages_blocks_b61_stats_band_subheads" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_stats_band_stats_order_idx" ON "pages_blocks_b61_stats_band_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_stats_band_stats_parent_id_idx" ON "pages_blocks_b61_stats_band_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_stats_band_buttons_order_idx" ON "pages_blocks_b61_stats_band_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_stats_band_buttons_parent_id_idx" ON "pages_blocks_b61_stats_band_buttons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_stats_band_buttons_link_link_page_idx" ON "pages_blocks_b61_stats_band_buttons" USING btree ("link_page_id");
  CREATE INDEX "pages_blocks_b61_stats_band_order_idx" ON "pages_blocks_b61_stats_band" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_stats_band_parent_id_idx" ON "pages_blocks_b61_stats_band" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_stats_band_path_idx" ON "pages_blocks_b61_stats_band" USING btree ("_path");
  CREATE INDEX "pages_blocks_b61_gallery_lines_order_idx" ON "pages_blocks_b61_gallery_lines" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_gallery_lines_parent_id_idx" ON "pages_blocks_b61_gallery_lines" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_gallery_subheads_order_idx" ON "pages_blocks_b61_gallery_subheads" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_gallery_subheads_parent_id_idx" ON "pages_blocks_b61_gallery_subheads" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_gallery_images_order_idx" ON "pages_blocks_b61_gallery_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_gallery_images_parent_id_idx" ON "pages_blocks_b61_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_gallery_images_image_idx" ON "pages_blocks_b61_gallery_images" USING btree ("image_id");
  CREATE INDEX "pages_blocks_b61_gallery_buttons_order_idx" ON "pages_blocks_b61_gallery_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_gallery_buttons_parent_id_idx" ON "pages_blocks_b61_gallery_buttons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_gallery_buttons_link_link_page_idx" ON "pages_blocks_b61_gallery_buttons" USING btree ("link_page_id");
  CREATE INDEX "pages_blocks_b61_gallery_order_idx" ON "pages_blocks_b61_gallery" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_gallery_parent_id_idx" ON "pages_blocks_b61_gallery" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_gallery_path_idx" ON "pages_blocks_b61_gallery" USING btree ("_path");
  CREATE INDEX "pages_blocks_b61_gallery_image_idx" ON "pages_blocks_b61_gallery" USING btree ("image_id");
  CREATE INDEX "pages_blocks_b61_testimonial_order_idx" ON "pages_blocks_b61_testimonial" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_testimonial_parent_id_idx" ON "pages_blocks_b61_testimonial" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_testimonial_path_idx" ON "pages_blocks_b61_testimonial" USING btree ("_path");
  CREATE INDEX "pages_blocks_b61_testimonial_watermark_idx" ON "pages_blocks_b61_testimonial" USING btree ("watermark_id");
  CREATE INDEX "pages_blocks_b61_framed_image_order_idx" ON "pages_blocks_b61_framed_image" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_framed_image_parent_id_idx" ON "pages_blocks_b61_framed_image" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_framed_image_path_idx" ON "pages_blocks_b61_framed_image" USING btree ("_path");
  CREATE INDEX "pages_blocks_b61_framed_image_image_idx" ON "pages_blocks_b61_framed_image" USING btree ("image_id");
  CREATE INDEX "pages_blocks_b61_button_bar_order_idx" ON "pages_blocks_b61_button_bar" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_button_bar_parent_id_idx" ON "pages_blocks_b61_button_bar" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_button_bar_path_idx" ON "pages_blocks_b61_button_bar" USING btree ("_path");
  CREATE INDEX "pages_blocks_b61_button_bar_first_link_first_link_page_idx" ON "pages_blocks_b61_button_bar" USING btree ("first_link_page_id");
  CREATE INDEX "pages_blocks_b61_button_bar_second_link_second_link_page_idx" ON "pages_blocks_b61_button_bar" USING btree ("second_link_page_id");
  CREATE INDEX "pages_blocks_b61_divider_order_idx" ON "pages_blocks_b61_divider" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_divider_parent_id_idx" ON "pages_blocks_b61_divider" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_divider_path_idx" ON "pages_blocks_b61_divider" USING btree ("_path");
  CREATE INDEX "pages_blocks_b61_divider_ornament_idx" ON "pages_blocks_b61_divider" USING btree ("ornament_id");
  CREATE INDEX "_pages_v_blocks_b61_stats_band_lines_order_idx" ON "_pages_v_blocks_b61_stats_band_lines" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_stats_band_lines_parent_id_idx" ON "_pages_v_blocks_b61_stats_band_lines" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_stats_band_subheads_order_idx" ON "_pages_v_blocks_b61_stats_band_subheads" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_stats_band_subheads_parent_id_idx" ON "_pages_v_blocks_b61_stats_band_subheads" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_stats_band_stats_order_idx" ON "_pages_v_blocks_b61_stats_band_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_stats_band_stats_parent_id_idx" ON "_pages_v_blocks_b61_stats_band_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_stats_band_buttons_order_idx" ON "_pages_v_blocks_b61_stats_band_buttons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_stats_band_buttons_parent_id_idx" ON "_pages_v_blocks_b61_stats_band_buttons" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_stats_band_buttons_link_link_page_idx" ON "_pages_v_blocks_b61_stats_band_buttons" USING btree ("link_page_id");
  CREATE INDEX "_pages_v_blocks_b61_stats_band_order_idx" ON "_pages_v_blocks_b61_stats_band" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_stats_band_parent_id_idx" ON "_pages_v_blocks_b61_stats_band" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_stats_band_path_idx" ON "_pages_v_blocks_b61_stats_band" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_b61_gallery_lines_order_idx" ON "_pages_v_blocks_b61_gallery_lines" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_gallery_lines_parent_id_idx" ON "_pages_v_blocks_b61_gallery_lines" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_gallery_subheads_order_idx" ON "_pages_v_blocks_b61_gallery_subheads" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_gallery_subheads_parent_id_idx" ON "_pages_v_blocks_b61_gallery_subheads" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_gallery_images_order_idx" ON "_pages_v_blocks_b61_gallery_images" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_gallery_images_parent_id_idx" ON "_pages_v_blocks_b61_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_gallery_images_image_idx" ON "_pages_v_blocks_b61_gallery_images" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_b61_gallery_buttons_order_idx" ON "_pages_v_blocks_b61_gallery_buttons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_gallery_buttons_parent_id_idx" ON "_pages_v_blocks_b61_gallery_buttons" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_gallery_buttons_link_link_page_idx" ON "_pages_v_blocks_b61_gallery_buttons" USING btree ("link_page_id");
  CREATE INDEX "_pages_v_blocks_b61_gallery_order_idx" ON "_pages_v_blocks_b61_gallery" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_gallery_parent_id_idx" ON "_pages_v_blocks_b61_gallery" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_gallery_path_idx" ON "_pages_v_blocks_b61_gallery" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_b61_gallery_image_idx" ON "_pages_v_blocks_b61_gallery" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_b61_testimonial_order_idx" ON "_pages_v_blocks_b61_testimonial" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_testimonial_parent_id_idx" ON "_pages_v_blocks_b61_testimonial" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_testimonial_path_idx" ON "_pages_v_blocks_b61_testimonial" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_b61_testimonial_watermark_idx" ON "_pages_v_blocks_b61_testimonial" USING btree ("watermark_id");
  CREATE INDEX "_pages_v_blocks_b61_framed_image_order_idx" ON "_pages_v_blocks_b61_framed_image" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_framed_image_parent_id_idx" ON "_pages_v_blocks_b61_framed_image" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_framed_image_path_idx" ON "_pages_v_blocks_b61_framed_image" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_b61_framed_image_image_idx" ON "_pages_v_blocks_b61_framed_image" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_b61_button_bar_order_idx" ON "_pages_v_blocks_b61_button_bar" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_button_bar_parent_id_idx" ON "_pages_v_blocks_b61_button_bar" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_button_bar_path_idx" ON "_pages_v_blocks_b61_button_bar" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_b61_button_bar_first_link_first_link_pag_idx" ON "_pages_v_blocks_b61_button_bar" USING btree ("first_link_page_id");
  CREATE INDEX "_pages_v_blocks_b61_button_bar_second_link_second_link_p_idx" ON "_pages_v_blocks_b61_button_bar" USING btree ("second_link_page_id");
  CREATE INDEX "_pages_v_blocks_b61_divider_order_idx" ON "_pages_v_blocks_b61_divider" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_divider_parent_id_idx" ON "_pages_v_blocks_b61_divider" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_divider_path_idx" ON "_pages_v_blocks_b61_divider" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_b61_divider_ornament_idx" ON "_pages_v_blocks_b61_divider" USING btree ("ornament_id");
  DROP TYPE "public"."enum_pages_blocks_stats_band_tone";
  DROP TYPE "public"."enum__pages_v_blocks_stats_band_tone";`)

  await upgradeStatsBands(payload, req, old)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_stats_band_tone" AS ENUM('light', 'muted', 'brand', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_stats_band_tone" AS ENUM('light', 'muted', 'brand', 'dark');
  CREATE TABLE "pages_blocks_stats_band_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_stats_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"tone" "enum_pages_blocks_stats_band_tone" DEFAULT 'light',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats_band_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"tone" "enum__pages_v_blocks_stats_band_tone" DEFAULT 'light',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  DROP TABLE "pages_blocks_b61_stats_band_lines" CASCADE;
  DROP TABLE "pages_blocks_b61_stats_band_subheads" CASCADE;
  DROP TABLE "pages_blocks_b61_stats_band_stats" CASCADE;
  DROP TABLE "pages_blocks_b61_stats_band_buttons" CASCADE;
  DROP TABLE "pages_blocks_b61_stats_band" CASCADE;
  DROP TABLE "pages_blocks_b61_gallery_lines" CASCADE;
  DROP TABLE "pages_blocks_b61_gallery_subheads" CASCADE;
  DROP TABLE "pages_blocks_b61_gallery_images" CASCADE;
  DROP TABLE "pages_blocks_b61_gallery_buttons" CASCADE;
  DROP TABLE "pages_blocks_b61_gallery" CASCADE;
  DROP TABLE "pages_blocks_b61_testimonial" CASCADE;
  DROP TABLE "pages_blocks_b61_framed_image" CASCADE;
  DROP TABLE "pages_blocks_b61_button_bar" CASCADE;
  DROP TABLE "pages_blocks_b61_divider" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_stats_band_lines" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_stats_band_subheads" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_stats_band_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_stats_band_buttons" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_stats_band" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_gallery_lines" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_gallery_subheads" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_gallery_images" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_gallery_buttons" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_gallery" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_testimonial" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_framed_image" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_button_bar" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_divider" CASCADE;
  ALTER TABLE "pages_blocks_stats_band_stats" ADD CONSTRAINT "pages_blocks_stats_band_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_band" ADD CONSTRAINT "pages_blocks_stats_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_band_stats" ADD CONSTRAINT "_pages_v_blocks_stats_band_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_band" ADD CONSTRAINT "_pages_v_blocks_stats_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_stats_band_stats_order_idx" ON "pages_blocks_stats_band_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_band_stats_parent_id_idx" ON "pages_blocks_stats_band_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_band_order_idx" ON "pages_blocks_stats_band" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_band_parent_id_idx" ON "pages_blocks_stats_band" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_band_path_idx" ON "pages_blocks_stats_band" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_stats_band_stats_order_idx" ON "_pages_v_blocks_stats_band_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_band_stats_parent_id_idx" ON "_pages_v_blocks_stats_band_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_band_order_idx" ON "_pages_v_blocks_stats_band" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_band_parent_id_idx" ON "_pages_v_blocks_stats_band" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_band_path_idx" ON "_pages_v_blocks_stats_band" USING btree ("_path");
  DROP TYPE "public"."enum_pages_blocks_b61_stats_band_buttons_variant";
  DROP TYPE "public"."enum_pages_blocks_b61_stats_band_buttons_link_type";
  DROP TYPE "public"."enum_pages_blocks_b61_stats_band_heading_level";
  DROP TYPE "public"."enum_pages_blocks_b61_stats_band_columns";
  DROP TYPE "public"."enum_pages_blocks_b61_stats_band_label_position";
  DROP TYPE "public"."enum_pages_blocks_b61_stats_band_text_align";
  DROP TYPE "public"."enum_pages_blocks_b61_stats_band_pad_top";
  DROP TYPE "public"."enum_pages_blocks_b61_stats_band_pad_bottom";
  DROP TYPE "public"."enum_pages_blocks_b61_stats_band_item_style";
  DROP TYPE "public"."enum_pages_blocks_b61_stats_band_figure_scale";
  DROP TYPE "public"."enum_pages_blocks_b61_stats_band_surface";
  DROP TYPE "public"."enum_pages_blocks_b61_stats_band_item_surface";
  DROP TYPE "public"."enum_pages_blocks_b61_stats_band_eyebrow_rule";
  DROP TYPE "public"."enum_pages_blocks_b61_stats_band_entrance";
  DROP TYPE "public"."enum_pages_blocks_b61_gallery_buttons_variant";
  DROP TYPE "public"."enum_pages_blocks_b61_gallery_buttons_link_type";
  DROP TYPE "public"."enum_pages_blocks_b61_gallery_heading_level";
  DROP TYPE "public"."enum_pages_blocks_b61_gallery_media";
  DROP TYPE "public"."enum_pages_blocks_b61_gallery_gallery_layout";
  DROP TYPE "public"."enum_pages_blocks_b61_gallery_text_position";
  DROP TYPE "public"."enum_pages_blocks_b61_gallery_heading_align";
  DROP TYPE "public"."enum_pages_blocks_b61_gallery_pad_top";
  DROP TYPE "public"."enum_pages_blocks_b61_gallery_pad_bottom";
  DROP TYPE "public"."enum_pages_blocks_b61_gallery_item_size";
  DROP TYPE "public"."enum_pages_blocks_b61_gallery_columns";
  DROP TYPE "public"."enum_pages_blocks_b61_gallery_image_shape";
  DROP TYPE "public"."enum_pages_blocks_b61_gallery_surface";
  DROP TYPE "public"."enum_pages_blocks_b61_gallery_eyebrow_rule";
  DROP TYPE "public"."enum_pages_blocks_b61_gallery_entrance";
  DROP TYPE "public"."enum_pages_blocks_b61_testimonial_text_align";
  DROP TYPE "public"."enum_pages_blocks_b61_testimonial_text_style";
  DROP TYPE "public"."enum_pages_blocks_b61_testimonial_pad_top";
  DROP TYPE "public"."enum_pages_blocks_b61_testimonial_pad_bottom";
  DROP TYPE "public"."enum_pages_blocks_b61_testimonial_surface";
  DROP TYPE "public"."enum_pages_blocks_b61_testimonial_eyebrow_rule";
  DROP TYPE "public"."enum_pages_blocks_b61_testimonial_entrance";
  DROP TYPE "public"."enum_pages_blocks_b61_framed_image_image_shape";
  DROP TYPE "public"."enum_pages_blocks_b61_framed_image_image_height";
  DROP TYPE "public"."enum_pages_blocks_b61_framed_image_frame_color";
  DROP TYPE "public"."enum_pages_blocks_b61_framed_image_entrance";
  DROP TYPE "public"."enum_pages_blocks_b61_button_bar_first_link_type";
  DROP TYPE "public"."enum_pages_blocks_b61_button_bar_second_link_type";
  DROP TYPE "public"."enum_pages_blocks_b61_button_bar_size";
  DROP TYPE "public"."enum_pages_blocks_b61_button_bar_first_color";
  DROP TYPE "public"."enum_pages_blocks_b61_button_bar_second_color";
  DROP TYPE "public"."enum_pages_blocks_b61_button_bar_entrance";
  DROP TYPE "public"."enum_pages_blocks_b61_divider_line_style";
  DROP TYPE "public"."enum_pages_blocks_b61_divider_alignment";
  DROP TYPE "public"."enum_pages_blocks_b61_divider_weight";
  DROP TYPE "public"."enum_pages_blocks_b61_divider_line_color";
  DROP TYPE "public"."enum_pages_blocks_b61_divider_entrance";
  DROP TYPE "public"."enum__pages_v_blocks_b61_stats_band_buttons_variant";
  DROP TYPE "public"."enum__pages_v_blocks_b61_stats_band_buttons_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_b61_stats_band_heading_level";
  DROP TYPE "public"."enum__pages_v_blocks_b61_stats_band_columns";
  DROP TYPE "public"."enum__pages_v_blocks_b61_stats_band_label_position";
  DROP TYPE "public"."enum__pages_v_blocks_b61_stats_band_text_align";
  DROP TYPE "public"."enum__pages_v_blocks_b61_stats_band_pad_top";
  DROP TYPE "public"."enum__pages_v_blocks_b61_stats_band_pad_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_b61_stats_band_item_style";
  DROP TYPE "public"."enum__pages_v_blocks_b61_stats_band_figure_scale";
  DROP TYPE "public"."enum__pages_v_blocks_b61_stats_band_surface";
  DROP TYPE "public"."enum__pages_v_blocks_b61_stats_band_item_surface";
  DROP TYPE "public"."enum__pages_v_blocks_b61_stats_band_eyebrow_rule";
  DROP TYPE "public"."enum__pages_v_blocks_b61_stats_band_entrance";
  DROP TYPE "public"."enum__pages_v_blocks_b61_gallery_buttons_variant";
  DROP TYPE "public"."enum__pages_v_blocks_b61_gallery_buttons_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_b61_gallery_heading_level";
  DROP TYPE "public"."enum__pages_v_blocks_b61_gallery_media";
  DROP TYPE "public"."enum__pages_v_blocks_b61_gallery_gallery_layout";
  DROP TYPE "public"."enum__pages_v_blocks_b61_gallery_text_position";
  DROP TYPE "public"."enum__pages_v_blocks_b61_gallery_heading_align";
  DROP TYPE "public"."enum__pages_v_blocks_b61_gallery_pad_top";
  DROP TYPE "public"."enum__pages_v_blocks_b61_gallery_pad_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_b61_gallery_item_size";
  DROP TYPE "public"."enum__pages_v_blocks_b61_gallery_columns";
  DROP TYPE "public"."enum__pages_v_blocks_b61_gallery_image_shape";
  DROP TYPE "public"."enum__pages_v_blocks_b61_gallery_surface";
  DROP TYPE "public"."enum__pages_v_blocks_b61_gallery_eyebrow_rule";
  DROP TYPE "public"."enum__pages_v_blocks_b61_gallery_entrance";
  DROP TYPE "public"."enum__pages_v_blocks_b61_testimonial_text_align";
  DROP TYPE "public"."enum__pages_v_blocks_b61_testimonial_text_style";
  DROP TYPE "public"."enum__pages_v_blocks_b61_testimonial_pad_top";
  DROP TYPE "public"."enum__pages_v_blocks_b61_testimonial_pad_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_b61_testimonial_surface";
  DROP TYPE "public"."enum__pages_v_blocks_b61_testimonial_eyebrow_rule";
  DROP TYPE "public"."enum__pages_v_blocks_b61_testimonial_entrance";
  DROP TYPE "public"."enum__pages_v_blocks_b61_framed_image_image_shape";
  DROP TYPE "public"."enum__pages_v_blocks_b61_framed_image_image_height";
  DROP TYPE "public"."enum__pages_v_blocks_b61_framed_image_frame_color";
  DROP TYPE "public"."enum__pages_v_blocks_b61_framed_image_entrance";
  DROP TYPE "public"."enum__pages_v_blocks_b61_button_bar_first_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_b61_button_bar_second_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_b61_button_bar_size";
  DROP TYPE "public"."enum__pages_v_blocks_b61_button_bar_first_color";
  DROP TYPE "public"."enum__pages_v_blocks_b61_button_bar_second_color";
  DROP TYPE "public"."enum__pages_v_blocks_b61_button_bar_entrance";
  DROP TYPE "public"."enum__pages_v_blocks_b61_divider_line_style";
  DROP TYPE "public"."enum__pages_v_blocks_b61_divider_alignment";
  DROP TYPE "public"."enum__pages_v_blocks_b61_divider_weight";
  DROP TYPE "public"."enum__pages_v_blocks_b61_divider_line_color";
  DROP TYPE "public"."enum__pages_v_blocks_b61_divider_entrance";`)
}
