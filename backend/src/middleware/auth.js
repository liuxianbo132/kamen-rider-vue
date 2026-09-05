// 认证与权限中间件
import jwt from 'jsonwebtoken'

// JWT 密钥：与 authController 保持一致（优先 .env，缺省用默认值）
const JWT_SECRET = process.env.JWT_SECRET || 'kamen-rider-mall-dev-secret'

// 登录认证：从请求头 Authorization: Bearer <token> 中解析 JWT
export function authRequired(req, res, next) {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''
  if (!token) {
    return res.status(401).json({ code: 401, data: null, message: '未登录或缺少 token' })
  }
  try {
    // 校验通过后将用户信息挂载到 req.user，供后续控制器使用
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ code: 401, data: null, message: 'token 无效或已过期，请重新登录' })
  }
}

// 管理员权限：需在 authRequired 之后使用
export function adminRequired(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ code: 403, data: null, message: '无权限，仅管理员可访问' })
  }
  next()
}
