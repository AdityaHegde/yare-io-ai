import {SpiritGroupType} from "./SpiritGroupType";
import {InitialGroup} from "./InitialGroup";
import {HarvestChain} from "./HarvestChain";
import {SentryLine} from "./SentryLine";
import {PatrolArmy} from "./PatrolArmy";

export type GroupsMapType = {
  [SpiritGroupType.InitialGroup]: InitialGroup,
  [SpiritGroupType.HarvestChain]: HarvestChain,
  [SpiritGroupType.SentryLine]: SentryLine,
  [SpiritGroupType.BaseDefenceArmy]: PatrolArmy,
  [SpiritGroupType.BaseAttackArmy]: PatrolArmy,
}
