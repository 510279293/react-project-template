
import { BaseRectFactory, BaseRectFactoryOptions } from './BaseRectFactory';
 
export interface ResizeRectFactoryOptions extends  BaseRectFactoryOptions{
 w?: number;
 h?: number;
 x?: number;
 y?: number;
 noback?: boolean;
}
 
export class ResizeRectFactory extends BaseRectFactory {

 constructor(ctx: CanvasRenderingContext2D, options: ResizeRectFactoryOptions) {
   super(ctx, options);
   this.type = 'resizeRect';
   this.r = 0;
   this.lineWidth = 2 * this.devicePixelRatio;
   this.strokeStyle = options.noback ? '#ffffff' : '#ff9a2e';
   this.fillStyle = 'rgba(255, 255, 255, 1)';
   this.setPositionSize(options);
 }
 
 /**
  * Checks if the given coordinates are inside the rectangle.
  * @param x The x coordinate.
  * @param y The y coordinate.
  * @returns A boolean indicating if the point is inside the rectangle.
  */
 public isInside(x: number, y: number): boolean {
   const margin = 6 * this.devicePixelRatio;
   return x >= this.minX - margin && x <= this.maxX + margin && y >= this.minY - margin && y <= this.maxY + margin;
 }
}