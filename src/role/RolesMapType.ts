import {Role, RoleType} from "./Role";

export type RolesMapType = {
  [RoleType.Harvester]: Role,
  [RoleType.Defender]: Role,
  [RoleType.Attacker]: Role,
}
