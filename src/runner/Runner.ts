import {BaseClass} from "../BaseClass";
import {globals} from "../globals/globals";
import {Log} from "../utils/Logger";
import {Assigner} from "./assigner/Assigner";

@Log
export class Runner extends BaseClass {
  public assigner: Assigner;

  constructor(id: string, assigner: Assigner) {
    super(id);
    this.assigner = assigner;
  }

  public run() {
    memory.tick++;

    // this.logger.logJSON(memory);

    for (const targetPool in globals.targetPools) {
      globals.targetPools[targetPool].updateTargets();
    }

    this.runCore();
  }

  public runCore() {}
}
