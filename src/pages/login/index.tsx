import {
    AlipayOutlined,
    LockOutlined,
    MobileOutlined,
    TaobaoOutlined,
    UserOutlined,
    WeiboOutlined,
} from '@ant-design/icons';
import {
  CaptFieldRef,
    LoginFormPage,
    ProConfigProvider,
    ProFormCaptcha,
    ProFormCheckbox,
    ProFormDependency,
    ProFormItem,
    ProFormText,
} from '@ant-design/pro-components';
import { Col, Divider, Popover, Row, Space, Tabs, TabsProps, message, theme } from 'antd';
import type { CSSProperties } from 'react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { accountLogin, phoneLogin, register } from '@/api';
import { ProFormTextCaptcha } from '@/components';
import { productApi, setToken } from '@/utils';
  
type LoginType = 'phone' | 'account';

const iconStyles: CSSProperties = {
    color: 'rgba(0, 0, 0, 0.2)',
    fontSize: '18px',
    verticalAlign: 'middle',
    cursor: 'pointer',
};

type QuickLoginWarpProps = {
    borderColor: string;
    children?: any
}

const phoneLoginApi = productApi(phoneLogin)
const accountLoginApi = productApi(accountLogin)
const registerApi = productApi(register)

const QuickLoginWarp = ({borderColor, children}: QuickLoginWarpProps) => {
    return (<div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          height: 40,
          width: 40,
          border: '1px solid ' + borderColor,
          borderRadius: '50%',
        }}
      >
        {children}
      </div>)
}

const items: TabsProps['items'] = [
    {
        label: '账号密码登录',
        key: 'account'
    },
    {
        label: '手机号登录',
        key: 'phone'
    }
]

type AccountLoginFormProps = {
    colorText: string
}
const AccountLoginForm = ({colorText}: AccountLoginFormProps) => {
    return (<>
       <ProFormText
          name="username"
          fieldProps={{
            size: 'large',
            prefix: (
              <UserOutlined
                style={{
                  color: colorText,
                }}
                className={'prefixIcon'}
              />
            ),
          }}
          placeholder={'用户名'}
          rules={[
            {
              required: true,
              message: '请输入用户名!',
            },
          ]}
        />
        <ProFormText.Password
          name="password"
          fieldProps={{
            size: 'large',
            prefix: (
              <LockOutlined
                style={{
                  color: colorText,
                }}
                className={'prefixIcon'}
              />
            ),
          }}
          placeholder={'密码'}
          rules={[
            {
              required: true,
              message: '请输入密码！',
            },
          ]}
        />
    </>)
} 

const PhoneLoginForm = ({colorText}: AccountLoginFormProps) => {
  const [open, setOpen] = useState(false)
  const captchaRef = useRef<CaptFieldRef | null | undefined>();
  return (<>
      <ProFormText
        fieldProps={{
          size: 'large',
          prefix: (
            <MobileOutlined
              style={{
                color: colorText,
              }}
              className={'prefixIcon'}
            />
          ),
        }}
        name="phone"
        placeholder={'手机号'}
        rules={[
          {
            required: true,
            message: '请输入手机号！',
          },
          {
            pattern: /^1\d{10}$/,
            message: '手机号格式错误！',
          },
        ]}
      />
      <ProFormDependency name={['phone']}>
        {
          ({phone}) => (<ProFormCaptcha
            phoneName={['phone', 'imageCaptchaCode']}
            name="captcha"
            fieldProps={{size: 'large'}}
            captchaProps={{size: 'large'}}
            rules={[{required: true,message: '请输入验证码',}]}
            placeholder="请输入验证码"
            fieldRef={captchaRef}
            captchaTextRender={(timing: boolean, count: number) => {
                if (!timing) {
                    return  <Popover 
                                placement="topRight"
                                overlayInnerStyle={{transform: 'translateX(17px)'}}
                                open={open}
                                content={<ProFormTextCaptcha 
                                    name="imageCaptchaCode"
                                    fieldProps={{
                                      width: 327 as any, 
                                      height: 150, 
                                      topTips: true, 
                                      params: {phone, type: 3},
                                      onSuccess: () => {
                                        captchaRef?.current?.startTiming()
                                        setOpen(false)
                                      }
                                    }} 
                                    rules={[{required: true, message: '请点击检验文字验证码',}]} 
                                />}
                            >
                                <span onClick={() => {
                                  if (!/^1\d{10}$/.test(phone)) return
                                  setOpen(!open)
                                }}>获取验证码</span>
                            </Popover>
                }
                return `${count} 后重新获取`
            }}
            onGetCaptcha={async (phone) => {
                if (phone) {
                    // const { code } = await sendCaptcha({userPhone, imageCaptchaCode, type: 0}) as any
                    // if (code < 0) {}
                    // if (code !== 0) {
                    //     throw new Error('不需要倒计时')
                    // }
                    return
                }
                throw new Error('不需要倒计时')
            }}
          />)
        }
      </ProFormDependency>
    </>)
}

const RegisterForm = ({colorText}: AccountLoginFormProps) => {
  const [open, setOpen] = useState(false)
  const captchaRef = useRef<CaptFieldRef | null | undefined>();
  return (<>
      <ProFormText
        fieldProps={{
          size: 'large',
          prefix: (
            <MobileOutlined
              style={{
                color: colorText,
              }}
              className={'prefixIcon'}
            />
          ),
        }}
        name="phone"
        placeholder={'手机号'}
        rules={[
          {
            required: true,
            message: '请输入手机号！',
          },
          {
            pattern: /^1\d{10}$/,
            message: '手机号格式错误！',
          },
        ]}
      />
      <ProFormDependency name={['phone']}>
        {
          ({phone}) => (<ProFormCaptcha
            phoneName={['phone', 'imageCaptchaCode']}
            name="captcha"
            fieldProps={{size: 'large'}}
            captchaProps={{size: 'large'}}
            rules={[{required: true,message: '请输入验证码',}]}
            placeholder="请输入验证码"
            fieldRef={captchaRef}
            captchaTextRender={(timing: boolean, count: number) => {
                if (!timing) {
                    return  <Popover 
                                placement="topRight"
                                overlayInnerStyle={{transform: 'translateX(17px)'}}
                                open={open}
                                content={<ProFormTextCaptcha 
                                    name="imageCaptchaCode"
                                    fieldProps={{
                                      width: 327 as any, 
                                      height: 150, 
                                      topTips: true, 
                                      params: {phone, type: 0},
                                      onSuccess: () => {
                                        captchaRef?.current?.startTiming()
                                        setOpen(false)
                                      }
                                    }} 
                                    rules={[{required: true, message: '请点击检验文字验证码',}]} 
                                />}
                            >
                                <span onClick={() => {
                                  if (!/^1\d{10}$/.test(phone)) return
                                  setOpen(!open)
                                }}>获取验证码</span>
                            </Popover>
                }
                return `${count} 后重新获取`
            }}
            onGetCaptcha={async (phone) => {
                if (phone) {
                    // const { code } = await sendCaptcha({userPhone, imageCaptchaCode, type: 0}) as any
                    // if (code < 0) {}
                    // if (code !== 0) {
                    //     throw new Error('不需要倒计时')
                    // }
                    return
                }
                throw new Error('不需要倒计时')
            }}
          />)
        }
      </ProFormDependency>

    </>)
}
  
const LoginPage = () => {
    const [loginType, setLoginType] = useState<LoginType>('account');
    const { token } = theme.useToken();
    const navigate = useNavigate()

    const login = async (values: any) => {
      const whichApi = loginType === 'phone' ? phoneLoginApi : accountLoginApi
      const { data, success, msg } = await whichApi(values, false)
      if (success) {
        setToken(data?.token)
        navigate('/cloudService/overview')
      }
    }
    return (
      <div
        style={{
          backgroundColor: 'white',
          height: '100vh',
        }}
      >
        <LoginFormPage
          backgroundImageUrl="https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*y0ZTS6WLwvgAAAAAAAAAAAAADml6AQ/fmt.webp"
        //   logo="https://github.githubassets.com/images/modules/logos_page/Octocat.png"
          backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
          title="多云平台"
          containerStyle={{
            backgroundColor: 'rgba(0, 0, 0,0.65)',
            backdropFilter: 'blur(4px)',
          }}
          onFinish={login}
          subTitle="全球最大的云托管平台"
          actions={
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <Divider plain>
                <span
                  style={{
                    color: token.colorTextPlaceholder,
                    fontWeight: 'normal',
                    fontSize: 14,
                  }}
                >
                  其他登录方式
                </span>
              </Divider>
              <Space align="center" size={24}>
                <QuickLoginWarp borderColor={token.colorPrimaryBorder}>
                  <AlipayOutlined style={{ ...iconStyles, color: '#1677FF' }} />
                </QuickLoginWarp>
                <QuickLoginWarp borderColor={token.colorPrimaryBorder}>
                  <TaobaoOutlined style={{ ...iconStyles, color: '#FF6A10' }} />
                </QuickLoginWarp>
                <QuickLoginWarp borderColor={token.colorPrimaryBorder}>
                  <WeiboOutlined style={{ ...iconStyles, color: '#1890ff' }} />
                </QuickLoginWarp>
              </Space>
            </div>
          }
        >
          <Tabs
            centered
            activeKey={loginType}
            onChange={(activeKey) => setLoginType(activeKey as LoginType)}
            items={items}
          />
          {loginType === 'account' && <AccountLoginForm colorText={token.colorText} />}
          {loginType === 'phone' && <PhoneLoginForm colorText={token.colorText} />}
          <Row
            style={{
              marginBlockEnd: 24,
            }}
            justify="space-between"
          >
            <Col>
              <ProFormCheckbox noStyle name="autoLogin">
                自动登录
              </ProFormCheckbox>
            </Col>
            <Col>
              <a onClick={() => navigate('/register')}>
                立即注册
              </a>
              <Divider type="vertical" />
              <a>
                忘记密码
              </a>
            </Col>
            
          </Row>
        </LoginFormPage>
      </div>
    );
};

export const RegisterPage = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate()

  const onFinish = async (values: any) => {
    const { data, success, msg } = await registerApi({...values, userName: values?.username}, false)
    if (success) {
      navigate('/login')
    }
  }
  return (
    <div
      style={{
        backgroundColor: 'white',
        height: '100vh',
      }}
    >
      <LoginFormPage
        backgroundImageUrl="https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*y0ZTS6WLwvgAAAAAAAAAAAAADml6AQ/fmt.webp"
      //   logo="https://github.githubassets.com/images/modules/logos_page/Octocat.png"
        backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
        title="欢迎注册多云平台"
        containerStyle={{
          backgroundColor: 'rgba(0, 0, 0,0.65)',
          backdropFilter: 'blur(4px)',
        }}
        onFinish={onFinish}
        submitter={{
          searchConfig: {
            submitText: '注册'
          }
        }}
        subTitle="全球最大的云托管平台"
        actions={
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            {/* <Divider plain>
              <span
                style={{
                  color: token.colorTextPlaceholder,
                  fontWeight: 'normal',
                  fontSize: 14,
                }}
              >
                其他登录方式
              </span>
            </Divider> */}
            <Space align="center" size={24}>

            </Space>
          </div>
        }
      >
        <RegisterForm colorText={token.colorText} />
        <AccountLoginForm colorText={token.colorText} />
        <Row
          style={{
            marginBlockEnd: 24,
          }}
          justify="space-between"
        >
          <Col>
            <ProFormCheckbox noStyle name="autoLogin">
              同意协议
            </ProFormCheckbox>
          </Col>
          <Col>
            <a onClick={() => navigate('/login')}>
              已有帐号，去登录
            </a>
          </Col>
          
        </Row>
      </LoginFormPage>
    </div>
  );
};

export function Register () {
  return (
    <ProConfigProvider dark>
      <RegisterPage />
    </ProConfigProvider>
);
}
  
export default function Login (){
    return (
        <ProConfigProvider dark>
          <LoginPage />
        </ProConfigProvider>
    );
}

