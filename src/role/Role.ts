import {BaseClass} from "../BaseClass";
import {SpiritWrapper} from "../wrappers/SpiritWrapper";
import {Memory} from "../memory/Memory";
import {inMemory} from "../memory/inMemory";
import {Task} from "./task/Task";

export enum RoleType {
  Free,
  BasicHarvester,
  BasicDefender,
  BasicAttacker,
}

@Memory("roles")
export class Role extends BaseClass {
  public type: RoleType;
  public tasks: Array<Task<any, any>>;

  constructor(id: string, {
    type, tasks,
  }: {
    type: RoleType,
    tasks: Array<Task<any, any>>,
  }) {
    super(id);
    this.type = type;
    this.tasks = tasks;
  }

  @inMemory(() => 0)
  public spiritsCount: number;

  public processSpirit(spirit: SpiritWrapper): boolean {
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
