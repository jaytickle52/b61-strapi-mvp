import * as migration_20261114_021152_initial from './20261114_021152_initial';
import * as migration_20261114_111730_b61_hero from './20261114_111730_b61_hero';
import * as migration_20261114_115555_heading_level_auto from './20261114_115555_heading_level_auto';
import * as migration_20261114_123220_b61_split from './20261114_123220_b61_split';
import * as migration_20261114_130536_b61_prose from './20261114_130536_b61_prose';
import * as migration_20261114_135744_b61_cta from './20261114_135744_b61_cta';
import * as migration_20261114_140324_b61_card_grid from './20261114_140324_b61_card_grid';
import * as migration_20261114_141516_b61_simple from './20261114_141516_b61_simple';

export const migrations = [
  {
    up: migration_20261114_021152_initial.up,
    down: migration_20261114_021152_initial.down,
    name: '20261114_021152_initial',
  },
  {
    up: migration_20261114_111730_b61_hero.up,
    down: migration_20261114_111730_b61_hero.down,
    name: '20261114_111730_b61_hero',
  },
  {
    up: migration_20261114_115555_heading_level_auto.up,
    down: migration_20261114_115555_heading_level_auto.down,
    name: '20261114_115555_heading_level_auto',
  },
  {
    up: migration_20261114_123220_b61_split.up,
    down: migration_20261114_123220_b61_split.down,
    name: '20261114_123220_b61_split',
  },
  {
    up: migration_20261114_130536_b61_prose.up,
    down: migration_20261114_130536_b61_prose.down,
    name: '20261114_130536_b61_prose',
  },
  {
    up: migration_20261114_135744_b61_cta.up,
    down: migration_20261114_135744_b61_cta.down,
    name: '20261114_135744_b61_cta',
  },
  {
    up: migration_20261114_140324_b61_card_grid.up,
    down: migration_20261114_140324_b61_card_grid.down,
    name: '20261114_140324_b61_card_grid',
  },
  {
    up: migration_20261114_141516_b61_simple.up,
    down: migration_20261114_141516_b61_simple.down,
    name: '20261114_141516_b61_simple'
  },
];
