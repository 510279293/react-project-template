// 解析视频模版
export function parseVedioTemplate(data) {
    console.log(data);
    const { shoot_scripts } = data
    const { shoot_script } = shoot_scripts[0]
    const { background_config, layer_config } = shoot_script
    const background = background_config[0]
    const lists = layer_config?.map((v: any) => {
        const { layer_type, text_config, position, size } = v
        switch (layer_type) {
            case 'IMAGE':
                return {
                    src: v.image_config.image_url, // 图层图片地址
                    layer_type, // IMAGE:图片, HUMAN:数字人, VIDEO: 视频, TEXT: 文本
                    asset_id: v.asset_id,
                    isCopy: false, // 是否显示复制按钮
                    isApply: false,// 是否显示应用到全局按钮
                    isShowDelete: true, // 是否显示删除按钮
                    isFixedRatio: true, // 固定比例
                    isSubtitles: false, // 是否是字幕
                    // x y w h 如果有其中一个为null或者是undefined，组件会根据图片大小设置w h， x y 会设置为居中位置
                    w: size.width,  // 图层宽度
                    h: size.height, // 图层高度
                    x: position.dx, // x 轴
                    y: position.dy  // y 轴
                }
            case 'TEXT':
                return {
                    layer_type,
                    asset_id: v.asset_id,
                    textConfig: {
                        fontContent: text_config.text_context,
                        fontFamily: text_config.font_name,
                        fontSize: text_config.font_size,
                        fontColor: text_config.font_color
                    },
                    isCopy: false, // 是否显示复制按钮
                    isApply: false,// 是否显示应用到全局按钮
                    isShowDelete: true, // 是否显示删除按钮
                    isFixedRatio: true, // 固定比例
                    isSubtitles: false, // 是否是字幕
                    w: size.width,  // 图层宽度
                    h: size.height, // 图层高度
                    x: position.dx, // x 轴
                    y: position.dy  // y 轴
                }
            case 'HUMAN':
                return {
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
        }
    })
    return {
        background: {
            src: background.background_config
        },
        lists
    }
}