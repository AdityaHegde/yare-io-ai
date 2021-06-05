import { mapInMemory } from "./mapInMemory";
import {BaseClass} from "../BaseClass";
import {getInstance} from "../globals/globals";

/**
 * Defines a property which references a map of instances in memory by id.
 */
export function instanceMapInMemory<T extends BaseClass>(ClassObject): any {
  return mapInMemory<T>((value) => {
    return value && value[ClassObject.idProperty];
  }, (key, value) => {
    return getInstance(ClassObject, value) as T;
  });
}
