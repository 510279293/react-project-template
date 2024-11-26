import { Tabs } from "antd"

const items = [
    {
        label: '全部',
        key: '1',
        children: null
    },
    {
        label: '活动消息',
        key: '2',
        children: null
    },
    {
        label: '运维消息',
        key: '3',
        children: null
    },
    {
        label: '产品消息',
        key: '4',
        children: null
    },
    {
        label: '财务消息',
        key: '5',
        children: null
    },
    {
        label: '安全消息',
        key: '6',
        children: null
    },
    {
        label: '其他',
        key: '7',
        children: null
    },
]

function Station(){
    return (<div style={{padding: 20}}>
        <Tabs type="card" items={items} />
    </div>)
}

export default Station




