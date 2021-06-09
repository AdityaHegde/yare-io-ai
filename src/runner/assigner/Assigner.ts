import {BaseClass} from "../../BaseClass";
import {Memory} from "../../memory/Memory";
import {SpiritWrapper} from "../../wrappers/SpiritWrapper";

@Memory("assigner")
export class Assigner<ConfigType> extends BaseClass {
  protected readonly config: ConfigType;

  constructor(id: string, config: ConfigType) {
    super(id);
    this.config = config;
  }

  public preTick() {}
  public assign(spiritWrapper: SpiritWrapper) {}
  public postTick() {}
}
