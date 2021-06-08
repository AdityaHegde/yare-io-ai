import {Runner} from "./Runner";
import {getSpiritWrapper, globals} from "../globals/globals";
import {RoleType} from "../role/Role";
import {UNDER_ATTACK_BUFFER} from "../constants";

export class GroupRunner extends Runner {
  public init() {
    Object.values(globals.groups).forEach(group => group.init());
  }

  public runCore() {
    this.assigner.preTick();

    Object.values(globals.groups).forEach(group => group.run());

    my_spirits.forEach((spirit) => {
      const spiritWrapper = getSpiritWrapper(spirit.id);

      if (spiritWrapper.role === RoleType.Free) {
        this.assigner.assign(spiritWrapper);
      }
    });

    if (globals.enemySeen) {
      memory.underAttack = true;
      memory.lastSeenTick = memory.tick;
    } else if (memory.tick - memory.lastSeenTick > UNDER_ATTACK_BUFFER) {
      memory.underAttack = false;
    }

    this.assigner.postTick();
  }
}
