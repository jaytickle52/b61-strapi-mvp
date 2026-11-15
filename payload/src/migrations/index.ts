import * as migration_20261114_174733_initial from './20261114_174733_initial';
import * as migration_20261114_185711_blob_object_key from './20261114_185711_blob_object_key';
import * as migration_20261114_221832_forms_email from './20261114_221832_forms_email';
import * as migration_20261114_224927_seo_search from './20261114_224927_seo_search';
import * as migration_20261115_000930_media_documents_folders from './20261115_000930_media_documents_folders';
import * as migration_20261115_002446_permissions_invites from './20261115_002446_permissions_invites';
import * as migration_20261115_010944_thread_g_analytics from './20261115_010944_thread_g_analytics';

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
    name: '20261115_010944_thread_g_analytics'
  },
];
