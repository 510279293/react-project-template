import { DashBoard, Login, OverView, Register } from "@/pages";
import { RouteProps } from "react-router-dom";
import Account, { Address, BaseInfo, Certification, Partner } from "@/pages/userCenter/account";
import Message, { Station } from "@/pages/userCenter/message";
import React, { Suspense } from "react";
import Demo from "@/components/Demo";
import ProTableDemo from "@/components/Demo/ProTable";
import { 
    Role, Dictionary, Organization,
    default as System,
} from "@/pages/system";

import PersonalCertification from "@/pages/userCenter/account/certification/personal";
import CompanyCertification from "@/pages/userCenter/account/certification/company";
import Poker from "@/components/Demo/Poker";
import Chat from "@/components/Demo/Chat";
import Manage, { UserManage } from "@/pages/manage";
import UserCenter from "@/pages/userCenter";

export type MenuItem = {
    path: string;       // 路由路径
    name: string;       // 路由名称 或则 页面 title 名称
    element?: React.ReactNode; // 元素组件
    icon?: React.ReactNode; // 图标
    authCode?: number | string;   // 权限 code:  -1 表示不做权限管控
    hideInMenu?: boolean;  // 是否展示在菜单栏中
    children?: MenuItem[]; 
    lazy?: RouteProps['lazy'];
};

function createRouter(routers: MenuItem[], opts: { basename: string}): MenuItem[] {
    return routers.map((item: MenuItem) => {
        const { children, path } = item
        const calcPath = opts.basename + path
        const calcChildren = children ? [...createRouter(children||[], opts)] : undefined
        return {...item, path: calcPath, children: calcChildren}
    })
}

const loginRoutes: MenuItem[] = [
    {
        path: "/login",
        name: '登录',
        element: <Login />
        // element: <Lazy path="../pages/home" />
        // element: Lazy({path: `../pages/home`})
        // element: <A />
    },
    {
        path: "/register",
        name: '注册',
        element: <Register />
    },
]

const DemoRoutes: MenuItem[] = [
    {
        path: "/demo",
        name: '组件demo',
        element: <Demo />,
        children: [
            {
                path: "/demo/table",
                name: '表格demo',
                element: <ProTableDemo />
            },
            {
                path: "/demo/poker",
                name: '扑克牌',
                element: <Poker />
            },
            {
                path: "/demo/chat",
                name: '扑克牌',
                element: <Chat />
            }
        ]
    }
]

const toolRoutes: MenuItem[] = [
    {
        path: "/tool",
        name: '工具',
        element: <ProTableDemo />
    },
]

// 总览
const OverViewRoutes: MenuItem[] = [
    {
        path: '/overview',
        name: '总览',
        authCode: -1,
        element: <OverView />,
    }
]

// 仪表盘
const DashBoardRoutes: MenuItem[] = [
    {
        path: '/dashBoard',
        name: '仪表盘',
        authCode: -1,
        element: <DashBoard />
    }
]

// 用户管理
const UserManageRoutes: MenuItem[] = [
    {
        path: '/user',
        name: '用户管理',
        authCode: -1,
        element: <UserManage />
    }
]

// 云管服务
const ManageRoutes: MenuItem[] = [
    {
        path: '/manage',
        name: '运营服务',
        authCode: -1,
        element: <Manage />,
        children: createRouter([
            ...OverViewRoutes,
            ...DashBoardRoutes,
            ...UserManageRoutes,
        ], {basename: '/manage'})
    }
]

// 系统管理
const SystemRoutes: MenuItem[] = [
    {
        path: '/system',
        name: '系统管理',
        authCode: -1,
        element: <System />,
        children: createRouter([
            {
                path: '/sysRole',
                name: '系统角色管理',
                // authCode: 888,
                element: <Role />
            },
            {
                path: '/sysEnum',
                name: '数据字典管理',
                // authCode: 888,
                element: <Dictionary />
            },
            {
                path: '/organization',
                name: '组织架构',
                // authCode: 888,
                element: <Organization />
            }
        ], {basename: '/system'})
    }
]


// 账号中心
const AccountCenterRoutes: MenuItem[] = [
    {
        path: '/account',
        name: '账号中心',
        authCode: -1,
        element: <Account />,
        children: [
            {
                path: '/account/baseInfo',
                name: '基本信息',
                authCode: -1,
                element: <BaseInfo />,
            },
            {
                path: '/account/certification',
                name: '实名认证',
                authCode: -1,
                element: <Certification />,
            },
            {
                path: '/account/certification/personal',
                name: '个人实名认证',
                authCode: -1,
                hideInMenu: true,
                element: <PersonalCertification />,
            },
            {
                path: '/account/certification/company',
                name: '企业实名认证',
                authCode: -1,
                hideInMenu: true,
                element: <CompanyCertification />,
            },
            {
                path: '/account/partner',
                name: '我的合作伙伴',
                authCode: 88,
                element: <Partner />
            },
            {
                path: '/account/address',
                name: '收件地址管理',
                authCode: -1,
                element: <Address />
            }
        ]
    }
]

// 消息
const MessageRoutes: MenuItem[] = [
    {
        path: '/message',
        name: '消息',
        authCode: -1,
        element: <Message />,
        children: [
            {
                path: '/message/station',
                name: '站内消息',
                authCode: -1,
                element: <Station />
            }
        ]
    }
]

// 客户中心
const UserCenterRoutes: MenuItem[] = [
    {
        path: '/userCenter',
        name: '客户中心',
        authCode: -1,
        element: <UserCenter />,
        children: createRouter([...AccountCenterRoutes, ...MessageRoutes], {basename: '/userCenter'})
    }
]

// 页头顶部一级菜单
export const TopMenuRoutes: MenuItem[] = [
    ...SystemRoutes,
    ...ManageRoutes,
    ...UserCenterRoutes
]

// 静态路由（不受权限管控）
export const staticRoutes: MenuItem[] = [
    ...loginRoutes,
    ...DemoRoutes,
    ...toolRoutes
]

// 动态路由（受权限管控的）
export const dynamicRoutes: MenuItem[] = [
    ...ManageRoutes,
    ...UserCenterRoutes,
    ...SystemRoutes
]
