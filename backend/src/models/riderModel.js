// 图鉴骑士表数据访问层
import db from './db.js'

const COLS = `member_id, name, name_origin, name_en, series, series_ja, era, year,
  height, weight, punch, kick, jump, run,
  transform_user, transform_belongings, first_appear, intro, image, image_source`

export const riderModel = {
  // 列表：按年代、年份、官方 member_id 稳定排序
  findAll: () =>
    db
      .prepare(
        "SELECT * FROM riders ORDER BY CASE era WHEN 'showa' THEN 0 WHEN 'heisei' THEN 1 WHEN 'reiwa' THEN 2 END, year ASC, member_id ASC"
      )
      .all(),

  findById: (id) => db.prepare('SELECT * FROM riders WHERE id = ?').get(id),
  findByMemberId: (memberId) => db.prepare('SELECT * FROM riders WHERE member_id = ?').get(memberId),

  // 创建（管理员）
  create: (r) =>
    db
      .prepare(`INSERT INTO riders (${COLS}) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
      .run(
        r.member_id, r.name, r.name_origin || '', r.name_en || '',
        r.series || '', r.series_ja || '', r.era, r.year,
        r.height || '', r.weight || '', r.punch || '', r.kick || '', r.jump || '', r.run || '',
        r.transform_user || '', r.transform_belongings || '', r.first_appear || '',
        r.intro || '', r.image || '', r.image_source || ''
      ),

  // 更新（管理员）
  update: (id, r) =>
    db
      .prepare(`UPDATE riders SET member_id=?, name=?, name_origin=?, name_en=?, series=?, series_ja=?, era=?, year=?, height=?, weight=?, punch=?, kick=?, jump=?, run=?, transform_user=?, transform_belongings=?, first_appear=?, intro=?, image=?, image_source=? WHERE id=?`)
      .run(
        r.member_id, r.name, r.name_origin || '', r.name_en || '',
        r.series || '', r.series_ja || '', r.era, r.year,
        r.height || '', r.weight || '', r.punch || '', r.kick || '', r.jump || '', r.run || '',
        r.transform_user || '', r.transform_belongings || '', r.first_appear || '',
        r.intro || '', r.image || '', r.image_source || '',
        id
      ),

  // 删除（管理员）
  remove: (id) => db.prepare('DELETE FROM riders WHERE id = ?').run(id)
}