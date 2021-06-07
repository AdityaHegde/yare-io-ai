import {BaseClass} from "../BaseClass";
import {Memory} from "../memory/Memory";
import {SpiritWrapper} from "../wrappers/SpiritWrapper";
import {inMemory} from "../memory/inMemory";

@Memory("groups")
export class SpiritGroup extends BaseClass {
  @inMemory(() => 0)
  public totalSpiritCount: number;

  public init() {}

  public run() {}

  public addSpirit(spiritWrapper: SpiritWrapper) {}

  public removeSpirit(spiritWrapper: SpiritWrapper) {}

  public hasSpace() {
    return true;
  }

  protected checkAlive(spiritWrapper: SpiritWrapper) {
    if (!spiritWrapper.checkAlive()) {
      this.removeSpirit(spiritWrapper);
      return false;
    }
    return true;
  }
}
