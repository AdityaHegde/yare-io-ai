import { MemoryMap } from "./MemoryMap";

/**
 * Defines a property which acts as a map. Stored serialized but used deserialized.
 *
 * @param [serializer] Function to serialize value to be stored in memory. Defaults to storing value as is.
 * @param [deserializer] Function to deserialize value retrieved from memory. Defaults to returning value as is.
 */
export function mapInMemory<T>(
  serializer: (value: T) => any = (value: T): any => value,
  deserializer: (key: string, value: any) => T = (key, value): T => value,
): any {
  return function(classPrototype: any, fieldName: string, descriptor: any) {
    const _fieldName = "_" + fieldName;
    descriptor = descriptor || {};

    descriptor.get = function () {
      // if map is not cached, assign _mapValue and get the instance for any stored ids in memory
      if (!this[_fieldName]) {
        // if map is not in memory, assign mapValue to memory
        if (!this.memory[fieldName]) {
          this.memory[fieldName] = {};
        }
        this[_fieldName] = new MemoryMap<T>(this.memory[fieldName], serializer, deserializer);
      }
      return this[_fieldName];
    };

    return descriptor;
  };
}
