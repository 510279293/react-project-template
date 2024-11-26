import { Avatar, Col, Divider, Dropdown, Layout, MenuProps, Row, Space } from "antd";
import { MailOutlined } from '@ant-design/icons'
import { useSelector } from "react-redux";
import { StateType } from "@/store";
import { TopMenuRoutes } from "@/router/config";
import { removeToken } from "@/utils";
import { useNavigate } from "react-router-dom";

const url = 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'
const items: ({onAction}: any) => MenuProps['items'] = ({onAction}) => [
    {
        key: '0',
        label: (<Row justify="space-between">
                <Col style={{fontSize: 12}}>
                    <div>余额</div>
                    <div style={{fontSize: 16, fontWeight: 500}}>¥0.00</div>
                </Col>
                <Col style={{fontSize: 12}}><a>立即充值</a></Col>
            </Row>),
    },
    {
        type: 'divider',
    },
    {
        key: '1',
        label: (<Row justify="space-between" >
            <Col style={{fontSize: 12}}>基本信息</Col>
            <Col style={{fontSize: 12, marginLeft: 30}}>未实名认证</Col>
        </Row>),
    },
    {
        key: '2',
        label: (
            <a target="_blank" rel="noopener noreferrer" style={{fontSize: 12}}>
            访问控制服务
            </a>
        ),
    },
    {
        key: '3',
        label: (<a target="_blank" rel="noopener noreferrer" style={{fontSize: 12}}>
            待支付订单
            </a>),
    },
    {
        key: '4',
        label: (<a target="_blank" rel="noopener noreferrer" style={{fontSize: 12}}>
            产品续费
            </a>),
    },
    {
        type: 'divider',
    },
    {
        key: '10',
        label: (<Row justify="space-between">
            <Col style={{fontSize: 12}}>修改密码</Col>
            <Col style={{fontSize: 12}} onClick={() => onAction?.('退出')}>退出</Col>
        </Row>),
    },
];

export default function Header({children}: any){
    const navigate = useNavigate()
    const { userName, avatar } = useSelector((state: StateType) => state.userInfo)  // 获取用户所拥有的所有 权限 code
    const onAction = async (action: any) => {
        switch (action) {
            case '退出':
                // 退出操作
                removeToken()
                navigate('/login')
                break;
            default:
                console.log('onAction:', action)
                break;
        }
    }
    return (<Layout.Header>
        <Row justify="space-between" align="middle">
            <Col>卓见云</Col>
            <Col>
                {children}
                <Dropdown menu={{ items: items({onAction}) }}>
                    <Space><Avatar src={avatar} />{userName}</Space>
                </Dropdown>
                <Divider type="vertical" style={{borderInlineStartColor: '#fff'}} />
                <MailOutlined />
            </Col>
        </Row>
    </Layout.Header>)
}
