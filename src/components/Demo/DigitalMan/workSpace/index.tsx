import { Button, Card, Col, Row } from "antd"

const list = [
    {
        name: '分身形象制作',
        bgSrc: 'https://res.hc-cdn.com/metaStudioGray-Console/240630.7.0/hws/my-plane-digital-man.2addb5f4a15cdf25.png'
    },
    {
        name: '声音制作',
        bgSrc: 'https://res.hc-cdn.com/metaStudioGray-Console/240630.7.0/hws/clone-voice.422a37b8ce749399.png'
    },
    {
        name: '分身视频制作',
        bgSrc: 'https://res.hc-cdn.com/metaStudioGray-Console/240630.7.0/hws/video-make-double.baa0426cde141df0.png'
    },
    {
        name: '分身视频直播',
        bgSrc: 'https://res.hc-cdn.com/metaStudioGray-Console/240630.7.0/hws/two-virtual-live.3f174b8cf62cf2ec.png'
    },
]

// 分身数字人总览
const DigitalManAll = () => {
    return (<Card style={{background: '#26292e', border: 'none', color: '#fff'}}>
        <Row gutter={[12, 12]} style={{paddingBottom: 12}}>
            {
                list?.map(v => (<Col span={6} style={{display: 'flex'}}>
                    <div style={{padding: '20px 0'}}>
                        <div>{v.name}</div>
                        <div><Button type="primary" shape="round" style={{marginTop: '20px'}}>开始创建</Button></div>
                    </div>
                    <div style={{width: '50%', marginLeft: 20}}><img style={{width: '130px', height: 110}} src={v.bgSrc} /></div>
                </Col>))
            }
        </Row>
        <Row style={{borderTop: '1px solid #2f2f2f', paddingTop: 16}}>
            <Col span={4} style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                <img style={{width: 27, height: 27, marginRight: 8}} src="https://res.hc-cdn.com/metaStudioGray-Console/240630.7.0/hws/double-business-card.537fb43063e7358b.png" />分身数字人名片制作
            </Col>
            <Col span={3} style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                <img style={{width: 27, height: 27, marginRight: 8}} src="https://res.hc-cdn.com/metaStudioGray-Console/240630.7.0/hws/photo-digital-human.45f4f7a8cdb0c004.png" />
                照片数字人
            </Col>
            <Col span={4} style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                <img style={{width: 27, height: 27, marginRight: 8}} src="https://res.hc-cdn.com/metaStudioGray-Console/240630.7.0/hws/intelligent-interaction.9016243a5a5338f9.png" />
                智能交互
            </Col>
        </Row>
    </Card>)
}


const WorkSpace = () => {
    return (<>
      <DigitalManAll />
    </>)
}


export default WorkSpace