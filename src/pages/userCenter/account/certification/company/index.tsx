import { Alert, Card, Col, Row } from "antd"
import { Dot } from ".."
import { ProForm, ProFormSelect, ProFormText } from "@ant-design/pro-components"
import { useParseSearch } from "@/hooks"
import { useNavigate } from "react-router-dom"
import { stringify } from "qs"


// 个人 银行卡 认证
const BankCardCertification = () => {
    return (<>
        <Alert 
            type="info" 
            showIcon 
            message={<>
                <ul style={{color: '#6d7383', fontSize: 12, lineHeight: '26px', paddingLeft: 20}}>
                    <li> <Dot />若您使用交通银行、北京银行、上海银行、广发银行、浦发银行或平安银行的银行卡进行个人实名认证，需要先开通此银行卡的 银联在线支付 ，或者建议您更换使用其他银行的银行卡。 支持个人借记卡及信用卡</li>
                    <li> <Dot />个人银行卡信息仅用于进行实名认证，不会绑定您的银行卡，产生任何隐形消费，也不会泄露您的银行卡信息</li>
                </ul>
            </>}
        />
        <ProForm>
            <ProFormText 
                label="真实姓名"
                name="realName"
                placeholder="请输入真实姓名"
            />
            <ProFormText 
                label="身份证号码"
                name="idNum"
                placeholder="请输入身份证号码"
            />
            <ProFormText 
                label="银行卡号"
                name="bankCardNum"
                placeholder="请输入银行卡号"
            />
            <ProFormText 
                label="手机号"
                name="phone"
                placeholder="请输入手机号"
                fieldProps={{
                    
                }}
            />
            <ProFormText 
                label="短信验证码"
                name="code"
                placeholder="请输入短信验证码"
            />
        </ProForm>
    </>)
}

// 个人认证  证件认证
const IDCertification = () => {
    return (<>
        <Alert 
            type="info" 
            showIcon 
            message="个人证件信息仅用于实名认证，不会泄露您的任何证件信息"
        />
        <ProForm>
            <ProFormText 
                label="真实姓名"
                name="realName"
                placeholder="请输入真实姓名"
            />
            <ProFormSelect
                label="证件类型"
                name="idNum"
                placeholder="请输入身份证号码"
            />
            <ProFormText 
                label="银行卡号"
                name="bankCardNum"
                placeholder="请输入银行卡号"
            />
            <ProFormText 
                label="手机号"
                name="phone"
                placeholder="请输入手机号"
                fieldProps={{
                    
                }}
            />
            <ProFormText 
                label="短信验证码"
                name="code"
                placeholder="请输入短信验证码"
            />
        </ProForm>
    </>)
}

const CertificationSelect = () => {
    const navigate = useNavigate()
    return (<div style={{padding: 20}} className="certification">
        <Card >
            <Alert style={{marginBottom: 46}} message={<span style={{fontSize: 12}}>企业对公账户信息仅用于实名认证，不会对您的企业银行账户扣取任何费用，也不会泄露您的企业银行信息</span>} type="info" showIcon closable />
            <Row gutter={[12,12]} justify="center">
                <Col onClick={() => navigate(`/userCenter/account/certification/company?${stringify({type: 'bankCard'})}`)}>
                    <div style={{width: 436, height: 406, cursor: 'pointer', border: '1.5px dashed #dbdeea', borderRadius: 4}}>
                        <div style={{width: 198, height: 154, margin: '50px 41px 35px', background: 'url(https://console.huaxiacloud.com/static/img/account2x.c2fb1fb.png)', backgroundSize: 'cover'}}></div>
                        <h3 style={{textAlign: 'center', fontSize: '1.17em', marginBottom: 16}}>银行对公账户认证</h3>
                        <p style={{lineHeight: '18px', color: '#6d7383', fontSize: 12, padding: '0 30px'}}>最快30分钟</p>
                        <p style={{lineHeight: '18px', color: '#6d7383', fontSize: 12, padding: '0 30px'}}>请准备好企业的银行对公转账</p>
                        <p style={{lineHeight: '18px', color: '#6d7383', fontSize: 12, padding: '0 30px'}}>并且确保该账户可用，平台将向该账户转账</p>
                        <p style={{lineHeight: '18px', color: '#6d7383', fontSize: 12, padding: '0 30px'}}>确保您能直接或间接查询该账户的转账信息，需要接收并提交验证码</p>
                    </div>
                </Col>
                <Col onClick={() => navigate(`/userCenter/account/certification/company?${stringify({type: 'ID'})}`)}>
                    <div style={{width: 436, height: 406, cursor: 'pointer', border: '1.5px dashed #dbdeea', borderRadius: 4}}>
                        <div style={{width: 198, height: 154, margin: '50px 41px 35px', background: 'url(https://console.huaxiacloud.com/static/img/credent2x.8ad8bee.png)', backgroundSize: 'cover'}}></div>
                        <h3 style={{textAlign: 'center', fontSize: '1.17em', marginBottom: 16}}>证件认证</h3>
                        <p style={{lineHeight: '18px', color: '#6d7383', fontSize: 12, padding: '0 30px'}}>1-3个工作日</p>
                        <p style={{lineHeight: '18px', color: '#6d7383', fontSize: 12, padding: '0 30px'}}>请准备好企业营业执照以及法定代表人身份证。非法定代表人申请认证需准备被授权人身份证，以及授权书/被授权人工卡/被授权人名片（三选一）</p>
                    </div>
                </Col>
            </Row>
        </Card>
    </div>)
}

const CompanyCertification = () => {
    const { type } = useParseSearch()
    switch (type) {
        case 'bankCard':
            return <BankCardCertification />
        case 'ID':
            return <IDCertification />
        default:
            return <CertificationSelect />
    }
}

export default CompanyCertification