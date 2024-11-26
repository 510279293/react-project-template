
import { BaseRectFactory, BaseRectFactoryOptions } from './BaseRectFactory'
import { ResizeRectFactory, ResizeRectFactoryOptions } from './ResizeRectFactory'
import { ImageFactory, ImageFactoryOptions } from './ImageFactory'
import { VideoShapeFactory } from './VideoShapeFactory'
import { TextConfig, TextFactory } from './TextFactory'
import noCover from '@/assets/preview-design/no-cover.png'

interface ImageBoxFactoryOptions extends ImageFactoryOptions {
  isFixedRatio: any
  isCopy: any
  isApply: any
  isHiddenDelete: any
  isHiddenLayers: any
  isSubtitlesConfig: any
  reloadImage: boolean
  isStop: any
  isLoading: boolean
  onAllDraw: any
  onchangeShape: any
  topLeftHandler: any
  bottomRrightHandler: null
  topCenterHandler: null
  topRightHandler: null
  leftCenterHandler: null
  rightCenterHandler: null
  bottomLeftHandler: null
  bottomCenterHandler: null
  defaultImgSrc: string
  isNoCover: boolean
  src: any
  layer_type: any
  video_url: any
  topToolShape: null
  status: null
  video: any
  childShape: any
  topLeftOptions: ResizeRectFactoryOptions
  topCenterOptions: ResizeRectFactoryOptions
  topRightOptions: ResizeRectFactoryOptions
  leftCenterOptions: ResizeRectFactoryOptions
  rightCenterOptions: ResizeRectFactoryOptions
  bottomLeftOptions: ResizeRectFactoryOptions
  bottomCenterOptions: ResizeRectFactoryOptions
  bottomRightOptions: ResizeRectFactoryOptions
  textConfig: TextConfig
  childShapeOptions: any
}


/**
 * 画矩形模块
 */
export class ImageBoxFactory extends BaseRectFactory {
  noback: any
  index: any
  zoomRatio: any
  isFixedRatio: any
  isCopy: any
  isApply: any
  isHiddenDelete: any
  isHiddenLayers: any
  isSubtitlesConfig: any
  reloadImage!: boolean
  isStop: any
  isLoading!: boolean
  onAllDraw: any
  onchangeShape: any
  topLeftHandler: any
  bottomRrightHandler: any
  topCenterHandler: any
  topRightHandler: any
  leftCenterHandler: any
  rightCenterHandler: any
  bottomLeftHandler: any
  bottomCenterHandler: any
  defaultImgSrc!: string
  isNoCover!: boolean
  src: any
  layer_type: any
  video_url: any
  topToolShape!: null
  status!: null
  video: any
  childShape: any
  topLeftOptions!: ResizeRectFactoryOptions
  topCenterOptions!: ResizeRectFactoryOptions
  topRightOptions!: ResizeRectFactoryOptions
  leftCenterOptions!: ResizeRectFactoryOptions
  rightCenterOptions!: ResizeRectFactoryOptions
  bottomLeftOptions!: ResizeRectFactoryOptions
  bottomCenterOptions!: ResizeRectFactoryOptions
  bottomRightOptions!: ResizeRectFactoryOptions
  textConfig!: TextConfig
  childShapeOptions: any
  /**
   * @w 矩形宽度
   * @h 矩形高度
   * @x x轴位置
   * @y y轴位置
   */
  constructor(ctx: CanvasRenderingContext2D, options: ImageBoxFactoryOptions) {
    super(ctx, options)
    this.ctx = ctx
    this.noback = options.noback
    this.setDefaultAttr(options)
    this.setDefaultHandler()
    this.setDefaultSize(options)
  }

  setDefaultAttr(options: ImageBoxFactoryOptions) {
    const {
      zoomRatio,
      isFixedRatio,
      isCopy,
      isApply,
      isHiddenDelete,
      isHiddenLayers,
      isSubtitlesConfig,
      reloadImage,
    } = options
    this.type = 'ImageBox'
    this.index = options.index
    this.zoomRatio = zoomRatio
    this.isFixedRatio = isFixedRatio
    this.isCopy = isCopy
    this.isApply = isApply
    this.isHiddenDelete = isHiddenDelete
    this.isHiddenLayers = isHiddenLayers
    this.isSubtitlesConfig = isSubtitlesConfig
    this.reloadImage = Boolean(reloadImage)
    this.mouseover = false
    this.selected = false
    this.options = options
    this.textConfig = options.textConfig
    this.onchangeShape = options.onchangeShape
    this.onAllDraw = options.onAllDraw
    this.isLoading = false
    // 设置默认圆角半径
    this.r = 0
    // 设置线条宽度
    this.lineWidth = 2 * this.devicePixelRatio
    this.strokeStyle = 'rgba(0, 0, 0, 1)'
    this.fillStyle = 'rgba(0, 0, 0, 0)'
    this.isStop = options.isStop
  }
  setDefaultHandler() {
    this.topLeftHandler = null
    this.topCenterHandler = null
    this.topRightHandler = null
    this.leftCenterHandler = null
    this.rightCenterHandler = null
    this.bottomLeftHandler = null
    this.bottomCenterHandler = null
    this.bottomRrightHandler = null
    // this.defaultImgSrc = (window).CDNAddress + './assets/preview-design/no-cover.png'
    this.defaultImgSrc = noCover
    this.isNoCover = false
  }

  setDefaultSize(options: ImageBoxFactoryOptions) {
    const {
      x: ox,
      y: oy,
      w: ow,
      h: oh,
      src,
      layer_type,
      video_url
    } = options
    const h = oh || 0
    const w = ow || 0
    const x = ox || 0
    const y = ox || 0
    if (h >= w && w < 2 * this.r) {
      this.r = (w / 2)
    } else if (w > h && h < 2 * this.r) {
      this.r = (h / 2)
    }
    this.r = this.r * this.zoomRatio
    this.src = src
    this.layer_type = layer_type ? layer_type : ''
    this.video_url = video_url ? video_url : ''
    const isEmpty = (value: any) => {
      return value === null || value === undefined
    }
    const hasEmptyValue = isEmpty(w) || isEmpty(h) || isEmpty(x) || isEmpty(y)
    if (hasEmptyValue) {
      this.setSizeEmpty()
    } else {
      this.w = (w * this.zoomRatio)
      this.h = (h * this.zoomRatio)
      this.x = (x * this.zoomRatio)
      this.y = (y * this.zoomRatio)
      this.topToolShape = null
      this.status = null
      if (!this.isLoading) {
        this.initImage()
      }
    }
  }

  setSizeEmpty() {
    if (this.layer_type === 'VIDEO') {
      this.setSizeByVideo()
    } else if (this.layer_type === 'TEXT') {
      this.setSizeByText()
    } else {
      this.setSizeByImage()
    }
  }

  setSizeByText() {
    const fontSize = this.textConfig.fontSize * this.zoomRatio
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.ctx.fillStyle = this.textConfig.fontColor
    this.ctx.font = `${fontSize}px ${this.textConfig.fontFamily}`
    const arrLine = this.textConfig.fontContent.split('\n')
    let width = 0
    let height = fontSize + 60 * this.zoomRatio
    for (let i = 0; i < arrLine.length; i++) {
      const metrics = this.ctx.measureText(arrLine[i])
      const textWidth = metrics.width
      width = Math.max(textWidth, width)
      if (i > 0) {
        height += fontSize * 1.2
      }
    }
    this.w = (width + 40 * this.zoomRatio)
    this.h = height
    if (this.x === null || this.x === undefined ||
      this.y === null || this.y === undefined) {
      this.setSize()
    } else {
      const { x, y } = this.options
      this.x = (x||1 * this.zoomRatio)
      this.y = (y||1 * this.zoomRatio)
      this.initImage()
      if (this.onchangeShape) {
        this.onchangeShape(this)
      }
    }
  }

  setSizeByVideo() {
    if (this.video) {
      return
    }
    this.isLoading = true
    this.video = document.createElement('video')
    this.video.crossOrigin = 'anonymous'
    this.video.width = 400
    this.video.height = 240
    this.video.preload = 'metadata'
    this.video.src = this.video_url
    this.video.loop = true
    this.video.autoplay = true
    this.video.muted = true
    this.video.play()
    this.video.addEventListener('loadeddata', () => {
      try {
        const width = this.video.videoWidth
        const height = this.video.videoHeight
        this.w = (width * this.zoomRatio)
        this.h = (height * this.zoomRatio)
      } catch (err) {
        this.w = 48 * this.zoomRatio
        this.h = 48 * this.zoomRatio
      }
      this.setSize()
      this.isLoading = false
      if (this.onAllDraw) {
        this.onAllDraw()
      }
    })
  }

  setSizeByImage() {
    if (this.isLoading) {
      return
    }
    this.isLoading = true
    const fillImg = new Image();
    fillImg.src = this.src;
    fillImg.onload = () => {
      if (!this.isNoCover) {
        this.w = (fillImg.width * this.zoomRatio)
        this.h = (fillImg.height * this.zoomRatio)
      } else {
        this.w = fillImg.width
        this.h = fillImg.height
      }
      this.setSize()
      this.isLoading = false
      if (this.onAllDraw) {
        this.onAllDraw()
      }
    }
    fillImg.onerror = () => {
      fillImg.src = this.defaultImgSrc
      this.isNoCover = true
    }
  }

  setSize() {
    const conW = (this.ctx.canvas.width)
    const conH = (this.ctx.canvas.height)
    const dhw = this.h / this.w
    if (this.w > conW) {
      this.w = conW
      this.h = (conW * dhw)
    }
    // 如果时宽屏，宽度大于0.66 conw
    if (conW > conH && this.w > 0.66 * conW && this.layer_type !== 'HUMAN') {
      this.w = 0.66 * conW
      this.h = (0.66 * conW * dhw)
    }
    if (this.h > conH) {
      this.h = conH
      this.w = (conH / dhw)
    }
    this.x = ((conW / 2) - (this.w / 2))
    this.y = ((conH / 2) - (this.h / 2))
    this.topToolShape = null
    this.status = null
    this.initImage()
    if (this.onchangeShape) {
      this.onchangeShape(this)
    }
  }

  setShadow() {
    this.ctx.lineWidth = this.lineWidth
    this.ctx.strokeStyle = '#ff9a2e'
    this.ctx.shadowOffsetX = 2
    this.ctx.shadowOffsetY = 2
    this.ctx.shadowBlur = 2
    this.ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
  }
  /**
   * 绘制图形
   */
  draw() {
    this.ctx.beginPath()
    this.ctx.setLineDash([])
    if (this.selected) {
      if (!this.noback) {
        this.setShadow()
      }
    } else if (this.status === 'hover') {
      this.setShadow()
      if (!this.isSubtitlesConfig) {
        this.ctx.setLineDash([3, 7])
      }
    } else {
      this.ctx.lineWidth = this.lineWidth
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0)'
    }
    this.ctx.fillStyle = this.fillStyle
    this.ctx.moveTo(this.x + this.w - this.r, this.y)
    this.ctx.arcTo(this.x + this.w, this.y, this.x + this.w, this.y + this.r, this.r)
    this.ctx.arcTo(this.x + this.w, this.y + this.h, this.x + this.w - this.r, this.y + this.h, this.r)
    this.ctx.arcTo(this.x, this.y + this.h, this.x, this.y + this.h - this.r, this.r)
    this.ctx.arcTo(this.x, this.y, this.x + this.r, this.y, this.r)
    this.ctx.closePath()
    this.ctx.fill()
    this.ctx.stroke()
    this.ctx.shadowOffsetX = 0
    this.ctx.shadowOffsetY = 0
    this.ctx.shadowBlur = 0
    if (!this.isLoading) {
      this.initImage()
    }
    if (this.selected) {
      this.initResizeHandlers()
    }
  }

  /**
   * 判断当前点击位置是否在图形内部
   * @param {*} x
   * @param {*} y
   * @returns
   */
  isInside(x: number, y: number) {
    const insideImage = x >= this.minX &&
      x <= this.maxX &&
      y >= this.minY &&
      y <= this.maxY
    return insideImage
  }

  /**
   * 初始化图片或者视频
   */
  initImage() {
    this.childShapeOptions = {
      x: this.x + 1 * this.devicePixelRatio,
      y: this.y + 1 * this.devicePixelRatio,
      w: this.w - 2 * this.devicePixelRatio,
      h: this.h - 2 * this.devicePixelRatio,
      video_url: this.video_url,
      src: this.src,
      zoomRatio: this.zoomRatio,
      reloadImage: this.reloadImage,
      textConfig: this.textConfig,
      onAllDraw: this.onAllDraw,
      isStop: this.isStop,
      video: this.video,
      noback: this.noback,
      isSubtitlesConfig: this.isSubtitlesConfig
    }
    if (this.layer_type === 'VIDEO') {
      if (this.childShape) {
        this.childShape.init(this.childShapeOptions)
      } else {
        const shape = new VideoShapeFactory(this.ctx, this.childShapeOptions)
        this.childShape = shape
      }
    } else if (this.layer_type === 'TEXT') {
      if (this.childShape) {
        this.childShape.init(this.childShapeOptions)
        // 自适应高度设置
        if (this.isSubtitlesConfig && this.childShape.h) {
          this.h = this.childShape.h
        }
      } else {
        const shape = new TextFactory(this.ctx, this.childShapeOptions)
        this.childShape = shape
      }
    } else {
      if (this.childShape) {
        this.childShape.init(this.childShapeOptions)
      } else {
        const shape = new ImageFactory(this.ctx, this.childShapeOptions)
        this.childShape = shape
      }
    }
  }

  /**
   * 初始化重置大小控件
   */
  initResizeHandlers() {
    this.initSize()
    this.initShape()
  }

  initSize() {
    const handlerWidth = 12 * this.devicePixelRatio
    this.topLeftOptions = {
      x: this.x - handlerWidth / 2,
      y: this.y - handlerWidth / 2,
      w: handlerWidth,
      h: handlerWidth
    }
    this.topCenterOptions = {
      x: this.x + (this.w / 2) - handlerWidth / 2,
      y: this.y - handlerWidth / 2,
      w: handlerWidth,
      h: handlerWidth
    }
    this.topRightOptions = {
      x: this.x + this.w - handlerWidth / 2,
      y: this.y - handlerWidth / 2,
      w: handlerWidth,
      h: handlerWidth
    }
    this.leftCenterOptions = {
      x: this.x - handlerWidth / 2,
      y: this.y + (this.h / 2) - handlerWidth / 2,
      w: handlerWidth,
      h: handlerWidth
    }
    this.rightCenterOptions = {
      x: this.x + this.w - handlerWidth / 2,
      y: this.y + (this.h / 2) - handlerWidth / 2,
      w: handlerWidth,
      h: handlerWidth
    }
    this.bottomLeftOptions = {
      x: this.x - handlerWidth / 2,
      y: this.y + this.h - handlerWidth / 2,
      w: handlerWidth,
      h: handlerWidth
    }
    this.bottomCenterOptions = {
      x: this.x + (this.w / 2) - handlerWidth / 2,
      y: this.y + this.h - handlerWidth / 2,
      w: handlerWidth,
      h: handlerWidth
    }
    this.bottomRightOptions = {
      x: this.x + this.w - handlerWidth / 2,
      y: this.y + this.h - handlerWidth / 2,
      w: handlerWidth,
      h: handlerWidth
    }
    if (this.noback) {
      const long = 24 * this.devicePixelRatio
      const short = 4 * this.devicePixelRatio
      this.topCenterOptions = {
        x: this.x + (this.w / 2) - long / 2,
        y: this.y,
        w: long,
        h: short,
        noback: true
      }
      this.leftCenterOptions = {
        x: this.x,
        y: this.y + (this.h / 2) - long / 2,
        w: short,
        h: long,
        noback: true
      }
      this.bottomCenterOptions = {
        x: this.x + (this.w / 2) - long / 2,
        y: this.y + this.h - short,
        w: long,
        h: short,
        noback: true
      }
      this.rightCenterOptions = {
        x: this.x + this.w - short,
        y: this.y + (this.h / 2) - long / 2,
        w: short,
        h: long,
        noback: true
      }
    }
  }
  initShape() {
    if (this.noback) {
      this.initCenterHander()
      return
    }

    if (this.isSubtitlesConfig) {
      return;
    }
    if (this.topLeftHandler) {
      this.topLeftHandler.init(this.topLeftOptions)
    } else {
      this.topLeftHandler = new ResizeRectFactory(this.ctx, this.topLeftOptions);
    }
    if (this.topRightHandler) {
      this.topRightHandler.init(this.topRightOptions)
    } else {
      this.topRightHandler = new ResizeRectFactory(this.ctx, this.topRightOptions);
    }

    if (this.bottomLeftHandler) {
      this.bottomLeftHandler.init(this.bottomLeftOptions)
    } else {
      this.bottomLeftHandler = new ResizeRectFactory(this.ctx, this.bottomLeftOptions);
    }
    if (this.bottomRrightHandler) {
      this.bottomRrightHandler.init(this.bottomRightOptions)
    } else {
      this.bottomRrightHandler = new ResizeRectFactory(this.ctx, this.bottomRightOptions);
    }
    // 是否是固定比例
    if (!this.isFixedRatio) {
      this.initCenterHander()
    }
  }

  initCenterHander() {
    if (this.topCenterHandler) {
      this.topCenterHandler.init(this.topCenterOptions)
    } else {
      this.topCenterHandler = new ResizeRectFactory(this.ctx, this.topCenterOptions);
    }
    if (this.leftCenterHandler) {
      this.leftCenterHandler.init(this.leftCenterOptions)
    } else {
      this.leftCenterHandler = new ResizeRectFactory(this.ctx, this.leftCenterOptions);
    }
    if (this.rightCenterHandler) {
      this.rightCenterHandler.init(this.rightCenterOptions)
    } else {
      this.rightCenterHandler = new ResizeRectFactory(this.ctx, this.rightCenterOptions);
    }
    if (this.bottomCenterHandler) {
      this.bottomCenterHandler.init(this.bottomCenterOptions)
    } else {
      this.bottomCenterHandler = new ResizeRectFactory(this.ctx, this.bottomCenterOptions);
    }
  }
}
