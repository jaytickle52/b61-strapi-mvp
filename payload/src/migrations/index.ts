import * as migration_20261114_021152_initial from './20261114_021152_initial';

export const migrations = [
  {
    up: migration_20261114_021152_initial.up,
    down: migration_20261114_021152_initial.down,
    name: '20261114_021152_initial'
  },
];
