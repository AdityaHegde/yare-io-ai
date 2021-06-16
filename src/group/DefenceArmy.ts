import {DynamicGroup} from "./DynamicGroup";
import {inMemory} from "../memory/inMemory";

export class DefenceArmy extends DynamicGroup {
  @inMemory()
  public enemyArmyId: string;
}
