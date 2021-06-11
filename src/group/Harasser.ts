import {SlottedGroup} from "./SlottedGroup";
import {atPosition, getAngleBetweenPos, getDistance, moveAtAngle} from "../utils/GridUtils";
import {getSpiritWrapper, globals} from "../globals/globals";
import {avoidEnemy} from "../utils/SpiritUtils";
import {inMemory} from "../memory/inMemory";

const RALLY_DISTANCE = 450;
const HARASS_DISTANCE = 350;
const MAINTAIN_DISTANCE_SQUARED = 300 * 300;

export class Harasser extends SlottedGroup {
  @inMemory()
  public harassSlot: Array<Position>;

  public hasSpace(): boolean {
    return this.totalSpiritCount < this.slots.length;
  }

  protected getSlots(): Array<Position> {
    const slots = new Array<Position>();
    const harassSlots = new Array<Position>();

    let angle = getAngleBetweenPos(enemy_base.position, globals.enemyStar.position) + Math.PI / 2;

    for (let i = 0; i < 5; i++) {
      slots.push(moveAtAngle(enemy_base.position, angle, RALLY_DISTANCE));
      harassSlots.push(moveAtAngle(enemy_base.position, angle, HARASS_DISTANCE))
      angle += Math.PI / 4;
    }

    this.harassSlot = harassSlots;

    return slots;
  }

  public run() {
    this.spiritIdsBySlot.forEach((spiritIdsInSlot, slotIdx) => {
      spiritIdsInSlot.forEach((spiritId) => {
        const spiritWrapper = getSpiritWrapper(spiritId);

        const slotPos = this.slots[slotIdx];
        const initialPos: Position = [base.position[0], slotPos[1]];

        if (avoidEnemy(spiritWrapper, MAINTAIN_DISTANCE_SQUARED)) {
          return;
        }

        const subTaskToPos = [
          initialPos, slotPos, this.harassSlot[slotIdx],
        ];

        if (!atPosition(spiritWrapper.entity, subTaskToPos[spiritWrapper.subTask])) {
          spiritWrapper.move(subTaskToPos[spiritWrapper.subTask]);
        } else {
          spiritWrapper.subTask = Math.min(spiritWrapper.subTask + 1, subTaskToPos.length - 1);
        }
      });
    });
  }
}
