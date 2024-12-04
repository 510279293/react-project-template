import { Card, CardProps, Col, DatePicker, Dropdown, Row, Select } from "antd"
import { DownOutlined } from '@ant-design/icons';
import RGL, { WidthProvider } from "react-grid-layout";
import dayjs from 'dayjs'
import { LineChart, DonutChart } from 'bizcharts';

const ReactGridLayout = WidthProvider(RGL);

const { RangePicker } = DatePicker;

const commonProps = {
    size: 'small' as CardProps['size'],
    style: { height: '100%' },
    bodyStyle: { height: 'calc(100% - 40px)' }
}

function Operate(){
    return (<Row justify="space-between">
        <Col style={{display: 'flex'}}>
            <Select
               placeholder="请选择"
               defaultValue={2}
               style={{minWidth: 130}}
               options={[
                    {
                        label: '预置仪表盘',
                        options: [
                            {label: '统一监控平台', value: 1},
                            {label: '驾驶舱', value: 2}
                        ],
                    },
                    {
                        label: '自定义仪表盘',
                        options: [
                            {label: 'aaa', value: 3}
                        ],
                    },
                 
               ]}
            />
            <Dropdown.Button
                type="primary"
                style={{marginLeft: 20}}
                icon={<DownOutlined />}
                menu={{
                    items: [
                        {label: '复制当前仪表盘', key: 1}
                    ]
                }}
            >
                新建仪表盘
            </Dropdown.Button>
        </Col>
        <Col>
            <RangePicker
                showTime
                presets={[
                    {label: '最近1小时', value: [dayjs().add(-1, 'h'), dayjs()] },
                    {label: '最近3小时', value: [dayjs().add(-3, 'h'), dayjs()] },
                    {label: '最近12小时', value: [dayjs().add(-12, 'h'), dayjs()] },
                    {label: '最近24小时', value: [dayjs().add(-24, 'h'), dayjs()] },
                    {label: '最近7天', value: [dayjs().add(-7, 'd'), dayjs()] },
                ]}
            />
        </Col>
    </Row>)
}

// 消费趋势
function CostTrend() {
    return (<Card title="消费趋势" {...commonProps}>
        <LineChart
            data={[
                { year: '1991', value: 3 },
                { year: '1992', value: 4 },
                { year: '1993', value: 3.5 },
                { year: '1994', value: 5 },
                { year: '1995', value: 4.9 },
                { year: '1996', value: 6 },
                { year: '1997', value: 7 },
                { year: '1998', value: 9 },
                { year: '1999', value: 13 },
            ]}
            xField='year'
            yField='value'
        />
    </Card>)
}

// 消费分布
function CostDistribute() {
    return (<Card title="消费分布" {...commonProps}>
        <DonutChart
			data={[
                {
                    type: '分类一',
                    value: 27,
                },
                {
                    type: '分类二',
                    value: 25,
                },
                {
                    type: '分类三',
                    value: 18,
                }]
            }
			autoFit
			radius={0.8}
            innerRadius={0.6}
			padding='auto'
			angleField='value'
			colorField='type'
            statistic={false as any}
		/>
    </Card>)
}

// 预算执行率
function BudgetRate() {
    return (<Card title="预算执行率" {...commonProps}>

    </Card>)
}

// 中国大地图
function BigChina(){
    return (<Card {...commonProps}>
        大中国
    </Card>)
}

// 可优化资源分布
function OptimizedResourceDistribution() {
    return (<Card title="可优化资源分布" {...commonProps}>
        <DonutChart
			data={[
                {
                    type: '低利用率',
                    value: 27,
                },
                {
                    type: '高负荷',
                    value: 25,
                },
                {
                    type: '闲置资源',
                    value: 18,
                },
                {
                    type: '不适宜计费',
                    value: 18,
                }]
            }
			autoFit
			radius={0.6}
            innerRadius={0.6}
			padding='auto'
			angleField='value'
			colorField='type'
            statistic={false as any}
		/>
    </Card>)
}

// 工单响应SLA
function WorkSLA() {
    return (<Card title="工单响应SLA" {...commonProps}>
        <DonutChart
			data={[
                {
                    type: '正常',
                    value: 47,
                },
                {
                    type: '超时',
                    value: 53,
                }]
            }
			autoFit
			radius={0.6}
            innerRadius={0.6}
			padding='auto'
			angleField='value'
			colorField='type'
            statistic={false as any}
		/>
    </Card>)
}

// 工单数量分布
function WorkCount() {
    return (<Card title="工单数量分布" {...commonProps}>

    </Card>)
}

// 工单解决SLA
function WorkSolveSLA() {
    return (<Card title="工单解决SLA" {...commonProps}>
        <DonutChart
			data={[
                {
                    type: '正常',
                    value: 47,
                },
                {
                    type: '超时',
                    value: 53,
                }]
            }
			autoFit
			radius={0.6}
            innerRadius={0.6}
			padding='auto'
			angleField='value'
			colorField='type'
            statistic={false as any}
		/>
    </Card>)
}

const commonStyle = {
    width: '100%', 
    height: '40px', 
    textAlign: 'center' as any, 
    color: '#fff',
    lineHeight: '40px'
}

// 待审批申请单数量
function AuditCount(){
    return (<Card title="待审批申请单数量" {...commonProps}>
        <div style={{...commonStyle, background: 'rgb(92, 141, 255)'}}>0</div>
    </Card>)
}

// 资源清单
function ResourceList(){
    return (<Row gutter={[12, 12]}>
        <Col span={8}>
            <Card size="small">
                <div style={{fontSize: 12, width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>计算资源数量</div>
                <div style={{...commonStyle, marginTop: 16, background: 'rgb(9, 216, 206)'}}>0</div>
            </Card>
        </Col>
        <Col span={8}>
            <Card size="small">
                <div style={{fontSize: 12, width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>存储资源数量</div>
                <div style={{...commonStyle, marginTop: 16, background: 'rgb(9, 216, 206)'}}>0</div>
            </Card>
        </Col>
        <Col span={8}>
            <Card size="small">
                <div style={{fontSize: 12, width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>网络资源</div>
                <div style={{...commonStyle, marginTop: 16, background: 'rgb(9, 216, 206)'}}>0</div>
            </Card>
        </Col>
    </Row>)
}

// 告警趋势
function WarnTrend(){
    return (<Card title="告警趋势" {...commonProps}>

    </Card>)
}

// 最新未恢复告警
function NoRecoverWarn(){
    return (<Card title="最新未恢复告警" {...commonProps}>

    </Card>)
}
const layout = [
    {
        "w": 14,
        "h": 8,
        "x": 0,
        "y": 0,
        "i": "消费趋势",
        "moved": false,
        "static": false
    },
    {
        "w": 14,
        "h": 5,
        "x": 0,
        "y": 8,
        "i": "消费分布",
        "moved": false,
        "static": false
    },
    {
        "w": 14,
        "h": 5,
        "x": 0,
        "y": 13,
        "i": "预算执行率",
        "moved": false,
        "static": false
    },
    {
        "w": 23,
        "h": 18,
        "x": 14,
        "y": 0,
        "i": "大中国",
        "moved": false,
        "static": false
    },
    {
        "w": 10,
        "h": 6,
        "x": 0,
        "y": 18,
        "i": "可优化资源分布",
        "moved": false,
        "static": false
    },
    {
        "w": 9,
        "h": 6,
        "x": 10,
        "y": 18,
        "i": "工单响应SLA",
        "moved": false,
        "static": false
    },
    {
        "w": 9,
        "h": 6,
        "x": 19,
        "y": 18,
        "i": "工单数量分布",
        "moved": false,
        "static": false
    },
    {
        "w": 9,
        "h": 6,
        "x": 28,
        "y": 18,
        "i": "工单解决SLA",
        "moved": false,
        "static": false
    },
    {
        "w": 11,
        "h": 3,
        "x": 37,
        "y": 0,
        "i": "待审批申请单数量",
        "moved": false,
        "static": false
    },
    {
        "w": 11,
        "h": 3,
        "x": 37,
        "y": 3,
        "i": "资源清单",
        "moved": false,
        "static": false
    },
    {
        "w": 11,
        "h": 6,
        "x": 37,
        "y": 6,
        "i": "告警趋势",
        "moved": false,
        "static": false
    },
    {
        "w": 11,
        "h": 12,
        "x": 37,
        "y": 12,
        "i": "最新未恢复告警",
        "moved": false,
        "static": false
    }
]

// 驾驶舱
function Cockpit(){
      return (
        <ReactGridLayout 
            layout={layout} 
            cols={48} 
            rowHeight={30}
            isDraggable={false}
            isResizable={false}
            // onLayoutChange={(...rest) => {console.log(rest)}}
        >
            <div key="消费趋势">
                <CostTrend />
            </div>
            <div key="消费分布">
                <CostDistribute />
            </div>
            <div key="预算执行率">
                <BudgetRate />
            </div>
            <div key="大中国">
                <BigChina />
            </div>
            <div key="可优化资源分布">
                <OptimizedResourceDistribution />
            </div>
            <div key="工单响应SLA">
                <WorkSLA />
            </div>
            <div key="工单数量分布">
                <WorkCount />
            </div>
            <div key="工单解决SLA">
                <WorkSolveSLA />
            </div>
            <div key="待审批申请单数量">
                <AuditCount />
            </div>
            <div key="资源清单">
                <ResourceList />
            </div>
            <div key="告警趋势">
                <WarnTrend />
            </div>
            <div key="最新未恢复告警">
                <NoRecoverWarn />
            </div>
        </ReactGridLayout>
      );
}

export default function DashBoard(){
    return (<>
        <Operate />
        <Cockpit />
    </>)
}