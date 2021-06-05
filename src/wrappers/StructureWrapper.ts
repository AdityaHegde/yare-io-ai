import {BaseWrapper} from "./BaseWrapper";
import {Memory} from "../memory/Memory";

@Memory("structures")
export class StructureWrapper extends BaseWrapper<Base> {
  public static getInstanceById(id: string): StructureWrapper {
    return new this(id === base.id ? base : enemy_base);
  }
}
