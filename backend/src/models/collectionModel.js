// 收藏条目表数据访问层（SQL 封装）
import db from './db.js'

// 类型白名单（与前端 src/constants/collections.js 保持一致）
export const TYPES = ['belt', 'figure', 'place', 'event']
export const STATUSES = ['owned', 'wishlist', 'archived']

export const collectionModel = {
  // 公开列表：默认排除 archived（归档不对外展示），支持类型 / 状态 / 标签 / 精选筛选与分页
  findPublic({ type, status, tag, keyword, featured, page = 1, pageSize = 12 } = {}) {
    const where = []
    const params = []

    if (type) {
      where.push('type = ?')
      params.push(type)
    }
    if (status) {
      where.push('status = ?')
      params.push(status)
    } else {
      where.push("status != 'archived'")
    }
    if (tag) {
      where.push('tags LIKE ?')
      params.push(`%"${tag}"%`)
    }
    if (keyword) {
      where.push('(title LIKE ? OR series LIKE ?)')
      params.push(`%${keyword}%`, `%${keyword}%`)
    }
    if (featured) {
      where.push('is_featured = 1')
    }

    const whereSQL = `WHERE ${where.join(' AND ')}`
    const total = db.prepare(`SELECT COUNT(*) AS c FROM collections ${whereSQL}`).get(...params).c

    const limit = Math.min(Math.max(1, Number(pageSize) || 12), 100)
    const pageNum = Math.max(1, Number(page) || 1)
    // 精选在前，其余按收录时间倒序
    const list = db.prepare(
      `SELECT * FROM collections ${whereSQL} ORDER BY is_featured DESC, acquired_at DESC, id DESC LIMIT ? OFFSET ?`
    ).all(...params, limit, (pageNum - 1) * limit)

    return { list, total, page: pageNum, pageSize: limit }
  },

  // 按 id 查询公开可见条目（归档不展示）
  findPublicById: (id) =>
    db.prepare("SELECT * FROM collections WHERE id = ? AND status != 'archived'").get(id),

  // 管理端列表：全部条目，支持类型 / 状态 / 关键词筛选
  findAllAdmin({ type, status, keyword, page = 1, pageSize = 50 } = {}) {
    const where = []
    const params = []
    if (type) {
      where.push('type = ?')
      params.push(type)
    }
    if (status) {
      where.push('status = ?')
      params.push(status)
    }
    if (keyword) {
      where.push('(title LIKE ? OR series LIKE ?)')
      params.push(`%${keyword}%`, `%${keyword}%`)
    }
    const whereSQL = where.length ? `WHERE ${where.join(' AND ')}` : ''
    const total = db.prepare(`SELECT COUNT(*) AS c FROM collections ${whereSQL}`).get(...params).c

    const limit = Math.min(Math.max(1, Number(pageSize) || 50), 200)
    const pageNum = Math.max(1, Number(page) || 1)
    const list = db.prepare(
      `SELECT * FROM collections ${whereSQL} ORDER BY updated_at DESC, id DESC LIMIT ? OFFSET ?`
    ).all(...params, limit, (pageNum - 1) * limit)

    return { list, total, page: pageNum, pageSize: limit }
  },

  findById: (id) => db.prepare('SELECT * FROM collections WHERE id = ?').get(id),

  create: (c) =>
    db.prepare(`
      INSERT INTO collections (title, cover_image, type, series, acquired_at, status, notes, tags, is_featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(c.title, c.cover_image, c.type, c.series, c.acquired_at, c.status, c.notes, c.tags, c.is_featured),

  update: (id, c) =>
    db.prepare(`
      UPDATE collections
      SET title = ?, cover_image = ?, type = ?, series = ?, acquired_at = ?, status = ?, notes = ?, tags = ?, is_featured = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(c.title, c.cover_image, c.type, c.series, c.acquired_at, c.status, c.notes, c.tags, c.is_featured, id),

  remove: (id) => db.prepare('DELETE FROM collections WHERE id = ?').run(id)
}
