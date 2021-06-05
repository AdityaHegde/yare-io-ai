import { setInMemory } from "./setInMemory";
import {BaseClass} from "../BaseClass";
import {getInstance} from "../globals/globals";

/**
 * Defines a property which references a set of instances in memory by id.
 */
export function instanceSetInMemory<T extends BaseClass>(ClassObject): any {
  return setInMemory<T>((value) => {
    return value && value[ClassObject.idProperty];
  }, (value) => {
    return getInstance(ClassObject, value) as T;
  });
}
