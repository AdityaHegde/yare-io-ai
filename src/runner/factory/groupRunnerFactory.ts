import {GroupRunner, GroupRunnerConfig} from "../GroupRunner";
import {GroupAssigner, GroupAssignerConfig} from "../assigner/GroupAssigner";
import {
  ATTACK_THRESHOLD,
  ATTACKER_COUNT,
  HARASSER_DEFENDER_RATIO,
  HARVEST_LINK_BUFFER_MAX,
  HARVEST_LINK_BUFFER_MIN,
  HARVEST_LINK_BUFFER_SCALE,
  HARVESTER_DEFENDER_RATIO,
  HARVESTER_SENTRY_RATIO,
  SENTRY_COUNT,
  SENTRY_DISTANCE,
  UNDER_ATTACK_BUFFER
} from "../../constants";

export function getBaseGroupAssignerConfig(): GroupAssignerConfig {
  return {
    harvesterSentryRatio: HARVESTER_SENTRY_RATIO, harvesterDefenderRatio: HARVESTER_DEFENDER_RATIO,
    harvesterHarasserRatio: HARASSER_DEFENDER_RATIO,
    attackThreshold: ATTACK_THRESHOLD, attackerCount: ATTACKER_COUNT,
    enableAttack: true, enableSentry: false, enableDefence: true, enableHarasser: true,
  };
}

export function getHarvesterOnlyGroupAssignerConfig(): GroupAssignerConfig {
  return {
    ...getBaseGroupAssignerConfig(),
    enableAttack: true, enableSentry: false, enableDefence: false, enableHarasser: false,
  };
}

export function getBaseGroupRunnerConfig(): GroupRunnerConfig {
  return {
    harvestLinkBufferMin: HARVEST_LINK_BUFFER_MIN, harvestLinkBufferMax: HARVEST_LINK_BUFFER_MAX,
    harvestLinkBufferScale: HARVEST_LINK_BUFFER_SCALE,

    underAttackBuffer: UNDER_ATTACK_BUFFER,
    sentryCount: SENTRY_COUNT, sentryDistance: SENTRY_DISTANCE,

    forceHarvesterNonHybrid: true,
  };
}

export function getBasicGroupRunner() {
  return new GroupRunner(
    "one",
    new GroupAssigner(
      "one",
      getBaseGroupAssignerConfig(),
    ),
    getBaseGroupRunnerConfig(),
  );
}
