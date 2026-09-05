// 认证控制器：注册 / 登录 / 获取当前用户
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { userModel } from '../models/userModel.js'
import { ok, fail } from '../utils/respond.js'

// JWT 密钥：优先读 .env 配置，未配置时使用默认值（保证克隆后开箱可跑）
const JWT_SECRET = process.env.JWT_SECRET || 'kamen-rider-mall-dev-secret'

// 用户注册
export function register(req, res) {
  const { username, password } = req.body || {}
  if (!username || !password) return fail(res, 400, '用户名和密码不能为空')
  if (String(username).length > 50) return fail(res, 400, '用户名长度不能超过 50 个字符')
  if (String(password).length < 6) return fail(res, 400, '密码长度不能少于 6 位')

  // 后端校验用户名唯一性
  if (userModel.findByUsername(username)) return fail(res, 409, '用户名已存在，请更换')

  // bcrypt 加密密码后入库
  const hash = bcrypt.hashSync(String(password), 10)
  userModel.create(username, hash)
  ok(res, null, '注册成功')
}

// 用户登录：校验通过后签发 JWT
export function login(req, res) {
  const { username, password } = req.body || {}
  if (!username || !password) return fail(res, 400, '用户名和密码不能为空')

  const user = userModel.findByUsername(username)
  // 统一提示，避免暴露"用户不存在"这类信息
  if (!user || !bcrypt.compareSync(String(password), user.password)) {
    return fail(res, 401, '用户名或密码错误')
  }

  // 签发 7 天有效期的 token
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
  ok(res, { token, id: user.id, username: user.username, role: user.role }, '登录成功')
}

// 获取当前登录用户信息
export function me(req, res) {
  const user = userModel.findById(req.user.id)
  if (!user) return fail(res, 404, '用户不存在')
  ok(res, user)
}
