import { ActionTextRectFactory } from './ActionTextRectFactory'
import { SizeTextRectFactory } from './SizeTextRectFactory'
import { ImageFactory } from './ImageFactory'
import { TopToolFactory, TopToolFactoryOptions } from './TopToolFactory'
import { ImageBoxFactory } from './ImageBoxFactory'
import { LineFactory } from './LineFactory'
import { Key } from 'react'

type Background = {
  src: string
  zoomRatio?: number,
  isFill?: boolean
}

type Shape = { 
  x: number;
  y: number;
  w: number;
  h: number;
  maxX: number;
  maxY: number;
  index?: Key;
  isCopy?: any; 
  isApply?: any; 
  isSubtitlesConfig?: any;
  isHiddenDelete?: any; 
  isHiddenLayers?: any;
  layer_type?: any;
  childShape?: any
  topLeftHandler: {
    selected?: any
  },
  topCenterHandler?: {
    selected?: any
  }
  topRightHandler?: {
    selected?: any
  }
  leftCenterHandler?: {
    selected?: any
  }
  rightCenterHandler?: {
    selected?: any
  }
  bottomLeftHandler?: {
    selected?: any
  }
  bottomCenterHandler?: {
    selected?: any
  }
  bottomRrightHandler?: {
    selected?: any
  }
}

export type PreviewDesignFactoryOptions = {
  height?: any
  width?: any
  lang?: string
  isStop?: any
  lists?: any
  background?: Background | null;
  onBeforeCopy?: any
  onSelected?: any
  onApply?: any
  onChange?: any
  noback?: boolean;
}

export class PreviewDesignFactory {
  elementId: any
  isFirstLoad: boolean
  resetListsTimer: any
  canvas!: HTMLCanvasElement
  ctx: any
  devicePixelRatio!: number
  requestAnimationFrame: any
  shapeCollection!: any[]
  topToolShape: any
  backgroundShape: any
  sizeTextShape: any
  actionTextShape: any
  selectedShape: any
  selectedIndex!: number
  xLineShape: any
  yLineShape: any
  hoverAction!: string
  documentClickFn!: (event: any) => void
  documentKeyupFn!: (event: any) => void
  noback: any
  paddingLeft!: number
  paddingRight!: number
  paddingTop!: number
  paddingBottom!: number
  shapeMinWidth!: number
  shapeMinHeight!: number
  mousedown!: boolean
  onChange: any
  onApply: any
  onSelected: any
  handlerTimer!: null
  handlerTimerCount!: number
  onBeforeCopy: any
  background!: Background | null
  lists: any
  isStop: any
  isDoingAction!: boolean
  lang: any
  uuidKey!: string
  zoomRatio!: number
  changeTimer: any
  startAnimation!: boolean

  /**
   *
   * @param {*} elementId
   * @param {*} options
   */
  constructor(elementId: string | HTMLCanvasElement, options: PreviewDesignFactoryOptions) {
    this.elementId = elementId
    this.isFirstLoad = true
    this.resetListsTimer = null
    this.init(options)
  }

  init(options: PreviewDesignFactoryOptions) {
    this.canvas = typeof this.elementId === 'string' ? <HTMLCanvasElement>document.getElementById(this.elementId) : this.elementId
    if (!this.canvas) {
      return
    }
    this.ctx = this.canvas.getContext('2d')
    this.devicePixelRatio = 1
    this.requestAnimationFrame = null
    // 所有绘制的图形推入数组中
    this.shapeCollection = []
    this.topToolShape = null
    this.backgroundShape = null
    this.sizeTextShape = null
    this.actionTextShape = null
    this.selectedShape = null
    this.selectedIndex = -1
    this.xLineShape = null
    this.yLineShape = null
    this.hoverAction = ''
    this.documentClickFn = this.documentClick.bind(this)
    this.documentKeyupFn = this.documentKeyup.bind(this)
    this.noback = options.noback || false;
    // 画布宽高
    this.canvas.width = options.width ? options.width : 1080
    this.canvas.height = options.height ? options.height : 1920
    this.setZoomRatio()

    // 拖动预留边距
    this.paddingLeft = 10 * this.devicePixelRatio
    this.paddingRight = 10 * this.devicePixelRatio
    this.paddingTop = 10 * this.devicePixelRatio
    this.paddingBottom = 10 * this.devicePixelRatio

    // 图片缩小最小尺寸
    this.shapeMinWidth = 30 * this.devicePixelRatio
    this.shapeMinHeight = 30 * this.devicePixelRatio

    this.mousedown = false
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const onChange = function () {}
    this.onChange = options.onChange ? options.onChange : onChange
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const onApply = function (lists: any[]) { }
    this.onApply = options.onApply ? options.onApply : onApply
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const onSelected = function (lists: any[]) { }
    this.onSelected = options.onSelected ? options.onSelected : onSelected
    const onBeforeCopy = function (lists: any, copyShape: any) {
      return true;
    }
    this.handlerTimer = null
    this.handlerTimerCount = 0
    this.onBeforeCopy = options.onBeforeCopy ? options.onBeforeCopy : onBeforeCopy
    this.background = null
    if (options.background) {
      this.background = Object.assign({}, options.background)
    }
    this.lists = options.lists ? options.lists : []
    this.isStop = options.isStop ? options.isStop : false
    this.isDoingAction = false
    this.lang = options.lang ?? 'zh_CN'

    this.uuidKey = 'uuid'
    if (this.isStop) {
      this.uuidKey = 'stopuuid'
    }
  }

  setZoomRatio() {
    if (this.canvas.width > this.canvas.height) {
      this.zoomRatio = this.canvas.width / 1920
    } else {
      this.zoomRatio = this.canvas.width / 1080
    }
  }

  load() {
    if (!this.canvas) {
      return false
    }
    try {
      this.setZoomRatio()
      this.initBackground()
      this.initShapes()
      this.initEvent()
      this.resetLists(this.lists)
      return true
    } catch (err) {
      console.error('error', err)
      return false
    }
  }

  stopDraw() {
    this.isStop = true
    this.uuidKey = 'stopuuid'
  }

  execute() {
    this.isStop = false
    this.uuidKey = 'uuid'
  }

  onChangeLists() {
    if (this.changeTimer) {
      clearTimeout(this.changeTimer)
    }
    this.changeTimer = setTimeout(() => {
      if (this.isDoingAction) {
        return
      }
      this.onChange(this.lists)
    }, 300)
  }

  /**
   * 鼠标点击canvas查看是否点击到了已经绘制的路线，若是，则返回相关线的对象，若否，返回null
   * @param {*} x
   * @param {*} y
   * @param {*} type  类型
   * @returns
   */
  getRect(x: number, y: number, type: string) {
    for (let i = this.shapeCollection.length - 1; i >= 0; i--) {
      const element = this.shapeCollection[i]
      if (element && element.isInside(x, y)) {
        this.selectedIndex = i
        return element
      }
    }
    return null
  }

  /**
   * 获取选中shape
   * @returns
   */
  getSelectedShape() {
    for (let i = this.shapeCollection.length - 1; i >= 0; i--) {
      const element = this.shapeCollection[i]
      if (element && element.selected) {
        this.selectedIndex = i
        return element
      }
    }
    return null
  }

  hasSelected() {
    let flag = false
    for (let i = this.shapeCollection.length - 1; i >= 0; i--) {
      const element = this.shapeCollection[i]
      if (element && element.selected) {
        flag = true
      }
    }
    return flag
  }

  /**
   * 初始化监听事件
   *
   */
  initEvent() {
    if (this.isStop) {
      return
    }
    this.onmousedown()
    this.onmousemove()
    this.onmouseup()
    this.onclick()
    this.onkeyup()
  }

  /**
   * 初始化背景
   * @returns
   */
  async initBackground() {
    if (!this.background) {
      console.info('design-preview', 'no background config')
      return
    }
    const options = {
      zoomRatio: this.zoomRatio,
      src: this.background.src,
      isFill: true
    }
    if (this.background.src) {
      this.backgroundShape = new ImageFactory(this.ctx, options)
      await this.backgroundShape.draw()
      this.draw()
    }
  }

  /**
   * 删除元素节点
   * @param {*} index
   */
  removeItem(index: number) {
    try {
      // 查找选中需要删除的图层
      const delShape = this.shapeCollection[index];
      // 找到对应需要删除数据的索引
      const delIndex = this.lists.findIndex((item: any) => delShape.uuid === item[this.uuidKey])
      if (delShape.layer_type === 'VIDEO') {
        delShape.childShape.destoryVideo()
      }
      if (delIndex > -1) {
        this.lists.splice(delIndex, 1)
      }
      this.resetLists(this.lists)
    } catch (err) {
      console.error('error', err)
    }
  }

  /**
   * 重置背景
   * @param {*} options
   * @returns
   */
  resetBackground(options: { src: any }) {
    try {
      if (!options) {
        return;
      }
      this.setZoomRatio()
      const { src } = options
      if (!src || src === this.background?.src) {
        return
      }
      this.background = {
        zoomRatio: this.zoomRatio,
        src: src,
        isFill: true
      }
      this.initBackground()
    } catch (err) {
      console.log('resetBackground', err)
    }
  }

  isEmpty(value: any) {
    return value === undefined || value === null
  }

  isShapePostion(shape: { x: any; y: any; w: any; h: any } | null) {
    return shape &&
      !this.isEmpty(shape.x) &&
      !this.isEmpty(shape.y) &&
      !this.isEmpty(shape.w) &&
      !this.isEmpty(shape.h)
  }

  /**
   * 初始化操作栏
   */
  initTopToolShape() {
    const shape = this.getSelectedShape()
    if (this.isShapePostion(shape)) {
      const position = this.getTopToolPosition(shape)
      const options: TopToolFactoryOptions = {
        x: position.x,
        y: position.y,
        isApply: shape.isApply,
        isCopy: shape.isCopy,
        isHiddenDelete: shape.isHiddenDelete,
        noback: this.noback,
        isHiddenLayers: shape.isHiddenLayers,
        devicePixelRatio: this.devicePixelRatio,
      }
      if (!this.topToolShape) {
        this.topToolShape = new TopToolFactory(this.ctx, options)
      } else {
        this.topToolShape.init(options)
      }
    }
  }

  getTopToolPosition(shape: Shape) {
    if (!shape) {
      return { x: 0, y: 0 }
    }
    const width = this.getW(shape) * this.devicePixelRatio
    const height = (46 + 8) * this.devicePixelRatio
    let x = shape.x - this.paddingLeft - width;
    let y = shape.y
    const minY = this.paddingTop + 46 * this.devicePixelRatio
    const maxY = this.canvas.height - (46 + 8) * this.devicePixelRatio

    const leftEmpty = shape.x > this.paddingLeft + width
    const rightEmpty = shape.maxX + width < this.canvas.width - this.paddingRight
    const topEmpty = y > this.paddingTop + height

    if (leftEmpty) {
      x = shape.x - this.paddingLeft - width;
    } else {
      x = shape.maxX + this.paddingLeft;
    }
    if (x + width > this.canvas.width) {
      x = shape.x - this.paddingLeft - width;
    }
    if (topEmpty) {
      x = shape.x;
    }
    if (!topEmpty && !leftEmpty && rightEmpty) {
      x = shape.maxX + this.paddingLeft
    }

    if (!leftEmpty && !rightEmpty) {
      x = this.paddingLeft
    }

    if (!topEmpty && leftEmpty && rightEmpty) {
      x = shape.maxX + this.paddingLeft
    }

    y = this.getY(y, minY, maxY, shape)

    if (x < this.paddingLeft) {
      x = this.paddingLeft
    }
    if (x > this.canvas.width - this.paddingRight - width) {
      x = this.canvas.width - this.paddingRight - width
    }

    return { x: x, y: y }
  }

  getW(shape: Shape) {
    let w = 208
    if (!shape.isCopy) {
      w -= 28
    }
    if (!shape.isApply) {
      w -= 28
    }
    if (shape.isHiddenDelete) {
      w -= 28
    }
    if (shape.isHiddenLayers) {
      w -= 4 * 28
    }
    return w;
  }

  getY(y: number, minY: number, maxY: number, shape: { maxY: number; h: any }) {
    if (y < minY && shape.maxY <= maxY) {
      y = y + shape.h + (8 + 46) * this.devicePixelRatio
    }
    // 底部
    if (y > maxY) {
      y = this.canvas.height - (46 + 8) * this.devicePixelRatio
    }

    if (y < minY && shape.maxY > maxY) {
      y = this.paddingTop + 38 * this.devicePixelRatio
    }
    return y;
  }

  /**
   * 初始化尺寸显示
   */
  initSizeTextShape() {
    const shape = this.getSelectedShape()
    if (this.isShapePostion(shape) && this.isShapePostion(this.topToolShape)) {
      const xx = Math.round(shape.x / this.zoomRatio)
      const yy = Math.round(shape.y / this.zoomRatio)
      const ww = Math.round(shape.w / this.zoomRatio)
      const hh = Math.round(shape.h / this.zoomRatio)

      const gap = 4 * this.devicePixelRatio
      const width = 108 * this.devicePixelRatio
      const height = 46 * this.devicePixelRatio
      let x = shape.maxX + 10 * this.devicePixelRatio
      let y = shape.maxY - height - gap

      // 右边
      if (shape.maxX + width + this.paddingRight > this.canvas.width && shape.minX > width + this.paddingLeft) {
        x = shape.x - width - this.paddingLeft
      }

      if (x > this.canvas.width) {
        x = this.canvas.width - width - this.paddingRight
      }

      if (x + width + this.paddingRight > this.canvas.width) {
        x = this.canvas.width - width - this.paddingRight
      }

      // 顶部
      if (shape.y < this.paddingTop + this.paddingTop && this.topToolShape.maxX > x) {
        y = shape.maxY + gap + height
      }

      // 底部
      if (y + height > this.canvas.height - this.paddingBottom) {
        y = this.canvas.height - height - this.paddingBottom
      }

      if (y < this.paddingTop) {
        y = this.paddingTop
      }
      if (y > this.canvas.height - height) {
        y = this.canvas.height - height
      }

      if (y < this.topToolShape.maxY && x < this.topToolShape.maxX) {
        y = this.topToolShape.y + gap
      }

      const options = {
        x: x,
        y: y,
        w: width,
        h: height,
        whText: [`W ${ww} `, `H ${hh}`],
        xyText: [`X ${xx}`, `Y ${yy}`],
        devicePixelRatio: this.devicePixelRatio
      }
      if (this.noback) {
        options.x = this.canvas.width - width
        options.y = this.canvas.height - height
      }
      if (!this.sizeTextShape) {
        this.sizeTextShape = new SizeTextRectFactory(this.ctx, options)
      } else {
        this.sizeTextShape.init(options)
      }
    }
  }

  /**
   * 操作提示
   */
  initActionTextShape() {
    if (!this.topToolShape || !this.hoverAction) {
      return
    }
    const action = this.hoverAction
    const shape = this.topToolShape[this.hoverAction]
    if (!shape) {
      return
    }
    const tipTexts: any = {
      'upImageShape': {
        text: '上移一层',
        textEn: 'Up',
        x: shape.x - 30 * this.devicePixelRatio,
        y: shape.y - 40 * this.devicePixelRatio,
        w: 76 * this.devicePixelRatio,
        wEn: 40 * this.devicePixelRatio
      },
      'downImageShape': {
        text: '下移一层',
        textEn: 'Down',
        x: shape.x - 30 * this.devicePixelRatio,
        y: shape.y - 40 * this.devicePixelRatio,
        w: 76 * this.devicePixelRatio,
        wEn: 55 * this.devicePixelRatio
      },
      'topImageShape': {
        text: '置顶',
        textEn: 'Top',
        x: shape.x - 15 * this.devicePixelRatio,
        y: shape.y - 40 * this.devicePixelRatio,
        w: 48 * this.devicePixelRatio,
        wEn: 40 * this.devicePixelRatio
      },
      'bottomImageShape': {
        text: '置底',
        textEn: 'Bottom',
        x: shape.x - 15 * this.devicePixelRatio,
        y: shape.y - 40 * this.devicePixelRatio,
        w: 48 * this.devicePixelRatio,
        wEn: 60 * this.devicePixelRatio
      },
      'copyImageShape': {
        text: '复制',
        textEn: 'Copy',
        x: shape.x - 15 * this.devicePixelRatio,
        y: shape.y - 40 * this.devicePixelRatio,
        w: 48 * this.devicePixelRatio,
        wEn: 48 * this.devicePixelRatio
      },
      'applyImageShape': {
        text: '应用到全局',
        textEn: 'Apply',
        x: shape.x - 35 * this.devicePixelRatio,
        y: shape.y - 40 * this.devicePixelRatio,
        w: 76 * this.devicePixelRatio,
        wEn: 55 * this.devicePixelRatio
      },
      'deleteImageShape': {
        text: '删除',
        textEn: 'Delete',
        x: shape.x - 15 * this.devicePixelRatio,
        y: shape.y - 40 * this.devicePixelRatio,
        w: 48 * this.devicePixelRatio,
        wEn: 55 * this.devicePixelRatio
      }
    }
    const width = (this.lang === 'en_us' ? tipTexts[action].wEn : tipTexts[action].w)
    const options = {
      x: tipTexts[action].x,
      y: tipTexts[action].y,
      w: width,
      h: 28 * this.devicePixelRatio,
      tipText: this.lang === 'en_us' ? tipTexts[action].textEn : tipTexts[action].text,
      devicePixelRatio: this.devicePixelRatio
    }

    if (tipTexts[action].y < 10 * this.devicePixelRatio) {
      options.y = tipTexts[action].y + 80 * this.devicePixelRatio
    }

    if (!this.actionTextShape) {
      this.actionTextShape = new ActionTextRectFactory(this.ctx, options)
    } else {
      this.actionTextShape.init(options)
    }
  }

  getOptions(item: any) {
    const options: any = {
      src: item.src,
      video_url: item.video_url,
      layer_type: item.layer_type,
      w: item.w,
      h: item.h,
      x: item.x,
      y: item.y,
      isApply: Boolean(item.isApply),
      isCopy: Boolean(item.isCopy),
      isHiddenDelete: Boolean(item.isHiddenDelete),
      isHiddenLayers: Boolean(item.isHiddenLayers),
      isSubtitlesConfig: Boolean(item.isSubtitlesConfig),
      isFixedRatio: Boolean(item.isFixedRatio),
      index: item.index,
      zoomRatio: this.zoomRatio,
      devicePixelRatio: this.devicePixelRatio,
      onchangeShape: this.onchangeShape.bind(this),
      onAllDraw: this.draw.bind(this),
      isStop: this.isStop,
      noback: this.noback
    }
    if (item.layer_type === 'TEXT' && item.textConfig) {
      options['textConfig'] = item.textConfig
    }
    return options
  }

  /**
   * 初始化内容shape
   */
  initShapes() {
    const lists = this.lists
    this.shapeCollection.forEach(shape => {
      if (shape.childShape && shape.childShape.video) {
        this.removeVideo(shape)
      }
    })
    this.shapeCollection = []
    lists.forEach((item: { [x: string]: string }, index: any) => {
      item['index'] = index
      const options = this.getOptions(item as any)
      const shape = new ImageBoxFactory(this.ctx, options)
      item[this.uuidKey] = shape.uuid
      if (shape) {
        this.shapeCollection.push(shape)
      }
    })
    const shapeLen = this.shapeCollection.length
    const len = this.lists.length
    if (shapeLen > len) {
      this.shapeCollection.splice(len)
    }
  }

  removeVideo(shape: Shape) {
    if (!shape?.childShape) {
      return
    }
    shape.childShape.destoryVideo()
  }

  resetLists(lists: any) {
    // 防抖，防止短时间内多次设置，只执行最后一次
    if (this.resetListsTimer) {
      clearTimeout(this.resetListsTimer)
    }
    this.resetListsTimer = setTimeout(() => {
      this.resetListsTimerFn(lists)
    }, 200)
  }

  isNumber(value: number) {
    return !isNaN(value);
  }

  async resetListsTimerFn(lists: string | any[]) {
    this.lists = lists
    const len = lists.length
    const slen = this.shapeCollection.length
    if (len < slen) {
      for (let i = len; i < slen; i++) {
        const shape = this.shapeCollection[i]
        if (shape.layer_type === 'VIDEO' && shape.childShape && shape.childShape.video) {
          this.removeVideo(shape)
        }
      }
    }
    const shapeCollection = new Array(lists.length)
    this.lists.forEach((item: { [x: string]: any; x: any; y: any; w: any; h: any }, index: number) => {
      item.x = this.isNumber(item.x) ? item.x : undefined
      item.y = this.isNumber(item.y) ? item.y : undefined
      item.w = this.isNumber(item.w) ? item.w : undefined
      item.h = this.isNumber(item.h) ? item.h : undefined
      const shapeIndex = this.shapeCollection.findIndex(shape => item[this.uuidKey] && item[this.uuidKey] === shape.uuid)
      const shape = this.shapeCollection[shapeIndex]
      if (!shape && this.shapeCollection[index] && this.shapeCollection[index].layer_type === 'VIDEO') {
        this.removeVideo(this.shapeCollection[index])
      }
      if (shapeIndex !== index && shape) {
        if (this.shapeCollection[index] && this.shapeCollection[index].layer_type === 'VIDEO') {
          this.removeVideo(this.shapeCollection[index])
        }
      }
      shapeCollection[index] = shape
    })
    this.shapeCollection = shapeCollection

    for (let i = 0; i < lists.length; i++) {
      const shape = this.shapeCollection[i]
      const item = lists[i]
      if (!shape) {
        this.shapeCollection[i] = null
        continue
      }
      if (!item[this.uuidKey] || shape.uuid !== item[this.uuidKey]) {
        if (shape.layer_type === 'VIDEO' && shape.childShape && shape.childShape.video) {
          this.removeVideo(shape)
        }
        this.shapeCollection[i] = null
        continue
      }
      if (shape.src !== lists[i].src) {
        this.shapeCollection[i] = null
        continue
      }
      shape.src = lists[i].src
      shape.video_url = lists[i].video_url
      shape.layer_type = lists[i].layer_type
      if (this.isShapePostion(lists[i])) {
        shape.w = lists[i].w * this.zoomRatio
        shape.h = lists[i].h * this.zoomRatio
        shape.x = lists[i].x * this.zoomRatio
        shape.y = lists[i].y * this.zoomRatio
      }
      shape.isApply = lists[i].isApply
      shape.isCopy = lists[i].isCopy
      shape.isHiddenDelete = lists[i].isHiddenDelete
      shape.isHiddenLayers = lists[i].isHiddenLayers
      shape.isSubtitlesConfig = lists[i].isSubtitlesConfig
      shape.isFixedRatio = lists[i].isFixedRatio
    }
    this.resetShapeIndex()
    await this.draw()
  }

  /**
   * 绘制第i项
   * @param {*} i 
   */
  startDraw(i: number) {
    let hasNewShape = false;
    const item = this.lists[i]
    item['index'] = i;
    const options = this.getOptions(item)
    if (this.shapeCollection[i] && this.shapeCollection[i].isLoading) {
      return
    }
    // 如果没有设置 或者 src 不一致则重新创建shape
    if (!this.shapeCollection[i] || !this.isSameShape(this.shapeCollection[i], options)) {
      const shape = new ImageBoxFactory(this.ctx, options)
      item[this.uuidKey] = shape.uuid
      if (!this.isStop) {
        this.resetShapeSelectd()
        shape.selected = true
        item.selected = true
        this.onSelected(item)
      }
      this.shapeCollection[i] = shape
      shape.draw()
      hasNewShape = true
    } else {
      this.shapeCollection[i].draw()
    }
    return hasNewShape;
  }

  /**
   * 绘制图形
   */
  async draw() {
    this.ctx.beginPath()
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    if (!this.isStop && this.startAnimation) {
      this.requestAnimationFrame = window.requestAnimationFrame(this.draw.bind(this))
    }
    if (this.isDoingAction) {
      return
    }
    if (this.backgroundShape) {
      if (this.noback) {
        const size = 8
        const line = this.canvas.height / size
        const col = this.canvas.width / size
        for (let i = 0; i < line; i++) {
          for (let j = 0; j < col; j++) {
            if ((i + j) % 2) {
              this.ctx.fillStyle = 'rgba(88,88,88,1)'
            } else {
              this.ctx.fillStyle = 'rgba(43,45,48,1)'
            }
            this.ctx.fillRect(j * size, i * size, size, size)
          }
        }
      }
      await this.backgroundShape.draw()
    }
    const shapeLen = this.shapeCollection.length
    const len = this.lists.length
    if (shapeLen > len) {
      this.shapeCollection.splice(len)
    }
    let hasNewShape = false

    const subtitleItemIndex = this.lists?.findIndex(
      (      item: { isSubtitles: any }) => item.isSubtitles
    );
    // 循环lists 渲染图片
    for (let i = 0; i < this.lists.length; i++) {
      if (subtitleItemIndex === i) {
        continue
      }
      const result = this.startDraw(i);
      if (result) {
        hasNewShape = true
      }
    }

    // 因为层级按照顺序来确定、并且字幕层级永远最高，所以循环的时候单独把字幕的拿出来，这里再重新去绘制
    if (subtitleItemIndex >= 0) {
      const result = this.startDraw(subtitleItemIndex);
      if (result) {
        hasNewShape = true
      }
    }
    this.resetShapeIndex()
    if (!this.isStop && !hasNewShape) {
      this.initShapeActionText()
    }
  }

  initShapeActionText() {
    this.initTopToolShape()
    this.initSizeTextShape()
    if (!this.noback) {
      this.initActionTextShape()
      this.initLineShape()
    }
  }

  initLineShape() {
    const shape = this.getSelectedShape()
    if (shape) {
      const conW = this.canvas.width
      const conH = this.canvas.height
      const isCenterY = shape.x + shape.w / 2 >= conW / 2 - 1 && shape.x + shape.w / 2 <= conW / 2 + 1
      const isCenterX = shape.y + shape.h / 2 >= conH / 2 - 1 && shape.y + shape.h / 2 <= conH / 2 + 1
      const xOptions = {
        x: 0,
        y: shape.y + shape.h / 2,
        w: this.canvas.width,
        h: 1 * this.devicePixelRatio
      }
      const yOptions = {
        x: shape.x + shape.w / 2,
        y: 0,
        w: 1 * this.devicePixelRatio,
        h: this.canvas.height
      }
      if (this.xLineShape && isCenterX) {
        this.xLineShape.init(xOptions)
      } else if (isCenterX) {
        this.xLineShape = new LineFactory(this.ctx, xOptions)
      }

      if (this.yLineShape && isCenterY) {
        this.yLineShape.init(yOptions)
      } else if (isCenterY) {
        this.yLineShape = new LineFactory(this.ctx, yOptions)
      }
    }
  }

  isSameShape(shape: { layer_type: string; src: any; textConfig: any; options: { x: any; y: any } }, item: { src: any; video_url?: any; layer_type?: any; w?: any; h?: any; x: any; y: any; isApply?: boolean; isCopy?: boolean; isHiddenDelete?: boolean; isHiddenLayers?: boolean; isSubtitlesConfig?: boolean; isFixedRatio?: boolean; index?: any; zoomRatio?: number; devicePixelRatio?: number; onchangeShape?: (shape: any) => void; onAllDraw?: () => Promise<void>; isStop?: any; noback?: any; textConfig?: any }) {
    const sameNoText = (shape.layer_type !== 'TEXT' && shape.src === item.src && item.x !== undefined)
    const sameText = (shape.layer_type === 'TEXT' && JSON.stringify(item.textConfig) === JSON.stringify(shape.textConfig) && item.x === shape.options.x && item.y === shape.options.y)
    return sameNoText || sameText
  }

  /**
   * 鼠标按下事件
   */
  onmousedown() {
    this.canvas.onmousedown = (e) => {
      if (this.isStop || this.isDoingAction) {
        return
      }
      const rect = this.canvas.getBoundingClientRect()
      const clickX = (e.clientX - rect.left)
      const clickY = (e.clientY - rect.top)
      // 判断是否在操作控件上
      const action = this.isInsideNavAction(clickX, clickY, 'mousedown')
      const resizeAction = this.isInsideResizeShape(clickX, clickY)
      if (action === '' && resizeAction === '') {
        this.selectedShape = this.getRect(clickX, clickY, 'mousedown')
      }
      this.mousedown = true
      this.resetShapeSelectd()
      // 没有选中任何的控件
      this.setSelectedShape(e, rect, clickX, clickY)
      this.startAnimation = true
      this.draw()
    }
  }

  setSelectedShape(e: MouseEvent, rect: DOMRect, clickX: number, clickY: number) {
    if (this.selectedShape) {
      this.selectedShape.selected = true
      if (!this.lists[this.selectedShape.index]) {
        return
      }
      this.lists[this.selectedShape.index]['selected'] = true
      this.onSelected(this.lists[this.selectedShape.index])
      if (this.mousedown) {
        this.selectedShape.status = 'move'
      }
      if (this.selectedShape.type == 'ImageBox') {
        this.selectedShape.selected = true
        // 鼠标resize控件上
        const resizeAction = this.isInsideResizeShape(clickX, clickY)
        // 鼠标放在操作按钮上
        // 是否移动控件
        if (this.selectedShape.status === 'move' && !this.noback) {
          this.moveRect(e, clickX, clickY, rect, this.selectedShape)
        }
        // 拖动设置控件长度
        if (resizeAction !== '') {
          this.resizeRect(e, clickX, clickY, rect, this.selectedShape)
        }
      }
    } else {
      this.selectedShape = null
      this.onSelected(null)
    }
  }

  isInsideResizeShape(x: number, y: number) {
    const shape = this.getSelectedShape()
    let action = ''
    if (!shape || !shape.selected || shape.layer_type === 'TEXT') {
      return ''
    }
    const handlerMaps = [
      {
        action: 'topLeftHandler',
        cursor: 'nw-resize'
      },
      {
        action: 'topCenterHandler',
        cursor: 'ns-resize'
      },
      {
        action: 'topRightHandler',
        cursor: 'ne-resize'
      },
      {
        action: 'leftCenterHandler',
        cursor: 'ew-resize'
      },
      {
        action: 'rightCenterHandler',
        cursor: 'ew-resize'
      },
      {
        action: 'bottomLeftHandler',
        cursor: 'nesw-resize'
      },
      {
        action: 'bottomCenterHandler',
        cursor: 'ns-resize'
      },
      {
        action: 'bottomRrightHandler',
        cursor: 'nwse-resize'
      }
    ]
    handlerMaps.forEach(item => {
      if ((shape[item.action] && shape[item.action].isInside(x, y))) {
        shape[item.action].selected = true
        this.canvas.style.cursor = item.cursor
        shape.status = 'resize'
        action = item.action
      }
    })
    return action
  }

  /**
   * 判断是否再选中的工具栏上
   * @param {*} shape
   * @param {*} x
   * @param {*} y
   * @param {*} type
   * @returns
   */
  isInsideNavAction(x: number, y: number, type: string) {
    const shape = this.getSelectedShape()
    if (!shape || !shape.selected || !this.topToolShape) {
      return ''
    }
    let action = ''
    if ((this.topToolShape.upImageShape && this.topToolShape.upImageShape.isInside(x, y))) {
      this.topToolShape.upImageShape.selected = true
      this.canvas.style.cursor = 'pointer'
      shape.status = 'action'
      action = 'upImageShape'
    }
    if ((this.topToolShape.downImageShape && this.topToolShape.downImageShape.isInside(x, y))) {
      this.topToolShape.downImageShape.selected = true
      this.canvas.style.cursor = 'pointer'
      shape.status = 'action'
      action = 'downImageShape'
    }
    if ((this.topToolShape.topImageShape && this.topToolShape.topImageShape.isInside(x, y))) {
      this.topToolShape.topImageShape.selected = true
      this.canvas.style.cursor = 'pointer'
      shape.status = 'action'
      action = 'topImageShape'
    }
    if ((this.topToolShape.bottomImageShape && this.topToolShape.bottomImageShape.isInside(x, y))) {
      this.topToolShape.bottomImageShape.selected = true
      this.canvas.style.cursor = 'pointer'
      shape.status = 'action'
      action = 'bottomImageShape'
    }
    if ((this.topToolShape.copyImageShape && this.topToolShape.copyImageShape.isInside(x, y))) {
      this.topToolShape.copyImageShape.selected = true
      this.canvas.style.cursor = 'pointer'
      shape.status = 'action'
      action = 'copyImageShape'
    }
    if ((this.topToolShape.applyImageShape && this.topToolShape.applyImageShape.isInside(x, y))) {
      this.topToolShape.applyImageShape.selected = true
      this.canvas.style.cursor = 'pointer'
      shape.status = 'action'
      action = 'applyImageShape'
    }
    if ((this.topToolShape.deleteImageShape && this.topToolShape.deleteImageShape.isInside(x, y))) {
      this.topToolShape.deleteImageShape.selected = true
      this.canvas.style.cursor = 'pointer'
      shape.status = 'action'
      action = 'deleteImageShape'
    }
    // 移动
    if (type === 'mousedown' && action) {
      this.resetShapeIndex()
      this.isDoingAction = true
      this.actionShape(shape, action)
      this.isDoingAction = false
    }
    this.hoverAction = action
    return action
  }


  actionShape(shape: Shape, action: string) {
    // 上一层
    if (action === 'upImageShape') {
      if (this.selectedIndex >= 0 && this.selectedIndex < this.shapeCollection.length - 1) {
        this.swapArr(this.shapeCollection, this.selectedIndex, this.selectedIndex + 1)
        this.swapArr(this.lists, this.selectedIndex, this.selectedIndex + 1)
      }
    }

    // 下一层
    if (action === 'downImageShape') {
      if (this.selectedIndex >= 1 && this.selectedIndex < this.shapeCollection.length) {
        this.swapArr(this.shapeCollection, this.selectedIndex, this.selectedIndex - 1)
        this.swapArr(this.lists, this.selectedIndex, this.selectedIndex - 1)
      }
    }

    // 置顶
    if (action === 'topImageShape') {
      if (this.selectedIndex >= 0 && this.selectedIndex < this.shapeCollection.length - 1) {
        const ss = this.shapeCollection.splice(this.selectedIndex, 1)
        const ls = this.lists.splice(this.selectedIndex, 1)
        this.shapeCollection.push(...ss)
        this.lists.push(...ls)
      }
    }

    // 置底
    if (action === 'bottomImageShape') {
      if (this.selectedIndex >= 1 && this.selectedIndex < this.shapeCollection.length) {
        const ss = this.shapeCollection.splice(this.selectedIndex, 1)
        const ls = this.lists.splice(this.selectedIndex, 1)
        this.shapeCollection.unshift(...ss)
        this.lists.unshift(...ls)
      }
    }

    // 复制
    if (action === 'copyImageShape') {
      const isCopy = this.onBeforeCopy(this.lists, shape)
      if (isCopy) {
        this.copyShape(shape)
      }
    }

    // 应用到全局
    if (action === 'applyImageShape') {
      this.onApply.call(this, this.lists[this.selectedIndex])
    }

    // 删除
    if (action === 'deleteImageShape') {
      if (shape.layer_type === 'VIDEO' && shape.childShape && shape.childShape.video) {
        this.removeVideo(shape)
      }
      this.topToolShape = null
      this.hoverAction = ''
      this.removeItem(this.selectedIndex)
    }

    // 数据变化调用
    this.resetShapeIndex()
    this.onChangeLists()
  }

  resetShapeIndex() {
    this.lists.forEach((item: { [x: string]: any }, index: any) => {
      // 如果唯一标识不一致则不是同一个图层
      if (this.shapeCollection[index] && item[this.uuidKey] === this.shapeCollection[index].uuid) {
        this.shapeCollection[index]['index'] = index
      } else {
        this.shapeCollection[index] = null
      }
    })
  }

  /**
   * 数组位置交换
   * @param {*} arr
   * @param {*} index1
   * @param {*} index2
   * @returns
   */
  swapArr(arr: any[], index1: number, index2: number) {
    arr[index1] = arr.splice(index2, 1, arr[index1])[0]
    return arr
  }

  /**
   * 复制
   * @param {*} shape
   */
  copyShape(shape: Shape) {
    const newItem = Object.assign({}, this.lists[this.selectedIndex])
    newItem.w = (shape.w / this.zoomRatio)
    newItem.h = (shape.h / this.zoomRatio)
    newItem.x = (shape.x / this.zoomRatio) + 20 * this.devicePixelRatio
    newItem.y = (shape.y / this.zoomRatio) + 20 * this.devicePixelRatio
    delete newItem['uuid']
    delete newItem['stopuuid']
    this.lists.push(newItem)
  }

  /**
   * resize控件
   */
  resizeRect(e: any, clickX: any, clickY: any, rect: any, shape: Shape) {
    const { w, h } = shape
    window.onmousemove = (e) => {
      if (this.isStop || shape.layer_type === 'TEXT') {
        return
      }
      this.ctx.beginPath()
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      const rect = this.canvas.getBoundingClientRect()
      const moveX = e.clientX - rect.left
      const moveY = e.clientY - rect.top
      this.initTopLeftHandler(shape, moveX, moveY, w, h)
      this.initTopCenterHandler(shape, moveX, moveY, w, h)
      this.initTopRightHandler(shape, moveX, moveY, w, h)
      this.initLeftCenterHandler(shape, moveX, moveY, w, h)
      this.initRightCenterHandler(shape, moveX, moveY, w, h)
      this.initBottomLeftHandler(shape, moveX, moveY, w, h)
      this.initBottomCenterHandler(shape, moveX, moveY, w, h)
      this.initBottomRrightHandler(shape, moveX, moveY, w, h)
    }
  }

  /**
   * 上左拖拽缩放
   * @param {*} shape
   * @param {*} moveX
   * @param {*} moveY
   * @param {*} w
   * @param {*} h
   */
  initTopLeftHandler(shape: Shape, moveX: number, moveY: number, w: number, h: number) {
    const fixedRatio = h / w
    if (shape.topLeftHandler && shape.topLeftHandler.selected) {
      const maxX = this.canvas.width - this.paddingRight
      if (moveX + this.shapeMinWidth < shape.maxX) {
        const x = moveX > maxX ? maxX : moveX
        const w = shape.maxX - x
        shape.x = x
        shape.w = w
      }
      this.setTopLeftRightSize(shape, moveY, fixedRatio)
      this.setMaxY(shape)
      this.onchangeShape(shape)
    }
  }

  setTopLeftRightSize(shape: { w: number; maxY: number; y: number; h: number }, moveY: any, fixedRatio: number) {
    const h = shape.w * fixedRatio
    const y = shape.maxY - h
    shape.y = y
    shape.h = h
  }

  setMaxY(shape: { y: number; maxY: number; h: number }) {
    const minY = this.paddingBottom
    const maxY = this.canvas.height - this.paddingBottom
    if (shape.y > maxY) {
      shape.y = maxY
    }
    if (shape.maxY < minY) {
      shape.y = minY - shape.h
    }
  }

  initTopCenterHandler(shape: Shape, moveX: number, moveY: number, w: any, h: any) {
    const maxY = this.canvas.height - this.paddingBottom
    if (shape.topCenterHandler && shape.topCenterHandler.selected) {
      if (moveY + this.shapeMinHeight < shape.maxY) {
        let y = moveY > maxY ? maxY : moveY
        if (this.noback && y < 0) {
          y = 0
        }
        const h = shape.maxY - y
        shape.y = y
        shape.h = h
      }
      if (shape.y > maxY) {
        shape.y = maxY
      }
      this.setMaxY(shape)
      this.onchangeShape(shape)
    }
  }

  initTopRightHandler(shape: Shape, moveX: number, moveY: number, w: number, h: number) {
    const fixedRatio = h / w
    if (shape.topRightHandler && shape.topRightHandler.selected) {
      let w = shape.w + (moveX - shape.maxX)
      if (w + shape.x < this.paddingLeft) {
        w = this.paddingLeft
      }
      if (w > this.shapeMinWidth) {
        shape.w = w
      }
      this.setTopLeftRightSize(shape, moveY, fixedRatio)
      this.setMaxY(shape)
      this.onchangeShape(shape)
    }
  }

  initLeftCenterHandler(shape: Shape, moveX: number, moveY: number, w: any, h: any) {
    if (shape.leftCenterHandler && shape.leftCenterHandler.selected) {
      if (moveX + this.shapeMinWidth < shape.maxX) {
        const maxX = this.canvas.width - this.paddingRight
        let x = moveX > maxX ? maxX : moveX
        if (this.noback && x < 0) {
          x = 0
        }
        const w = shape.maxX - x
        shape.x = x
        shape.w = w
      }
      this.setMaxY(shape)
      this.onchangeShape(shape)
    }
  }

  initRightCenterHandler(shape: Shape, moveX: number, moveY: number, w: any, h: any) {
    if (shape.rightCenterHandler && shape.rightCenterHandler.selected) {
      let w = shape.w + (moveX - shape.maxX)
      if (w + shape.x < this.paddingLeft) {
        w = this.paddingLeft
      }
      if (this.noback && (w + shape.x) > this.canvas.width) {
        w = this.canvas.width - shape.x
      }
      if (w > this.shapeMinWidth) {
        shape.w = w
      }
      this.setMaxY(shape)
      this.onchangeShape(shape)
    }
  }

  initBottomLeftHandler(shape: Shape, moveX: number, moveY: number, w: number, h: number) {
    const fixedRatio = h / w
    if (shape.bottomLeftHandler && shape.bottomLeftHandler.selected) {
      if (moveX + this.shapeMinWidth < shape.maxX) {
        const maxX = this.canvas.width - this.paddingRight
        const x = moveX > maxX ? maxX : moveX
        const w = shape.maxX - x
        shape.x = x
        shape.w = w
      }
      const h = shape.w * fixedRatio
      shape.h = h
      this.setMaxY(shape)
      this.onchangeShape(shape)
    }
  }

  initBottomCenterHandler(shape: Shape, moveX: number, moveY: number, w: any, h: any) {
    if (shape.bottomCenterHandler && shape.bottomCenterHandler.selected) {
      let h = shape.h + (moveY - shape.maxY)
      if (h + shape.y < this.paddingTop) {
        h = this.paddingTop
      }
      if (this.noback && (h + shape.y) > this.canvas.height) {
        h = this.canvas.height - shape.y
      }
      if (h > this.shapeMinHeight) {
        shape.h = h
      }
      this.setMaxY(shape)
      this.onchangeShape(shape)
    }
  }

  initBottomRrightHandler(shape: Shape, moveX: number, moveY: number, w: number, h: number) {
    const fixedRatio = h / w
    if (shape.bottomRrightHandler && shape.bottomRrightHandler.selected) {
      let w = shape.w + (moveX - shape.maxX)
      if (w + shape.x < this.paddingLeft) {
        w = this.paddingLeft
      }
      if (w > this.shapeMinWidth) {
        shape.w = w
      }
      const h = shape.w * fixedRatio
      shape.h = h
      this.setMaxY(shape)
      this.onchangeShape(shape)
    }
  }

  /**
   * 获取lists数据
   * @returns
   */
  getData() {
    try {
      const lists = JSON.parse(JSON.stringify(this.lists))
      lists.map((item: { x: number; y: number; w: number; h: number }) => {
        item.x = Math.round(item.x)
        item.y = Math.round(item.y)
        item.w = Math.round(item.w)
        item.h = Math.round(item.h)
        return item
      })
      return lists
    } catch (err) {
      console.log('err', err)
    }
  }

  /**
   * 监听数据变化
   * @param {*} shape
   */
  onchangeShape(shape: { uuid?: any; layer_type?: any; x?: any; y?: any; w?: any; h?: any; index?: any }) {
    // 如果是预览图标且x===undefined可以从新赋值
    if (this.isDoingAction) {
      return
    }
    this.resetShapeIndex()
    const { x, y, w, h, index } = shape
    // 如果唯一标识不一致表明不是同一图层
    if (this.lists[index] &&
      this.lists[index][this.uuidKey] !== undefined &&
      this.lists[index][this.uuidKey] !== shape.uuid &&
      shape.layer_type !== 'TEXT') {
      return
    }
    if (this.isStop && this.lists[index].x !== undefined) {
      return
    }
    this.lists[index].x = (x / this.zoomRatio)
    this.lists[index].y = (y / this.zoomRatio)
    this.lists[index].w = (w / this.zoomRatio)
    this.lists[index].h = (h / this.zoomRatio)
    this.onChangeLists()
  }

  /**
   * 移动控件
   */
  moveRect(e: any, clickX: number, clickY: number, rect: any, shape: Shape) {
    const { x, y, w, h, index } = shape
    if (!this.lists[index as any]) {
      return
    }
    const detaX = clickX - x
    const detaY = clickY - y
    // 按下按钮才会初始化的移动监听函数
    window.onmousemove = (e) => {
      if (this.isStop || this.isDoingAction) {
        return
      }
      this.ctx.beginPath()
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      const rect = this.canvas.getBoundingClientRect()
      const moveX = e.clientX - rect.left
      const moveY = e.clientY - rect.top
      const { x, y, w, h } = shape
      let xx = 0
      if (moveX < 0) {
        // 右移
        xx = ((moveX - detaX) <= this.paddingLeft - w) ? this.paddingLeft - w : (moveX - detaX)
      } else {
        // 左移
        xx = ((moveX - detaX) >= this.canvas.width - this.paddingRight) ? this.canvas.width - this.paddingRight : (moveX - detaX)
      }
      let yy = 0
      if (moveY < 0) {
        yy = ((moveY - detaY) <= this.paddingTop - h) ? this.paddingTop - h : (moveY - detaY)
      } else {
        yy = ((moveY - detaY) >= this.canvas.height - this.paddingBottom) ? this.canvas.height - this.paddingBottom : (moveY - detaY)
      }
      // 对边界进行限制
      if (shape.isSubtitlesConfig) {
        if (xx < 0) {
          xx = 0;
        }
        if (yy < 0) {
          yy = 0;
        }
        if (xx + w > this.canvas.width) {
          xx = this.canvas.width - w;
        }
        if (yy + h > this.canvas.height) {
          yy = this.canvas.height - h;
        }
      }
      shape.x = xx
      shape.y = yy
      // 数据变化调用
      this.onchangeShape(shape)
    }
  }

  /**
   * 移动鼠标形状变化判断
   */
  onmousemove() {
    this.canvas.onmousemove = (e) => {
      if (this.isStop || this.isDoingAction) {
        return
      }
      const rect = this.canvas.getBoundingClientRect()
      const moveX = (e.clientX - rect.left)
      const moveY = (e.clientY - rect.top)
      const shape = this.getRect(moveX, moveY, 'mousemove')
      // 鼠标放在操作按钮上
      const action = this.isInsideNavAction(moveX, moveY, 'mousemove')
      if (action === '' && shape && shape.type === 'ImageBox') {
        this.setShapeStatus(shape, moveX, moveY)
      } else if (action === '') {
        this.resetShapeStatus()
        this.canvas.style.cursor = 'inherit'
      }
      if (!this.startAnimation) {
        this.startAnimation = true
        this.playVideo()
        this.draw()
      }
    }
    this.canvas.onmouseleave = (e) => {
      if (!this.mousedown) {
        this.startAnimation = false
        this.stopVideo()
      }
    }
  }

  stopVideo() {
    this.shapeCollection.forEach((shape) => {
      if (shape && shape.childShape && shape.childShape.video) {
        shape.childShape.stopVideo()
      }
    })
  }
  playVideo() {
    this.shapeCollection.forEach((shape) => {
      if (shape && shape.childShape && shape.childShape.video) {
        shape.childShape.playVideo()
      }
    })
  }


  setShapeStatus(shape: { isInside: (arg0: any, arg1: any) => any; status: string; selected: any }, moveX: number, moveY: number) {
    if (shape.isInside(moveX, moveY)) {
      if (this.mousedown && !this.noback) {
        shape.status = 'move'
      } else {
        shape.status = 'hover'
      }
    }
    if (!this.noback) {
      if (shape.selected && shape.isInside(moveX, moveY)) {
        this.canvas.style.cursor = 'move'
        this.resetShapeStatus()
        shape.status = 'move'
      }
    } else {
      this.canvas.style.cursor = ''
    }
    // 鼠标resize控件上
    this.isInsideResizeShape(moveX, moveY)
  }

  /**
   * 松开鼠标事件
   */
  onmouseup() {
    window.onmouseup = () => {
      this.mousedown = false
      this.hoverAction = ''
      window.onmousemove = null
      this.resetCanvas()
    }
  }

  /**
   * 松开鼠标事件
   */
  onclick() {
    document.removeEventListener('click', this.documentClickFn)
    document.addEventListener('click', this.documentClickFn, false)
  }

  onkeyup() {
    document.removeEventListener('keyup', this.documentKeyupFn)
    document.addEventListener('keyup', this.documentKeyupFn, true)
  }

  documentClick(event: { target: { id: any } }) {
    if (event.target.id !== this.elementId) {
      this.resetShapeSelectd()
      this.draw()
    }
  }

  documentKeyup(event: { code: string; stopPropagation: () => void }) {
    if (event.code === 'Delete' && this.selectedIndex >= 0 && this.hasSelected()) {
      if (this.shapeCollection[this.selectedIndex].isHiddenDelete) {
        return
      }
      this.removeItem(this.selectedIndex)
      // 数据变化调用
      this.selectedIndex = -1
      this.resetShapeIndex()
      this.onChangeLists()
      event.stopPropagation()
    }
  }

  /**
   * 重置canvas状态，重置鼠标状态
   */
  resetCanvas() {
    this.canvas.style.cursor = 'inherit'
    this.shapeCollection.map(shape => {
      if (shape && shape.type === 'ImageBox') {
        shape.status = 'default'
      }
      return shape
    })
  }

  resetShapeStatus() {
    this.shapeCollection.map(shape => {
      if (shape) {
        shape.status = ''
      }
      return shape
    })
  }

  /**
   * 重置shape的选中状态
   */
  resetShapeSelectd() {
    this.lists.map((item: { [x: string]: boolean }) => {
      item['selected'] = false
      return item
    })
    this.shapeCollection.map(shape => {
      if (!shape) {
        return shape
      }
      this.selectedIndex = -1
      shape.selected = false
      if (shape.topLeftHandler) {
        shape.topLeftHandler.selected = false
      }
      if (shape.topCenterHandler) {
        shape.topCenterHandler.selected = false
      }
      if (shape.topRightHandler) {
        shape.topRightHandler.selected = false
      }
      if (shape.leftCenterHandler) {
        shape.leftCenterHandler.selected = false
      }
      if (shape.rightCenterHandler) {
        shape.rightCenterHandler.selected = false
      }
      if (shape.bottomLeftHandler) {
        shape.bottomLeftHandler.selected = false
      }
      if (shape.bottomCenterHandler) {
        shape.bottomCenterHandler.selected = false
      }
      if (shape.bottomRrightHandler) {
        shape.bottomRrightHandler.selected = false
      }
      if (shape.upImageShape) {
        shape.upImageShape.selected = false
      }
      if (shape.downImageShape) {
        shape.downImageShape.selected = false
      }
      if (shape.topImageShape) {
        shape.topImageShape.selected = false
      }
      if (shape.bottomImageShape) {
        shape.bottomImageShape.selected = false
      }
      if (shape.copyImageShape) {
        shape.copyImageShape.selected = false
      }
      if (shape.applyImageShape) {
        shape.applyImageShape.selected = false
      }
      if (shape.deleteImageShape) {
        shape.deleteImageShape.selected = false
      }
      return shape
    })
    const selected = this.lists.find((item: any) => item.selected)
    console.log('--------selected', selected)
    this.onSelected(selected)
  }

  destroy() {
    document.removeEventListener('click', this.documentClickFn)
    document.removeEventListener('keyup', this.documentKeyupFn)
    if (this.requestAnimationFrame) {
      window.cancelAnimationFrame(this.requestAnimationFrame)
    }
    if (!this.shapeCollection) {
      return
    }
    this.shapeCollection.forEach((shape) => {
      if (shape && shape.childShape && shape.childShape.video) {
        this.removeVideo(shape)
      }
    })
    this.shapeCollection = []
  }
}
