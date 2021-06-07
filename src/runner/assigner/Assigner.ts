import {BaseClass} from "../../BaseClass";
import {Memory} from "../../memory/Memory";
import {SpiritWrapper} from "../../wrappers/SpiritWrapper";

@Memory("assigner")
export class Assigner extends BaseClass {
  public assign(spiritWrapper: SpiritWrapper) {}
}
