/**
 * Defines a property which gets mirrored in memory. Prototype should have a property 'memory'
 */
export function inMemory<T>(
  getter: () => T = () => null,
  serializer: (value: T) => any = (value: T) => value,
  deserializer: (value: any) => T = (value: any) => value,
): any {
  return function(classPrototype: Object, fieldName: string, descriptor: any) {
    descriptor = descriptor || {};
    const _fieldName = "_" + fieldName;

    descriptor.get = function() {
      // if the property is not defined in cache yet, get it from memory
      if (!(_fieldName in this)) {
        // if the property is not present in the memory either, use the getter function passed to get the value and store in memory
        if (!(fieldName in this.memory)) {
          this[_fieldName] = getter.call(this);
          this.memory[fieldName] = this[_fieldName] && serializer.call(this, this[_fieldName]);
        } else {
          this[_fieldName] = deserializer.call(this, this.memory[fieldName]);
        }
      }
      // return from cache
      return this[_fieldName];
    };

    descriptor.set = function(value: T) {
      // save the serialized value to memory and value to cache
      this.memory[fieldName] = serializer.call(this, value);
      this[_fieldName] = value;
    };

    return descriptor;
  };
}
