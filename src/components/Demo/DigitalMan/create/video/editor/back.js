import { PreviewDesignFactory } from './preview-design/PreviewDesignFactory'
(window).CDNAddress = ''


const background = {
  src: './assets/images/background/1.png' // 背景图片地址
}
const lists  = [
  {
    src: './assets/images/layer1.png',
    isCopy: true,
    isApply: true,
    w: 939,
    h: 402,
    x: 60,
    y: 60
  },
  {
    src: './assets/images/digital/xiaoya_qipao.png', // 图层图片地址
    layer_type: 'IMAGE', // IMAGE:图片, HUMAN:数字人, VIDEO: 视频, TEXT: 文本
    asset_id: 222,
    isCopy: false, // 是否显示复制按钮
    isApply: false,// 是否显示应用到全局按钮
    isShowDelete: true, // 是否显示删除按钮
    isFixedRatio: true, // 固定比例
    // x y w h 如果有其中一个为null或者是undefined，组件会根据图片大小设置w h， x y 会设置为居中位置
    w: 598,  // 图层宽度
    h: 1080, // 图层高度
    x: null, // x 轴 位置，以左上角为原点0,0
    y: null, // y 轴 位置，以左上角为原点0,0
  }
]

let options = {
  height: 900, // canvas画布高度，需要和实际页面显示的高度一致
  width: 1600, // canvas画布宽度，需要和实际页面显示的宽度一致
  background: background, // 背景配置
  lists: lists, // 图层列表
  isStop: false, // 是否动画渲染页面
  onChange: (lists)=>{
    // 图层数据变化触发回调
    if (!Array.isArray(lists)) {
      return
    }
    console.log('onChange', lists)
  },
  onApply: (data) => {
    // 点击应用到全局触发回调
    console.log('apply', data)
  },
  onSelected: (data) => {
    // 选中图层触发回调方法
  },
  onBeforeCopy: (lists, copyShape) => {
    const videos = lists.filter(
      item => item.layer_type === 'VIDEO'
    );
    // 限制视频只能有2个，返回false 复制不生效， 返回true 复制生效
    if (videos.length >= 2) {
      return false;
    }
    return true;
  },
}

// 初始化
const design = new PreviewDesignFactory('preview', options)
// 渲染页面
design.load()

function onAddLayer() {
  const newItem =  {
    src: './assets/images/layer2.png',
    layer_type: 'IMAGE',
    isCopy: true,
    isApply: true,
    w: null,
    h: null,
    x: null,
    y: null
  }
  lists.push(newItem)
  // 重新设置图层数据
  design.resetLists(lists)
}

function onAddVideo() {
  const newItem =  {
    url: '',
    video_url: './assets/images/1.mp4', // 视频的url
    layer_type: 'VIDEO',
    isCopy: true,
    isApply: true,
    w: null,
    h: null,
    x: null,
    y: null
  }
  lists.push(newItem)
  // 重新设置图层数据
  design.resetLists(lists)
}

function onAddText() {
  const newItem =  {
    layer_type: 'TEXT',
    textConfig: {
      fontContent: '文本组件',
      fontFamily: 'HarmonyOS_Sans_SC_Thin',
      fontSize: 40,
      fontColor: '#ff0000'
    },
    isCopy: true,
    isApply: true,
    isDigital: false,
    isFixedRatio: true, // 固定比例
    w: null,
    h: null,
    x: null,
    y: null
  }
  lists.push(newItem)
  // 重新设置图层数据
  design.resetLists(lists)
}

function onAddText2(){
  const index = lists.findIndex(item=>item.isSubtitles)
  if (index >= 0) {
    return
  }
  const newItem = {
    textConfig: {
      fontContent: '字幕样例展示以合成效果为准',
      fontFamily: 'HarmonyOS_Sans_SC',
      fontSize: 48,
      fontColor: '#ffffff'
    },
    layer_type: 'TEXT',
    isCopy: false,
    isApply: false,
    isDigital: false, // 是否是数字人
    isSubtitles: true, // 是否是字幕
    isFixedRatio: false, // 是否是固定比例
    isHiddenLayers: true,// 隐藏图层调整
    isHiddenDelete: true, // 是否隐藏删除按钮
    x: 1920 * 0.1,
    y: 1080 * 0.9 - 108,
    w: 1920 * 0.8,
    h: 108,
    selected: true,
    isSubtitlesConfig: true, // 字体居中、默认换行、高度自适应、黑色边框等效果
  }
  lists.push(newItem)
}

function onResetBackground() {
  const background = {
    src: './assets/images/background/2.jpg' // 背景图片地址
  }
  design.resetBackground(background)
}

document.getElementById('addLayer').addEventListener('click', onAddLayer)
document.getElementById('addText').addEventListener('click', onAddText)
document.getElementById('addVideo').addEventListener('click', onAddVideo)
document.getElementById('resetBackground').addEventListener('click', onResetBackground)
document.getElementById('addText2').addEventListener('click', onAddText2)

