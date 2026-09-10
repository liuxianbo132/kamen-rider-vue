// 用户表数据访问层（SQL 封装）
import db from './db.js'

export const userModel = {
  // 按用户名查询（含密码，仅用于登录校验）
  findByUsername: (username) =>
    db.prepare('SELECT * FROM users WHERE username = ?').get(username),

  // 按 ID 查询（不返回密码）
  findById: (id) =>
    db.prepare('SELECT id, username, role, created_at FROM users WHERE id = ?').get(id),

  // 查询全部用户（不返回密码）
  findAll: () =>
    db.prepare('SELECT id, username, role, created_at FROM users ORDER BY id').all(),

  // 新增用户（密码为 bcrypt 加密后的密文）
  create: (username, password) =>
    db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)')
      .run(username, password, 'user'),

  // 修改用户角色
  updateRole: (id, role) =>
    db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, id),

  // 修改密码：同时自增 token_version，使该用户已签发的旧 token 立即失效
  updatePassword: (id, password) =>
    db.prepare('UPDATE users SET password = ?, token_version = token_version + 1 WHERE id = ?')
      .run(password, id),

  // 查询 token 版本（用于校验旧 token 是否已因改密失效）
  getTokenVersion: (id) =>
    db.prepare('SELECT token_version FROM users WHERE id = ?').get(id),

  // 删除用户
  remove: (id) =>
    db.prepare('DELETE FROM users WHERE id = ?').run(id)
}
