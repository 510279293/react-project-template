import ReactDOM from 'react-dom/client'
import { ConfigProvider, ThemeConfig } from 'antd';
import App from './App.tsx'
import config from '../project.config'
import zhCN from 'antd/locale/zh_CN';
import './assets/css/index.less'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <ConfigProvider locale={zhCN} theme={config?.theme}>
      <App />
    </ConfigProvider>,
)
