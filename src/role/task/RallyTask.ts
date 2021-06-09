import {Log} from "../../utils/Logger";
import {Task, TaskType} from "./Task";
import {StructureWrapper} from "../../wrappers/StructureWrapper";
import {SpiritWrapper} from "../../wrappers/SpiritWrapper";
import {atPosition} from "../../utils/GridUtils";
import {attackInRange} from "../../utils/SpiritUtils";

@Log
export class RallyTask extends Task<Base, StructureWrapper> {
  private readonly rallyPoint: Position;
  private readonly attackInRange: boolean;

  constructor(id: string, {
    type, rallyPoint, attackInRange,
  }: {
    type: TaskType, rallyPoint: Position,
    attackInRange: boolean,
  }) {
    super(id, { type, targetPool: null });
    this.rallyPoint = rallyPoint;
    this.attackInRange = attackInRange;
  }

  public processSpirit(spiritWrapper: SpiritWrapper): boolean {
    if (this.attackInRange) {
      attackInRange(spiritWrapper);
    }

    if (atPosition(spiritWrapper.entity, this.rallyPoint)) {
      return !this.attackInRange;
    }

    spiritWrapper.move(this.rallyPoint);

    return false;
  }
}
