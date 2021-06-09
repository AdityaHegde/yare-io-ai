import {GroupRunner} from "../GroupRunner";
import {GroupAssigner} from "../assigner/GroupAssigner";
import {
  HARVEST_LINK_BUFFER,
  HARVESTER_DEFENDER_RATIO,
  HARVESTER_SENTRY_RATIO, SENTRY_COUNT, SENTRY_DISTANCE,
  UNDER_ATTACK_BUFFER
} from "../../constants";

export function getBasicGroupRunner() {
  return new GroupRunner(
    "one",
    new GroupAssigner(
      "one",
      {harvesterSentryRatio: HARVESTER_SENTRY_RATIO, harvesterDefenderRatio: HARVESTER_DEFENDER_RATIO},
    ),
    {
      harvestLinkBuffer: HARVEST_LINK_BUFFER, underAttackBuffer: UNDER_ATTACK_BUFFER,
      sentryCount: SENTRY_COUNT, sentryDistance: SENTRY_DISTANCE,
    },
  );
}
