import { Logger } from "./utils/Logger";

export class BaseClass {
  public id: string;
  public static className: string;
  public static memoryName: string;
  public static idProperty: string;

  protected logger: Logger;

  constructor(id: string) {
    this.id = id;
  }

  public destroy() {
    const BaseClazz: typeof BaseClass = this.constructor as any;
    delete memory[BaseClazz.memoryName][this[BaseClazz.idProperty]];
  }

  public static getInstanceById<EntityType extends Intractable>(id: string): BaseClass {
    return new (this as any)(id);
  }
}
