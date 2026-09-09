// 认证相关接口
import request from './request'

// 登录
export const loginApi = (data) => request.post('/auth/login', data)

// 注册
export const registerApi = (data) => request.post('/auth/register', data)

// 获取当前登录用户信息
export const meApi = () => request.get('/auth/me')

// 获取图形验证码（后端生成 SVG）
export const getCaptchaApi = () => request.get('/captcha')
