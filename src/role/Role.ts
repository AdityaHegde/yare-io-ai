import {BaseClass} from "../BaseClass";
import {SpiritWrapper} from "../wrappers/SpiritWrapper";
import {Memory} from "../memory/Memory";
import {inMemory} from "../memory/inMemory";
import {Task} from "./task/Task";
import {Log} from "../utils/Logger";

export enum RoleType {
  Free,
  BasicHarvester,
  BasicDefender,
  BasicAttacker,
  Group,
}

@Log
@Memory("roles")
export class Role extends BaseClass {
  public type: RoleType;
  public tasks: Array<Task<any, any>>;
  public maxSpirits: number;

  constructor(id: string, {
    type, tasks, maxSpirits,
  }: {
    type: RoleType,
    tasks: Array<Task<any, any>>,
    maxSpirits: number,
  }) {
    super(id);
    this.type = type;
    this.tasks = tasks;
    this.maxSpirits = maxSpirits;
  }

  @inMemory(() => 0)
  public spiritsCount: number;

  public init() {}

  public processSpirit(spirit: SpiritWrapper): boolean {
    // this.logger.log(`${spirit.id} is running role=${this.type} task=${spirit.task}`);
    const done = this.tasks[spirit.task].processSpirit(spirit);
    if (done) {
      spirit.task = (spirit.task + 1) % this.tasks.length;
    }
    return true;
  }

  public addSpirit(spirit: SpiritWrapper) {
    spirit.role = this.type;
    spirit.task = 0;
    this.spiritsCount++;
  }

  public removeSpirit(spirit: SpiritWrapper) {
    spirit.role = RoleType.Free;
    this.spiritsCount--;
  }
}
