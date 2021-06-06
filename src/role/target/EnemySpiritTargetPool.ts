import {TargetPool, TargetPoolType} from "./TargetPool";
import {SpiritWrapper} from "../../wrappers/SpiritWrapper";
import {instanceSetInMemory} from "../../memory/instanceSetInMemory";
import {MemorySet} from "../../memory/MemorySet";
import {getInstance, getWrapperInstance} from "../../globals/globals";

export class EnemySpiritTargetPool extends TargetPool<Spirit, SpiritWrapper> {
  public targets = new MemorySet<SpiritWrapper>(
    [],
    (value) => value.entity.id,
    (value) => getWrapperInstance(SpiritWrapper as any, spirits[value]) as SpiritWrapper,
  );

  public static tag = TargetPoolType.EnemySpirit;

  public getUpdatedTargets() {
    const targets = [];
    base.sight.enemies.filter(enemy => (enemy in spirits)).forEach(enemy => targets.push(
      getWrapperInstance(SpiritWrapper as any, spirits[enemy])
    ));
    // my_spirits.forEach(mySpirit => mySpirit.sight.enemies.forEach(enemy => targets.push(
    //   getWrapperInstance(SpiritWrapper as any, spirits[enemy])
    // )));
    return targets;
  }
}
