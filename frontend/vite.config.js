import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    // 开发环境代理：前端 /api 请求转发到后端服务，避免跨域
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
})
