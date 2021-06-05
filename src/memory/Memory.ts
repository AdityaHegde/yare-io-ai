import { BaseClass } from "../BaseClass";

const ClassNameRegex = /class (\w*)/;
const FunctionNameRegex = /\[Function: (.*)]/;

/**
 * Adds memory support to the class.
 */
export function Memory(memoryName: string, idProperty: string = "id"): any {
  return function(classObject: typeof BaseClass) {
    const classMatch = classObject.toString().match(ClassNameRegex);
    const functionMatch = classObject.toString().match(FunctionNameRegex);
    const className = (classMatch && classMatch[1]) ||
      (functionMatch && functionMatch[1]);

    classObject.className = className.toLowerCase();
    classObject.memoryName = memoryName;
    classObject.idProperty = idProperty;

    // define a property "memory" that gets an object
    // from memory space of class from Screeps's Memory
    Object.defineProperty(classObject.prototype, "memory", {
      get: function() {
        // if a memory space for this class doesnt exist
        // create one under Screeps's Memory
        if (!memory[memoryName]) {
          memory[memoryName] = {};
        }
        // if a memory object doesnt exisit in class's memory space
        // create one under the class's memory space
        if (!memory[memoryName][this[idProperty]]) {
          memory[memoryName][this[idProperty]] = {};
        }
        return memory[memoryName][this[idProperty]];
      },
      enumerable: true,
      configurable: true
    });
  };
}
