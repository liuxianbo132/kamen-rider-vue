// 认证与权限中间件
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/secrets.js'
import { userModel } from '../models/userModel.js'

// 登录认证：从请求头 Authorization: Bearer <token> 中解析 JWT
export function authRequired(req, res, next) {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''
  if (!token) {
    return res.status(401).json({ code: 401, data: null, message: '未登录或缺少 token' })
  }

  let payload
  try {
    payload = jwt.verify(token, JWT_SECRET)
  } catch {
    return res.status(401).json({ code: 401, data: null, message: 'token 无效或已过期，请重新登录' })
  }

  // 校验 token 版本：用户改密后 token_version 自增，此前签发的旧 token 立即失效
  const row = userModel.getTokenVersion(payload.id)
  if (!row || (payload.tokenVersion ?? 0) !== row.token_version) {
    return res.status(401).json({ code: 401, data: null, message: '登录状态已失效，请重新登录' })
  }

  // 校验通过后将用户信息挂载到 req.user，供后续控制器使用
  req.user = payload
  next()
}

// 管理员权限：需在 authRequired 之后使用
export function adminRequired(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ code: 403, data: null, message: '无权限，仅管理员可访问' })
  }
  next()
}
