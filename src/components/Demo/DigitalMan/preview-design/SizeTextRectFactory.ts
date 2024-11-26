import { BaseRectFactory, BaseRectFactoryOptions } from './BaseRectFactory'

export interface SizeTextRectFactoryOptions extends  BaseRectFactoryOptions{
  whText?: any;
  xyText?: any;
}

export class SizeTextRectFactory extends BaseRectFactory {
  whText: any;
  xyText: any;
  constructor(ctx: CanvasRenderingContext2D, options: SizeTextRectFactoryOptions) {
    super(ctx, options)
    this.type = 'sizeRect'
    // 设置默认圆角半径
    this.r = 4 * this.devicePixelRatio
    // 设置线条宽度
    this.lineWidth = 1 * this.devicePixelRatio
    this.strokeStyle = 'rgba(0, 0, 0, 0.16)'
    this.fillStyle = 'rgba(0, 0, 0, 0.5)'
    this.whText = options.whText
    this.xyText = options.xyText
  }

  init(options: SizeTextRectFactoryOptions) {
    const { whText, xyText } = options
    this.whText = whText
    this.xyText = xyText
    this.setPositionSize(options)
    this.draw()
  }

  /**
   * 绘制图形
   */
  draw() {
    super.draw()
    this.ctx.fillStyle = '#fff'
    this.ctx.font = 12 * this.devicePixelRatio + 'px Microsoft YaHei'
    this.ctx.fillText(this.whText[0], this.x + 10 * this.devicePixelRatio, this.y + 18 * this.devicePixelRatio)
    this.ctx.fillText(this.whText[1], this.x + 60 * this.devicePixelRatio, this.y + 18 * this.devicePixelRatio)
    this.ctx.fillText(this.xyText[0], this.x + 10 * this.devicePixelRatio, this.y + 36 * this.devicePixelRatio)
    this.ctx.fillText(this.xyText[1], this.x + 60 * this.devicePixelRatio, this.y + 36 * this.devicePixelRatio)
  }

  /**
   * 判断当前点击位置是否在图形内部
   * @param {*} x
   * @param {*} y
   * @returns
   */
  isInside(x: number, y: number) {
    return x >= this.minX - 2 && x <= this.maxX + 2 && y >= this.minY - 2 && y <= this.maxY + 2
  }
}
