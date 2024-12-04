import {
  GithubFilled,
  InfoCircleFilled,
  PlusCircleFilled,
  QuestionCircleFilled,
  SearchOutlined,
} from '@ant-design/icons';
import type { ProSettings } from '@ant-design/pro-components';
import {
  PageContainer,
  ProCard,
  ProLayout,
  SettingDrawer,
} from '@ant-design/pro-components';
import { Button, Dropdown, Input } from 'antd';
import { useRef, useState } from 'react';
import defaultProps from './data';
import { MenuItem, TopMenuRoutes } from "@/router/config";
import { useLocation, useNavigate } from 'react-router-dom';
import { useRouterHook } from '@/router';
import { useInitHook } from '@/hooks';
import MyPageLayout from './index.back'
import { useUserHeaderHook } from './Header';
import { RouteBar } from "@/components";
import config from '@/project.config'
const { showRouteBar, showSetting, layoutToken } = config

const TopMenuPaths = TopMenuRoutes?.map(m => m.path)
const isTopMenu = (path: string) => TopMenuPaths.includes(path)

function actionsRender(props: any) {
  return []
  if (props.isMobile) return [];
  return [
    props.layout !== 'side' && document.body.clientWidth > 1200 ? (
      <div
        key="SearchOutlined"
        aria-hidden
        style={{
          display: 'flex',
          alignItems: 'center',
          marginInlineEnd: 24,
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <Input
          style={{
            borderRadius: 4,
            marginInlineEnd: 12,
            backgroundColor: 'rgba(57,62,67,1)',
            color: '#fff',
          }}
          prefix={
            <SearchOutlined
              style={{
                color: '#dfdfdf',
              }}
            />
          }
          placeholder="搜索方案"
          variant="borderless"
        />
        <PlusCircleFilled
          style={{
            color: 'var(--ant-primary-color)',
            fontSize: 24,
          }}
        />
      </div>
    ) : undefined,
    <InfoCircleFilled key="InfoCircleFilled" />,
    <QuestionCircleFilled key="QuestionCircleFilled" />,
    <GithubFilled key="GithubFilled" />,
  ];
}



function PageLayout({children}: any) {
  const navigate = useNavigate()
  const location = useLocation()
  const { pathname } = location
  const { getFirstRoute } = useRouterHook()
  const { userName, avatar, userMenuItems } = useUserHeaderHook()
  const containerRef = useRef<HTMLDivElement>(null)

  useInitHook()

  const [settings, setSetting] = useState<Partial<ProSettings> | undefined>({
    fixSiderbar: true,
    layout: 'mix',
    splitMenus: true,
  });

  return (
    <div
      style={{
        height: '100vh',
      }}
      ref={containerRef}
    >
      <ProLayout
        {...defaultProps}
        token={layoutToken}
        route={{
          path: '/',
          routes: TopMenuRoutes,
        }}
        location={{ pathname }}
        avatarProps={{
          src: avatar,
          size: 'small',
          title: userName,
          render: (props, dom) => {
            return (
              <Dropdown
                menu={{
                  items: userMenuItems
                }}
              >
                {dom}
              </Dropdown>
            );
          },
        }}
        actionsRender={actionsRender}
        menuFooterRender={(props) => {
          if (props?.collapsed) return undefined;
          return (<div className='text-center'>© 2021 卓见云</div>)
        }}
        onMenuHeaderClick={(e) => console.log('menuHeaderClick', e)}
        menuItemRender={(item: any, dom) => (
          <a
            onClick={() => {
              const { path } = item || {}
              if (isTopMenu(path)) {
                const target = TopMenuRoutes?.find((v) => v.path === path)
                target && navigate(getFirstRoute(target).path)
              } else {
                navigate(item.path);
              }
            }}
          >
            {dom}
          </a>
        )}
        {...settings}
      >
        <PageContainer 
          pageHeaderRender={() => null}
        >
          { showRouteBar ? <RouteBar /> : null }
          {children}
        </PageContainer>
      </ProLayout>
      {
        showSetting ? <SettingDrawer
                        pathname={pathname}
                        enableDarkTheme
                        getContainer={() => containerRef?.current}
                        settings={settings}
                        onSettingChange={setSetting}
                        disableUrlParams={false}
                      /> : null
      }
      
    </div>
  );
}

// export default MyPageLayout
export default PageLayout