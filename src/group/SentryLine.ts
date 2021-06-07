import {Log} from "../utils/Logger";
import {atPosition, getDistance, moveToPoint} from "../utils/GridUtils";
import {MAX_X, MAX_Y, SENTRY_COUNT, SENTRY_DISTANCE} from "../constants";
import {SlottedGroup} from "./SlottedGroup";
import {getSpiritWrapper} from "../globals/globals";

@Log
export class SentryLine extends SlottedGroup {
  public run() {
    this.spiritIdsBySlot.forEach((spiritIdsInSlot, slotIdx) => {
      spiritIdsInSlot.forEach((spiritId) => {
        const spiritWrapper = getSpiritWrapper(spiritId);
        if (!this.checkAlive(spiritWrapper)) {
          return;
        }

        if (!atPosition(spiritWrapper.entity, this.slots[slotIdx])) {
          spiritWrapper.move(this.slots[slotIdx]);
        }
      });
    });
  }

  public hasSpace(): boolean {
    return this.totalSpiritCount < this.slots.length;
  }

  protected getSlots(): Array<Position> {
    const slots: Array<Position> = [];

    const baseDistance = Math.sqrt(getDistance(base, enemy_base));
    const midPoint = moveToPoint(base.position, enemy_base.position, baseDistance / 2);

    slots.push(midPoint);
    let left = midPoint;
    let right = midPoint;
    for (let i = 0; i < SENTRY_COUNT; i++) {
      left = moveToPoint(left, [0, MAX_Y], SENTRY_DISTANCE);
      slots.push(left);
      right = moveToPoint(right, [MAX_X, 0], SENTRY_DISTANCE);
      slots.push(right);
    }

    return slots;
  }
}
