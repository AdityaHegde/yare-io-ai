import {BaseClass} from "../BaseClass";

export class BaseWrapper<EntityType extends Intractable> extends BaseClass {
  public readonly entity: EntityType;

  constructor(entity: EntityType) {
    super(entity.id);
    this.entity = entity;
  }

  public static getInstanceByEntity<EntityType extends Intractable>(entity: EntityType): BaseWrapper<EntityType> {
    return new this(entity);
  }
}
