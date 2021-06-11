export const MOVE_DISTANCE = 20;
export const ACTUAL_ACTION_DISTANCE = 200;
export const ACTUAL_SIGHT_DISTANCE = 400;

export const GRID_NOISE = 2;
export const ACTION_DISTANCE = ACTUAL_ACTION_DISTANCE - GRID_NOISE;
export const ACTION_DISTANCE_SQUARED = ACTION_DISTANCE * ACTION_DISTANCE;
export const SIGHT_DISTANCE = ACTUAL_SIGHT_DISTANCE - GRID_NOISE;
export const SIGHT_DISTANCE_SQUARED = SIGHT_DISTANCE * SIGHT_DISTANCE;

export const MAX_X = 4400;
export const MAX_Y = 2700;

export const SENTRY_DISTANCE = 300;
// actualCount = 2 * SENTRY_COUNT + 1
export const SENTRY_COUNT = 0;

export const UPDATE_CODE_BUTTON_ID = "update_code";

export const SOLDIER_ENERGY_THRESHOLD = 5;

// groups constants
export const HARVESTER_SENTRY_RATIO = 10;
export const HARVESTER_DEFENDER_RATIO = 3;
export const ATTACK_THRESHOLD = 150;
export const ATTACKER_COUNT = 150;
export const UNDER_ATTACK_BUFFER = 25;
export const HARVEST_LINK_BUFFER_MIN = 0;
export const HARVEST_LINK_BUFFER_MAX = 0.5;
export const HARVEST_LINK_BUFFER_SCALE = 0.0025;

// roles constants
export const HARVESTERS_THRESHOLD = 25;
export const MAX_ATTACKERS = 10;
export const MAX_DEFENDERS = 10;
