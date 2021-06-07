import {SpiritWrapper} from "../../wrappers/SpiritWrapper";
import {globals} from "../../globals/globals";
import {Assigner} from "./Assigner";
import {Log} from "../../utils/Logger";
import {SpiritGroup} from "../../group/SpiritGroup";
import {InitialGroup} from "../../group/InitialGroup";
import {HarvestChain} from "../../group/HarvestChain";
import {SentryLine} from "../../group/SentryLine";
import {DefenceArmy} from "../../group/DefenceArmy";

const SENTRY_ACTIVATION_POINT = 10;

@Log
export class GroupAssigner extends Assigner {
  private readonly initialGroup: InitialGroup;
  private readonly harvesterGroup: HarvestChain;
  private readonly sentryLine: SentryLine;
  private readonly defenceArmy: DefenceArmy;

  constructor(id: string) {
    super(id);

    this.initialGroup = globals.groups[0] as InitialGroup;
    this.harvesterGroup = globals.groups[1] as HarvestChain;
    this.sentryLine = globals.groups[2] as SentryLine;
    this.defenceArmy = globals.groups[3] as DefenceArmy;
  }

  public assign(spiritWrapper: SpiritWrapper) {
    let selectedGroup: SpiritGroup;

    if (spiritWrapper.isFull()) {
      selectedGroup = this.initialGroup;
    } else {
      if (this.harvesterGroup.totalSpiritCount >= SENTRY_ACTIVATION_POINT && this.sentryLine.hasSpace()) {
        selectedGroup = this.sentryLine;
      } else {
        selectedGroup = this.harvesterGroup;
      }
    }

    if (selectedGroup) {
      selectedGroup.addSpirit(spiritWrapper);
    }
  }
}
