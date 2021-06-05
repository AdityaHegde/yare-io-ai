import {BaseWrapper} from "./BaseWrapper";
import {Memory} from "../memory/Memory";

@Memory("energies")
export class EnergyWrapper extends BaseWrapper<Energy> {
  public static getInstanceById(id: string): EnergyWrapper {
    return new this(id === "star_zxq" ? star_zxq : star_a1c);
  }
}
