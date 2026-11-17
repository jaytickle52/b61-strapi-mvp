import * as migration_20261114_174733_initial from './20261114_174733_initial';
import * as migration_20261114_185711_blob_object_key from './20261114_185711_blob_object_key';
import * as migration_20261114_221832_forms_email from './20261114_221832_forms_email';
import * as migration_20261114_224927_seo_search from './20261114_224927_seo_search';
import * as migration_20261115_000930_media_documents_folders from './20261115_000930_media_documents_folders';
import * as migration_20261115_002446_permissions_invites from './20261115_002446_permissions_invites';
import * as migration_20261115_010944_thread_g_analytics from './20261115_010944_thread_g_analytics';
import * as migration_20261115_012311_school_features from './20261115_012311_school_features';
import * as migration_20261115_015924_branding_video from './20261115_015924_branding_video';
import * as migration_20261115_120000_order_versions from './20261115_120000_order_versions';
import * as migration_20261115_121541_theme_dark_css from './20261115_121541_theme_dark_css';
import * as migration_20261115_123520_structured_data from './20261115_123520_structured_data';
import * as migration_20261115_124153_domains_ai_crawlers from './20261115_124153_domains_ai_crawlers';
import * as migration_20261115_211611_merge_seo_stack from './20261115_211611_merge_seo_stack';
import * as migration_20261115_235935_style_themes from './20261115_235935_style_themes';
import * as migration_20261116_012643_layouts_l2 from './20261116_012643_layouts_l2';
import * as migration_20261116_023152_wake_patterns from './20261116_023152_wake_patterns';
import * as migration_20261116_031341_changing_words_text from './20261116_031341_changing_words_text';
import * as migration_20261116_113637_canterbury_patterns from './20261116_113637_canterbury_patterns';
import * as migration_20261116_153825_drop_intro_subheadings from './20261116_153825_drop_intro_subheadings';
import * as migration_20261116_164538_shared_section_colour from './20261116_164538_shared_section_colour';
import * as migration_20261117_014843_schoolbox_themes from './20261117_014843_schoolbox_themes';
import * as migration_20261117_110643_mcp_keys from './20261117_110643_mcp_keys';

export const migrations = [
  {
    up: migration_20261114_174733_initial.up,
    down: migration_20261114_174733_initial.down,
    name: '20261114_174733_initial',
  },
  {
    up: migration_20261114_185711_blob_object_key.up,
    down: migration_20261114_185711_blob_object_key.down,
    name: '20261114_185711_blob_object_key',
  },
  {
    up: migration_20261114_221832_forms_email.up,
    down: migration_20261114_221832_forms_email.down,
    name: '20261114_221832_forms_email',
  },
  {
    up: migration_20261114_224927_seo_search.up,
    down: migration_20261114_224927_seo_search.down,
    name: '20261114_224927_seo_search',
  },
  {
    up: migration_20261115_000930_media_documents_folders.up,
    down: migration_20261115_000930_media_documents_folders.down,
    name: '20261115_000930_media_documents_folders',
  },
  {
    up: migration_20261115_002446_permissions_invites.up,
    down: migration_20261115_002446_permissions_invites.down,
    name: '20261115_002446_permissions_invites',
  },
  {
    up: migration_20261115_010944_thread_g_analytics.up,
    down: migration_20261115_010944_thread_g_analytics.down,
    name: '20261115_010944_thread_g_analytics',
  },
  {
    up: migration_20261115_012311_school_features.up,
    down: migration_20261115_012311_school_features.down,
    name: '20261115_012311_school_features',
  },
  {
    up: migration_20261115_015924_branding_video.up,
    down: migration_20261115_015924_branding_video.down,
    name: '20261115_015924_branding_video',
  },
  {
    up: migration_20261115_120000_order_versions.up,
    down: migration_20261115_120000_order_versions.down,
    name: '20261115_120000_order_versions',
  },
  {
    up: migration_20261115_121541_theme_dark_css.up,
    down: migration_20261115_121541_theme_dark_css.down,
    name: '20261115_121541_theme_dark_css',
  },
  {
    up: migration_20261115_123520_structured_data.up,
    down: migration_20261115_123520_structured_data.down,
    name: '20261115_123520_structured_data',
  },
  {
    up: migration_20261115_124153_domains_ai_crawlers.up,
    down: migration_20261115_124153_domains_ai_crawlers.down,
    name: '20261115_124153_domains_ai_crawlers',
  },
  {
    up: migration_20261115_211611_merge_seo_stack.up,
    down: migration_20261115_211611_merge_seo_stack.down,
    name: '20261115_211611_merge_seo_stack',
  },
  {
    up: migration_20261115_235935_style_themes.up,
    down: migration_20261115_235935_style_themes.down,
    name: '20261115_235935_style_themes',
  },
  {
    up: migration_20261116_012643_layouts_l2.up,
    down: migration_20261116_012643_layouts_l2.down,
    name: '20261116_012643_layouts_l2',
  },
  {
    up: migration_20261116_023152_wake_patterns.up,
    down: migration_20261116_023152_wake_patterns.down,
    name: '20261116_023152_wake_patterns',
  },
  {
    up: migration_20261116_031341_changing_words_text.up,
    down: migration_20261116_031341_changing_words_text.down,
    name: '20261116_031341_changing_words_text',
  },
  {
    up: migration_20261116_113637_canterbury_patterns.up,
    down: migration_20261116_113637_canterbury_patterns.down,
    name: '20261116_113637_canterbury_patterns',
  },
  {
    up: migration_20261116_153825_drop_intro_subheadings.up,
    down: migration_20261116_153825_drop_intro_subheadings.down,
    name: '20261116_153825_drop_intro_subheadings',
  },
  {
    up: migration_20261116_164538_shared_section_colour.up,
    down: migration_20261116_164538_shared_section_colour.down,
    name: '20261116_164538_shared_section_colour',
  },
  {
    up: migration_20261117_014843_schoolbox_themes.up,
    down: migration_20261117_014843_schoolbox_themes.down,
    name: '20261117_014843_schoolbox_themes',
  },
  {
    up: migration_20261117_110643_mcp_keys.up,
    down: migration_20261117_110643_mcp_keys.down,
    name: '20261117_110643_mcp_keys'
  },
];
