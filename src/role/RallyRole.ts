import {Role} from "./Role";
import {inMemory} from "../memory/inMemory";
import {SpiritWrapper} from "../wrappers/SpiritWrapper";
import {Log} from "../utils/Logger";

@Log
export class RallyRole extends Role {
  private ralliedCount = 0;
  @inMemory(() => false)
  public hasRallied: boolean;

  public processSpirit(spirit: SpiritWrapper): boolean {
    const done = this.tasks[spirit.task].processSpirit(spirit);
    if (done) {
      if (this.hasRallied) {
        spirit.task = Math.min(spirit.task + 1, this.tasks.length - 1);
      } else {
        this.ralliedCount++;
        if (this.ralliedCount === this.maxSpirits) {
          this.hasRallied = true;
          // this.logger.log(`Rallied!`);
        }
      }
    }
    return true;
  }

  public removeSpirit(spirit: SpiritWrapper) {
    super.removeSpirit(spirit);
    if (this.spiritsCount === 0) {
      this.hasRallied = false;
      // this.logger.log(`Reset!`);
    }
  }
}
