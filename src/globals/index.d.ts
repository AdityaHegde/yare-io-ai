interface Sight {
  friends: Array<string>;
  friends_beamable: Array<string>;
  enemies: Array<string>;
  enemies_beamable: Array<string>;
  structures: Array<string>;
}

type Position = [number, number];

interface Entity {
  id: string;
  position: Position;
  size: number;
  energy_capacity: number;
  energy: number;
  hp: number;
  sight: Sight;
}

interface Structure extends Pick<Entity, "id" | "position"> {
  structure_type: string;
}

interface Base extends Entity, Structure {}

interface Outpost extends Entity, Structure {
  range: number;
  control: string;
}

interface Energy extends Structure {
  energy: number;
}

type EnergyEntity = Spirit | Base;
type EnergySupply = Base | Outpost;
type Intractable = EnergyEntity | Energy;

interface Spirit extends Entity {
  mark: string;
  move: (position: Position) => void;
  energize: (target: Intractable) => void;
  merge: (target: Spirit) => void;
  divide: () => void;
  jump: (position: Position) => void;
  shout: (message: string) => void;
  set_mark: (label: string) => void;
}

declare const spirits: Record<string, Spirit>;
declare const my_spirits: Spirit[];
declare const base: Base;
declare const enemy_base: Base;
declare const star_zxq: Energy;
declare const star_a1c: Energy;
declare const star_p89: Energy;
declare const outpost: Outpost;
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
