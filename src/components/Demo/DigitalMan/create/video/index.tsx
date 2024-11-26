import { getVideoRoleAssets, getVideoTempDetail, getVideoTempList } from "@/api/digitalMan"
import { useRequest } from "ahooks"
import { Card, Col, Flex, Input, Row, SelectProps, Tabs, Tag } from "antd" 
import { useRef, useState } from "react"
import Editor from "./editor"
import { parseVedioTemplate } from "./editor/tool"
import Driver from "./driver"
import { areaOptions, industryOptions, posOptions, resolutionOptions, roleOptions, sexOptions } from "./data"

const { Meta } = Card

type CheckListProps = {
    mode?: SelectProps['mode'];
    label?: any;
    value?: any;
    onChange?: (value: any) => void;
    options?: SelectProps['options']
}
const CheckList = ({label, value: pValue, onChange, options}: CheckListProps) => {
    const [value, setValue] = useState(options?.[0]?.value|| pValue)
    const onOwnChange = ({lanel, value}: any) => {
        setValue(value)
        onChange?.(value)
    }
    return (<Row gutter={[12, 12]}>
        <Col style={{color: '#fff', fontSize: 12}}>{label}</Col>
        { options?.map(v => (<Col key={v.value} style={{cursor: 'pointer', fontSize: 12, color: value === v.value ? '#fff' : undefined}} onClick={() => onOwnChange(v)}>{v.label}</Col>)) }
    </Row>)
}

// 模版
type TemplateProps = {
    onChange?: (item: any) => void
}
const Template = ({onChange}: TemplateProps) => {
    const { data } = useRequest(getVideoTempList)
    const { video_scripts: list } = data || {}
    return (<div style={{width: 356}}>
        <Row>
            <Col><div style={{color: '#fff', fontSize: 14, borderBottom: '2px solid #1476FF'}}>推荐</div></Col>
            <Col></Col>
        </Row>
        <Row style={{margin: '16px 0'}}>
            <Input style={{borderRadius: 20}} placeholder="请输入名称或关键词" />
        </Row>
        <CheckList label='版式:' options={[{label: '横屏', value: 1}, {label: '竖屏', value: 2}]} />
        <Row wrap gutter={[12, 12]} style={{width: 150}}>
            {
                list?.map((item: any, index: number) => (
                    <Card
                        key={index}
                        hoverable
                        size="small"
                        style={{ width: 240 }}
                        cover={<img alt="example" src={item.script_cover_url}/>}
                        onClick={() => onChange?.(item)}
                    >
                        <Meta description={<span style={{color: '#fff', fontSize: 12}}>{item.script_name}</span>} />
                    </Card>
                ))
            }
        </Row>
    </div>)
}

function getRoleCover(item){
    const { files } = item
    return files?.find((v: any) => v.file_name === 'thumbnail.png')
}

// 角色
const Role = ({onChange}: TemplateProps) => {
    const { data } = useRequest(getVideoRoleAssets)
    const { assets } = data || {}
    return (<div style={{width: 356}}>
        <Row>
            <Col><div style={{color: '#fff', fontSize: 14, borderBottom: '2px solid #1476FF'}}>角色</div></Col>
            <Col></Col>
        </Row>
        <Row style={{margin: '16px 0'}}>
            <Input style={{borderRadius: 20}} placeholder="请输入名称或关键词" />
        </Row>
        <CheckList label='角色:' options={roleOptions} />
        <CheckList label='性别:' options={sexOptions} />
        <CheckList label='姿势:' options={posOptions} />
        <CheckList label='行业:' options={industryOptions} />
        <CheckList label='区域:' options={areaOptions} />
        <CheckList label='分辨率:' options={resolutionOptions} />
        <Row wrap gutter={[12, 12]} style={{width: 150}}>
            {
                assets?.map((item: any, index: number) => (
                    <Card
                        key={index}
                        hoverable
                        size="small"
                        style={{ width: 240 }}
                        cover={<img alt="example" src={getRoleCover(item)?.download_url}/>}
                        onClick={() => onChange?.(item)}
                    >
                        <Meta description={<span style={{color: '#fff', fontSize: 12}}>{item.asset_name}</span>} />
                    </Card>
                ))
            }
        </Row>
    </div>)
}

// 背景

const items = (props: any) => [
    {
        label: '模版',
        key: '1',
        children: <Template {...props} />
    },
    {
        label: '角色',
        key: '2',
        children: <Role {...props} />
    },
    {
        label: '背景',
        key: '3',
        children: null
    },
    {
        label: 'PPT',
        key: '4',
        children: null
    },
    {
        label: '贴图',
        key: '5',
        children: null
    },
    {
        label: '视频',
        key: '6',
        children: null
    },
    {
        label: '音乐',
        key: '7',
        children: null
    },
    {
        label: '文本',
        key: '8',
        children: null
    },
]

const VideoMake = () => {
    const [config, setConfig] = useState({})
    const props = {
        onChange: async (item: any) => {
            const data = await getVideoTempDetail()
            const config = parseVedioTemplate(data)
            setConfig(config)
        }
    }
    return (<Row gutter={[20, 20]}>
        <Col>
            <Tabs items={items(props)} tabPosition="left" />
        </Col>
        <Col>
            <Card>
                <Editor
                    config={config}
                />
            </Card>
            <Card style={{marginTop: 24}}>
                <Driver />
            </Card>
        </Col>
    </Row>)
}

export default VideoMake