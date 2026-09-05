// 轮播图表数据访问层（SQL 封装）
import db from './db.js'

export const bannerModel = {
  // 前台按 sort_order 升序展示
  findAll: () => db.prepare('SELECT * FROM banners ORDER BY sort_order, id').all(),

  findById: (id) => db.prepare('SELECT * FROM banners WHERE id = ?').get(id),

  create: ({ image_url, link_url = '', sort_order = 0 }) =>
    db.prepare('INSERT INTO banners (image_url, link_url, sort_order) VALUES (?, ?, ?)')
      .run(image_url, link_url, sort_order),

  update: (id, { image_url, link_url = '', sort_order = 0 }) =>
    db.prepare('UPDATE banners SET image_url = ?, link_url = ?, sort_order = ? WHERE id = ?')
      .run(image_url, link_url, sort_order, id),

  remove: (id) => db.prepare('DELETE FROM banners WHERE id = ?').run(id)
}
