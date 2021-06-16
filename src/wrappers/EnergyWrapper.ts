import {BaseWrapper} from "./BaseWrapper";
import {Memory} from "../memory/Memory";

const StarMap = {
  "star_zxq": star_zxq,
  "star_a1c": star_a1c,
  "star_p89": star_p89,
}

@Memory("energies")
export class EnergyWrapper extends BaseWrapper<Energy> {
  public static getInstanceById(id: string): EnergyWrapper {
    return new this(StarMap[id]);
  }
}
