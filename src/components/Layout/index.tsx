import { Col, Divider, Layout, Menu, MenuProps, Row } from "antd";
import { MenuItem, TopMenuRoutes, dynamicRoutes } from "@/router/config";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import { getPathStage } from "@/utils";
import { useRouterHook } from "@/router";
import { useEffect, useState } from "react";
import { VerticalRightOutlined, VerticalLeftOutlined } from '@ant-design/icons';
import { useInitHook } from "@/hooks";

type SliderMenuItem = Required<MenuProps>['items'][number];

const { Content, Sider } = Layout

function transformRouteConfigToMenuItems(config: MenuItem[]): SliderMenuItem[] {
  return config.filter(({hideInMenu}: MenuItem) => !hideInMenu).map(({path: key, name: label, icon, children}: MenuItem) => ({
    key,
    label,
    icon,
    children: children ? transformRouteConfigToMenuItems(children) : undefined
  }))
}

const HeaderTopMenu = () => {
  const navigate = useNavigate()
  return TopMenuRoutes.map(v => <span style={{margin: '0 12px', cursor: 'pointer'}} key={v.name} onClick={() => navigate(v.path)}>{v.name}</span>) 
}


export default function PageLayout({children}: any){
  // const dispatch = useDispatch<any>();
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState<boolean>(false)
  const { calcMenuSelectedKeys, getFirstRoute } = useRouterHook()
  const onSelect = (item: SliderMenuItem) => navigate((item as any).key)
  const selectedKeys = calcMenuSelectedKeys(location.pathname)
  const calcDefaultOpenKeys = selectedKeys.map(getPathStage).flat()
  const targetTopMenuRouter = TopMenuRoutes.find(router => router.path === calcDefaultOpenKeys[0])
  useInitHook()
  
  return (<Layout>
      <Header>
          { TopMenuRoutes.map(v => <span style={{margin: '0 12px', cursor: 'pointer'}} key={v.name} onClick={() => navigate(getFirstRoute(v).path)}>{v.name}</span>) }
      </Header>
      <Layout style={{minHeight: 'calc(100vh - 54px)'}}>
      {
        targetTopMenuRouter?.children ? <Sider theme="light" collapsible trigger={null} collapsed={collapsed}>
          <div style={{padding: 10, paddingBottom: 0}}>
            <Row justify="space-between" align="middle">
                <Col style={{fontSize: 18, fontWeight: 500}}>{collapsed ? null : targetTopMenuRouter?.name}</Col>
                <Col style={{fontSize: 18, cursor: 'pointer'}}>
                  {collapsed ? <VerticalRightOutlined onClick={() => setCollapsed(!collapsed)} /> : <VerticalLeftOutlined onClick={() => setCollapsed(!collapsed)} />}
                </Col>
            </Row>
            <Divider style={{marginTop: 8, marginBottom: 0}} />
          </div>
          <Menu
              mode="inline"
              items={transformRouteConfigToMenuItems(targetTopMenuRouter?.children)}
              onSelect={onSelect}
              selectedKeys={selectedKeys}
              defaultOpenKeys={calcDefaultOpenKeys}
          />
        </Sider> : null
      }
        <Content> 
          {children} 
        </Content>
      </Layout>
  </Layout>)
}
