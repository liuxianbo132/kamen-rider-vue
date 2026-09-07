// 站内文章表数据访问层（SQL 封装）
import db from './db.js'

// 栏目白名单（与前端 src/constants/posts.js 保持一致）
export const CATEGORIES = ['review', 'lore', 'collection', 'guide']

export const postModel = {
  // 公开列表：仅已发布，支持栏目 / 标签 / 关键词 / 推荐位筛选与分页
  findPublished({ category, tag, keyword, page = 1, pageSize = 10, featured } = {}) {
    const where = ["status = 'published'"]
    const params = []

    if (category) {
      where.push('category = ?')
      params.push(category)
    }
    if (tag) {
      // tags 为 JSON 数组文本，按数组元素精确匹配（带引号，避免部分命中）
      where.push('tags LIKE ?')
      params.push(`%"${tag}"%`)
    }
    if (keyword) {
      where.push('(title LIKE ? OR summary LIKE ?)')
      params.push(`%${keyword}%`, `%${keyword}%`)
    }
    if (featured) {
      where.push('featured_level >= 1')
    }

    const whereSQL = `WHERE ${where.join(' AND ')}`
    const total = db.prepare(`SELECT COUNT(*) AS c FROM posts ${whereSQL}`).get(...params).c

    const limit = Math.min(Math.max(1, Number(pageSize) || 10), 100)
    const pageNum = Math.max(1, Number(page) || 1)
    // 推荐位查询主推在前；普通列表按发布时间倒序
    const orderSQL = featured
      ? 'ORDER BY featured_level DESC, published_at DESC, id DESC'
      : 'ORDER BY published_at DESC, id DESC'
    const list = db.prepare(
      `SELECT * FROM posts ${whereSQL} ${orderSQL} LIMIT ? OFFSET ?`
    ).all(...params, limit, (pageNum - 1) * limit)

    return { list, total, page: pageNum, pageSize: limit }
  },

  // 按 slug 查询已发布文章（详情页）
  findBySlug: (slug) =>
    db.prepare("SELECT * FROM posts WHERE slug = ? AND status = 'published'").get(slug),

  // 管理端列表：全部文章（含草稿），支持状态 / 栏目 / 关键词筛选
  findAllAdmin({ status, category, keyword, page = 1, pageSize = 50 } = {}) {
    const where = []
    const params = []
    if (status) {
      where.push('status = ?')
      params.push(status)
    }
    if (category) {
      where.push('category = ?')
      params.push(category)
    }
    if (keyword) {
      where.push('(title LIKE ? OR summary LIKE ?)')
      params.push(`%${keyword}%`, `%${keyword}%`)
    }
    const whereSQL = where.length ? `WHERE ${where.join(' AND ')}` : ''
    const total = db.prepare(`SELECT COUNT(*) AS c FROM posts ${whereSQL}`).get(...params).c

    const limit = Math.min(Math.max(1, Number(pageSize) || 50), 200)
    const pageNum = Math.max(1, Number(page) || 1)
    const list = db.prepare(
      `SELECT * FROM posts ${whereSQL} ORDER BY updated_at DESC, id DESC LIMIT ? OFFSET ?`
    ).all(...params, limit, (pageNum - 1) * limit)

    return { list, total, page: pageNum, pageSize: limit }
  },

  findById: (id) => db.prepare('SELECT * FROM posts WHERE id = ?').get(id),

  // slug 是否已被占用（excludeId 用于编辑时排除自身）
  slugExists: (slug, excludeId = 0) =>
    db.prepare('SELECT COUNT(*) AS c FROM posts WHERE slug = ? AND id != ?').get(slug, excludeId).c > 0,

  create: (p) =>
    db.prepare(`
      INSERT INTO posts (slug, title, summary, cover_image, category, tags, content, status, featured_level, published_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(p.slug, p.title, p.summary, p.cover_image, p.category, p.tags, p.content, p.status, p.featured_level, p.published_at),

  update: (id, p) =>
    db.prepare(`
      UPDATE posts
      SET slug = ?, title = ?, summary = ?, cover_image = ?, category = ?, tags = ?, content = ?, status = ?, featured_level = ?, published_at = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(p.slug, p.title, p.summary, p.cover_image, p.category, p.tags, p.content, p.status, p.featured_level, p.published_at, id),

  remove: (id) => db.prepare('DELETE FROM posts WHERE id = ?').run(id)
}
