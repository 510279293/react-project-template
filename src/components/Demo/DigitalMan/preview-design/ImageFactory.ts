import { BaseRectFactory, BaseRectFactoryOptions } from './BaseRectFactory'
import noCover from '@/assets/preview-design/no-cover.png'

export interface ImageFactoryOptions extends BaseRectFactoryOptions {
  isFill?: boolean
  zoomRatio?: any
  noback?: boolean
  src?: any
  reloadImage?: boolean
  fillImg?: any
  firstLoad?: boolean
  defaultImgSrc?: string
  onAllDraw?: any
}

export class ImageFactory extends BaseRectFactory {
  isFill: boolean
  zoomRatio: any
  noback: boolean
  src: any
  reloadImage: boolean
  fillImg: any
  firstLoad: boolean
  defaultImgSrc: string
  onAllDraw: any
  constructor(ctx: CanvasRenderingContext2D, options: ImageFactoryOptions) {
    super(ctx, options)
    this.type = 'image'
    this.ctx = ctx
    const { src, isFill, zoomRatio, reloadImage, noback } = options
    this.isFill = Boolean(isFill)
    this.zoomRatio = zoomRatio
    this.noback = Boolean(noback)
    this.src = src
    this.reloadImage = Boolean(reloadImage)
    this.fillImg = null
    this.selected = false
    this.firstLoad = true
    // this.defaultImgSrc = (window).CDNAddress + './assets/preview-design/no-cover.png'
    this.defaultImgSrc = noCover
    this.onAllDraw = options.onAllDraw
  }

  async init(options: ImageFactoryOptions) {
    this.setPositionSize(options)
    const { src, isFill, zoomRatio, reloadImage, noback } = options
    this.src = src
    this.noback = Boolean(noback)
    this.reloadImage = Boolean(reloadImage)
    if (this.reloadImage) {
      this.fillImg = null
      this.reloadImage = false
    }
    this.isFill = Boolean(isFill)
    this.zoomRatio = zoomRatio
    await this.draw()
  }

  /**
   * 绘制图形
   */
  draw() {
    return new Promise<void>((resolve) => {
      if (!this.fillImg && this.firstLoad) {
        const fillImg = new Image();
        fillImg.src = this.src;
        this.firstLoad = false;
        const conW = this.ctx.canvas.width
        const conH = this.ctx.canvas.height
        fillImg.onload = () => {
          this.fillImg = fillImg
          this.drawImage()
          this.x = 0
          this.y = 0
          this.w = conW
          this.h = conH
          if (this.onAllDraw) {
            this.onAllDraw()
          }
          resolve()
        }
        fillImg.onerror = (event) => {
          fillImg.src = this.defaultImgSrc
        }
      } else if (this.fillImg) {
        this.drawImage()
        resolve()
      }
    })
  }

  drawImage() {
    if (this.isFill) {
      const conW = this.ctx.canvas.width
      const conH = this.ctx.canvas.height
      const w = (this.fillImg.width * this.zoomRatio);
      const h = (this.fillImg.height * this.zoomRatio);
      let dw: any = conW / w; // canvas  与图片的宽高比 1080 / 2160
      let dh: any = conH / h; // 1920 / 3840
      dw = (Math.round(dw * 100) / 100).toFixed(2)
      dh = (Math.round(dh * 100) / 100).toFixed(2)
      if (conW < conH) {
        this.setImgSizeH(w, h, conW, conH, dw, dh)
      } else {
        this.setImgSizeW(w, h, conW, conH, dw, dh)
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      this.ctx.fillStyle = this.ctx.createPattern(this.fillImg, 'no-repeat');
      const x = this.toFixed(this.minX)
      const y = this.toFixed(this.minY)
      const width = this.toFixed(this.w)
      const height = this.toFixed(this.h)
      if (this.noback) {
        const zoomRatioOfW = width / this.ctx.canvas.width;
        const zoomRatioOfH = height / this.ctx.canvas.height;
        this.ctx.drawImage(this.fillImg, zoomRatioOfW * x, zoomRatioOfH * y, zoomRatioOfW * this.fillImg.width, zoomRatioOfH * this.fillImg.heught, x, y, width, height);
        this.ctx.fillStyle = 'rgba(0,0,0,0.5)'
        this.ctx.fillRect(0, 0, x, this.ctx.canvas.height)
        this.ctx.fillRect(x + width, 0, this.ctx.canvas.width - x - width, this.ctx.canvas.height)
        this.ctx.fillRect(x, 0, width, y)
        this.ctx.fillRect(x, y + height, width, this.ctx.canvas.height - y - height)
      } else {
        this.ctx.drawImage(this.fillImg, x, y, width, height);
      }
    }
  }

  toFixed(value: number) {
    return Number((Math.round(value * 100) / 100).toFixed(2))
  }

  setImgSizeH(w: number, h: number, conW: number, conH: number, dw: number, dh: number) {
    if (w > conW && h > conH || w < conW && h < conH) {
      if (dw > dh) {
        // 图片宽度比页面的小，高度比页面小
        const sx = 0
        const sy = this.toFixed(this.backSize((h - conH / dw) / 2))
        const sWidth = this.toFixed(this.backSize(w))
        const sHeight = this.toFixed(this.backSize((h - conH / dw) / 2 + conH / dw))
        this.ctx.drawImage(this.fillImg, sx, sy, sWidth, sHeight, 0, 0, conW, conH);
      } else {
        this.setImgSizeOne(w, h, conW, conH, dw, dh)
      }
    } else {
      this.setImgSizeTwo(w, h, conW, conH, dw, dh)
    }
  }

  setImgSizeW(w: number, h: number, conW: number, conH: number, dw: number, dh: number) {
    // 9: 16 高宽比
    // 图片宽高都比页面大 或者 宽高 都比页面小
    if (w > conW && h > conH || w < conW && h < conH) {
      if (dw > dh) {
        const sx = 0
        const sy = this.toFixed(this.backSize((h - conH / dw) / 2))
        const sWidth = this.toFixed(this.backSize(w))
        const sHeight = this.toFixed(this.backSize(conH / dw))
        this.ctx.drawImage(this.fillImg, sx, sy, sWidth, sHeight, 0, 0, conW, conH);
      } else {
        this.setImgSizeOne(w, h, conW, conH, dw, dh)
      }
    } else {
      this.setImgSizeTwo(w, h, conW, conH, dw, dh)
    }
  }

  setImgSizeOne(w: number, h: any, conW: number, conH: number, dw: any, dh: number) {
    const sx = this.toFixed(this.backSize((w - conW / dh) / 2))
    const sy = 0
    const sWidth = this.toFixed(this.backSize(conW / dh))
    const sHeight = this.toFixed(this.backSize(h))
    this.ctx.drawImage(this.fillImg, sx, sy, sWidth, sHeight, 0, 0, conW, conH);
  }

  setImgSizeTwo(w: number, h: number, conW: number, conH: number, dw: number, dh: number) {
    if (w < conW) {
      const sx = 0
      const sy = this.toFixed(this.backSize((h - conH / dw) / 2))
      const sWidth = this.toFixed(this.backSize(w))
      const sHeight = this.toFixed(this.backSize(conH / dw))
      this.ctx.drawImage(this.fillImg, sx, sy, sWidth, sHeight, 0, 0, conW, conH);
    } else {
      const sx = this.toFixed(this.backSize((w - conW / dh) / 2))
      const sy = 0
      const sWidth = this.toFixed(this.backSize(conW / dh))
      const sHeight = this.toFixed(this.backSize(h))
      this.ctx.drawImage(this.fillImg, sx, sy, sWidth, sHeight, 0, 0, conW, conH);
    }
  }

  backSize(value: number) {
    return (value / this.zoomRatio)
  }
}
