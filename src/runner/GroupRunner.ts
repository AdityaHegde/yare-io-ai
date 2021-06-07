import {Runner} from "./Runner";
import {getSpiritWrapper, globals} from "../globals/globals";
import {RoleType} from "../role/Role";

export class GroupRunner extends Runner {
  public runCore() {
    globals.groups.forEach(group => group.run());

    my_spirits.forEach((spirit) => {
      const spiritWrapper = getSpiritWrapper(spirit.id);

      if (spiritWrapper.role === RoleType.Free) {
        this.assigner.assign(spiritWrapper);
      }
    });
  }
}
