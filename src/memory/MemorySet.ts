export class MemorySet<T, K = string> extends Set<T> {
  private readonly memory: Array<K>;
  private readonly serializer: (value: T) => any;
  private readonly deserializer: (value: K) => T;
  private readonly map = new Map<K, T>();

  constructor(
    memory: Array<K>,
    serializer: (value: T) => any,
    deserializer: (value: K) => T
  ) {
    super();

    this.memory = memory;
    this.serializer = serializer;
    this.deserializer = deserializer;

    this.memory.forEach((memoryEntry) => {
      super.add(this.deserializer(memoryEntry));
    });
  }

  public get size(): number {
    return this.memory.length;
  }

  public add(value: T) {
    if (!this.has(value)) {
      super.add(value);
      const memoryEntry = this.serializer(value);
      this.map.set(memoryEntry, value);
      this.memory.push(memoryEntry);
    }
    return this;
  }

  public delete(value: T) {
    if (this.has(value)) {
      super.delete(value);
      const memoryEntry = this.serializer(value);
      this.map.delete(memoryEntry);
      this.memory.splice(this.memory.indexOf(memoryEntry), 1);
      return true;
    }
    return false;
  }

  public replace(arr: Array<T>) {
    this.memory.splice(0, this.memory.length);
    this.clear();
    arr.forEach((ele) => {
      this.add(ele);
    });
  }

  public get(memoryEntry: K): T {
    return this.map.get(memoryEntry);
  }
}
