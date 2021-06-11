import {SpiritGroupType} from "./SpiritGroupType";
import {HarvestChain} from "./harvest-chain/HarvestChain";
import {SentryLine} from "./SentryLine";
import {PatrolArmy} from "./PatrolArmy";
import {Harasser} from "./Harasser";

export type GroupsMapType = {
  [SpiritGroupType.HarvestChain]: HarvestChain,
  [SpiritGroupType.SentryLine]: SentryLine,
  [SpiritGroupType.BaseDefenceArmy]: PatrolArmy,
  [SpiritGroupType.BaseAttackArmy]: PatrolArmy,
  [SpiritGroupType.Harasser]: Harasser,
}
