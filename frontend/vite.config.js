import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: true, // 监听 0.0.0.0，允许手机等局域网设备访问
    port: 5173,
    // 开发环境代理：前端 /api 请求转发到后端服务，避免跨域
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
})
