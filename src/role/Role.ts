import {BaseClass} from "../BaseClass";
import {SpiritWrapper} from "../wrappers/SpiritWrapper";
import {Memory} from "../memory/Memory";
import {inMemory} from "../memory/inMemory";
import {Task} from "./task/Task";
import {Log} from "../utils/Logger";

export enum RoleType {
  Free,
  Harvester,
  Defender,
  Attacker,
  Group,
}

export type RoleOpts = {
  type: RoleType;
  tasks: Array<Task<any, any>>;
  startFromScratch: boolean;
  maxSpirits: number;
}

@Log
@Memory("roles")
export class Role extends BaseClass {
  public type: RoleType;
  public tasks: Array<Task<any, any>>;
  protected readonly startFromScratch: boolean;
  protected readonly maxSpirits: number;

  constructor(id: string, {
    type, tasks,
    startFromScratch, maxSpirits,
  }: RoleOpts) {
    super(id);
    this.type = type;
    this.tasks = tasks;
    this.maxSpirits = maxSpirits;
    this.startFromScratch = startFromScratch;
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

  public addSpirit(spiritWrapper: SpiritWrapper) {
    spiritWrapper.role = this.type;
    spiritWrapper.task = 0;
    this.spiritsCount++;
  }

  public removeSpirit(spiritWrapper: SpiritWrapper) {
    spiritWrapper.role = RoleType.Free;
    spiritWrapper.task = 0;
    this.spiritsCount--;
  }

  public hasSpace() {
    return (this.startFromScratch && this.spiritsCount === 0) ||
      this.maxSpirits === -1 || this.spiritsCount < this.maxSpirits;
  }
}
