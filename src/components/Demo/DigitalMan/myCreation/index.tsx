import { Button, Col, Input, Row, Segmented, Space, Tabs } from "antd"

// 我的视频
const MyVideo = () => {
    return (
        <div>
            我的视频
        </div>
    )
}

// 视频草稿
const VideoDraft = () => {
    return (
        <div>
            视频草稿
        </div>
    )
}


const Video = () => {
    return (<Row justify="space-between">
        <Col>
            <Segmented<string>
                options={['我的视频', '视频草稿']}
            />
        </Col>
        <Col>
            <Space.Compact>
                <Button>综合排序</Button>
            </Space.Compact>
            <Input.Search style={{width: 200, marginLeft: 10}} placeholder="请输入资产名称" />
        </Col>
    </Row>)
}

// 分身形象
const Shape = () => {
    return (<Row justify="space-between">
        <Col>
        </Col>
        <Col>
            <Space.Compact>
                <Button>综合排序</Button>
            </Space.Compact>
            <Input.Search style={{width: 200, marginLeft: 10}} placeholder="请输入资产名称" />
        </Col>
    </Row>)
}

// 声音
const Sound = () => {
    return (<Row justify="space-between">
        <Col>
           <Segmented<string>
                options={['我的', '已购']}
            />
        </Col>
        <Col>
            <Segmented<string>
                options={['全部', '男声', '女声']}
            />
            <Space.Compact style={{marginLeft: 10}}>
                <Button>综合排序</Button>
            </Space.Compact>
            <Input.Search style={{width: 200, marginLeft: 10}} placeholder="请输入资产名称" />
        </Col>
    </Row>)
}

// 智能交互
const Interactive = () => {
    return (<Row justify="space-between">
        <Col>
            <Segmented<string>
                options={['对话项目', '技能管理']}
            />
        </Col>
        <Col>
            <Input.Search style={{width: 200, marginRight: 10}} placeholder="请输入资产名称" />
            <Space.Compact>
                <Button type="primary">创建对话</Button>
            </Space.Compact>
        </Col>
    </Row>)
}

// 身份名片
const IdentityCard = () => {
    return (<Row justify="space-between">
        <Col>
        </Col>
        <Col>
            <Space.Compact>
                <Button type="primary">综合排序</Button>
            </Space.Compact>
            <Input.Search style={{width: 200, marginLeft: 10}} placeholder="请输入资产名称" />
        </Col>
    </Row>)
}

// 资源
const Resource = () => {
    return (<>
        <Row justify="space-between">
            <Col>
                <Segmented<string>
                    options={['已激活', '未激活', '创建中', '创建失败', '已冻结']}
                />
            </Col>
            <Col></Col>
        </Row>
        <Row justify="space-between" style={{marginTop: 8}}>
            <Col>
                <Segmented<string>
                    options={['全部', '模型', '动画', 'PPT', '素材', '视频', '场景', '图片', '声音', '分身模型', '名片模型', '音频']}
                />
            </Col>
            <Col>
                <Space.Compact style={{marginLeft: 10}}>
                    <Button>综合排序</Button>
                </Space.Compact>
                <Input.Search style={{width: 200, marginLeft: 10}} placeholder="请输入资产名称" />
            </Col>
        </Row>
        </>)
}

const items = [
    {
        label: <span style={{color: 'gray', fontSize: 18, fontWeight: 600}}>视频</span>,
        key: '1',
        children: <Video />
    },
    {
        label: <span style={{color: 'gray', fontSize: 18, fontWeight: 600}}>分身形象</span>,
        key: '2',
        children: <Shape />
    },
    {
        label: <span style={{color: 'gray', fontSize: 18, fontWeight: 600}}>声音</span>,
        key: '3',
        children: <Sound />
    },
    {
        label: <span style={{color: 'gray', fontSize: 18, fontWeight: 600}}>智能交互</span>,
        key: '4',
        children: <Interactive />
    },
    {
        label: <span style={{color: 'gray', fontSize: 18, fontWeight: 600}}>身份名片</span>,
        key: '5',
        children: <IdentityCard />
    },
    {
        label: <span style={{color: 'gray', fontSize: 18, fontWeight: 600}}>资源</span>,
        key: '6',
        children: <Resource />
    },
    {
        label: <span style={{color: 'gray', fontSize: 18, fontWeight: 600}}>回收站</span>,
        key: '7',
        children: null
    }
]

const MyCreation = () => {
    return (<Tabs
            items={items}
        />)
}

export default MyCreation