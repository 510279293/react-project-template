import { useEffect, useRef } from "react"
import { PreviewDesignFactory, PreviewDesignFactoryOptions } from '@/components/Demo/digitalMan/preview-design/PreviewDesignFactory.back'
(window).CDNAddress = ''

// 图层背景
const background = {
  src: '/assets/images/background/1.png' // 背景图片地址
}

// 图层元素
const lists  = [
    {
      src: '/assets/images/layer1.png',
      isCopy: true,
      isApply: true,
      w: 939,
      h: 402,
      x: 60,
      y: 60
    },
    {
      src: '/assets/images/digital/xiaoya_qipao.png', // 图层图片地址
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

const defaultOptions = {
    height: 500, // canvas画布高度，需要和实际页面显示的高度一致
    width: 800, // canvas画布宽度，需要和实际页面显示的宽度一致
    background: background, // 背景配置
    lists: lists, // 图层列表
    isStop: false, // 是否动画渲染页面
    onChange: (lists: any)=>{
      // 图层数据变化触发回调
      if (!Array.isArray(lists)) {
        return
      }
      console.log('onChange', lists)
    },
    onApply: (data: any) => {
      // 点击应用到全局触发回调
      console.log('apply', data)
    },
    onSelected: (data) => {
      console.log('selected', data)
      // 选中图层触发回调方法
    },
    onBeforeCopy: (lists: any[], copyShape: any) => {
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

type EditorProps = {
  config?: PreviewDesignFactoryOptions;
  onChange?: PreviewDesignFactoryOptions['onChange'];
  onApply?: PreviewDesignFactoryOptions['onApply'];
  onSelected?: PreviewDesignFactoryOptions['onSelected'];
  onBeforeCopy?: PreviewDesignFactoryOptions['onBeforeCopy'];
}


const Editor = ({ config, onChange, onApply, onSelected, onBeforeCopy }: EditorProps) => {
    const ref = useRef<any>(null)
    const designRef = useRef<any>(null)
    const options = Object.assign(defaultOptions, config, {
      onChange,
      onApply,
      onSelected,
      onBeforeCopy,
    })
    useEffect(() => {
      // 初始化
      designRef.current = new PreviewDesignFactory('preview', options)
      // 渲染页面
      designRef.current.load()
    }, [])

    useEffect(() => {
      // const newConfig = merge(options, config)
      // designRef.current.init(newConfig)
      // // designRef.current.load()
      // console.log(newConfig)
      console.log(config)
      config?.background && designRef.current.resetBackground(config?.background)
      config?.lists && designRef.current.resetLists(config?.lists)

    },[config])
    return (<>
        <canvas ref={ref} id="preview" />
    </>)
}


export default Editor