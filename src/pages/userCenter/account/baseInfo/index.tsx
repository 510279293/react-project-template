import { Alert, Card, Col, Divider, Row } from "antd"

function BaseInfo(){
    return (<div style={{padding: 20}}>
        <Card >
            <Alert message={<>【重要通知】根据国家法律规定，使用云服务的用户必须完成实名认证。为避免影响使用，请您 <a>立即认证</a></>} type="warning" showIcon closable />
            <Row align="middle" style={{padding: 10}}>
                <Col span={3} style={{fontWeight: 500}}>基本信息</Col>
                <Col><span style={{fontSize: 12, color: '#fd6845'}}>您的基础信息尚未完善，请完善。</span></Col>
            </Row>
            <Row align="middle" style={{padding: 10}}>
                <Col span={3}><span style={{fontSize: 12, color: '#6d7383'}}>账号名</span></Col>
                <Col><span style={{fontSize: 12 }}>hx1014415</span></Col>
            </Row>
            <Row align="middle" style={{padding: 10}}>
                <Col span={3}><span style={{fontSize: 12, color: '#6d7383'}}>账号类型</span></Col>
                <Col><span style={{fontSize: 12 }}></span></Col>
            </Row>
            <Row align="middle" style={{padding: 10}}>
                <Col span={3}><span style={{fontSize: 12, color: '#6d7383'}}>手机号</span></Col>
                <Col span={5}><span style={{fontSize: 12 }}>153****1496</span></Col>
                <Col><span style={{fontSize: 12 }}>修改注册手机号</span></Col>
            </Row>
            <Row align="middle" style={{padding: 10}}>
                <Col span={3}><span style={{fontSize: 12, color: '#6d7383'}}>邮箱</span></Col>
                <Col span={5}><span style={{fontSize: 12 }}>510****@qq.com</span></Col>
                <Col><span style={{fontSize: 12 }}>修改邮箱</span></Col>
            </Row>
            <Row align="middle" style={{padding: 10}}>
                <Col span={3}><span style={{fontSize: 12, color: '#6d7383'}}>实名认证</span></Col>
                <Col span={5}><span style={{fontSize: 12 }}>未认证</span></Col>
                <Col><span style={{fontSize: 12 }}>去认证</span></Col>
            </Row>
            <Divider dashed />
            <Row align="middle" style={{padding: 10}}>
                <Col span={3} style={{fontWeight: 500}}>业务信息</Col>
                <Col><span style={{fontSize: 12, color: '#fd6845'}}>为了更好的提供服务，建议完善以下信息</span></Col>
            </Row>
            <Row align="middle" style={{padding: 10}}>
                <Col span={3} style={{fontSize: 12, color: '#6d7383'}}>主要行业应用</Col>
                <Col><span style={{fontSize: 12 }}>hx1014415</span></Col>
            </Row>
            <Row align="middle" style={{padding: 10}}>
                <Col span={3} style={{fontSize: 12, color: '#6d7383'}}>主要业务</Col>
                <Col><span style={{fontSize: 12 }}></span></Col>
            </Row>
            <Row align="middle" style={{padding: 10}}>
                <Col span={3} style={{fontSize: 12, color: '#6d7383'}}>网址</Col>
                <Col><span style={{fontSize: 12 }}></span></Col>
            </Row>
        </Card>
    </div>)
}

export default BaseInfo