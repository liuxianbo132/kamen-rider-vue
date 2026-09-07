// 新闻表数据访问层（SQL 封装），结构同 bannerModel
import db from './db.js'

export const newsModel = {
  // 列表按时间倒序：优先标准 date 字段（新格式 YYYY-MM-DD HH:mm 字典序即时间序），
  // 旧数据（MM-DD HH:mm）同格式内字符串倒序仍成立；无 date 的记录沉底按插入顺序
  findAll: () =>
    db.prepare(
      "SELECT * FROM news ORDER BY CASE WHEN date IS NULL OR date = '' THEN 0 ELSE 1 END DESC, date DESC, id DESC"
    ).all(),

  findById: (id) => db.prepare('SELECT * FROM news WHERE id = ?').get(id),

  create: ({ title, source = '', editor = '', date = '', url = '', content = '[]' }) =>
    db.prepare('INSERT INTO news (title, source, editor, date, url, content) VALUES (?, ?, ?, ?, ?, ?)')
      .run(title, source, editor, date, url, content),

  update: (id, { title, source = '', editor = '', date = '', url = '', content = '[]' }) =>
    db.prepare('UPDATE news SET title = ?, source = ?, editor = ?, date = ?, url = ?, content = ? WHERE id = ?')
      .run(title, source, editor, date, url, content, id),

  remove: (id) => db.prepare('DELETE FROM news WHERE id = ?').run(id)
}