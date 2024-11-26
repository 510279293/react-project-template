import { Alert, Card, Col, Row } from "antd"
import { useNavigate } from "react-router-dom"

export const Dot = () => <span style={{display: 'inline-block', width: 2, height: 2, background: '#6d7383', borderRadius: '50%', marginRight: 8, marginBottom: 3}}></span>


function Certification(){
    const navigate = useNavigate()
    return (<div style={{padding: 20}} className="certification">
        <Card >
            <Alert message={<span style={{fontSize: 12}}>账号类型的选择对您的账号归属有很大影响。例如，企业账号做个人实名认证后，发生账号责任人变动、账号欠费或归属纠纷时，可能会对您的使用产生不便或带来经济损失，请谨慎选择</span>} type="warning" showIcon closable />
            <div style={{marginTop: 16, marginBottom: 40}}>
                <div style={{fontWeight: 500, marginBottom: 6}}>请选择认证类型</div>
                <ul style={{color: '#6d7383', fontSize: 12, lineHeight: '26px', paddingLeft: 20}}>
                    <li> <Dot />个人实名认证有年龄限制，需年满18周岁</li>
                    <li> <Dot />个人/企业证件支持认证次数上限为10次（含单个账号多次认证及同一证件认证多个华夏云网账号）</li>
                    <li> <Dot />证件实名认证次数达到上限后，可通过银行卡认证方式进行实名认证</li>
                    <li> <Dot />个人实名认证通过后，可重新发起实名认证变更为企业账号</li>
                </ul>
            </div>
            <Row gutter={[12,12]} justify="center">
                <Col onClick={() => navigate('/userCenter/account/certification/personal')}>
                    <div style={{width: 280, height: 360, cursor: 'pointer', border: '1.5px dashed #dbdeea', borderRadius: 4}}>
                        <div style={{width: 198, height: 154, margin: '50px 41px 35px', background: 'url(https://console.huaxiacloud.com/static/img/person_auth.fd82c69.png)', backgroundSize: 'cover'}}></div>
                        <h3 style={{textAlign: 'center', fontSize: '1.17em', marginBottom: 16}}>个人认证</h3>
                        <p style={{lineHeight: '18px', color: '#6d7383', fontSize: 12, padding: '0 30px'}}>需要填写您的个人身份证信息及上传身份证正反面照片，即可完成认证</p>
                    </div>
                </Col>
                <Col onClick={() => navigate('/userCenter/account/certification/company')}>
                    <div style={{width: 280, height: 360, cursor: 'pointer', border: '1.5px dashed #dbdeea', borderRadius: 4}}>
                        <div style={{width: 198, height: 154, margin: '50px 41px 35px', background: 'url(https://console.huaxiacloud.com/static/img/business_auth.2635816.png)', backgroundSize: 'cover'}}></div>
                        <h3 style={{textAlign: 'center', fontSize: '1.17em', marginBottom: 16}}>企业认证</h3>
                        <p style={{lineHeight: '18px', color: '#6d7383', fontSize: 12, padding: '0 30px'}}>需要填写贵公司相关注册信息及法人代表身份证信息，即可完成认证</p>
                    </div>
                </Col>
            </Row>
        </Card>
    </div>)
}

export default Certification