import * as migration_20261114_021152_initial from './20261114_021152_initial';
import * as migration_20261114_111730_b61_hero from './20261114_111730_b61_hero';

export const migrations = [
  {
    up: migration_20261114_021152_initial.up,
    down: migration_20261114_021152_initial.down,
    name: '20261114_021152_initial',
  },
  {
    up: migration_20261114_111730_b61_hero.up,
    down: migration_20261114_111730_b61_hero.down,
    name: '20261114_111730_b61_hero'
  },
];
