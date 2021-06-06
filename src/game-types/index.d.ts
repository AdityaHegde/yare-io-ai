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
  move: (position: Position) => void;
  energize: (target: Intractable) => void;
  merge: (target: Spirit) => void;
  divide: () => void;
}

declare const spirits: { [key: string]: Spirit };
declare const my_spirits: Spirit[];
declare const base: Base;
declare const enemy_base: Base;
declare const star_zxq: Energy;
declare const star_a1c: Energy;
declare const memory: {
  init: boolean;
  ids: Record<string, number>;
} & Record<string, any>;

