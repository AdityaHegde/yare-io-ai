import {SingleGroup} from "./SingleGroup";
import {inMemory} from "../memory/inMemory";
import {moveToPoint} from "../utils/GridUtils";
import {SIGHT_DISTANCE} from "../constants";

export class DefenceArmy extends SingleGroup {
  @inMemory()
  public rallyPoint: Position;

  public init() {
    this.rallyPoint = moveToPoint(base.position, enemy_base.position, SIGHT_DISTANCE);
  }
}
