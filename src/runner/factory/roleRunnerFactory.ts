import {RoleRunner} from "../RoleRunner";
import {RoleAssigner} from "../assigner/RoleAssigner";
import {HARVESTERS_THRESHOLD, MAX_ATTACKERS, MAX_DEFENDERS} from "../../constants";

export function getBasicRoleRunner() {
  return new RoleRunner(
    "one",
    new RoleAssigner(
      "one",
      {harvestersThreshold: HARVESTERS_THRESHOLD},
    ),
    {maxAttackers: MAX_ATTACKERS, maxDefenders: MAX_DEFENDERS},
  );
}
