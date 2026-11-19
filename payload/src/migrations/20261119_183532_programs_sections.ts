import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_programs_blocks_b61_hero_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum_programs_blocks_b61_hero_buttons_action" AS ENUM('link', 'video');
  CREATE TYPE "public"."enum_programs_blocks_b61_hero_buttons_link_type" AS ENUM('page', 'document', 'url');
  CREATE TYPE "public"."enum_programs_blocks_b61_hero_layout_mode" AS ENUM('cover', 'band', 'split', 'type');
  CREATE TYPE "public"."enum_programs_blocks_b61_hero_heading_level" AS ENUM('auto', 'h1', 'h2', 'h3');
  CREATE TYPE "public"."enum_programs_blocks_b61_hero_background_type" AS ENUM('image', 'slideshow', 'video');
  CREATE TYPE "public"."enum_programs_blocks_b61_hero_height" AS ENUM('short', 'medium', 'tall', 'full');
  CREATE TYPE "public"."enum_programs_blocks_b61_hero_band_size" AS ENUM('compact', 'standard');
  CREATE TYPE "public"."enum_programs_blocks_b61_hero_split_side" AS ENUM('right', 'left');
  CREATE TYPE "public"."enum_programs_blocks_b61_hero_vertical_position" AS ENUM('top', 'center', 'bottom');
  CREATE TYPE "public"."enum_programs_blocks_b61_hero_text_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_programs_blocks_b61_hero_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_programs_blocks_b61_hero_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_programs_blocks_b61_hero_overlay" AS ENUM('gradient', 'wash');
  CREATE TYPE "public"."enum_programs_blocks_b61_hero_surface" AS ENUM('light', 'primary', 'secondary');
  CREATE TYPE "public"."enum_programs_blocks_b61_hero_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum_programs_blocks_b61_hero_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum_programs_blocks_b61_split_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum_programs_blocks_b61_split_buttons_action" AS ENUM('link', 'video');
  CREATE TYPE "public"."enum_programs_blocks_b61_split_buttons_link_type" AS ENUM('page', 'document', 'url');
  CREATE TYPE "public"."enum_programs_blocks_b61_split_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum_programs_blocks_b61_split_media" AS ENUM('photo', 'gallery', 'video');
  CREATE TYPE "public"."enum_programs_blocks_b61_split_gallery_layout" AS ENUM('grid', 'masonry', 'strip');
  CREATE TYPE "public"."enum_programs_blocks_b61_split_image_shape" AS ENUM('fixed', 'portrait', 'square', 'landscape', 'wide');
  CREATE TYPE "public"."enum_programs_blocks_b61_split_image_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_programs_blocks_b61_split_vertical_position" AS ENUM('top', 'center');
  CREATE TYPE "public"."enum_programs_blocks_b61_split_stack_order" AS ENUM('text', 'media');
  CREATE TYPE "public"."enum_programs_blocks_b61_split_column_height" AS ENUM('fit', 'fill');
  CREATE TYPE "public"."enum_programs_blocks_b61_split_heading_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_programs_blocks_b61_split_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_programs_blocks_b61_split_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_programs_blocks_b61_split_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_programs_blocks_b61_split_text_panel" AS ENUM('none', 'plain', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_programs_blocks_b61_split_frame_color" AS ENUM('primary', 'secondary', 'accent');
  CREATE TYPE "public"."enum_programs_blocks_b61_split_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum_programs_blocks_b61_split_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum_programs_blocks_b61_prose_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum_programs_blocks_b61_prose_buttons_action" AS ENUM('link', 'video');
  CREATE TYPE "public"."enum_programs_blocks_b61_prose_buttons_link_type" AS ENUM('page', 'document', 'url');
  CREATE TYPE "public"."enum_programs_blocks_b61_prose_heading_level" AS ENUM('auto', 'h1', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum_programs_blocks_b61_prose_head_position" AS ENUM('above', 'beside');
  CREATE TYPE "public"."enum_programs_blocks_b61_prose_text_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_programs_blocks_b61_prose_position" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_programs_blocks_b61_prose_heading_width" AS ENUM('text', 'full');
  CREATE TYPE "public"."enum_programs_blocks_b61_prose_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_programs_blocks_b61_prose_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_programs_blocks_b61_prose_iconlist_style" AS ENUM('standard', 'links');
  CREATE TYPE "public"."enum_programs_blocks_b61_prose_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_programs_blocks_b61_prose_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum_programs_blocks_b61_prose_heading_rule" AS ENUM('site', 'none', 'trailing');
  CREATE TYPE "public"."enum_programs_blocks_b61_prose_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum_programs_blocks_b61_card_grid_cards_icon" AS ENUM('check', 'question', 'email', 'phone', 'location', 'calendar', 'clock', 'link', 'star', 'heart', 'book', 'people', 'cross', 'school', 'custom');
  CREATE TYPE "public"."enum_programs_blocks_b61_card_grid_cards_link_type" AS ENUM('page', 'document', 'url');
  CREATE TYPE "public"."enum_programs_blocks_b61_card_grid_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum_programs_blocks_b61_card_grid_buttons_action" AS ENUM('link', 'video');
  CREATE TYPE "public"."enum_programs_blocks_b61_card_grid_buttons_link_type" AS ENUM('page', 'document', 'url');
  CREATE TYPE "public"."enum_programs_blocks_b61_card_grid_card_text" AS ENUM('below', 'on');
  CREATE TYPE "public"."enum_programs_blocks_b61_card_grid_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum_programs_blocks_b61_card_grid_source" AS ENUM('manual', 'programs', 'upcoming-events', 'latest-news', 'staff', 'school-facts');
  CREATE TYPE "public"."enum_programs_blocks_b61_card_grid_media_type" AS ENUM('image', 'icon', 'none');
  CREATE TYPE "public"."enum_programs_blocks_b61_card_grid_arrangement" AS ENUM('grid', 'carousel');
  CREATE TYPE "public"."enum_programs_blocks_b61_card_grid_columns" AS ENUM('1', '2', '3', '4');
  CREATE TYPE "public"."enum_programs_blocks_b61_card_grid_text_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_programs_blocks_b61_card_grid_advance" AS ENUM('one', 'view');
  CREATE TYPE "public"."enum_programs_blocks_b61_card_grid_controls_position" AS ENUM('top-right', 'bottom-left', 'bottom-center', 'bottom-right', 'sides', 'hidden');
  CREATE TYPE "public"."enum_programs_blocks_b61_card_grid_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_programs_blocks_b61_card_grid_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_programs_blocks_b61_card_grid_card_style" AS ENUM('plain', 'flat', 'bordered');
  CREATE TYPE "public"."enum_programs_blocks_b61_card_grid_card_shape" AS ENUM('portrait', 'square', 'landscape', 'custom');
  CREATE TYPE "public"."enum_programs_blocks_b61_card_grid_image_shape" AS ENUM('fixed', 'custom');
  CREATE TYPE "public"."enum_programs_blocks_b61_card_grid_card_text_position" AS ENUM('top', 'center', 'bottom');
  CREATE TYPE "public"."enum_programs_blocks_b61_card_grid_icon_size" AS ENUM('sm', 'md', 'lg');
  CREATE TYPE "public"."enum_programs_blocks_b61_card_grid_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_programs_blocks_b61_card_grid_card_surface" AS ENUM('light', 'soft', 'primary');
  CREATE TYPE "public"."enum_programs_blocks_b61_card_grid_card_overlay" AS ENUM('none', 'gradient', 'wash');
  CREATE TYPE "public"."enum_programs_blocks_b61_card_grid_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum_programs_blocks_b61_card_grid_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum_programs_blocks_b61_stats_band_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum_programs_blocks_b61_stats_band_buttons_action" AS ENUM('link', 'video');
  CREATE TYPE "public"."enum_programs_blocks_b61_stats_band_buttons_link_type" AS ENUM('page', 'document', 'url');
  CREATE TYPE "public"."enum_programs_blocks_b61_stats_band_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum_programs_blocks_b61_stats_band_columns" AS ENUM('1', '2', '3', '4');
  CREATE TYPE "public"."enum_programs_blocks_b61_stats_band_label_position" AS ENUM('below', 'above');
  CREATE TYPE "public"."enum_programs_blocks_b61_stats_band_text_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_programs_blocks_b61_stats_band_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_programs_blocks_b61_stats_band_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_programs_blocks_b61_stats_band_item_style" AS ENUM('plain', 'divided', 'boxed', 'inline');
  CREATE TYPE "public"."enum_programs_blocks_b61_stats_band_figure_scale" AS ENUM('large', 'medium', 'small');
  CREATE TYPE "public"."enum_programs_blocks_b61_stats_band_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_programs_blocks_b61_stats_band_item_surface" AS ENUM('outline', 'light', 'card', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_programs_blocks_b61_stats_band_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum_programs_blocks_b61_stats_band_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum_programs_blocks_b61_stats_band_band_width" AS ENUM('full', 'right', 'left');
  CREATE TYPE "public"."enum_programs_blocks_b61_gallery_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum_programs_blocks_b61_gallery_buttons_action" AS ENUM('link', 'video');
  CREATE TYPE "public"."enum_programs_blocks_b61_gallery_buttons_link_type" AS ENUM('page', 'document', 'url');
  CREATE TYPE "public"."enum_programs_blocks_b61_gallery_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum_programs_blocks_b61_gallery_media" AS ENUM('photo', 'gallery', 'video');
  CREATE TYPE "public"."enum_programs_blocks_b61_gallery_gallery_layout" AS ENUM('strip', 'grid', 'masonry');
  CREATE TYPE "public"."enum_programs_blocks_b61_gallery_text_position" AS ENUM('above', 'beside');
  CREATE TYPE "public"."enum_programs_blocks_b61_gallery_heading_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_programs_blocks_b61_gallery_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_programs_blocks_b61_gallery_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_programs_blocks_b61_gallery_item_size" AS ENUM('small', 'medium', 'large');
  CREATE TYPE "public"."enum_programs_blocks_b61_gallery_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_programs_blocks_b61_gallery_image_shape" AS ENUM('fixed', 'portrait', 'square', 'landscape', 'wide');
  CREATE TYPE "public"."enum_programs_blocks_b61_gallery_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_programs_blocks_b61_gallery_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum_programs_blocks_b61_gallery_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum_programs_blocks_b61_testimonial_text_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_programs_blocks_b61_testimonial_text_style" AS ENUM('italic', 'normal');
  CREATE TYPE "public"."enum_programs_blocks_b61_testimonial_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_programs_blocks_b61_testimonial_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_programs_blocks_b61_testimonial_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_programs_blocks_b61_testimonial_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum_programs_blocks_b61_testimonial_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum_programs_blocks_b61_accordion_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum_programs_blocks_b61_accordion_buttons_action" AS ENUM('link', 'video');
  CREATE TYPE "public"."enum_programs_blocks_b61_accordion_buttons_link_type" AS ENUM('page', 'document', 'url');
  CREATE TYPE "public"."enum_programs_blocks_b61_accordion_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum_programs_blocks_b61_accordion_heading_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_programs_blocks_b61_accordion_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_programs_blocks_b61_accordion_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_programs_blocks_b61_accordion_item_style" AS ENUM('divided', 'boxed', 'separated');
  CREATE TYPE "public"."enum_programs_blocks_b61_accordion_icon_style" AS ENUM('chevron', 'plusminus');
  CREATE TYPE "public"."enum_programs_blocks_b61_accordion_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_programs_blocks_b61_accordion_item_surface" AS ENUM('outline', 'light', 'card', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_programs_blocks_b61_accordion_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum_programs_blocks_b61_accordion_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum_programs_blocks_b61_tabs_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum_programs_blocks_b61_tabs_tab_position" AS ENUM('top', 'left', 'right');
  CREATE TYPE "public"."enum_programs_blocks_b61_tabs_tab_align" AS ENUM('left', 'center', 'full');
  CREATE TYPE "public"."enum_programs_blocks_b61_tabs_heading_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_programs_blocks_b61_tabs_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_programs_blocks_b61_tabs_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_programs_blocks_b61_tabs_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_programs_blocks_b61_tabs_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum_programs_blocks_b61_tabs_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum_programs_blocks_b61_pillars_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum_programs_blocks_b61_pillars_tab_position" AS ENUM('left', 'right', 'top');
  CREATE TYPE "public"."enum_programs_blocks_b61_pillars_tab_align" AS ENUM('left', 'center', 'full');
  CREATE TYPE "public"."enum_programs_blocks_b61_pillars_heading_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_programs_blocks_b61_pillars_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_programs_blocks_b61_pillars_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_programs_blocks_b61_pillars_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_programs_blocks_b61_pillars_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum_programs_blocks_b61_pillars_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum_programs_blocks_b61_carousel_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum_programs_blocks_b61_carousel_per_view" AS ENUM('1', '2', '3', '4');
  CREATE TYPE "public"."enum_programs_blocks_b61_carousel_heading_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_programs_blocks_b61_carousel_advance" AS ENUM('one', 'view');
  CREATE TYPE "public"."enum_programs_blocks_b61_carousel_controls_position" AS ENUM('top-right', 'bottom-left', 'bottom-center', 'bottom-right', 'sides', 'hidden');
  CREATE TYPE "public"."enum_programs_blocks_b61_carousel_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_programs_blocks_b61_carousel_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_programs_blocks_b61_carousel_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_programs_blocks_b61_carousel_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum_programs_blocks_b61_carousel_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum_programs_blocks_b61_framed_image_image_shape" AS ENUM('fixed', 'portrait', 'square', 'landscape', 'wide', 'custom');
  CREATE TYPE "public"."enum_programs_blocks_b61_framed_image_image_height" AS ENUM('360px', '460px', '560px', '680px');
  CREATE TYPE "public"."enum_programs_blocks_b61_framed_image_frame_color" AS ENUM('primary', 'secondary', 'accent');
  CREATE TYPE "public"."enum_programs_blocks_b61_framed_image_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum_programs_blocks_b61_cta_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum_programs_blocks_b61_cta_buttons_action" AS ENUM('link', 'video');
  CREATE TYPE "public"."enum_programs_blocks_b61_cta_buttons_link_type" AS ENUM('page', 'document', 'url');
  CREATE TYPE "public"."enum_programs_blocks_b61_cta_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum_programs_blocks_b61_cta_text_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_programs_blocks_b61_cta_position" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_programs_blocks_b61_cta_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_programs_blocks_b61_cta_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_programs_blocks_b61_cta_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_programs_blocks_b61_cta_text_panel" AS ENUM('none', 'plain', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_programs_blocks_b61_cta_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum_programs_blocks_b61_cta_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum_programs_blocks_b61_form_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum_programs_blocks_b61_form_text_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_programs_blocks_b61_form_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_programs_blocks_b61_form_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_programs_blocks_b61_form_card" AS ENUM('none', 'card');
  CREATE TYPE "public"."enum_programs_blocks_b61_form_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_programs_blocks_b61_form_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum_programs_blocks_b61_form_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum_programs_blocks_b61_button_bar_first_link_type" AS ENUM('page', 'document', 'url');
  CREATE TYPE "public"."enum_programs_blocks_b61_button_bar_second_link_type" AS ENUM('page', 'document', 'url');
  CREATE TYPE "public"."enum_programs_blocks_b61_button_bar_size" AS ENUM('standard', 'large');
  CREATE TYPE "public"."enum_programs_blocks_b61_button_bar_first_color" AS ENUM('plain', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_programs_blocks_b61_button_bar_second_color" AS ENUM('plain', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_programs_blocks_b61_button_bar_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum_programs_blocks_b61_divider_line_style" AS ENUM('rule', 'ornament');
  CREATE TYPE "public"."enum_programs_blocks_b61_divider_alignment" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum_programs_blocks_b61_divider_weight" AS ENUM('hairline', 'regular', 'heavy');
  CREATE TYPE "public"."enum_programs_blocks_b61_divider_line_color" AS ENUM('accent', 'ink', 'muted');
  CREATE TYPE "public"."enum_programs_blocks_b61_divider_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum_programs_blocks_b61_logos_logos_link_type" AS ENUM('page', 'document', 'url');
  CREATE TYPE "public"."enum_programs_blocks_b61_logos_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum_programs_blocks_b61_logos_motion" AS ENUM('still', 'scroll');
  CREATE TYPE "public"."enum_programs_blocks_b61_logos_heading_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_programs_blocks_b61_logos_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_programs_blocks_b61_logos_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_programs_blocks_b61_logos_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_programs_blocks_b61_logos_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum_programs_blocks_b61_logos_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum_programs_blocks_b61_rail_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum_programs_blocks_b61_rail_buttons_action" AS ENUM('link', 'video');
  CREATE TYPE "public"."enum_programs_blocks_b61_rail_buttons_link_type" AS ENUM('page', 'document', 'url');
  CREATE TYPE "public"."enum_programs_blocks_b61_rail_links_icon" AS ENUM('arrow', 'check', 'question', 'email', 'phone', 'location', 'calendar', 'clock', 'link', 'star', 'heart', 'book', 'people', 'cross', 'school', 'custom');
  CREATE TYPE "public"."enum_programs_blocks_b61_rail_links_link_type" AS ENUM('page', 'document', 'url');
  CREATE TYPE "public"."enum_programs_blocks_b61_rail_actions_position" AS ENUM('top', 'bottom');
  CREATE TYPE "public"."enum_programs_blocks_b61_rail_surface" AS ENUM('none', 'plain', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_programs_blocks_b61_section_columns" AS ENUM('full', 'rail-right', 'rail-left');
  CREATE TYPE "public"."enum_programs_blocks_b61_section_rail_align" AS ENUM('start', 'center');
  CREATE TYPE "public"."enum_programs_blocks_b61_section_rail_stack" AS ENUM('source', 'rail-first', 'rail-last');
  CREATE TYPE "public"."enum_programs_blocks_b61_section_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_programs_blocks_b61_section_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum_programs_blocks_b61_section_surface" AS ENUM('none', 'plain', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum_programs_blocks_b61_section_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_hero_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_hero_buttons_action" AS ENUM('link', 'video');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_hero_buttons_link_type" AS ENUM('page', 'document', 'url');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_hero_layout_mode" AS ENUM('cover', 'band', 'split', 'type');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_hero_heading_level" AS ENUM('auto', 'h1', 'h2', 'h3');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_hero_background_type" AS ENUM('image', 'slideshow', 'video');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_hero_height" AS ENUM('short', 'medium', 'tall', 'full');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_hero_band_size" AS ENUM('compact', 'standard');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_hero_split_side" AS ENUM('right', 'left');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_hero_vertical_position" AS ENUM('top', 'center', 'bottom');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_hero_text_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_hero_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_hero_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_hero_overlay" AS ENUM('gradient', 'wash');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_hero_surface" AS ENUM('light', 'primary', 'secondary');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_hero_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_hero_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_split_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_split_buttons_action" AS ENUM('link', 'video');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_split_buttons_link_type" AS ENUM('page', 'document', 'url');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_split_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_split_media" AS ENUM('photo', 'gallery', 'video');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_split_gallery_layout" AS ENUM('grid', 'masonry', 'strip');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_split_image_shape" AS ENUM('fixed', 'portrait', 'square', 'landscape', 'wide');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_split_image_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_split_vertical_position" AS ENUM('top', 'center');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_split_stack_order" AS ENUM('text', 'media');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_split_column_height" AS ENUM('fit', 'fill');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_split_heading_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_split_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_split_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_split_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_split_text_panel" AS ENUM('none', 'plain', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_split_frame_color" AS ENUM('primary', 'secondary', 'accent');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_split_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_split_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_prose_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_prose_buttons_action" AS ENUM('link', 'video');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_prose_buttons_link_type" AS ENUM('page', 'document', 'url');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_prose_heading_level" AS ENUM('auto', 'h1', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_prose_head_position" AS ENUM('above', 'beside');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_prose_text_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_prose_position" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_prose_heading_width" AS ENUM('text', 'full');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_prose_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_prose_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_prose_iconlist_style" AS ENUM('standard', 'links');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_prose_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_prose_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_prose_heading_rule" AS ENUM('site', 'none', 'trailing');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_prose_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_card_grid_cards_icon" AS ENUM('check', 'question', 'email', 'phone', 'location', 'calendar', 'clock', 'link', 'star', 'heart', 'book', 'people', 'cross', 'school', 'custom');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_card_grid_cards_link_type" AS ENUM('page', 'document', 'url');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_card_grid_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_card_grid_buttons_action" AS ENUM('link', 'video');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_card_grid_buttons_link_type" AS ENUM('page', 'document', 'url');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_card_grid_card_text" AS ENUM('below', 'on');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_card_grid_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_card_grid_source" AS ENUM('manual', 'programs', 'upcoming-events', 'latest-news', 'staff', 'school-facts');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_card_grid_media_type" AS ENUM('image', 'icon', 'none');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_card_grid_arrangement" AS ENUM('grid', 'carousel');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_card_grid_columns" AS ENUM('1', '2', '3', '4');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_card_grid_text_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_card_grid_advance" AS ENUM('one', 'view');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_card_grid_controls_position" AS ENUM('top-right', 'bottom-left', 'bottom-center', 'bottom-right', 'sides', 'hidden');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_card_grid_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_card_grid_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_card_grid_card_style" AS ENUM('plain', 'flat', 'bordered');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_card_grid_card_shape" AS ENUM('portrait', 'square', 'landscape', 'custom');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_card_grid_image_shape" AS ENUM('fixed', 'custom');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_card_grid_card_text_position" AS ENUM('top', 'center', 'bottom');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_card_grid_icon_size" AS ENUM('sm', 'md', 'lg');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_card_grid_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_card_grid_card_surface" AS ENUM('light', 'soft', 'primary');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_card_grid_card_overlay" AS ENUM('none', 'gradient', 'wash');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_card_grid_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_card_grid_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_stats_band_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_stats_band_buttons_action" AS ENUM('link', 'video');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_stats_band_buttons_link_type" AS ENUM('page', 'document', 'url');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_stats_band_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_stats_band_columns" AS ENUM('1', '2', '3', '4');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_stats_band_label_position" AS ENUM('below', 'above');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_stats_band_text_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_stats_band_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_stats_band_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_stats_band_item_style" AS ENUM('plain', 'divided', 'boxed', 'inline');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_stats_band_figure_scale" AS ENUM('large', 'medium', 'small');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_stats_band_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_stats_band_item_surface" AS ENUM('outline', 'light', 'card', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_stats_band_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_stats_band_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_stats_band_band_width" AS ENUM('full', 'right', 'left');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_gallery_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_gallery_buttons_action" AS ENUM('link', 'video');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_gallery_buttons_link_type" AS ENUM('page', 'document', 'url');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_gallery_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_gallery_media" AS ENUM('photo', 'gallery', 'video');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_gallery_gallery_layout" AS ENUM('strip', 'grid', 'masonry');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_gallery_text_position" AS ENUM('above', 'beside');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_gallery_heading_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_gallery_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_gallery_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_gallery_item_size" AS ENUM('small', 'medium', 'large');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_gallery_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_gallery_image_shape" AS ENUM('fixed', 'portrait', 'square', 'landscape', 'wide');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_gallery_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_gallery_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_gallery_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_testimonial_text_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_testimonial_text_style" AS ENUM('italic', 'normal');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_testimonial_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_testimonial_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_testimonial_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_testimonial_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_testimonial_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_accordion_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_accordion_buttons_action" AS ENUM('link', 'video');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_accordion_buttons_link_type" AS ENUM('page', 'document', 'url');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_accordion_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_accordion_heading_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_accordion_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_accordion_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_accordion_item_style" AS ENUM('divided', 'boxed', 'separated');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_accordion_icon_style" AS ENUM('chevron', 'plusminus');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_accordion_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_accordion_item_surface" AS ENUM('outline', 'light', 'card', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_accordion_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_accordion_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_tabs_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_tabs_tab_position" AS ENUM('top', 'left', 'right');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_tabs_tab_align" AS ENUM('left', 'center', 'full');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_tabs_heading_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_tabs_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_tabs_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_tabs_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_tabs_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_tabs_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_pillars_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_pillars_tab_position" AS ENUM('left', 'right', 'top');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_pillars_tab_align" AS ENUM('left', 'center', 'full');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_pillars_heading_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_pillars_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_pillars_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_pillars_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_pillars_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_pillars_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_carousel_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_carousel_per_view" AS ENUM('1', '2', '3', '4');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_carousel_heading_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_carousel_advance" AS ENUM('one', 'view');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_carousel_controls_position" AS ENUM('top-right', 'bottom-left', 'bottom-center', 'bottom-right', 'sides', 'hidden');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_carousel_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_carousel_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_carousel_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_carousel_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_carousel_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_framed_image_image_shape" AS ENUM('fixed', 'portrait', 'square', 'landscape', 'wide', 'custom');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_framed_image_image_height" AS ENUM('360px', '460px', '560px', '680px');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_framed_image_frame_color" AS ENUM('primary', 'secondary', 'accent');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_framed_image_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_cta_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_cta_buttons_action" AS ENUM('link', 'video');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_cta_buttons_link_type" AS ENUM('page', 'document', 'url');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_cta_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_cta_text_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_cta_position" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_cta_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_cta_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_cta_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_cta_text_panel" AS ENUM('none', 'plain', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_cta_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_cta_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_form_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_form_text_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_form_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_form_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_form_card" AS ENUM('none', 'card');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_form_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_form_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_form_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_button_bar_first_link_type" AS ENUM('page', 'document', 'url');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_button_bar_second_link_type" AS ENUM('page', 'document', 'url');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_button_bar_size" AS ENUM('standard', 'large');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_button_bar_first_color" AS ENUM('plain', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_button_bar_second_color" AS ENUM('plain', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_button_bar_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_divider_line_style" AS ENUM('rule', 'ornament');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_divider_alignment" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_divider_weight" AS ENUM('hairline', 'regular', 'heavy');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_divider_line_color" AS ENUM('accent', 'ink', 'muted');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_divider_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_logos_logos_link_type" AS ENUM('page', 'document', 'url');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_logos_heading_level" AS ENUM('auto', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_logos_motion" AS ENUM('still', 'scroll');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_logos_heading_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_logos_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_logos_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_logos_surface" AS ENUM('none', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_logos_eyebrow_rule" AS ENUM('site', 'none', 'leading', 'trailing', 'both');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_logos_entrance" AS ENUM('on', 'off');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_rail_buttons_variant" AS ENUM('primary', 'secondary', 'light', 'link');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_rail_buttons_action" AS ENUM('link', 'video');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_rail_buttons_link_type" AS ENUM('page', 'document', 'url');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_rail_links_icon" AS ENUM('arrow', 'check', 'question', 'email', 'phone', 'location', 'calendar', 'clock', 'link', 'star', 'heart', 'book', 'people', 'cross', 'school', 'custom');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_rail_links_link_type" AS ENUM('page', 'document', 'url');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_rail_actions_position" AS ENUM('top', 'bottom');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_rail_surface" AS ENUM('none', 'plain', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_section_columns" AS ENUM('full', 'rail-right', 'rail-left');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_section_rail_align" AS ENUM('start', 'center');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_section_rail_stack" AS ENUM('source', 'rail-first', 'rail-last');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_section_pad_top" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_section_pad_bottom" AS ENUM('normal', 'tight', 'none');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_section_surface" AS ENUM('none', 'plain', 'soft', 'dark', 'accent');
  CREATE TYPE "public"."enum__programs_v_blocks_b61_section_entrance" AS ENUM('on', 'off');
  CREATE TABLE "programs_blocks_b61_hero_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum_programs_blocks_b61_hero_buttons_variant" DEFAULT 'primary',
  	"action" "enum_programs_blocks_b61_hero_buttons_action" DEFAULT 'link',
  	"link_type" "enum_programs_blocks_b61_hero_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_document_id" integer,
  	"link_url" varchar,
  	"video" varchar,
  	"full_width" boolean
  );
  
  CREATE TABLE "programs_blocks_b61_hero_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "programs_blocks_b61_hero_collage" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "programs_blocks_b61_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"layout_mode" "enum_programs_blocks_b61_hero_layout_mode" DEFAULT 'cover',
  	"eyebrow" varchar,
  	"heading" jsonb,
  	"changing_words" varchar,
  	"subheadline" varchar,
  	"heading_level" "enum_programs_blocks_b61_hero_heading_level" DEFAULT 'auto',
  	"background_type" "enum_programs_blocks_b61_hero_background_type" DEFAULT 'image',
  	"image_id" integer,
  	"video_id" integer,
  	"video_webm_id" integer,
  	"bunny_video" varchar,
  	"poster_id" integer,
  	"overlay_strength" numeric,
  	"height" "enum_programs_blocks_b61_hero_height" DEFAULT 'tall',
  	"band_size" "enum_programs_blocks_b61_hero_band_size" DEFAULT 'standard',
  	"split_side" "enum_programs_blocks_b61_hero_split_side" DEFAULT 'right',
  	"vertical_position" "enum_programs_blocks_b61_hero_vertical_position" DEFAULT 'bottom',
  	"text_align" "enum_programs_blocks_b61_hero_text_align" DEFAULT 'left',
  	"column_balance" numeric,
  	"subheadline_width" numeric,
  	"pad_top" "enum_programs_blocks_b61_hero_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum_programs_blocks_b61_hero_pad_bottom" DEFAULT 'normal',
  	"overlay" "enum_programs_blocks_b61_hero_overlay" DEFAULT 'gradient',
  	"surface" "enum_programs_blocks_b61_hero_surface" DEFAULT 'primary',
  	"eyebrow_rule" "enum_programs_blocks_b61_hero_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum_programs_blocks_b61_hero_entrance" DEFAULT 'on',
  	"css_class" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "programs_blocks_b61_split_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "programs_blocks_b61_split_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum_programs_blocks_b61_split_buttons_variant" DEFAULT 'primary',
  	"action" "enum_programs_blocks_b61_split_buttons_action" DEFAULT 'link',
  	"link_type" "enum_programs_blocks_b61_split_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_document_id" integer,
  	"link_url" varchar,
  	"video" varchar,
  	"full_width" boolean
  );
  
  CREATE TABLE "programs_blocks_b61_split_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "programs_blocks_b61_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" jsonb,
  	"heading_level" "enum_programs_blocks_b61_split_heading_level" DEFAULT 'auto',
  	"body" jsonb,
  	"media" "enum_programs_blocks_b61_split_media" DEFAULT 'photo',
  	"image_id" integer,
  	"caption" varchar,
  	"gallery_layout" "enum_programs_blocks_b61_split_gallery_layout" DEFAULT 'grid',
  	"video" varchar,
  	"image_shape" "enum_programs_blocks_b61_split_image_shape" DEFAULT 'fixed',
  	"badge_id" integer,
  	"image_side" "enum_programs_blocks_b61_split_image_side" DEFAULT 'right',
  	"vertical_position" "enum_programs_blocks_b61_split_vertical_position" DEFAULT 'center',
  	"stack_order" "enum_programs_blocks_b61_split_stack_order" DEFAULT 'text',
  	"column_height" "enum_programs_blocks_b61_split_column_height" DEFAULT 'fit',
  	"overlap" boolean,
  	"heading_align" "enum_programs_blocks_b61_split_heading_align" DEFAULT 'left',
  	"column_balance" numeric,
  	"pad_top" "enum_programs_blocks_b61_split_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum_programs_blocks_b61_split_pad_bottom" DEFAULT 'normal',
  	"surface" "enum_programs_blocks_b61_split_surface" DEFAULT 'none',
  	"text_panel" "enum_programs_blocks_b61_split_text_panel" DEFAULT 'none',
  	"frame_color" "enum_programs_blocks_b61_split_frame_color" DEFAULT 'primary',
  	"eyebrow_rule" "enum_programs_blocks_b61_split_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum_programs_blocks_b61_split_entrance" DEFAULT 'on',
  	"css_class" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "programs_blocks_b61_prose_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "programs_blocks_b61_prose_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum_programs_blocks_b61_prose_buttons_variant" DEFAULT 'primary',
  	"action" "enum_programs_blocks_b61_prose_buttons_action" DEFAULT 'link',
  	"link_type" "enum_programs_blocks_b61_prose_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_document_id" integer,
  	"link_url" varchar,
  	"video" varchar,
  	"full_width" boolean
  );
  
  CREATE TABLE "programs_blocks_b61_prose" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" jsonb,
  	"heading_level" "enum_programs_blocks_b61_prose_heading_level" DEFAULT 'auto',
  	"body" jsonb,
  	"head_position" "enum_programs_blocks_b61_prose_head_position" DEFAULT 'above',
  	"column_balance" numeric,
  	"text_align" "enum_programs_blocks_b61_prose_text_align" DEFAULT 'left',
  	"measure_step" numeric,
  	"position" "enum_programs_blocks_b61_prose_position" DEFAULT 'center',
  	"heading_width" "enum_programs_blocks_b61_prose_heading_width" DEFAULT 'text',
  	"pad_top" "enum_programs_blocks_b61_prose_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum_programs_blocks_b61_prose_pad_bottom" DEFAULT 'normal',
  	"iconlist_style" "enum_programs_blocks_b61_prose_iconlist_style" DEFAULT 'standard',
  	"iconlist_edges" boolean,
  	"surface" "enum_programs_blocks_b61_prose_surface" DEFAULT 'none',
  	"eyebrow_rule" "enum_programs_blocks_b61_prose_eyebrow_rule" DEFAULT 'site',
  	"heading_rule" "enum_programs_blocks_b61_prose_heading_rule" DEFAULT 'site',
  	"entrance" "enum_programs_blocks_b61_prose_entrance" DEFAULT 'on',
  	"css_class" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "programs_blocks_b61_card_grid_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"icon" "enum_programs_blocks_b61_card_grid_cards_icon" DEFAULT 'star',
  	"icon_image_id" integer,
  	"icon_colours" boolean,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" jsonb,
  	"link_type" "enum_programs_blocks_b61_card_grid_cards_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_document_id" integer,
  	"link_url" varchar,
  	"link_text" varchar
  );
  
  CREATE TABLE "programs_blocks_b61_card_grid_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum_programs_blocks_b61_card_grid_buttons_variant" DEFAULT 'primary',
  	"action" "enum_programs_blocks_b61_card_grid_buttons_action" DEFAULT 'link',
  	"link_type" "enum_programs_blocks_b61_card_grid_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_document_id" integer,
  	"link_url" varchar,
  	"video" varchar,
  	"full_width" boolean
  );
  
  CREATE TABLE "programs_blocks_b61_card_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"card_text" "enum_programs_blocks_b61_card_grid_card_text" DEFAULT 'below',
  	"eyebrow" varchar,
  	"heading" jsonb,
  	"intro" jsonb,
  	"heading_level" "enum_programs_blocks_b61_card_grid_heading_level" DEFAULT 'auto',
  	"source" "enum_programs_blocks_b61_card_grid_source" DEFAULT 'manual',
  	"limit" numeric DEFAULT 3,
  	"media_type" "enum_programs_blocks_b61_card_grid_media_type" DEFAULT 'image',
  	"arrangement" "enum_programs_blocks_b61_card_grid_arrangement" DEFAULT 'grid',
  	"columns" "enum_programs_blocks_b61_card_grid_columns" DEFAULT '3',
  	"text_align" "enum_programs_blocks_b61_card_grid_text_align" DEFAULT 'left',
  	"advance" "enum_programs_blocks_b61_card_grid_advance" DEFAULT 'one',
  	"controls_position" "enum_programs_blocks_b61_card_grid_controls_position" DEFAULT 'top-right',
  	"show_counter" boolean,
  	"show_progress" boolean,
  	"pad_top" "enum_programs_blocks_b61_card_grid_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum_programs_blocks_b61_card_grid_pad_bottom" DEFAULT 'normal',
  	"card_style" "enum_programs_blocks_b61_card_grid_card_style" DEFAULT 'bordered',
  	"card_shape" "enum_programs_blocks_b61_card_grid_card_shape" DEFAULT 'portrait',
  	"image_shape" "enum_programs_blocks_b61_card_grid_image_shape" DEFAULT 'fixed',
  	"ratio_w" numeric,
  	"ratio_h" numeric,
  	"card_text_position" "enum_programs_blocks_b61_card_grid_card_text_position" DEFAULT 'bottom',
  	"media_round" boolean,
  	"icon_size" "enum_programs_blocks_b61_card_grid_icon_size" DEFAULT 'sm',
  	"show_numbers" boolean,
  	"surface" "enum_programs_blocks_b61_card_grid_surface" DEFAULT 'none',
  	"card_surface" "enum_programs_blocks_b61_card_grid_card_surface" DEFAULT 'light',
  	"card_overlay" "enum_programs_blocks_b61_card_grid_card_overlay" DEFAULT 'gradient',
  	"eyebrow_rule" "enum_programs_blocks_b61_card_grid_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum_programs_blocks_b61_card_grid_entrance" DEFAULT 'on',
  	"head_beside" boolean,
  	"stagger" boolean,
  	"bleed" boolean,
  	"hover_reveal" boolean,
  	"alt_tint" boolean,
  	"feature_middle" boolean,
  	"duotone" boolean,
  	"css_class" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "programs_blocks_b61_stats_band_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"figure" varchar,
  	"label" varchar,
  	"note" varchar
  );
  
  CREATE TABLE "programs_blocks_b61_stats_band_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum_programs_blocks_b61_stats_band_buttons_variant" DEFAULT 'primary',
  	"action" "enum_programs_blocks_b61_stats_band_buttons_action" DEFAULT 'link',
  	"link_type" "enum_programs_blocks_b61_stats_band_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_document_id" integer,
  	"link_url" varchar,
  	"video" varchar,
  	"full_width" boolean
  );
  
  CREATE TABLE "programs_blocks_b61_stats_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" jsonb,
  	"intro" jsonb,
  	"heading_level" "enum_programs_blocks_b61_stats_band_heading_level" DEFAULT 'auto',
  	"columns" "enum_programs_blocks_b61_stats_band_columns" DEFAULT '3',
  	"label_position" "enum_programs_blocks_b61_stats_band_label_position" DEFAULT 'below',
  	"text_align" "enum_programs_blocks_b61_stats_band_text_align" DEFAULT 'center',
  	"pad_top" "enum_programs_blocks_b61_stats_band_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum_programs_blocks_b61_stats_band_pad_bottom" DEFAULT 'normal',
  	"item_style" "enum_programs_blocks_b61_stats_band_item_style" DEFAULT 'plain',
  	"flush_edges" boolean,
  	"figure_scale" "enum_programs_blocks_b61_stats_band_figure_scale" DEFAULT 'large',
  	"surface" "enum_programs_blocks_b61_stats_band_surface",
  	"item_surface" "enum_programs_blocks_b61_stats_band_item_surface" DEFAULT 'card',
  	"eyebrow_rule" "enum_programs_blocks_b61_stats_band_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum_programs_blocks_b61_stats_band_entrance" DEFAULT 'on',
  	"band_width" "enum_programs_blocks_b61_stats_band_band_width" DEFAULT 'full',
  	"pull_up" boolean,
  	"css_class" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "programs_blocks_b61_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "programs_blocks_b61_gallery_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum_programs_blocks_b61_gallery_buttons_variant" DEFAULT 'primary',
  	"action" "enum_programs_blocks_b61_gallery_buttons_action" DEFAULT 'link',
  	"link_type" "enum_programs_blocks_b61_gallery_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_document_id" integer,
  	"link_url" varchar,
  	"video" varchar,
  	"full_width" boolean
  );
  
  CREATE TABLE "programs_blocks_b61_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" jsonb,
  	"intro" jsonb,
  	"heading_level" "enum_programs_blocks_b61_gallery_heading_level" DEFAULT 'auto',
  	"media" "enum_programs_blocks_b61_gallery_media" DEFAULT 'gallery',
  	"image_id" integer,
  	"caption" varchar,
  	"scroll_hint" varchar DEFAULT 'Scroll',
  	"video" varchar,
  	"gallery_layout" "enum_programs_blocks_b61_gallery_gallery_layout" DEFAULT 'strip',
  	"text_position" "enum_programs_blocks_b61_gallery_text_position" DEFAULT 'above',
  	"heading_align" "enum_programs_blocks_b61_gallery_heading_align" DEFAULT 'left',
  	"balance_step" numeric,
  	"pad_top" "enum_programs_blocks_b61_gallery_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum_programs_blocks_b61_gallery_pad_bottom" DEFAULT 'normal',
  	"item_size" "enum_programs_blocks_b61_gallery_item_size" DEFAULT 'medium',
  	"columns" "enum_programs_blocks_b61_gallery_columns" DEFAULT '3',
  	"image_shape" "enum_programs_blocks_b61_gallery_image_shape" DEFAULT 'fixed',
  	"surface" "enum_programs_blocks_b61_gallery_surface" DEFAULT 'none',
  	"eyebrow_rule" "enum_programs_blocks_b61_gallery_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum_programs_blocks_b61_gallery_entrance" DEFAULT 'on',
  	"duotone" boolean,
  	"css_class" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "programs_blocks_b61_testimonial" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"quote" varchar,
  	"attribution" varchar,
  	"watermark_id" integer,
  	"text_align" "enum_programs_blocks_b61_testimonial_text_align" DEFAULT 'center',
  	"text_style" "enum_programs_blocks_b61_testimonial_text_style" DEFAULT 'italic',
  	"width_step" numeric,
  	"pad_top" "enum_programs_blocks_b61_testimonial_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum_programs_blocks_b61_testimonial_pad_bottom" DEFAULT 'normal',
  	"surface" "enum_programs_blocks_b61_testimonial_surface" DEFAULT 'none',
  	"eyebrow_rule" "enum_programs_blocks_b61_testimonial_eyebrow_rule" DEFAULT 'site',
  	"show_mark" boolean DEFAULT true,
  	"mark_room" boolean,
  	"entrance" "enum_programs_blocks_b61_testimonial_entrance" DEFAULT 'on',
  	"css_class" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "programs_blocks_b61_accordion_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"body" jsonb
  );
  
  CREATE TABLE "programs_blocks_b61_accordion_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum_programs_blocks_b61_accordion_buttons_variant" DEFAULT 'primary',
  	"action" "enum_programs_blocks_b61_accordion_buttons_action" DEFAULT 'link',
  	"link_type" "enum_programs_blocks_b61_accordion_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_document_id" integer,
  	"link_url" varchar,
  	"video" varchar,
  	"full_width" boolean
  );
  
  CREATE TABLE "programs_blocks_b61_accordion" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" jsonb,
  	"intro" jsonb,
  	"heading_level" "enum_programs_blocks_b61_accordion_heading_level" DEFAULT 'auto',
  	"faq" boolean,
  	"first_item_open" boolean DEFAULT true,
  	"single_open" boolean DEFAULT true,
  	"heading_align" "enum_programs_blocks_b61_accordion_heading_align" DEFAULT 'left',
  	"width_step" numeric,
  	"pad_top" "enum_programs_blocks_b61_accordion_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum_programs_blocks_b61_accordion_pad_bottom" DEFAULT 'normal',
  	"item_style" "enum_programs_blocks_b61_accordion_item_style" DEFAULT 'divided',
  	"icon_style" "enum_programs_blocks_b61_accordion_icon_style" DEFAULT 'chevron',
  	"show_numbers" boolean DEFAULT true,
  	"surface" "enum_programs_blocks_b61_accordion_surface" DEFAULT 'none',
  	"item_surface" "enum_programs_blocks_b61_accordion_item_surface" DEFAULT 'card',
  	"eyebrow_rule" "enum_programs_blocks_b61_accordion_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum_programs_blocks_b61_accordion_entrance" DEFAULT 'on',
  	"css_class" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "programs_blocks_b61_tabs_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "programs_blocks_b61_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" jsonb,
  	"intro" jsonb,
  	"heading_level" "enum_programs_blocks_b61_tabs_heading_level" DEFAULT 'auto',
  	"first_item_open" boolean DEFAULT true,
  	"tab_position" "enum_programs_blocks_b61_tabs_tab_position" DEFAULT 'top',
  	"tab_align" "enum_programs_blocks_b61_tabs_tab_align" DEFAULT 'left',
  	"heading_align" "enum_programs_blocks_b61_tabs_heading_align" DEFAULT 'left',
  	"pad_top" "enum_programs_blocks_b61_tabs_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum_programs_blocks_b61_tabs_pad_bottom" DEFAULT 'normal',
  	"surface" "enum_programs_blocks_b61_tabs_surface" DEFAULT 'none',
  	"eyebrow_rule" "enum_programs_blocks_b61_tabs_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum_programs_blocks_b61_tabs_entrance" DEFAULT 'on',
  	"css_class" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "programs_blocks_b61_pillars_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" jsonb,
  	"image_id" integer
  );
  
  CREATE TABLE "programs_blocks_b61_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" jsonb,
  	"intro" jsonb,
  	"heading_level" "enum_programs_blocks_b61_pillars_heading_level" DEFAULT 'auto',
  	"first_item_open" boolean DEFAULT true,
  	"tab_position" "enum_programs_blocks_b61_pillars_tab_position" DEFAULT 'left',
  	"tab_align" "enum_programs_blocks_b61_pillars_tab_align" DEFAULT 'left',
  	"heading_align" "enum_programs_blocks_b61_pillars_heading_align" DEFAULT 'left',
  	"pad_top" "enum_programs_blocks_b61_pillars_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum_programs_blocks_b61_pillars_pad_bottom" DEFAULT 'normal',
  	"surface" "enum_programs_blocks_b61_pillars_surface" DEFAULT 'none',
  	"eyebrow_rule" "enum_programs_blocks_b61_pillars_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum_programs_blocks_b61_pillars_entrance" DEFAULT 'on',
  	"scroll_story" boolean,
  	"css_class" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "programs_blocks_b61_carousel_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "programs_blocks_b61_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" jsonb,
  	"intro" jsonb,
  	"heading_level" "enum_programs_blocks_b61_carousel_heading_level" DEFAULT 'auto',
  	"label" varchar,
  	"per_view" "enum_programs_blocks_b61_carousel_per_view" DEFAULT '1',
  	"heading_align" "enum_programs_blocks_b61_carousel_heading_align" DEFAULT 'left',
  	"advance" "enum_programs_blocks_b61_carousel_advance" DEFAULT 'one',
  	"controls_position" "enum_programs_blocks_b61_carousel_controls_position" DEFAULT 'top-right',
  	"show_counter" boolean DEFAULT true,
  	"show_progress" boolean DEFAULT true,
  	"pad_top" "enum_programs_blocks_b61_carousel_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum_programs_blocks_b61_carousel_pad_bottom" DEFAULT 'normal',
  	"surface" "enum_programs_blocks_b61_carousel_surface" DEFAULT 'none',
  	"eyebrow_rule" "enum_programs_blocks_b61_carousel_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum_programs_blocks_b61_carousel_entrance" DEFAULT 'on',
  	"css_class" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "programs_blocks_b61_framed_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_shape" "enum_programs_blocks_b61_framed_image_image_shape" DEFAULT 'fixed',
  	"image_height" "enum_programs_blocks_b61_framed_image_image_height" DEFAULT '460px',
  	"ratio_w" numeric DEFAULT 3,
  	"ratio_h" numeric DEFAULT 2,
  	"flip_frame" boolean,
  	"width_step" numeric DEFAULT 4,
  	"frame_color" "enum_programs_blocks_b61_framed_image_frame_color" DEFAULT 'primary',
  	"entrance" "enum_programs_blocks_b61_framed_image_entrance" DEFAULT 'on',
  	"css_class" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "programs_blocks_b61_cta_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "programs_blocks_b61_cta_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum_programs_blocks_b61_cta_buttons_variant" DEFAULT 'primary',
  	"action" "enum_programs_blocks_b61_cta_buttons_action" DEFAULT 'link',
  	"link_type" "enum_programs_blocks_b61_cta_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_document_id" integer,
  	"link_url" varchar,
  	"video" varchar,
  	"full_width" boolean
  );
  
  CREATE TABLE "programs_blocks_b61_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" jsonb,
  	"heading_level" "enum_programs_blocks_b61_cta_heading_level" DEFAULT 'auto',
  	"body" jsonb,
  	"image_id" integer,
  	"overlay_strength" numeric,
  	"text_align" "enum_programs_blocks_b61_cta_text_align" DEFAULT 'center',
  	"width_step" numeric,
  	"position" "enum_programs_blocks_b61_cta_position" DEFAULT 'center',
  	"pad_top" "enum_programs_blocks_b61_cta_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum_programs_blocks_b61_cta_pad_bottom" DEFAULT 'normal',
  	"surface" "enum_programs_blocks_b61_cta_surface",
  	"text_panel" "enum_programs_blocks_b61_cta_text_panel" DEFAULT 'none',
  	"eyebrow_rule" "enum_programs_blocks_b61_cta_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum_programs_blocks_b61_cta_entrance" DEFAULT 'on',
  	"css_class" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "programs_blocks_b61_form_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "programs_blocks_b61_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"eyebrow" varchar,
  	"heading" jsonb,
  	"heading_level" "enum_programs_blocks_b61_form_heading_level" DEFAULT 'auto',
  	"text_align" "enum_programs_blocks_b61_form_text_align" DEFAULT 'left',
  	"width_step" numeric,
  	"pad_top" "enum_programs_blocks_b61_form_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum_programs_blocks_b61_form_pad_bottom" DEFAULT 'normal',
  	"card" "enum_programs_blocks_b61_form_card" DEFAULT 'none',
  	"surface" "enum_programs_blocks_b61_form_surface" DEFAULT 'none',
  	"eyebrow_rule" "enum_programs_blocks_b61_form_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum_programs_blocks_b61_form_entrance" DEFAULT 'on',
  	"css_class" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "programs_blocks_b61_button_bar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"first_label" varchar,
  	"first_link_type" "enum_programs_blocks_b61_button_bar_first_link_type" DEFAULT 'page',
  	"first_link_page_id" integer,
  	"first_link_document_id" integer,
  	"first_link_url" varchar,
  	"second_label" varchar,
  	"second_link_type" "enum_programs_blocks_b61_button_bar_second_link_type" DEFAULT 'page',
  	"second_link_page_id" integer,
  	"second_link_document_id" integer,
  	"second_link_url" varchar,
  	"size" "enum_programs_blocks_b61_button_bar_size" DEFAULT 'standard',
  	"first_color" "enum_programs_blocks_b61_button_bar_first_color" DEFAULT 'dark',
  	"second_color" "enum_programs_blocks_b61_button_bar_second_color" DEFAULT 'accent',
  	"entrance" "enum_programs_blocks_b61_button_bar_entrance" DEFAULT 'on',
  	"css_class" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "programs_blocks_b61_divider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"line_style" "enum_programs_blocks_b61_divider_line_style" DEFAULT 'rule',
  	"ornament_id" integer,
  	"alignment" "enum_programs_blocks_b61_divider_alignment" DEFAULT 'center',
  	"width_step" numeric,
  	"weight" "enum_programs_blocks_b61_divider_weight" DEFAULT 'regular',
  	"line_color" "enum_programs_blocks_b61_divider_line_color" DEFAULT 'accent',
  	"entrance" "enum_programs_blocks_b61_divider_entrance" DEFAULT 'on',
  	"css_class" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "programs_blocks_b61_logos_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "programs_blocks_b61_logos_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"link_type" "enum_programs_blocks_b61_logos_logos_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_document_id" integer,
  	"link_url" varchar
  );
  
  CREATE TABLE "programs_blocks_b61_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" jsonb,
  	"heading_level" "enum_programs_blocks_b61_logos_heading_level" DEFAULT 'auto',
  	"motion" "enum_programs_blocks_b61_logos_motion" DEFAULT 'still',
  	"heading_align" "enum_programs_blocks_b61_logos_heading_align" DEFAULT 'left',
  	"logo_step" numeric,
  	"pad_top" "enum_programs_blocks_b61_logos_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum_programs_blocks_b61_logos_pad_bottom" DEFAULT 'normal',
  	"surface" "enum_programs_blocks_b61_logos_surface" DEFAULT 'none',
  	"one_colour" boolean,
  	"eyebrow_rule" "enum_programs_blocks_b61_logos_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum_programs_blocks_b61_logos_entrance" DEFAULT 'on',
  	"css_class" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "programs_blocks_b61_rail_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum_programs_blocks_b61_rail_buttons_variant" DEFAULT 'primary',
  	"action" "enum_programs_blocks_b61_rail_buttons_action" DEFAULT 'link',
  	"link_type" "enum_programs_blocks_b61_rail_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_document_id" integer,
  	"link_url" varchar,
  	"video" varchar,
  	"full_width" boolean
  );
  
  CREATE TABLE "programs_blocks_b61_rail_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"icon" "enum_programs_blocks_b61_rail_links_icon" DEFAULT 'arrow',
  	"icon_image_id" integer,
  	"icon_colours" boolean,
  	"link_type" "enum_programs_blocks_b61_rail_links_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_document_id" integer,
  	"link_url" varchar
  );
  
  CREATE TABLE "programs_blocks_b61_rail" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"links_label" varchar DEFAULT 'Keep exploring',
  	"actions_position" "enum_programs_blocks_b61_rail_actions_position" DEFAULT 'top',
  	"sticky" boolean,
  	"surface" "enum_programs_blocks_b61_rail_surface" DEFAULT 'plain',
  	"css_class" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "programs_blocks_b61_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"overlay_strength" numeric,
  	"columns" "enum_programs_blocks_b61_section_columns" DEFAULT 'full',
  	"rail_sticky" boolean,
  	"rail_align" "enum_programs_blocks_b61_section_rail_align" DEFAULT 'start',
  	"rail_stack" "enum_programs_blocks_b61_section_rail_stack" DEFAULT 'source',
  	"pull_up" boolean,
  	"rail_width_step" numeric,
  	"pad_top" "enum_programs_blocks_b61_section_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum_programs_blocks_b61_section_pad_bottom" DEFAULT 'normal',
  	"pattern_on" boolean,
  	"pattern_image_id" integer,
  	"tile_size" numeric,
  	"pattern_strength" numeric,
  	"watermark_on" boolean,
  	"watermark_image_id" integer,
  	"watermark_size" numeric,
  	"watermark_strength" numeric,
  	"surface" "enum_programs_blocks_b61_section_surface" DEFAULT 'none',
  	"entrance" "enum_programs_blocks_b61_section_entrance" DEFAULT 'on',
  	"duotone" boolean,
  	"css_class" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_b61_hero_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum__programs_v_blocks_b61_hero_buttons_variant" DEFAULT 'primary',
  	"action" "enum__programs_v_blocks_b61_hero_buttons_action" DEFAULT 'link',
  	"link_type" "enum__programs_v_blocks_b61_hero_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_document_id" integer,
  	"link_url" varchar,
  	"video" varchar,
  	"full_width" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_b61_hero_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_b61_hero_collage" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_b61_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"layout_mode" "enum__programs_v_blocks_b61_hero_layout_mode" DEFAULT 'cover',
  	"eyebrow" varchar,
  	"heading" jsonb,
  	"changing_words" varchar,
  	"subheadline" varchar,
  	"heading_level" "enum__programs_v_blocks_b61_hero_heading_level" DEFAULT 'auto',
  	"background_type" "enum__programs_v_blocks_b61_hero_background_type" DEFAULT 'image',
  	"image_id" integer,
  	"video_id" integer,
  	"video_webm_id" integer,
  	"bunny_video" varchar,
  	"poster_id" integer,
  	"overlay_strength" numeric,
  	"height" "enum__programs_v_blocks_b61_hero_height" DEFAULT 'tall',
  	"band_size" "enum__programs_v_blocks_b61_hero_band_size" DEFAULT 'standard',
  	"split_side" "enum__programs_v_blocks_b61_hero_split_side" DEFAULT 'right',
  	"vertical_position" "enum__programs_v_blocks_b61_hero_vertical_position" DEFAULT 'bottom',
  	"text_align" "enum__programs_v_blocks_b61_hero_text_align" DEFAULT 'left',
  	"column_balance" numeric,
  	"subheadline_width" numeric,
  	"pad_top" "enum__programs_v_blocks_b61_hero_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum__programs_v_blocks_b61_hero_pad_bottom" DEFAULT 'normal',
  	"overlay" "enum__programs_v_blocks_b61_hero_overlay" DEFAULT 'gradient',
  	"surface" "enum__programs_v_blocks_b61_hero_surface" DEFAULT 'primary',
  	"eyebrow_rule" "enum__programs_v_blocks_b61_hero_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum__programs_v_blocks_b61_hero_entrance" DEFAULT 'on',
  	"css_class" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_b61_split_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_b61_split_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum__programs_v_blocks_b61_split_buttons_variant" DEFAULT 'primary',
  	"action" "enum__programs_v_blocks_b61_split_buttons_action" DEFAULT 'link',
  	"link_type" "enum__programs_v_blocks_b61_split_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_document_id" integer,
  	"link_url" varchar,
  	"video" varchar,
  	"full_width" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_b61_split_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_b61_split" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" jsonb,
  	"heading_level" "enum__programs_v_blocks_b61_split_heading_level" DEFAULT 'auto',
  	"body" jsonb,
  	"media" "enum__programs_v_blocks_b61_split_media" DEFAULT 'photo',
  	"image_id" integer,
  	"caption" varchar,
  	"gallery_layout" "enum__programs_v_blocks_b61_split_gallery_layout" DEFAULT 'grid',
  	"video" varchar,
  	"image_shape" "enum__programs_v_blocks_b61_split_image_shape" DEFAULT 'fixed',
  	"badge_id" integer,
  	"image_side" "enum__programs_v_blocks_b61_split_image_side" DEFAULT 'right',
  	"vertical_position" "enum__programs_v_blocks_b61_split_vertical_position" DEFAULT 'center',
  	"stack_order" "enum__programs_v_blocks_b61_split_stack_order" DEFAULT 'text',
  	"column_height" "enum__programs_v_blocks_b61_split_column_height" DEFAULT 'fit',
  	"overlap" boolean,
  	"heading_align" "enum__programs_v_blocks_b61_split_heading_align" DEFAULT 'left',
  	"column_balance" numeric,
  	"pad_top" "enum__programs_v_blocks_b61_split_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum__programs_v_blocks_b61_split_pad_bottom" DEFAULT 'normal',
  	"surface" "enum__programs_v_blocks_b61_split_surface" DEFAULT 'none',
  	"text_panel" "enum__programs_v_blocks_b61_split_text_panel" DEFAULT 'none',
  	"frame_color" "enum__programs_v_blocks_b61_split_frame_color" DEFAULT 'primary',
  	"eyebrow_rule" "enum__programs_v_blocks_b61_split_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum__programs_v_blocks_b61_split_entrance" DEFAULT 'on',
  	"css_class" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_b61_prose_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_b61_prose_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum__programs_v_blocks_b61_prose_buttons_variant" DEFAULT 'primary',
  	"action" "enum__programs_v_blocks_b61_prose_buttons_action" DEFAULT 'link',
  	"link_type" "enum__programs_v_blocks_b61_prose_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_document_id" integer,
  	"link_url" varchar,
  	"video" varchar,
  	"full_width" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_b61_prose" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" jsonb,
  	"heading_level" "enum__programs_v_blocks_b61_prose_heading_level" DEFAULT 'auto',
  	"body" jsonb,
  	"head_position" "enum__programs_v_blocks_b61_prose_head_position" DEFAULT 'above',
  	"column_balance" numeric,
  	"text_align" "enum__programs_v_blocks_b61_prose_text_align" DEFAULT 'left',
  	"measure_step" numeric,
  	"position" "enum__programs_v_blocks_b61_prose_position" DEFAULT 'center',
  	"heading_width" "enum__programs_v_blocks_b61_prose_heading_width" DEFAULT 'text',
  	"pad_top" "enum__programs_v_blocks_b61_prose_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum__programs_v_blocks_b61_prose_pad_bottom" DEFAULT 'normal',
  	"iconlist_style" "enum__programs_v_blocks_b61_prose_iconlist_style" DEFAULT 'standard',
  	"iconlist_edges" boolean,
  	"surface" "enum__programs_v_blocks_b61_prose_surface" DEFAULT 'none',
  	"eyebrow_rule" "enum__programs_v_blocks_b61_prose_eyebrow_rule" DEFAULT 'site',
  	"heading_rule" "enum__programs_v_blocks_b61_prose_heading_rule" DEFAULT 'site',
  	"entrance" "enum__programs_v_blocks_b61_prose_entrance" DEFAULT 'on',
  	"css_class" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_b61_card_grid_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"icon" "enum__programs_v_blocks_b61_card_grid_cards_icon" DEFAULT 'star',
  	"icon_image_id" integer,
  	"icon_colours" boolean,
  	"eyebrow" varchar,
  	"title" varchar,
  	"body" jsonb,
  	"link_type" "enum__programs_v_blocks_b61_card_grid_cards_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_document_id" integer,
  	"link_url" varchar,
  	"link_text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_b61_card_grid_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum__programs_v_blocks_b61_card_grid_buttons_variant" DEFAULT 'primary',
  	"action" "enum__programs_v_blocks_b61_card_grid_buttons_action" DEFAULT 'link',
  	"link_type" "enum__programs_v_blocks_b61_card_grid_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_document_id" integer,
  	"link_url" varchar,
  	"video" varchar,
  	"full_width" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_b61_card_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"card_text" "enum__programs_v_blocks_b61_card_grid_card_text" DEFAULT 'below',
  	"eyebrow" varchar,
  	"heading" jsonb,
  	"intro" jsonb,
  	"heading_level" "enum__programs_v_blocks_b61_card_grid_heading_level" DEFAULT 'auto',
  	"source" "enum__programs_v_blocks_b61_card_grid_source" DEFAULT 'manual',
  	"limit" numeric DEFAULT 3,
  	"media_type" "enum__programs_v_blocks_b61_card_grid_media_type" DEFAULT 'image',
  	"arrangement" "enum__programs_v_blocks_b61_card_grid_arrangement" DEFAULT 'grid',
  	"columns" "enum__programs_v_blocks_b61_card_grid_columns" DEFAULT '3',
  	"text_align" "enum__programs_v_blocks_b61_card_grid_text_align" DEFAULT 'left',
  	"advance" "enum__programs_v_blocks_b61_card_grid_advance" DEFAULT 'one',
  	"controls_position" "enum__programs_v_blocks_b61_card_grid_controls_position" DEFAULT 'top-right',
  	"show_counter" boolean,
  	"show_progress" boolean,
  	"pad_top" "enum__programs_v_blocks_b61_card_grid_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum__programs_v_blocks_b61_card_grid_pad_bottom" DEFAULT 'normal',
  	"card_style" "enum__programs_v_blocks_b61_card_grid_card_style" DEFAULT 'bordered',
  	"card_shape" "enum__programs_v_blocks_b61_card_grid_card_shape" DEFAULT 'portrait',
  	"image_shape" "enum__programs_v_blocks_b61_card_grid_image_shape" DEFAULT 'fixed',
  	"ratio_w" numeric,
  	"ratio_h" numeric,
  	"card_text_position" "enum__programs_v_blocks_b61_card_grid_card_text_position" DEFAULT 'bottom',
  	"media_round" boolean,
  	"icon_size" "enum__programs_v_blocks_b61_card_grid_icon_size" DEFAULT 'sm',
  	"show_numbers" boolean,
  	"surface" "enum__programs_v_blocks_b61_card_grid_surface" DEFAULT 'none',
  	"card_surface" "enum__programs_v_blocks_b61_card_grid_card_surface" DEFAULT 'light',
  	"card_overlay" "enum__programs_v_blocks_b61_card_grid_card_overlay" DEFAULT 'gradient',
  	"eyebrow_rule" "enum__programs_v_blocks_b61_card_grid_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum__programs_v_blocks_b61_card_grid_entrance" DEFAULT 'on',
  	"head_beside" boolean,
  	"stagger" boolean,
  	"bleed" boolean,
  	"hover_reveal" boolean,
  	"alt_tint" boolean,
  	"feature_middle" boolean,
  	"duotone" boolean,
  	"css_class" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_b61_stats_band_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"figure" varchar,
  	"label" varchar,
  	"note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_b61_stats_band_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum__programs_v_blocks_b61_stats_band_buttons_variant" DEFAULT 'primary',
  	"action" "enum__programs_v_blocks_b61_stats_band_buttons_action" DEFAULT 'link',
  	"link_type" "enum__programs_v_blocks_b61_stats_band_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_document_id" integer,
  	"link_url" varchar,
  	"video" varchar,
  	"full_width" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_b61_stats_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" jsonb,
  	"intro" jsonb,
  	"heading_level" "enum__programs_v_blocks_b61_stats_band_heading_level" DEFAULT 'auto',
  	"columns" "enum__programs_v_blocks_b61_stats_band_columns" DEFAULT '3',
  	"label_position" "enum__programs_v_blocks_b61_stats_band_label_position" DEFAULT 'below',
  	"text_align" "enum__programs_v_blocks_b61_stats_band_text_align" DEFAULT 'center',
  	"pad_top" "enum__programs_v_blocks_b61_stats_band_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum__programs_v_blocks_b61_stats_band_pad_bottom" DEFAULT 'normal',
  	"item_style" "enum__programs_v_blocks_b61_stats_band_item_style" DEFAULT 'plain',
  	"flush_edges" boolean,
  	"figure_scale" "enum__programs_v_blocks_b61_stats_band_figure_scale" DEFAULT 'large',
  	"surface" "enum__programs_v_blocks_b61_stats_band_surface",
  	"item_surface" "enum__programs_v_blocks_b61_stats_band_item_surface" DEFAULT 'card',
  	"eyebrow_rule" "enum__programs_v_blocks_b61_stats_band_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum__programs_v_blocks_b61_stats_band_entrance" DEFAULT 'on',
  	"band_width" "enum__programs_v_blocks_b61_stats_band_band_width" DEFAULT 'full',
  	"pull_up" boolean,
  	"css_class" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_b61_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_b61_gallery_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum__programs_v_blocks_b61_gallery_buttons_variant" DEFAULT 'primary',
  	"action" "enum__programs_v_blocks_b61_gallery_buttons_action" DEFAULT 'link',
  	"link_type" "enum__programs_v_blocks_b61_gallery_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_document_id" integer,
  	"link_url" varchar,
  	"video" varchar,
  	"full_width" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_b61_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" jsonb,
  	"intro" jsonb,
  	"heading_level" "enum__programs_v_blocks_b61_gallery_heading_level" DEFAULT 'auto',
  	"media" "enum__programs_v_blocks_b61_gallery_media" DEFAULT 'gallery',
  	"image_id" integer,
  	"caption" varchar,
  	"scroll_hint" varchar DEFAULT 'Scroll',
  	"video" varchar,
  	"gallery_layout" "enum__programs_v_blocks_b61_gallery_gallery_layout" DEFAULT 'strip',
  	"text_position" "enum__programs_v_blocks_b61_gallery_text_position" DEFAULT 'above',
  	"heading_align" "enum__programs_v_blocks_b61_gallery_heading_align" DEFAULT 'left',
  	"balance_step" numeric,
  	"pad_top" "enum__programs_v_blocks_b61_gallery_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum__programs_v_blocks_b61_gallery_pad_bottom" DEFAULT 'normal',
  	"item_size" "enum__programs_v_blocks_b61_gallery_item_size" DEFAULT 'medium',
  	"columns" "enum__programs_v_blocks_b61_gallery_columns" DEFAULT '3',
  	"image_shape" "enum__programs_v_blocks_b61_gallery_image_shape" DEFAULT 'fixed',
  	"surface" "enum__programs_v_blocks_b61_gallery_surface" DEFAULT 'none',
  	"eyebrow_rule" "enum__programs_v_blocks_b61_gallery_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum__programs_v_blocks_b61_gallery_entrance" DEFAULT 'on',
  	"duotone" boolean,
  	"css_class" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_b61_testimonial" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"quote" varchar,
  	"attribution" varchar,
  	"watermark_id" integer,
  	"text_align" "enum__programs_v_blocks_b61_testimonial_text_align" DEFAULT 'center',
  	"text_style" "enum__programs_v_blocks_b61_testimonial_text_style" DEFAULT 'italic',
  	"width_step" numeric,
  	"pad_top" "enum__programs_v_blocks_b61_testimonial_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum__programs_v_blocks_b61_testimonial_pad_bottom" DEFAULT 'normal',
  	"surface" "enum__programs_v_blocks_b61_testimonial_surface" DEFAULT 'none',
  	"eyebrow_rule" "enum__programs_v_blocks_b61_testimonial_eyebrow_rule" DEFAULT 'site',
  	"show_mark" boolean DEFAULT true,
  	"mark_room" boolean,
  	"entrance" "enum__programs_v_blocks_b61_testimonial_entrance" DEFAULT 'on',
  	"css_class" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_b61_accordion_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"subtitle" varchar,
  	"body" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_b61_accordion_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum__programs_v_blocks_b61_accordion_buttons_variant" DEFAULT 'primary',
  	"action" "enum__programs_v_blocks_b61_accordion_buttons_action" DEFAULT 'link',
  	"link_type" "enum__programs_v_blocks_b61_accordion_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_document_id" integer,
  	"link_url" varchar,
  	"video" varchar,
  	"full_width" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_b61_accordion" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" jsonb,
  	"intro" jsonb,
  	"heading_level" "enum__programs_v_blocks_b61_accordion_heading_level" DEFAULT 'auto',
  	"faq" boolean,
  	"first_item_open" boolean DEFAULT true,
  	"single_open" boolean DEFAULT true,
  	"heading_align" "enum__programs_v_blocks_b61_accordion_heading_align" DEFAULT 'left',
  	"width_step" numeric,
  	"pad_top" "enum__programs_v_blocks_b61_accordion_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum__programs_v_blocks_b61_accordion_pad_bottom" DEFAULT 'normal',
  	"item_style" "enum__programs_v_blocks_b61_accordion_item_style" DEFAULT 'divided',
  	"icon_style" "enum__programs_v_blocks_b61_accordion_icon_style" DEFAULT 'chevron',
  	"show_numbers" boolean DEFAULT true,
  	"surface" "enum__programs_v_blocks_b61_accordion_surface" DEFAULT 'none',
  	"item_surface" "enum__programs_v_blocks_b61_accordion_item_surface" DEFAULT 'card',
  	"eyebrow_rule" "enum__programs_v_blocks_b61_accordion_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum__programs_v_blocks_b61_accordion_entrance" DEFAULT 'on',
  	"css_class" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_b61_tabs_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_b61_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" jsonb,
  	"intro" jsonb,
  	"heading_level" "enum__programs_v_blocks_b61_tabs_heading_level" DEFAULT 'auto',
  	"first_item_open" boolean DEFAULT true,
  	"tab_position" "enum__programs_v_blocks_b61_tabs_tab_position" DEFAULT 'top',
  	"tab_align" "enum__programs_v_blocks_b61_tabs_tab_align" DEFAULT 'left',
  	"heading_align" "enum__programs_v_blocks_b61_tabs_heading_align" DEFAULT 'left',
  	"pad_top" "enum__programs_v_blocks_b61_tabs_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum__programs_v_blocks_b61_tabs_pad_bottom" DEFAULT 'normal',
  	"surface" "enum__programs_v_blocks_b61_tabs_surface" DEFAULT 'none',
  	"eyebrow_rule" "enum__programs_v_blocks_b61_tabs_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum__programs_v_blocks_b61_tabs_entrance" DEFAULT 'on',
  	"css_class" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_b61_pillars_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" jsonb,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_b61_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" jsonb,
  	"intro" jsonb,
  	"heading_level" "enum__programs_v_blocks_b61_pillars_heading_level" DEFAULT 'auto',
  	"first_item_open" boolean DEFAULT true,
  	"tab_position" "enum__programs_v_blocks_b61_pillars_tab_position" DEFAULT 'left',
  	"tab_align" "enum__programs_v_blocks_b61_pillars_tab_align" DEFAULT 'left',
  	"heading_align" "enum__programs_v_blocks_b61_pillars_heading_align" DEFAULT 'left',
  	"pad_top" "enum__programs_v_blocks_b61_pillars_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum__programs_v_blocks_b61_pillars_pad_bottom" DEFAULT 'normal',
  	"surface" "enum__programs_v_blocks_b61_pillars_surface" DEFAULT 'none',
  	"eyebrow_rule" "enum__programs_v_blocks_b61_pillars_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum__programs_v_blocks_b61_pillars_entrance" DEFAULT 'on',
  	"scroll_story" boolean,
  	"css_class" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_b61_carousel_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_b61_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" jsonb,
  	"intro" jsonb,
  	"heading_level" "enum__programs_v_blocks_b61_carousel_heading_level" DEFAULT 'auto',
  	"label" varchar,
  	"per_view" "enum__programs_v_blocks_b61_carousel_per_view" DEFAULT '1',
  	"heading_align" "enum__programs_v_blocks_b61_carousel_heading_align" DEFAULT 'left',
  	"advance" "enum__programs_v_blocks_b61_carousel_advance" DEFAULT 'one',
  	"controls_position" "enum__programs_v_blocks_b61_carousel_controls_position" DEFAULT 'top-right',
  	"show_counter" boolean DEFAULT true,
  	"show_progress" boolean DEFAULT true,
  	"pad_top" "enum__programs_v_blocks_b61_carousel_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum__programs_v_blocks_b61_carousel_pad_bottom" DEFAULT 'normal',
  	"surface" "enum__programs_v_blocks_b61_carousel_surface" DEFAULT 'none',
  	"eyebrow_rule" "enum__programs_v_blocks_b61_carousel_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum__programs_v_blocks_b61_carousel_entrance" DEFAULT 'on',
  	"css_class" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_b61_framed_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_shape" "enum__programs_v_blocks_b61_framed_image_image_shape" DEFAULT 'fixed',
  	"image_height" "enum__programs_v_blocks_b61_framed_image_image_height" DEFAULT '460px',
  	"ratio_w" numeric DEFAULT 3,
  	"ratio_h" numeric DEFAULT 2,
  	"flip_frame" boolean,
  	"width_step" numeric DEFAULT 4,
  	"frame_color" "enum__programs_v_blocks_b61_framed_image_frame_color" DEFAULT 'primary',
  	"entrance" "enum__programs_v_blocks_b61_framed_image_entrance" DEFAULT 'on',
  	"css_class" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_b61_cta_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_b61_cta_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum__programs_v_blocks_b61_cta_buttons_variant" DEFAULT 'primary',
  	"action" "enum__programs_v_blocks_b61_cta_buttons_action" DEFAULT 'link',
  	"link_type" "enum__programs_v_blocks_b61_cta_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_document_id" integer,
  	"link_url" varchar,
  	"video" varchar,
  	"full_width" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_b61_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" jsonb,
  	"heading_level" "enum__programs_v_blocks_b61_cta_heading_level" DEFAULT 'auto',
  	"body" jsonb,
  	"image_id" integer,
  	"overlay_strength" numeric,
  	"text_align" "enum__programs_v_blocks_b61_cta_text_align" DEFAULT 'center',
  	"width_step" numeric,
  	"position" "enum__programs_v_blocks_b61_cta_position" DEFAULT 'center',
  	"pad_top" "enum__programs_v_blocks_b61_cta_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum__programs_v_blocks_b61_cta_pad_bottom" DEFAULT 'normal',
  	"surface" "enum__programs_v_blocks_b61_cta_surface",
  	"text_panel" "enum__programs_v_blocks_b61_cta_text_panel" DEFAULT 'none',
  	"eyebrow_rule" "enum__programs_v_blocks_b61_cta_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum__programs_v_blocks_b61_cta_entrance" DEFAULT 'on',
  	"css_class" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_b61_form_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_b61_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_id" integer,
  	"eyebrow" varchar,
  	"heading" jsonb,
  	"heading_level" "enum__programs_v_blocks_b61_form_heading_level" DEFAULT 'auto',
  	"text_align" "enum__programs_v_blocks_b61_form_text_align" DEFAULT 'left',
  	"width_step" numeric,
  	"pad_top" "enum__programs_v_blocks_b61_form_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum__programs_v_blocks_b61_form_pad_bottom" DEFAULT 'normal',
  	"card" "enum__programs_v_blocks_b61_form_card" DEFAULT 'none',
  	"surface" "enum__programs_v_blocks_b61_form_surface" DEFAULT 'none',
  	"eyebrow_rule" "enum__programs_v_blocks_b61_form_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum__programs_v_blocks_b61_form_entrance" DEFAULT 'on',
  	"css_class" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_b61_button_bar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_label" varchar,
  	"first_link_type" "enum__programs_v_blocks_b61_button_bar_first_link_type" DEFAULT 'page',
  	"first_link_page_id" integer,
  	"first_link_document_id" integer,
  	"first_link_url" varchar,
  	"second_label" varchar,
  	"second_link_type" "enum__programs_v_blocks_b61_button_bar_second_link_type" DEFAULT 'page',
  	"second_link_page_id" integer,
  	"second_link_document_id" integer,
  	"second_link_url" varchar,
  	"size" "enum__programs_v_blocks_b61_button_bar_size" DEFAULT 'standard',
  	"first_color" "enum__programs_v_blocks_b61_button_bar_first_color" DEFAULT 'dark',
  	"second_color" "enum__programs_v_blocks_b61_button_bar_second_color" DEFAULT 'accent',
  	"entrance" "enum__programs_v_blocks_b61_button_bar_entrance" DEFAULT 'on',
  	"css_class" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_b61_divider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"line_style" "enum__programs_v_blocks_b61_divider_line_style" DEFAULT 'rule',
  	"ornament_id" integer,
  	"alignment" "enum__programs_v_blocks_b61_divider_alignment" DEFAULT 'center',
  	"width_step" numeric,
  	"weight" "enum__programs_v_blocks_b61_divider_weight" DEFAULT 'regular',
  	"line_color" "enum__programs_v_blocks_b61_divider_line_color" DEFAULT 'accent',
  	"entrance" "enum__programs_v_blocks_b61_divider_entrance" DEFAULT 'on',
  	"css_class" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_b61_logos_subheads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_b61_logos_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"link_type" "enum__programs_v_blocks_b61_logos_logos_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_document_id" integer,
  	"link_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_b61_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" jsonb,
  	"heading_level" "enum__programs_v_blocks_b61_logos_heading_level" DEFAULT 'auto',
  	"motion" "enum__programs_v_blocks_b61_logos_motion" DEFAULT 'still',
  	"heading_align" "enum__programs_v_blocks_b61_logos_heading_align" DEFAULT 'left',
  	"logo_step" numeric,
  	"pad_top" "enum__programs_v_blocks_b61_logos_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum__programs_v_blocks_b61_logos_pad_bottom" DEFAULT 'normal',
  	"surface" "enum__programs_v_blocks_b61_logos_surface" DEFAULT 'none',
  	"one_colour" boolean,
  	"eyebrow_rule" "enum__programs_v_blocks_b61_logos_eyebrow_rule" DEFAULT 'site',
  	"entrance" "enum__programs_v_blocks_b61_logos_entrance" DEFAULT 'on',
  	"css_class" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_b61_rail_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"variant" "enum__programs_v_blocks_b61_rail_buttons_variant" DEFAULT 'primary',
  	"action" "enum__programs_v_blocks_b61_rail_buttons_action" DEFAULT 'link',
  	"link_type" "enum__programs_v_blocks_b61_rail_buttons_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_document_id" integer,
  	"link_url" varchar,
  	"video" varchar,
  	"full_width" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_b61_rail_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"icon" "enum__programs_v_blocks_b61_rail_links_icon" DEFAULT 'arrow',
  	"icon_image_id" integer,
  	"icon_colours" boolean,
  	"link_type" "enum__programs_v_blocks_b61_rail_links_link_type" DEFAULT 'page',
  	"link_page_id" integer,
  	"link_document_id" integer,
  	"link_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_b61_rail" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"links_label" varchar DEFAULT 'Keep exploring',
  	"actions_position" "enum__programs_v_blocks_b61_rail_actions_position" DEFAULT 'top',
  	"sticky" boolean,
  	"surface" "enum__programs_v_blocks_b61_rail_surface" DEFAULT 'plain',
  	"css_class" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_programs_v_blocks_b61_section" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"overlay_strength" numeric,
  	"columns" "enum__programs_v_blocks_b61_section_columns" DEFAULT 'full',
  	"rail_sticky" boolean,
  	"rail_align" "enum__programs_v_blocks_b61_section_rail_align" DEFAULT 'start',
  	"rail_stack" "enum__programs_v_blocks_b61_section_rail_stack" DEFAULT 'source',
  	"pull_up" boolean,
  	"rail_width_step" numeric,
  	"pad_top" "enum__programs_v_blocks_b61_section_pad_top" DEFAULT 'normal',
  	"pad_bottom" "enum__programs_v_blocks_b61_section_pad_bottom" DEFAULT 'normal',
  	"pattern_on" boolean,
  	"pattern_image_id" integer,
  	"tile_size" numeric,
  	"pattern_strength" numeric,
  	"watermark_on" boolean,
  	"watermark_image_id" integer,
  	"watermark_size" numeric,
  	"watermark_strength" numeric,
  	"surface" "enum__programs_v_blocks_b61_section_surface" DEFAULT 'none',
  	"entrance" "enum__programs_v_blocks_b61_section_entrance" DEFAULT 'on',
  	"duotone" boolean,
  	"css_class" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "programs_blocks_b61_hero_buttons" ADD CONSTRAINT "programs_blocks_b61_hero_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_hero_buttons" ADD CONSTRAINT "programs_blocks_b61_hero_buttons_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_hero_buttons" ADD CONSTRAINT "programs_blocks_b61_hero_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_blocks_b61_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_hero_slides" ADD CONSTRAINT "programs_blocks_b61_hero_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_hero_slides" ADD CONSTRAINT "programs_blocks_b61_hero_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_blocks_b61_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_hero_collage" ADD CONSTRAINT "programs_blocks_b61_hero_collage_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_hero_collage" ADD CONSTRAINT "programs_blocks_b61_hero_collage_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_blocks_b61_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_hero" ADD CONSTRAINT "programs_blocks_b61_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_hero" ADD CONSTRAINT "programs_blocks_b61_hero_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_hero" ADD CONSTRAINT "programs_blocks_b61_hero_video_webm_id_media_id_fk" FOREIGN KEY ("video_webm_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_hero" ADD CONSTRAINT "programs_blocks_b61_hero_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_hero" ADD CONSTRAINT "programs_blocks_b61_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_split_subheads" ADD CONSTRAINT "programs_blocks_b61_split_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_blocks_b61_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_split_buttons" ADD CONSTRAINT "programs_blocks_b61_split_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_split_buttons" ADD CONSTRAINT "programs_blocks_b61_split_buttons_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_split_buttons" ADD CONSTRAINT "programs_blocks_b61_split_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_blocks_b61_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_split_images" ADD CONSTRAINT "programs_blocks_b61_split_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_split_images" ADD CONSTRAINT "programs_blocks_b61_split_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_blocks_b61_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_split" ADD CONSTRAINT "programs_blocks_b61_split_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_split" ADD CONSTRAINT "programs_blocks_b61_split_badge_id_media_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_split" ADD CONSTRAINT "programs_blocks_b61_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_prose_subheads" ADD CONSTRAINT "programs_blocks_b61_prose_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_blocks_b61_prose"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_prose_buttons" ADD CONSTRAINT "programs_blocks_b61_prose_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_prose_buttons" ADD CONSTRAINT "programs_blocks_b61_prose_buttons_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_prose_buttons" ADD CONSTRAINT "programs_blocks_b61_prose_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_blocks_b61_prose"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_prose" ADD CONSTRAINT "programs_blocks_b61_prose_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_card_grid_cards" ADD CONSTRAINT "programs_blocks_b61_card_grid_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_card_grid_cards" ADD CONSTRAINT "programs_blocks_b61_card_grid_cards_icon_image_id_media_id_fk" FOREIGN KEY ("icon_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_card_grid_cards" ADD CONSTRAINT "programs_blocks_b61_card_grid_cards_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_card_grid_cards" ADD CONSTRAINT "programs_blocks_b61_card_grid_cards_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_card_grid_cards" ADD CONSTRAINT "programs_blocks_b61_card_grid_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_blocks_b61_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_card_grid_buttons" ADD CONSTRAINT "programs_blocks_b61_card_grid_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_card_grid_buttons" ADD CONSTRAINT "programs_blocks_b61_card_grid_buttons_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_card_grid_buttons" ADD CONSTRAINT "programs_blocks_b61_card_grid_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_blocks_b61_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_card_grid" ADD CONSTRAINT "programs_blocks_b61_card_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_stats_band_stats" ADD CONSTRAINT "programs_blocks_b61_stats_band_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_blocks_b61_stats_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_stats_band_buttons" ADD CONSTRAINT "programs_blocks_b61_stats_band_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_stats_band_buttons" ADD CONSTRAINT "programs_blocks_b61_stats_band_buttons_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_stats_band_buttons" ADD CONSTRAINT "programs_blocks_b61_stats_band_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_blocks_b61_stats_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_stats_band" ADD CONSTRAINT "programs_blocks_b61_stats_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_gallery_images" ADD CONSTRAINT "programs_blocks_b61_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_gallery_images" ADD CONSTRAINT "programs_blocks_b61_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_blocks_b61_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_gallery_buttons" ADD CONSTRAINT "programs_blocks_b61_gallery_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_gallery_buttons" ADD CONSTRAINT "programs_blocks_b61_gallery_buttons_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_gallery_buttons" ADD CONSTRAINT "programs_blocks_b61_gallery_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_blocks_b61_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_gallery" ADD CONSTRAINT "programs_blocks_b61_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_gallery" ADD CONSTRAINT "programs_blocks_b61_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_testimonial" ADD CONSTRAINT "programs_blocks_b61_testimonial_watermark_id_media_id_fk" FOREIGN KEY ("watermark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_testimonial" ADD CONSTRAINT "programs_blocks_b61_testimonial_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_accordion_items" ADD CONSTRAINT "programs_blocks_b61_accordion_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_blocks_b61_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_accordion_buttons" ADD CONSTRAINT "programs_blocks_b61_accordion_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_accordion_buttons" ADD CONSTRAINT "programs_blocks_b61_accordion_buttons_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_accordion_buttons" ADD CONSTRAINT "programs_blocks_b61_accordion_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_blocks_b61_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_accordion" ADD CONSTRAINT "programs_blocks_b61_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_tabs_tabs" ADD CONSTRAINT "programs_blocks_b61_tabs_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_blocks_b61_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_tabs" ADD CONSTRAINT "programs_blocks_b61_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_pillars_items" ADD CONSTRAINT "programs_blocks_b61_pillars_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_pillars_items" ADD CONSTRAINT "programs_blocks_b61_pillars_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_blocks_b61_pillars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_pillars" ADD CONSTRAINT "programs_blocks_b61_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_carousel_slides" ADD CONSTRAINT "programs_blocks_b61_carousel_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_blocks_b61_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_carousel" ADD CONSTRAINT "programs_blocks_b61_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_framed_image" ADD CONSTRAINT "programs_blocks_b61_framed_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_framed_image" ADD CONSTRAINT "programs_blocks_b61_framed_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_cta_subheads" ADD CONSTRAINT "programs_blocks_b61_cta_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_blocks_b61_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_cta_buttons" ADD CONSTRAINT "programs_blocks_b61_cta_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_cta_buttons" ADD CONSTRAINT "programs_blocks_b61_cta_buttons_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_cta_buttons" ADD CONSTRAINT "programs_blocks_b61_cta_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_blocks_b61_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_cta" ADD CONSTRAINT "programs_blocks_b61_cta_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_cta" ADD CONSTRAINT "programs_blocks_b61_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_form_subheads" ADD CONSTRAINT "programs_blocks_b61_form_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_blocks_b61_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_form" ADD CONSTRAINT "programs_blocks_b61_form_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_form" ADD CONSTRAINT "programs_blocks_b61_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_button_bar" ADD CONSTRAINT "programs_blocks_b61_button_bar_first_link_page_id_pages_id_fk" FOREIGN KEY ("first_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_button_bar" ADD CONSTRAINT "programs_blocks_b61_button_bar_first_link_document_id_documents_id_fk" FOREIGN KEY ("first_link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_button_bar" ADD CONSTRAINT "programs_blocks_b61_button_bar_second_link_page_id_pages_id_fk" FOREIGN KEY ("second_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_button_bar" ADD CONSTRAINT "programs_blocks_b61_button_bar_second_link_document_id_documents_id_fk" FOREIGN KEY ("second_link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_button_bar" ADD CONSTRAINT "programs_blocks_b61_button_bar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_divider" ADD CONSTRAINT "programs_blocks_b61_divider_ornament_id_media_id_fk" FOREIGN KEY ("ornament_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_divider" ADD CONSTRAINT "programs_blocks_b61_divider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_logos_subheads" ADD CONSTRAINT "programs_blocks_b61_logos_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_blocks_b61_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_logos_logos" ADD CONSTRAINT "programs_blocks_b61_logos_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_logos_logos" ADD CONSTRAINT "programs_blocks_b61_logos_logos_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_logos_logos" ADD CONSTRAINT "programs_blocks_b61_logos_logos_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_logos_logos" ADD CONSTRAINT "programs_blocks_b61_logos_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_blocks_b61_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_logos" ADD CONSTRAINT "programs_blocks_b61_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_rail_buttons" ADD CONSTRAINT "programs_blocks_b61_rail_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_rail_buttons" ADD CONSTRAINT "programs_blocks_b61_rail_buttons_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_rail_buttons" ADD CONSTRAINT "programs_blocks_b61_rail_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_blocks_b61_rail"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_rail_links" ADD CONSTRAINT "programs_blocks_b61_rail_links_icon_image_id_media_id_fk" FOREIGN KEY ("icon_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_rail_links" ADD CONSTRAINT "programs_blocks_b61_rail_links_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_rail_links" ADD CONSTRAINT "programs_blocks_b61_rail_links_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_rail_links" ADD CONSTRAINT "programs_blocks_b61_rail_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_blocks_b61_rail"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_rail" ADD CONSTRAINT "programs_blocks_b61_rail_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_section" ADD CONSTRAINT "programs_blocks_b61_section_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_section" ADD CONSTRAINT "programs_blocks_b61_section_pattern_image_id_media_id_fk" FOREIGN KEY ("pattern_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_section" ADD CONSTRAINT "programs_blocks_b61_section_watermark_image_id_media_id_fk" FOREIGN KEY ("watermark_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_blocks_b61_section" ADD CONSTRAINT "programs_blocks_b61_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_hero_buttons" ADD CONSTRAINT "_programs_v_blocks_b61_hero_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_hero_buttons" ADD CONSTRAINT "_programs_v_blocks_b61_hero_buttons_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_hero_buttons" ADD CONSTRAINT "_programs_v_blocks_b61_hero_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v_blocks_b61_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_hero_slides" ADD CONSTRAINT "_programs_v_blocks_b61_hero_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_hero_slides" ADD CONSTRAINT "_programs_v_blocks_b61_hero_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v_blocks_b61_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_hero_collage" ADD CONSTRAINT "_programs_v_blocks_b61_hero_collage_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_hero_collage" ADD CONSTRAINT "_programs_v_blocks_b61_hero_collage_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v_blocks_b61_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_hero" ADD CONSTRAINT "_programs_v_blocks_b61_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_hero" ADD CONSTRAINT "_programs_v_blocks_b61_hero_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_hero" ADD CONSTRAINT "_programs_v_blocks_b61_hero_video_webm_id_media_id_fk" FOREIGN KEY ("video_webm_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_hero" ADD CONSTRAINT "_programs_v_blocks_b61_hero_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_hero" ADD CONSTRAINT "_programs_v_blocks_b61_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_split_subheads" ADD CONSTRAINT "_programs_v_blocks_b61_split_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v_blocks_b61_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_split_buttons" ADD CONSTRAINT "_programs_v_blocks_b61_split_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_split_buttons" ADD CONSTRAINT "_programs_v_blocks_b61_split_buttons_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_split_buttons" ADD CONSTRAINT "_programs_v_blocks_b61_split_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v_blocks_b61_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_split_images" ADD CONSTRAINT "_programs_v_blocks_b61_split_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_split_images" ADD CONSTRAINT "_programs_v_blocks_b61_split_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v_blocks_b61_split"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_split" ADD CONSTRAINT "_programs_v_blocks_b61_split_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_split" ADD CONSTRAINT "_programs_v_blocks_b61_split_badge_id_media_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_split" ADD CONSTRAINT "_programs_v_blocks_b61_split_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_prose_subheads" ADD CONSTRAINT "_programs_v_blocks_b61_prose_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v_blocks_b61_prose"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_prose_buttons" ADD CONSTRAINT "_programs_v_blocks_b61_prose_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_prose_buttons" ADD CONSTRAINT "_programs_v_blocks_b61_prose_buttons_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_prose_buttons" ADD CONSTRAINT "_programs_v_blocks_b61_prose_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v_blocks_b61_prose"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_prose" ADD CONSTRAINT "_programs_v_blocks_b61_prose_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_card_grid_cards" ADD CONSTRAINT "_programs_v_blocks_b61_card_grid_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_card_grid_cards" ADD CONSTRAINT "_programs_v_blocks_b61_card_grid_cards_icon_image_id_media_id_fk" FOREIGN KEY ("icon_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_card_grid_cards" ADD CONSTRAINT "_programs_v_blocks_b61_card_grid_cards_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_card_grid_cards" ADD CONSTRAINT "_programs_v_blocks_b61_card_grid_cards_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_card_grid_cards" ADD CONSTRAINT "_programs_v_blocks_b61_card_grid_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v_blocks_b61_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_card_grid_buttons" ADD CONSTRAINT "_programs_v_blocks_b61_card_grid_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_card_grid_buttons" ADD CONSTRAINT "_programs_v_blocks_b61_card_grid_buttons_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_card_grid_buttons" ADD CONSTRAINT "_programs_v_blocks_b61_card_grid_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v_blocks_b61_card_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_card_grid" ADD CONSTRAINT "_programs_v_blocks_b61_card_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_stats_band_stats" ADD CONSTRAINT "_programs_v_blocks_b61_stats_band_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v_blocks_b61_stats_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_stats_band_buttons" ADD CONSTRAINT "_programs_v_blocks_b61_stats_band_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_stats_band_buttons" ADD CONSTRAINT "_programs_v_blocks_b61_stats_band_buttons_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_stats_band_buttons" ADD CONSTRAINT "_programs_v_blocks_b61_stats_band_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v_blocks_b61_stats_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_stats_band" ADD CONSTRAINT "_programs_v_blocks_b61_stats_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_gallery_images" ADD CONSTRAINT "_programs_v_blocks_b61_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_gallery_images" ADD CONSTRAINT "_programs_v_blocks_b61_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v_blocks_b61_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_gallery_buttons" ADD CONSTRAINT "_programs_v_blocks_b61_gallery_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_gallery_buttons" ADD CONSTRAINT "_programs_v_blocks_b61_gallery_buttons_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_gallery_buttons" ADD CONSTRAINT "_programs_v_blocks_b61_gallery_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v_blocks_b61_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_gallery" ADD CONSTRAINT "_programs_v_blocks_b61_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_gallery" ADD CONSTRAINT "_programs_v_blocks_b61_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_testimonial" ADD CONSTRAINT "_programs_v_blocks_b61_testimonial_watermark_id_media_id_fk" FOREIGN KEY ("watermark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_testimonial" ADD CONSTRAINT "_programs_v_blocks_b61_testimonial_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_accordion_items" ADD CONSTRAINT "_programs_v_blocks_b61_accordion_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v_blocks_b61_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_accordion_buttons" ADD CONSTRAINT "_programs_v_blocks_b61_accordion_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_accordion_buttons" ADD CONSTRAINT "_programs_v_blocks_b61_accordion_buttons_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_accordion_buttons" ADD CONSTRAINT "_programs_v_blocks_b61_accordion_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v_blocks_b61_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_accordion" ADD CONSTRAINT "_programs_v_blocks_b61_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_tabs_tabs" ADD CONSTRAINT "_programs_v_blocks_b61_tabs_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v_blocks_b61_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_tabs" ADD CONSTRAINT "_programs_v_blocks_b61_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_pillars_items" ADD CONSTRAINT "_programs_v_blocks_b61_pillars_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_pillars_items" ADD CONSTRAINT "_programs_v_blocks_b61_pillars_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v_blocks_b61_pillars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_pillars" ADD CONSTRAINT "_programs_v_blocks_b61_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_carousel_slides" ADD CONSTRAINT "_programs_v_blocks_b61_carousel_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v_blocks_b61_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_carousel" ADD CONSTRAINT "_programs_v_blocks_b61_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_framed_image" ADD CONSTRAINT "_programs_v_blocks_b61_framed_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_framed_image" ADD CONSTRAINT "_programs_v_blocks_b61_framed_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_cta_subheads" ADD CONSTRAINT "_programs_v_blocks_b61_cta_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v_blocks_b61_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_cta_buttons" ADD CONSTRAINT "_programs_v_blocks_b61_cta_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_cta_buttons" ADD CONSTRAINT "_programs_v_blocks_b61_cta_buttons_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_cta_buttons" ADD CONSTRAINT "_programs_v_blocks_b61_cta_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v_blocks_b61_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_cta" ADD CONSTRAINT "_programs_v_blocks_b61_cta_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_cta" ADD CONSTRAINT "_programs_v_blocks_b61_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_form_subheads" ADD CONSTRAINT "_programs_v_blocks_b61_form_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v_blocks_b61_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_form" ADD CONSTRAINT "_programs_v_blocks_b61_form_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_form" ADD CONSTRAINT "_programs_v_blocks_b61_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_button_bar" ADD CONSTRAINT "_programs_v_blocks_b61_button_bar_first_link_page_id_pages_id_fk" FOREIGN KEY ("first_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_button_bar" ADD CONSTRAINT "_programs_v_blocks_b61_button_bar_first_link_document_id_documents_id_fk" FOREIGN KEY ("first_link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_button_bar" ADD CONSTRAINT "_programs_v_blocks_b61_button_bar_second_link_page_id_pages_id_fk" FOREIGN KEY ("second_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_button_bar" ADD CONSTRAINT "_programs_v_blocks_b61_button_bar_second_link_document_id_documents_id_fk" FOREIGN KEY ("second_link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_button_bar" ADD CONSTRAINT "_programs_v_blocks_b61_button_bar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_divider" ADD CONSTRAINT "_programs_v_blocks_b61_divider_ornament_id_media_id_fk" FOREIGN KEY ("ornament_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_divider" ADD CONSTRAINT "_programs_v_blocks_b61_divider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_logos_subheads" ADD CONSTRAINT "_programs_v_blocks_b61_logos_subheads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v_blocks_b61_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_logos_logos" ADD CONSTRAINT "_programs_v_blocks_b61_logos_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_logos_logos" ADD CONSTRAINT "_programs_v_blocks_b61_logos_logos_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_logos_logos" ADD CONSTRAINT "_programs_v_blocks_b61_logos_logos_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_logos_logos" ADD CONSTRAINT "_programs_v_blocks_b61_logos_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v_blocks_b61_logos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_logos" ADD CONSTRAINT "_programs_v_blocks_b61_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_rail_buttons" ADD CONSTRAINT "_programs_v_blocks_b61_rail_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_rail_buttons" ADD CONSTRAINT "_programs_v_blocks_b61_rail_buttons_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_rail_buttons" ADD CONSTRAINT "_programs_v_blocks_b61_rail_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v_blocks_b61_rail"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_rail_links" ADD CONSTRAINT "_programs_v_blocks_b61_rail_links_icon_image_id_media_id_fk" FOREIGN KEY ("icon_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_rail_links" ADD CONSTRAINT "_programs_v_blocks_b61_rail_links_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_rail_links" ADD CONSTRAINT "_programs_v_blocks_b61_rail_links_link_document_id_documents_id_fk" FOREIGN KEY ("link_document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_rail_links" ADD CONSTRAINT "_programs_v_blocks_b61_rail_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v_blocks_b61_rail"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_rail" ADD CONSTRAINT "_programs_v_blocks_b61_rail_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_section" ADD CONSTRAINT "_programs_v_blocks_b61_section_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_section" ADD CONSTRAINT "_programs_v_blocks_b61_section_pattern_image_id_media_id_fk" FOREIGN KEY ("pattern_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_section" ADD CONSTRAINT "_programs_v_blocks_b61_section_watermark_image_id_media_id_fk" FOREIGN KEY ("watermark_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_blocks_b61_section" ADD CONSTRAINT "_programs_v_blocks_b61_section_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "programs_blocks_b61_hero_buttons_order_idx" ON "programs_blocks_b61_hero_buttons" USING btree ("_order");
  CREATE INDEX "programs_blocks_b61_hero_buttons_parent_id_idx" ON "programs_blocks_b61_hero_buttons" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_b61_hero_buttons_link_link_page_idx" ON "programs_blocks_b61_hero_buttons" USING btree ("link_page_id");
  CREATE INDEX "programs_blocks_b61_hero_buttons_link_link_document_idx" ON "programs_blocks_b61_hero_buttons" USING btree ("link_document_id");
  CREATE INDEX "programs_blocks_b61_hero_slides_order_idx" ON "programs_blocks_b61_hero_slides" USING btree ("_order");
  CREATE INDEX "programs_blocks_b61_hero_slides_parent_id_idx" ON "programs_blocks_b61_hero_slides" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_b61_hero_slides_image_idx" ON "programs_blocks_b61_hero_slides" USING btree ("image_id");
  CREATE INDEX "programs_blocks_b61_hero_collage_order_idx" ON "programs_blocks_b61_hero_collage" USING btree ("_order");
  CREATE INDEX "programs_blocks_b61_hero_collage_parent_id_idx" ON "programs_blocks_b61_hero_collage" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_b61_hero_collage_image_idx" ON "programs_blocks_b61_hero_collage" USING btree ("image_id");
  CREATE INDEX "programs_blocks_b61_hero_order_idx" ON "programs_blocks_b61_hero" USING btree ("_order");
  CREATE INDEX "programs_blocks_b61_hero_parent_id_idx" ON "programs_blocks_b61_hero" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_b61_hero_path_idx" ON "programs_blocks_b61_hero" USING btree ("_path");
  CREATE INDEX "programs_blocks_b61_hero_image_idx" ON "programs_blocks_b61_hero" USING btree ("image_id");
  CREATE INDEX "programs_blocks_b61_hero_video_idx" ON "programs_blocks_b61_hero" USING btree ("video_id");
  CREATE INDEX "programs_blocks_b61_hero_video_webm_idx" ON "programs_blocks_b61_hero" USING btree ("video_webm_id");
  CREATE INDEX "programs_blocks_b61_hero_poster_idx" ON "programs_blocks_b61_hero" USING btree ("poster_id");
  CREATE INDEX "programs_blocks_b61_split_subheads_order_idx" ON "programs_blocks_b61_split_subheads" USING btree ("_order");
  CREATE INDEX "programs_blocks_b61_split_subheads_parent_id_idx" ON "programs_blocks_b61_split_subheads" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_b61_split_buttons_order_idx" ON "programs_blocks_b61_split_buttons" USING btree ("_order");
  CREATE INDEX "programs_blocks_b61_split_buttons_parent_id_idx" ON "programs_blocks_b61_split_buttons" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_b61_split_buttons_link_link_page_idx" ON "programs_blocks_b61_split_buttons" USING btree ("link_page_id");
  CREATE INDEX "programs_blocks_b61_split_buttons_link_link_document_idx" ON "programs_blocks_b61_split_buttons" USING btree ("link_document_id");
  CREATE INDEX "programs_blocks_b61_split_images_order_idx" ON "programs_blocks_b61_split_images" USING btree ("_order");
  CREATE INDEX "programs_blocks_b61_split_images_parent_id_idx" ON "programs_blocks_b61_split_images" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_b61_split_images_image_idx" ON "programs_blocks_b61_split_images" USING btree ("image_id");
  CREATE INDEX "programs_blocks_b61_split_order_idx" ON "programs_blocks_b61_split" USING btree ("_order");
  CREATE INDEX "programs_blocks_b61_split_parent_id_idx" ON "programs_blocks_b61_split" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_b61_split_path_idx" ON "programs_blocks_b61_split" USING btree ("_path");
  CREATE INDEX "programs_blocks_b61_split_image_idx" ON "programs_blocks_b61_split" USING btree ("image_id");
  CREATE INDEX "programs_blocks_b61_split_badge_idx" ON "programs_blocks_b61_split" USING btree ("badge_id");
  CREATE INDEX "programs_blocks_b61_prose_subheads_order_idx" ON "programs_blocks_b61_prose_subheads" USING btree ("_order");
  CREATE INDEX "programs_blocks_b61_prose_subheads_parent_id_idx" ON "programs_blocks_b61_prose_subheads" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_b61_prose_buttons_order_idx" ON "programs_blocks_b61_prose_buttons" USING btree ("_order");
  CREATE INDEX "programs_blocks_b61_prose_buttons_parent_id_idx" ON "programs_blocks_b61_prose_buttons" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_b61_prose_buttons_link_link_page_idx" ON "programs_blocks_b61_prose_buttons" USING btree ("link_page_id");
  CREATE INDEX "programs_blocks_b61_prose_buttons_link_link_document_idx" ON "programs_blocks_b61_prose_buttons" USING btree ("link_document_id");
  CREATE INDEX "programs_blocks_b61_prose_order_idx" ON "programs_blocks_b61_prose" USING btree ("_order");
  CREATE INDEX "programs_blocks_b61_prose_parent_id_idx" ON "programs_blocks_b61_prose" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_b61_prose_path_idx" ON "programs_blocks_b61_prose" USING btree ("_path");
  CREATE INDEX "programs_blocks_b61_card_grid_cards_order_idx" ON "programs_blocks_b61_card_grid_cards" USING btree ("_order");
  CREATE INDEX "programs_blocks_b61_card_grid_cards_parent_id_idx" ON "programs_blocks_b61_card_grid_cards" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_b61_card_grid_cards_image_idx" ON "programs_blocks_b61_card_grid_cards" USING btree ("image_id");
  CREATE INDEX "programs_blocks_b61_card_grid_cards_icon_image_idx" ON "programs_blocks_b61_card_grid_cards" USING btree ("icon_image_id");
  CREATE INDEX "programs_blocks_b61_card_grid_cards_link_link_page_idx" ON "programs_blocks_b61_card_grid_cards" USING btree ("link_page_id");
  CREATE INDEX "programs_blocks_b61_card_grid_cards_link_link_document_idx" ON "programs_blocks_b61_card_grid_cards" USING btree ("link_document_id");
  CREATE INDEX "programs_blocks_b61_card_grid_buttons_order_idx" ON "programs_blocks_b61_card_grid_buttons" USING btree ("_order");
  CREATE INDEX "programs_blocks_b61_card_grid_buttons_parent_id_idx" ON "programs_blocks_b61_card_grid_buttons" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_b61_card_grid_buttons_link_link_page_idx" ON "programs_blocks_b61_card_grid_buttons" USING btree ("link_page_id");
  CREATE INDEX "programs_blocks_b61_card_grid_buttons_link_link_document_idx" ON "programs_blocks_b61_card_grid_buttons" USING btree ("link_document_id");
  CREATE INDEX "programs_blocks_b61_card_grid_order_idx" ON "programs_blocks_b61_card_grid" USING btree ("_order");
  CREATE INDEX "programs_blocks_b61_card_grid_parent_id_idx" ON "programs_blocks_b61_card_grid" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_b61_card_grid_path_idx" ON "programs_blocks_b61_card_grid" USING btree ("_path");
  CREATE INDEX "programs_blocks_b61_stats_band_stats_order_idx" ON "programs_blocks_b61_stats_band_stats" USING btree ("_order");
  CREATE INDEX "programs_blocks_b61_stats_band_stats_parent_id_idx" ON "programs_blocks_b61_stats_band_stats" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_b61_stats_band_buttons_order_idx" ON "programs_blocks_b61_stats_band_buttons" USING btree ("_order");
  CREATE INDEX "programs_blocks_b61_stats_band_buttons_parent_id_idx" ON "programs_blocks_b61_stats_band_buttons" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_b61_stats_band_buttons_link_link_page_idx" ON "programs_blocks_b61_stats_band_buttons" USING btree ("link_page_id");
  CREATE INDEX "programs_blocks_b61_stats_band_buttons_link_link_documen_idx" ON "programs_blocks_b61_stats_band_buttons" USING btree ("link_document_id");
  CREATE INDEX "programs_blocks_b61_stats_band_order_idx" ON "programs_blocks_b61_stats_band" USING btree ("_order");
  CREATE INDEX "programs_blocks_b61_stats_band_parent_id_idx" ON "programs_blocks_b61_stats_band" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_b61_stats_band_path_idx" ON "programs_blocks_b61_stats_band" USING btree ("_path");
  CREATE INDEX "programs_blocks_b61_gallery_images_order_idx" ON "programs_blocks_b61_gallery_images" USING btree ("_order");
  CREATE INDEX "programs_blocks_b61_gallery_images_parent_id_idx" ON "programs_blocks_b61_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_b61_gallery_images_image_idx" ON "programs_blocks_b61_gallery_images" USING btree ("image_id");
  CREATE INDEX "programs_blocks_b61_gallery_buttons_order_idx" ON "programs_blocks_b61_gallery_buttons" USING btree ("_order");
  CREATE INDEX "programs_blocks_b61_gallery_buttons_parent_id_idx" ON "programs_blocks_b61_gallery_buttons" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_b61_gallery_buttons_link_link_page_idx" ON "programs_blocks_b61_gallery_buttons" USING btree ("link_page_id");
  CREATE INDEX "programs_blocks_b61_gallery_buttons_link_link_document_idx" ON "programs_blocks_b61_gallery_buttons" USING btree ("link_document_id");
  CREATE INDEX "programs_blocks_b61_gallery_order_idx" ON "programs_blocks_b61_gallery" USING btree ("_order");
  CREATE INDEX "programs_blocks_b61_gallery_parent_id_idx" ON "programs_blocks_b61_gallery" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_b61_gallery_path_idx" ON "programs_blocks_b61_gallery" USING btree ("_path");
  CREATE INDEX "programs_blocks_b61_gallery_image_idx" ON "programs_blocks_b61_gallery" USING btree ("image_id");
  CREATE INDEX "programs_blocks_b61_testimonial_order_idx" ON "programs_blocks_b61_testimonial" USING btree ("_order");
  CREATE INDEX "programs_blocks_b61_testimonial_parent_id_idx" ON "programs_blocks_b61_testimonial" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_b61_testimonial_path_idx" ON "programs_blocks_b61_testimonial" USING btree ("_path");
  CREATE INDEX "programs_blocks_b61_testimonial_watermark_idx" ON "programs_blocks_b61_testimonial" USING btree ("watermark_id");
  CREATE INDEX "programs_blocks_b61_accordion_items_order_idx" ON "programs_blocks_b61_accordion_items" USING btree ("_order");
  CREATE INDEX "programs_blocks_b61_accordion_items_parent_id_idx" ON "programs_blocks_b61_accordion_items" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_b61_accordion_buttons_order_idx" ON "programs_blocks_b61_accordion_buttons" USING btree ("_order");
  CREATE INDEX "programs_blocks_b61_accordion_buttons_parent_id_idx" ON "programs_blocks_b61_accordion_buttons" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_b61_accordion_buttons_link_link_page_idx" ON "programs_blocks_b61_accordion_buttons" USING btree ("link_page_id");
  CREATE INDEX "programs_blocks_b61_accordion_buttons_link_link_document_idx" ON "programs_blocks_b61_accordion_buttons" USING btree ("link_document_id");
  CREATE INDEX "programs_blocks_b61_accordion_order_idx" ON "programs_blocks_b61_accordion" USING btree ("_order");
  CREATE INDEX "programs_blocks_b61_accordion_parent_id_idx" ON "programs_blocks_b61_accordion" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_b61_accordion_path_idx" ON "programs_blocks_b61_accordion" USING btree ("_path");
  CREATE INDEX "programs_blocks_b61_tabs_tabs_order_idx" ON "programs_blocks_b61_tabs_tabs" USING btree ("_order");
  CREATE INDEX "programs_blocks_b61_tabs_tabs_parent_id_idx" ON "programs_blocks_b61_tabs_tabs" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_b61_tabs_order_idx" ON "programs_blocks_b61_tabs" USING btree ("_order");
  CREATE INDEX "programs_blocks_b61_tabs_parent_id_idx" ON "programs_blocks_b61_tabs" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_b61_tabs_path_idx" ON "programs_blocks_b61_tabs" USING btree ("_path");
  CREATE INDEX "programs_blocks_b61_pillars_items_order_idx" ON "programs_blocks_b61_pillars_items" USING btree ("_order");
  CREATE INDEX "programs_blocks_b61_pillars_items_parent_id_idx" ON "programs_blocks_b61_pillars_items" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_b61_pillars_items_image_idx" ON "programs_blocks_b61_pillars_items" USING btree ("image_id");
  CREATE INDEX "programs_blocks_b61_pillars_order_idx" ON "programs_blocks_b61_pillars" USING btree ("_order");
  CREATE INDEX "programs_blocks_b61_pillars_parent_id_idx" ON "programs_blocks_b61_pillars" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_b61_pillars_path_idx" ON "programs_blocks_b61_pillars" USING btree ("_path");
  CREATE INDEX "programs_blocks_b61_carousel_slides_order_idx" ON "programs_blocks_b61_carousel_slides" USING btree ("_order");
  CREATE INDEX "programs_blocks_b61_carousel_slides_parent_id_idx" ON "programs_blocks_b61_carousel_slides" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_b61_carousel_order_idx" ON "programs_blocks_b61_carousel" USING btree ("_order");
  CREATE INDEX "programs_blocks_b61_carousel_parent_id_idx" ON "programs_blocks_b61_carousel" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_b61_carousel_path_idx" ON "programs_blocks_b61_carousel" USING btree ("_path");
  CREATE INDEX "programs_blocks_b61_framed_image_order_idx" ON "programs_blocks_b61_framed_image" USING btree ("_order");
  CREATE INDEX "programs_blocks_b61_framed_image_parent_id_idx" ON "programs_blocks_b61_framed_image" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_b61_framed_image_path_idx" ON "programs_blocks_b61_framed_image" USING btree ("_path");
  CREATE INDEX "programs_blocks_b61_framed_image_image_idx" ON "programs_blocks_b61_framed_image" USING btree ("image_id");
  CREATE INDEX "programs_blocks_b61_cta_subheads_order_idx" ON "programs_blocks_b61_cta_subheads" USING btree ("_order");
  CREATE INDEX "programs_blocks_b61_cta_subheads_parent_id_idx" ON "programs_blocks_b61_cta_subheads" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_b61_cta_buttons_order_idx" ON "programs_blocks_b61_cta_buttons" USING btree ("_order");
  CREATE INDEX "programs_blocks_b61_cta_buttons_parent_id_idx" ON "programs_blocks_b61_cta_buttons" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_b61_cta_buttons_link_link_page_idx" ON "programs_blocks_b61_cta_buttons" USING btree ("link_page_id");
  CREATE INDEX "programs_blocks_b61_cta_buttons_link_link_document_idx" ON "programs_blocks_b61_cta_buttons" USING btree ("link_document_id");
  CREATE INDEX "programs_blocks_b61_cta_order_idx" ON "programs_blocks_b61_cta" USING btree ("_order");
  CREATE INDEX "programs_blocks_b61_cta_parent_id_idx" ON "programs_blocks_b61_cta" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_b61_cta_path_idx" ON "programs_blocks_b61_cta" USING btree ("_path");
  CREATE INDEX "programs_blocks_b61_cta_image_idx" ON "programs_blocks_b61_cta" USING btree ("image_id");
  CREATE INDEX "programs_blocks_b61_form_subheads_order_idx" ON "programs_blocks_b61_form_subheads" USING btree ("_order");
  CREATE INDEX "programs_blocks_b61_form_subheads_parent_id_idx" ON "programs_blocks_b61_form_subheads" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_b61_form_order_idx" ON "programs_blocks_b61_form" USING btree ("_order");
  CREATE INDEX "programs_blocks_b61_form_parent_id_idx" ON "programs_blocks_b61_form" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_b61_form_path_idx" ON "programs_blocks_b61_form" USING btree ("_path");
  CREATE INDEX "programs_blocks_b61_form_form_idx" ON "programs_blocks_b61_form" USING btree ("form_id");
  CREATE INDEX "programs_blocks_b61_button_bar_order_idx" ON "programs_blocks_b61_button_bar" USING btree ("_order");
  CREATE INDEX "programs_blocks_b61_button_bar_parent_id_idx" ON "programs_blocks_b61_button_bar" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_b61_button_bar_path_idx" ON "programs_blocks_b61_button_bar" USING btree ("_path");
  CREATE INDEX "programs_blocks_b61_button_bar_first_link_first_link_pag_idx" ON "programs_blocks_b61_button_bar" USING btree ("first_link_page_id");
  CREATE INDEX "programs_blocks_b61_button_bar_first_link_first_link_doc_idx" ON "programs_blocks_b61_button_bar" USING btree ("first_link_document_id");
  CREATE INDEX "programs_blocks_b61_button_bar_second_link_second_link_p_idx" ON "programs_blocks_b61_button_bar" USING btree ("second_link_page_id");
  CREATE INDEX "programs_blocks_b61_button_bar_second_link_second_link_d_idx" ON "programs_blocks_b61_button_bar" USING btree ("second_link_document_id");
  CREATE INDEX "programs_blocks_b61_divider_order_idx" ON "programs_blocks_b61_divider" USING btree ("_order");
  CREATE INDEX "programs_blocks_b61_divider_parent_id_idx" ON "programs_blocks_b61_divider" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_b61_divider_path_idx" ON "programs_blocks_b61_divider" USING btree ("_path");
  CREATE INDEX "programs_blocks_b61_divider_ornament_idx" ON "programs_blocks_b61_divider" USING btree ("ornament_id");
  CREATE INDEX "programs_blocks_b61_logos_subheads_order_idx" ON "programs_blocks_b61_logos_subheads" USING btree ("_order");
  CREATE INDEX "programs_blocks_b61_logos_subheads_parent_id_idx" ON "programs_blocks_b61_logos_subheads" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_b61_logos_logos_order_idx" ON "programs_blocks_b61_logos_logos" USING btree ("_order");
  CREATE INDEX "programs_blocks_b61_logos_logos_parent_id_idx" ON "programs_blocks_b61_logos_logos" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_b61_logos_logos_image_idx" ON "programs_blocks_b61_logos_logos" USING btree ("image_id");
  CREATE INDEX "programs_blocks_b61_logos_logos_link_link_page_idx" ON "programs_blocks_b61_logos_logos" USING btree ("link_page_id");
  CREATE INDEX "programs_blocks_b61_logos_logos_link_link_document_idx" ON "programs_blocks_b61_logos_logos" USING btree ("link_document_id");
  CREATE INDEX "programs_blocks_b61_logos_order_idx" ON "programs_blocks_b61_logos" USING btree ("_order");
  CREATE INDEX "programs_blocks_b61_logos_parent_id_idx" ON "programs_blocks_b61_logos" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_b61_logos_path_idx" ON "programs_blocks_b61_logos" USING btree ("_path");
  CREATE INDEX "programs_blocks_b61_rail_buttons_order_idx" ON "programs_blocks_b61_rail_buttons" USING btree ("_order");
  CREATE INDEX "programs_blocks_b61_rail_buttons_parent_id_idx" ON "programs_blocks_b61_rail_buttons" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_b61_rail_buttons_link_link_page_idx" ON "programs_blocks_b61_rail_buttons" USING btree ("link_page_id");
  CREATE INDEX "programs_blocks_b61_rail_buttons_link_link_document_idx" ON "programs_blocks_b61_rail_buttons" USING btree ("link_document_id");
  CREATE INDEX "programs_blocks_b61_rail_links_order_idx" ON "programs_blocks_b61_rail_links" USING btree ("_order");
  CREATE INDEX "programs_blocks_b61_rail_links_parent_id_idx" ON "programs_blocks_b61_rail_links" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_b61_rail_links_icon_image_idx" ON "programs_blocks_b61_rail_links" USING btree ("icon_image_id");
  CREATE INDEX "programs_blocks_b61_rail_links_link_link_page_idx" ON "programs_blocks_b61_rail_links" USING btree ("link_page_id");
  CREATE INDEX "programs_blocks_b61_rail_links_link_link_document_idx" ON "programs_blocks_b61_rail_links" USING btree ("link_document_id");
  CREATE INDEX "programs_blocks_b61_rail_order_idx" ON "programs_blocks_b61_rail" USING btree ("_order");
  CREATE INDEX "programs_blocks_b61_rail_parent_id_idx" ON "programs_blocks_b61_rail" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_b61_rail_path_idx" ON "programs_blocks_b61_rail" USING btree ("_path");
  CREATE INDEX "programs_blocks_b61_section_order_idx" ON "programs_blocks_b61_section" USING btree ("_order");
  CREATE INDEX "programs_blocks_b61_section_parent_id_idx" ON "programs_blocks_b61_section" USING btree ("_parent_id");
  CREATE INDEX "programs_blocks_b61_section_path_idx" ON "programs_blocks_b61_section" USING btree ("_path");
  CREATE INDEX "programs_blocks_b61_section_image_idx" ON "programs_blocks_b61_section" USING btree ("image_id");
  CREATE INDEX "programs_blocks_b61_section_pattern_image_idx" ON "programs_blocks_b61_section" USING btree ("pattern_image_id");
  CREATE INDEX "programs_blocks_b61_section_watermark_image_idx" ON "programs_blocks_b61_section" USING btree ("watermark_image_id");
  CREATE INDEX "_programs_v_blocks_b61_hero_buttons_order_idx" ON "_programs_v_blocks_b61_hero_buttons" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_b61_hero_buttons_parent_id_idx" ON "_programs_v_blocks_b61_hero_buttons" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_b61_hero_buttons_link_link_page_idx" ON "_programs_v_blocks_b61_hero_buttons" USING btree ("link_page_id");
  CREATE INDEX "_programs_v_blocks_b61_hero_buttons_link_link_document_idx" ON "_programs_v_blocks_b61_hero_buttons" USING btree ("link_document_id");
  CREATE INDEX "_programs_v_blocks_b61_hero_slides_order_idx" ON "_programs_v_blocks_b61_hero_slides" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_b61_hero_slides_parent_id_idx" ON "_programs_v_blocks_b61_hero_slides" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_b61_hero_slides_image_idx" ON "_programs_v_blocks_b61_hero_slides" USING btree ("image_id");
  CREATE INDEX "_programs_v_blocks_b61_hero_collage_order_idx" ON "_programs_v_blocks_b61_hero_collage" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_b61_hero_collage_parent_id_idx" ON "_programs_v_blocks_b61_hero_collage" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_b61_hero_collage_image_idx" ON "_programs_v_blocks_b61_hero_collage" USING btree ("image_id");
  CREATE INDEX "_programs_v_blocks_b61_hero_order_idx" ON "_programs_v_blocks_b61_hero" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_b61_hero_parent_id_idx" ON "_programs_v_blocks_b61_hero" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_b61_hero_path_idx" ON "_programs_v_blocks_b61_hero" USING btree ("_path");
  CREATE INDEX "_programs_v_blocks_b61_hero_image_idx" ON "_programs_v_blocks_b61_hero" USING btree ("image_id");
  CREATE INDEX "_programs_v_blocks_b61_hero_video_idx" ON "_programs_v_blocks_b61_hero" USING btree ("video_id");
  CREATE INDEX "_programs_v_blocks_b61_hero_video_webm_idx" ON "_programs_v_blocks_b61_hero" USING btree ("video_webm_id");
  CREATE INDEX "_programs_v_blocks_b61_hero_poster_idx" ON "_programs_v_blocks_b61_hero" USING btree ("poster_id");
  CREATE INDEX "_programs_v_blocks_b61_split_subheads_order_idx" ON "_programs_v_blocks_b61_split_subheads" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_b61_split_subheads_parent_id_idx" ON "_programs_v_blocks_b61_split_subheads" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_b61_split_buttons_order_idx" ON "_programs_v_blocks_b61_split_buttons" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_b61_split_buttons_parent_id_idx" ON "_programs_v_blocks_b61_split_buttons" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_b61_split_buttons_link_link_page_idx" ON "_programs_v_blocks_b61_split_buttons" USING btree ("link_page_id");
  CREATE INDEX "_programs_v_blocks_b61_split_buttons_link_link_document_idx" ON "_programs_v_blocks_b61_split_buttons" USING btree ("link_document_id");
  CREATE INDEX "_programs_v_blocks_b61_split_images_order_idx" ON "_programs_v_blocks_b61_split_images" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_b61_split_images_parent_id_idx" ON "_programs_v_blocks_b61_split_images" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_b61_split_images_image_idx" ON "_programs_v_blocks_b61_split_images" USING btree ("image_id");
  CREATE INDEX "_programs_v_blocks_b61_split_order_idx" ON "_programs_v_blocks_b61_split" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_b61_split_parent_id_idx" ON "_programs_v_blocks_b61_split" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_b61_split_path_idx" ON "_programs_v_blocks_b61_split" USING btree ("_path");
  CREATE INDEX "_programs_v_blocks_b61_split_image_idx" ON "_programs_v_blocks_b61_split" USING btree ("image_id");
  CREATE INDEX "_programs_v_blocks_b61_split_badge_idx" ON "_programs_v_blocks_b61_split" USING btree ("badge_id");
  CREATE INDEX "_programs_v_blocks_b61_prose_subheads_order_idx" ON "_programs_v_blocks_b61_prose_subheads" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_b61_prose_subheads_parent_id_idx" ON "_programs_v_blocks_b61_prose_subheads" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_b61_prose_buttons_order_idx" ON "_programs_v_blocks_b61_prose_buttons" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_b61_prose_buttons_parent_id_idx" ON "_programs_v_blocks_b61_prose_buttons" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_b61_prose_buttons_link_link_page_idx" ON "_programs_v_blocks_b61_prose_buttons" USING btree ("link_page_id");
  CREATE INDEX "_programs_v_blocks_b61_prose_buttons_link_link_document_idx" ON "_programs_v_blocks_b61_prose_buttons" USING btree ("link_document_id");
  CREATE INDEX "_programs_v_blocks_b61_prose_order_idx" ON "_programs_v_blocks_b61_prose" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_b61_prose_parent_id_idx" ON "_programs_v_blocks_b61_prose" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_b61_prose_path_idx" ON "_programs_v_blocks_b61_prose" USING btree ("_path");
  CREATE INDEX "_programs_v_blocks_b61_card_grid_cards_order_idx" ON "_programs_v_blocks_b61_card_grid_cards" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_b61_card_grid_cards_parent_id_idx" ON "_programs_v_blocks_b61_card_grid_cards" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_b61_card_grid_cards_image_idx" ON "_programs_v_blocks_b61_card_grid_cards" USING btree ("image_id");
  CREATE INDEX "_programs_v_blocks_b61_card_grid_cards_icon_image_idx" ON "_programs_v_blocks_b61_card_grid_cards" USING btree ("icon_image_id");
  CREATE INDEX "_programs_v_blocks_b61_card_grid_cards_link_link_page_idx" ON "_programs_v_blocks_b61_card_grid_cards" USING btree ("link_page_id");
  CREATE INDEX "_programs_v_blocks_b61_card_grid_cards_link_link_documen_idx" ON "_programs_v_blocks_b61_card_grid_cards" USING btree ("link_document_id");
  CREATE INDEX "_programs_v_blocks_b61_card_grid_buttons_order_idx" ON "_programs_v_blocks_b61_card_grid_buttons" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_b61_card_grid_buttons_parent_id_idx" ON "_programs_v_blocks_b61_card_grid_buttons" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_b61_card_grid_buttons_link_link_page_idx" ON "_programs_v_blocks_b61_card_grid_buttons" USING btree ("link_page_id");
  CREATE INDEX "_programs_v_blocks_b61_card_grid_buttons_link_link_docum_idx" ON "_programs_v_blocks_b61_card_grid_buttons" USING btree ("link_document_id");
  CREATE INDEX "_programs_v_blocks_b61_card_grid_order_idx" ON "_programs_v_blocks_b61_card_grid" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_b61_card_grid_parent_id_idx" ON "_programs_v_blocks_b61_card_grid" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_b61_card_grid_path_idx" ON "_programs_v_blocks_b61_card_grid" USING btree ("_path");
  CREATE INDEX "_programs_v_blocks_b61_stats_band_stats_order_idx" ON "_programs_v_blocks_b61_stats_band_stats" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_b61_stats_band_stats_parent_id_idx" ON "_programs_v_blocks_b61_stats_band_stats" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_b61_stats_band_buttons_order_idx" ON "_programs_v_blocks_b61_stats_band_buttons" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_b61_stats_band_buttons_parent_id_idx" ON "_programs_v_blocks_b61_stats_band_buttons" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_b61_stats_band_buttons_link_link_page_idx" ON "_programs_v_blocks_b61_stats_band_buttons" USING btree ("link_page_id");
  CREATE INDEX "_programs_v_blocks_b61_stats_band_buttons_link_link_docu_idx" ON "_programs_v_blocks_b61_stats_band_buttons" USING btree ("link_document_id");
  CREATE INDEX "_programs_v_blocks_b61_stats_band_order_idx" ON "_programs_v_blocks_b61_stats_band" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_b61_stats_band_parent_id_idx" ON "_programs_v_blocks_b61_stats_band" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_b61_stats_band_path_idx" ON "_programs_v_blocks_b61_stats_band" USING btree ("_path");
  CREATE INDEX "_programs_v_blocks_b61_gallery_images_order_idx" ON "_programs_v_blocks_b61_gallery_images" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_b61_gallery_images_parent_id_idx" ON "_programs_v_blocks_b61_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_b61_gallery_images_image_idx" ON "_programs_v_blocks_b61_gallery_images" USING btree ("image_id");
  CREATE INDEX "_programs_v_blocks_b61_gallery_buttons_order_idx" ON "_programs_v_blocks_b61_gallery_buttons" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_b61_gallery_buttons_parent_id_idx" ON "_programs_v_blocks_b61_gallery_buttons" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_b61_gallery_buttons_link_link_page_idx" ON "_programs_v_blocks_b61_gallery_buttons" USING btree ("link_page_id");
  CREATE INDEX "_programs_v_blocks_b61_gallery_buttons_link_link_documen_idx" ON "_programs_v_blocks_b61_gallery_buttons" USING btree ("link_document_id");
  CREATE INDEX "_programs_v_blocks_b61_gallery_order_idx" ON "_programs_v_blocks_b61_gallery" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_b61_gallery_parent_id_idx" ON "_programs_v_blocks_b61_gallery" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_b61_gallery_path_idx" ON "_programs_v_blocks_b61_gallery" USING btree ("_path");
  CREATE INDEX "_programs_v_blocks_b61_gallery_image_idx" ON "_programs_v_blocks_b61_gallery" USING btree ("image_id");
  CREATE INDEX "_programs_v_blocks_b61_testimonial_order_idx" ON "_programs_v_blocks_b61_testimonial" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_b61_testimonial_parent_id_idx" ON "_programs_v_blocks_b61_testimonial" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_b61_testimonial_path_idx" ON "_programs_v_blocks_b61_testimonial" USING btree ("_path");
  CREATE INDEX "_programs_v_blocks_b61_testimonial_watermark_idx" ON "_programs_v_blocks_b61_testimonial" USING btree ("watermark_id");
  CREATE INDEX "_programs_v_blocks_b61_accordion_items_order_idx" ON "_programs_v_blocks_b61_accordion_items" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_b61_accordion_items_parent_id_idx" ON "_programs_v_blocks_b61_accordion_items" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_b61_accordion_buttons_order_idx" ON "_programs_v_blocks_b61_accordion_buttons" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_b61_accordion_buttons_parent_id_idx" ON "_programs_v_blocks_b61_accordion_buttons" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_b61_accordion_buttons_link_link_page_idx" ON "_programs_v_blocks_b61_accordion_buttons" USING btree ("link_page_id");
  CREATE INDEX "_programs_v_blocks_b61_accordion_buttons_link_link_docum_idx" ON "_programs_v_blocks_b61_accordion_buttons" USING btree ("link_document_id");
  CREATE INDEX "_programs_v_blocks_b61_accordion_order_idx" ON "_programs_v_blocks_b61_accordion" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_b61_accordion_parent_id_idx" ON "_programs_v_blocks_b61_accordion" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_b61_accordion_path_idx" ON "_programs_v_blocks_b61_accordion" USING btree ("_path");
  CREATE INDEX "_programs_v_blocks_b61_tabs_tabs_order_idx" ON "_programs_v_blocks_b61_tabs_tabs" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_b61_tabs_tabs_parent_id_idx" ON "_programs_v_blocks_b61_tabs_tabs" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_b61_tabs_order_idx" ON "_programs_v_blocks_b61_tabs" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_b61_tabs_parent_id_idx" ON "_programs_v_blocks_b61_tabs" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_b61_tabs_path_idx" ON "_programs_v_blocks_b61_tabs" USING btree ("_path");
  CREATE INDEX "_programs_v_blocks_b61_pillars_items_order_idx" ON "_programs_v_blocks_b61_pillars_items" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_b61_pillars_items_parent_id_idx" ON "_programs_v_blocks_b61_pillars_items" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_b61_pillars_items_image_idx" ON "_programs_v_blocks_b61_pillars_items" USING btree ("image_id");
  CREATE INDEX "_programs_v_blocks_b61_pillars_order_idx" ON "_programs_v_blocks_b61_pillars" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_b61_pillars_parent_id_idx" ON "_programs_v_blocks_b61_pillars" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_b61_pillars_path_idx" ON "_programs_v_blocks_b61_pillars" USING btree ("_path");
  CREATE INDEX "_programs_v_blocks_b61_carousel_slides_order_idx" ON "_programs_v_blocks_b61_carousel_slides" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_b61_carousel_slides_parent_id_idx" ON "_programs_v_blocks_b61_carousel_slides" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_b61_carousel_order_idx" ON "_programs_v_blocks_b61_carousel" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_b61_carousel_parent_id_idx" ON "_programs_v_blocks_b61_carousel" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_b61_carousel_path_idx" ON "_programs_v_blocks_b61_carousel" USING btree ("_path");
  CREATE INDEX "_programs_v_blocks_b61_framed_image_order_idx" ON "_programs_v_blocks_b61_framed_image" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_b61_framed_image_parent_id_idx" ON "_programs_v_blocks_b61_framed_image" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_b61_framed_image_path_idx" ON "_programs_v_blocks_b61_framed_image" USING btree ("_path");
  CREATE INDEX "_programs_v_blocks_b61_framed_image_image_idx" ON "_programs_v_blocks_b61_framed_image" USING btree ("image_id");
  CREATE INDEX "_programs_v_blocks_b61_cta_subheads_order_idx" ON "_programs_v_blocks_b61_cta_subheads" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_b61_cta_subheads_parent_id_idx" ON "_programs_v_blocks_b61_cta_subheads" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_b61_cta_buttons_order_idx" ON "_programs_v_blocks_b61_cta_buttons" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_b61_cta_buttons_parent_id_idx" ON "_programs_v_blocks_b61_cta_buttons" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_b61_cta_buttons_link_link_page_idx" ON "_programs_v_blocks_b61_cta_buttons" USING btree ("link_page_id");
  CREATE INDEX "_programs_v_blocks_b61_cta_buttons_link_link_document_idx" ON "_programs_v_blocks_b61_cta_buttons" USING btree ("link_document_id");
  CREATE INDEX "_programs_v_blocks_b61_cta_order_idx" ON "_programs_v_blocks_b61_cta" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_b61_cta_parent_id_idx" ON "_programs_v_blocks_b61_cta" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_b61_cta_path_idx" ON "_programs_v_blocks_b61_cta" USING btree ("_path");
  CREATE INDEX "_programs_v_blocks_b61_cta_image_idx" ON "_programs_v_blocks_b61_cta" USING btree ("image_id");
  CREATE INDEX "_programs_v_blocks_b61_form_subheads_order_idx" ON "_programs_v_blocks_b61_form_subheads" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_b61_form_subheads_parent_id_idx" ON "_programs_v_blocks_b61_form_subheads" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_b61_form_order_idx" ON "_programs_v_blocks_b61_form" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_b61_form_parent_id_idx" ON "_programs_v_blocks_b61_form" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_b61_form_path_idx" ON "_programs_v_blocks_b61_form" USING btree ("_path");
  CREATE INDEX "_programs_v_blocks_b61_form_form_idx" ON "_programs_v_blocks_b61_form" USING btree ("form_id");
  CREATE INDEX "_programs_v_blocks_b61_button_bar_order_idx" ON "_programs_v_blocks_b61_button_bar" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_b61_button_bar_parent_id_idx" ON "_programs_v_blocks_b61_button_bar" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_b61_button_bar_path_idx" ON "_programs_v_blocks_b61_button_bar" USING btree ("_path");
  CREATE INDEX "_programs_v_blocks_b61_button_bar_first_link_first_link__idx" ON "_programs_v_blocks_b61_button_bar" USING btree ("first_link_page_id");
  CREATE INDEX "_programs_v_blocks_b61_button_bar_first_link_first_lin_1_idx" ON "_programs_v_blocks_b61_button_bar" USING btree ("first_link_document_id");
  CREATE INDEX "_programs_v_blocks_b61_button_bar_second_link_second_lin_idx" ON "_programs_v_blocks_b61_button_bar" USING btree ("second_link_page_id");
  CREATE INDEX "_programs_v_blocks_b61_button_bar_second_link_second_l_1_idx" ON "_programs_v_blocks_b61_button_bar" USING btree ("second_link_document_id");
  CREATE INDEX "_programs_v_blocks_b61_divider_order_idx" ON "_programs_v_blocks_b61_divider" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_b61_divider_parent_id_idx" ON "_programs_v_blocks_b61_divider" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_b61_divider_path_idx" ON "_programs_v_blocks_b61_divider" USING btree ("_path");
  CREATE INDEX "_programs_v_blocks_b61_divider_ornament_idx" ON "_programs_v_blocks_b61_divider" USING btree ("ornament_id");
  CREATE INDEX "_programs_v_blocks_b61_logos_subheads_order_idx" ON "_programs_v_blocks_b61_logos_subheads" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_b61_logos_subheads_parent_id_idx" ON "_programs_v_blocks_b61_logos_subheads" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_b61_logos_logos_order_idx" ON "_programs_v_blocks_b61_logos_logos" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_b61_logos_logos_parent_id_idx" ON "_programs_v_blocks_b61_logos_logos" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_b61_logos_logos_image_idx" ON "_programs_v_blocks_b61_logos_logos" USING btree ("image_id");
  CREATE INDEX "_programs_v_blocks_b61_logos_logos_link_link_page_idx" ON "_programs_v_blocks_b61_logos_logos" USING btree ("link_page_id");
  CREATE INDEX "_programs_v_blocks_b61_logos_logos_link_link_document_idx" ON "_programs_v_blocks_b61_logos_logos" USING btree ("link_document_id");
  CREATE INDEX "_programs_v_blocks_b61_logos_order_idx" ON "_programs_v_blocks_b61_logos" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_b61_logos_parent_id_idx" ON "_programs_v_blocks_b61_logos" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_b61_logos_path_idx" ON "_programs_v_blocks_b61_logos" USING btree ("_path");
  CREATE INDEX "_programs_v_blocks_b61_rail_buttons_order_idx" ON "_programs_v_blocks_b61_rail_buttons" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_b61_rail_buttons_parent_id_idx" ON "_programs_v_blocks_b61_rail_buttons" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_b61_rail_buttons_link_link_page_idx" ON "_programs_v_blocks_b61_rail_buttons" USING btree ("link_page_id");
  CREATE INDEX "_programs_v_blocks_b61_rail_buttons_link_link_document_idx" ON "_programs_v_blocks_b61_rail_buttons" USING btree ("link_document_id");
  CREATE INDEX "_programs_v_blocks_b61_rail_links_order_idx" ON "_programs_v_blocks_b61_rail_links" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_b61_rail_links_parent_id_idx" ON "_programs_v_blocks_b61_rail_links" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_b61_rail_links_icon_image_idx" ON "_programs_v_blocks_b61_rail_links" USING btree ("icon_image_id");
  CREATE INDEX "_programs_v_blocks_b61_rail_links_link_link_page_idx" ON "_programs_v_blocks_b61_rail_links" USING btree ("link_page_id");
  CREATE INDEX "_programs_v_blocks_b61_rail_links_link_link_document_idx" ON "_programs_v_blocks_b61_rail_links" USING btree ("link_document_id");
  CREATE INDEX "_programs_v_blocks_b61_rail_order_idx" ON "_programs_v_blocks_b61_rail" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_b61_rail_parent_id_idx" ON "_programs_v_blocks_b61_rail" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_b61_rail_path_idx" ON "_programs_v_blocks_b61_rail" USING btree ("_path");
  CREATE INDEX "_programs_v_blocks_b61_section_order_idx" ON "_programs_v_blocks_b61_section" USING btree ("_order");
  CREATE INDEX "_programs_v_blocks_b61_section_parent_id_idx" ON "_programs_v_blocks_b61_section" USING btree ("_parent_id");
  CREATE INDEX "_programs_v_blocks_b61_section_path_idx" ON "_programs_v_blocks_b61_section" USING btree ("_path");
  CREATE INDEX "_programs_v_blocks_b61_section_image_idx" ON "_programs_v_blocks_b61_section" USING btree ("image_id");
  CREATE INDEX "_programs_v_blocks_b61_section_pattern_image_idx" ON "_programs_v_blocks_b61_section" USING btree ("pattern_image_id");
  CREATE INDEX "_programs_v_blocks_b61_section_watermark_image_idx" ON "_programs_v_blocks_b61_section" USING btree ("watermark_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "programs_blocks_b61_hero_buttons" CASCADE;
  DROP TABLE "programs_blocks_b61_hero_slides" CASCADE;
  DROP TABLE "programs_blocks_b61_hero_collage" CASCADE;
  DROP TABLE "programs_blocks_b61_hero" CASCADE;
  DROP TABLE "programs_blocks_b61_split_subheads" CASCADE;
  DROP TABLE "programs_blocks_b61_split_buttons" CASCADE;
  DROP TABLE "programs_blocks_b61_split_images" CASCADE;
  DROP TABLE "programs_blocks_b61_split" CASCADE;
  DROP TABLE "programs_blocks_b61_prose_subheads" CASCADE;
  DROP TABLE "programs_blocks_b61_prose_buttons" CASCADE;
  DROP TABLE "programs_blocks_b61_prose" CASCADE;
  DROP TABLE "programs_blocks_b61_card_grid_cards" CASCADE;
  DROP TABLE "programs_blocks_b61_card_grid_buttons" CASCADE;
  DROP TABLE "programs_blocks_b61_card_grid" CASCADE;
  DROP TABLE "programs_blocks_b61_stats_band_stats" CASCADE;
  DROP TABLE "programs_blocks_b61_stats_band_buttons" CASCADE;
  DROP TABLE "programs_blocks_b61_stats_band" CASCADE;
  DROP TABLE "programs_blocks_b61_gallery_images" CASCADE;
  DROP TABLE "programs_blocks_b61_gallery_buttons" CASCADE;
  DROP TABLE "programs_blocks_b61_gallery" CASCADE;
  DROP TABLE "programs_blocks_b61_testimonial" CASCADE;
  DROP TABLE "programs_blocks_b61_accordion_items" CASCADE;
  DROP TABLE "programs_blocks_b61_accordion_buttons" CASCADE;
  DROP TABLE "programs_blocks_b61_accordion" CASCADE;
  DROP TABLE "programs_blocks_b61_tabs_tabs" CASCADE;
  DROP TABLE "programs_blocks_b61_tabs" CASCADE;
  DROP TABLE "programs_blocks_b61_pillars_items" CASCADE;
  DROP TABLE "programs_blocks_b61_pillars" CASCADE;
  DROP TABLE "programs_blocks_b61_carousel_slides" CASCADE;
  DROP TABLE "programs_blocks_b61_carousel" CASCADE;
  DROP TABLE "programs_blocks_b61_framed_image" CASCADE;
  DROP TABLE "programs_blocks_b61_cta_subheads" CASCADE;
  DROP TABLE "programs_blocks_b61_cta_buttons" CASCADE;
  DROP TABLE "programs_blocks_b61_cta" CASCADE;
  DROP TABLE "programs_blocks_b61_form_subheads" CASCADE;
  DROP TABLE "programs_blocks_b61_form" CASCADE;
  DROP TABLE "programs_blocks_b61_button_bar" CASCADE;
  DROP TABLE "programs_blocks_b61_divider" CASCADE;
  DROP TABLE "programs_blocks_b61_logos_subheads" CASCADE;
  DROP TABLE "programs_blocks_b61_logos_logos" CASCADE;
  DROP TABLE "programs_blocks_b61_logos" CASCADE;
  DROP TABLE "programs_blocks_b61_rail_buttons" CASCADE;
  DROP TABLE "programs_blocks_b61_rail_links" CASCADE;
  DROP TABLE "programs_blocks_b61_rail" CASCADE;
  DROP TABLE "programs_blocks_b61_section" CASCADE;
  DROP TABLE "_programs_v_blocks_b61_hero_buttons" CASCADE;
  DROP TABLE "_programs_v_blocks_b61_hero_slides" CASCADE;
  DROP TABLE "_programs_v_blocks_b61_hero_collage" CASCADE;
  DROP TABLE "_programs_v_blocks_b61_hero" CASCADE;
  DROP TABLE "_programs_v_blocks_b61_split_subheads" CASCADE;
  DROP TABLE "_programs_v_blocks_b61_split_buttons" CASCADE;
  DROP TABLE "_programs_v_blocks_b61_split_images" CASCADE;
  DROP TABLE "_programs_v_blocks_b61_split" CASCADE;
  DROP TABLE "_programs_v_blocks_b61_prose_subheads" CASCADE;
  DROP TABLE "_programs_v_blocks_b61_prose_buttons" CASCADE;
  DROP TABLE "_programs_v_blocks_b61_prose" CASCADE;
  DROP TABLE "_programs_v_blocks_b61_card_grid_cards" CASCADE;
  DROP TABLE "_programs_v_blocks_b61_card_grid_buttons" CASCADE;
  DROP TABLE "_programs_v_blocks_b61_card_grid" CASCADE;
  DROP TABLE "_programs_v_blocks_b61_stats_band_stats" CASCADE;
  DROP TABLE "_programs_v_blocks_b61_stats_band_buttons" CASCADE;
  DROP TABLE "_programs_v_blocks_b61_stats_band" CASCADE;
  DROP TABLE "_programs_v_blocks_b61_gallery_images" CASCADE;
  DROP TABLE "_programs_v_blocks_b61_gallery_buttons" CASCADE;
  DROP TABLE "_programs_v_blocks_b61_gallery" CASCADE;
  DROP TABLE "_programs_v_blocks_b61_testimonial" CASCADE;
  DROP TABLE "_programs_v_blocks_b61_accordion_items" CASCADE;
  DROP TABLE "_programs_v_blocks_b61_accordion_buttons" CASCADE;
  DROP TABLE "_programs_v_blocks_b61_accordion" CASCADE;
  DROP TABLE "_programs_v_blocks_b61_tabs_tabs" CASCADE;
  DROP TABLE "_programs_v_blocks_b61_tabs" CASCADE;
  DROP TABLE "_programs_v_blocks_b61_pillars_items" CASCADE;
  DROP TABLE "_programs_v_blocks_b61_pillars" CASCADE;
  DROP TABLE "_programs_v_blocks_b61_carousel_slides" CASCADE;
  DROP TABLE "_programs_v_blocks_b61_carousel" CASCADE;
  DROP TABLE "_programs_v_blocks_b61_framed_image" CASCADE;
  DROP TABLE "_programs_v_blocks_b61_cta_subheads" CASCADE;
  DROP TABLE "_programs_v_blocks_b61_cta_buttons" CASCADE;
  DROP TABLE "_programs_v_blocks_b61_cta" CASCADE;
  DROP TABLE "_programs_v_blocks_b61_form_subheads" CASCADE;
  DROP TABLE "_programs_v_blocks_b61_form" CASCADE;
  DROP TABLE "_programs_v_blocks_b61_button_bar" CASCADE;
  DROP TABLE "_programs_v_blocks_b61_divider" CASCADE;
  DROP TABLE "_programs_v_blocks_b61_logos_subheads" CASCADE;
  DROP TABLE "_programs_v_blocks_b61_logos_logos" CASCADE;
  DROP TABLE "_programs_v_blocks_b61_logos" CASCADE;
  DROP TABLE "_programs_v_blocks_b61_rail_buttons" CASCADE;
  DROP TABLE "_programs_v_blocks_b61_rail_links" CASCADE;
  DROP TABLE "_programs_v_blocks_b61_rail" CASCADE;
  DROP TABLE "_programs_v_blocks_b61_section" CASCADE;
  DROP TYPE "public"."enum_programs_blocks_b61_hero_buttons_variant";
  DROP TYPE "public"."enum_programs_blocks_b61_hero_buttons_action";
  DROP TYPE "public"."enum_programs_blocks_b61_hero_buttons_link_type";
  DROP TYPE "public"."enum_programs_blocks_b61_hero_layout_mode";
  DROP TYPE "public"."enum_programs_blocks_b61_hero_heading_level";
  DROP TYPE "public"."enum_programs_blocks_b61_hero_background_type";
  DROP TYPE "public"."enum_programs_blocks_b61_hero_height";
  DROP TYPE "public"."enum_programs_blocks_b61_hero_band_size";
  DROP TYPE "public"."enum_programs_blocks_b61_hero_split_side";
  DROP TYPE "public"."enum_programs_blocks_b61_hero_vertical_position";
  DROP TYPE "public"."enum_programs_blocks_b61_hero_text_align";
  DROP TYPE "public"."enum_programs_blocks_b61_hero_pad_top";
  DROP TYPE "public"."enum_programs_blocks_b61_hero_pad_bottom";
  DROP TYPE "public"."enum_programs_blocks_b61_hero_overlay";
  DROP TYPE "public"."enum_programs_blocks_b61_hero_surface";
  DROP TYPE "public"."enum_programs_blocks_b61_hero_eyebrow_rule";
  DROP TYPE "public"."enum_programs_blocks_b61_hero_entrance";
  DROP TYPE "public"."enum_programs_blocks_b61_split_buttons_variant";
  DROP TYPE "public"."enum_programs_blocks_b61_split_buttons_action";
  DROP TYPE "public"."enum_programs_blocks_b61_split_buttons_link_type";
  DROP TYPE "public"."enum_programs_blocks_b61_split_heading_level";
  DROP TYPE "public"."enum_programs_blocks_b61_split_media";
  DROP TYPE "public"."enum_programs_blocks_b61_split_gallery_layout";
  DROP TYPE "public"."enum_programs_blocks_b61_split_image_shape";
  DROP TYPE "public"."enum_programs_blocks_b61_split_image_side";
  DROP TYPE "public"."enum_programs_blocks_b61_split_vertical_position";
  DROP TYPE "public"."enum_programs_blocks_b61_split_stack_order";
  DROP TYPE "public"."enum_programs_blocks_b61_split_column_height";
  DROP TYPE "public"."enum_programs_blocks_b61_split_heading_align";
  DROP TYPE "public"."enum_programs_blocks_b61_split_pad_top";
  DROP TYPE "public"."enum_programs_blocks_b61_split_pad_bottom";
  DROP TYPE "public"."enum_programs_blocks_b61_split_surface";
  DROP TYPE "public"."enum_programs_blocks_b61_split_text_panel";
  DROP TYPE "public"."enum_programs_blocks_b61_split_frame_color";
  DROP TYPE "public"."enum_programs_blocks_b61_split_eyebrow_rule";
  DROP TYPE "public"."enum_programs_blocks_b61_split_entrance";
  DROP TYPE "public"."enum_programs_blocks_b61_prose_buttons_variant";
  DROP TYPE "public"."enum_programs_blocks_b61_prose_buttons_action";
  DROP TYPE "public"."enum_programs_blocks_b61_prose_buttons_link_type";
  DROP TYPE "public"."enum_programs_blocks_b61_prose_heading_level";
  DROP TYPE "public"."enum_programs_blocks_b61_prose_head_position";
  DROP TYPE "public"."enum_programs_blocks_b61_prose_text_align";
  DROP TYPE "public"."enum_programs_blocks_b61_prose_position";
  DROP TYPE "public"."enum_programs_blocks_b61_prose_heading_width";
  DROP TYPE "public"."enum_programs_blocks_b61_prose_pad_top";
  DROP TYPE "public"."enum_programs_blocks_b61_prose_pad_bottom";
  DROP TYPE "public"."enum_programs_blocks_b61_prose_iconlist_style";
  DROP TYPE "public"."enum_programs_blocks_b61_prose_surface";
  DROP TYPE "public"."enum_programs_blocks_b61_prose_eyebrow_rule";
  DROP TYPE "public"."enum_programs_blocks_b61_prose_heading_rule";
  DROP TYPE "public"."enum_programs_blocks_b61_prose_entrance";
  DROP TYPE "public"."enum_programs_blocks_b61_card_grid_cards_icon";
  DROP TYPE "public"."enum_programs_blocks_b61_card_grid_cards_link_type";
  DROP TYPE "public"."enum_programs_blocks_b61_card_grid_buttons_variant";
  DROP TYPE "public"."enum_programs_blocks_b61_card_grid_buttons_action";
  DROP TYPE "public"."enum_programs_blocks_b61_card_grid_buttons_link_type";
  DROP TYPE "public"."enum_programs_blocks_b61_card_grid_card_text";
  DROP TYPE "public"."enum_programs_blocks_b61_card_grid_heading_level";
  DROP TYPE "public"."enum_programs_blocks_b61_card_grid_source";
  DROP TYPE "public"."enum_programs_blocks_b61_card_grid_media_type";
  DROP TYPE "public"."enum_programs_blocks_b61_card_grid_arrangement";
  DROP TYPE "public"."enum_programs_blocks_b61_card_grid_columns";
  DROP TYPE "public"."enum_programs_blocks_b61_card_grid_text_align";
  DROP TYPE "public"."enum_programs_blocks_b61_card_grid_advance";
  DROP TYPE "public"."enum_programs_blocks_b61_card_grid_controls_position";
  DROP TYPE "public"."enum_programs_blocks_b61_card_grid_pad_top";
  DROP TYPE "public"."enum_programs_blocks_b61_card_grid_pad_bottom";
  DROP TYPE "public"."enum_programs_blocks_b61_card_grid_card_style";
  DROP TYPE "public"."enum_programs_blocks_b61_card_grid_card_shape";
  DROP TYPE "public"."enum_programs_blocks_b61_card_grid_image_shape";
  DROP TYPE "public"."enum_programs_blocks_b61_card_grid_card_text_position";
  DROP TYPE "public"."enum_programs_blocks_b61_card_grid_icon_size";
  DROP TYPE "public"."enum_programs_blocks_b61_card_grid_surface";
  DROP TYPE "public"."enum_programs_blocks_b61_card_grid_card_surface";
  DROP TYPE "public"."enum_programs_blocks_b61_card_grid_card_overlay";
  DROP TYPE "public"."enum_programs_blocks_b61_card_grid_eyebrow_rule";
  DROP TYPE "public"."enum_programs_blocks_b61_card_grid_entrance";
  DROP TYPE "public"."enum_programs_blocks_b61_stats_band_buttons_variant";
  DROP TYPE "public"."enum_programs_blocks_b61_stats_band_buttons_action";
  DROP TYPE "public"."enum_programs_blocks_b61_stats_band_buttons_link_type";
  DROP TYPE "public"."enum_programs_blocks_b61_stats_band_heading_level";
  DROP TYPE "public"."enum_programs_blocks_b61_stats_band_columns";
  DROP TYPE "public"."enum_programs_blocks_b61_stats_band_label_position";
  DROP TYPE "public"."enum_programs_blocks_b61_stats_band_text_align";
  DROP TYPE "public"."enum_programs_blocks_b61_stats_band_pad_top";
  DROP TYPE "public"."enum_programs_blocks_b61_stats_band_pad_bottom";
  DROP TYPE "public"."enum_programs_blocks_b61_stats_band_item_style";
  DROP TYPE "public"."enum_programs_blocks_b61_stats_band_figure_scale";
  DROP TYPE "public"."enum_programs_blocks_b61_stats_band_surface";
  DROP TYPE "public"."enum_programs_blocks_b61_stats_band_item_surface";
  DROP TYPE "public"."enum_programs_blocks_b61_stats_band_eyebrow_rule";
  DROP TYPE "public"."enum_programs_blocks_b61_stats_band_entrance";
  DROP TYPE "public"."enum_programs_blocks_b61_stats_band_band_width";
  DROP TYPE "public"."enum_programs_blocks_b61_gallery_buttons_variant";
  DROP TYPE "public"."enum_programs_blocks_b61_gallery_buttons_action";
  DROP TYPE "public"."enum_programs_blocks_b61_gallery_buttons_link_type";
  DROP TYPE "public"."enum_programs_blocks_b61_gallery_heading_level";
  DROP TYPE "public"."enum_programs_blocks_b61_gallery_media";
  DROP TYPE "public"."enum_programs_blocks_b61_gallery_gallery_layout";
  DROP TYPE "public"."enum_programs_blocks_b61_gallery_text_position";
  DROP TYPE "public"."enum_programs_blocks_b61_gallery_heading_align";
  DROP TYPE "public"."enum_programs_blocks_b61_gallery_pad_top";
  DROP TYPE "public"."enum_programs_blocks_b61_gallery_pad_bottom";
  DROP TYPE "public"."enum_programs_blocks_b61_gallery_item_size";
  DROP TYPE "public"."enum_programs_blocks_b61_gallery_columns";
  DROP TYPE "public"."enum_programs_blocks_b61_gallery_image_shape";
  DROP TYPE "public"."enum_programs_blocks_b61_gallery_surface";
  DROP TYPE "public"."enum_programs_blocks_b61_gallery_eyebrow_rule";
  DROP TYPE "public"."enum_programs_blocks_b61_gallery_entrance";
  DROP TYPE "public"."enum_programs_blocks_b61_testimonial_text_align";
  DROP TYPE "public"."enum_programs_blocks_b61_testimonial_text_style";
  DROP TYPE "public"."enum_programs_blocks_b61_testimonial_pad_top";
  DROP TYPE "public"."enum_programs_blocks_b61_testimonial_pad_bottom";
  DROP TYPE "public"."enum_programs_blocks_b61_testimonial_surface";
  DROP TYPE "public"."enum_programs_blocks_b61_testimonial_eyebrow_rule";
  DROP TYPE "public"."enum_programs_blocks_b61_testimonial_entrance";
  DROP TYPE "public"."enum_programs_blocks_b61_accordion_buttons_variant";
  DROP TYPE "public"."enum_programs_blocks_b61_accordion_buttons_action";
  DROP TYPE "public"."enum_programs_blocks_b61_accordion_buttons_link_type";
  DROP TYPE "public"."enum_programs_blocks_b61_accordion_heading_level";
  DROP TYPE "public"."enum_programs_blocks_b61_accordion_heading_align";
  DROP TYPE "public"."enum_programs_blocks_b61_accordion_pad_top";
  DROP TYPE "public"."enum_programs_blocks_b61_accordion_pad_bottom";
  DROP TYPE "public"."enum_programs_blocks_b61_accordion_item_style";
  DROP TYPE "public"."enum_programs_blocks_b61_accordion_icon_style";
  DROP TYPE "public"."enum_programs_blocks_b61_accordion_surface";
  DROP TYPE "public"."enum_programs_blocks_b61_accordion_item_surface";
  DROP TYPE "public"."enum_programs_blocks_b61_accordion_eyebrow_rule";
  DROP TYPE "public"."enum_programs_blocks_b61_accordion_entrance";
  DROP TYPE "public"."enum_programs_blocks_b61_tabs_heading_level";
  DROP TYPE "public"."enum_programs_blocks_b61_tabs_tab_position";
  DROP TYPE "public"."enum_programs_blocks_b61_tabs_tab_align";
  DROP TYPE "public"."enum_programs_blocks_b61_tabs_heading_align";
  DROP TYPE "public"."enum_programs_blocks_b61_tabs_pad_top";
  DROP TYPE "public"."enum_programs_blocks_b61_tabs_pad_bottom";
  DROP TYPE "public"."enum_programs_blocks_b61_tabs_surface";
  DROP TYPE "public"."enum_programs_blocks_b61_tabs_eyebrow_rule";
  DROP TYPE "public"."enum_programs_blocks_b61_tabs_entrance";
  DROP TYPE "public"."enum_programs_blocks_b61_pillars_heading_level";
  DROP TYPE "public"."enum_programs_blocks_b61_pillars_tab_position";
  DROP TYPE "public"."enum_programs_blocks_b61_pillars_tab_align";
  DROP TYPE "public"."enum_programs_blocks_b61_pillars_heading_align";
  DROP TYPE "public"."enum_programs_blocks_b61_pillars_pad_top";
  DROP TYPE "public"."enum_programs_blocks_b61_pillars_pad_bottom";
  DROP TYPE "public"."enum_programs_blocks_b61_pillars_surface";
  DROP TYPE "public"."enum_programs_blocks_b61_pillars_eyebrow_rule";
  DROP TYPE "public"."enum_programs_blocks_b61_pillars_entrance";
  DROP TYPE "public"."enum_programs_blocks_b61_carousel_heading_level";
  DROP TYPE "public"."enum_programs_blocks_b61_carousel_per_view";
  DROP TYPE "public"."enum_programs_blocks_b61_carousel_heading_align";
  DROP TYPE "public"."enum_programs_blocks_b61_carousel_advance";
  DROP TYPE "public"."enum_programs_blocks_b61_carousel_controls_position";
  DROP TYPE "public"."enum_programs_blocks_b61_carousel_pad_top";
  DROP TYPE "public"."enum_programs_blocks_b61_carousel_pad_bottom";
  DROP TYPE "public"."enum_programs_blocks_b61_carousel_surface";
  DROP TYPE "public"."enum_programs_blocks_b61_carousel_eyebrow_rule";
  DROP TYPE "public"."enum_programs_blocks_b61_carousel_entrance";
  DROP TYPE "public"."enum_programs_blocks_b61_framed_image_image_shape";
  DROP TYPE "public"."enum_programs_blocks_b61_framed_image_image_height";
  DROP TYPE "public"."enum_programs_blocks_b61_framed_image_frame_color";
  DROP TYPE "public"."enum_programs_blocks_b61_framed_image_entrance";
  DROP TYPE "public"."enum_programs_blocks_b61_cta_buttons_variant";
  DROP TYPE "public"."enum_programs_blocks_b61_cta_buttons_action";
  DROP TYPE "public"."enum_programs_blocks_b61_cta_buttons_link_type";
  DROP TYPE "public"."enum_programs_blocks_b61_cta_heading_level";
  DROP TYPE "public"."enum_programs_blocks_b61_cta_text_align";
  DROP TYPE "public"."enum_programs_blocks_b61_cta_position";
  DROP TYPE "public"."enum_programs_blocks_b61_cta_pad_top";
  DROP TYPE "public"."enum_programs_blocks_b61_cta_pad_bottom";
  DROP TYPE "public"."enum_programs_blocks_b61_cta_surface";
  DROP TYPE "public"."enum_programs_blocks_b61_cta_text_panel";
  DROP TYPE "public"."enum_programs_blocks_b61_cta_eyebrow_rule";
  DROP TYPE "public"."enum_programs_blocks_b61_cta_entrance";
  DROP TYPE "public"."enum_programs_blocks_b61_form_heading_level";
  DROP TYPE "public"."enum_programs_blocks_b61_form_text_align";
  DROP TYPE "public"."enum_programs_blocks_b61_form_pad_top";
  DROP TYPE "public"."enum_programs_blocks_b61_form_pad_bottom";
  DROP TYPE "public"."enum_programs_blocks_b61_form_card";
  DROP TYPE "public"."enum_programs_blocks_b61_form_surface";
  DROP TYPE "public"."enum_programs_blocks_b61_form_eyebrow_rule";
  DROP TYPE "public"."enum_programs_blocks_b61_form_entrance";
  DROP TYPE "public"."enum_programs_blocks_b61_button_bar_first_link_type";
  DROP TYPE "public"."enum_programs_blocks_b61_button_bar_second_link_type";
  DROP TYPE "public"."enum_programs_blocks_b61_button_bar_size";
  DROP TYPE "public"."enum_programs_blocks_b61_button_bar_first_color";
  DROP TYPE "public"."enum_programs_blocks_b61_button_bar_second_color";
  DROP TYPE "public"."enum_programs_blocks_b61_button_bar_entrance";
  DROP TYPE "public"."enum_programs_blocks_b61_divider_line_style";
  DROP TYPE "public"."enum_programs_blocks_b61_divider_alignment";
  DROP TYPE "public"."enum_programs_blocks_b61_divider_weight";
  DROP TYPE "public"."enum_programs_blocks_b61_divider_line_color";
  DROP TYPE "public"."enum_programs_blocks_b61_divider_entrance";
  DROP TYPE "public"."enum_programs_blocks_b61_logos_logos_link_type";
  DROP TYPE "public"."enum_programs_blocks_b61_logos_heading_level";
  DROP TYPE "public"."enum_programs_blocks_b61_logos_motion";
  DROP TYPE "public"."enum_programs_blocks_b61_logos_heading_align";
  DROP TYPE "public"."enum_programs_blocks_b61_logos_pad_top";
  DROP TYPE "public"."enum_programs_blocks_b61_logos_pad_bottom";
  DROP TYPE "public"."enum_programs_blocks_b61_logos_surface";
  DROP TYPE "public"."enum_programs_blocks_b61_logos_eyebrow_rule";
  DROP TYPE "public"."enum_programs_blocks_b61_logos_entrance";
  DROP TYPE "public"."enum_programs_blocks_b61_rail_buttons_variant";
  DROP TYPE "public"."enum_programs_blocks_b61_rail_buttons_action";
  DROP TYPE "public"."enum_programs_blocks_b61_rail_buttons_link_type";
  DROP TYPE "public"."enum_programs_blocks_b61_rail_links_icon";
  DROP TYPE "public"."enum_programs_blocks_b61_rail_links_link_type";
  DROP TYPE "public"."enum_programs_blocks_b61_rail_actions_position";
  DROP TYPE "public"."enum_programs_blocks_b61_rail_surface";
  DROP TYPE "public"."enum_programs_blocks_b61_section_columns";
  DROP TYPE "public"."enum_programs_blocks_b61_section_rail_align";
  DROP TYPE "public"."enum_programs_blocks_b61_section_rail_stack";
  DROP TYPE "public"."enum_programs_blocks_b61_section_pad_top";
  DROP TYPE "public"."enum_programs_blocks_b61_section_pad_bottom";
  DROP TYPE "public"."enum_programs_blocks_b61_section_surface";
  DROP TYPE "public"."enum_programs_blocks_b61_section_entrance";
  DROP TYPE "public"."enum__programs_v_blocks_b61_hero_buttons_variant";
  DROP TYPE "public"."enum__programs_v_blocks_b61_hero_buttons_action";
  DROP TYPE "public"."enum__programs_v_blocks_b61_hero_buttons_link_type";
  DROP TYPE "public"."enum__programs_v_blocks_b61_hero_layout_mode";
  DROP TYPE "public"."enum__programs_v_blocks_b61_hero_heading_level";
  DROP TYPE "public"."enum__programs_v_blocks_b61_hero_background_type";
  DROP TYPE "public"."enum__programs_v_blocks_b61_hero_height";
  DROP TYPE "public"."enum__programs_v_blocks_b61_hero_band_size";
  DROP TYPE "public"."enum__programs_v_blocks_b61_hero_split_side";
  DROP TYPE "public"."enum__programs_v_blocks_b61_hero_vertical_position";
  DROP TYPE "public"."enum__programs_v_blocks_b61_hero_text_align";
  DROP TYPE "public"."enum__programs_v_blocks_b61_hero_pad_top";
  DROP TYPE "public"."enum__programs_v_blocks_b61_hero_pad_bottom";
  DROP TYPE "public"."enum__programs_v_blocks_b61_hero_overlay";
  DROP TYPE "public"."enum__programs_v_blocks_b61_hero_surface";
  DROP TYPE "public"."enum__programs_v_blocks_b61_hero_eyebrow_rule";
  DROP TYPE "public"."enum__programs_v_blocks_b61_hero_entrance";
  DROP TYPE "public"."enum__programs_v_blocks_b61_split_buttons_variant";
  DROP TYPE "public"."enum__programs_v_blocks_b61_split_buttons_action";
  DROP TYPE "public"."enum__programs_v_blocks_b61_split_buttons_link_type";
  DROP TYPE "public"."enum__programs_v_blocks_b61_split_heading_level";
  DROP TYPE "public"."enum__programs_v_blocks_b61_split_media";
  DROP TYPE "public"."enum__programs_v_blocks_b61_split_gallery_layout";
  DROP TYPE "public"."enum__programs_v_blocks_b61_split_image_shape";
  DROP TYPE "public"."enum__programs_v_blocks_b61_split_image_side";
  DROP TYPE "public"."enum__programs_v_blocks_b61_split_vertical_position";
  DROP TYPE "public"."enum__programs_v_blocks_b61_split_stack_order";
  DROP TYPE "public"."enum__programs_v_blocks_b61_split_column_height";
  DROP TYPE "public"."enum__programs_v_blocks_b61_split_heading_align";
  DROP TYPE "public"."enum__programs_v_blocks_b61_split_pad_top";
  DROP TYPE "public"."enum__programs_v_blocks_b61_split_pad_bottom";
  DROP TYPE "public"."enum__programs_v_blocks_b61_split_surface";
  DROP TYPE "public"."enum__programs_v_blocks_b61_split_text_panel";
  DROP TYPE "public"."enum__programs_v_blocks_b61_split_frame_color";
  DROP TYPE "public"."enum__programs_v_blocks_b61_split_eyebrow_rule";
  DROP TYPE "public"."enum__programs_v_blocks_b61_split_entrance";
  DROP TYPE "public"."enum__programs_v_blocks_b61_prose_buttons_variant";
  DROP TYPE "public"."enum__programs_v_blocks_b61_prose_buttons_action";
  DROP TYPE "public"."enum__programs_v_blocks_b61_prose_buttons_link_type";
  DROP TYPE "public"."enum__programs_v_blocks_b61_prose_heading_level";
  DROP TYPE "public"."enum__programs_v_blocks_b61_prose_head_position";
  DROP TYPE "public"."enum__programs_v_blocks_b61_prose_text_align";
  DROP TYPE "public"."enum__programs_v_blocks_b61_prose_position";
  DROP TYPE "public"."enum__programs_v_blocks_b61_prose_heading_width";
  DROP TYPE "public"."enum__programs_v_blocks_b61_prose_pad_top";
  DROP TYPE "public"."enum__programs_v_blocks_b61_prose_pad_bottom";
  DROP TYPE "public"."enum__programs_v_blocks_b61_prose_iconlist_style";
  DROP TYPE "public"."enum__programs_v_blocks_b61_prose_surface";
  DROP TYPE "public"."enum__programs_v_blocks_b61_prose_eyebrow_rule";
  DROP TYPE "public"."enum__programs_v_blocks_b61_prose_heading_rule";
  DROP TYPE "public"."enum__programs_v_blocks_b61_prose_entrance";
  DROP TYPE "public"."enum__programs_v_blocks_b61_card_grid_cards_icon";
  DROP TYPE "public"."enum__programs_v_blocks_b61_card_grid_cards_link_type";
  DROP TYPE "public"."enum__programs_v_blocks_b61_card_grid_buttons_variant";
  DROP TYPE "public"."enum__programs_v_blocks_b61_card_grid_buttons_action";
  DROP TYPE "public"."enum__programs_v_blocks_b61_card_grid_buttons_link_type";
  DROP TYPE "public"."enum__programs_v_blocks_b61_card_grid_card_text";
  DROP TYPE "public"."enum__programs_v_blocks_b61_card_grid_heading_level";
  DROP TYPE "public"."enum__programs_v_blocks_b61_card_grid_source";
  DROP TYPE "public"."enum__programs_v_blocks_b61_card_grid_media_type";
  DROP TYPE "public"."enum__programs_v_blocks_b61_card_grid_arrangement";
  DROP TYPE "public"."enum__programs_v_blocks_b61_card_grid_columns";
  DROP TYPE "public"."enum__programs_v_blocks_b61_card_grid_text_align";
  DROP TYPE "public"."enum__programs_v_blocks_b61_card_grid_advance";
  DROP TYPE "public"."enum__programs_v_blocks_b61_card_grid_controls_position";
  DROP TYPE "public"."enum__programs_v_blocks_b61_card_grid_pad_top";
  DROP TYPE "public"."enum__programs_v_blocks_b61_card_grid_pad_bottom";
  DROP TYPE "public"."enum__programs_v_blocks_b61_card_grid_card_style";
  DROP TYPE "public"."enum__programs_v_blocks_b61_card_grid_card_shape";
  DROP TYPE "public"."enum__programs_v_blocks_b61_card_grid_image_shape";
  DROP TYPE "public"."enum__programs_v_blocks_b61_card_grid_card_text_position";
  DROP TYPE "public"."enum__programs_v_blocks_b61_card_grid_icon_size";
  DROP TYPE "public"."enum__programs_v_blocks_b61_card_grid_surface";
  DROP TYPE "public"."enum__programs_v_blocks_b61_card_grid_card_surface";
  DROP TYPE "public"."enum__programs_v_blocks_b61_card_grid_card_overlay";
  DROP TYPE "public"."enum__programs_v_blocks_b61_card_grid_eyebrow_rule";
  DROP TYPE "public"."enum__programs_v_blocks_b61_card_grid_entrance";
  DROP TYPE "public"."enum__programs_v_blocks_b61_stats_band_buttons_variant";
  DROP TYPE "public"."enum__programs_v_blocks_b61_stats_band_buttons_action";
  DROP TYPE "public"."enum__programs_v_blocks_b61_stats_band_buttons_link_type";
  DROP TYPE "public"."enum__programs_v_blocks_b61_stats_band_heading_level";
  DROP TYPE "public"."enum__programs_v_blocks_b61_stats_band_columns";
  DROP TYPE "public"."enum__programs_v_blocks_b61_stats_band_label_position";
  DROP TYPE "public"."enum__programs_v_blocks_b61_stats_band_text_align";
  DROP TYPE "public"."enum__programs_v_blocks_b61_stats_band_pad_top";
  DROP TYPE "public"."enum__programs_v_blocks_b61_stats_band_pad_bottom";
  DROP TYPE "public"."enum__programs_v_blocks_b61_stats_band_item_style";
  DROP TYPE "public"."enum__programs_v_blocks_b61_stats_band_figure_scale";
  DROP TYPE "public"."enum__programs_v_blocks_b61_stats_band_surface";
  DROP TYPE "public"."enum__programs_v_blocks_b61_stats_band_item_surface";
  DROP TYPE "public"."enum__programs_v_blocks_b61_stats_band_eyebrow_rule";
  DROP TYPE "public"."enum__programs_v_blocks_b61_stats_band_entrance";
  DROP TYPE "public"."enum__programs_v_blocks_b61_stats_band_band_width";
  DROP TYPE "public"."enum__programs_v_blocks_b61_gallery_buttons_variant";
  DROP TYPE "public"."enum__programs_v_blocks_b61_gallery_buttons_action";
  DROP TYPE "public"."enum__programs_v_blocks_b61_gallery_buttons_link_type";
  DROP TYPE "public"."enum__programs_v_blocks_b61_gallery_heading_level";
  DROP TYPE "public"."enum__programs_v_blocks_b61_gallery_media";
  DROP TYPE "public"."enum__programs_v_blocks_b61_gallery_gallery_layout";
  DROP TYPE "public"."enum__programs_v_blocks_b61_gallery_text_position";
  DROP TYPE "public"."enum__programs_v_blocks_b61_gallery_heading_align";
  DROP TYPE "public"."enum__programs_v_blocks_b61_gallery_pad_top";
  DROP TYPE "public"."enum__programs_v_blocks_b61_gallery_pad_bottom";
  DROP TYPE "public"."enum__programs_v_blocks_b61_gallery_item_size";
  DROP TYPE "public"."enum__programs_v_blocks_b61_gallery_columns";
  DROP TYPE "public"."enum__programs_v_blocks_b61_gallery_image_shape";
  DROP TYPE "public"."enum__programs_v_blocks_b61_gallery_surface";
  DROP TYPE "public"."enum__programs_v_blocks_b61_gallery_eyebrow_rule";
  DROP TYPE "public"."enum__programs_v_blocks_b61_gallery_entrance";
  DROP TYPE "public"."enum__programs_v_blocks_b61_testimonial_text_align";
  DROP TYPE "public"."enum__programs_v_blocks_b61_testimonial_text_style";
  DROP TYPE "public"."enum__programs_v_blocks_b61_testimonial_pad_top";
  DROP TYPE "public"."enum__programs_v_blocks_b61_testimonial_pad_bottom";
  DROP TYPE "public"."enum__programs_v_blocks_b61_testimonial_surface";
  DROP TYPE "public"."enum__programs_v_blocks_b61_testimonial_eyebrow_rule";
  DROP TYPE "public"."enum__programs_v_blocks_b61_testimonial_entrance";
  DROP TYPE "public"."enum__programs_v_blocks_b61_accordion_buttons_variant";
  DROP TYPE "public"."enum__programs_v_blocks_b61_accordion_buttons_action";
  DROP TYPE "public"."enum__programs_v_blocks_b61_accordion_buttons_link_type";
  DROP TYPE "public"."enum__programs_v_blocks_b61_accordion_heading_level";
  DROP TYPE "public"."enum__programs_v_blocks_b61_accordion_heading_align";
  DROP TYPE "public"."enum__programs_v_blocks_b61_accordion_pad_top";
  DROP TYPE "public"."enum__programs_v_blocks_b61_accordion_pad_bottom";
  DROP TYPE "public"."enum__programs_v_blocks_b61_accordion_item_style";
  DROP TYPE "public"."enum__programs_v_blocks_b61_accordion_icon_style";
  DROP TYPE "public"."enum__programs_v_blocks_b61_accordion_surface";
  DROP TYPE "public"."enum__programs_v_blocks_b61_accordion_item_surface";
  DROP TYPE "public"."enum__programs_v_blocks_b61_accordion_eyebrow_rule";
  DROP TYPE "public"."enum__programs_v_blocks_b61_accordion_entrance";
  DROP TYPE "public"."enum__programs_v_blocks_b61_tabs_heading_level";
  DROP TYPE "public"."enum__programs_v_blocks_b61_tabs_tab_position";
  DROP TYPE "public"."enum__programs_v_blocks_b61_tabs_tab_align";
  DROP TYPE "public"."enum__programs_v_blocks_b61_tabs_heading_align";
  DROP TYPE "public"."enum__programs_v_blocks_b61_tabs_pad_top";
  DROP TYPE "public"."enum__programs_v_blocks_b61_tabs_pad_bottom";
  DROP TYPE "public"."enum__programs_v_blocks_b61_tabs_surface";
  DROP TYPE "public"."enum__programs_v_blocks_b61_tabs_eyebrow_rule";
  DROP TYPE "public"."enum__programs_v_blocks_b61_tabs_entrance";
  DROP TYPE "public"."enum__programs_v_blocks_b61_pillars_heading_level";
  DROP TYPE "public"."enum__programs_v_blocks_b61_pillars_tab_position";
  DROP TYPE "public"."enum__programs_v_blocks_b61_pillars_tab_align";
  DROP TYPE "public"."enum__programs_v_blocks_b61_pillars_heading_align";
  DROP TYPE "public"."enum__programs_v_blocks_b61_pillars_pad_top";
  DROP TYPE "public"."enum__programs_v_blocks_b61_pillars_pad_bottom";
  DROP TYPE "public"."enum__programs_v_blocks_b61_pillars_surface";
  DROP TYPE "public"."enum__programs_v_blocks_b61_pillars_eyebrow_rule";
  DROP TYPE "public"."enum__programs_v_blocks_b61_pillars_entrance";
  DROP TYPE "public"."enum__programs_v_blocks_b61_carousel_heading_level";
  DROP TYPE "public"."enum__programs_v_blocks_b61_carousel_per_view";
  DROP TYPE "public"."enum__programs_v_blocks_b61_carousel_heading_align";
  DROP TYPE "public"."enum__programs_v_blocks_b61_carousel_advance";
  DROP TYPE "public"."enum__programs_v_blocks_b61_carousel_controls_position";
  DROP TYPE "public"."enum__programs_v_blocks_b61_carousel_pad_top";
  DROP TYPE "public"."enum__programs_v_blocks_b61_carousel_pad_bottom";
  DROP TYPE "public"."enum__programs_v_blocks_b61_carousel_surface";
  DROP TYPE "public"."enum__programs_v_blocks_b61_carousel_eyebrow_rule";
  DROP TYPE "public"."enum__programs_v_blocks_b61_carousel_entrance";
  DROP TYPE "public"."enum__programs_v_blocks_b61_framed_image_image_shape";
  DROP TYPE "public"."enum__programs_v_blocks_b61_framed_image_image_height";
  DROP TYPE "public"."enum__programs_v_blocks_b61_framed_image_frame_color";
  DROP TYPE "public"."enum__programs_v_blocks_b61_framed_image_entrance";
  DROP TYPE "public"."enum__programs_v_blocks_b61_cta_buttons_variant";
  DROP TYPE "public"."enum__programs_v_blocks_b61_cta_buttons_action";
  DROP TYPE "public"."enum__programs_v_blocks_b61_cta_buttons_link_type";
  DROP TYPE "public"."enum__programs_v_blocks_b61_cta_heading_level";
  DROP TYPE "public"."enum__programs_v_blocks_b61_cta_text_align";
  DROP TYPE "public"."enum__programs_v_blocks_b61_cta_position";
  DROP TYPE "public"."enum__programs_v_blocks_b61_cta_pad_top";
  DROP TYPE "public"."enum__programs_v_blocks_b61_cta_pad_bottom";
  DROP TYPE "public"."enum__programs_v_blocks_b61_cta_surface";
  DROP TYPE "public"."enum__programs_v_blocks_b61_cta_text_panel";
  DROP TYPE "public"."enum__programs_v_blocks_b61_cta_eyebrow_rule";
  DROP TYPE "public"."enum__programs_v_blocks_b61_cta_entrance";
  DROP TYPE "public"."enum__programs_v_blocks_b61_form_heading_level";
  DROP TYPE "public"."enum__programs_v_blocks_b61_form_text_align";
  DROP TYPE "public"."enum__programs_v_blocks_b61_form_pad_top";
  DROP TYPE "public"."enum__programs_v_blocks_b61_form_pad_bottom";
  DROP TYPE "public"."enum__programs_v_blocks_b61_form_card";
  DROP TYPE "public"."enum__programs_v_blocks_b61_form_surface";
  DROP TYPE "public"."enum__programs_v_blocks_b61_form_eyebrow_rule";
  DROP TYPE "public"."enum__programs_v_blocks_b61_form_entrance";
  DROP TYPE "public"."enum__programs_v_blocks_b61_button_bar_first_link_type";
  DROP TYPE "public"."enum__programs_v_blocks_b61_button_bar_second_link_type";
  DROP TYPE "public"."enum__programs_v_blocks_b61_button_bar_size";
  DROP TYPE "public"."enum__programs_v_blocks_b61_button_bar_first_color";
  DROP TYPE "public"."enum__programs_v_blocks_b61_button_bar_second_color";
  DROP TYPE "public"."enum__programs_v_blocks_b61_button_bar_entrance";
  DROP TYPE "public"."enum__programs_v_blocks_b61_divider_line_style";
  DROP TYPE "public"."enum__programs_v_blocks_b61_divider_alignment";
  DROP TYPE "public"."enum__programs_v_blocks_b61_divider_weight";
  DROP TYPE "public"."enum__programs_v_blocks_b61_divider_line_color";
  DROP TYPE "public"."enum__programs_v_blocks_b61_divider_entrance";
  DROP TYPE "public"."enum__programs_v_blocks_b61_logos_logos_link_type";
  DROP TYPE "public"."enum__programs_v_blocks_b61_logos_heading_level";
  DROP TYPE "public"."enum__programs_v_blocks_b61_logos_motion";
  DROP TYPE "public"."enum__programs_v_blocks_b61_logos_heading_align";
  DROP TYPE "public"."enum__programs_v_blocks_b61_logos_pad_top";
  DROP TYPE "public"."enum__programs_v_blocks_b61_logos_pad_bottom";
  DROP TYPE "public"."enum__programs_v_blocks_b61_logos_surface";
  DROP TYPE "public"."enum__programs_v_blocks_b61_logos_eyebrow_rule";
  DROP TYPE "public"."enum__programs_v_blocks_b61_logos_entrance";
  DROP TYPE "public"."enum__programs_v_blocks_b61_rail_buttons_variant";
  DROP TYPE "public"."enum__programs_v_blocks_b61_rail_buttons_action";
  DROP TYPE "public"."enum__programs_v_blocks_b61_rail_buttons_link_type";
  DROP TYPE "public"."enum__programs_v_blocks_b61_rail_links_icon";
  DROP TYPE "public"."enum__programs_v_blocks_b61_rail_links_link_type";
  DROP TYPE "public"."enum__programs_v_blocks_b61_rail_actions_position";
  DROP TYPE "public"."enum__programs_v_blocks_b61_rail_surface";
  DROP TYPE "public"."enum__programs_v_blocks_b61_section_columns";
  DROP TYPE "public"."enum__programs_v_blocks_b61_section_rail_align";
  DROP TYPE "public"."enum__programs_v_blocks_b61_section_rail_stack";
  DROP TYPE "public"."enum__programs_v_blocks_b61_section_pad_top";
  DROP TYPE "public"."enum__programs_v_blocks_b61_section_pad_bottom";
  DROP TYPE "public"."enum__programs_v_blocks_b61_section_surface";
  DROP TYPE "public"."enum__programs_v_blocks_b61_section_entrance";`)
}
