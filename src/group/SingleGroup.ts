import {inMemory} from "../memory/inMemory";
import {SpiritWrapper} from "../wrappers/SpiritWrapper";
import {RoleType} from "../role/Role";
import {SpiritGroup} from "./SpiritGroup";

/**
 * Abstraction for groups where all spirits work together.
 */
export class SingleGroup extends SpiritGroup {
  @inMemory(() => [])
  public spiritIds: Array<string>;

  public maxSpirits: number;

  constructor(id: string, {
    maxSpirits
  }: {
    maxSpirits: number,
  }) {
    super(id);
    this.maxSpirits = maxSpirits;
  }

  public addSpirit(spiritWrapper: SpiritWrapper) {
    spiritWrapper.role = RoleType.Group;
    this.spiritIds.push(spiritWrapper.id);
    this.totalSpiritCount++;
  }

  public removeSpirit(spiritWrapper: SpiritWrapper) {
    spiritWrapper.role = RoleType.Free;
    this.spiritIds.splice(this.spiritIds.indexOf(spiritWrapper.id), 1);
    this.totalSpiritCount--;
  }

  public hasSpace() {
    return this.maxSpirits !== -1 && this.totalSpiritCount < this.maxSpirits;
  }
}
