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

type Intractable = Spirit | Base | Energy;

interface Spirit extends Common {
  move: (position: Position) => void;
  energize: (target: Intractable) => void;
  merge: (target: Spirit) => void;
  divide: () => void;
}