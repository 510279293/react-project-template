import { Alert, Card, Col, Row } from "antd"
import { Dot } from ".."
import { ProForm, ProFormSelect, ProFormText } from "@ant-design/pro-components"
import { useNavigate } from "react-router-dom"
import { stringify } from "qs"
import { useParseSearch } from "@/hooks"

const labelCol = { span: 6 }
const wrapperCol = { span: 10 }

const conmonProps: any = {
    layout: 'horizontal',
    labelCol,
    wrapperCol
}

// 个人 银行卡 认证
const BankCardCertification = () => {
    return (<div style={{padding: 20}}>
        <Card>
            <Alert 
                type="info" 
                showIcon 
                style={{marginBottom: 50}}
                message={<>
                    <ul style={{color: '#6d7383', fontSize: 12, lineHeight: '26px', paddingLeft: 20}}>
                        <li> <Dot />若您使用交通银行、北京银行、上海银行、广发银行、浦发银行或平安银行的银行卡进行个人实名认证，需要先开通此银行卡的 银联在线支付 ，或者建议您更换使用其他银行的银行卡。 支持个人借记卡及信用卡</li>
                        <li> <Dot />个人银行卡信息仅用于进行实名认证，不会绑定您的银行卡，产生任何隐形消费，也不会泄露您的银行卡信息</li>
                    </ul>
                </>}
            />
            <ProForm {...conmonProps}>
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
        </Card>
    </div>)
}

// 个人认证  证件认证
const IDCertification = () => {
    return (<div style={{padding: 20}}>
        <Card>
            <Alert 
                type="info" 
                showIcon 
                message="个人证件信息仅用于实名认证，不会泄露您的任何证件信息"
                style={{marginBottom: 50}}
            />
            <ProForm {...conmonProps}>
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
        </Card>
    </div>)
}

const CertificationSelect = () => {
    const navigate = useNavigate()
    return (<div style={{padding: 20}} className="certification">
        <Card >
            <Alert style={{marginBottom: 46}} message={<span style={{fontSize: 12}}>个人银行卡信息仅用于进行实名认证，不会绑定您的银行卡，产生任何隐形消费，也不会泄露您的银行卡信息</span>} type="info" showIcon closable />
            <Row gutter={[12,12]} justify="center">
                <Col onClick={() => navigate(`/userCenter/account/certification/personal?${stringify({type: 'bankCard'})}`)}>
                    <div style={{width: 436, height: 406, cursor: 'pointer', border: '1.5px dashed #dbdeea', borderRadius: 4}}>
                        <div style={{width: 198, height: 154, margin: '50px 41px 35px', background: 'url(https://console.huaxiacloud.com/static/img/account2x.c2fb1fb.png)', backgroundSize: 'cover'}}></div>
                        <h3 style={{textAlign: 'center', fontSize: '1.17em', marginBottom: 16}}>银行卡认证</h3>
                        <p style={{lineHeight: '18px', color: '#6d7383', fontSize: 12, padding: '0 30px'}}>请提前准备好您的银行卡资料</p>
                        <p style={{lineHeight: '18px', color: '#6d7383', fontSize: 12, padding: '0 30px'}}>确保办理该银行卡所预留手机号，可以接收短信验证码</p>
                    </div>
                </Col>
                <Col onClick={() => navigate(`/userCenter/account/certification/personal?${stringify({type: 'ID'})}`)}>
                    <div style={{width: 436, height: 406, cursor: 'pointer', border: '1.5px dashed #dbdeea', borderRadius: 4}}>
                        <div style={{width: 198, height: 154, margin: '50px 41px 35px', background: 'url(https://console.huaxiacloud.com/static/img/credent2x.8ad8bee.png)', backgroundSize: 'cover'}}></div>
                        <h3 style={{textAlign: 'center', fontSize: '1.17em', marginBottom: 16}}>证件认证</h3>
                        <p style={{lineHeight: '18px', color: '#6d7383', fontSize: 12, padding: '0 30px'}}>请提前准备好您的个人证件（护照/港澳居民来往内地通行证/中国以外驾照等）</p>
                        <p style={{lineHeight: '18px', color: '#6d7383', fontSize: 12, padding: '0 30px'}}>上传证件照片</p>
                        <p style={{lineHeight: '18px', color: '#6d7383', fontSize: 12, padding: '0 30px'}}>等待审核</p>
                    </div>
                </Col>
            </Row>
        </Card>
    </div>)
}

const PersonalCertification = () => {
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

export default PersonalCertification