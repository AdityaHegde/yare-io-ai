export class MemoryMap<T> extends Map<string, T> {
  private readonly memory: Record<string, string>;
  private readonly serializer: (value: T) => any;
  private readonly deserializer: (key: string, value: string) => T;

  constructor(
    memory: Record<string, string>,
    serializer: (value: T) => any,
    deserializer: (key: string, value: string) => T
  ) {
    super();

    this.memory = memory;
    this.serializer = serializer;
    this.deserializer = deserializer;
  }

  public get size(): number {
    return Object.keys(this.memory).length;
  }

  public set(key: string, value: T) {
    super.set(key, value);
    this.memory[key] = this.serializer(value);
    return this;
  }

  public has(key: string): boolean {
    return key in this.memory;
  }

  public get(key: string): T {
    if (!super.has(key) && (key in this.memory)) {
      this.set(key, this.deserializer(key, this.memory[key]));
    }
    return super.get(key);
  }

  public delete(key: string) {
    if (super.has(key) || (key in this.memory)) {
      super.delete(key);
      delete this.memory[key];
      return true;
    }
    return false;
  }

  public keys() {
    return Object.keys(this.memory) as any;
  }

  public forEach(method: (value: T, key: string, map: Map<string, T>) => void) {
    for (const key of this.keys()) {
      method(this.get(key), key, this);
    }
  }
}
