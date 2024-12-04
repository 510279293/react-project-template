import { Avatar, Card, Col, Progress, Radio, Row, Select, Tag } from "antd";
import { Chart, Effects, Guide, Interval, Legend, Line, Point } from "bizcharts";

const url = 'https://opseasy.huaxiacloud.com/static/img/touxiang-b.072dd7a9.png';

const resourceList = [
    {
        name: '全部',
        num: 0
    },
    {
        name: '云服务器',
        num: 0
    },
    {
        name: '云硬盘',
        num: 0
    },
    {
        name: '对象存储',
        num: 0
    },
    {
        name: '快照',
        num: 0
    },
    {
        name: '弹性IP',
        num: 0
    },
    {
        name: '虚拟私有云',
        num: 0
    },
    {
        name: '弹性伸缩',
        num: 0
    },
    {
        name: '弹性负载均衡',
        num: 0
    },
    {
        name: 'NAT网关',
        num: 0
    },
    {
        name: '关系型数据库',
        num: 0
    },
    {
        name: 'NoSql数据库',
        num: 0
    }
]

const SubTitle = ({children}: any) => <span style={{fontSize: 16, color: '#212840'}}>{children}</span>
// 水波纹图
type RippleProps = {
    value: number;
    content?: (row: any) => any
}
const Ripple = ({value, content}: RippleProps) => {
    const data = [{gender: 'male', value}]
    return (<Chart data={data} autoFit pure padding={0} scale={{value: {min: 0, max: 100}}}>
                <Interval
                    position="gender*value"
                    color="gender"
                    shape="liquid-fill-gauge"
                    style={{
                        lineWidth: 10,
                        fillOpacity: 0.75,
                    }}
                    size={160}
                    customInfo={{}}
                />
                <Effects>
                {(chart: any) => {
                    chart.geometries[0].customInfo({
                    radius: 0.9,
                    outline: { border: 2, distance: 0 },
                    wave: { count: 3, length: 192 },
                    });
                }}
                </Effects>
                <Guide>
                    {data?.map((row) => (
                        <Guide.Text
                            key={row.gender}
                            content={content?.(row)}
                            top
                            position={{
                                gender: row?.gender,
                                value: row.value,
                            }}
                            style={{
                                opacity: 0.75,
                                fontSize: window.innerWidth / 60,
                                textAlign: "center",
                            }}
                        />
                    ))}
                </Guide>
            </Chart>)
}

function CloudManageCard () {
    return (<Card title="云管理">
                <Row style={{fontSize: 16, marginBottom: 14}}>资源数量</Row>
                <Row wrap gutter={[12, 12]} justify="space-between">
                    {
                        resourceList.map(v => (<Col key={v.name} style={{width: '24%', background: '#f8f8fa', padding: '10px 20px'}}>
                            <div>{v.name}</div>
                            <div>{v.num}</div>
                        </Col>))
                    }
                </Row>
                <Row style={{fontSize: 16, margin: '14px 0'}}>资源池概览</Row>
            </Card>)
}

function CloudCostCard(){
    return (<Card title="云成本" style={{marginTop: 20}}>
                <Row>
                    <Col span={16} style={{borderRight: '1px solid #e7e9ed', boxSizing: 'border-box', paddingRight: 20}}>
                        <Row style={{fontSize: 14, fontWeight: 500, marginBottom: 12}}>1月消费概览</Row>
                        <Row>
                            <Col span={12}>
                            <div style={{color: '#4e5866'}}>月度消费总额</div>
                            <div style={{fontWeight: 600, fontSize: 18}}>CNY 0</div>
                            </Col>
                            <Col span={12}>
                            <div style={{color: '#4e5866'}}>可优化成本</div>
                            <div style={{fontWeight: 600, fontSize: 18}}>CNY 0.00</div>
                            </Col>
                        </Row>
                        <Row style={{fontSize: 14, fontWeight: 500, marginBottom: 12}}>可优化资源数量</Row>
                        <Row justify="space-between">
                            <Col style={{width: '23%', background: '#f8f8fa', padding: '10px 20px'}}>
                                <div>低利用率</div>
                                <div>0</div>
                            </Col>
                            <Col style={{width: '23%', background: '#f8f8fa', padding: '10px 20px'}}>
                                <div>高负荷</div>
                                <div>0</div>
                            </Col>
                            <Col style={{width: '23%', background: '#f8f8fa', padding: '10px 20px'}}>
                                <div>闲置资源</div>
                                <div>0</div>
                            </Col>
                            <Col style={{width: '23%', background: '#f8f8fa', padding: '10px 20px'}}>
                                <div>不适宜计费</div>
                                <div>0</div>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={8} style={{boxSizing: 'border-box', paddingLeft: 20}}>
                        <Row justify="space-between"><Col>预算告警概览</Col><Col>更多</Col></Row>
                        <Row style={{height: 120}}></Row>
                        <Row justify="space-around" style={{textAlign: 'center'}}>
                            <Col>
                                <div>超额</div>
                                <div style={{color: 'red', fontWeight: 600}}>0</div>
                            </Col>
                            <Col>
                                <div>告警</div>
                                <div style={{color: 'rgb(255, 180, 0)', fontWeight: 600}}>0</div>
                            </Col>
                            <Col>
                                <div>正常</div>
                                <div style={{color: 'rgb(57, 198, 118)', fontWeight: 600}}>0</div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Card>)
}

function CloudMonitor(){
    return (<Card title="云监控" style={{marginTop: 20}}>
                <Row>
                    <Col span={16} style={{borderRight: '1px solid #e7e9ed', boxSizing: 'border-box', paddingRight: 20}}>
                        <Row justify="space-between">
                            <Col><SubTitle>告警趋势</SubTitle></Col>
                            <Col>
                                <Select 
                                   placeholder="请选择"
                                   options={[
                                      {label: '今日', value: 0},
                                      {label: '近7天', value: -7},
                                      {label: '近30天', value: -30},
                                   ]}
                                />
                            </Col>
                        </Row>
                        <Row style={{height: 320}}>
                            <Chart autoFit padding={[30, 20, 60, 40]} data={[
                                { year: '1991', value: 3, type: '未恢复' },
                                { year: '1992', value: 4, type: '未恢复' },
                                { year: '1993', value: 3.5, type: '未恢复' },
                                { year: '1994', value: 5, type: '未恢复' },
                                { year: '1995', value: 4.9, type: '未恢复'},
                                { year: '1996', value: 6, type: '未恢复' },
                                { year: '1997', value: 7, type: '未恢复' },
                                { year: '1998', value: 9, type: '未恢复' },
                                { year: '1999', value: 13, type: '未恢复' },
                                
                                { year: '1991', value: 32, type: '无数据' },
                                { year: '1992', value: 41, type: '无数据' },
                                { year: '1993', value: 31.5, type: '无数据' },
                                { year: '1994', value: 51, type: '无数据' },
                                { year: '1995', value: 41.9, type: '无数据'},
                                { year: '1996', value: 61, type: '无数据' },
                                { year: '1997', value: 71, type: '无数据' },
                                { year: '1998', value: 51, type: '无数据' },
                                { year: '1999', value: 33, type: '无数据' },
                                
                                { year: '1991', value: 23, type: '已关闭' },
                                { year: '1992', value: 34, type: '已关闭' },
                                { year: '1993', value: 23.5, type: '已关闭' },
                                { year: '1994', value: 35, type: '已关闭' },
                                { year: '1995', value: 24.9, type: '已关闭'},
                                { year: '1996', value: 36, type: '已关闭' },
                                { year: '1997', value: 72, type: '已关闭' },
                                { year: '1998', value: 39, type: '已关闭' },
                                { year: '1999', value: 13, type: '已关闭' },
                            ]} interactions={['element-active']}>
                                <Point position="year*value" color="type" shape='circle' />
                                <Line shape="smooth" position="year*value" color="type" />
                                <Legend />
                            </Chart>
                        </Row>
                    </Col>
                    <Col span={8} style={{boxSizing: 'border-box', paddingLeft: 20}}>
                        <Row justify="space-between"><Col><SubTitle>未恢复告警</SubTitle></Col></Row>
                        <Col>
                            <div>紧急</div>
                            <div style={{color: 'red', fontWeight: 600, fontSize: 16}}>0</div>
                        </Col>
                        <Row><Progress percent={50} showInfo={false} /></Row>
                        <Row justify="space-between" style={{padding: '8px 0'}}>
                            <Col style={{color: '#4e5866'}}>重要</Col>
                            <Col>0</Col>
                        </Row>
                        <Row justify="space-between" style={{padding: '8px 0'}}>
                            <Col style={{color: '#4e5866'}}>警告</Col>
                            <Col>0</Col>
                        </Row>
                        <Row justify="space-between" style={{padding: '8px 0'}}>
                            <Col style={{color: '#4e5866'}}>提醒</Col>
                            <Col>0</Col>
                        </Row>
                        <Row justify="space-between" style={{padding: '8px 0'}}>
                            <Col style={{color: '#4e5866'}}>无数据</Col>
                            <Col>0</Col>
                        </Row>
                    </Col>
                </Row>
            </Card>)
}

function CloudDevOps() {
    return (<Card title="云运维" style={{marginTop: 20}}>
                <Row>
                    <Col span={16} style={{borderRight: '1px solid #e7e9ed', boxSizing: 'border-box', paddingRight: 20}}>
                        <Row justify="space-between">
                            <Col><SubTitle>工单优先级数量</SubTitle></Col>
                            <Col><SubTitle>工单服务数量</SubTitle></Col>
                        </Row>
                    </Col>
                    <Col span={8} style={{boxSizing: 'border-box', paddingLeft: 20}}>
                        <Row justify="space-between" align="middle">
                            <Col><SubTitle>工单处理</SubTitle></Col>
                            <Col>
                                <Radio.Group 
                                    optionType="button" 
                                    options={[
                                        {label: '工单提报', value: 1},
                                        {label: '工单响应', value: 2}
                                    ]} 
                                />
                            </Col>
                        </Row>
                        <Row style={{height: 120}}>
                            <Ripple value={30} content={(row) => {
                                console.log(row)
                                return row.value
                            }} />
                        </Row>
                        <Row justify="space-around" style={{textAlign: 'center'}}>
                            <Col>
                                <div>已挂起</div>
                                <div style={{color: 'red', fontWeight: 600}}>0</div>
                            </Col>
                            <Col>
                                <div>处理中</div>
                                <div style={{color: 'rgb(255, 180, 0)', fontWeight: 600}}>0</div>
                            </Col>
                            <Col>
                                <div>已关闭</div>
                                <div style={{color: 'rgb(57, 198, 118)', fontWeight: 600}}>0</div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Card>)
}

function Left(){
    return (<>
          <CloudManageCard />  
          <CloudCostCard />
          <CloudMonitor />
          <CloudDevOps />
    </>)
}

function Right(){
    return (<>
        <Card>
            <Row align="middle">
                <Col span={8}>
                    <Avatar src={url} size={60} />
                </Col>
                <Col>
                   <div style={{fontSize: 18}}>Hi, hx1014415</div>
                   <div><Tag color="#f23416">请先完成认证</Tag></div>
                </Col>
            </Row>
            <Row style={{color: '#4e5866', marginTop: 16}}>
                <Col span={7}>当前角色</Col>
                <Col>租户管理员</Col>
            </Row>
            <Row>
                <Col span={7}>最后登陆</Col>
                <Col>2024-01-22 14:01:41</Col>
            </Row>
            <Row>
                <Col span={7}>最后登录IP</Col>
                <Col>124.70.125.61</Col>
            </Row>
        </Card>
        <Card title="待办事项" style={{marginTop: 20}}>
            <Col style={{background: '#f8f8fa', boxSizing: 'border-box', padding: '10px 20px', marginBottom: 20}}>
                <div>待审批申请单</div>
                <div style={{fontWeight: 600}}>0</div>
            </Col>
            <Col style={{background: '#f8f8fa', boxSizing: 'border-box', padding: '10px 20px',  marginBottom: 20}}>
                <div>被驳回申请单</div>
                <div style={{fontWeight: 600}}>0</div>
            </Col>
            <Col style={{background: '#f8f8fa', boxSizing: 'border-box', padding: '10px 20px',  marginBottom: 20}}>
                <div>待验证工单</div>
                <div style={{fontWeight: 600}}>0</div>
            </Col>
        </Card>
        <Card title="未读消息" extra={<a>更多</a>} style={{marginTop: 20}}>
            
        </Card>
    </>)
}

export default function OverView(){
    return (<Row justify="space-between">
        <Col span={16}><Left /></Col>
        <Col span={7}><Right /></Col>
    </Row>)
}