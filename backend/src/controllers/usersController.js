// 用户管理控制器（仅管理员）
import { userModel } from '../models/userModel.js'
import { ok, fail } from '../utils/respond.js'

// 用户列表
export function list(req, res) {
  ok(res, userModel.findAll())
}

// 修改用户角色（user / admin）
export function updateRole(req, res) {
  const id = Number(req.params.id)
  const { role } = req.body || {}
  if (!['user', 'admin'].includes(role)) return fail(res, 400, "角色取值只能是 'user' 或 'admin'")
  if (!userModel.findById(id)) return fail(res, 404, '用户不存在')

  // 保护：不能修改自己的角色，避免唯一管理员将自己降级后失去后台权限
  if (id === req.user.id) return fail(res, 400, '不能修改自己的角色')

  userModel.updateRole(id, role)
  ok(res, userModel.findById(id), '角色修改成功')
}

// 删除用户
export function remove(req, res) {
  const id = Number(req.params.id)
  if (!userModel.findById(id)) return fail(res, 404, '用户不存在')

  // 保护：不能删除当前登录的自己
  if (id === req.user.id) return fail(res, 400, '不能删除当前登录的账号')

  userModel.remove(id)
  ok(res, null, '删除成功')
}
