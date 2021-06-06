import * as PIXI from "pixi.js";

export class RenderObject {
  public readonly entity: Intractable;
  public thing: PIXI.Graphics;

  constructor(entity: Intractable) {
    this.entity = entity;
  }

  public init(): PIXI.Graphics {
    this.thing = new PIXI.Graphics();
    this.thing.lineStyle(1, 0xFEEB77, 1);
    this.thing.beginFill(0x650A5A, 1);
    this.thing.drawCircle(0, 0, 5);
    this.thing.endFill();
    this.draw();
    return this.thing;
  }

  public draw() {
    this.thing.x = this.entity.position[0];
    this.thing.y = this.entity.position[1];
  }

  public destroy() {
    this.thing.destroy();
  }
}
