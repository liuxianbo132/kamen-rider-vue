// 轮播图控制器：增删改查
import { bannerModel } from '../models/bannerModel.js'
import { ok, fail } from '../utils/respond.js'

// 轮播图列表（登录即可访问，前台首页展示）
export function list(req, res) {
  ok(res, bannerModel.findAll())
}

// 新增轮播图（仅管理员）
export function create(req, res) {
  const { image_url } = req.body || {}
  if (!image_url) return fail(res, 400, '图片链接不能为空')
  const { link_url, sort_order } = req.body
  const info = bannerModel.create({ image_url, link_url, sort_order: Number(sort_order) || 0 })
  ok(res, bannerModel.findById(info.lastInsertRowid), '新增成功')
}

// 编辑轮播图（仅管理员）
export function update(req, res) {
  const id = Number(req.params.id)
  if (!bannerModel.findById(id)) return fail(res, 404, '轮播图不存在')
  const { image_url } = req.body || {}
  if (!image_url) return fail(res, 400, '图片链接不能为空')
  const { link_url, sort_order } = req.body
  bannerModel.update(id, { image_url, link_url, sort_order: Number(sort_order) || 0 })
  ok(res, bannerModel.findById(id), '更新成功')
}

// 删除轮播图（仅管理员）
export function remove(req, res) {
  const id = Number(req.params.id)
  if (!bannerModel.findById(id)) return fail(res, 404, '轮播图不存在')
  bannerModel.remove(id)
  ok(res, null, '删除成功')
}
