import { v4 as uuidv4 } from "uuid";
export interface BaseRectFactoryOptions {
  isStop?: any;
  onchangeShape?: any;
  index?: any;
  onAllDraw?: any;
  w?: number;
  h?: number;
  x?: number;
  y?: number;
  devicePixelRatio?: number;
}

export class BaseRectFactory {
  public type: string;
  public ctx: CanvasRenderingContext2D;
  public devicePixelRatio: number;
  public mouseover: boolean;
  public selected: boolean;
  public r: number;
  public lineWidth: number;
  public strokeStyle: string;
  public fillStyle: string;
  public options: BaseRectFactoryOptions;
  public uuid: string;
  public w = 100;
  public h = 100;
  public x = 0;
  public y = 0;
  constructor(ctx: CanvasRenderingContext2D, options: BaseRectFactoryOptions) {
    this.type = "baseRect";
    this.ctx = ctx;
    this.devicePixelRatio = options.devicePixelRatio || 1;
    this.mouseover = false;
    this.selected = false;
    this.r = 4 * this.devicePixelRatio;
    this.lineWidth = 1 * this.devicePixelRatio;
    this.strokeStyle = "#fff";
    this.fillStyle = "rgba(0, 0, 0, 0.5)";
    this.options = JSON.parse(JSON.stringify(options));
    this.uuid = this.randomStr();
    this.setPositionSize(options);
  }
  randomStr(): string {
    return uuidv4();
  }
  setPositionSize(options: BaseRectFactoryOptions): void {
    this.w = options.w || 100;
    this.h = options.h || 100;
    this.x = options.x || 0;
    this.y = options.y || 0;
  }
  init(options: BaseRectFactoryOptions): void {
    this.setPositionSize(options);
    this.draw();
  }
  get minX(): number {
    return this.x;
  }
  get maxX(): number {
    return this.x + this.w;
  }
  get minY(): number {
    return this.y;
  }
  get maxY(): number {
    return this.y + this.h;
  }
  draw(): void {
    this.ctx.beginPath();
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.strokeStyle = this.strokeStyle;
    this.ctx.fillStyle = this.fillStyle;
    this.ctx.moveTo(this.x + this.w - this.r, this.y);
    this.ctx.arcTo(
      this.x + this.w,
      this.y,
      this.x + this.w,
      this.y + this.r,
      this.r
    );
    this.ctx.arcTo(
      this.x + this.w,
      this.y + this.h,
      this.x + this.w - this.r,
      this.y + this.h,
      this.r
    );
    this.ctx.arcTo(
      this.x,
      this.y + this.h,
      this.x,
      this.y + this.h - this.r,
      this.r
    );
    this.ctx.arcTo(this.x, this.y, this.x + this.r, this.y, this.r);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
  }
  public isInside(x: number, y: number): boolean {
    return x >= this.minX && x <= this.maxX && y >= this.minY && y <= this.maxY;
  }
}
