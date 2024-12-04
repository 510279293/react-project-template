import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
    }
  },
  plugins: [react()],
  server: {
    proxy: {
      // ----------- 请求本地，代理至服务端
      '/cloudy_manage': {
          // 测试环境
          // target: `http://192.168.8.146:9486`, 
          target: `https://mock.mengxuegu.com/mock/639efc232e0f396e51a5c9e7/zxx`, 
          // 开发环境
          // target: 'http://localhost:9486/', 
          ws: false,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/cloudy_manage/, '')
        },
      // ----------- 请求本地，代理至dvm文件服务
      '/dvm-upload': {
        target: 'http://192.168.8.162:8080/', 
        // target: 'http://localhost/',
        ws: false,
        changeOrigin: true
      },
    }
  }
})
