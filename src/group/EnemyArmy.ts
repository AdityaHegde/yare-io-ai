import {inMemory} from "../memory/inMemory";
import {DynamicGroup} from "./DynamicGroup";

export class EnemyArmy extends DynamicGroup {
  @inMemory(() => 0)
  public angle: number;

  @inMemory()
  public center: Position;
}
