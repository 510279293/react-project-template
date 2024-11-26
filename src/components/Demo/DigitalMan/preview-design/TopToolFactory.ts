import { BaseRectFactory, BaseRectFactoryOptions } from './BaseRectFactory'
import { NavRectFactory } from './NavRectFactory'
import { ImageFactory } from './ImageFactory'

export interface TopToolFactoryOptions extends  BaseRectFactoryOptions{
  isApply?: boolean;
  isCopy?: boolean;
  isHiddenDelete?: boolean;
  noback?: boolean;
  isHiddenLayers?: boolean;
  upImageShape?: null;
  downImageShape?: null;
  topImageShape?: null;
  toopOptions?: { x: number; y: number; w: number; h: number; };
  bottomImageShape?: null;
  copyImageShape?: null;
  applyImageShape?: null;
  deleteImageShape?: null;
  toolLists?: { name: string; src: string; }[];
}

/**
 * 画矩形模块
 */
export class TopToolFactory extends BaseRectFactory {
  isApply: boolean;
  isCopy: boolean;
  isHiddenDelete: boolean;
  noback: boolean;
  isHiddenLayers: boolean;
  upImageShape: null;
  downImageShape: null;
  topImageShape: null;
  toopOptions!: { x: number; y: number; w: number; h: number; };
  bottomImageShape: null;
  copyImageShape: null;
  applyImageShape: null;
  deleteImageShape: null;
  toolLists: { name: string; src: string; }[];
  newToolLists: any[];
  topToolShape: any;
  /**
   * @w 矩形宽度
   * @h 矩形高度
   * @x x轴位置
   * @y y轴位置
   */
  constructor(ctx: CanvasRenderingContext2D, options: TopToolFactoryOptions) {
    super(ctx, options)
    this.type = 'toptool'
    this.isApply = Boolean(options.isApply)
    this.isCopy = Boolean(options.isCopy)
    this.isHiddenDelete = Boolean(options.isHiddenDelete)
    this.noback = Boolean(options.noback)
    this.isHiddenLayers = Boolean(options.isHiddenLayers)
    this.upImageShape = null
    this.downImageShape = null
    this.topImageShape = null
    this.bottomImageShape = null
    this.copyImageShape = null
    this.applyImageShape = null
    this.deleteImageShape = null
    this.toolLists = [
      {
        name: 'upImageShape',
        src: (window).CDNAddress + '/assets/preview-design/icon/up.png',
      },
      {
        name: 'downImageShape',
        src: (window).CDNAddress + '/assets/preview-design/icon/down.png',
      },
      {
        name: 'topImageShape',
        src: (window).CDNAddress + '/assets/preview-design/icon/top.png',
      },
      {
        name: 'bottomImageShape',
        src: (window).CDNAddress + '/assets/preview-design/icon/bottom.png',
      },
      {
        name: 'copyImageShape',
        src: (window).CDNAddress + '/assets/preview-design/icon/copy.png',
      },
      {
        name: 'applyImageShape',
        src: (window).CDNAddress + '/assets/preview-design/icon/apply.png',
      },
      {
        name: 'deleteImageShape',
        src: (window).CDNAddress + '/assets/preview-design/icon/delete.png',
      },
    ]
    this.newToolLists = []
    this.init(options)
  }

  /**
   * 判断当前点击位置是否在图形内部
   */
  init(options: TopToolFactoryOptions) {
    this.x = options.x || 0
    this.y = options.y || 0
    this.isApply = Boolean(options.isApply)
    this.isCopy = Boolean(options.isCopy)
    this.isHiddenDelete = Boolean(options.isHiddenDelete)
    this.isHiddenLayers = Boolean(options.isHiddenLayers) // 隐藏上移、下移、置顶、置底
    const isAllHidden = !this.isApply && !this.isCopy && this.isHiddenDelete && this.isHiddenLayers;
    if (isAllHidden) {
      return;
    }
    let w = 208
    this.noback = Boolean(options.noback)
    if (!this.isApply) {
      w -= 28
    }
    if (!this.isCopy) {
      w -= 28
    }
    if (this.isHiddenDelete) {
      w -= 28
    }
    if (this.isHiddenLayers) {
      w -= 4 * 28
    }
    const width = w * this.devicePixelRatio
    const height = 28 * this.devicePixelRatio
    this.toopOptions = {
      x: this.x,
      y: this.y - 37 * this.devicePixelRatio,
      w: width,
      h: height
    }
    this.w = width
    this.h = height
    if (this.topToolShape) {
      if (!this.noback) {
        this.topToolShape.init(this.toopOptions)
      }
    } else {
      const shape = new NavRectFactory(this.ctx, this.toopOptions)
      this.topToolShape = shape
    }
    this.newToolLists = [...this.toolLists];
    if (!this.noback) {
      if (!this.isApply) {
        this.newToolLists.splice(5, 1)
      }
      if (!this.isCopy) {
        let index = -1
        this.newToolLists.forEach((item: { name: string; }, i: number) => {
          if (item.name === 'copyImageShape') {
            index = i
          }
        })
        if (index > -1) {
          this.newToolLists.splice(index, 1)
        }
      }
      if (this.isHiddenDelete) {
        let index = -1
        this.newToolLists.forEach((item: { name: string; }, i: number) => {
          if (item.name === 'deleteImageShape') {
            index = i
          }
        })
        if (index > -1) {
          this.newToolLists.splice(index, 1)
        }
      }
    } else {
      this.newToolLists = []
    }
    if (this.isHiddenLayers) {
      const names = ['upImageShape', 'downImageShape', 'topImageShape', 'bottomImageShape']
      for (let i = 0; i < this.newToolLists.length; i++) {
        if (names.indexOf(this.newToolLists[i].name) > -1) {
          this.newToolLists.splice(i, 1)
          i--
        }
      }
    }
    this.initTopActions()
  }
  initTopActions() {
    const basex = 12 * this.devicePixelRatio
    const itemx = 28 * this.devicePixelRatio
    this.newToolLists.forEach((item: { src: any; name: string; }, index: number) => {
      const x = basex + (itemx * index)
      const options = {
        x: this.x + x,
        y: this.y - 31 * this.devicePixelRatio,
        w: 16 * this.devicePixelRatio,
        h: 16 * this.devicePixelRatio,
        src: item.src
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (this[item.name]) {
        if (!this.noback) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
         // @ts-ignore
          this[item.name].init(options)
        }
      } else {
        const shape = new ImageFactory(this.ctx, options)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this[item.name] = shape
      }
    })
  }
}
