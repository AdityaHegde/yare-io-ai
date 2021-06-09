interface Sight {
  friends: string[];
  enemies: string[];
  structures: string[];
}

type Position = [number, number];

interface Common {
  id: string;
  position: Position;
  size: number;
  energy_capacity: number;
  energy: number;
  hp: number;
  sight: Sight;
}

interface Structure extends Pick<Common, "id" | "position"> {
  structure_type: string;
}

interface Base extends Common, Structure {}

interface Energy extends Structure {}

type EnergyEntity = Spirit | Base;
type Intractable = EnergyEntity | Energy;

interface Spirit extends Common {
  mark: string;
  move: (position: Position) => void;
  energize: (target: Intractable) => void;
  merge: (target: Spirit) => void;
  divide: () => void;
  shout: (message: string) => void;
  set_mark: (label: string) => void;
}

declare const spirits: Record<string, Spirit>;
declare const my_spirits: Spirit[];
declare const base: Base;
declare const enemy_base: Base;
declare const star_zxq: Energy;
declare const star_a1c: Energy;
declare const memory: {
  tick: number;
  ids: Record<string, number>;
  baseStar: string;
  started: boolean;

  uniqueEnemies: Array<string>;
  lastSeenTick: number;
  underAttack: boolean;

  spirits: Record<string, Record<string, any>>;
} & Record<string, any>;
