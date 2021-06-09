import {globals} from "./globals";

export function initGlobals() {
  globals.uniqueEnemiesSeen = new Set(memory.uniqueEnemies || []);
  globals.enemySeen = false;

  globals.enemiesTargeted = new Set();

  globals.instances = {};
}

export function initBaseStar() {
  globals.baseStar = {
    "star_zxq": star_zxq,
    "star_a1c": star_a1c,
  }[memory.baseStar];
  globals.enemyStar = {
    "star_zxq": star_a1c,
    "star_a1c": star_zxq,
  }[memory.baseStar];
}
