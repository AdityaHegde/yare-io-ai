import {SlottedGroup} from "./SlottedGroup";
import {atPosition, getAngleBetweenPos, moveAtAngle} from "../utils/GridUtils";
import {getSpiritWrapper, globals} from "../globals/globals";
import {avoidEnemy} from "../utils/SpiritUtils";
import {inMemory} from "../memory/inMemory";

const RALLY_DISTANCE = 450;
const HARASS_DISTANCE = 350;
const MAINTAIN_DISTANCE_SQUARED = 300 * 300;

export class Harasser extends SlottedGroup {
  @inMemory()
  public initialSlots: Array<Position>;

  @inMemory()
  public harassSlots: Array<Position>;

  public hasSpace(): boolean {
    return this.totalSpiritCount < this.slots.length;
  }

  protected getSlots(): Array<Position> {
    const slots = new Array<Position>();
    const initialSlots = new Array<Position>();
    const harassSlots = new Array<Position>();

    // base harass slots
    let angle = getAngleBetweenPos(enemy_base.position, globals.enemyStar.position) + Math.PI * 3 / 4;
    for (let i = 0; i < 2; i++) {
      const slot = moveAtAngle(enemy_base.position, angle, RALLY_DISTANCE);
      slots.push(slot);
      initialSlots.push([base.position[0], slot[1]]);
      harassSlots.push(moveAtAngle(enemy_base.position, angle, HARASS_DISTANCE));
      angle += Math.PI / 2;
    }

    // star harass slots
    // angle = getAngleBetweenPos(enemy_base.position, globals.enemyStar.position) + Math.PI / 4;
    // for (let i = 0; i < 2; i++) {
    //   const slot = moveAtAngle(globals.enemyStar.position, angle, RALLY_DISTANCE);
    //   slots.push(slot);
    //   initialSlots.push([slot[0], base.position[1]]);
    //   harassSlots.push(moveAtAngle(globals.enemyStar.position, angle, HARASS_DISTANCE));
    //   angle -= Math.PI / 2;
    // }

    this.harassSlots = harassSlots;
    this.initialSlots = initialSlots;

    return slots;
  }

  public run() {
    this.spiritIdsBySlot.forEach((spiritIdsInSlot, slotIdx) => {
      spiritIdsInSlot.forEach((spiritId) => {
        const spiritWrapper = getSpiritWrapper(spiritId);

        const slotPos = this.slots[slotIdx];

        if (avoidEnemy(spiritWrapper, MAINTAIN_DISTANCE_SQUARED)) {
          return;
        }

        const subTaskToPos = [
          this.initialSlots[slotIdx], slotPos, this.harassSlots[slotIdx],
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
