import {SingleGroup} from "./SingleGroup";

export class DynamicGroup extends SingleGroup {
  public run() {
    if (this.spiritIds.length === 0) {
      this.destroy();
      return;
    }


  }
}
