import {SpiritGroupType} from "./SpiritGroupType";
import {HarvestChain} from "./harvest-chain/HarvestChain";
import {SentryLine} from "./SentryLine";
import {PatrolArmy} from "./PatrolArmy";
import {Harasser} from "./Harasser";
import {SimpleHarvester} from "./SimpleHarvester";

export type GroupsMapType = {
  [SpiritGroupType.Harvester]: HarvestChain | SimpleHarvester,
  [SpiritGroupType.MidStarHarvester]: HarvestChain | SimpleHarvester,
  [SpiritGroupType.SentryLine]: SentryLine,
  [SpiritGroupType.BaseDefenceArmy]: PatrolArmy,
  [SpiritGroupType.BaseAttackArmy]: PatrolArmy,
  [SpiritGroupType.Harasser]: Harasser,
}
