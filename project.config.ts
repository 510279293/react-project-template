import { ThemeConfig } from 'antd';
// 项目配置
type ProjectConfig = {
    TOKENKEY: string;  // 接口请求的 token 名
    APIBASEURL?: string;    // 接口请求的 baseUrl
    theme: ThemeConfig
}

const theme: ThemeConfig = {
    components: {
      Layout: {
        headerHeight: 54,
        headerColor: '#fff',
        headerBg: '#20243d'
      }
    }
}

const config: ProjectConfig = {
    // TOKENKEY: 'token',
    TOKENKEY: 'Authorization',
    theme
}

export default config
