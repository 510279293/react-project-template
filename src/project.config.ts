import { ProTokenType } from '@ant-design/pro-components';
import { ThemeConfig } from 'antd';
// 项目配置
type ProjectConfig = {
    TOKENKEY: string;       // 接口请求的 token 名
    APIBASEURL?: string;    // 接口请求的 baseUrl
    theme: ThemeConfig,     // 主题配置
    layoutToken?: ProTokenType['layout'],  // layout 主题配置
    showRouteBar?: boolean;      // 是否显示顶部导航栏
    useCache?: boolean;      // 是否开启 keepalive 页面缓存，页面缓存很消耗性能 【慎用】
    showSetting?: boolean;   // 是否显示设置面板
}

// 主题配置
const theme: ThemeConfig = {
    components: {
      Layout: {
        headerHeight: 54,
        headerColor: '#fff',
        headerBg: '#20243d'
      }
    }
}

// layout 主题配置
const layoutToken: ProTokenType['layout'] = {
  header: {
    colorBgHeader: '#292f33',
    colorHeaderTitle: '#fff',
    colorTextMenu: '#dfdfdf',
    colorTextMenuSecondary: '#dfdfdf',
    colorTextMenuSelected: '#fff',
    colorBgMenuItemSelected: '#22272b',
    colorTextRightActionsItem: '#dfdfdf',
  },
  sider: {
    colorMenuBackground: '#fff',
    colorMenuItemDivider: '#dfdfdf',
    colorTextMenu: '#595959',
    colorTextMenuSelected: 'rgba(42,122,251,1)',
    colorBgMenuItemSelected: 'rgba(230,243,254,1)',
  },
  pageContainer: {
    paddingInlinePageContainerContent: 0
  }
}

const config: ProjectConfig = {
    // TOKENKEY: 'token',
    TOKENKEY: 'Authorization',
    theme,
    layoutToken,
    showRouteBar: true,
    useCache: true,
    showSetting: true
}

export default config
