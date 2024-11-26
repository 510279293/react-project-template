import { BaseRectFactory, BaseRectFactoryOptions } from './BaseRectFactory';
 
export type NavRectFactoryOptions = BaseRectFactoryOptions
 
export class NavRectFactory extends BaseRectFactory {
 constructor(ctx: CanvasRenderingContext2D, options: NavRectFactoryOptions) {
   super(ctx, options);
   this.type = 'navRect';
   this.r = 4 * this.devicePixelRatio;
   this.strokeStyle = 'rgba(255, 255, 255, 0)';
 }
 
 // 如果有NavRectFactory特有的方法，可以在这里定义
}