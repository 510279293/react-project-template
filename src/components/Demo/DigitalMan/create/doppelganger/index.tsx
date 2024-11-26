// 分身形象制作

import { ProForm, ProFormRadio, ProFormText, ProFormUploadDragger } from "@ant-design/pro-components"
import { Card, Col, ConfigProvider, Row, Tabs } from "antd"

const CreateForm = () => {
    return (<>
        <div style={{fontSize: 24}}>Hi，欢迎您开启分身数字人制作之旅！</div>
        <div style={{fontSize: 20, marginTop: 50, display: 'flex', alignItems: 'center', color: '#fff'}}>
            <img style={{width: 36, marginRight: 16}} src="https://res.hc-cdn.com/metaStudioGray-Console/240630.7.0/hws/assets/video-make-images/title-step-one.svg" /> 分身数字人训练数据上传
        </div>
        <ProForm 
            style={{marginTop: 40}}
            submitter={{render(props, dom) {
               return (<div>{dom[1]}</div>)
            }}}
        >
            <ProFormText
                label="角色名称"
            />
            <ProFormUploadDragger 
                label="训练视频"
                title={<div style={{color: '#fff'}}>点击上传视频</div>}
                description={null}
                extra={<span style={{color: '#eef1f8'}}>时长3-10分钟，分辨率需≥1080P（4k最佳）且宽高比应为16:9/9:16，支持MP4/MOV格式视频</span>}
            >
            </ProFormUploadDragger>
            <ProFormRadio.Group
                label="背景替换"
                options={[
                    {
                        label: <span style={{color: '#fff'}}>扣除拍摄背景</span>,
                        value: 'a',
                    },
                    {
                        label: <span style={{color: '#fff'}}>保留拍摄背景</span>,
                        value: 'b',
                    }
                ]}
            />

            <div style={{fontSize: 20, margin: '30px 0', display: 'flex', alignItems: 'center', color: '#fff'}}>
                <img style={{width: 36, marginRight: 16}} src="https://res.hc-cdn.com/metaStudioGray-Console/240630.7.0/hws/assets/video-make-images/title-step-two.svg" /> 身份认证及授权数据上传
            </div>

            <ProFormText
                label="联系方式"
            />
            <ProFormUploadDragger 
                label="身份证照片"
                description={null}
                title={<div style={{color: '#fff'}}>点击上传人面像</div>}
            />
            <ProFormUploadDragger 
                label=""
                description={null}
                title={<div style={{color: '#fff'}}>点击上传国徽面</div>}
            />
            <ProFormUploadDragger 
                label="形象授权"
                title={<div style={{color: '#fff'}}>点击上传授权书</div>}
                description={null}
                extra={<div style={{color: '#eef1f8'}}>
                    <div>1.请先下载授权书模板，打印后由本人手写相关信息，扫描后上传授权书；</div>
                    <div>2.授权书支持pdf/jpg/jpeg/png格式</div>
                </div>}
            >
            </ProFormUploadDragger>
            
        </ProForm>
    </>)
}

type DescProps = {
    title?: any;
    list?: any[];
}
const Desc = ({title, list}: DescProps) => {
    return (<>
       <div style={{color: '#ffd9a0'}}>{title}</div>
       <ul style={{opacity: .6, paddingLeft: 16}}>
          { list?.map(v => (<li style={{margin: '16px 0'}}>{v}</li>)) }
       </ul>
    </>)
}

// 拍摄前
const PreShoot = () => {
    return (<div style={{height: 330, overflowY: 'scroll'}}>
        <Desc
           title="形象模特妆面着装"
           list={[
            '1.干净整洁的妆面造型，淡妆出镜。',
            '2.着装避免绿色成分，建议穿白色、黑色、灰色等衣服。',
            '3.避免穿着密集条纹、密集方格、密集斑点等衣服'
           ]}
        />
        <Desc
           title="场地布置"
           list={[
            '1.绿幕背景墙或绿幕影棚。',
            '2.明亮、柔和、均匀、稳定的光照，色温为标准日光色。',
            '3.保持环境安静无噪声，并避免其他人声干扰。录音棚录音效果最佳。'
           ]}
        />
        <Desc
           title="相机架设"
           list={[
            '1.选用等效40mm-85mm焦距镜头（避免使用超广角）；',
            '2.在合适的高度将相机竖置固定于三脚架上并确保水平；',
            '3.将录制格式调至4K/25fps。'
           ]}
        />
        <Desc
           title="演讲语料和提词器"
           list={[
            '1.不限制文本内容，优先使用中文、英文；',
            '2.自备与实际业务场景相关的语料， 5分钟内容即可（可下载 演讲范例稿），要求内容丰富无重复；',
            '3.调整提词器位置及语速，保证拍摄到的眼神直视镜头；',
            '4.若无提词器，要求演讲者能达到流利背诵的程度或者即兴发挥演讲满5分钟即可。'
           ]}
        />
    </div>)
}

// 拍摄中
const Shooting = () => {
    return (<div style={{height: 330, overflowY: 'scroll'}}>
        <Desc 
           title="拍摄调整"
           list={[
            '1.模特远离绿幕1.5米以上，站定并正视镜头；调节相机使模特身体尽量充满画面，确保模特做手势时不出画面，且画面整体视角正常（没有明显的俯仰、变形）；',
            '2.对模特眼部/脸部对焦，全身清晰不失焦；调节完关闭自动对焦、固定焦点；',
            '3.恰当曝光并设置白平衡，避免人脸及身体泛绿光、过曝、过暗、偏黄、偏蓝、偏红等偏色情况；调节完关闭自动曝光和自动白平衡；',
            '4.确保环境安静无噪声、模特人声清晰、无其他人声干扰。'
           ]}
        />
        <Desc 
           title="正式录制"
           list={[
            '1.相机角度和模特位置全程固定，一镜到底，全程不停机；',
            '2.演讲前，要求模特正视镜头，略带微笑，保持静默手势；（可参考下图）不讲话，开始录制，持续15-20秒（不停机）；',
            '3.要求流利、自然的逐段演讲语料。每段结束闭嘴2-3秒，且手势归位到一个位置，能让动作循环。 演讲时，视线不离开镜头，头部可自然摆动，可以配合自然的幅度手势（可参考下图）',
            '4.演讲全部完成后回到静默手势不讲话，正视镜头，略带微笑，保持3秒后停机完成录制。'
           ]}
        />
    </div>)
}

// 拍摄后
const AfterShoot = () => {
    return (<div style={{height: 330, overflowY: 'scroll'}}>
        <Desc 
           title="视频检查及导出"
           list={[
            '1.视频请勿剪辑，拍摄时首末预留的3秒左右静默姿势空挡需保留。',
            '2.检查人物位置是否始终保持在同一位置；',
            '3.提交训练的视频需要保留录制时的原声；',
            '4.对视频美颜处理，需确保视频不存在变形、模糊、晃动等情况；',
            '5.总时长3-5分钟，建议尺寸16:9/9:16，分辨率4k、帧率不低于25帧的MP4/MOV格式视频；',
            '6.上传的视频质量影响最终定制效果，您将在“任务中心-分身形象制作”页面收到训练视频审核失败原因，并需要重新上传训练视频；',
            '7.检查录音中环境安静无噪声、模特人声清晰、无其他人声干扰。'
           ]}
        />
    </div>)
}

const items = [
    {
        label: '拍摄前',
        key: '1',
        children: <PreShoot />
    },
    {
        label: '拍摄中',
        key: '2',
        children: <Shooting />
    },
    {
        label: '拍摄后',
        key: '3',
        children: <AfterShoot />
    }
]

const PreviewBox = () => {
    return (<>
        <Row justify="space-between" style={{margin: '20px 0'}}>
            <Col>仅需四步，轻松定制您的专属分身数字人</Col>
        </Row>
        <Card style={{marginBottom: 40}}>
            <Row>
                <Col span={6}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <img src="https://res.hc-cdn.com/metaStudioGray-Console/240630.7.0/hws/assets/video-make-images/one-step.svg" />
                        <div>上传视频</div>
                        <div style={{
                            background: 'url(https://res.hc-cdn.com/metaStudioGray-Console/240630.7.0/hws/str-line.6562f927503e086e.svg)', 
                            backgroundRepeat: 'no-repeat', 
                            backgroundPosition: 'center',
                            width: 40,
                            height: 5,
                            marginLeft: 20
                        }}></div>
                    </div>
                    <div style={{fontSize: 12, paddingLeft: 55}}>上传分身数字人训练视频</div>
                </Col>
                <Col span={6}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <img src="https://res.hc-cdn.com/metaStudioGray-Console/240630.7.0/hws/assets/video-make-images/two-step.svg" />
                        <div>认证授权</div>
                        <div style={{
                            background: 'url(https://res.hc-cdn.com/metaStudioGray-Console/240630.7.0/hws/str-line.6562f927503e086e.svg)', 
                            backgroundRepeat: 'no-repeat', 
                            backgroundPosition: 'center',
                            width: 40,
                            height: 5,
                            marginLeft: 20
                        }}
                        ></div>
                    </div>
                    <div style={{fontSize: 12, paddingLeft: 55}}>上传身份证及形象授权书</div>
                </Col>
                <Col span={6}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <img src="https://res.hc-cdn.com/metaStudioGray-Console/240630.7.0/hws/assets/video-make-images/three-step.svg" />
                        <div>定制确认</div>
                        <div style={{
                            background: 'url(https://res.hc-cdn.com/metaStudioGray-Console/240630.7.0/hws/str-line.6562f927503e086e.svg)', 
                            backgroundRepeat: 'no-repeat', 
                            backgroundPosition: 'center',
                            width: 40,
                            height: 5,
                            marginLeft: 20
                        }}></div>
                    </div>
                    <div style={{fontSize: 12, paddingLeft: 55}}>视频审核无误后开始算法训练，生成数字人</div>
                </Col>
                <Col span={6}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <img src="https://res.hc-cdn.com/metaStudioGray-Console/240630.7.0/hws/assets/video-make-images/four-step.svg" />
                        <div>查看效果</div>
                    </div>
                    <div style={{fontSize: 12, paddingLeft: 55}}>查看已生成的数字人效果</div>
                </Col>
            </Row>
        </Card>
        <Row justify="space-between" style={{margin: '20px 0'}}>
            <Col>训练视频拍摄指导</Col>
            <Col>下载拍摄指导文档</Col>
        </Row>
        <Card>
            <Row gutter={[20, 20]}>
                <Col span={10}>
                    <video style={{width: '100%', height: '280px'}} controls src="https://res-video.hc-cdn.com/cloudbu-site/china/zh-cn/MetaStudio/Doc/guide/1715247292672896053.mp4" />
                </Col>
                <Col span={12}>
                   <Tabs items={items} style={{color: '#fff'}} />
                </Col>
            </Row>
        </Card>
    </>)
}


const DoppelgangerCreate = () => {
    return (<Row>
        <Col span={8} style={{padding: 40}}>
            <CreateForm />
        </Col>
        <Col span={16}>
            <PreviewBox />
        </Col>
    </Row>)
}

export default DoppelgangerCreate