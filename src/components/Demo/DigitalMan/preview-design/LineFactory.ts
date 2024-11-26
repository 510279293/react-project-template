import { BaseRectFactory, BaseRectFactoryOptions } from './BaseRectFactory';
 
export interface LineFactoryOptions extends BaseRectFactoryOptions {
  color?: string;
}
 
export class LineFactory extends BaseRectFactory {
  private color: string;
  
  constructor(ctx: CanvasRenderingContext2D, options: LineFactoryOptions) {
    super(ctx, options);
    this.type = 'LineRect';
    this.color = options.color || '#1476ff';
    this.draw();
  }
  
  public init(options: LineFactoryOptions): void {
    this.setPositionSize(options);
    this.color = options.color || this.color;
    this.draw();
  }
  
  // 画线
  public drawLine(beginX: number, beginY: number, endX: number, endY: number, color: string, width: number): void {
    this.ctx.beginPath();
    this.ctx.moveTo(beginX, beginY);
    this.ctx.lineTo(endX, endY);
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = width;
    this.ctx.stroke(); // Note that we use stroke() instead of fill() for lines
  }
  
  /**
   * 绘制刻度
   */
  public draw(): void {
    this.drawLine(this.x, this.y, this.x + this.w, this.y + this.h, this.color, 1);
  }
}