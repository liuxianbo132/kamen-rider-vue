// axios 实例封装：统一携带 token、统一处理响应格式与 401 过期
import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
  // 开发走 Vite 代理（/api），生产直接请求 Render 后端（CORS 已开启）
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000
})

// 请求拦截器：自动携带 token
request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// 响应拦截器：解包统一格式 { code, data, message }
request.interceptors.response.use(
  (res) => {
    const body = res.data
    if (body.code !== 200) {
      ElMessage.error(body.message || '请求失败')
      return Promise.reject(body)
    }
    return body.data // 直接返回业务数据
  },
  (err) => {
    // token 过期/无效：清除登录状态并跳转登录页
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('role')
      ElMessage.error('登录已过期，请重新登录')
      window.location.href = '/login'
      return Promise.reject(err)
    }
    ElMessage.error(err.response?.data?.message || '网络异常，请稍后重试')
    return Promise.reject(err)
  }
)

export default request
