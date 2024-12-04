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
                    <Col className="text-xs">
                        <div>余额</div>
                        <div className="font-sm font-bold">¥0.00</div>
                    </Col>
                    <Col className="text-sm"><a>立即充值</a></Col>
                </Row>),
    },
    {
        type: 'divider',
    },
    {
        key: '1',
        label: (<Row justify="space-between" >
            <Col className="text-xs">基本信息</Col>
            <Col className="text-xs ml-10">未实名认证</Col>
        </Row>),
    },
    {
        key: '2',
        label: (
            <a target="_blank" rel="noopener noreferrer" className="text-xs">
            访问控制服务
            </a>
        ),
    },
    {
        key: '3',
        label: (<a target="_blank" rel="noopener noreferrer" className="text-xs">
            待支付订单
            </a>),
    },
    {
        key: '4',
        label: (<a target="_blank" rel="noopener noreferrer" className="text-xs">
            产品续费
            </a>),
    },
    {
        type: 'divider',
    },
    {
        key: '10',
        label: (<Row justify="space-between">
            <Col className="text-xs">修改密码</Col>
            <Col className="text-xs" onClick={() => onAction?.('退出')}>退出</Col>
        </Row>),
    },
];

export function useUserHeaderHook() {
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
    const userMenuItems = items({onAction})
    return {
        userName,
        avatar,
        userMenuItems,
        onAction
    }
}

export default function Header({children}: any){
    const { avatar, userName, userMenuItems } = useUserHeaderHook()
    return (<Layout.Header>
        <Row justify="space-between" align="middle">
            <Col>卓见云</Col>
            <Col className="flex items-center">
                {children}
                <Dropdown menu={{ items: userMenuItems }}>
                    <Space className="ml-2"><Avatar src={avatar} />{userName}</Space>
                </Dropdown>
                <Divider type="vertical" style={{borderInlineStartColor: '#fff'}} />
                <MailOutlined />
            </Col>
        </Row>
    </Layout.Header>)
}
