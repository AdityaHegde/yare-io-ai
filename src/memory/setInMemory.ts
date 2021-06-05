import { MemorySet } from "./MemorySet";

/**
 * Defines a property which acts as a set. Stored serialized but used deserialized.
 *
 * @param [serializer] Function to serialize value to be stored in memory. Defaults to storing value as is.
 * @param [deserializer] Function to deserialize value retrieved from memory. Defaults to returning value as is.
 */
export function setInMemory<T>(
  serializer: (value: T) => any = (value: T): any => value,
  deserializer: (value: any) => T = (value: any): T => value,
): any {
  return function(classPrototype: any, fieldName: string, descriptor: any) {
    descriptor = descriptor || {};
    const _fieldName = "_" + fieldName;

    descriptor.get = function () {
      // if set is not cached, assign _mapValue and get the instance for any stored ids in memory
      if (!this[_fieldName]) {
        // if set is not in memory, assign mapValue to memory
        if (!this.memory[fieldName]) {
          this.memory[fieldName] = [];
        }
        this[_fieldName] = new MemorySet<T>(this.memory[fieldName], serializer, deserializer);
      }
      return this[_fieldName];
    };

    return descriptor;
  }
}
