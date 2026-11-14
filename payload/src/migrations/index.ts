import * as migration_20261114_174733_initial from './20261114_174733_initial';
import * as migration_20261114_185711_blob_object_key from './20261114_185711_blob_object_key';
import * as migration_20261114_221832_forms_email from './20261114_221832_forms_email';

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
    name: '20261114_221832_forms_email'
  },
];
