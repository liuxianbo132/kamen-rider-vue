// 商品表数据访问层（SQL 封装）
import db from './db.js'

export const goodsModel = {
  findAll: () => db.prepare('SELECT * FROM goods ORDER BY id').all(),

  findById: (id) => db.prepare('SELECT * FROM goods WHERE id = ?').get(id),

  create: ({ name, price, stock = 0, category = '', image_url = '', description = '' }) =>
    db.prepare(
      'INSERT INTO goods (name, price, stock, category, image_url, description) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(name, price, stock, category, image_url, description),

  update: (id, { name, price, stock = 0, category = '', image_url = '', description = '' }) =>
    db.prepare(
      'UPDATE goods SET name = ?, price = ?, stock = ?, category = ?, image_url = ?, description = ? WHERE id = ?'
    ).run(name, price, stock, category, image_url, description, id),

  remove: (id) => db.prepare('DELETE FROM goods WHERE id = ?').run(id)
}
