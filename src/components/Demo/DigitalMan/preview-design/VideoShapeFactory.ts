import { BaseRectFactory, BaseRectFactoryOptions } from './BaseRectFactory'

interface VideoShapeFactoryOptions extends BaseRectFactoryOptions {
  zoomRatio: any
  src: any
  video_url: any
  reloadImage: boolean
  video: any
  video_id: string
  firstLoad: boolean
  isStop: any
}

export class VideoShapeFactory extends BaseRectFactory {
  zoomRatio: any
  src: any
  video_url: any
  reloadImage: boolean
  video: any
  video_id: string
  firstLoad: boolean
  isStop: any
  onAllDraw: any
  videoDiv: any
  constructor(ctx: CanvasRenderingContext2D, options: VideoShapeFactoryOptions) {
    super(ctx, options)
    this.type = 'video'
    this.ctx = ctx
    const { src, video_url, zoomRatio, reloadImage } = options
    this.zoomRatio = zoomRatio
    this.src = src
    this.video_url = video_url
    this.reloadImage = Boolean(reloadImage)
    this.video = options?.video
    this.video_id = ''
    this.selected = false
    this.firstLoad = true
    this.isStop = options.isStop
  }

  init(options: VideoShapeFactoryOptions) {
    this.setPositionSize(options)
    const { src, video_url, zoomRatio, reloadImage, video } = options
    this.src = src
    this.video_url = video_url
    this.reloadImage = Boolean(reloadImage)
    this.zoomRatio = zoomRatio
    this.onAllDraw = options.onAllDraw
    this.draw()
  }

  /**
   * 绘制图形
   */
  draw() {
    if (!this.video) {
      this.firstLoad = false
      this.video = document.createElement('video')
      this.addVideoToBody()
      this.video.crossOrigin = 'anonymous'
      this.video.src = this.video_url
      this.video.width = this.w
      this.video.height = this.h
      this.video.loop = true
      this.video.autoplay = true
      this.video.muted = true
      this.video.preload = 'metadata'
      this.video.play()
      this.video.addEventListener('loadeddata', () => {
        if (this.onAllDraw) {
          this.onAllDraw()
        }
        if (this.isStop) {
          setTimeout(() => {
            this.video.pause()
          }, 100)
        }
      })
    } else {
      if (this.firstLoad) {
        this.firstLoad = false
        this.addVideoToBody()
      }
      this.drawImage()
    }
  }
  drawImage() {
    this.ctx.drawImage(this.video, this.minX, this.minY, this.w, this.h);
  }

  addVideoToBody() {
    if (this.videoDiv) {
      this.videoDiv.remove()
    }
    this.videoDiv = document.createElement('div')
    this.videoDiv.style.display = 'none'
    this.videoDiv.appendChild(this.video)
    document.body.appendChild(this.videoDiv)
  }

  destoryVideo() {
    if (!this.video) {
      return
    }
    this.video.src = ''
    this.video.autoplay = false
    this.video.loop = false
    this.video.load()
    this.video = null
    if (this.videoDiv) {
      this.videoDiv.remove()
    }
  }

  stopVideo() {
    if (!this.video) {
      return
    }
    this.video.pause()
  }
  playVideo() {
    if (!this.video) {
      return
    }
    this.video.play()
  }
}
