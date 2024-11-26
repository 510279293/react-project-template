import { BaseRectFactory, BaseRectFactoryOptions } from './BaseRectFactory';
 
export interface ActionTextRectOptions extends BaseRectFactoryOptions {
 tipText?: string;
}
 
export class ActionTextRectFactory extends BaseRectFactory {
 private tipText: string;
 
 constructor(ctx: CanvasRenderingContext2D, options: ActionTextRectOptions) {
   super(ctx, options);
   this.type = 'sizeRect';
   this.r = 4 * this.devicePixelRatio;
   this.lineWidth = 1 * this.devicePixelRatio;
   this.strokeStyle = 'rgba(0, 0, 0, 0.16)';
   this.fillStyle = 'rgba(0, 0, 0, 0.5)';
   this.tipText = options.tipText || '';
 }
 
 public init(options: ActionTextRectOptions): void {
   this.tipText = options.tipText || this.tipText;
   this.setPositionSize(options);
   this.draw();
 }
 
  /**
   * 绘制图形
  */
 public draw(): void {
   super.draw();
   this.ctx.fillStyle = '#f9f9f9';
   const fontSize = 12 * this.devicePixelRatio;
   this.ctx.font = `${fontSize}px Microsoft YaHei`;
   this.ctx.fillText(this.tipText, this.x + 12 * this.devicePixelRatio, this.y + 18 * this.devicePixelRatio);
 }
 
 /**
   * 判断当前点击位置是否在图形内部
   * @param {*} x
   * @param {*} y
   * @returns
   */
 public isInside(x: number, y: number): boolean {
   return x >= this.minX - 2 && x <= this.maxX + 2 && y >= this.minY - 2 && y <= this.maxY + 2;
 }
}