// game constants
export const MOVE_DISTANCE = 20;
export const ACTUAL_ACTION_DISTANCE = 200;
export const ACTUAL_SIGHT_DISTANCE = 400;

export const GRID_NOISE = 2;
export const ACTION_DISTANCE = ACTUAL_ACTION_DISTANCE - GRID_NOISE;
export const ACTION_DISTANCE_SQUARED = ACTION_DISTANCE * ACTION_DISTANCE;
export const SIGHT_DISTANCE = ACTUAL_SIGHT_DISTANCE - GRID_NOISE;
export const SIGHT_DISTANCE_SQUARED = SIGHT_DISTANCE * SIGHT_DISTANCE;

export const OUTPOST_USAGE = 1;
export const OUTPOST_RANGE = 400;
export const OUTPOST_ADDITIONAL_THRESHOLD = 500;
export const OUTPOST_ADDITIONAL_USAGE = 2;
export const OUTPOST_ADDITIONAL_RANGE = 600;

export const BASE_STAR_INIT_ENERGY = 100;
export const STAR_CONSTANT_REGEN = 3;
export const STAR_PERCENT_REGEN = 0.01;
export const STAR_MAX_ENERGY = 1000;
export const MIDDLE_STAR_START_TICK = 100;
// game constants end

export const MAX_X = 4400;
export const MAX_Y = 2700;

export const SENTRY_DISTANCE = 300;
// actualCount = 2 * SENTRY_COUNT + 1
export const SENTRY_COUNT = 0;

export const UPDATE_CODE_BUTTON_ID = "update_code";

// groups constants
export const HARVESTER_SENTRY_RATIO = 10;
export const HARVESTER_DEFENDER_RATIO = 3;
export const HARASSER_DEFENDER_RATIO = 10;
export const ATTACK_THRESHOLD = 100;
export const ATTACKER_COUNT = 25;
export const UNDER_ATTACK_BUFFER = 25;
export const HARVEST_LINK_BUFFER_MIN = 0;
export const HARVEST_LINK_BUFFER_MAX = 0;
export const HARVEST_LINK_BUFFER_SCALE = 0.0025;
