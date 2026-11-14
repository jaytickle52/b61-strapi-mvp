import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_b61_hero_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum_pages_blocks_b61_hero_buttons_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum_pages_blocks_b61_hero_layout_mode" AS ENUM('cover', 'band');
  CREATE TYPE "public"."enum_pages_blocks_b61_hero_heading_level" AS ENUM('auto', 'h1', 'h2', 'h3');
  CREATE TYPE "public"."enum_pages_blocks_b61_hero_subheadline_scale" AS ENUM('display', 'body', 'meta');
  CREATE TYPE "public"."enum_pages_blocks_b61_hero_background_type" AS ENUM('image', 'slideshow', 'video');
  CREATE TYPE "public"."enum_pages_blocks_b61_hero_height" AS ENUM('short', 'medium', 'tall', 'full');
  CREATE TYPE "public"."enum_pages_blocks_b61_hero_band_size" AS ENUM('compact', 'standard');
  CREATE TYPE "public"."enum_pages_blocks_b61_hero_vertical_position" AS ENUM('top', 'center', 'bottom');
  CREATE TYPE "public"."enum_pages_blocks_b61_hero_text_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_b61_hero_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_hero_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_hero_overlay" AS ENUM('gradient', 'wash');
  CREATE TYPE "public"."enum_pages_blocks_b61_hero_surface" AS ENUM('light', 'primary', 'secondary');
  CREATE TYPE "public"."enum_pages_blocks_b61_hero_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum_pages_blocks_b61_hero_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum_pages_blocks_b61_split_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum_pages_blocks_b61_split_buttons_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum_pages_blocks_b61_split_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum_pages_blocks_b61_split_media" AS ENUM('photo', 'gallery', 'video');
  CREATE TYPE "public"."enum_pages_blocks_b61_split_columns" AS ENUM('1', '2', '3');
  CREATE TYPE "public"."enum_pages_blocks_b61_split_image_shape" AS ENUM('fixed', 'portrait', 'square', 'landscape', 'wide');
  CREATE TYPE "public"."enum_pages_blocks_b61_split_image_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_b61_split_vertical_position" AS ENUM('top', 'center');
  CREATE TYPE "public"."enum_pages_blocks_b61_split_stack_order" AS ENUM('text', 'media');
  CREATE TYPE "public"."enum_pages_blocks_b61_split_column_height" AS ENUM('fit', 'fill');
  CREATE TYPE "public"."enum_pages_blocks_b61_split_heading_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_b61_split_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_split_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_split_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_pages_blocks_b61_split_text_panel" AS ENUM('none', 'plain', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_pages_blocks_b61_split_frame_color" AS ENUM('primary', 'secondary', 'accent');
  CREATE TYPE "public"."enum_pages_blocks_b61_split_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum_pages_blocks_b61_split_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum_pages_blocks_b61_prose_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum_pages_blocks_b61_prose_buttons_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum_pages_blocks_b61_prose_heading_level" AS ENUM('auto', 'h1', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum_pages_blocks_b61_prose_head_position" AS ENUM('above', 'beside');
  CREATE TYPE "public"."enum_pages_blocks_b61_prose_text_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_b61_prose_position" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_b61_prose_heading_width" AS ENUM('text', 'full');
  CREATE TYPE "public"."enum_pages_blocks_b61_prose_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_prose_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_prose_iconlist_style" AS ENUM('standard', 'links');
  CREATE TYPE "public"."enum_pages_blocks_b61_prose_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_pages_blocks_b61_prose_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum_pages_blocks_b61_prose_heading_rule" AS ENUM('site', 'none', 'trailing');
  CREATE TYPE "public"."enum_pages_blocks_b61_prose_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_cards_icon" AS ENUM('check', 'email', 'phone', 'location', 'calendar', 'clock', 'link', 'star', 'heart', 'book', 'people', 'cross', 'school');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_cards_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_buttons_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_source" AS ENUM('manual', 'programs', 'upcoming-events', 'latest-news', 'staff');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_media_type" AS ENUM('image', 'icon', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_arrangement" AS ENUM('grid', 'carousel');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_columns" AS ENUM('1', '2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_text_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_advance" AS ENUM('one', 'view');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_peek" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_controls_position" AS ENUM('top-right', 'bottom-left', 'bottom-center', 'bottom-right', 'sides', 'hidden');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_card_style" AS ENUM('plain', 'flat', 'bordered', 'overlay');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_card_shape" AS ENUM('portrait', 'square', 'landscape', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_image_shape" AS ENUM('fixed', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_card_text_position" AS ENUM('top', 'center', 'bottom');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_icon_size" AS ENUM('sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_cta_case" AS ENUM('upper', 'normal');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_cta_size" AS ENUM('sm', 'md', 'lg');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_card_surface" AS ENUM('light', 'soft', 'primary');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_card_overlay" AS ENUM('none', 'gradient', 'wash');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum_pages_blocks_b61_card_grid_entrance" AS ENUM('on', 'off');
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
  CREATE TYPE "public"."enum_pages_blocks_b61_tabs_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum_pages_blocks_b61_tabs_tab_position" AS ENUM('top', 'left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_b61_tabs_tab_align" AS ENUM('left', 'center', 'full');
  CREATE TYPE "public"."enum_pages_blocks_b61_tabs_heading_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_b61_tabs_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_tabs_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_tabs_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_pages_blocks_b61_tabs_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum_pages_blocks_b61_tabs_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum_pages_blocks_b61_pillars_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum_pages_blocks_b61_pillars_tab_position" AS ENUM('left', 'right', 'top');
  CREATE TYPE "public"."enum_pages_blocks_b61_pillars_tab_align" AS ENUM('left', 'center', 'full');
  CREATE TYPE "public"."enum_pages_blocks_b61_pillars_heading_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_b61_pillars_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_pillars_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_pillars_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_pages_blocks_b61_pillars_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum_pages_blocks_b61_pillars_entrance" AS ENUM('on', 'off');
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
  CREATE TYPE "public"."enum_pages_blocks_b61_framed_image_image_shape" AS ENUM('fixed', 'portrait', 'square', 'landscape', 'wide', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_b61_framed_image_image_height" AS ENUM('360px', '460px', '560px', '680px');
  CREATE TYPE "public"."enum_pages_blocks_b61_framed_image_frame_color" AS ENUM('primary', 'secondary', 'accent');
  CREATE TYPE "public"."enum_pages_blocks_b61_framed_image_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum_pages_blocks_b61_cta_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum_pages_blocks_b61_cta_buttons_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum_pages_blocks_b61_cta_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum_pages_blocks_b61_cta_text_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_b61_cta_position" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_b61_cta_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_cta_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_pages_blocks_b61_cta_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_pages_blocks_b61_cta_text_panel" AS ENUM('none', 'plain', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_pages_blocks_b61_cta_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum_pages_blocks_b61_cta_entrance" AS ENUM('on', 'off');
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
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_hero_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_hero_buttons_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_hero_layout_mode" AS ENUM('cover', 'band');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_hero_heading_level" AS ENUM('auto', 'h1', 'h2', 'h3');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_hero_subheadline_scale" AS ENUM('display', 'body', 'meta');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_hero_background_type" AS ENUM('image', 'slideshow', 'video');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_hero_height" AS ENUM('short', 'medium', 'tall', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_hero_band_size" AS ENUM('compact', 'standard');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_hero_vertical_position" AS ENUM('top', 'center', 'bottom');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_hero_text_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_hero_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_hero_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_hero_overlay" AS ENUM('gradient', 'wash');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_hero_surface" AS ENUM('light', 'primary', 'secondary');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_hero_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_hero_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_buttons_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_media" AS ENUM('photo', 'gallery', 'video');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_columns" AS ENUM('1', '2', '3');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_image_shape" AS ENUM('fixed', 'portrait', 'square', 'landscape', 'wide');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_image_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_vertical_position" AS ENUM('top', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_stack_order" AS ENUM('text', 'media');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_column_height" AS ENUM('fit', 'fill');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_heading_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_text_panel" AS ENUM('none', 'plain', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_frame_color" AS ENUM('primary', 'secondary', 'accent');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_split_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_prose_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_prose_buttons_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_prose_heading_level" AS ENUM('auto', 'h1', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_prose_head_position" AS ENUM('above', 'beside');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_prose_text_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_prose_position" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_prose_heading_width" AS ENUM('text', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_prose_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_prose_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_prose_iconlist_style" AS ENUM('standard', 'links');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_prose_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_prose_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_prose_heading_rule" AS ENUM('site', 'none', 'trailing');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_prose_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_cards_icon" AS ENUM('check', 'email', 'phone', 'location', 'calendar', 'clock', 'link', 'star', 'heart', 'book', 'people', 'cross', 'school');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_cards_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_buttons_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_source" AS ENUM('manual', 'programs', 'upcoming-events', 'latest-news', 'staff');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_media_type" AS ENUM('image', 'icon', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_arrangement" AS ENUM('grid', 'carousel');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_columns" AS ENUM('1', '2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_text_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_advance" AS ENUM('one', 'view');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_peek" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_controls_position" AS ENUM('top-right', 'bottom-left', 'bottom-center', 'bottom-right', 'sides', 'hidden');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_card_style" AS ENUM('plain', 'flat', 'bordered', 'overlay');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_card_shape" AS ENUM('portrait', 'square', 'landscape', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_image_shape" AS ENUM('fixed', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_card_text_position" AS ENUM('top', 'center', 'bottom');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_icon_size" AS ENUM('sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_cta_case" AS ENUM('upper', 'normal');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_cta_size" AS ENUM('sm', 'md', 'lg');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_card_surface" AS ENUM('light', 'soft', 'primary');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_card_overlay" AS ENUM('none', 'gradient', 'wash');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_card_grid_entrance" AS ENUM('on', 'off');
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
  CREATE TYPE "public"."enum__pages_v_blocks_b61_tabs_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_tabs_tab_position" AS ENUM('top', 'left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_tabs_tab_align" AS ENUM('left', 'center', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_tabs_heading_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_tabs_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_tabs_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_tabs_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_tabs_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_tabs_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_pillars_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_pillars_tab_position" AS ENUM('left', 'right', 'top');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_pillars_tab_align" AS ENUM('left', 'center', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_pillars_heading_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_pillars_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_pillars_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_pillars_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_pillars_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_pillars_entrance" AS ENUM('on', 'off');
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
  CREATE TYPE "public"."enum__pages_v_blocks_b61_framed_image_image_shape" AS ENUM('fixed', 'portrait', 'square', 'landscape', 'wide', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_framed_image_image_height" AS ENUM('360px', '460px', '560px', '680px');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_framed_image_frame_color" AS ENUM('primary', 'secondary', 'accent');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_framed_image_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_cta_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_cta_buttons_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_cta_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_cta_text_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_cta_position" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_cta_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_cta_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_cta_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_cta_text_panel" AS ENUM('none', 'plain', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_cta_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum__pages_v_blocks_b61_cta_entrance" AS ENUM('on', 'off');
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
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_events_audience" AS ENUM('public', 'parents');
  CREATE TYPE "public"."enum_events_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__events_v_version_audience" AS ENUM('public', 'parents');
  CREATE TYPE "public"."enum__events_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_news_audience" AS ENUM('public', 'parents');
  CREATE TYPE "public"."enum_news_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__news_v_version_audience" AS ENUM('public', 'parents');
  CREATE TYPE "public"."enum__news_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_programs_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__programs_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_staff_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__staff_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_school_settings_menu_links_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum_school_settings_menu_columns_links_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum_school_settings_menu_kind" AS ENUM('link', 'dropdown', 'mega');
  CREATE TYPE "public"."enum_school_settings_menu_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum_school_settings_menu_feature_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum_school_settings_utility_links_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum_school_settings_footer_columns_links_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum_school_settings_social_platform" AS ENUM('facebook', 'instagram', 'youtube', 'x', 'linkedin', 'tiktok', 'vimeo');
  CREATE TYPE "public"."enum_school_settings_legal_links_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum_school_settings_heading_font" AS ENUM('Fraunces', 'Playfair Display', 'Merriweather', 'EB Garamond', 'Montserrat', 'Poppins');
  CREATE TYPE "public"."enum_school_settings_body_font" AS ENUM('Inter', 'Source Sans 3', 'Lato', 'Open Sans', 'EB Garamond');
  CREATE TYPE "public"."enum_school_settings_ui_font" AS ENUM('Montserrat', 'Inter', 'Poppins', 'Lato', 'Source Sans 3');
  CREATE TYPE "public"."enum_school_settings_header_button_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum_school_settings_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__school_settings_v_version_menu_links_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum__school_settings_v_version_menu_columns_links_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum__school_settings_v_version_menu_kind" AS ENUM('link', 'dropdown', 'mega');
  CREATE TYPE "public"."enum__school_settings_v_version_menu_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum__school_settings_v_version_menu_feature_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum__school_settings_v_version_utility_links_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum__school_settings_v_version_footer_columns_links_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum__school_settings_v_version_social_platform" AS ENUM('facebook', 'instagram', 'youtube', 'x', 'linkedin', 'tiktok', 'vimeo');
  CREATE TYPE "public"."enum__school_settings_v_version_legal_links_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum__school_settings_v_version_heading_font" AS ENUM('Fraunces', 'Playfair Display', 'Merriweather', 'EB Garamond', 'Montserrat', 'Poppins');
  CREATE TYPE "public"."enum__school_settings_v_version_body_font" AS ENUM('Inter', 'Source Sans 3', 'Lato', 'Open Sans', 'EB Garamond');
  CREATE TYPE "public"."enum__school_settings_v_version_ui_font" AS ENUM('Montserrat', 'Inter', 'Poppins', 'Lato', 'Source Sans 3');
  CREATE TYPE "public"."enum__school_settings_v_version_header_button_link_type" AS ENUM('page', 'url');
  CREATE TYPE "public"."enum__school_settings_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_users_role" AS ENUM('editor', 'admin');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TABLE "pages_blocks_b61_hero_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_hero_meta_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_b61_hero_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum_pages_blocks_b61_hero_buttons_variant" DEFAULT 'primary',
  	"link_type" "enum_pages_blocks_b61_hero_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"full_width" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_hero_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_b61_hero_collage" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_b61_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_mode" "enum_pages_blocks_b61_hero_layout_mode" DEFAULT 'cover',
  	"eyebrow" varchar,
  	"heading_level" "enum_pages_blocks_b61_hero_heading_level" DEFAULT 'auto',
  	"subheadline_scale" "enum_pages_blocks_b61_hero_subheadline_scale" DEFAULT 'body',
  	"subheadline" varchar,
  	"background_type" "enum_pages_blocks_b61_hero_background_type" DEFAULT 'image',
  	"image_id" integer,
  	"video_id" integer,
  	"video_webm_id" integer,
  	"poster_id" integer,
  	"overlay_strength" numeric,
  	"height" "enum_pages_blocks_b61_hero_height" DEFAULT 'tall',
  	"band_size" "enum_pages_blocks_b61_hero_band_size" DEFAULT 'standard',
  	"vertical_position" "enum_pages_blocks_b61_hero_vertical_position" DEFAULT 'bottom',
  	"text_align" "enum_pages_blocks_b61_hero_text_align" DEFAULT 'left',
  	"column_balance" numeric,
  	"subheadline_width" numeric,
  	"pad_top" "enum_pages_blocks_b61_hero_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum_pages_blocks_b61_hero_pad_bottom" DEFAULT 'normal',
  	"overlay" "enum_pages_blocks_b61_hero_overlay" DEFAULT 'gradient',
  	"surface" "enum_pages_blocks_b61_hero_surface" DEFAULT 'primary',
  	"eyebrow_rule" "enum_pages_blocks_b61_hero_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum_pages_blocks_b61_hero_entrance" DEFAULT 'on',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_b61_split_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_split_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_b61_split_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum_pages_blocks_b61_split_buttons_variant" DEFAULT 'primary',
  	"link_type" "enum_pages_blocks_b61_split_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"full_width" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_split_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "pages_blocks_b61_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading_level" "enum_pages_blocks_b61_split_heading_level" DEFAULT 'auto',
  	"body" jsonb,
  	"media" "enum_pages_blocks_b61_split_media" DEFAULT 'photo',
  	"image_id" integer,
  	"caption" varchar,
  	"columns" "enum_pages_blocks_b61_split_columns" DEFAULT '2',
  	"video" varchar,
  	"image_shape" "enum_pages_blocks_b61_split_image_shape" DEFAULT 'fixed',
  	"image_side" "enum_pages_blocks_b61_split_image_side" DEFAULT 'right',
  	"vertical_position" "enum_pages_blocks_b61_split_vertical_position" DEFAULT 'center',
  	"stack_order" "enum_pages_blocks_b61_split_stack_order" DEFAULT 'text',
  	"column_height" "enum_pages_blocks_b61_split_column_height" DEFAULT 'fit',
  	"overlap" boolean,
  	"heading_align" "enum_pages_blocks_b61_split_heading_align" DEFAULT 'left',
  	"column_balance" numeric,
  	"pad_top" "enum_pages_blocks_b61_split_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum_pages_blocks_b61_split_pad_bottom" DEFAULT 'normal',
  	"surface" "enum_pages_blocks_b61_split_surface" DEFAULT 'none',
  	"text_panel" "enum_pages_blocks_b61_split_text_panel" DEFAULT 'none',
  	"frame_color" "enum_pages_blocks_b61_split_frame_color" DEFAULT 'primary',
  	"eyebrow_rule" "enum_pages_blocks_b61_split_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum_pages_blocks_b61_split_entrance" DEFAULT 'on',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_b61_prose_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_prose_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_b61_prose_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum_pages_blocks_b61_prose_buttons_variant" DEFAULT 'primary',
  	"link_type" "enum_pages_blocks_b61_prose_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"full_width" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_prose" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading_level" "enum_pages_blocks_b61_prose_heading_level" DEFAULT 'auto',
  	"body" jsonb,
  	"head_position" "enum_pages_blocks_b61_prose_head_position" DEFAULT 'above',
  	"column_balance" numeric,
  	"text_align" "enum_pages_blocks_b61_prose_text_align" DEFAULT 'left',
  	"position" "enum_pages_blocks_b61_prose_position" DEFAULT 'center',
  	"measure_step" numeric,
  	"heading_width" "enum_pages_blocks_b61_prose_heading_width" DEFAULT 'text',
  	"pad_top" "enum_pages_blocks_b61_prose_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum_pages_blocks_b61_prose_pad_bottom" DEFAULT 'normal',
  	"iconlist_style" "enum_pages_blocks_b61_prose_iconlist_style" DEFAULT 'standard',
  	"iconlist_edges" boolean,
  	"surface" "enum_pages_blocks_b61_prose_surface" DEFAULT 'none',
  	"eyebrow_rule" "enum_pages_blocks_b61_prose_eyebrow_rule" DEFAULT 'site',
  	"heading_rule" "enum_pages_blocks_b61_prose_heading_rule" DEFAULT 'site',
  	"entrance" "enum_pages_blocks_b61_prose_entrance" DEFAULT 'on',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_b61_card_grid_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_card_grid_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_b61_card_grid_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"icon" "enum_pages_blocks_b61_card_grid_cards_icon" DEFAULT 'star',
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" jsonb,
  	"link_type" "enum_pages_blocks_b61_card_grid_cards_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"link_text" varchar
  );
  
  CREATE TABLE "pages_blocks_b61_card_grid_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum_pages_blocks_b61_card_grid_buttons_variant" DEFAULT 'primary',
  	"link_type" "enum_pages_blocks_b61_card_grid_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"full_width" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_card_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading_level" "enum_pages_blocks_b61_card_grid_heading_level" DEFAULT 'auto',
  	"intro" jsonb,
  	"source" "enum_pages_blocks_b61_card_grid_source" DEFAULT 'manual',
  	"limit" numeric DEFAULT 3,
  	"media_type" "enum_pages_blocks_b61_card_grid_media_type" DEFAULT 'image',
  	"arrangement" "enum_pages_blocks_b61_card_grid_arrangement" DEFAULT 'grid',
  	"columns" "enum_pages_blocks_b61_card_grid_columns" DEFAULT '3',
  	"text_align" "enum_pages_blocks_b61_card_grid_text_align" DEFAULT 'left',
  	"advance" "enum_pages_blocks_b61_card_grid_advance" DEFAULT 'one',
  	"peek" "enum_pages_blocks_b61_card_grid_peek" DEFAULT 'small',
  	"controls_position" "enum_pages_blocks_b61_card_grid_controls_position" DEFAULT 'top-right',
  	"show_counter" boolean,
  	"show_progress" boolean,
  	"pad_top" "enum_pages_blocks_b61_card_grid_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum_pages_blocks_b61_card_grid_pad_bottom" DEFAULT 'normal',
  	"card_style" "enum_pages_blocks_b61_card_grid_card_style" DEFAULT 'bordered',
  	"card_shape" "enum_pages_blocks_b61_card_grid_card_shape" DEFAULT 'portrait',
  	"image_shape" "enum_pages_blocks_b61_card_grid_image_shape" DEFAULT 'fixed',
  	"ratio_w" numeric,
  	"ratio_h" numeric,
  	"card_text_position" "enum_pages_blocks_b61_card_grid_card_text_position" DEFAULT 'bottom',
  	"media_round" boolean,
  	"icon_size" "enum_pages_blocks_b61_card_grid_icon_size" DEFAULT 'sm',
  	"show_numbers" boolean,
  	"cta_case" "enum_pages_blocks_b61_card_grid_cta_case" DEFAULT 'upper',
  	"cta_size" "enum_pages_blocks_b61_card_grid_cta_size" DEFAULT 'sm',
  	"surface" "enum_pages_blocks_b61_card_grid_surface" DEFAULT 'none',
  	"card_surface" "enum_pages_blocks_b61_card_grid_card_surface" DEFAULT 'light',
  	"card_overlay" "enum_pages_blocks_b61_card_grid_card_overlay" DEFAULT 'gradient',
  	"eyebrow_rule" "enum_pages_blocks_b61_card_grid_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum_pages_blocks_b61_card_grid_entrance" DEFAULT 'on',
  	"block_name" varchar
  );
  
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
  
  CREATE TABLE "pages_blocks_b61_cta_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_cta_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_b61_cta_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum_pages_blocks_b61_cta_buttons_variant" DEFAULT 'primary',
  	"link_type" "enum_pages_blocks_b61_cta_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"full_width" boolean
  );
  
  CREATE TABLE "pages_blocks_b61_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading_level" "enum_pages_blocks_b61_cta_heading_level" DEFAULT 'auto',
  	"body" jsonb,
  	"image_id" integer,
  	"overlay_strength" numeric,
  	"text_align" "enum_pages_blocks_b61_cta_text_align" DEFAULT 'center',
  	"position" "enum_pages_blocks_b61_cta_position" DEFAULT 'center',
  	"width_step" numeric,
  	"pad_top" "enum_pages_blocks_b61_cta_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum_pages_blocks_b61_cta_pad_bottom" DEFAULT 'normal',
  	"surface" "enum_pages_blocks_b61_cta_surface" DEFAULT 'soft',
  	"text_panel" "enum_pages_blocks_b61_cta_text_panel" DEFAULT 'none',
  	"eyebrow_rule" "enum_pages_blocks_b61_cta_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum_pages_blocks_b61_cta_entrance" DEFAULT 'on',
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
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"school_id" integer,
  	"title" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"seo_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_pages_v_blocks_b61_hero_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_hero_meta_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_hero_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum__pages_v_blocks_b61_hero_buttons_variant" DEFAULT 'primary',
  	"link_type" "enum__pages_v_blocks_b61_hero_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"full_width" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_hero_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_hero_collage" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_mode" "enum__pages_v_blocks_b61_hero_layout_mode" DEFAULT 'cover',
  	"eyebrow" varchar,
  	"heading_level" "enum__pages_v_blocks_b61_hero_heading_level" DEFAULT 'auto',
  	"subheadline_scale" "enum__pages_v_blocks_b61_hero_subheadline_scale" DEFAULT 'body',
  	"subheadline" varchar,
  	"background_type" "enum__pages_v_blocks_b61_hero_background_type" DEFAULT 'image',
  	"image_id" integer,
  	"video_id" integer,
  	"video_webm_id" integer,
  	"poster_id" integer,
  	"overlay_strength" numeric,
  	"height" "enum__pages_v_blocks_b61_hero_height" DEFAULT 'tall',
  	"band_size" "enum__pages_v_blocks_b61_hero_band_size" DEFAULT 'standard',
  	"vertical_position" "enum__pages_v_blocks_b61_hero_vertical_position" DEFAULT 'bottom',
  	"text_align" "enum__pages_v_blocks_b61_hero_text_align" DEFAULT 'left',
  	"column_balance" numeric,
  	"subheadline_width" numeric,
  	"pad_top" "enum__pages_v_blocks_b61_hero_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum__pages_v_blocks_b61_hero_pad_bottom" DEFAULT 'normal',
  	"overlay" "enum__pages_v_blocks_b61_hero_overlay" DEFAULT 'gradient',
  	"surface" "enum__pages_v_blocks_b61_hero_surface" DEFAULT 'primary',
  	"eyebrow_rule" "enum__pages_v_blocks_b61_hero_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum__pages_v_blocks_b61_hero_entrance" DEFAULT 'on',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_split_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_split_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_split_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum__pages_v_blocks_b61_split_buttons_variant" DEFAULT 'primary',
  	"link_type" "enum__pages_v_blocks_b61_split_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"full_width" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_split_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading_level" "enum__pages_v_blocks_b61_split_heading_level" DEFAULT 'auto',
  	"body" jsonb,
  	"media" "enum__pages_v_blocks_b61_split_media" DEFAULT 'photo',
  	"image_id" integer,
  	"caption" varchar,
  	"columns" "enum__pages_v_blocks_b61_split_columns" DEFAULT '2',
  	"video" varchar,
  	"image_shape" "enum__pages_v_blocks_b61_split_image_shape" DEFAULT 'fixed',
  	"image_side" "enum__pages_v_blocks_b61_split_image_side" DEFAULT 'right',
  	"vertical_position" "enum__pages_v_blocks_b61_split_vertical_position" DEFAULT 'center',
  	"stack_order" "enum__pages_v_blocks_b61_split_stack_order" DEFAULT 'text',
  	"column_height" "enum__pages_v_blocks_b61_split_column_height" DEFAULT 'fit',
  	"overlap" boolean,
  	"heading_align" "enum__pages_v_blocks_b61_split_heading_align" DEFAULT 'left',
  	"column_balance" numeric,
  	"pad_top" "enum__pages_v_blocks_b61_split_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum__pages_v_blocks_b61_split_pad_bottom" DEFAULT 'normal',
  	"surface" "enum__pages_v_blocks_b61_split_surface" DEFAULT 'none',
  	"text_panel" "enum__pages_v_blocks_b61_split_text_panel" DEFAULT 'none',
  	"frame_color" "enum__pages_v_blocks_b61_split_frame_color" DEFAULT 'primary',
  	"eyebrow_rule" "enum__pages_v_blocks_b61_split_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum__pages_v_blocks_b61_split_entrance" DEFAULT 'on',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_prose_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_prose_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_prose_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum__pages_v_blocks_b61_prose_buttons_variant" DEFAULT 'primary',
  	"link_type" "enum__pages_v_blocks_b61_prose_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"full_width" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_prose" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading_level" "enum__pages_v_blocks_b61_prose_heading_level" DEFAULT 'auto',
  	"body" jsonb,
  	"head_position" "enum__pages_v_blocks_b61_prose_head_position" DEFAULT 'above',
  	"column_balance" numeric,
  	"text_align" "enum__pages_v_blocks_b61_prose_text_align" DEFAULT 'left',
  	"position" "enum__pages_v_blocks_b61_prose_position" DEFAULT 'center',
  	"measure_step" numeric,
  	"heading_width" "enum__pages_v_blocks_b61_prose_heading_width" DEFAULT 'text',
  	"pad_top" "enum__pages_v_blocks_b61_prose_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum__pages_v_blocks_b61_prose_pad_bottom" DEFAULT 'normal',
  	"iconlist_style" "enum__pages_v_blocks_b61_prose_iconlist_style" DEFAULT 'standard',
  	"iconlist_edges" boolean,
  	"surface" "enum__pages_v_blocks_b61_prose_surface" DEFAULT 'none',
  	"eyebrow_rule" "enum__pages_v_blocks_b61_prose_eyebrow_rule" DEFAULT 'site',
  	"heading_rule" "enum__pages_v_blocks_b61_prose_heading_rule" DEFAULT 'site',
  	"entrance" "enum__pages_v_blocks_b61_prose_entrance" DEFAULT 'on',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_card_grid_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_card_grid_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_card_grid_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"icon" "enum__pages_v_blocks_b61_card_grid_cards_icon" DEFAULT 'star',
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" jsonb,
  	"link_type" "enum__pages_v_blocks_b61_card_grid_cards_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"link_text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_card_grid_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum__pages_v_blocks_b61_card_grid_buttons_variant" DEFAULT 'primary',
  	"link_type" "enum__pages_v_blocks_b61_card_grid_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"full_width" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_card_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading_level" "enum__pages_v_blocks_b61_card_grid_heading_level" DEFAULT 'auto',
  	"intro" jsonb,
  	"source" "enum__pages_v_blocks_b61_card_grid_source" DEFAULT 'manual',
  	"limit" numeric DEFAULT 3,
  	"media_type" "enum__pages_v_blocks_b61_card_grid_media_type" DEFAULT 'image',
  	"arrangement" "enum__pages_v_blocks_b61_card_grid_arrangement" DEFAULT 'grid',
  	"columns" "enum__pages_v_blocks_b61_card_grid_columns" DEFAULT '3',
  	"text_align" "enum__pages_v_blocks_b61_card_grid_text_align" DEFAULT 'left',
  	"advance" "enum__pages_v_blocks_b61_card_grid_advance" DEFAULT 'one',
  	"peek" "enum__pages_v_blocks_b61_card_grid_peek" DEFAULT 'small',
  	"controls_position" "enum__pages_v_blocks_b61_card_grid_controls_position" DEFAULT 'top-right',
  	"show_counter" boolean,
  	"show_progress" boolean,
  	"pad_top" "enum__pages_v_blocks_b61_card_grid_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum__pages_v_blocks_b61_card_grid_pad_bottom" DEFAULT 'normal',
  	"card_style" "enum__pages_v_blocks_b61_card_grid_card_style" DEFAULT 'bordered',
  	"card_shape" "enum__pages_v_blocks_b61_card_grid_card_shape" DEFAULT 'portrait',
  	"image_shape" "enum__pages_v_blocks_b61_card_grid_image_shape" DEFAULT 'fixed',
  	"ratio_w" numeric,
  	"ratio_h" numeric,
  	"card_text_position" "enum__pages_v_blocks_b61_card_grid_card_text_position" DEFAULT 'bottom',
  	"media_round" boolean,
  	"icon_size" "enum__pages_v_blocks_b61_card_grid_icon_size" DEFAULT 'sm',
  	"show_numbers" boolean,
  	"cta_case" "enum__pages_v_blocks_b61_card_grid_cta_case" DEFAULT 'upper',
  	"cta_size" "enum__pages_v_blocks_b61_card_grid_cta_size" DEFAULT 'sm',
  	"surface" "enum__pages_v_blocks_b61_card_grid_surface" DEFAULT 'none',
  	"card_surface" "enum__pages_v_blocks_b61_card_grid_card_surface" DEFAULT 'light',
  	"card_overlay" "enum__pages_v_blocks_b61_card_grid_card_overlay" DEFAULT 'gradient',
  	"eyebrow_rule" "enum__pages_v_blocks_b61_card_grid_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum__pages_v_blocks_b61_card_grid_entrance" DEFAULT 'on',
  	"_uuid" varchar,
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
  
  CREATE TABLE "_pages_v_blocks_b61_cta_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"emphasize" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_cta_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_cta_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum__pages_v_blocks_b61_cta_buttons_variant" DEFAULT 'primary',
  	"link_type" "enum__pages_v_blocks_b61_cta_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"full_width" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_b61_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading_level" "enum__pages_v_blocks_b61_cta_heading_level" DEFAULT 'auto',
  	"body" jsonb,
  	"image_id" integer,
  	"overlay_strength" numeric,
  	"text_align" "enum__pages_v_blocks_b61_cta_text_align" DEFAULT 'center',
  	"position" "enum__pages_v_blocks_b61_cta_position" DEFAULT 'center',
  	"width_step" numeric,
  	"pad_top" "enum__pages_v_blocks_b61_cta_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum__pages_v_blocks_b61_cta_pad_bottom" DEFAULT 'normal',
  	"surface" "enum__pages_v_blocks_b61_cta_surface" DEFAULT 'soft',
  	"text_panel" "enum__pages_v_blocks_b61_cta_text_panel" DEFAULT 'none',
  	"eyebrow_rule" "enum__pages_v_blocks_b61_cta_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum__pages_v_blocks_b61_cta_entrance" DEFAULT 'on',
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
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_school_id" integer,
  	"version_title" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_seo_description" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"school_id" integer,
  	"title" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"starts_at" timestamp(3) with time zone,
  	"ends_at" timestamp(3) with time zone,
  	"location" varchar,
  	"audience" "enum_events_audience" DEFAULT 'public',
  	"summary" varchar,
  	"description" jsonb,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_events_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_events_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_school_id" integer,
  	"version_title" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_starts_at" timestamp(3) with time zone,
  	"version_ends_at" timestamp(3) with time zone,
  	"version_location" varchar,
  	"version_audience" "enum__events_v_version_audience" DEFAULT 'public',
  	"version_summary" varchar,
  	"version_description" jsonb,
  	"version_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__events_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "news" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"school_id" integer,
  	"title" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"date" timestamp(3) with time zone,
  	"audience" "enum_news_audience" DEFAULT 'public',
  	"summary" varchar,
  	"body" jsonb,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_news_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_news_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_school_id" integer,
  	"version_title" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_date" timestamp(3) with time zone,
  	"version_audience" "enum__news_v_version_audience" DEFAULT 'public',
  	"version_summary" varchar,
  	"version_body" jsonb,
  	"version_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__news_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "programs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"school_id" integer,
  	"name" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"grades" varchar,
  	"summary" varchar,
  	"description" jsonb,
  	"image_id" integer,
  	"sort_order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_programs_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_programs_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_school_id" integer,
  	"version_name" varchar,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_grades" varchar,
  	"version_summary" varchar,
  	"version_description" jsonb,
  	"version_image_id" integer,
  	"version_sort_order" numeric DEFAULT 100,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__programs_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "staff" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"school_id" integer,
  	"name" varchar,
  	"role" varchar,
  	"department" varchar,
  	"email" varchar,
  	"bio" varchar,
  	"photo_id" integer,
  	"sort_order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_staff_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_staff_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_school_id" integer,
  	"version_name" varchar,
  	"version_role" varchar,
  	"version_department" varchar,
  	"version_email" varchar,
  	"version_bio" varchar,
  	"version_photo_id" integer,
  	"version_sort_order" numeric DEFAULT 100,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__staff_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"school_id" integer,
  	"alt" varchar NOT NULL,
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
  	"focal_y" numeric,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "school_settings_menu_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link_type" "enum_school_settings_menu_links_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean
  );
  
  CREATE TABLE "school_settings_menu_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link_type" "enum_school_settings_menu_columns_links_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"description" varchar
  );
  
  CREATE TABLE "school_settings_menu_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar
  );
  
  CREATE TABLE "school_settings_menu" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"kind" "enum_school_settings_menu_kind" DEFAULT 'link',
  	"link_type" "enum_school_settings_menu_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"feature_image_id" integer,
  	"feature_title" varchar,
  	"feature_text" varchar,
  	"feature_link_type" "enum_school_settings_menu_feature_link_type" DEFAULT 'page',
  	"feature_link_page_id" integer,
  	"feature_link_url" varchar,
  	"feature_link_new_tab" boolean
  );
  
  CREATE TABLE "school_settings_utility_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link_type" "enum_school_settings_utility_links_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean
  );
  
  CREATE TABLE "school_settings_footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link_type" "enum_school_settings_footer_columns_links_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean
  );
  
  CREATE TABLE "school_settings_footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar
  );
  
  CREATE TABLE "school_settings_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_school_settings_social_platform" DEFAULT 'facebook',
  	"url" varchar
  );
  
  CREATE TABLE "school_settings_legal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link_type" "enum_school_settings_legal_links_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean
  );
  
  CREATE TABLE "school_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"school_id" integer,
  	"school_name" varchar,
  	"tagline" varchar,
  	"logo_id" integer,
  	"phone" varchar,
  	"email" varchar,
  	"address" varchar,
  	"primary_color" varchar DEFAULT '#1F3A5F',
  	"secondary_color" varchar DEFAULT '#C8A24A',
  	"accent_color" varchar DEFAULT '#B23A2E',
  	"paper_color" varchar DEFAULT '#F7F3EC',
  	"primary_deep" varchar,
  	"secondary_soft" varchar,
  	"accent_strong" varchar,
  	"accent_deep" varchar,
  	"heading_font" "enum_school_settings_heading_font" DEFAULT 'Fraunces',
  	"body_font" "enum_school_settings_body_font" DEFAULT 'Inter',
  	"ui_font" "enum_school_settings_ui_font" DEFAULT 'Montserrat',
  	"header_button_label" varchar,
  	"header_button_link_type" "enum_school_settings_header_button_link_type" DEFAULT 'page',
  	"header_button_link_page_id" integer,
  	"header_button_link_url" varchar,
  	"header_button_link_new_tab" boolean,
  	"footer_show_contact" boolean DEFAULT true,
  	"footer_note" varchar,
  	"copyright" varchar,
  	"parent_password" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_school_settings_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_school_settings_v_version_menu_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link_type" "enum__school_settings_v_version_menu_links_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_school_settings_v_version_menu_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link_type" "enum__school_settings_v_version_menu_columns_links_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_school_settings_v_version_menu_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_school_settings_v_version_menu" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"kind" "enum__school_settings_v_version_menu_kind" DEFAULT 'link',
  	"link_type" "enum__school_settings_v_version_menu_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"feature_image_id" integer,
  	"feature_title" varchar,
  	"feature_text" varchar,
  	"feature_link_type" "enum__school_settings_v_version_menu_feature_link_type" DEFAULT 'page',
  	"feature_link_page_id" integer,
  	"feature_link_url" varchar,
  	"feature_link_new_tab" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_school_settings_v_version_utility_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link_type" "enum__school_settings_v_version_utility_links_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_school_settings_v_version_footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link_type" "enum__school_settings_v_version_footer_columns_links_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_school_settings_v_version_footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_school_settings_v_version_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"platform" "enum__school_settings_v_version_social_platform" DEFAULT 'facebook',
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_school_settings_v_version_legal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link_type" "enum__school_settings_v_version_legal_links_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_url" varchar,
  	"link_new_tab" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_school_settings_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_school_id" integer,
  	"version_school_name" varchar,
  	"version_tagline" varchar,
  	"version_logo_id" integer,
  	"version_phone" varchar,
  	"version_email" varchar,
  	"version_address" varchar,
  	"version_primary_color" varchar DEFAULT '#1F3A5F',
  	"version_secondary_color" varchar DEFAULT '#C8A24A',
  	"version_accent_color" varchar DEFAULT '#B23A2E',
  	"version_paper_color" varchar DEFAULT '#F7F3EC',
  	"version_primary_deep" varchar,
  	"version_secondary_soft" varchar,
  	"version_accent_strong" varchar,
  	"version_accent_deep" varchar,
  	"version_heading_font" "enum__school_settings_v_version_heading_font" DEFAULT 'Fraunces',
  	"version_body_font" "enum__school_settings_v_version_body_font" DEFAULT 'Inter',
  	"version_ui_font" "enum__school_settings_v_version_ui_font" DEFAULT 'Montserrat',
  	"version_header_button_label" varchar,
  	"version_header_button_link_type" "enum__school_settings_v_version_header_button_link_type" DEFAULT 'page',
  	"version_header_button_link_page_id" integer,
  	"version_header_button_link_url" varchar,
  	"version_header_button_link_new_tab" boolean,
  	"version_footer_show_contact" boolean DEFAULT true,
  	"version_footer_note" varchar,
  	"version_copyright" varchar,
  	"version_parent_password" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__school_settings_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "schools_domains" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"domain" varchar NOT NULL
  );
  
  CREATE TABLE "schools" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_tenants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tenant_id" integer NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"events_id" integer,
  	"news_id" integer,
  	"programs_id" integer,
  	"staff_id" integer,
  	"media_id" integer,
  	"school_settings_id" integer,
  	"schools_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "pages_blocks_b61_hero_lines" ADD CONSTRAINT "pages_blocks_b61_hero_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_hero_meta_items" ADD CONSTRAINT "pages_blocks_b61_hero_meta_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_hero_buttons" ADD CONSTRAINT "pages_blocks_b61_hero_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_hero_buttons" ADD CONSTRAINT "pages_blocks_b61_hero_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_hero_slides" ADD CONSTRAINT "pages_blocks_b61_hero_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_hero_slides" ADD CONSTRAINT "pages_blocks_b61_hero_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_hero_collage" ADD CONSTRAINT "pages_blocks_b61_hero_collage_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_hero_collage" ADD CONSTRAINT "pages_blocks_b61_hero_collage_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_hero" ADD CONSTRAINT "pages_blocks_b61_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_hero" ADD CONSTRAINT "pages_blocks_b61_hero_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_hero" ADD CONSTRAINT "pages_blocks_b61_hero_video_webm_id_media_id_fk" FOREIGN KEY ("video_webm_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_hero" ADD CONSTRAINT "pages_blocks_b61_hero_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_hero" ADD CONSTRAINT "pages_blocks_b61_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_split_lines" ADD CONSTRAINT "pages_blocks_b61_split_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_split_subheads" ADD CONSTRAINT "pages_blocks_b61_split_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_split_buttons" ADD CONSTRAINT "pages_blocks_b61_split_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_split_buttons" ADD CONSTRAINT "pages_blocks_b61_split_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_split_images" ADD CONSTRAINT "pages_blocks_b61_split_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_split_images" ADD CONSTRAINT "pages_blocks_b61_split_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_split" ADD CONSTRAINT "pages_blocks_b61_split_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_split" ADD CONSTRAINT "pages_blocks_b61_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_prose_lines" ADD CONSTRAINT "pages_blocks_b61_prose_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_prose"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_prose_subheads" ADD CONSTRAINT "pages_blocks_b61_prose_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_prose"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_prose_buttons" ADD CONSTRAINT "pages_blocks_b61_prose_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_prose_buttons" ADD CONSTRAINT "pages_blocks_b61_prose_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_prose"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_prose" ADD CONSTRAINT "pages_blocks_b61_prose_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_card_grid_lines" ADD CONSTRAINT "pages_blocks_b61_card_grid_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_card_grid_subheads" ADD CONSTRAINT "pages_blocks_b61_card_grid_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_card_grid_cards" ADD CONSTRAINT "pages_blocks_b61_card_grid_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_card_grid_cards" ADD CONSTRAINT "pages_blocks_b61_card_grid_cards_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_card_grid_cards" ADD CONSTRAINT "pages_blocks_b61_card_grid_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_card_grid_buttons" ADD CONSTRAINT "pages_blocks_b61_card_grid_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_card_grid_buttons" ADD CONSTRAINT "pages_blocks_b61_card_grid_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_card_grid" ADD CONSTRAINT "pages_blocks_b61_card_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
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
  ALTER TABLE "pages_blocks_b61_accordion_lines" ADD CONSTRAINT "pages_blocks_b61_accordion_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_accordion_subheads" ADD CONSTRAINT "pages_blocks_b61_accordion_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_accordion_items" ADD CONSTRAINT "pages_blocks_b61_accordion_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_accordion_buttons" ADD CONSTRAINT "pages_blocks_b61_accordion_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_accordion_buttons" ADD CONSTRAINT "pages_blocks_b61_accordion_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_accordion" ADD CONSTRAINT "pages_blocks_b61_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_tabs_lines" ADD CONSTRAINT "pages_blocks_b61_tabs_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_tabs_subheads" ADD CONSTRAINT "pages_blocks_b61_tabs_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_tabs_tabs" ADD CONSTRAINT "pages_blocks_b61_tabs_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_tabs" ADD CONSTRAINT "pages_blocks_b61_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_pillars_lines" ADD CONSTRAINT "pages_blocks_b61_pillars_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_pillars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_pillars_subheads" ADD CONSTRAINT "pages_blocks_b61_pillars_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_pillars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_pillars_items" ADD CONSTRAINT "pages_blocks_b61_pillars_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_pillars_items" ADD CONSTRAINT "pages_blocks_b61_pillars_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_pillars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_pillars" ADD CONSTRAINT "pages_blocks_b61_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_carousel_lines" ADD CONSTRAINT "pages_blocks_b61_carousel_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_carousel_subheads" ADD CONSTRAINT "pages_blocks_b61_carousel_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_carousel_slides" ADD CONSTRAINT "pages_blocks_b61_carousel_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_carousel" ADD CONSTRAINT "pages_blocks_b61_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_framed_image" ADD CONSTRAINT "pages_blocks_b61_framed_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_framed_image" ADD CONSTRAINT "pages_blocks_b61_framed_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_cta_lines" ADD CONSTRAINT "pages_blocks_b61_cta_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_cta_subheads" ADD CONSTRAINT "pages_blocks_b61_cta_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_cta_buttons" ADD CONSTRAINT "pages_blocks_b61_cta_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_cta_buttons" ADD CONSTRAINT "pages_blocks_b61_cta_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_cta" ADD CONSTRAINT "pages_blocks_b61_cta_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_cta" ADD CONSTRAINT "pages_blocks_b61_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_button_bar" ADD CONSTRAINT "pages_blocks_b61_button_bar_first_link_page_id_pages_id_fk" FOREIGN KEY ("first_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_button_bar" ADD CONSTRAINT "pages_blocks_b61_button_bar_second_link_page_id_pages_id_fk" FOREIGN KEY ("second_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_button_bar" ADD CONSTRAINT "pages_blocks_b61_button_bar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_divider" ADD CONSTRAINT "pages_blocks_b61_divider_ornament_id_media_id_fk" FOREIGN KEY ("ornament_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_divider" ADD CONSTRAINT "pages_blocks_b61_divider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_rail_buttons" ADD CONSTRAINT "pages_blocks_b61_rail_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_rail_buttons" ADD CONSTRAINT "pages_blocks_b61_rail_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_rail"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_rail_links" ADD CONSTRAINT "pages_blocks_b61_rail_links_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_rail_links" ADD CONSTRAINT "pages_blocks_b61_rail_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_b61_rail"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_rail" ADD CONSTRAINT "pages_blocks_b61_rail_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_section" ADD CONSTRAINT "pages_blocks_b61_section_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_section" ADD CONSTRAINT "pages_blocks_b61_section_pattern_image_id_media_id_fk" FOREIGN KEY ("pattern_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_section" ADD CONSTRAINT "pages_blocks_b61_section_watermark_image_id_media_id_fk" FOREIGN KEY ("watermark_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_b61_section" ADD CONSTRAINT "pages_blocks_b61_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_hero_lines" ADD CONSTRAINT "_pages_v_blocks_b61_hero_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_hero_meta_items" ADD CONSTRAINT "_pages_v_blocks_b61_hero_meta_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_hero_buttons" ADD CONSTRAINT "_pages_v_blocks_b61_hero_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_hero_buttons" ADD CONSTRAINT "_pages_v_blocks_b61_hero_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_hero_slides" ADD CONSTRAINT "_pages_v_blocks_b61_hero_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_hero_slides" ADD CONSTRAINT "_pages_v_blocks_b61_hero_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_hero_collage" ADD CONSTRAINT "_pages_v_blocks_b61_hero_collage_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_hero_collage" ADD CONSTRAINT "_pages_v_blocks_b61_hero_collage_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_hero" ADD CONSTRAINT "_pages_v_blocks_b61_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_hero" ADD CONSTRAINT "_pages_v_blocks_b61_hero_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_hero" ADD CONSTRAINT "_pages_v_blocks_b61_hero_video_webm_id_media_id_fk" FOREIGN KEY ("video_webm_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_hero" ADD CONSTRAINT "_pages_v_blocks_b61_hero_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_hero" ADD CONSTRAINT "_pages_v_blocks_b61_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_split_lines" ADD CONSTRAINT "_pages_v_blocks_b61_split_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_split_subheads" ADD CONSTRAINT "_pages_v_blocks_b61_split_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_split_buttons" ADD CONSTRAINT "_pages_v_blocks_b61_split_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_split_buttons" ADD CONSTRAINT "_pages_v_blocks_b61_split_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_split_images" ADD CONSTRAINT "_pages_v_blocks_b61_split_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_split_images" ADD CONSTRAINT "_pages_v_blocks_b61_split_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_split" ADD CONSTRAINT "_pages_v_blocks_b61_split_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_split" ADD CONSTRAINT "_pages_v_blocks_b61_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_prose_lines" ADD CONSTRAINT "_pages_v_blocks_b61_prose_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_prose"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_prose_subheads" ADD CONSTRAINT "_pages_v_blocks_b61_prose_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_prose"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_prose_buttons" ADD CONSTRAINT "_pages_v_blocks_b61_prose_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_prose_buttons" ADD CONSTRAINT "_pages_v_blocks_b61_prose_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_prose"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_prose" ADD CONSTRAINT "_pages_v_blocks_b61_prose_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_card_grid_lines" ADD CONSTRAINT "_pages_v_blocks_b61_card_grid_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_card_grid_subheads" ADD CONSTRAINT "_pages_v_blocks_b61_card_grid_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_card_grid_cards" ADD CONSTRAINT "_pages_v_blocks_b61_card_grid_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_card_grid_cards" ADD CONSTRAINT "_pages_v_blocks_b61_card_grid_cards_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_card_grid_cards" ADD CONSTRAINT "_pages_v_blocks_b61_card_grid_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_card_grid_buttons" ADD CONSTRAINT "_pages_v_blocks_b61_card_grid_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_card_grid_buttons" ADD CONSTRAINT "_pages_v_blocks_b61_card_grid_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_card_grid" ADD CONSTRAINT "_pages_v_blocks_b61_card_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
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
  ALTER TABLE "_pages_v_blocks_b61_accordion_lines" ADD CONSTRAINT "_pages_v_blocks_b61_accordion_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_accordion_subheads" ADD CONSTRAINT "_pages_v_blocks_b61_accordion_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_accordion_items" ADD CONSTRAINT "_pages_v_blocks_b61_accordion_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_accordion_buttons" ADD CONSTRAINT "_pages_v_blocks_b61_accordion_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_accordion_buttons" ADD CONSTRAINT "_pages_v_blocks_b61_accordion_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_accordion" ADD CONSTRAINT "_pages_v_blocks_b61_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_tabs_lines" ADD CONSTRAINT "_pages_v_blocks_b61_tabs_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_tabs_subheads" ADD CONSTRAINT "_pages_v_blocks_b61_tabs_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_tabs_tabs" ADD CONSTRAINT "_pages_v_blocks_b61_tabs_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_tabs" ADD CONSTRAINT "_pages_v_blocks_b61_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_pillars_lines" ADD CONSTRAINT "_pages_v_blocks_b61_pillars_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_pillars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_pillars_subheads" ADD CONSTRAINT "_pages_v_blocks_b61_pillars_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_pillars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_pillars_items" ADD CONSTRAINT "_pages_v_blocks_b61_pillars_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_pillars_items" ADD CONSTRAINT "_pages_v_blocks_b61_pillars_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_pillars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_pillars" ADD CONSTRAINT "_pages_v_blocks_b61_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_carousel_lines" ADD CONSTRAINT "_pages_v_blocks_b61_carousel_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_carousel_subheads" ADD CONSTRAINT "_pages_v_blocks_b61_carousel_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_carousel_slides" ADD CONSTRAINT "_pages_v_blocks_b61_carousel_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_carousel" ADD CONSTRAINT "_pages_v_blocks_b61_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_framed_image" ADD CONSTRAINT "_pages_v_blocks_b61_framed_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_framed_image" ADD CONSTRAINT "_pages_v_blocks_b61_framed_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_cta_lines" ADD CONSTRAINT "_pages_v_blocks_b61_cta_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_cta_subheads" ADD CONSTRAINT "_pages_v_blocks_b61_cta_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_cta_buttons" ADD CONSTRAINT "_pages_v_blocks_b61_cta_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_cta_buttons" ADD CONSTRAINT "_pages_v_blocks_b61_cta_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_cta" ADD CONSTRAINT "_pages_v_blocks_b61_cta_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_cta" ADD CONSTRAINT "_pages_v_blocks_b61_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_button_bar" ADD CONSTRAINT "_pages_v_blocks_b61_button_bar_first_link_page_id_pages_id_fk" FOREIGN KEY ("first_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_button_bar" ADD CONSTRAINT "_pages_v_blocks_b61_button_bar_second_link_page_id_pages_id_fk" FOREIGN KEY ("second_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_button_bar" ADD CONSTRAINT "_pages_v_blocks_b61_button_bar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_divider" ADD CONSTRAINT "_pages_v_blocks_b61_divider_ornament_id_media_id_fk" FOREIGN KEY ("ornament_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_divider" ADD CONSTRAINT "_pages_v_blocks_b61_divider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_rail_buttons" ADD CONSTRAINT "_pages_v_blocks_b61_rail_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_rail_buttons" ADD CONSTRAINT "_pages_v_blocks_b61_rail_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_rail"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_rail_links" ADD CONSTRAINT "_pages_v_blocks_b61_rail_links_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_rail_links" ADD CONSTRAINT "_pages_v_blocks_b61_rail_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_b61_rail"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_rail" ADD CONSTRAINT "_pages_v_blocks_b61_rail_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_section" ADD CONSTRAINT "_pages_v_blocks_b61_section_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_section" ADD CONSTRAINT "_pages_v_blocks_b61_section_pattern_image_id_media_id_fk" FOREIGN KEY ("pattern_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_section" ADD CONSTRAINT "_pages_v_blocks_b61_section_watermark_image_id_media_id_fk" FOREIGN KEY ("watermark_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_b61_section" ADD CONSTRAINT "_pages_v_blocks_b61_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_school_id_schools_id_fk" FOREIGN KEY ("version_school_id") REFERENCES "public"."schools"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_parent_id_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_school_id_schools_id_fk" FOREIGN KEY ("version_school_id") REFERENCES "public"."schools"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_parent_id_news_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."news"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_school_id_schools_id_fk" FOREIGN KEY ("version_school_id") REFERENCES "public"."schools"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs" ADD CONSTRAINT "programs_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs" ADD CONSTRAINT "programs_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v" ADD CONSTRAINT "_programs_v_parent_id_programs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."programs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v" ADD CONSTRAINT "_programs_v_version_school_id_schools_id_fk" FOREIGN KEY ("version_school_id") REFERENCES "public"."schools"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v" ADD CONSTRAINT "_programs_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "staff" ADD CONSTRAINT "staff_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "staff" ADD CONSTRAINT "staff_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_staff_v" ADD CONSTRAINT "_staff_v_parent_id_staff_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."staff"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_staff_v" ADD CONSTRAINT "_staff_v_version_school_id_schools_id_fk" FOREIGN KEY ("version_school_id") REFERENCES "public"."schools"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_staff_v" ADD CONSTRAINT "_staff_v_version_photo_id_media_id_fk" FOREIGN KEY ("version_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "school_settings_menu_links" ADD CONSTRAINT "school_settings_menu_links_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "school_settings_menu_links" ADD CONSTRAINT "school_settings_menu_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."school_settings_menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "school_settings_menu_columns_links" ADD CONSTRAINT "school_settings_menu_columns_links_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "school_settings_menu_columns_links" ADD CONSTRAINT "school_settings_menu_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."school_settings_menu_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "school_settings_menu_columns" ADD CONSTRAINT "school_settings_menu_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."school_settings_menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "school_settings_menu" ADD CONSTRAINT "school_settings_menu_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "school_settings_menu" ADD CONSTRAINT "school_settings_menu_feature_image_id_media_id_fk" FOREIGN KEY ("feature_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "school_settings_menu" ADD CONSTRAINT "school_settings_menu_feature_link_page_id_pages_id_fk" FOREIGN KEY ("feature_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "school_settings_menu" ADD CONSTRAINT "school_settings_menu_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."school_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "school_settings_utility_links" ADD CONSTRAINT "school_settings_utility_links_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "school_settings_utility_links" ADD CONSTRAINT "school_settings_utility_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."school_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "school_settings_footer_columns_links" ADD CONSTRAINT "school_settings_footer_columns_links_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "school_settings_footer_columns_links" ADD CONSTRAINT "school_settings_footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."school_settings_footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "school_settings_footer_columns" ADD CONSTRAINT "school_settings_footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."school_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "school_settings_social" ADD CONSTRAINT "school_settings_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."school_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "school_settings_legal_links" ADD CONSTRAINT "school_settings_legal_links_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "school_settings_legal_links" ADD CONSTRAINT "school_settings_legal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."school_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "school_settings" ADD CONSTRAINT "school_settings_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "school_settings" ADD CONSTRAINT "school_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "school_settings" ADD CONSTRAINT "school_settings_header_button_link_page_id_pages_id_fk" FOREIGN KEY ("header_button_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_menu_links" ADD CONSTRAINT "_school_settings_v_version_menu_links_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_menu_links" ADD CONSTRAINT "_school_settings_v_version_menu_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_school_settings_v_version_menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_menu_columns_links" ADD CONSTRAINT "_school_settings_v_version_menu_columns_links_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_menu_columns_links" ADD CONSTRAINT "_school_settings_v_version_menu_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_school_settings_v_version_menu_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_menu_columns" ADD CONSTRAINT "_school_settings_v_version_menu_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_school_settings_v_version_menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_menu" ADD CONSTRAINT "_school_settings_v_version_menu_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_menu" ADD CONSTRAINT "_school_settings_v_version_menu_feature_image_id_media_id_fk" FOREIGN KEY ("feature_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_menu" ADD CONSTRAINT "_school_settings_v_version_menu_feature_link_page_id_pages_id_fk" FOREIGN KEY ("feature_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_menu" ADD CONSTRAINT "_school_settings_v_version_menu_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_school_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_utility_links" ADD CONSTRAINT "_school_settings_v_version_utility_links_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_utility_links" ADD CONSTRAINT "_school_settings_v_version_utility_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_school_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_footer_columns_links" ADD CONSTRAINT "_school_settings_v_version_footer_columns_links_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_footer_columns_links" ADD CONSTRAINT "_school_settings_v_version_footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_school_settings_v_version_footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_footer_columns" ADD CONSTRAINT "_school_settings_v_version_footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_school_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_social" ADD CONSTRAINT "_school_settings_v_version_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_school_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_legal_links" ADD CONSTRAINT "_school_settings_v_version_legal_links_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_school_settings_v_version_legal_links" ADD CONSTRAINT "_school_settings_v_version_legal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_school_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_school_settings_v" ADD CONSTRAINT "_school_settings_v_parent_id_school_settings_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."school_settings"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_school_settings_v" ADD CONSTRAINT "_school_settings_v_version_school_id_schools_id_fk" FOREIGN KEY ("version_school_id") REFERENCES "public"."schools"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_school_settings_v" ADD CONSTRAINT "_school_settings_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_school_settings_v" ADD CONSTRAINT "_school_settings_v_version_header_button_link_page_id_pages_id_fk" FOREIGN KEY ("version_header_button_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "schools_domains" ADD CONSTRAINT "schools_domains_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."schools"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_tenants" ADD CONSTRAINT "users_tenants_tenant_id_schools_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."schools"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_tenants" ADD CONSTRAINT "users_tenants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_programs_fk" FOREIGN KEY ("programs_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_staff_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_school_settings_fk" FOREIGN KEY ("school_settings_id") REFERENCES "public"."school_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_schools_fk" FOREIGN KEY ("schools_id") REFERENCES "public"."schools"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_b61_hero_lines_order_idx" ON "pages_blocks_b61_hero_lines" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_hero_lines_parent_id_idx" ON "pages_blocks_b61_hero_lines" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_hero_meta_items_order_idx" ON "pages_blocks_b61_hero_meta_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_hero_meta_items_parent_id_idx" ON "pages_blocks_b61_hero_meta_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_hero_buttons_order_idx" ON "pages_blocks_b61_hero_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_hero_buttons_parent_id_idx" ON "pages_blocks_b61_hero_buttons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_hero_buttons_link_link_page_idx" ON "pages_blocks_b61_hero_buttons" USING btree ("link_page_id");
  CREATE INDEX "pages_blocks_b61_hero_slides_order_idx" ON "pages_blocks_b61_hero_slides" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_hero_slides_parent_id_idx" ON "pages_blocks_b61_hero_slides" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_hero_slides_image_idx" ON "pages_blocks_b61_hero_slides" USING btree ("image_id");
  CREATE INDEX "pages_blocks_b61_hero_collage_order_idx" ON "pages_blocks_b61_hero_collage" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_hero_collage_parent_id_idx" ON "pages_blocks_b61_hero_collage" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_hero_collage_image_idx" ON "pages_blocks_b61_hero_collage" USING btree ("image_id");
  CREATE INDEX "pages_blocks_b61_hero_order_idx" ON "pages_blocks_b61_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_hero_parent_id_idx" ON "pages_blocks_b61_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_hero_path_idx" ON "pages_blocks_b61_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_b61_hero_image_idx" ON "pages_blocks_b61_hero" USING btree ("image_id");
  CREATE INDEX "pages_blocks_b61_hero_video_idx" ON "pages_blocks_b61_hero" USING btree ("video_id");
  CREATE INDEX "pages_blocks_b61_hero_video_webm_idx" ON "pages_blocks_b61_hero" USING btree ("video_webm_id");
  CREATE INDEX "pages_blocks_b61_hero_poster_idx" ON "pages_blocks_b61_hero" USING btree ("poster_id");
  CREATE INDEX "pages_blocks_b61_split_lines_order_idx" ON "pages_blocks_b61_split_lines" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_split_lines_parent_id_idx" ON "pages_blocks_b61_split_lines" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_split_subheads_order_idx" ON "pages_blocks_b61_split_subheads" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_split_subheads_parent_id_idx" ON "pages_blocks_b61_split_subheads" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_split_buttons_order_idx" ON "pages_blocks_b61_split_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_split_buttons_parent_id_idx" ON "pages_blocks_b61_split_buttons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_split_buttons_link_link_page_idx" ON "pages_blocks_b61_split_buttons" USING btree ("link_page_id");
  CREATE INDEX "pages_blocks_b61_split_images_order_idx" ON "pages_blocks_b61_split_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_split_images_parent_id_idx" ON "pages_blocks_b61_split_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_split_images_image_idx" ON "pages_blocks_b61_split_images" USING btree ("image_id");
  CREATE INDEX "pages_blocks_b61_split_order_idx" ON "pages_blocks_b61_split" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_split_parent_id_idx" ON "pages_blocks_b61_split" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_split_path_idx" ON "pages_blocks_b61_split" USING btree ("_path");
  CREATE INDEX "pages_blocks_b61_split_image_idx" ON "pages_blocks_b61_split" USING btree ("image_id");
  CREATE INDEX "pages_blocks_b61_prose_lines_order_idx" ON "pages_blocks_b61_prose_lines" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_prose_lines_parent_id_idx" ON "pages_blocks_b61_prose_lines" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_prose_subheads_order_idx" ON "pages_blocks_b61_prose_subheads" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_prose_subheads_parent_id_idx" ON "pages_blocks_b61_prose_subheads" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_prose_buttons_order_idx" ON "pages_blocks_b61_prose_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_prose_buttons_parent_id_idx" ON "pages_blocks_b61_prose_buttons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_prose_buttons_link_link_page_idx" ON "pages_blocks_b61_prose_buttons" USING btree ("link_page_id");
  CREATE INDEX "pages_blocks_b61_prose_order_idx" ON "pages_blocks_b61_prose" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_prose_parent_id_idx" ON "pages_blocks_b61_prose" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_prose_path_idx" ON "pages_blocks_b61_prose" USING btree ("_path");
  CREATE INDEX "pages_blocks_b61_card_grid_lines_order_idx" ON "pages_blocks_b61_card_grid_lines" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_card_grid_lines_parent_id_idx" ON "pages_blocks_b61_card_grid_lines" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_card_grid_subheads_order_idx" ON "pages_blocks_b61_card_grid_subheads" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_card_grid_subheads_parent_id_idx" ON "pages_blocks_b61_card_grid_subheads" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_card_grid_cards_order_idx" ON "pages_blocks_b61_card_grid_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_card_grid_cards_parent_id_idx" ON "pages_blocks_b61_card_grid_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_card_grid_cards_image_idx" ON "pages_blocks_b61_card_grid_cards" USING btree ("image_id");
  CREATE INDEX "pages_blocks_b61_card_grid_cards_link_link_page_idx" ON "pages_blocks_b61_card_grid_cards" USING btree ("link_page_id");
  CREATE INDEX "pages_blocks_b61_card_grid_buttons_order_idx" ON "pages_blocks_b61_card_grid_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_card_grid_buttons_parent_id_idx" ON "pages_blocks_b61_card_grid_buttons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_card_grid_buttons_link_link_page_idx" ON "pages_blocks_b61_card_grid_buttons" USING btree ("link_page_id");
  CREATE INDEX "pages_blocks_b61_card_grid_order_idx" ON "pages_blocks_b61_card_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_card_grid_parent_id_idx" ON "pages_blocks_b61_card_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_card_grid_path_idx" ON "pages_blocks_b61_card_grid" USING btree ("_path");
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
  CREATE INDEX "pages_blocks_b61_tabs_tabs_order_idx" ON "pages_blocks_b61_tabs_tabs" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_tabs_tabs_parent_id_idx" ON "pages_blocks_b61_tabs_tabs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_tabs_order_idx" ON "pages_blocks_b61_tabs" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_tabs_parent_id_idx" ON "pages_blocks_b61_tabs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_tabs_path_idx" ON "pages_blocks_b61_tabs" USING btree ("_path");
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
  CREATE INDEX "pages_blocks_b61_carousel_lines_order_idx" ON "pages_blocks_b61_carousel_lines" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_carousel_lines_parent_id_idx" ON "pages_blocks_b61_carousel_lines" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_carousel_subheads_order_idx" ON "pages_blocks_b61_carousel_subheads" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_carousel_subheads_parent_id_idx" ON "pages_blocks_b61_carousel_subheads" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_carousel_slides_order_idx" ON "pages_blocks_b61_carousel_slides" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_carousel_slides_parent_id_idx" ON "pages_blocks_b61_carousel_slides" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_carousel_order_idx" ON "pages_blocks_b61_carousel" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_carousel_parent_id_idx" ON "pages_blocks_b61_carousel" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_carousel_path_idx" ON "pages_blocks_b61_carousel" USING btree ("_path");
  CREATE INDEX "pages_blocks_b61_framed_image_order_idx" ON "pages_blocks_b61_framed_image" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_framed_image_parent_id_idx" ON "pages_blocks_b61_framed_image" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_framed_image_path_idx" ON "pages_blocks_b61_framed_image" USING btree ("_path");
  CREATE INDEX "pages_blocks_b61_framed_image_image_idx" ON "pages_blocks_b61_framed_image" USING btree ("image_id");
  CREATE INDEX "pages_blocks_b61_cta_lines_order_idx" ON "pages_blocks_b61_cta_lines" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_cta_lines_parent_id_idx" ON "pages_blocks_b61_cta_lines" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_cta_subheads_order_idx" ON "pages_blocks_b61_cta_subheads" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_cta_subheads_parent_id_idx" ON "pages_blocks_b61_cta_subheads" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_cta_buttons_order_idx" ON "pages_blocks_b61_cta_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_cta_buttons_parent_id_idx" ON "pages_blocks_b61_cta_buttons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_cta_buttons_link_link_page_idx" ON "pages_blocks_b61_cta_buttons" USING btree ("link_page_id");
  CREATE INDEX "pages_blocks_b61_cta_order_idx" ON "pages_blocks_b61_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_cta_parent_id_idx" ON "pages_blocks_b61_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_cta_path_idx" ON "pages_blocks_b61_cta" USING btree ("_path");
  CREATE INDEX "pages_blocks_b61_cta_image_idx" ON "pages_blocks_b61_cta" USING btree ("image_id");
  CREATE INDEX "pages_blocks_b61_button_bar_order_idx" ON "pages_blocks_b61_button_bar" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_button_bar_parent_id_idx" ON "pages_blocks_b61_button_bar" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_button_bar_path_idx" ON "pages_blocks_b61_button_bar" USING btree ("_path");
  CREATE INDEX "pages_blocks_b61_button_bar_first_link_first_link_page_idx" ON "pages_blocks_b61_button_bar" USING btree ("first_link_page_id");
  CREATE INDEX "pages_blocks_b61_button_bar_second_link_second_link_page_idx" ON "pages_blocks_b61_button_bar" USING btree ("second_link_page_id");
  CREATE INDEX "pages_blocks_b61_divider_order_idx" ON "pages_blocks_b61_divider" USING btree ("_order");
  CREATE INDEX "pages_blocks_b61_divider_parent_id_idx" ON "pages_blocks_b61_divider" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_b61_divider_path_idx" ON "pages_blocks_b61_divider" USING btree ("_path");
  CREATE INDEX "pages_blocks_b61_divider_ornament_idx" ON "pages_blocks_b61_divider" USING btree ("ornament_id");
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
  CREATE INDEX "pages_school_idx" ON "pages" USING btree ("school_id");
  CREATE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE UNIQUE INDEX "school_slug_idx" ON "pages" USING btree ("school_id","slug");
  CREATE INDEX "_pages_v_blocks_b61_hero_lines_order_idx" ON "_pages_v_blocks_b61_hero_lines" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_hero_lines_parent_id_idx" ON "_pages_v_blocks_b61_hero_lines" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_hero_meta_items_order_idx" ON "_pages_v_blocks_b61_hero_meta_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_hero_meta_items_parent_id_idx" ON "_pages_v_blocks_b61_hero_meta_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_hero_buttons_order_idx" ON "_pages_v_blocks_b61_hero_buttons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_hero_buttons_parent_id_idx" ON "_pages_v_blocks_b61_hero_buttons" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_hero_buttons_link_link_page_idx" ON "_pages_v_blocks_b61_hero_buttons" USING btree ("link_page_id");
  CREATE INDEX "_pages_v_blocks_b61_hero_slides_order_idx" ON "_pages_v_blocks_b61_hero_slides" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_hero_slides_parent_id_idx" ON "_pages_v_blocks_b61_hero_slides" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_hero_slides_image_idx" ON "_pages_v_blocks_b61_hero_slides" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_b61_hero_collage_order_idx" ON "_pages_v_blocks_b61_hero_collage" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_hero_collage_parent_id_idx" ON "_pages_v_blocks_b61_hero_collage" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_hero_collage_image_idx" ON "_pages_v_blocks_b61_hero_collage" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_b61_hero_order_idx" ON "_pages_v_blocks_b61_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_hero_parent_id_idx" ON "_pages_v_blocks_b61_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_hero_path_idx" ON "_pages_v_blocks_b61_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_b61_hero_image_idx" ON "_pages_v_blocks_b61_hero" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_b61_hero_video_idx" ON "_pages_v_blocks_b61_hero" USING btree ("video_id");
  CREATE INDEX "_pages_v_blocks_b61_hero_video_webm_idx" ON "_pages_v_blocks_b61_hero" USING btree ("video_webm_id");
  CREATE INDEX "_pages_v_blocks_b61_hero_poster_idx" ON "_pages_v_blocks_b61_hero" USING btree ("poster_id");
  CREATE INDEX "_pages_v_blocks_b61_split_lines_order_idx" ON "_pages_v_blocks_b61_split_lines" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_split_lines_parent_id_idx" ON "_pages_v_blocks_b61_split_lines" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_split_subheads_order_idx" ON "_pages_v_blocks_b61_split_subheads" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_split_subheads_parent_id_idx" ON "_pages_v_blocks_b61_split_subheads" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_split_buttons_order_idx" ON "_pages_v_blocks_b61_split_buttons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_split_buttons_parent_id_idx" ON "_pages_v_blocks_b61_split_buttons" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_split_buttons_link_link_page_idx" ON "_pages_v_blocks_b61_split_buttons" USING btree ("link_page_id");
  CREATE INDEX "_pages_v_blocks_b61_split_images_order_idx" ON "_pages_v_blocks_b61_split_images" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_split_images_parent_id_idx" ON "_pages_v_blocks_b61_split_images" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_split_images_image_idx" ON "_pages_v_blocks_b61_split_images" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_b61_split_order_idx" ON "_pages_v_blocks_b61_split" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_split_parent_id_idx" ON "_pages_v_blocks_b61_split" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_split_path_idx" ON "_pages_v_blocks_b61_split" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_b61_split_image_idx" ON "_pages_v_blocks_b61_split" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_b61_prose_lines_order_idx" ON "_pages_v_blocks_b61_prose_lines" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_prose_lines_parent_id_idx" ON "_pages_v_blocks_b61_prose_lines" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_prose_subheads_order_idx" ON "_pages_v_blocks_b61_prose_subheads" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_prose_subheads_parent_id_idx" ON "_pages_v_blocks_b61_prose_subheads" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_prose_buttons_order_idx" ON "_pages_v_blocks_b61_prose_buttons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_prose_buttons_parent_id_idx" ON "_pages_v_blocks_b61_prose_buttons" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_prose_buttons_link_link_page_idx" ON "_pages_v_blocks_b61_prose_buttons" USING btree ("link_page_id");
  CREATE INDEX "_pages_v_blocks_b61_prose_order_idx" ON "_pages_v_blocks_b61_prose" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_prose_parent_id_idx" ON "_pages_v_blocks_b61_prose" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_prose_path_idx" ON "_pages_v_blocks_b61_prose" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_b61_card_grid_lines_order_idx" ON "_pages_v_blocks_b61_card_grid_lines" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_card_grid_lines_parent_id_idx" ON "_pages_v_blocks_b61_card_grid_lines" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_card_grid_subheads_order_idx" ON "_pages_v_blocks_b61_card_grid_subheads" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_card_grid_subheads_parent_id_idx" ON "_pages_v_blocks_b61_card_grid_subheads" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_card_grid_cards_order_idx" ON "_pages_v_blocks_b61_card_grid_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_card_grid_cards_parent_id_idx" ON "_pages_v_blocks_b61_card_grid_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_card_grid_cards_image_idx" ON "_pages_v_blocks_b61_card_grid_cards" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_b61_card_grid_cards_link_link_page_idx" ON "_pages_v_blocks_b61_card_grid_cards" USING btree ("link_page_id");
  CREATE INDEX "_pages_v_blocks_b61_card_grid_buttons_order_idx" ON "_pages_v_blocks_b61_card_grid_buttons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_card_grid_buttons_parent_id_idx" ON "_pages_v_blocks_b61_card_grid_buttons" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_card_grid_buttons_link_link_page_idx" ON "_pages_v_blocks_b61_card_grid_buttons" USING btree ("link_page_id");
  CREATE INDEX "_pages_v_blocks_b61_card_grid_order_idx" ON "_pages_v_blocks_b61_card_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_card_grid_parent_id_idx" ON "_pages_v_blocks_b61_card_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_card_grid_path_idx" ON "_pages_v_blocks_b61_card_grid" USING btree ("_path");
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
  CREATE INDEX "_pages_v_blocks_b61_tabs_tabs_order_idx" ON "_pages_v_blocks_b61_tabs_tabs" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_tabs_tabs_parent_id_idx" ON "_pages_v_blocks_b61_tabs_tabs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_tabs_order_idx" ON "_pages_v_blocks_b61_tabs" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_tabs_parent_id_idx" ON "_pages_v_blocks_b61_tabs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_tabs_path_idx" ON "_pages_v_blocks_b61_tabs" USING btree ("_path");
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
  CREATE INDEX "_pages_v_blocks_b61_carousel_lines_order_idx" ON "_pages_v_blocks_b61_carousel_lines" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_carousel_lines_parent_id_idx" ON "_pages_v_blocks_b61_carousel_lines" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_carousel_subheads_order_idx" ON "_pages_v_blocks_b61_carousel_subheads" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_carousel_subheads_parent_id_idx" ON "_pages_v_blocks_b61_carousel_subheads" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_carousel_slides_order_idx" ON "_pages_v_blocks_b61_carousel_slides" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_carousel_slides_parent_id_idx" ON "_pages_v_blocks_b61_carousel_slides" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_carousel_order_idx" ON "_pages_v_blocks_b61_carousel" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_carousel_parent_id_idx" ON "_pages_v_blocks_b61_carousel" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_carousel_path_idx" ON "_pages_v_blocks_b61_carousel" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_b61_framed_image_order_idx" ON "_pages_v_blocks_b61_framed_image" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_framed_image_parent_id_idx" ON "_pages_v_blocks_b61_framed_image" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_framed_image_path_idx" ON "_pages_v_blocks_b61_framed_image" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_b61_framed_image_image_idx" ON "_pages_v_blocks_b61_framed_image" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_b61_cta_lines_order_idx" ON "_pages_v_blocks_b61_cta_lines" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_cta_lines_parent_id_idx" ON "_pages_v_blocks_b61_cta_lines" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_cta_subheads_order_idx" ON "_pages_v_blocks_b61_cta_subheads" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_cta_subheads_parent_id_idx" ON "_pages_v_blocks_b61_cta_subheads" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_cta_buttons_order_idx" ON "_pages_v_blocks_b61_cta_buttons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_cta_buttons_parent_id_idx" ON "_pages_v_blocks_b61_cta_buttons" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_cta_buttons_link_link_page_idx" ON "_pages_v_blocks_b61_cta_buttons" USING btree ("link_page_id");
  CREATE INDEX "_pages_v_blocks_b61_cta_order_idx" ON "_pages_v_blocks_b61_cta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_cta_parent_id_idx" ON "_pages_v_blocks_b61_cta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_cta_path_idx" ON "_pages_v_blocks_b61_cta" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_b61_cta_image_idx" ON "_pages_v_blocks_b61_cta" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_b61_button_bar_order_idx" ON "_pages_v_blocks_b61_button_bar" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_button_bar_parent_id_idx" ON "_pages_v_blocks_b61_button_bar" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_button_bar_path_idx" ON "_pages_v_blocks_b61_button_bar" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_b61_button_bar_first_link_first_link_pag_idx" ON "_pages_v_blocks_b61_button_bar" USING btree ("first_link_page_id");
  CREATE INDEX "_pages_v_blocks_b61_button_bar_second_link_second_link_p_idx" ON "_pages_v_blocks_b61_button_bar" USING btree ("second_link_page_id");
  CREATE INDEX "_pages_v_blocks_b61_divider_order_idx" ON "_pages_v_blocks_b61_divider" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_b61_divider_parent_id_idx" ON "_pages_v_blocks_b61_divider" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_b61_divider_path_idx" ON "_pages_v_blocks_b61_divider" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_b61_divider_ornament_idx" ON "_pages_v_blocks_b61_divider" USING btree ("ornament_id");
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
  CREATE INDEX "_pages_v_blocks_b61_section_watermark_image_idx" ON "_pages_v_blocks_b61_section" USING btree ("watermark_image_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_school_idx" ON "_pages_v" USING btree ("version_school_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE INDEX "version_school_version_slug_idx" ON "_pages_v" USING btree ("version_school_id","version_slug");
  CREATE INDEX "events_school_idx" ON "events" USING btree ("school_id");
  CREATE INDEX "events_slug_idx" ON "events" USING btree ("slug");
  CREATE INDEX "events_image_idx" ON "events" USING btree ("image_id");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE INDEX "events__status_idx" ON "events" USING btree ("_status");
  CREATE UNIQUE INDEX "school_slug_1_idx" ON "events" USING btree ("school_id","slug");
  CREATE INDEX "_events_v_parent_idx" ON "_events_v" USING btree ("parent_id");
  CREATE INDEX "_events_v_version_version_school_idx" ON "_events_v" USING btree ("version_school_id");
  CREATE INDEX "_events_v_version_version_slug_idx" ON "_events_v" USING btree ("version_slug");
  CREATE INDEX "_events_v_version_version_image_idx" ON "_events_v" USING btree ("version_image_id");
  CREATE INDEX "_events_v_version_version_updated_at_idx" ON "_events_v" USING btree ("version_updated_at");
  CREATE INDEX "_events_v_version_version_created_at_idx" ON "_events_v" USING btree ("version_created_at");
  CREATE INDEX "_events_v_version_version__status_idx" ON "_events_v" USING btree ("version__status");
  CREATE INDEX "_events_v_created_at_idx" ON "_events_v" USING btree ("created_at");
  CREATE INDEX "_events_v_updated_at_idx" ON "_events_v" USING btree ("updated_at");
  CREATE INDEX "_events_v_latest_idx" ON "_events_v" USING btree ("latest");
  CREATE INDEX "_events_v_autosave_idx" ON "_events_v" USING btree ("autosave");
  CREATE INDEX "version_school_version_slug_1_idx" ON "_events_v" USING btree ("version_school_id","version_slug");
  CREATE INDEX "news_school_idx" ON "news" USING btree ("school_id");
  CREATE INDEX "news_slug_idx" ON "news" USING btree ("slug");
  CREATE INDEX "news_image_idx" ON "news" USING btree ("image_id");
  CREATE INDEX "news_updated_at_idx" ON "news" USING btree ("updated_at");
  CREATE INDEX "news_created_at_idx" ON "news" USING btree ("created_at");
  CREATE INDEX "news__status_idx" ON "news" USING btree ("_status");
  CREATE UNIQUE INDEX "school_slug_2_idx" ON "news" USING btree ("school_id","slug");
  CREATE INDEX "_news_v_parent_idx" ON "_news_v" USING btree ("parent_id");
  CREATE INDEX "_news_v_version_version_school_idx" ON "_news_v" USING btree ("version_school_id");
  CREATE INDEX "_news_v_version_version_slug_idx" ON "_news_v" USING btree ("version_slug");
  CREATE INDEX "_news_v_version_version_image_idx" ON "_news_v" USING btree ("version_image_id");
  CREATE INDEX "_news_v_version_version_updated_at_idx" ON "_news_v" USING btree ("version_updated_at");
  CREATE INDEX "_news_v_version_version_created_at_idx" ON "_news_v" USING btree ("version_created_at");
  CREATE INDEX "_news_v_version_version__status_idx" ON "_news_v" USING btree ("version__status");
  CREATE INDEX "_news_v_created_at_idx" ON "_news_v" USING btree ("created_at");
  CREATE INDEX "_news_v_updated_at_idx" ON "_news_v" USING btree ("updated_at");
  CREATE INDEX "_news_v_latest_idx" ON "_news_v" USING btree ("latest");
  CREATE INDEX "_news_v_autosave_idx" ON "_news_v" USING btree ("autosave");
  CREATE INDEX "version_school_version_slug_2_idx" ON "_news_v" USING btree ("version_school_id","version_slug");
  CREATE INDEX "programs_school_idx" ON "programs" USING btree ("school_id");
  CREATE INDEX "programs_slug_idx" ON "programs" USING btree ("slug");
  CREATE INDEX "programs_image_idx" ON "programs" USING btree ("image_id");
  CREATE INDEX "programs_updated_at_idx" ON "programs" USING btree ("updated_at");
  CREATE INDEX "programs_created_at_idx" ON "programs" USING btree ("created_at");
  CREATE INDEX "programs__status_idx" ON "programs" USING btree ("_status");
  CREATE UNIQUE INDEX "school_slug_3_idx" ON "programs" USING btree ("school_id","slug");
  CREATE INDEX "_programs_v_parent_idx" ON "_programs_v" USING btree ("parent_id");
  CREATE INDEX "_programs_v_version_version_school_idx" ON "_programs_v" USING btree ("version_school_id");
  CREATE INDEX "_programs_v_version_version_slug_idx" ON "_programs_v" USING btree ("version_slug");
  CREATE INDEX "_programs_v_version_version_image_idx" ON "_programs_v" USING btree ("version_image_id");
  CREATE INDEX "_programs_v_version_version_updated_at_idx" ON "_programs_v" USING btree ("version_updated_at");
  CREATE INDEX "_programs_v_version_version_created_at_idx" ON "_programs_v" USING btree ("version_created_at");
  CREATE INDEX "_programs_v_version_version__status_idx" ON "_programs_v" USING btree ("version__status");
  CREATE INDEX "_programs_v_created_at_idx" ON "_programs_v" USING btree ("created_at");
  CREATE INDEX "_programs_v_updated_at_idx" ON "_programs_v" USING btree ("updated_at");
  CREATE INDEX "_programs_v_latest_idx" ON "_programs_v" USING btree ("latest");
  CREATE INDEX "_programs_v_autosave_idx" ON "_programs_v" USING btree ("autosave");
  CREATE INDEX "version_school_version_slug_3_idx" ON "_programs_v" USING btree ("version_school_id","version_slug");
  CREATE INDEX "staff_school_idx" ON "staff" USING btree ("school_id");
  CREATE INDEX "staff_photo_idx" ON "staff" USING btree ("photo_id");
  CREATE INDEX "staff_updated_at_idx" ON "staff" USING btree ("updated_at");
  CREATE INDEX "staff_created_at_idx" ON "staff" USING btree ("created_at");
  CREATE INDEX "staff__status_idx" ON "staff" USING btree ("_status");
  CREATE INDEX "_staff_v_parent_idx" ON "_staff_v" USING btree ("parent_id");
  CREATE INDEX "_staff_v_version_version_school_idx" ON "_staff_v" USING btree ("version_school_id");
  CREATE INDEX "_staff_v_version_version_photo_idx" ON "_staff_v" USING btree ("version_photo_id");
  CREATE INDEX "_staff_v_version_version_updated_at_idx" ON "_staff_v" USING btree ("version_updated_at");
  CREATE INDEX "_staff_v_version_version_created_at_idx" ON "_staff_v" USING btree ("version_created_at");
  CREATE INDEX "_staff_v_version_version__status_idx" ON "_staff_v" USING btree ("version__status");
  CREATE INDEX "_staff_v_created_at_idx" ON "_staff_v" USING btree ("created_at");
  CREATE INDEX "_staff_v_updated_at_idx" ON "_staff_v" USING btree ("updated_at");
  CREATE INDEX "_staff_v_latest_idx" ON "_staff_v" USING btree ("latest");
  CREATE INDEX "_staff_v_autosave_idx" ON "_staff_v" USING btree ("autosave");
  CREATE INDEX "media_school_idx" ON "media" USING btree ("school_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "school_settings_menu_links_order_idx" ON "school_settings_menu_links" USING btree ("_order");
  CREATE INDEX "school_settings_menu_links_parent_id_idx" ON "school_settings_menu_links" USING btree ("_parent_id");
  CREATE INDEX "school_settings_menu_links_link_link_page_idx" ON "school_settings_menu_links" USING btree ("link_page_id");
  CREATE INDEX "school_settings_menu_columns_links_order_idx" ON "school_settings_menu_columns_links" USING btree ("_order");
  CREATE INDEX "school_settings_menu_columns_links_parent_id_idx" ON "school_settings_menu_columns_links" USING btree ("_parent_id");
  CREATE INDEX "school_settings_menu_columns_links_link_link_page_idx" ON "school_settings_menu_columns_links" USING btree ("link_page_id");
  CREATE INDEX "school_settings_menu_columns_order_idx" ON "school_settings_menu_columns" USING btree ("_order");
  CREATE INDEX "school_settings_menu_columns_parent_id_idx" ON "school_settings_menu_columns" USING btree ("_parent_id");
  CREATE INDEX "school_settings_menu_order_idx" ON "school_settings_menu" USING btree ("_order");
  CREATE INDEX "school_settings_menu_parent_id_idx" ON "school_settings_menu" USING btree ("_parent_id");
  CREATE INDEX "school_settings_menu_link_link_page_idx" ON "school_settings_menu" USING btree ("link_page_id");
  CREATE INDEX "school_settings_menu_feature_feature_image_idx" ON "school_settings_menu" USING btree ("feature_image_id");
  CREATE INDEX "school_settings_menu_feature_link_feature_link_page_idx" ON "school_settings_menu" USING btree ("feature_link_page_id");
  CREATE INDEX "school_settings_utility_links_order_idx" ON "school_settings_utility_links" USING btree ("_order");
  CREATE INDEX "school_settings_utility_links_parent_id_idx" ON "school_settings_utility_links" USING btree ("_parent_id");
  CREATE INDEX "school_settings_utility_links_link_link_page_idx" ON "school_settings_utility_links" USING btree ("link_page_id");
  CREATE INDEX "school_settings_footer_columns_links_order_idx" ON "school_settings_footer_columns_links" USING btree ("_order");
  CREATE INDEX "school_settings_footer_columns_links_parent_id_idx" ON "school_settings_footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "school_settings_footer_columns_links_link_link_page_idx" ON "school_settings_footer_columns_links" USING btree ("link_page_id");
  CREATE INDEX "school_settings_footer_columns_order_idx" ON "school_settings_footer_columns" USING btree ("_order");
  CREATE INDEX "school_settings_footer_columns_parent_id_idx" ON "school_settings_footer_columns" USING btree ("_parent_id");
  CREATE INDEX "school_settings_social_order_idx" ON "school_settings_social" USING btree ("_order");
  CREATE INDEX "school_settings_social_parent_id_idx" ON "school_settings_social" USING btree ("_parent_id");
  CREATE INDEX "school_settings_legal_links_order_idx" ON "school_settings_legal_links" USING btree ("_order");
  CREATE INDEX "school_settings_legal_links_parent_id_idx" ON "school_settings_legal_links" USING btree ("_parent_id");
  CREATE INDEX "school_settings_legal_links_link_link_page_idx" ON "school_settings_legal_links" USING btree ("link_page_id");
  CREATE UNIQUE INDEX "school_settings_school_idx" ON "school_settings" USING btree ("school_id");
  CREATE INDEX "school_settings_logo_idx" ON "school_settings" USING btree ("logo_id");
  CREATE INDEX "school_settings_header_button_link_header_button_link_pa_idx" ON "school_settings" USING btree ("header_button_link_page_id");
  CREATE INDEX "school_settings_updated_at_idx" ON "school_settings" USING btree ("updated_at");
  CREATE INDEX "school_settings_created_at_idx" ON "school_settings" USING btree ("created_at");
  CREATE INDEX "school_settings__status_idx" ON "school_settings" USING btree ("_status");
  CREATE INDEX "_school_settings_v_version_menu_links_order_idx" ON "_school_settings_v_version_menu_links" USING btree ("_order");
  CREATE INDEX "_school_settings_v_version_menu_links_parent_id_idx" ON "_school_settings_v_version_menu_links" USING btree ("_parent_id");
  CREATE INDEX "_school_settings_v_version_menu_links_link_link_page_idx" ON "_school_settings_v_version_menu_links" USING btree ("link_page_id");
  CREATE INDEX "_school_settings_v_version_menu_columns_links_order_idx" ON "_school_settings_v_version_menu_columns_links" USING btree ("_order");
  CREATE INDEX "_school_settings_v_version_menu_columns_links_parent_id_idx" ON "_school_settings_v_version_menu_columns_links" USING btree ("_parent_id");
  CREATE INDEX "_school_settings_v_version_menu_columns_links_link_link__idx" ON "_school_settings_v_version_menu_columns_links" USING btree ("link_page_id");
  CREATE INDEX "_school_settings_v_version_menu_columns_order_idx" ON "_school_settings_v_version_menu_columns" USING btree ("_order");
  CREATE INDEX "_school_settings_v_version_menu_columns_parent_id_idx" ON "_school_settings_v_version_menu_columns" USING btree ("_parent_id");
  CREATE INDEX "_school_settings_v_version_menu_order_idx" ON "_school_settings_v_version_menu" USING btree ("_order");
  CREATE INDEX "_school_settings_v_version_menu_parent_id_idx" ON "_school_settings_v_version_menu" USING btree ("_parent_id");
  CREATE INDEX "_school_settings_v_version_menu_link_link_page_idx" ON "_school_settings_v_version_menu" USING btree ("link_page_id");
  CREATE INDEX "_school_settings_v_version_menu_feature_feature_image_idx" ON "_school_settings_v_version_menu" USING btree ("feature_image_id");
  CREATE INDEX "_school_settings_v_version_menu_feature_link_feature_lin_idx" ON "_school_settings_v_version_menu" USING btree ("feature_link_page_id");
  CREATE INDEX "_school_settings_v_version_utility_links_order_idx" ON "_school_settings_v_version_utility_links" USING btree ("_order");
  CREATE INDEX "_school_settings_v_version_utility_links_parent_id_idx" ON "_school_settings_v_version_utility_links" USING btree ("_parent_id");
  CREATE INDEX "_school_settings_v_version_utility_links_link_link_page_idx" ON "_school_settings_v_version_utility_links" USING btree ("link_page_id");
  CREATE INDEX "_school_settings_v_version_footer_columns_links_order_idx" ON "_school_settings_v_version_footer_columns_links" USING btree ("_order");
  CREATE INDEX "_school_settings_v_version_footer_columns_links_parent_id_idx" ON "_school_settings_v_version_footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "_school_settings_v_version_footer_columns_links_link_lin_idx" ON "_school_settings_v_version_footer_columns_links" USING btree ("link_page_id");
  CREATE INDEX "_school_settings_v_version_footer_columns_order_idx" ON "_school_settings_v_version_footer_columns" USING btree ("_order");
  CREATE INDEX "_school_settings_v_version_footer_columns_parent_id_idx" ON "_school_settings_v_version_footer_columns" USING btree ("_parent_id");
  CREATE INDEX "_school_settings_v_version_social_order_idx" ON "_school_settings_v_version_social" USING btree ("_order");
  CREATE INDEX "_school_settings_v_version_social_parent_id_idx" ON "_school_settings_v_version_social" USING btree ("_parent_id");
  CREATE INDEX "_school_settings_v_version_legal_links_order_idx" ON "_school_settings_v_version_legal_links" USING btree ("_order");
  CREATE INDEX "_school_settings_v_version_legal_links_parent_id_idx" ON "_school_settings_v_version_legal_links" USING btree ("_parent_id");
  CREATE INDEX "_school_settings_v_version_legal_links_link_link_page_idx" ON "_school_settings_v_version_legal_links" USING btree ("link_page_id");
  CREATE INDEX "_school_settings_v_parent_idx" ON "_school_settings_v" USING btree ("parent_id");
  CREATE INDEX "_school_settings_v_version_version_school_idx" ON "_school_settings_v" USING btree ("version_school_id");
  CREATE INDEX "_school_settings_v_version_version_logo_idx" ON "_school_settings_v" USING btree ("version_logo_id");
  CREATE INDEX "_school_settings_v_version_header_button_link_version_he_idx" ON "_school_settings_v" USING btree ("version_header_button_link_page_id");
  CREATE INDEX "_school_settings_v_version_version_updated_at_idx" ON "_school_settings_v" USING btree ("version_updated_at");
  CREATE INDEX "_school_settings_v_version_version_created_at_idx" ON "_school_settings_v" USING btree ("version_created_at");
  CREATE INDEX "_school_settings_v_version_version__status_idx" ON "_school_settings_v" USING btree ("version__status");
  CREATE INDEX "_school_settings_v_created_at_idx" ON "_school_settings_v" USING btree ("created_at");
  CREATE INDEX "_school_settings_v_updated_at_idx" ON "_school_settings_v" USING btree ("updated_at");
  CREATE INDEX "_school_settings_v_latest_idx" ON "_school_settings_v" USING btree ("latest");
  CREATE INDEX "_school_settings_v_autosave_idx" ON "_school_settings_v" USING btree ("autosave");
  CREATE INDEX "schools_domains_order_idx" ON "schools_domains" USING btree ("_order");
  CREATE INDEX "schools_domains_parent_id_idx" ON "schools_domains" USING btree ("_parent_id");
  CREATE INDEX "schools_domains_domain_idx" ON "schools_domains" USING btree ("domain");
  CREATE UNIQUE INDEX "schools_slug_idx" ON "schools" USING btree ("slug");
  CREATE INDEX "schools_updated_at_idx" ON "schools" USING btree ("updated_at");
  CREATE INDEX "schools_created_at_idx" ON "schools" USING btree ("created_at");
  CREATE INDEX "users_tenants_order_idx" ON "users_tenants" USING btree ("_order");
  CREATE INDEX "users_tenants_parent_id_idx" ON "users_tenants" USING btree ("_parent_id");
  CREATE INDEX "users_tenants_tenant_idx" ON "users_tenants" USING btree ("tenant_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_news_id_idx" ON "payload_locked_documents_rels" USING btree ("news_id");
  CREATE INDEX "payload_locked_documents_rels_programs_id_idx" ON "payload_locked_documents_rels" USING btree ("programs_id");
  CREATE INDEX "payload_locked_documents_rels_staff_id_idx" ON "payload_locked_documents_rels" USING btree ("staff_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_school_settings_id_idx" ON "payload_locked_documents_rels" USING btree ("school_settings_id");
  CREATE INDEX "payload_locked_documents_rels_schools_id_idx" ON "payload_locked_documents_rels" USING btree ("schools_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_b61_hero_lines" CASCADE;
  DROP TABLE "pages_blocks_b61_hero_meta_items" CASCADE;
  DROP TABLE "pages_blocks_b61_hero_buttons" CASCADE;
  DROP TABLE "pages_blocks_b61_hero_slides" CASCADE;
  DROP TABLE "pages_blocks_b61_hero_collage" CASCADE;
  DROP TABLE "pages_blocks_b61_hero" CASCADE;
  DROP TABLE "pages_blocks_b61_split_lines" CASCADE;
  DROP TABLE "pages_blocks_b61_split_subheads" CASCADE;
  DROP TABLE "pages_blocks_b61_split_buttons" CASCADE;
  DROP TABLE "pages_blocks_b61_split_images" CASCADE;
  DROP TABLE "pages_blocks_b61_split" CASCADE;
  DROP TABLE "pages_blocks_b61_prose_lines" CASCADE;
  DROP TABLE "pages_blocks_b61_prose_subheads" CASCADE;
  DROP TABLE "pages_blocks_b61_prose_buttons" CASCADE;
  DROP TABLE "pages_blocks_b61_prose" CASCADE;
  DROP TABLE "pages_blocks_b61_card_grid_lines" CASCADE;
  DROP TABLE "pages_blocks_b61_card_grid_subheads" CASCADE;
  DROP TABLE "pages_blocks_b61_card_grid_cards" CASCADE;
  DROP TABLE "pages_blocks_b61_card_grid_buttons" CASCADE;
  DROP TABLE "pages_blocks_b61_card_grid" CASCADE;
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
  DROP TABLE "pages_blocks_b61_accordion_lines" CASCADE;
  DROP TABLE "pages_blocks_b61_accordion_subheads" CASCADE;
  DROP TABLE "pages_blocks_b61_accordion_items" CASCADE;
  DROP TABLE "pages_blocks_b61_accordion_buttons" CASCADE;
  DROP TABLE "pages_blocks_b61_accordion" CASCADE;
  DROP TABLE "pages_blocks_b61_tabs_lines" CASCADE;
  DROP TABLE "pages_blocks_b61_tabs_subheads" CASCADE;
  DROP TABLE "pages_blocks_b61_tabs_tabs" CASCADE;
  DROP TABLE "pages_blocks_b61_tabs" CASCADE;
  DROP TABLE "pages_blocks_b61_pillars_lines" CASCADE;
  DROP TABLE "pages_blocks_b61_pillars_subheads" CASCADE;
  DROP TABLE "pages_blocks_b61_pillars_items" CASCADE;
  DROP TABLE "pages_blocks_b61_pillars" CASCADE;
  DROP TABLE "pages_blocks_b61_carousel_lines" CASCADE;
  DROP TABLE "pages_blocks_b61_carousel_subheads" CASCADE;
  DROP TABLE "pages_blocks_b61_carousel_slides" CASCADE;
  DROP TABLE "pages_blocks_b61_carousel" CASCADE;
  DROP TABLE "pages_blocks_b61_framed_image" CASCADE;
  DROP TABLE "pages_blocks_b61_cta_lines" CASCADE;
  DROP TABLE "pages_blocks_b61_cta_subheads" CASCADE;
  DROP TABLE "pages_blocks_b61_cta_buttons" CASCADE;
  DROP TABLE "pages_blocks_b61_cta" CASCADE;
  DROP TABLE "pages_blocks_b61_button_bar" CASCADE;
  DROP TABLE "pages_blocks_b61_divider" CASCADE;
  DROP TABLE "pages_blocks_b61_rail_buttons" CASCADE;
  DROP TABLE "pages_blocks_b61_rail_links" CASCADE;
  DROP TABLE "pages_blocks_b61_rail" CASCADE;
  DROP TABLE "pages_blocks_b61_section" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_hero_lines" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_hero_meta_items" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_hero_buttons" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_hero_slides" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_hero_collage" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_split_lines" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_split_subheads" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_split_buttons" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_split_images" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_split" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_prose_lines" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_prose_subheads" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_prose_buttons" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_prose" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_card_grid_lines" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_card_grid_subheads" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_card_grid_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_card_grid_buttons" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_card_grid" CASCADE;
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
  DROP TABLE "_pages_v_blocks_b61_accordion_lines" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_accordion_subheads" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_accordion_items" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_accordion_buttons" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_accordion" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_tabs_lines" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_tabs_subheads" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_tabs_tabs" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_tabs" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_pillars_lines" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_pillars_subheads" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_pillars_items" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_pillars" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_carousel_lines" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_carousel_subheads" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_carousel_slides" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_carousel" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_framed_image" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_cta_lines" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_cta_subheads" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_cta_buttons" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_cta" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_button_bar" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_divider" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_rail_buttons" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_rail_links" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_rail" CASCADE;
  DROP TABLE "_pages_v_blocks_b61_section" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "_events_v" CASCADE;
  DROP TABLE "news" CASCADE;
  DROP TABLE "_news_v" CASCADE;
  DROP TABLE "programs" CASCADE;
  DROP TABLE "_programs_v" CASCADE;
  DROP TABLE "staff" CASCADE;
  DROP TABLE "_staff_v" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "school_settings_menu_links" CASCADE;
  DROP TABLE "school_settings_menu_columns_links" CASCADE;
  DROP TABLE "school_settings_menu_columns" CASCADE;
  DROP TABLE "school_settings_menu" CASCADE;
  DROP TABLE "school_settings_utility_links" CASCADE;
  DROP TABLE "school_settings_footer_columns_links" CASCADE;
  DROP TABLE "school_settings_footer_columns" CASCADE;
  DROP TABLE "school_settings_social" CASCADE;
  DROP TABLE "school_settings_legal_links" CASCADE;
  DROP TABLE "school_settings" CASCADE;
  DROP TABLE "_school_settings_v_version_menu_links" CASCADE;
  DROP TABLE "_school_settings_v_version_menu_columns_links" CASCADE;
  DROP TABLE "_school_settings_v_version_menu_columns" CASCADE;
  DROP TABLE "_school_settings_v_version_menu" CASCADE;
  DROP TABLE "_school_settings_v_version_utility_links" CASCADE;
  DROP TABLE "_school_settings_v_version_footer_columns_links" CASCADE;
  DROP TABLE "_school_settings_v_version_footer_columns" CASCADE;
  DROP TABLE "_school_settings_v_version_social" CASCADE;
  DROP TABLE "_school_settings_v_version_legal_links" CASCADE;
  DROP TABLE "_school_settings_v" CASCADE;
  DROP TABLE "schools_domains" CASCADE;
  DROP TABLE "schools" CASCADE;
  DROP TABLE "users_tenants" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_b61_hero_buttons_variant";
  DROP TYPE "public"."enum_pages_blocks_b61_hero_buttons_link_type";
  DROP TYPE "public"."enum_pages_blocks_b61_hero_layout_mode";
  DROP TYPE "public"."enum_pages_blocks_b61_hero_heading_level";
  DROP TYPE "public"."enum_pages_blocks_b61_hero_subheadline_scale";
  DROP TYPE "public"."enum_pages_blocks_b61_hero_background_type";
  DROP TYPE "public"."enum_pages_blocks_b61_hero_height";
  DROP TYPE "public"."enum_pages_blocks_b61_hero_band_size";
  DROP TYPE "public"."enum_pages_blocks_b61_hero_vertical_position";
  DROP TYPE "public"."enum_pages_blocks_b61_hero_text_align";
  DROP TYPE "public"."enum_pages_blocks_b61_hero_pad_top";
  DROP TYPE "public"."enum_pages_blocks_b61_hero_pad_bottom";
  DROP TYPE "public"."enum_pages_blocks_b61_hero_overlay";
  DROP TYPE "public"."enum_pages_blocks_b61_hero_surface";
  DROP TYPE "public"."enum_pages_blocks_b61_hero_eyebrow_rule";
  DROP TYPE "public"."enum_pages_blocks_b61_hero_entrance";
  DROP TYPE "public"."enum_pages_blocks_b61_split_buttons_variant";
  DROP TYPE "public"."enum_pages_blocks_b61_split_buttons_link_type";
  DROP TYPE "public"."enum_pages_blocks_b61_split_heading_level";
  DROP TYPE "public"."enum_pages_blocks_b61_split_media";
  DROP TYPE "public"."enum_pages_blocks_b61_split_columns";
  DROP TYPE "public"."enum_pages_blocks_b61_split_image_shape";
  DROP TYPE "public"."enum_pages_blocks_b61_split_image_side";
  DROP TYPE "public"."enum_pages_blocks_b61_split_vertical_position";
  DROP TYPE "public"."enum_pages_blocks_b61_split_stack_order";
  DROP TYPE "public"."enum_pages_blocks_b61_split_column_height";
  DROP TYPE "public"."enum_pages_blocks_b61_split_heading_align";
  DROP TYPE "public"."enum_pages_blocks_b61_split_pad_top";
  DROP TYPE "public"."enum_pages_blocks_b61_split_pad_bottom";
  DROP TYPE "public"."enum_pages_blocks_b61_split_surface";
  DROP TYPE "public"."enum_pages_blocks_b61_split_text_panel";
  DROP TYPE "public"."enum_pages_blocks_b61_split_frame_color";
  DROP TYPE "public"."enum_pages_blocks_b61_split_eyebrow_rule";
  DROP TYPE "public"."enum_pages_blocks_b61_split_entrance";
  DROP TYPE "public"."enum_pages_blocks_b61_prose_buttons_variant";
  DROP TYPE "public"."enum_pages_blocks_b61_prose_buttons_link_type";
  DROP TYPE "public"."enum_pages_blocks_b61_prose_heading_level";
  DROP TYPE "public"."enum_pages_blocks_b61_prose_head_position";
  DROP TYPE "public"."enum_pages_blocks_b61_prose_text_align";
  DROP TYPE "public"."enum_pages_blocks_b61_prose_position";
  DROP TYPE "public"."enum_pages_blocks_b61_prose_heading_width";
  DROP TYPE "public"."enum_pages_blocks_b61_prose_pad_top";
  DROP TYPE "public"."enum_pages_blocks_b61_prose_pad_bottom";
  DROP TYPE "public"."enum_pages_blocks_b61_prose_iconlist_style";
  DROP TYPE "public"."enum_pages_blocks_b61_prose_surface";
  DROP TYPE "public"."enum_pages_blocks_b61_prose_eyebrow_rule";
  DROP TYPE "public"."enum_pages_blocks_b61_prose_heading_rule";
  DROP TYPE "public"."enum_pages_blocks_b61_prose_entrance";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_cards_icon";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_cards_link_type";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_buttons_variant";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_buttons_link_type";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_heading_level";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_source";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_media_type";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_arrangement";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_columns";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_text_align";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_advance";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_peek";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_controls_position";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_pad_top";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_pad_bottom";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_card_style";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_card_shape";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_image_shape";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_card_text_position";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_icon_size";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_cta_case";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_cta_size";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_surface";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_card_surface";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_card_overlay";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_eyebrow_rule";
  DROP TYPE "public"."enum_pages_blocks_b61_card_grid_entrance";
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
  DROP TYPE "public"."enum_pages_blocks_b61_tabs_heading_level";
  DROP TYPE "public"."enum_pages_blocks_b61_tabs_tab_position";
  DROP TYPE "public"."enum_pages_blocks_b61_tabs_tab_align";
  DROP TYPE "public"."enum_pages_blocks_b61_tabs_heading_align";
  DROP TYPE "public"."enum_pages_blocks_b61_tabs_pad_top";
  DROP TYPE "public"."enum_pages_blocks_b61_tabs_pad_bottom";
  DROP TYPE "public"."enum_pages_blocks_b61_tabs_surface";
  DROP TYPE "public"."enum_pages_blocks_b61_tabs_eyebrow_rule";
  DROP TYPE "public"."enum_pages_blocks_b61_tabs_entrance";
  DROP TYPE "public"."enum_pages_blocks_b61_pillars_heading_level";
  DROP TYPE "public"."enum_pages_blocks_b61_pillars_tab_position";
  DROP TYPE "public"."enum_pages_blocks_b61_pillars_tab_align";
  DROP TYPE "public"."enum_pages_blocks_b61_pillars_heading_align";
  DROP TYPE "public"."enum_pages_blocks_b61_pillars_pad_top";
  DROP TYPE "public"."enum_pages_blocks_b61_pillars_pad_bottom";
  DROP TYPE "public"."enum_pages_blocks_b61_pillars_surface";
  DROP TYPE "public"."enum_pages_blocks_b61_pillars_eyebrow_rule";
  DROP TYPE "public"."enum_pages_blocks_b61_pillars_entrance";
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
  DROP TYPE "public"."enum_pages_blocks_b61_framed_image_image_shape";
  DROP TYPE "public"."enum_pages_blocks_b61_framed_image_image_height";
  DROP TYPE "public"."enum_pages_blocks_b61_framed_image_frame_color";
  DROP TYPE "public"."enum_pages_blocks_b61_framed_image_entrance";
  DROP TYPE "public"."enum_pages_blocks_b61_cta_buttons_variant";
  DROP TYPE "public"."enum_pages_blocks_b61_cta_buttons_link_type";
  DROP TYPE "public"."enum_pages_blocks_b61_cta_heading_level";
  DROP TYPE "public"."enum_pages_blocks_b61_cta_text_align";
  DROP TYPE "public"."enum_pages_blocks_b61_cta_position";
  DROP TYPE "public"."enum_pages_blocks_b61_cta_pad_top";
  DROP TYPE "public"."enum_pages_blocks_b61_cta_pad_bottom";
  DROP TYPE "public"."enum_pages_blocks_b61_cta_surface";
  DROP TYPE "public"."enum_pages_blocks_b61_cta_text_panel";
  DROP TYPE "public"."enum_pages_blocks_b61_cta_eyebrow_rule";
  DROP TYPE "public"."enum_pages_blocks_b61_cta_entrance";
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
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_b61_hero_buttons_variant";
  DROP TYPE "public"."enum__pages_v_blocks_b61_hero_buttons_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_b61_hero_layout_mode";
  DROP TYPE "public"."enum__pages_v_blocks_b61_hero_heading_level";
  DROP TYPE "public"."enum__pages_v_blocks_b61_hero_subheadline_scale";
  DROP TYPE "public"."enum__pages_v_blocks_b61_hero_background_type";
  DROP TYPE "public"."enum__pages_v_blocks_b61_hero_height";
  DROP TYPE "public"."enum__pages_v_blocks_b61_hero_band_size";
  DROP TYPE "public"."enum__pages_v_blocks_b61_hero_vertical_position";
  DROP TYPE "public"."enum__pages_v_blocks_b61_hero_text_align";
  DROP TYPE "public"."enum__pages_v_blocks_b61_hero_pad_top";
  DROP TYPE "public"."enum__pages_v_blocks_b61_hero_pad_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_b61_hero_overlay";
  DROP TYPE "public"."enum__pages_v_blocks_b61_hero_surface";
  DROP TYPE "public"."enum__pages_v_blocks_b61_hero_eyebrow_rule";
  DROP TYPE "public"."enum__pages_v_blocks_b61_hero_entrance";
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_buttons_variant";
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_buttons_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_heading_level";
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_media";
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_columns";
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_image_shape";
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_image_side";
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_vertical_position";
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_stack_order";
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_column_height";
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_heading_align";
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_pad_top";
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_pad_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_surface";
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_text_panel";
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_frame_color";
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_eyebrow_rule";
  DROP TYPE "public"."enum__pages_v_blocks_b61_split_entrance";
  DROP TYPE "public"."enum__pages_v_blocks_b61_prose_buttons_variant";
  DROP TYPE "public"."enum__pages_v_blocks_b61_prose_buttons_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_b61_prose_heading_level";
  DROP TYPE "public"."enum__pages_v_blocks_b61_prose_head_position";
  DROP TYPE "public"."enum__pages_v_blocks_b61_prose_text_align";
  DROP TYPE "public"."enum__pages_v_blocks_b61_prose_position";
  DROP TYPE "public"."enum__pages_v_blocks_b61_prose_heading_width";
  DROP TYPE "public"."enum__pages_v_blocks_b61_prose_pad_top";
  DROP TYPE "public"."enum__pages_v_blocks_b61_prose_pad_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_b61_prose_iconlist_style";
  DROP TYPE "public"."enum__pages_v_blocks_b61_prose_surface";
  DROP TYPE "public"."enum__pages_v_blocks_b61_prose_eyebrow_rule";
  DROP TYPE "public"."enum__pages_v_blocks_b61_prose_heading_rule";
  DROP TYPE "public"."enum__pages_v_blocks_b61_prose_entrance";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_cards_icon";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_cards_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_buttons_variant";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_buttons_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_heading_level";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_source";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_media_type";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_arrangement";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_columns";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_text_align";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_advance";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_peek";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_controls_position";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_pad_top";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_pad_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_card_style";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_card_shape";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_image_shape";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_card_text_position";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_icon_size";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_cta_case";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_cta_size";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_surface";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_card_surface";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_card_overlay";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_eyebrow_rule";
  DROP TYPE "public"."enum__pages_v_blocks_b61_card_grid_entrance";
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
  DROP TYPE "public"."enum__pages_v_blocks_b61_tabs_heading_level";
  DROP TYPE "public"."enum__pages_v_blocks_b61_tabs_tab_position";
  DROP TYPE "public"."enum__pages_v_blocks_b61_tabs_tab_align";
  DROP TYPE "public"."enum__pages_v_blocks_b61_tabs_heading_align";
  DROP TYPE "public"."enum__pages_v_blocks_b61_tabs_pad_top";
  DROP TYPE "public"."enum__pages_v_blocks_b61_tabs_pad_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_b61_tabs_surface";
  DROP TYPE "public"."enum__pages_v_blocks_b61_tabs_eyebrow_rule";
  DROP TYPE "public"."enum__pages_v_blocks_b61_tabs_entrance";
  DROP TYPE "public"."enum__pages_v_blocks_b61_pillars_heading_level";
  DROP TYPE "public"."enum__pages_v_blocks_b61_pillars_tab_position";
  DROP TYPE "public"."enum__pages_v_blocks_b61_pillars_tab_align";
  DROP TYPE "public"."enum__pages_v_blocks_b61_pillars_heading_align";
  DROP TYPE "public"."enum__pages_v_blocks_b61_pillars_pad_top";
  DROP TYPE "public"."enum__pages_v_blocks_b61_pillars_pad_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_b61_pillars_surface";
  DROP TYPE "public"."enum__pages_v_blocks_b61_pillars_eyebrow_rule";
  DROP TYPE "public"."enum__pages_v_blocks_b61_pillars_entrance";
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
  DROP TYPE "public"."enum__pages_v_blocks_b61_framed_image_image_shape";
  DROP TYPE "public"."enum__pages_v_blocks_b61_framed_image_image_height";
  DROP TYPE "public"."enum__pages_v_blocks_b61_framed_image_frame_color";
  DROP TYPE "public"."enum__pages_v_blocks_b61_framed_image_entrance";
  DROP TYPE "public"."enum__pages_v_blocks_b61_cta_buttons_variant";
  DROP TYPE "public"."enum__pages_v_blocks_b61_cta_buttons_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_b61_cta_heading_level";
  DROP TYPE "public"."enum__pages_v_blocks_b61_cta_text_align";
  DROP TYPE "public"."enum__pages_v_blocks_b61_cta_position";
  DROP TYPE "public"."enum__pages_v_blocks_b61_cta_pad_top";
  DROP TYPE "public"."enum__pages_v_blocks_b61_cta_pad_bottom";
  DROP TYPE "public"."enum__pages_v_blocks_b61_cta_surface";
  DROP TYPE "public"."enum__pages_v_blocks_b61_cta_text_panel";
  DROP TYPE "public"."enum__pages_v_blocks_b61_cta_eyebrow_rule";
  DROP TYPE "public"."enum__pages_v_blocks_b61_cta_entrance";
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
  DROP TYPE "public"."enum__pages_v_blocks_b61_divider_entrance";
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
  DROP TYPE "public"."enum__pages_v_blocks_b61_section_entrance";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_events_audience";
  DROP TYPE "public"."enum_events_status";
  DROP TYPE "public"."enum__events_v_version_audience";
  DROP TYPE "public"."enum__events_v_version_status";
  DROP TYPE "public"."enum_news_audience";
  DROP TYPE "public"."enum_news_status";
  DROP TYPE "public"."enum__news_v_version_audience";
  DROP TYPE "public"."enum__news_v_version_status";
  DROP TYPE "public"."enum_programs_status";
  DROP TYPE "public"."enum__programs_v_version_status";
  DROP TYPE "public"."enum_staff_status";
  DROP TYPE "public"."enum__staff_v_version_status";
  DROP TYPE "public"."enum_school_settings_menu_links_link_type";
  DROP TYPE "public"."enum_school_settings_menu_columns_links_link_type";
  DROP TYPE "public"."enum_school_settings_menu_kind";
  DROP TYPE "public"."enum_school_settings_menu_link_type";
  DROP TYPE "public"."enum_school_settings_menu_feature_link_type";
  DROP TYPE "public"."enum_school_settings_utility_links_link_type";
  DROP TYPE "public"."enum_school_settings_footer_columns_links_link_type";
  DROP TYPE "public"."enum_school_settings_social_platform";
  DROP TYPE "public"."enum_school_settings_legal_links_link_type";
  DROP TYPE "public"."enum_school_settings_heading_font";
  DROP TYPE "public"."enum_school_settings_body_font";
  DROP TYPE "public"."enum_school_settings_ui_font";
  DROP TYPE "public"."enum_school_settings_header_button_link_type";
  DROP TYPE "public"."enum_school_settings_status";
  DROP TYPE "public"."enum__school_settings_v_version_menu_links_link_type";
  DROP TYPE "public"."enum__school_settings_v_version_menu_columns_links_link_type";
  DROP TYPE "public"."enum__school_settings_v_version_menu_kind";
  DROP TYPE "public"."enum__school_settings_v_version_menu_link_type";
  DROP TYPE "public"."enum__school_settings_v_version_menu_feature_link_type";
  DROP TYPE "public"."enum__school_settings_v_version_utility_links_link_type";
  DROP TYPE "public"."enum__school_settings_v_version_footer_columns_links_link_type";
  DROP TYPE "public"."enum__school_settings_v_version_social_platform";
  DROP TYPE "public"."enum__school_settings_v_version_legal_links_link_type";
  DROP TYPE "public"."enum__school_settings_v_version_heading_font";
  DROP TYPE "public"."enum__school_settings_v_version_body_font";
  DROP TYPE "public"."enum__school_settings_v_version_ui_font";
  DROP TYPE "public"."enum__school_settings_v_version_header_button_link_type";
  DROP TYPE "public"."enum__school_settings_v_version_status";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";`)
}
