import {Log} from "../utils/Logger";
import {atPosition, getDistance, moveToPoint} from "../utils/GridUtils";
import {MAX_X, MAX_Y, SENTRY_COUNT, SENTRY_DISTANCE} from "../constants";
import {SlottedGroup} from "./SlottedGroup";
import {getSpiritWrapper, globals} from "../globals/globals";

@Log
export class SentryLine extends SlottedGroup {
  private readonly sentryCount: number;
  private readonly sentryDistance: number;

  constructor(id: string, {
    sentryCount, sentryDistance
  }: {
    sentryCount: number, sentryDistance: number,
  }) {
    super(id);
    this.sentryCount = sentryCount;
    this.sentryDistance = sentryDistance;
  }

  public run() {
    let enemySighted = base.sight.enemies.length > 0;

    this.spiritIdsBySlot.forEach((spiritIdsInSlot, slotIdx) => {
      spiritIdsInSlot.forEach((spiritId) => {
        const spiritWrapper = getSpiritWrapper(spiritId);

        if (!atPosition(spiritWrapper.entity, this.slots[slotIdx])) {
          spiritWrapper.move(this.slots[slotIdx]);
        }

        if (spiritWrapper.entity.sight.enemies.length > 0) {
          enemySighted = true;
        }
      });
    });

    globals.enemySeen ||= enemySighted;
  }

  public hasSpace(): boolean {
    return this.totalSpiritCount < this.slots.length;
  }

  protected getSlots(): Array<Position> {
    const slots: Array<Position> = [];

    const baseDistance = Math.sqrt(getDistance(base, enemy_base));
    const startPoint = moveToPoint(base.position, enemy_base.position, baseDistance * 3 / 8);

    slots.push(startPoint);
    let left = startPoint;
    let right = startPoint;
    for (let i = 0; i < this.sentryCount; i++) {
      left = moveToPoint(left, [0, MAX_Y], this.sentryDistance);
      slots.push(left);
      right = moveToPoint(right, [MAX_X, 0], this.sentryDistance);
      slots.push(right);
    }

    return slots;
  }
}
