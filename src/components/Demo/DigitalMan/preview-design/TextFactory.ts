import { BaseRectFactory, BaseRectFactoryOptions } from './BaseRectFactory'

export type TextConfig = {
  fontContent?: any;
  fontColor?: string;
  fontFamily?: string;
  fontSize: number
}

export interface TextFactoryOptions extends  BaseRectFactoryOptions{
  zoomRatio: any
  fontSize: any
  fontFamily: any
  fontColor: any
  fontContent: any
  lineHeight: any
  isSubtitlesConfig: any;
  textConfig: TextConfig
}


export class TextFactory extends BaseRectFactory{
  zoomRatio: any
  fontSize: any
  fontFamily: any
  fontColor: any
  fontContent: any
  lineHeight: any
  isSubtitlesConfig: any
  textConfig: TextConfig = {
    fontContent: '',
    fontColor: '#333',
    fontFamily: 'Arial',
    fontSize: 14,
  };
  constructor(ctx: CanvasRenderingContext2D, options: TextFactoryOptions) {
    super(ctx, options)
    this.options = options
    this.type = 'text'
    this.ctx = ctx
    this.setAttrs(options)
    this.selected = false
  }

  init(options: TextFactoryOptions) {
    this.setPositionSize(options)
    this.setAttrs(options)
    this.draw()
  }

  setAttrs(options: TextFactoryOptions){
    const { textConfig, zoomRatio, isSubtitlesConfig } = options
    this.fontContent = textConfig?.fontContent
    this.fontColor = textConfig?.fontColor
    this.fontFamily = textConfig?.fontFamily
    this.fontSize = textConfig.fontSize * this.zoomRatio
    this.zoomRatio = zoomRatio
    this.lineHeight = this.fontSize
    this.isSubtitlesConfig = isSubtitlesConfig
  }

  // 获取文字的宽高
  getSizeByText(fontContent = this.fontContent) {
    const fontSize = this.fontSize
    const arrLine = fontContent.split('\n')
    let width = 0
    let height = fontSize * 1.05 + 6 * this.zoomRatio
    for (let i = 0; i < arrLine.length; i++) {
      const metrics = this.ctx.measureText(arrLine[i])
      const textWidth = metrics.width
      width = Math.max(textWidth, width)
      if (i > 0) {
        height += fontSize * 1.2
      }
    }
    return {
      width, height
    }
  }

  /**
   * 绘制文字
   */
  draw() {
    let x = this.x + 20 * this.zoomRatio
    let y = this.y + 20 * this.zoomRatio + this.lineHeight
    this.ctx.fillStyle = this.fontColor
    this.ctx.font = `${this.fontSize}px ${this.fontFamily}`

    let arrLine = this.fontContent.split('\n')
    // 字幕设置换行
    if(this.isSubtitlesConfig) {
      // 字幕不要上下间隔
      y = this.y + this.lineHeight * 0.9
      let newFontContent = ''
      let fontContent = this.fontContent
      for(let i = 0; i < fontContent.length; i++) {
        // 累加文字，宽度和总宽度对比，如果大于总宽度，换行
        const textWidth = this.getSizeByText(fontContent.slice(0, i + 1)).width
        if(textWidth > this.w) {
          newFontContent += '\n' + fontContent[i]
          fontContent = fontContent.slice(i)
          i = 0
        } else {
          newFontContent += fontContent[i]
        }
      }
      arrLine = newFontContent.split('\n')
      const { height } = this.getSizeByText(newFontContent)
      this.h = height
    }
    
    
    for (let i = 0; i < arrLine.length; i++) {
      if(this.isSubtitlesConfig) {
        // 文本居中显示
        const { width } = this.getSizeByText(arrLine[i])
        x += (this.w - width) / 2
        // 黑色描边
        this.ctx.strokeStyle = '#000000'
        this.ctx.lineWidth = 2
        this.ctx.strokeText(arrLine[i], x, y)
      }
      
      this.ctx.fillText(arrLine[i], x, y)
      y += this.lineHeight * 1.2
    }
  }
}
