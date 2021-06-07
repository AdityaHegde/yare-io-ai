import {TargetPool, TargetPoolType} from "./TargetPool";
import {SpiritWrapper} from "../../wrappers/SpiritWrapper";
import {instanceSetInMemory} from "../../memory/instanceSetInMemory";
import {MemorySet} from "../../memory/MemorySet";
import {getInstance, getSpiritWrapper, getWrapperInstance} from "../../globals/globals";

export class EnemySpiritTargetPool extends TargetPool<Spirit, SpiritWrapper> {
  public targets = new MemorySet<SpiritWrapper>(
    [],
    (value) => value.entity.id,
    (value) => getSpiritWrapper(value),
  );

  public static tag = TargetPoolType.EnemySpirit;

  public getUpdatedTargets() {
    const targets = [];
    base.sight.enemies.filter(enemy => (enemy in spirits))
      .forEach(enemy => targets.push(getSpiritWrapper(enemy)));
    return targets;
  }
}
