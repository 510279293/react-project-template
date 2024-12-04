import { Col, Divider, Layout, Menu, MenuProps, Row } from "antd";
import { MenuItem, TopMenuRoutes } from "@/router/config";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import { getPathStage } from "@/utils";
import { useRouterHook } from "@/router";
import { useState } from "react";
import { VerticalRightOutlined, VerticalLeftOutlined } from '@ant-design/icons';
import { useInitHook } from "@/hooks";
import { RouteBar } from "@/components";
import config from '@/project.config'
const { showRouteBar } = config

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
  const calcTopMenuRoutes = TopMenuRoutes?.map(({name, path}: MenuItem) => ({label: name, key: path}))

  useInitHook()

  
  return (<Layout>
      <Header>
          <Menu 
              mode="horizontal" 
              theme="dark" 
              items={calcTopMenuRoutes} 
              selectedKeys={calcDefaultOpenKeys}
              onSelect={({key}) => {
                const target = TopMenuRoutes?.find((v) => v.path === key)
                target && navigate(getFirstRoute(target).path)
              }}
          />
      </Header>
      <Layout style={{minHeight: `calc(100vh - 54px)`}}>
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
        <Content style={{height: '100%'}}> 
            { showRouteBar ? <RouteBar /> : null }
            {children}
        </Content>
      </Layout>
  </Layout>)
}
